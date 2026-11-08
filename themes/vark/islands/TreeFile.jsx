/* @aardvark-island {"urlProps": ["href"]} */
import { forwardRef, useState } from 'react';
import { Box, Modal, ScrollArea } from '@mantine/core';
import CodeActions, { HighlightedPre } from '@aardvark/islands/code-actions';
import { iconForLang, TreeRowLabel } from './_treeHelpers';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// iconForLang moved to _treeHelpers (shared with GitFolder); re-exported here so the
// existing unit test can keep importing it from this module.
export { iconForLang };

// The file leaf of {% tree %} (the {% file %} block). The display name is the
// `label` prop. An authored body of source code arrives as the `code` prop (raw text) with
// a `lang` derived from the file extension. With code, the row is clickable and opens the
// code in a modal as a standard <pre><code class="language-…"> block with Copy + Download
// actions. The {% file %} block also Pygments-highlights the body at build time and passes the
// token-span markup as `codeHtml`; the modal renders that via dangerouslySetInnerHTML so the
// code colors exactly like a ``` fence (the same theme palette styles both — extended to
// .aardvark-tree-modal by the theme's syntax palette, since Mantine portals the Modal out of
// .aardvark-content). When `codeHtml` is absent (highlighting off, or an unknown language)
// it falls back to the raw `code` — React-escaped, matching a fence's plain output. Copy and
// Download always use the raw `code`. Without code the row is a plain leaf (or a link, if
// href is given).

// iconForLang and the shared row label (TreeRowLabel, identical in TreeFolder) come from
// _treeHelpers, which GitFolder draws on too; sanitizeHref from @aardvark/islands/safe-href.

const TreeFile = forwardRef(function TreeFile(
  { label = '', code, codeHtml, lang, href, comment, highlighted = false },
  ref,
) {
  const [opened, setOpened] = useState(false);
  const Icon = iconForLang(lang);
  const hasCode = typeof code === 'string' && code.length > 0;
  const safeHref = sanitizeHref(href);
  // An href-only file (no code body) navigates; a code file opens the modal. Either way the
  // whole row is the interactive target — data-interactive ⇒ a row-level click + hover/cursor,
  // the same invariant folders use (only toggleable folders set it). A plain leaf with neither
  // code nor a link is the one non-interactive case.
  const linked = !hasCode && !!safeHref;

  return (
    <Box ref={ref} className="aardvark-tree-item" data-highlighted={highlighted ? '' : undefined}>
      {/* The row IS the treeitem (role on the focusable element, per WAI-ARIA);
          the outer Box is just a layout/grouping container. */}
      <div
        className="aardvark-tree-row"
        data-file=""
        data-interactive={hasCode || linked ? '' : undefined}
        role="treeitem"
        aria-haspopup={hasCode ? 'dialog' : undefined}
        tabIndex={-1}
        onClick={
          hasCode
            ? () => setOpened(true)
            : linked
              ? (e) => {
                  // Navigate via the row's own <a> so link semantics live in one place and
                  // match the keyboard path (handleTreeKeydown also clicks the nested anchor).
                  const a = e.currentTarget.querySelector('a[href]');
                  if (a) a.click();
                }
              : undefined
        }
      >
        <span className="aardvark-tree-spacer" aria-hidden="true" />
        <Icon size={16} className="aardvark-tree-icon" aria-hidden="true" />
        <TreeRowLabel href={linked ? safeHref : undefined} label={label} comment={comment} />
      </div>
      {/* Render the Modal whenever the file has code (it renders nothing until opened, and
          keeping it mounted lets Mantine play the close transition). */}
      {hasCode && (
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={label}
          centered
          size="lg"
          className="aardvark-tree-modal"
          overlayProps={{ backgroundOpacity: 0.6, blur: 2 }}
        >
          <div className="aardvark-code-block">
            {/* Copy + Download, shared with the on-page code blocks and the OpenAPI
                samples (see @aardvark/islands/code-actions). Download is named after the file (`label`);
                both act on the raw `code`, never the highlighted markup. */}
            <CodeActions text={code} filename={label} />
            <ScrollArea.Autosize mah="70vh" type="auto">
              <HighlightedPre
                code={code}
                codeHtml={codeHtml}
                lang={lang}
                className="aardvark-tree-pre"
                ariaLabel={`Source code for ${label}`}
              />
            </ScrollArea.Autosize>
          </div>
        </Modal>
      )}
    </Box>
  );
});

export default TreeFile;
