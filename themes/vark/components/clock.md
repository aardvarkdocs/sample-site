---
name: clock
description: An analog clock (Community Component, @gfazioli/mantine-clock). With no props
  it shows the live local time. Set `value` ("HH:MM" / "HH:MM:SS") with `running=false` for a
  fixed time, `timezone` (an IANA name) for another zone, `size` (xs–xl, a number of px, or a
  CSS length; the face is 400px by default), `shape`
  (circle, rounded-rect), and `secondHandBehavior` (smooth, tick, tick-half, tick-high-freq). Toggle the
  `withSecondsArc` / `withMinutesArc` / `withHoursArc` arcs. Takes no body.
params:
  value: string
  running: bool
  timezone: string
  size: string
  shape: string
  secondHandBehavior: string
  withSecondsArc: { type: bool, default: false }
  withMinutesArc: { type: bool, default: false }
  withHoursArc: { type: bool, default: false }
  animateOnMount: { type: bool, default: false }
body: python
---
```python
# Renders the Clock island (Clock.jsx), which wraps @gfazioli/mantine-clock's
# `Clock`. The clock takes no children — it draws an SVG face. Every prop is optional and
# unset ones are omitted so the package's own defaults apply (live local time). `running` is
# gated on `is not None` so a deliberate `running=false` (freeze on `value`) is honored rather
# than dropped like an unset prop. `attr` forwards raw HTML attributes onto the root.
props = {}
if value: props['value'] = value
if running is not None: props['running'] = running
if timezone: props['timezone'] = timezone
if size: props['size'] = size
if shape: props['shape'] = shape
if secondHandBehavior: props['secondHandBehavior'] = secondHandBehavior
if withSecondsArc: props['withSecondsArc'] = True
if withMinutesArc: props['withMinutesArc'] = True
if withHoursArc: props['withHoursArc'] = True
if animateOnMount: props['animateOnMount'] = True
if attr: props['attr'] = attr
print(component('Clock', **props))
```
