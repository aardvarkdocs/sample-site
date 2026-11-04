import { forwardRef } from 'react';
import { Reflection as MantineReflection } from '@gfazioli/mantine-reflection';
import './Reflection.css';

// The island behind the built-in {% reflection %} tag
// (reflection.md). A Community Component wrapping @gfazioli/mantine-reflection
// (https://gfazioli.github.io/mantine-reflection/), an MIT-licensed Mantine extension
// that paints a mirrored reflection beneath its child.
//
// Reflection is a single-child wrapper, so the block body rides through as `children`
// untouched (the island runtime reconstructs the placeholder HTML into React nodes
// client-side). Every prop — ripple/rippleStrength/…, reflectionOpacity,
// reflectionDistance, the shadow* family, and the Mantine style system — flows straight
// through via {...rest}, so the full Reflection API stays available from the tag.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).

const Reflection = forwardRef(function Reflection({ children, ...rest }, ref) {
  return (
    <MantineReflection ref={ref} data-aardvark-reflection="" {...rest}>
      {children}
    </MantineReflection>
  );
});

export default Reflection;
