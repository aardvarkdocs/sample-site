import { forwardRef } from 'react';
import { Mask as MantineMask } from '@gfazioli/mantine-mask';
import './Mask.css';

// The island behind the built-in {% mask %} tag
// (mask.md). A Community Component wrapping @gfazioli/mantine-mask — a
// cursor-follow spotlight that reveals its content through a soft radial/linear
// gradient "mask" tracking the pointer.
//
// NOTE: this is distinct from the {% maskinput %} builtin (Mantine's MaskInput, a
// formatted text input). The bare names `mask`/`Mask` were free, so the community
// spotlight keeps the natural name; the input keeps its existing `maskinput`.
//
// Every prop is scalar (variant, withCursorMask, maskRadius, maskOpacity, maskFeather,
// activation, animation, easing, invertMask, the Mantine style system, …), so the macro
// passes them straight through and they flow into Mantine's Mask via {...rest}. The
// content to reveal is the block body (`children`).
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).

const Mask = forwardRef(function Mask({ children, ...rest }, ref) {
  return (
    <MantineMask ref={ref} {...rest}>
      {children}
    </MantineMask>
  );
});

export default Mask;
