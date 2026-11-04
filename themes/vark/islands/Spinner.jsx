import { forwardRef } from 'react';
import { Spinner as MantineSpinner } from '@gfazioli/mantine-spinner';
import './Spinner.css';

// The island behind the built-in {% spinner %} tag (spinner.md). A
// Community Component: it wraps @gfazioli/mantine-spinner's `Spinner`, an SVG loading
// spinner with animation variants, segment shapes, gradient colours, glow effects, and
// a determinate progress mode.
//
// Every prop the macro sets (size, variant, segments, thickness, color, glow, progress,
// gradient, …) flows straight through via {...rest}, so the full Spinner API stays
// available from the tag. `children` (e.g. a centred progress label) rides through too.
//
// forwardRef so `attr={...}` reaches the rendered root — the package's Spinner forwards
// the ref to its own SVG root. CSS drives its animation.
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const Spinner = forwardRef(function Spinner({ children, ...rest }, ref) {
  return (
    <MantineSpinner ref={ref} {...rest}>
      {children}
    </MantineSpinner>
  );
});

export default Spinner;
