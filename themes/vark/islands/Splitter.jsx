import { forwardRef } from 'react';
import { Splitter as MantineSplitter } from '@mantine/core';

// The island behind the built-in {% splitter %} tag (splitter.md).
// It registers under the native name `Splitter`, intentionally shadowing the raw Mantine export
// (the same native-name wrapper convention as ActionIcon.jsx / CloseButton.jsx) so
// component('Splitter') is this composed two-pane form. A flat build-time macro can't emit
// Mantine's compound Splitter / Splitter.Pane directly (the panes are children), so this thin
// wrapper composes them from the macro's first/second/defaultSize/orientation shape, with a real
// drag-to-resize handle.
//
// `first` / `second` are RAW string params injected as-is — they are NOT run through the
// Markdown renderer, so Markdown like '**bold**' stays literal (raw HTML in them does render);
// the block BODY (children) IS rendered as Markdown by the macro and becomes the first panel
// when `first` is omitted. `defaultSize` is the first pane's initial size as a percentage
// (0–100); the second pane takes the remainder. `orientation` picks a horizontal
// (side-by-side) or vertical (stacked) split. forwardRef carries an optional attr={...} to the
// Splitter root (a factory component that forwards ref to its root div).
//
// dangerouslySetInnerHTML: the region strings + body are author page content (same trust level
// as the page). Splitter is a client component (drag state via hooks); renderToString
// bakes the initial layout and the client takes over the resize interaction on mount.
const PANE_STYLE = { padding: 'var(--mantine-spacing-md)', height: '100%', overflow: 'auto' };

const Splitter = forwardRef(function Splitter(
  { first, second, defaultSize = 50, orientation = 'horizontal', children, ...rest },
  ref,
) {
  // Clamp to 0–100: an out-of-range defaultSize (e.g. 150) would otherwise give the second pane
  // a negative `100 - firstSize` percentage, which Mantine passes through to CSS and breaks the layout.
  const firstSize = Math.max(0, Math.min(100, Number.isFinite(defaultSize) ? defaultSize : 50));
  return (
    <MantineSplitter
      ref={ref}
      orientation={orientation}
      withHandle
      style={{ minHeight: 120, marginBlock: 'var(--mantine-spacing-md)' }}
      {...rest}
    >
      <MantineSplitter.Pane defaultSize={firstSize}>
        <div style={PANE_STYLE}>
          {first ? <div dangerouslySetInnerHTML={{ __html: first }} /> : children}
        </div>
      </MantineSplitter.Pane>
      <MantineSplitter.Pane defaultSize={100 - firstSize}>
        <div style={PANE_STYLE}>
          {second ? <div dangerouslySetInnerHTML={{ __html: second }} /> : null}
        </div>
      </MantineSplitter.Pane>
    </MantineSplitter>
  );
});

export default Splitter;
