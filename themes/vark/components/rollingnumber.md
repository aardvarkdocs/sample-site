---
name: rollingnumber
description: An animated counter that rolls to `value`, animating each time the value changes —
  great for live stats and dashboard figures. Set `value` (the number to show),
  `animationDuration` (ms, default 600), `timingFunction` (`linear`, `ease`, `ease-in`,
  `ease-out`, `ease-in-out`), `decimalScale` (fixed decimal places), `fixedDecimalScale` (pad
  with trailing zeros), `thousandSeparator` (group with commas, on by default), and
  `prefix`/`suffix` (e.g. `$` / `%`). Inherits Mantine styling, so `size`, `color`, and `fw`
  ride through.
params:
  value: float
  animationDuration: int
  timingFunction: string
  decimalScale: int
  fixedDecimalScale: { type: bool, default: false }
  thousandSeparator: { type: bool, default: true }
  prefix: string
  suffix: string
  size: string
  color: string
  fw: string
body: python
---
```python
# The rollingnumber tag renders Mantine's RollingNumber: an animated counter that rolls to
# `value`, re-animating whenever the value changes (on a static page it shows the final value).
# `value` is a `float` param, so the template engine validates it at build time — a non-numeric
# value= fails the build with a clear error instead of silently rolling to 0. Numeric props
# (animationDuration/decimalScale) are tested against None so a deliberate 0 survives.
# thousandSeparator is forwarded as True by default (Mantine's own default is OFF) to keep the
# documented comma-grouping; turning it off omits it so Mantine's default (no grouping) applies.
# size/color map onto Mantine's Box style props (fz/c) on RollingNumber's root, so the digits
# inherit them.
props = {}
props['value'] = value if value is not None else 0
if animationDuration is not None: props['animationDuration'] = animationDuration
if timingFunction: props['timingFunction'] = timingFunction
if decimalScale is not None: props['decimalScale'] = decimalScale
if fixedDecimalScale: props['fixedDecimalScale'] = True
if thousandSeparator: props['thousandSeparator'] = True
if prefix: props['prefix'] = prefix
if suffix: props['suffix'] = suffix
if size: props['fz'] = size
if color: props['c'] = color
if fw: props['fw'] = fw
# Inline island — a rolling stat sits mid-sentence / in a heading; attr forwards raw HTML attrs.
print(inline_component('RollingNumber', attr=attr, **props))
```
