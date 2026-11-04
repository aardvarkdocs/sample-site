import { forwardRef } from 'react';
import { RingProgress as MantineRingProgress, Text } from '@mantine/core';

// The island behind the built-in {% ringprogress %} tag (ringprogress.md). Mantine's
// RingProgress takes a required `sections` array of {value, color} objects and an
// optional center `label` that is a React node — neither fits the flat JSON props
// channel of component('RingProgress', ...), so the macro passes `sections` (already
// JSON-parsed in its Python body) plus a plain-text `label`, and this island assembles
// the real element. A string label is wrapped in a centered <Text> so it reads like
// Mantine's own examples; everything else flows through.
//
// forwardRef so `attr={...}` reaches the rendered root DOM node — Mantine's RingProgress
// forwards the ref to its own root. SSR-safe: a pure render (no refs/effects), so the
// build-time prerender bakes exactly what the client produces.
const RingProgress = forwardRef(function RingProgress(
  { sections = [], label, ...rest },
  ref
) {
  const labelNode =
    label != null && label !== '' ? (
      <Text c="dimmed" fw={700} ta="center" size="lg">
        {label}
      </Text>
    ) : undefined;
  return <MantineRingProgress ref={ref} sections={sections} label={labelNode} {...rest} />;
});

export default RingProgress;
