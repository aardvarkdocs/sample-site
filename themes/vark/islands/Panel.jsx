import { forwardRef } from 'react';
import { Paper, Text } from '@mantine/core';
import './Panel.css';

// The island behind the built-in {% panel %} block. A supplementary side
// panel (Mintlify "Panel" parity): a bordered, subtly-raised surface for secondary content — an
// API note, a "see also" aside, related links — that floats BESIDE the main content on a wide
// viewport and STACKS below it on a narrow one.
//
// We reuse Mantine's <Paper> for the surface (shadow / radius / border / padding) — the same
// primitive the {% paper %} tag wraps — and add the float and the responsive stack in Panel.css.
// The layout is deliberately CSS-only (a `float` on a wide viewport, full width in normal flow on
// a narrow one) so it needs no JS, no measurement, and is SSR-safe: this island is pure composition
// (no effects, no window), so the build-time prerenderer (renderToString) bakes it verbatim
// and the client hydrateRoots it (createRoot only when the island wasn't prerendered).
//
// State the CSS keys off rides as data-* attributes on the Paper root:
//   data-panel-side="right"|"left"  — which edge the panel floats to (default right).
// forwardRef carries an optional attr={...} to that root (Mantine's Paper forwards the ref to its
// own root element), matching the snippets/*.jsx + Callout convention.
//
// Everything else ({...rest}: shadow, radius, padding `p`, `bg`, sizing, …) flows straight to
// <Paper>, which validates the values — so the full Paper surface stays author-settable from the
// {% panel %} tag. `width` is pulled out and applied as an inline max-width so an author can size
// the floated column (e.g. width="18rem") without it becoming an unknown Paper prop.

const Panel = forwardRef(function Panel(
  {
    title,
    children,
    side = 'right',
    width,
    // Sensible surface defaults so a bare {% panel %} already looks like a raised aside. The block
    // layer omits unset attrs, so an author who doesn't set these leaves the prop absent and the
    // destructure default applies; an author who sets one (shadow="lg") passes it through and it
    // binds here, overriding the default. Either way the value is applied explicitly on <Paper>.
    shadow = 'xs',
    radius = 'md',
    withBorder = true,
    p = 'lg',
    // Pull the caller's `style` out of `rest` so we can MERGE it with the width CSS var below —
    // spreading `rest` and then setting `style=` unconditionally would otherwise drop it.
    style: restStyle,
    ...rest
  },
  ref,
) {
  // Only 'left' flips the side; anything else (including a stray value) falls back to 'right'.
  const resolvedSide = side === 'left' ? 'left' : 'right';
  // A width sizes the floated column: a bare number is treated as pixels (Mantine's convention),
  // any string (e.g. "18rem", "40%") passes through. Applied as max-width so the panel can still
  // shrink on a narrow viewport where it stacks full-width.
  const panelStyle =
    width == null
      ? undefined
      : { '--aardvark-panel-width': typeof width === 'number' ? `${width}px` : width };

  return (
    <Paper
      ref={ref}
      // Author props last-wins over structural ones would let a stray attr clobber the data-*
      // hooks the CSS needs, so spread `rest` FIRST and let the island's own props win.
      {...rest}
      className="aardvark-panel"
      data-panel-side={resolvedSide}
      shadow={shadow}
      radius={radius}
      withBorder={withBorder}
      p={p}
      // Merge any caller `style` (pulled from rest) with the width CSS var so neither clobbers the
      // other; undefined when there's nothing to set, so the DOM attribute stays clean.
      style={restStyle || panelStyle ? { ...restStyle, ...panelStyle } : undefined}
    >
      {title && (
        <Text component="p" className="aardvark-panel-title" fw={700}>
          {title}
        </Text>
      )}
      <div className="aardvark-panel-body">{children}</div>
    </Paper>
  );
});

export default Panel;
