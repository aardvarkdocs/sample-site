import { forwardRef } from 'react';
import { Box, Overlay as MantineOverlay } from '@mantine/core';

// The island behind the built-in {% overlay %} tag (overlay.md). Mantine's
// <MantineOverlay> fills its nearest positioned ancestor, so on a doc page (with nothing
// positioned around it) it has no predictable box to cover. This wrapper supplies one: a
// `position: relative` <Box> with a fixed height, the Overlay layered over it, and the
// tag's body centered on top of the veil — the documented usage, made visible inline on a
// static page.
//
// color/backgroundOpacity/blur/gradient/radius/zIndex ride the JSON props channel
// (unset ones omitted so Mantine's defaults apply), and every other Overlay prop a
// direct component('Overlay', …) passes (fixed, className, Styles API, system props)
// rides {...rest}, all onto the veil, so the full Overlay API is exposed except
// `center`, forced below. The ref — and so `attr` — stays on the sizing box.
// `children` is the content shown ABOVE the veil (Mantine renders Overlay children on
// top of the dimming layer), centered here for the demo.
//
// SSR note: Overlay is a pure render, so the build-time prerender bakes exactly what
// the client produces; aardvark hydrates that markup in place.
const Overlay = forwardRef(function Overlay(
  { color, backgroundOpacity, blur, gradient, radius, zIndex, children, ...rest },
  ref,
) {
  const props = {};
  if (color) props.color = color;
  if (backgroundOpacity !== undefined && backgroundOpacity !== null)
    props.backgroundOpacity = backgroundOpacity;
  if (blur !== undefined && blur !== null) props.blur = blur;
  if (gradient) props.gradient = gradient;
  if (radius) props.radius = radius;
  if (zIndex !== undefined && zIndex !== null) props.zIndex = zIndex;
  return (
    <Box
      ref={ref}
      pos="relative"
      mih={140}
      style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden' }}
    >
      <MantineOverlay {...rest} {...props} center>
        {children}
      </MantineOverlay>
    </Box>
  );
});

export default Overlay;
