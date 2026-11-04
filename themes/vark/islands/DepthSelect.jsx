import { forwardRef } from 'react';
import { DepthSelect as GfDepthSelect } from '@gfazioli/mantine-depth-select';
import './DepthSelect.css';

// The island behind the built-in {% depthselect %} tag
// (depthselect.md). A Community Component wrapping
// @gfazioli/mantine-depth-select — a 3D "Time Machine"-style stack select where
// cards recede into depth and you riffle through them.
//
// `data` is an array of { value, view } items: `view` is the card's content. It
// rides the JSON props channel as a string (the macro can't build React nodes at
// build time), and React renders a string child verbatim — so a plain text card
// label is the graceful default. Everything else (visibleCards, withControls,
// scaleStep, the Mantine style system, …) flows straight through via {...rest},
// keeping the full DepthSelect API available.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const DepthSelect = forwardRef(function DepthSelect({ data = [], ...rest }, ref) {
  return <GfDepthSelect ref={ref} data={Array.isArray(data) ? data : []} {...rest} />;
});

export default DepthSelect;
