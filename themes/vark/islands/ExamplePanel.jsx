import { forwardRef, useMemo, useState } from 'react';
import { Box, Group, Tabs, Text } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownLeft } from '@tabler/icons-react';
import CodeActions from '@aardvark/islands/code-actions';
import { highlightHtml, codeDownloadFilenames } from '@aardvark/islands/highlight';
import './ExamplePanel.css';

// The island behind the built-in {% requestExample %} / {% responseExample %} tags
// (both built-in block components). A titled panel — meant to sit pinned in a page's right-hand
// column beside API prose — that shows one or more fenced code blocks with per-block Copy +
// Download and syntax highlighting. Both tags render THIS island; the `kind` prop ("request" |
// "response") only picks the default heading, icon, and accent color.
//
// Each block arrives pre-parsed from the Python side as { code, lang?, title?, codeHtml? }:
//   - `code`     the raw block text (what Copy/Download act on, and the highlight fallback).
//   - `lang`     the fence language token (drives the `language-<lang>` class + the download ext).
//   - `title`    an optional per-block heading (from a `title="…"` fence decorator) — also the tab
//                label when there are several blocks.
//   - `codeHtml` build-time Pygments token-span markup (present when highlighting is on and a lexer
//                matched), rendered via dangerouslySetInnerHTML so the code colors exactly like a
//                ``` fence — themed by the site's syntax palette (from the theme), the same
//                markup {% file %}'s modal and ApiReference's samples use. When it's absent we
//                highlight client-side with the shared @aardvark/islands/highlight lexer,
//                falling back to plain text for an unknown language — so a block is never left
//                uncolored just because the build-time pass skipped it.

// `request` points up-and-out (a call leaving the client); `response` points down-and-in (a payload
// coming back). `kind` is a fixed vocabulary from the Python side, so an unknown value falls back to
// the request styling rather than erroring.
const KINDS = {
  __proto__: null, // null-proto lookup table (defense-in-depth; `kind` is a fixed request/response vocab dropped from author attrs)
  request: { defaultTitle: 'Request', Icon: IconArrowUpRight },
  response: { defaultTitle: 'Response', Icon: IconArrowDownLeft },
};

// One block's <pre><code>. Prefer the build-time `codeHtml` (Pygments spans); otherwise highlight
// client-side. Rendered as a real <pre><code class="language-…"> — not Mantine's <Code> — so it
// sits inside the .aardvark-content pre/code styling and the build-time syntax palette scope, exactly
// like ApiReference's Highlighted. code-blocks.js skips island-owned DOM, so the CodeActions here are
// the only Copy/Download buttons on the block.
function ExampleCode({ block, filename }) {
  const { code = '', lang, codeHtml } = block;
  // useMemo so a re-render (e.g. tab switch) doesn't re-tokenize an unchanged block. Only runs when
  // there's no build-time markup to prefer.
  const clientHtml = useMemo(
    () => (codeHtml == null ? highlightHtml(code, lang) : null),
    [code, lang, codeHtml],
  );
  const html = codeHtml != null ? codeHtml : clientHtml;
  return (
    <div className="aardvark-code-block aardvark-example-code">
      <CodeActions text={code} filename={filename} />
      <pre>
        <code
          className={lang ? `language-${lang}` : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}

// forwardRef so `attr={...}` (e.g. an onclick or a data- attribute from the tag) reaches the panel's
// root DOM node — the islands runtime applies attr to the element the ref lands on. Mantine's Box
// forwards its ref to the underlying <div>.
const ExamplePanel = forwardRef(function ExamplePanel(
  { kind = 'request', title, blocks = [], uid, ...rest },
  ref,
) {
  const meta = KINDS[kind] || KINDS.request;
  const Icon = meta.Icon;
  const heading = title || meta.defaultTitle;
  // A tab needs a stable, unique key/value; derive one per block that survives re-renders. The
  // initial (lazy) state is fine because `blocks` is a fixed build-time prop — it never changes for
  // a mounted panel.
  const [active, setActive] = useState('0');

  const list = Array.isArray(blocks) ? blocks : [];
  const multi = list.length > 1;
  const filenames = codeDownloadFilenames(
    list.map((block, i) => ({
      title: block.title,
      lang: block.lang,
      index: multi ? i : undefined,
      uid,
    })),
  );

  // The tab label prefers the block's own title=, then its language, then a generic "Example N" so
  // an untitled, unlabelled block still gets a distinct, clickable tab.
  const labelFor = (block, i) => block.title || block.lang || `Example ${i + 1}`;

  return (
    <Box
      ref={ref}
      // Spread author props FIRST so the island's own structural/state props below always win — a
      // stray author attr (className / data-kind / data-empty) must never clobber the scoped class
      // the CSS keys off or the data-kind that drives the accent. Mirrors Card.jsx / Tree.jsx.
      {...rest}
      className="aardvark-example-panel"
      data-kind={kind}
      data-empty={list.length === 0 ? '' : undefined}
    >
      <Group className="aardvark-example-head" gap={8} wrap="nowrap">
        <Icon size={16} className="aardvark-example-icon" aria-hidden="true" />
        <Text component="span" className="aardvark-example-title" fw={600} size="sm">
          {heading}
        </Text>
      </Group>
      {multi ? (
        <Tabs
          value={active}
          onChange={(v) => setActive(v ?? '0')}
          className="aardvark-example-tabs"
          keepMounted={false}
        >
          <Tabs.List>
            {list.map((block, i) => (
              <Tabs.Tab key={i} value={String(i)}>
                {labelFor(block, i)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {list.map((block, i) => (
            <Tabs.Panel key={i} value={String(i)}>
              <ExampleCode block={block} filename={filenames[i]} />
            </Tabs.Panel>
          ))}
        </Tabs>
      ) : list.length === 1 ? (
        <>
          {/* A single block may still carry its own title= — show it as a sub-heading above the
              code so the label isn't lost when there's no tab strip to host it. */}
          {list[0].title ? (
            <Text component="div" className="aardvark-example-subtitle" size="xs" c="dimmed">
              {list[0].title}
            </Text>
          ) : null}
          <ExampleCode block={list[0]} filename={filenames[0]} />
        </>
      ) : (
        // Empty panel: the Python side already emitted a build warning. Render a quiet placeholder
        // rather than a bare titled box so the gap reads as intentional in a preview.
        <Text component="div" className="aardvark-example-empty" size="sm" c="dimmed">
          No example provided.
        </Text>
      )}
    </Box>
  );
});

export default ExamplePanel;
