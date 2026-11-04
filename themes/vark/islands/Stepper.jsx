import { Children, forwardRef, isValidElement } from 'react';
import { Timeline } from '@mantine/core';
import './Stepper.css';

// The island behind a Markdown ordered list (`1. … 2. … 3. …`) that aardvark
// auto-converts to a "Steps" block (only top-level numbered lists convert; nested
// ones stay a plain <ol>, and the whole behavior is gated by the `steps` config
// toggle). Mantine's Timeline supplies the vertical run of numbered bullets joined
// by a connecting line; each step's Markdown body renders beside its number.
//
// Authoring shape: each <li> emits an StepperStep carrier holding the step
// `number` (markdown-it's display ordinal, so a `start=`/`3.` offset is honored)
// and the rendered list-item body as children. We read those carriers out of
// `children` and build the real Timeline / Timeline.Item tree. Every other prop
// ({...rest}) flows straight to Mantine <Timeline>, so its API stays available.
//
// Not a wizard: `active={items.length}` marks every bullet and connecting line as
// "active" (Mantine's Timeline.Item treats `active >= index` as active), so all
// steps look identical — there is no current/incomplete progress state to track.
//
// SSR note: Timeline is a pure render (no refs/effects), so the build-time
// prerender bakes exactly what the client produces — no flash, nothing to measure.
// aardvark hydrates the baked rows in place (createRoot is only the unbaked fallback).
const Stepper = forwardRef(function Stepper({ children, ...rest }, ref) {
  // Step descriptors come from the carrier children — props only; the carriers
  // themselves are never rendered. Tolerate stray text/elements between them.
  const items = Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type && child.type.isStepItem)
    .map((child) => child.props);

  return (
    <Timeline
      ref={ref}
      active={items.length}
      bulletSize={28}
      lineWidth={2}
      data-aardvark-steps=""
      {...rest}
    >
      {items.map((it, i) => (
        <Timeline.Item key={i} bullet={it.number ?? i + 1}>
          {it.children}
        </Timeline.Item>
      ))}
    </Timeline>
  );
});

export default Stepper;
