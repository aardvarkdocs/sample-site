import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import CodeActions, { HighlightedPre } from '@aardvark/islands/code-actions';
import { codeDownloadFilenames } from '@aardvark/islands/highlight';
import Tabs from './Tabs';
import TabsTab from './TabsTab';
import './CodeGroup.css';

// The island behind the built-in {% codeGroup %} block component.
// It shows a set of fenced code blocks as language/file tabs, each with its own Copy button —
// Mintlify's "Code groups". Each tab descriptor is built server-side from one ```lang fence:
//
//   { code, lang?, title?, codeHtml? }
//
// `code` is the raw source (for Copy + the download filename); `lang` is the fence language;
// `title` is an explicit title="…" fence label (a filename, typically); `codeHtml` is the
// build-time Pygments token-span markup (present when highlighting is on and a lexer matched),
// rendered via dangerouslySetInnerHTML so the tab colors exactly like a ``` fence.
//
// BUILT ON THE SHARED TABS ISLAND: rather than driving Mantine <Tabs> directly, this renders the
// Aardvark <Tabs> wrapper (Tabs.jsx) with one <TabsTab> carrier per fence, so a code group gets the
// SAME tab chrome as {% tabs %}: the `variant` prop (default `pills` here, but `default`/`outline`
// give the sliding underline), the animated indicator, and the panel crossfade — one implementation,
// not a fork. Only the panel body differs: a code block with the shared CodeActions (Copy/Download).
//
// LANGUAGE SYNC (Mintlify parity): the chosen language — a visible tab LABEL — is shared by every
// code group on the page. (1) On FIRST load the first group to hydrate without a saved choice
// establishes it (its `defaultValue` if set, else its first tab), so all groups OPEN on the same
// language rather than each on its own first tab. (2) Clicking a language tab switches every other
// group with a matching tab instantly (an in-memory subscriber set shared by all instances of this
// module). (3) That choice persists site-wide (localStorage) so the next page load opens it by
// default. See the store below.
//
// SSR note: the build prerenders the island and the client HYDRATES that baked markup in
// place, so the FIRST client render must match the server's. It does: the initial tab comes from
// useState(resolvedDefault), derived purely from props (no window/localStorage/shared state) —
// identical on both sides. The saved/shared language is applied in a layout effect AFTER mount
// (effects don't run during the prerender), so it can never cause a hydration mismatch; it just
// switches the tab once hydrated, before the first paint.

// language token -> pretty tab label, mirroring themes/vark/code-blocks.js's LANG_LABEL so a
// {% codeGroup %} tab reads the same as the language pill on a normal on-page code block. An
// unmapped language falls back to its uppercased token; a fence with no language is "Text".
const LANG_LABEL = {
  __proto__: null, // null-proto: an author-controlled fence language can't resolve to an inherited Object.prototype member
  python: 'Python', py: 'Python', javascript: 'JavaScript', js: 'JavaScript', jsx: 'JSX',
  typescript: 'TypeScript', ts: 'TypeScript', tsx: 'TSX', json: 'JSON', yaml: 'YAML', yml: 'YAML',
  bash: 'Bash', sh: 'Shell', shell: 'Shell', console: 'Shell', zsh: 'Shell', html: 'HTML',
  css: 'CSS', scss: 'SCSS', sql: 'SQL', go: 'Go', rust: 'Rust', rs: 'Rust', java: 'Java',
  c: 'C', cpp: 'C++', 'c++': 'C++', csharp: 'C#', cs: 'C#', 'c#': 'C#', ruby: 'Ruby', rb: 'Ruby',
  php: 'PHP', kotlin: 'Kotlin', swift: 'Swift', toml: 'TOML', xml: 'XML', md: 'Markdown',
  markdown: 'Markdown', diff: 'Diff', dockerfile: 'Dockerfile', text: 'Text', plaintext: 'Text',
};

// Download names come from the shared codeDownloadFilenames() in @aardvark/islands/highlight, so CodeGroup and
// ExamplePanel agree on real filenames, language extensions, and sibling collision handling.

function labelFor(tab) {
  // An explicit title="…" wins (a filename); else the pretty language name; else "Text" for a
  // language-less fence so the tab still reads. Trim the title so a stray `title="app.js "` doesn't
  // show trailing whitespace on the tab (and, below, in its download name).
  const title = tab.title ? tab.title.trim() : '';
  if (title) return title;
  if (tab.lang) return LANG_LABEL[tab.lang.toLowerCase()] || tab.lang.toUpperCase();
  return 'Text';
}

// --- shared code-language preference: cross-group sync + persistence -------------------------------
// The chosen language (its visible tab LABEL) is stored site-wide in localStorage so every code group
// opens it on the next page load, and broadcast to an in-memory subscriber set so every OTHER group
// on THIS page switches to it instantly. Both are module-level, shared by every CodeGroup instance
// (the islands bundle imports this module once). A `storage` event mirrors the choice across other
// browser tabs too. All localStorage access is guarded — it's absent during SSR and can throw in
// private-mode / storage-disabled browsers; sync still works in-memory when it does.
const STORAGE_KEY = 'aardvark-code-lang';
const subscribers = new Set(); // of { id, fn(label) }
let idSeq = 0;
const nextSubscriberId = () => (idSeq += 1);

function readStoredLang() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  } catch {
    return null;
  }
}

// Record `label` and notify every subscriber EXCEPT the one that set it (its own tab is already on
// that language — re-applying could bounce a group that has two tabs sharing a label).
function setPreferredLang(label, sourceId) {
  if (!label) return;
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, label);
  } catch {
    /* storage unavailable — same-page sync below still works */
  }
  subscribers.forEach((sub) => {
    if (sub.id !== sourceId) sub.fn(label);
  });
}

function subscribeLang(id, fn) {
  const sub = { id, fn };
  subscribers.add(sub);
  // Cross-tab: a write in ANOTHER browser tab fires `storage` here (never in the writing tab), so
  // mirror it to the same handler. Same-page writes reach `fn` via setPreferredLang above.
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) fn(e.newValue);
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  return () => {
    subscribers.delete(sub);
    // When the last code group leaves the page (a client-side navigation, or a test tearing down its
    // render), forget the in-memory page default so a fresh page/render establishes its own rather
    // than inheriting a stale one. A normal static-site navigation reloads the module anyway.
    if (subscribers.size === 0) sessionLang = null;
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

// The page's shared INITIAL code language (a tab LABEL), established by the first code group that
// hydrates without a saved preference so every group opens on the SAME language from the first
// paint. In-memory and page-scoped: a static-site navigation reloads this module, so it never bleeds
// across pages. localStorage still wins over it (a returning reader's saved choice), and a later
// click still persists + broadcasts.
let sessionLang = null;

// The saved/shared language must switch the tab BEFORE the browser paints, or the reader sees a flash
// of the pre-sync tab. useLayoutEffect does that on the client; the server prerender (renderToString)
// has no layout phase, so fall back to useEffect there to avoid React's "useLayoutEffect does nothing
// on the server" warning. Effects don't run during the prerender, so this never affects hydration.
const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

const CodeGroup = forwardRef(function CodeGroup(
  {
    tabs = [],
    defaultValue,
    className,
    uid,
    // `variant` flows through like {% tabs %} (default `pills` is the code-group look;
    // `default`/`outline` give the sliding underline). `radius` rides through via ...rest.
    variant = 'pills',
    // Pull the island's own controlled-tab wiring OUT of ...rest so an author attr can't clobber the
    // value/onChange that drive switching + language sync, nor force keepMounted (only the active code
    // panel is in flow — the download-filename model assumes one visible block).
    value: _ignoredValue,
    onChange: _ignoredOnChange,
    keepMounted: _ignoredKeepMounted,
    ...rest
  },
  ref,
) {
  // Stable per-tab values. The label alone can collide (two `curl` shell tabs, two files with the
  // same basename), which would break the tabs (they key panels by value); disambiguate with a
  // trailing index so every tab is uniquely addressable. Memoized on the (stable) props so the sync
  // callbacks below can stay referentially stable and the subscription is set up once.
  const items = useMemo(() => {
    const filenames = codeDownloadFilenames(
      tabs.map((tab, i) => ({ title: tab.title, lang: tab.lang, index: i, uid })),
    );
    return tabs.map((tab, i) => ({
      ...tab,
      value: `tab-${i}`,
      label: labelFor(tab),
      filename: filenames[i],
    }));
  }, [tabs, uid]);

  // value <-> label maps for language sync. valueByLabel picks the FIRST tab for a label, so a group
  // that happens to have two tabs of the same language lands on a deterministic one.
  const labelByValue = useMemo(() => new Map(items.map((it) => [it.value, it.label])), [items]);
  const valueByLabel = useMemo(() => {
    const m = new Map();
    for (const it of items) if (!m.has(it.label)) m.set(it.label, it.value);
    return m;
  }, [items]);

  const firstValue = items.length ? items[0].value : null;
  // `defaultValue` may name a tab by its label (author-facing) — resolve it to the internal value.
  // An unmatched/absent defaultValue falls back to the first tab. This is the SSR-baked initial tab.
  const resolvedDefault =
    (defaultValue != null && items.find((it) => it.label === defaultValue)?.value) || firstValue;
  const [current, setCurrent] = useState(resolvedDefault);

  // Latest active value in a ref so applyPreferred (a stable callback) can read it without re-closing.
  const currentRef = useRef(current);
  currentRef.current = current;

  // Switch to `label` iff this group has a tab for it AND isn't already showing it. The
  // "already showing" guard makes a same-label group a no-op rather than bouncing between its two
  // matching tabs, and keeps a group without that language on whatever it's showing.
  const applyPreferred = useCallback(
    (label) => {
      if (label == null) return;
      if (labelByValue.get(currentRef.current) === label) return; // already on this language
      const val = valueByLabel.get(label);
      if (val !== undefined) setCurrent(val);
    },
    [labelByValue, valueByLabel],
  );

  // Stable per-instance id so our own broadcast doesn't echo back to us. Assigned in the effect
  // (client-only) — it's used only for pub/sub, never rendered, so it needs no SSR value.
  const idRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    if (idRef.current == null) idRef.current = nextSubscriberId();
    const stored = readStoredLang();
    if (stored != null) {
      applyPreferred(stored); // a saved cross-visit choice wins over any page default
    } else if (sessionLang != null) {
      applyPreferred(sessionLang); // a group earlier on the page already set the shared language
    } else {
      // First code group on the page with no saved preference: its current tab becomes the language
      // every other group opens on, so the page is in sync from the first paint. (Its `defaultValue`,
      // if any, therefore seeds the whole page.) A group lacking that language keeps its own first tab.
      sessionLang = labelByValue.get(currentRef.current) ?? null;
    }
    return subscribeLang(idRef.current, applyPreferred); // live same-page + cross-tab sync
  }, [applyPreferred, labelByValue]);

  const handleChange = useCallback(
    (next) => {
      setCurrent(next);
      const label = labelByValue.get(next);
      if (label) {
        sessionLang = label; // keep the in-memory page default current for any group mounting later
        setPreferredLang(label, idRef.current); // persist + broadcast to the other groups
      }
    },
    [labelByValue],
  );

  if (!items.length) return null; // nothing to show (the block component already warned)

  return (
    <Tabs
      ref={ref}
      value={current}
      onChange={handleChange}
      variant={variant}
      radius="sm"
      keepMounted={false}
      className={className ? `aardvark-code-group ${className}` : 'aardvark-code-group'}
      {...rest}
    >
      {items.map((it) => (
        <TabsTab key={it.value} value={it.value} label={it.label}>
          <div className="aardvark-code-block">
            {/* Copy + Download, shared with the on-page code blocks and the OpenAPI samples
                (see @aardvark/islands/code-actions). Both act on the raw `code`, never the highlighted markup. */}
            <CodeActions text={it.code} filename={it.filename} />
            <HighlightedPre code={it.code} codeHtml={it.codeHtml} lang={it.lang} />
          </div>
        </TabsTab>
      ))}
    </Tabs>
  );
});

export default CodeGroup;
