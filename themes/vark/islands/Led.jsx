import { forwardRef } from 'react';
import { Led as MantineLed } from '@gfazioli/mantine-led';
import './Led.css';

// The island behind the built-in {% led %} tag (led.md).
// A Community Component: it wraps @gfazioli/mantine-led's `Led`, a customizable LED
// status indicator with on/off state, variants (flat, 3d, neon, dot), shapes, and a
// range of animations.
//
// Every prop the macro sets (value, color, offColor, size, variant, shape, animate,
// animationType, label, …) flows straight through via {...rest}, so the full Led API
// stays available from the tag. An optional body becomes the LED's `label` node when the
// macro doesn't set a plain-text label.
//
// forwardRef so `attr={...}` reaches the rendered root — the package's Led forwards the
// ref to its own root. CSS drives the LED's glow/animation.
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const Led = forwardRef(function Led({ children, label, ...rest }, ref) {
  // A plain-text `label` from the macro wins; otherwise a non-empty block body becomes the
  // label node. Mantine's Led `label` is a React node, so the body rides through here.
  const labelNode = label != null && label !== '' ? label : children || undefined;
  return <MantineLed ref={ref} label={labelNode} {...rest} />;
});

export default Led;
