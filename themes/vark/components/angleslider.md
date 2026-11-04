---
name: angleslider
description: A circular slider for picking an angle (0–360°). Set `size`, `step`,
  `defaultValue` (degrees), `thumbSize`, `marks` (a JSON array of `{value, label}`),
  `withLabel`, and `disabled`. The center label always shows the raw degrees — hide it with
  `withLabel=false`. Mounts as an interactive island.
params:
  size: int
  step: int
  defaultValue: int
  thumbSize: int
  marks: string
  withLabel: { type: bool, default: true }
  disabled: { type: bool, default: false }
body: python
---
```python
# Numeric props are tested against None so a deliberate 0 (e.g. defaultValue=0°) survives.
# `marks` is non-scalar — accept a JSON-array string ([{value, label}, …]) and parse here;
# it rides the JSON props channel as a real array. `withLabel` defaults to true in Mantine,
# so only emit it when the author turns it off. Mantine's `formatLabel` is a JS function, and
# props are JSON-serialized on their way to the island, so no author-facing form can set it —
# the center label shows the raw degrees, or nothing when withLabel is false.
import json as _json
import aardvark.components as av
props = {}
if size is not None: props['size'] = size
if step is not None: props['step'] = step
if defaultValue is not None: props['defaultValue'] = defaultValue
if thumbSize is not None: props['thumbSize'] = thumbSize
if marks:
    try:
        props['marks'] = _json.loads(marks.strip())
    except (ValueError, TypeError):
        # A malformed marks JSON shouldn't abort the build — render without marks, but warn so a
        # typo isn't a silently unmarked dial (matches slider.md / rangeslider.md).
        av.warn("angleslider: marks is not valid JSON — rendering without marks; check the marks value")
if not withLabel: props['withLabel'] = False
if disabled: props['disabled'] = True
if attr: props['attr'] = attr
print(component('AngleSlider', **props))
```
