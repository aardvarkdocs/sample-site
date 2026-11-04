import { forwardRef } from 'react';
import { SimpleGrid } from '@mantine/core';
import { resolveCols } from './_colsLadder';
import './CardGrid.css';

// The island behind the built-in {% cardGrid %} block. Cards are self-rendering
// islands (like TreeFolder), so — unlike Tabs/Carousel, which read carrier props to
// build a forced structure — there's nothing to extract: we render the card island children
// straight into a responsive Mantine SimpleGrid. The islands runtime's child walker already
// drops whitespace-only text nodes, and the block passes the body through UNSQUEEZED (unlike
// {% tree %}): the blank lines between cards are deliberate — they delimit each card's HTML block
// so its body renders as Markdown — and markdown-it separates those blocks without emitting empty
// paragraphs, so the children still arrive as clean Card elements with no stray cells.
//
// `cols` is a number or a Mantine responsive object ({ base, sm, md, lg, xl }) assembled by
// the {% cardGrid %} block, and `colsOverrides` the per-breakpoint pins that accompany a count.
// Both go through `resolveCols` in the shared `_colsLadder` helper, which documents what a plain
// count means and why Python does not pre-expand it.
// forwardRef carries an optional attr={...} to the root. SSR-safe: pure composition.

const CardGrid = forwardRef(function CardGrid(
  // colsOverrides is destructured out of `rest` on purpose: it is ours, not a DOM attribute.
  { cols, colsOverrides, spacing = 'lg', verticalSpacing, children, ...rest },
  ref,
) {
  return (
    <SimpleGrid
      ref={ref}
      data-aardvark-card-grid=""
      cols={resolveCols(cols, colsOverrides)}
      spacing={spacing}
      verticalSpacing={verticalSpacing ?? spacing}
      {...rest}
    >
      {children}
    </SimpleGrid>
  );
});

export default CardGrid;
