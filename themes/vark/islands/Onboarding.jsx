import { forwardRef, useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { OnboardingTour } from '@gfazioli/mantine-onboarding-tour';
import './Onboarding.css';

// The island behind the built-in {% onboarding %} tag (onboarding.md). It wraps
// @gfazioli/mantine-onboarding-tour's <OnboardingTour> — a guided, step-by-step product tour
// that spotlights elements on the page behind a dimming overlay and walks the reader through
// them with a popover (title + content) per step.
//
// A **Community Component**: a third-party Mantine extension (gfazioli) bundled as a built-in
// React/Mantine island. The `tour` steps are plain data (id / title / content), so they ride
// the JSON props channel; every step's `id` points at a target element inside the body via a
// `data-onboarding-tour-id="<id>"` attribute (attach it with the {% audio/%}-style `attr={…}`
// channel on any built-in, or a raw HTML `data-onboarding-tour-id` on the target). `{...rest}`
// keeps the upstream API (withSkipButton / withPrevButton / withNextButton / withStepper, and
// the other serializable options) reachable from the tag. Props reach the browser as JSON —
// the build's island collector json.dumps(..., default=str) out, the islands runtime
// JSON.parse back in — so only DATA crosses. The upstream lifecycle callbacks take functions,
// which json.dumps stringifies, so they are not reachable from Python at all; don't advertise
// them as if they were.
//
// Self-managed trigger: a tour needs a controlled `started` boolean, which a build-time macro
// can't wire to a click. So the island owns that state and renders a "Start tour" Button (label
// configurable via `triggerLabel`) that begins the tour; `onOnboardingTourEnd` resets it so the
// button can restart it. The reader's own content is the `children` the tour wraps.
//
// Client-only: the tour computes element rects, manages focus, and paints a fixed overlay —
// browser-only work. Carrying the Community Component marker keeps this wrapper OUT of the SSR
// bundle, so the build bakes NO markup for it and mounts it
// client-side with createRoot. The tag's BODY still reaches the page (it is ordinary content
// emitted around this island), so a no-JS reader keeps the UI the tour would run over — but not
// the trigger, which this component renders. The mount flag below only governs the first client
// render. Do not describe the pre-mount branch as an SSR or no-JS fallback.

const Onboarding = forwardRef(function Onboarding(
  { tour = [], triggerLabel = 'Start tour', triggerProps = {}, children, ...rest },
  ref,
) {
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => setMounted(true), []);

  const trigger = (
    <Button
      ref={ref}
      onClick={() => setStarted(true)}
      // Disabled in the static fallback: with no JS there's no tour to start, so the inert
      // button shouldn't look clickable. The live branch below re-enables it.
      disabled={!mounted || started}
      className="aardvark-onboarding-trigger"
      {...triggerProps}
    >
      {triggerLabel}
    </Button>
  );

  // First client render (before the mount effect): the trigger + the body, no overlay yet.
  if (!mounted) {
    return (
      <div data-aardvark-onboarding="" className="aardvark-onboarding">
        {trigger}
        {children}
      </div>
    );
  }

  return (
    <div data-aardvark-onboarding="" className="aardvark-onboarding">
      {trigger}
      <OnboardingTour
        tour={tour}
        started={started}
        onOnboardingTourEnd={() => setStarted(false)}
        {...rest}
      >
        {children}
      </OnboardingTour>
    </div>
  );
});

export default Onboarding;
