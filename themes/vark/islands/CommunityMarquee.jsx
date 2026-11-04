import { forwardRef } from 'react';
import { Marquee as GfazioliMarquee } from '@gfazioli/mantine-marquee';
import './CommunityMarquee.css';

// The island behind the built-in {% communityMarquee %} tag
// (communitymarquee.md). A Community Component: it wraps the
// @gfazioli/mantine-marquee `Marquee` (MIT, npm @gfazioli/mantine-marquee).
//
// Registered under the distinct name CommunityMarquee — NOT Marquee — because the
// Mantine-core build already ships a native `Marquee` export (and the {% marquee %} builtin
// wraps it). Keeping a separate name lets both coexist: {% marquee %} → native Mantine,
// {% communityMarquee %} → this gfazioli variant with its extra isometric / circle variants,
// fade-edge modes, 3D tilt, and responsive vertical/gap.
//
// Every prop (variant, vertical, reverse, duration, gap, repeat, pauseOnHover, fadeEdges,
// fadeEdgesSize, tilt, perspective, rotate, skew, radius, the Mantine style system, …) flows
// straight through via {...rest}, so the full Marquee API stays available. The scrolling
// content is `children`.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const CommunityMarquee = forwardRef(function CommunityMarquee({ children, ...rest }, ref) {
  return (
    <GfazioliMarquee ref={ref} {...rest}>
      {children}
    </GfazioliMarquee>
  );
});

export default CommunityMarquee;
