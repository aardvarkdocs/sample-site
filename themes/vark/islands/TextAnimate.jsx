import { forwardRef, useEffect, useState } from 'react';
import { TextAnimate as GfazioliTextAnimate } from '@gfazioli/mantine-text-animate';
import './TextAnimate.css';

// The island behind the built-in {% textAnimate %} tag
// (textanimate.md). A Community Component: it wraps the @gfazioli/mantine-text-animate
// `TextAnimate` (MIT, npm @gfazioli/mantine-text-animate).
//
// No name collision — Mantine core has no TextAnimate export — so it keeps its native name.
//
// TextAnimate animates its text in/out/loop by character / word / line. Every prop
// (animate, animation, by, duration, delay, segmentDelay, loopDelay, the Mantine style
// system, …) flows straight through via {...rest}; the animated text is `children`.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const TextAnimate = forwardRef(function TextAnimate({ children, animate, ...rest }, ref) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // On the first client render show the text statically; once mounted, honor the
  // author-requested animate mode (defaulting to Mantine's own when unset).
  const animateMode = mounted ? animate : 'static';
  return (
    <GfazioliTextAnimate ref={ref} animate={animateMode} {...rest}>
      {children}
    </GfazioliTextAnimate>
  );
});

export default TextAnimate;
