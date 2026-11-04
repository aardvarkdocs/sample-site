import { forwardRef } from 'react';
import { TableOfContents as MantineTableOfContents } from '@mantine/core';

// The island behind the built-in {% tableofcontents %} tag (tableofcontents.md).
// Mantine's TableOfContents scrapes the page's headings at runtime via the
// use-scroll-spy hook and highlights the one in view, so this is genuinely a *current
// page* table of contents — there is no build-time list to pass; we just point its
// scroll-spy selector at the rendered article body.
//
// `depth` (1–6) caps which heading levels appear: the selector is built to include only
// h1..h{depth}. The control's label and click-to-scroll behavior are wired here via
// getControlProps (Mantine requires it); everything else (variant, color, size, radius,
// depthOffset, autoContrast) flows straight through.
//
// SSR note: use-scroll-spy runs in a client effect (it reads the live DOM), so the
// build-time prerender bakes an empty list and the client re-render populates it. That
// matches the feature — there are no headings to spy on until the page exists in a
// browser.
const ALL_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const TableOfContents = forwardRef(function TableOfContents(
  { depth = 3, selector, ...rest },
  ref,
) {
  // Cap to h1..h{depth}, scoped to the page's article body so site chrome headings
  // (nav, footer) are never picked up. An explicit `selector` overrides the default.
  const levels = ALL_LEVELS.slice(0, Math.max(1, Math.min(6, depth)));
  const headingSelector =
    selector || levels.map((h) => `.aardvark-content ${h}`).join(', ');
  return (
    <MantineTableOfContents
      ref={ref}
      scrollSpyOptions={{ selector: headingSelector }}
      getControlProps={({ data }) => ({
        onClick: () => data.getNode()?.scrollIntoView({ behavior: 'smooth' }),
        children: data.value,
      })}
      {...rest}
    />
  );
});

export default TableOfContents;
