import { forwardRef } from 'react';
import { Parallax as MantineParallax } from '@gfazioli/mantine-parallax';
import './Parallax.css';

// The island behind the built-in {% parallax %} tag
// (parallax.md). A Community Component wrapping @gfazioli/mantine-parallax
// (https://gfazioli.github.io/mantine-parallax/), an MIT-licensed Mantine extension
// that tilts its content in 3D toward the pointer for a parallax / glare effect.
//
// Parallax is a single-child wrapper, so the block body rides through as `children`
// untouched (the island runtime reconstructs the placeholder HTML into React nodes
// client-side). Every prop — the rotation/perspective family, the light*/glare*/
// shadow* effects, spring*, the gyroscope/keyboard toggles, and the Mantine style system —
// flows straight through via {...rest}, so the full Parallax API stays available from the
// tag.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).

const Parallax = forwardRef(function Parallax({ children, ...rest }, ref) {
  return (
    <MantineParallax ref={ref} data-aardvark-parallax="" {...rest}>
      {children}
    </MantineParallax>
  );
});

export default Parallax;
