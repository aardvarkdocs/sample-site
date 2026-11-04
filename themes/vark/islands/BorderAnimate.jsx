import { forwardRef } from 'react';
import { BorderAnimate as GfazioliBorderAnimate } from '@gfazioli/mantine-border-animate';
import './BorderAnimate.css';

// The island behind the built-in {% borderAnimate %} tag
// (borderanimate.md). A Community Component: it wraps the @gfazioli/mantine-border-animate
// `BorderAnimate` (MIT, npm @gfazioli/mantine-border-animate).
//
// No name collision — Mantine core has no BorderAnimate export — so it keeps its native name.
//
// BorderAnimate wraps any element to add an animated border (beam / glow / pulse). Every prop
// (variant, beamMode, size, spread, duration, colorFrom, colorTo, colorStops, animate, progress,
// blur, radius, withMask, zIndex, pauseOnHover, timingFunction, borderWidth, borderOpacity, w, h,
// the Mantine style system, …) flows straight through via {...rest}; the wrapped content is
// `children`.
//
// The border effect is a declarative CSS animation. Since v3 the package only stops it for
// prefers-reduced-motion under Mantine's respectReducedMotion theme flag, which aardvark does not
// set, so BorderAnimate.css carries the guard.
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const BorderAnimate = forwardRef(function BorderAnimate({ children, ...rest }, ref) {
  return (
    <GfazioliBorderAnimate ref={ref} {...rest}>
      {children}
    </GfazioliBorderAnimate>
  );
});

export default BorderAnimate;
