import { forwardRef } from 'react';
import { Progress as MantineProgress } from '@mantine/core';

// The island behind the multi-segment form of the built-in {% progress %} tag
// (progress.md). Mantine's compound MantineProgress.Root / MantineProgress.Section tree
// can't be expressed on the flat JSON props channel of a single component('Progress', ...)
// call, so the macro passes a `sections` array (already JSON-parsed in its Python body) and
// this island builds the tree. Each section accepts {value, color, striped, animated,
// tooltip, label}; `label` renders as the section's inner text. The simple single-`value`
// form never reaches here — it forwards straight to Mantine's <MantineProgress> from the
// macro.
//
// forwardRef so `attr={...}` reaches the rendered root DOM node — MantineProgress.Root forwards
// the ref to its own root. SSR-safe: a pure render (no refs/effects).
const ProgressRoot = forwardRef(function ProgressRoot({ sections = [], ...rest }, ref) {
  return (
    <MantineProgress.Root ref={ref} {...rest}>
      {sections.map((s, i) => {
        const { label, ...sectionProps } = s || {};
        return (
          <MantineProgress.Section key={i} {...sectionProps}>
            {label}
          </MantineProgress.Section>
        );
      })}
    </MantineProgress.Root>
  );
});

export default ProgressRoot;
