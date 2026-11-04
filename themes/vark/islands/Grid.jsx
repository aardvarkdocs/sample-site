import { Children, forwardRef, isValidElement } from 'react';
import { Grid as MantineGrid } from '@mantine/core';

// The island behind the built-in {% grid %} tag (grid.md).
// Mantine's Grid is compound — content lives in <MantineGrid.Col span={...}> children — so the
// mapping from authored cells to MantineGrid.Col can't ride the flat component('Grid', ...) JSON
// props channel; it lives here.
//
// Two authoring shapes, both handled here:
//
//   1. `items` (an array of { content, span } built by the macro from the `items=` param):
//      each becomes a <MantineGrid.Col> with the given span (or the grid's default span). The
//      content is a plain string (markdown-in-a-cell isn't possible through the param
//      channel — use shape 2 for rich cells).
//   2. Block body children: the macro passes the rendered Markdown as `children`. Any
//      top-level element is dropped into a single auto-spanning <MantineGrid.Col> so a plain
//      `{% grid %}…{% endGrid %}` still lays its body out as one responsive column run.
//
// Every other prop ({...rest}: gap, justify, align, grow, columns, overflow, …) flows
// straight to Mantine <MantineGrid>, so the full Grid API stays available. forwardRef carries an
// optional attr={...} to the root. SSR-safe: pure composition, no refs/effects.
const Grid = forwardRef(function Grid(
  { items, span, children, ...rest },
  ref,
) {
  const cells = Array.isArray(items) ? items : null;
  return (
    <MantineGrid ref={ref} {...rest}>
      {cells
        ? cells.map((cell, i) => (
            <MantineGrid.Col key={i} span={cell.span ?? span ?? 'auto'}>
              {cell.content}
            </MantineGrid.Col>
          ))
        : Children.toArray(children)
            .filter((child) => isValidElement(child) || (typeof child === 'string' && child.trim()))
            .map((child, i) => (
              <MantineGrid.Col key={i} span={span ?? 'auto'}>
                {child}
              </MantineGrid.Col>
            ))}
    </MantineGrid>
  );
});

export default Grid;
