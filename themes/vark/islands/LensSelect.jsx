import { forwardRef } from 'react';
import { LensSelect as GfLensSelect } from '@gfazioli/mantine-lens-select';
import './LensSelect.css';

// The island behind the built-in {% lensselect %} tag
// (lensselect.md). A Community Component wrapping @gfazioli/mantine-lens-select —
// a fisheye/lens magnification select where the item under the cursor swells like
// a macOS Dock icon and its neighbours scale by proximity.
//
// Items come either from `data` (an array of { value, view } — `view` is the item
// content, optional; omit it for the default pill) or are generated from
// `count`/`min`/`max`/`step` (numeric values). Both ride the JSON props channel:
// `view` as a string renders verbatim, which is the graceful default. Everything
// else (magnification, lensRange, orientation, expandOnHover, the Mantine style
// system, …) flows straight through via {...rest}, keeping the full API available.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const LensSelect = forwardRef(function LensSelect({ data, ...rest }, ref) {
  // Pass `data` through only when it's a real array — otherwise leave it undefined
  // so the count/min/max/step generation path (or the upstream default) takes over.
  const dataProp = Array.isArray(data) ? { data } : {};
  return <GfLensSelect ref={ref} {...dataProp} {...rest} />;
});

export default LensSelect;
