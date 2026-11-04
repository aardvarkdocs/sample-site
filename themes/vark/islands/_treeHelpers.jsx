// Pure helpers shared by the file-browser builtins: the {% tree %} islands
// (TreeFolder + TreeFile) and the {% gitfolder %} island (GitFolder).
// aardvark stages the theme's islands folder whole, so a single `_`-prefixed module is
// imported by all of them. The `_` prefix keeps it out of the component registry — it's a
// helper, not an author-facing island. The `.jsx` suffix permits the TreeRowLabel JSX below;
// staging takes plain JS helpers too. Everything here is SSR-safe: no `window`/`document` at
// module or call scope. TreeRowLabel below is a JSX literal, which is equally SSR-safe — the
// rule is the DOM globals, not the JSX.

import { Anchor, Text } from '@mantine/core';
import {
  IconBrandCss3,
  IconBrandGolang,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandPython,
  IconBrandRust,
  IconBrandTypescript,
  IconFile,
  IconFileCode,
  IconJson,
  IconMarkdown,
} from '@tabler/icons-react';

// Auto-prefix a folder/file comment with "#" unless the author already did.
export function normalizeComment(c) {
  const s = String(c).trim();
  return s.startsWith('#') ? s : `# ${s}`;
}

// The shared label half of a {% tree %} row, rendered by both TreeFolder and TreeFile so the two
// row kinds cannot drift: the theme CSS keys on .aardvark-tree-label/.aardvark-tree-comment, and
// handleTreeKeydown navigates a linked row by clicking the `a[href]` it finds inside it.
// stopPropagation keeps a click on the link from ALSO firing the row's own handler (which would
// toggle the folder, or re-fire TreeFile's navigate-via-the-row's-anchor path). tabIndex={-1}
// keeps the anchor out of the tab order: the row is the treeitem, per the WAI-ARIA roving-tabindex
// tree pattern, so the row — not the link — is the single focus stop. `href` is the caller's
// already-sanitized value (falsy ⇒ a plain <span> label); the trailing comment span renders only
// when the row carries one.
export function TreeRowLabel({ href, label, comment }) {
  return (
    <>
      {href ? (
        <Anchor href={href} className="aardvark-tree-label" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
          {label}
        </Anchor>
      ) : (
        <Text component="span" className="aardvark-tree-label">
          {label}
        </Text>
      )}
      {comment ? (
        <Text component="span" className="aardvark-tree-comment">
          {normalizeComment(comment)}
        </Text>
      ) : null}
    </>
  );
}

// lang token → file-row icon, shared by TreeFile and GitFolder. IconFileCode
// for a known-but-unmapped language, IconFile for a plain file (no detected language). The
// token matches what a ``` fence / {% file %} uses (the build's extension-to-language map),
// so icons track the same language detection. Exported for unit tests.
const LANG_ICON = {
  __proto__: null, // null-proto: an author-controlled filename extension can't resolve to an inherited Object.prototype member (which would render as an invalid icon)
  python: IconBrandPython,
  javascript: IconBrandJavascript,
  jsx: IconBrandJavascript,
  typescript: IconBrandTypescript,
  tsx: IconBrandTypescript,
  json: IconJson,
  markdown: IconMarkdown,
  html: IconBrandHtml5,
  css: IconBrandCss3,
  scss: IconBrandCss3,
  sass: IconBrandCss3,
  less: IconBrandCss3,
  go: IconBrandGolang,
  rust: IconBrandRust,
};

export function iconForLang(lang) {
  if (!lang) return IconFile;
  return LANG_ICON[lang] || IconFileCode;
}

// Human-readable byte size for the binary / too-large file placeholders (e.g. "12.3 KB").
// Pure and SSR-safe. Returns "" for a missing/invalid size so callers can omit it.
export function formatBytes(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) return '';
  if (n < 1024) return `${n} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = n / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`;
}
