import { forwardRef } from 'react';
import { RingsProgress as GfazioliRingsProgress } from '@gfazioli/mantine-rings-progress';
import './RingsProgress.css';

// The island behind the built-in {% ringsprogress %} tag (ringsprogress.md). A
// Community Component: it wraps @gfazioli/mantine-rings-progress's <RingsProgress>, a
// multi-ring (concentric) progress indicator. NOTE the deliberately distinct name: Mantine
// core already ships a singular `RingProgress` (our {% ringprogress %} builtin) — this plural
// community widget is `RingsProgress` / {% ringsprogress %} so the two never collide in the
// registry.
//
// Mantine's RingsProgress takes a required `rings` array of {value, color, …} objects and an
// optional center `label` that may be a React node — neither fits the flat JSON props channel
// of component('RingsProgress', …), so the macro JSON-parses `rings` in its Python body and
// passes a plain-text `label`; everything else (size, thickness, gap, animate, glow, …) flows
// straight through via {...rest}.
//
// forwardRef so `attr={…}` reaches the rendered root DOM node.
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const RingsProgress = forwardRef(function RingsProgress(
  { rings = [], label, ...rest },
  ref,
) {
  const labelNode = label != null && label !== '' ? label : undefined;
  return <GfazioliRingsProgress ref={ref} rings={rings} label={labelNode} {...rest} />;
});

export default RingsProgress;
