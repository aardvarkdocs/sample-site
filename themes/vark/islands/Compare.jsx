import { forwardRef } from 'react';
import { Compare as MantineCompare } from '@gfazioli/mantine-compare';
import './Compare.css';

// The island behind the built-in {% compare %} tag
// (compare.md). A Community Component wrapping @gfazioli/mantine-compare — an
// image-comparison slider (drag/hover/fixed) that reveals one image over
// another.
//
// Mantine Compare's `leftSection`/`rightSection` are REQUIRED React nodes (the two
// images being compared). A build-time macro can't construct React elements, so the
// island takes plain URLs — `leftImage`/`rightImage` (with `leftAlt`/`rightAlt`) —
// and builds the two <img> sections here. React callers can supply leftSection/rightSection
// nodes directly; a Python component() call can only pass JSON-serializable values. The
// Markdown tag covers the common image-vs-image case. Every other prop (variant,
// aspectRatio, radius, angle, position/defaultPosition, sliderColor/Width, autoPlay…,
// the Mantine style system, …) flows straight through via {...rest}.
//
// `leftLabel`/`rightLabel` are nodes too, but text is the overwhelmingly common case,
// so the macro passes them as strings and they render as text labels here.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).

const Compare = forwardRef(function Compare(
  { leftImage, rightImage, leftAlt = '', rightAlt = '', leftSection, rightSection, ...rest },
  ref,
) {
  // Explicit section nodes from a React caller win; otherwise build <img> sections
  // from the URLs the tag supplies. A missing image degrades to an empty section rather
  // than a broken <img src="">.
  const left =
    leftSection !== undefined
      ? leftSection
      : leftImage
        ? <img src={leftImage} alt={leftAlt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
        : null;
  const right =
    rightSection !== undefined
      ? rightSection
      : rightImage
        ? <img src={rightImage} alt={rightAlt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
        : null;

  return (
    <MantineCompare ref={ref} leftSection={left} rightSection={right} {...rest} />
  );
});

export default Compare;
