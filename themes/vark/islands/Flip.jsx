import { forwardRef } from 'react';
import { Flip as MantineFlip } from '@gfazioli/mantine-flip';
import './Flip.css';

// The island behind the built-in {% flip %} tag
// (flip.md). A Community Component wrapping @gfazioli/mantine-flip
// (https://gfazioli.github.io/mantine-flip/), an MIT-licensed Mantine extension that
// flips between a front and a back face on click.
//
// Mantine's Flip requires EXACTLY two children — the front face and the back face — and
// both are React nodes, which can't ride the JSON props channel of component('Flip', …).
// So the macro hands us the block body as `children` (the front face) and a `back` HTML
// string (the back face). This wrapper builds the two required slots: the body becomes the
// front face verbatim, and `back` is rendered as raw HTML (it's already-rendered template
// output from the macro — same trust model as the children channel). Every other prop
// (flipped, defaultFlipped, direction, duration, easing, perspective, disabled, swipeable,
// the Mantine style system, …) flows straight through via {...rest}, so the full Flip API
// stays available from the tag.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).

const Flip = forwardRef(function Flip({ children, back, ...rest }, ref) {
  return (
    <MantineFlip ref={ref} data-aardvark-flip="" {...rest}>
      <div className="aardvark-flip-face">{children}</div>
      <div
        className="aardvark-flip-face"
        dangerouslySetInnerHTML={{ __html: typeof back === 'string' ? back : '' }}
      />
    </MantineFlip>
  );
});

export default Flip;
