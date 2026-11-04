import { forwardRef } from 'react';
import { Split } from '@gfazioli/mantine-split-pane';
import './SplitPane.css';

// The island behind the built-in {% splitpane %} tag (splitpane.md).
// It registers under the native name `SplitPane` — distinct from the Mantine-core wrapper
// builtin `Splitter` (Splitter.jsx), which wraps Mantine 9's own Splitter.
// This one wraps the community @gfazioli/mantine-split-pane: a resizable split with a styled,
// draggable resizer between panes. A **Community Component**.
//
// A flat build-time macro can't emit the compound Split / Split.Pane directly (the panes are
// children), so this thin wrapper composes them from the macro's first/second/orientation
// shape — gaining the package's styled drag handle. `first` / `second` are RAW HTML strings
// injected as-is (they are NOT run through the Markdown renderer); the block BODY (children)
// IS rendered as Markdown by the macro and becomes the first pane when `first` is omitted.
//
// `initialSize` sets the first pane's starting size. Split.Pane reads `initialWidth` ONLY when
// the split is vertical (side-by-side) and `initialHeight` ONLY when it is horizontal (stacked),
// so we forward `initialSize` to BOTH dimensions — the package ignores whichever one doesn't
// apply to the active orientation. Setting only `initialWidth` would silently no-op when the
// author passes orientation='horizontal'.
// `orientation` ('vertical' = side-by-side, the package default; 'horizontal' = stacked) and
// the resizer styling props (variant, color, size, radius, spacing, knobSize) flow straight
// through to Split via {...rest}.
//
// dangerouslySetInnerHTML: the pane strings + body are author page content (same trust level
// as the page).
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const PANE_STYLE = { padding: 'var(--mantine-spacing-md)', height: '100%', overflow: 'auto' };

const SplitPane = forwardRef(function SplitPane(
  { first, second, initialSize, children, ...rest },
  ref,
) {
  return (
    <Split
      ref={ref}
      style={{ minHeight: 160, marginBlock: 'var(--mantine-spacing-md)' }}
      {...rest}
    >
      <Split.Pane initialWidth={initialSize} initialHeight={initialSize} grow>
        <div style={PANE_STYLE}>
          {first ? <div dangerouslySetInnerHTML={{ __html: first }} /> : children}
        </div>
      </Split.Pane>
      <Split.Resizer />
      <Split.Pane grow>
        <div style={PANE_STYLE}>
          {second ? <div dangerouslySetInnerHTML={{ __html: second }} /> : null}
        </div>
      </Split.Pane>
    </Split>
  );
});

export default SplitPane;
