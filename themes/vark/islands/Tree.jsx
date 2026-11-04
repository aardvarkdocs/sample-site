import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { Box } from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';
import './Tree.css';

// The island behind the built-in {% tree %} block: a nested file/folder explorer with
// collapsible folders and indentation guides. Each {% folder %}/{% file %}
// emits its own island, and the islands runtime turns the nested <div>s into nested React
// children — so this tree is genuinely recursive: every TreeFolder/File renders
// itself and its island children. (No inert-carrier indirection like Tabs needs;
// Tabs only do that because Mantine forces a split List/Panel structure.)
//
// Indentation guide lines are pure CSS (.aardvark-tree-group's border-left; nesting
// compounds). Keyboard navigation is owned here at the root via one delegated onKeyDown
// over the descendant [role="treeitem"] rows (a roving-tabindex tree, per WAI-ARIA). The
// handler is a named export so it can be unit-tested without a DOM-mounted island.
//
// SSR note: under the build-time prerender refs/effects don't run, so no
// row is seeded with tabindex=0 and the handler is inert — the baked markup is just the
// rows. aardvark hydrates them in place; the mount effect seeds focus and handlers wire up keys.

// A row is reachable only when every folder above it is open. We determine that
// structurally — each enclosing folder's row carries aria-expanded — rather than by CSS:
// Mantine's Collapse hides a closed section with height:0 + overflow:hidden (not reliably
// display:none, especially for a section that starts closed), so a child row can still
// have a non-null offsetParent. Reading our own aria-expanded is robust across Mantine
// versions and mid-animation, and (unlike offsetParent) works in a layout-free DOM.
function isRowVisible(el) {
  let node = el;
  for (;;) {
    const group = node.closest('.aardvark-tree-group');
    if (!group) return true; // reached the tree root with no collapsed ancestor
    const folderItem = group.closest('.aardvark-tree-item');
    const folderRow = folderItem && folderItem.querySelector('.aardvark-tree-row');
    if (folderRow && folderRow.getAttribute('aria-expanded') === 'false') return false;
    node = folderItem;
    if (!node) return true;
  }
}

// Reachable rows in DOM order — those not inside any collapsed folder.
function visibleRows(root) {
  return Array.from(root.querySelectorAll('.aardvark-tree-row')).filter(isRowVisible);
}

function isFolder(row) {
  return row.hasAttribute('data-folder');
}

// The row itself is the treeitem — role + aria-expanded live on it (WAI-ARIA tree
// pattern: the focusable element carries the state), so read them straight off it.
function isExpanded(row) {
  return row.getAttribute('aria-expanded') === 'true';
}

// The parent treeitem's row: step out of this row's enclosing group to the container
// that holds it, then take that container's own (first) row.
function parentRowOf(row) {
  const group = row.closest('.aardvark-tree-group');
  const container = group && group.closest('.aardvark-tree-item');
  return container ? container.querySelector('.aardvark-tree-row') : null;
}

// Move the single tab stop to `row` and focus it. Clear tabindex on *every* row under the
// tree root — not just `rows` (the visible ones) — so a stale tabindex=0 stranded on a row
// that a mouse-driven collapse hid can't survive as a second tab stop (which would let Tab
// land on an invisible row). React writes tabIndex={-1} once on mount and does not re-assert
// an unchanged value, so the 0 we set here survives folder re-renders; new rows revealed by
// expansion mount at -1 and join the roving set.
function focusRow(rows, row) {
  if (!row) return;
  const root = row.closest('[role="tree"]');
  (root ? root.querySelectorAll('.aardvark-tree-row') : rows).forEach((r) =>
    r.setAttribute('tabindex', '-1'),
  );
  row.setAttribute('tabindex', '0');
  row.focus();
}

// Exported for unit tests. `root` is the tree's DOM node. Implements the standard tree
// keyboard map: Up/Down/Home/End move focus; Right expands a closed folder or steps into
// an open one; Left collapses an open folder or moves to the parent; Enter/Space activate
// (toggle a folder, or open a file's code modal — both wired to the row's own onClick).
export function handleTreeKeydown(e, root) {
  if (!root) return;
  const rows = visibleRows(root);
  if (!rows.length) return;
  const focused = root.contains(document.activeElement)
    ? document.activeElement.closest('.aardvark-tree-row')
    : null;
  const active = focused || root.querySelector('.aardvark-tree-row[tabindex="0"]') || rows[0];
  const i = rows.indexOf(active);
  if (i === -1) {
    // `active` resolved to a row that isn't currently reachable — e.g. a mouse-driven
    // collapse hid the row still holding tabindex=0 (Mantine's Collapse uses height:0, not
    // display:none, so focus + the tab stop linger on it). Rather than swallow every key
    // (a keyboard trap), re-home the single tab stop to the first visible row and stop.
    focusRow(rows, rows[0]);
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      focusRow(rows, rows[Math.min(i + 1, rows.length - 1)]);
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusRow(rows, rows[Math.max(i - 1, 0)]);
      break;
    case 'Home':
      e.preventDefault();
      focusRow(rows, rows[0]);
      break;
    case 'End':
      e.preventDefault();
      focusRow(rows, rows[rows.length - 1]);
      break;
    case 'ArrowRight':
      e.preventDefault();
      // A collapsed *toggleable* folder expands. Otherwise (an already-open or static
      // folder) step into its FIRST CHILD — but only if it has one. WAI-ARIA: ArrowRight
      // on an open node with no children is a no-op, so don't fall through to a sibling.
      if (isFolder(active) && active.hasAttribute('data-interactive') && !isExpanded(active)) {
        active.click(); // expand
      } else if (isFolder(active)) {
        const item = active.closest('.aardvark-tree-item');
        const childGroup = item && item.querySelector('.aardvark-tree-group');
        // Resolve the first child from the *visible* row set, never a raw querySelector: the
        // first row in the group could (after future structural changes) sit inside a
        // collapsed subfolder and be absent from `rows`, and focusing it would strand the
        // single tab stop on a hidden row. `rows` is in DOM order, so .find gives the first
        // reachable descendant — the first direct child in practice.
        const firstChild = childGroup && rows.find((r) => childGroup.contains(r));
        if (firstChild) focusRow(rows, firstChild);
      }
      break;
    case 'ArrowLeft': {
      e.preventDefault();
      if (isFolder(active) && isExpanded(active)) {
        active.click(); // collapse
      } else {
        const parentRow = parentRowOf(active);
        if (parentRow) focusRow(rows, parentRow);
      }
      break;
    }
    case 'Enter':
    case ' ': {
      e.preventDefault();
      // A linked row (folder OR file) navigates: Element.click() on the row div doesn't
      // reach the nested <a> (events bubble up, not down), so follow the link directly —
      // the only keyboard path to it, since the anchor is tabIndex=-1. Without a link,
      // activate the row (toggle a folder / open a file's code modal). A linked folder
      // still expands/collapses via Arrow Right/Left.
      const link = active.querySelector('a[href]');
      if (link) link.click();
      else active.click();
      break;
    }
    default:
      break;
  }
}

const Tree = forwardRef(function Tree({ label, children, ...rest }, ref) {
  const rootRef = useRef(null);
  // Merge our local rootRef with the forwarded ref (which carries `attr={...}`).
  const setRef = useMergedRef(rootRef, ref);

  // Maintain the roving-tabindex invariant: exactly one *visible* row carries tabindex=0.
  // Seed it on mount (rAF so the child island rows under this root are committed first), and
  // re-home it whenever a collapse hides the row holding it. The critical case is a *mouse*
  // collapse (clicking a chevron): JS keyboard handling never sees it, yet Mantine's Collapse
  // hides children with height:0/overflow:hidden (not display:none), so a stranded tabindex=0
  // stays focusable — the next Tab would land on an invisible row and, with active∉rows, the
  // handler would swallow every key. A MutationObserver on aria-expanded re-runs the seeding
  // on every open/close so the tab stop never lingers on a hidden row. It only rewrites the
  // tabindex attribute (never calls focus), so it can't yank focus during mouse interaction.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reseed = () => {
      const rows = visibleRows(root);
      if (!rows.length) return;
      const current = root.querySelector('.aardvark-tree-row[tabindex="0"]');
      if (current && rows.indexOf(current) !== -1) return; // invariant already holds
      // Prefer the nearest visible ancestor of the stranded row (typically the folder just
      // collapsed) so the tab stop stays near where the user was; else the first visible row.
      let target = null;
      let item = current && current.closest('.aardvark-tree-item');
      while (item && !target) {
        const group = item.closest('.aardvark-tree-group');
        const ancestorItem = group && group.closest('.aardvark-tree-item');
        const row = ancestorItem && ancestorItem.querySelector('.aardvark-tree-row');
        if (row && rows.indexOf(row) !== -1) target = row;
        item = ancestorItem;
      }
      if (!target) [target] = rows;
      root
        .querySelectorAll('.aardvark-tree-row')
        .forEach((r) => r.setAttribute('tabindex', '-1'));
      target.setAttribute('tabindex', '0');
    };
    const id = requestAnimationFrame(reseed);
    const observer = new MutationObserver(reseed);
    observer.observe(root, { attributes: true, attributeFilter: ['aria-expanded'], subtree: true });
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, []);

  const onKeyDown = useCallback((e) => handleTreeKeydown(e, rootRef.current), []);

  // Spread author attrs FIRST so the fixed accessibility props below always win: a stray
  // {% tree role="…" %} or onKeyDown=… must not clobber the tree role or keyboard handler
  // (safe_attrs only filters children/attr, so other attrs still reach `rest`).
  return (
    <Box
      {...rest}
      ref={setRef}
      role="tree"
      aria-label={label || undefined}
      data-aardvark-tree=""
      className="aardvark-tree"
      onKeyDown={onKeyDown}
    >
      {children}
    </Box>
  );
});

export default Tree;
