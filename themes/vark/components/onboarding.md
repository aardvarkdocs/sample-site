---
name: onboarding
description: A guided, step-by-step product tour that spotlights elements behind a dimming
  overlay and walks the reader through them (a Community Component wrapping
  @gfazioli/mantine-onboarding-tour). The body is the content the tour runs over; mark each
  target with a `data-onboarding-tour-id="<id>"` HTML attribute (use `attr={…}` on any
  built-in). Define the steps with `tour` — a JSON array of `{id, title, content}` objects
  whose `id` matches a target. `triggerLabel` sets the "Start tour" button text. Toggle the
  controls with `withSkipButton` / `withPrevButton` / `withNextButton` / `withStepper`. The trigger and the
  overlay are built in the browser, so with JavaScript off there is no trigger — but the body
  still reaches the page, so the UI the tour runs over stays readable. For a tour built from
  Python data, call `component('Onboarding', tour=[…], children=…)` instead — as a tag
  attribute `tour` must be a JSON string. Close with {% endOnboarding %}.
params:
  tour: string
  triggerLabel: string
  withSkipButton: { type: bool, default: true }
  withPrevButton: { type: bool, default: true }
  withNextButton: { type: bool, default: true }
  withStepper: { type: bool, default: true }
body: python
---
```python
# Renders the Onboarding island (Onboarding.jsx), which wraps
# @gfazioli/mantine-onboarding-tour's <OnboardingTour> and owns the controlled `started`
# state + the "Start tour" trigger (a build-time macro can't wire a click) and the
# client-only / graceful-fallback split (the overlay + focus + rects are browser-only).
#
# The tour STEPS are structured data ({id, title, content}), which a scalar-only tag
# attribute can't carry — so the `tour` param is a JSON string parsed here. (Authors with
# the steps already as Python data should call component('Onboarding', tour=[…], …) directly,
# the loop-friendly form noted in builtin-block-python-callables — non-scalar props need the
# call form.) A malformed JSON `tour` is a build-time-knowable authoring slip, so warn and fall
# back to no steps rather than abort the whole build; the body still renders.
import aardvark.components as av
props = {}
if tour:
    import json as _json
    try:
        _steps = _json.loads(tour)
    except Exception as _exc:
        av.warn(f"Aardvark: onboarding could not parse tour= as JSON ({_exc}); rendering with no steps")
        _steps = None
    if isinstance(_steps, list):
        props['tour'] = _steps
    elif _steps is not None:
        av.warn("Aardvark: onboarding tour= must be a JSON array of step objects; rendering with no steps")
if triggerLabel: props['triggerLabel'] = triggerLabel
# Booleans: the nav buttons AND the stepper all default to True upstream, so only forward an
# explicit `=false` to turn one off. (Sending the upstream default every time is redundant.)
if withSkipButton is False: props['withSkipButton'] = False
if withPrevButton is False: props['withPrevButton'] = False
if withNextButton is False: props['withNextButton'] = False
if withStepper is False: props['withStepper'] = False
# The body is the content the tour runs over (already-rendered template output — the targets, their
# data-onboarding-tour-id attributes, and any nested components). Bracket it with blank lines so
# the single Markdown pass renders any prose (paragraphs, emphasis, links, lists) rather than
# leaving it literal inside the island's one-line <div> (the block-component convention); nested
# island markup still passes through fine. An empty body stays '' so no stray blank lines.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Onboarding', children=_body, attr=attr, **props))
```
