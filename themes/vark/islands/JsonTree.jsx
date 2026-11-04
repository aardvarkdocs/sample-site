import { forwardRef, useMemo } from 'react';
import { JsonTree as GfazioliJsonTree } from '@gfazioli/mantine-json-tree';
import './JsonTree.css';

// The island behind the built-in {% jsontree %} tag
// (jsontree.md). A **Community Component**: it wraps @gfazioli/mantine-json-tree's
// <JsonTree>, an interactive, collapsible, syntax-highlighted view of any JSON-serializable
// value.
//
// The macro JSON-parses the author's `data` string (an object, array, or scalar) and hands
// it through the JSON props channel; every other prop (rootName, maxDepth, the show*/with*
// toggles, size, …) passes straight through via {...rest}, so the upstream JsonTree API
// stays available. The package's stylesheet is pulled in through the co-located JsonTree.css
// (a CSS @import, never a JS import — a package .css import crashes the SSR prerender under
// esbuild's --packages=external).
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
//
// Toolbar layout fix: the upstream header is a space-between Mantine Group whose toolbar
// (expand/collapse/copy controls) wraps. With no title on the left, that toolbar shrinks to one
// button wide and stacks its buttons VERTICALLY — a tall, mostly-blank band above the tree — even
// in a roomy container. Force it onto a single non-shrinking row for EVERY {% jsontree %} (and the
// API reference's response examples, which render through this same wrapper). An inline flex-wrap
// (what the `styles` prop emits) reliably beats the Group's class-based wrap. A caller's other
// toolbar slot styles are merged in, but the layout fix is spread LAST so it always wins — a caller
// can't accidentally re-introduce the stacking bug by setting its own flexWrap/flexShrink.
const JsonTree = forwardRef(function JsonTree({ data, styles, ...rest }, ref) {
  // Memoize so the merged `styles` keeps a stable reference across renders (callers pass a
  // module-constant `styles`, so this recomputes ~never) — harmless today since the upstream
  // component isn't memoized, but it keeps the prop stable if it ever adds React.memo.
  const styled = useMemo(
    () => ({ ...styles, toolbar: { ...(styles && styles.toolbar), flexWrap: 'nowrap', flexShrink: 0 } }),
    [styles],
  );
  return <GfazioliJsonTree ref={ref} data={data} styles={styled} {...rest} />;
});

export default JsonTree;
