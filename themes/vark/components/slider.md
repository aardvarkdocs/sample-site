---
name: slider
description: A slider for picking a number in a range. Set `min`, `max`, `step`,
  `defaultValue`, plus `color`, `size`, `radius`, `marks` (a JSON array of `{value, label}`),
  `label` formatting, `inverted`, `disabled`, and `restrictToMarks`. Mounts as an
  interactive island.
params:
  min: float
  max: float
  step: float
  defaultValue: float
  color: string
  size: string
  radius: string
  marks: string
  label: string
  labelAlwaysOn: { type: bool, default: false }
  inverted: { type: bool, default: false }
  disabled: { type: bool, default: false }
  restrictToMarks: { type: bool, default: false }
  showLabelOnHover: { type: bool, default: true }
body: python
---
```python
# Numeric props are tested against None (not truthiness) so a deliberate 0 (e.g. min=0)
# survives instead of being dropped. `marks` is non-scalar — accept it as a JSON string
# (a list of {value, label} objects) and parse here; it rides the JSON props channel as a
# real array. `label` accepts a printf-style string Mantine uses to format the thumb tip
# (e.g. '${}' style is done in JS; a plain string sets a static label).
import json as _json
import aardvark.components as av
props = {}
if min is not None: props['min'] = min
if max is not None: props['max'] = max
if step is not None: props['step'] = step
if defaultValue is not None: props['defaultValue'] = defaultValue
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if marks:
    try:
        props['marks'] = _json.loads(marks.strip())
    except (ValueError, TypeError):
        # A malformed marks JSON shouldn't abort the build — render without marks, but warn so a
        # typo isn't a silent unmarked slider (matches the other JSON-param macros).
        av.warn("slider: marks is not valid JSON — rendering without marks; check the marks value")
if label: props['label'] = label
if labelAlwaysOn: props['labelAlwaysOn'] = True
if inverted: props['inverted'] = True
if disabled: props['disabled'] = True
if restrictToMarks: props['restrictToMarks'] = True
# showLabelOnHover defaults to true in Mantine; only emit when the author turns it off.
if not showLabelOnHover: props['showLabelOnHover'] = False
if attr: props['attr'] = attr
print(component('Slider', **props))
```
