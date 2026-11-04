---
name: rangeslider
description: A slider for picking a range (two thumbs). Set `min`, `max`, `step`,
  `defaultValue` (two numbers, `20, 80`), `minRange`, plus `color`, `size`, `radius`,
  `marks` (a JSON array of `{value, label}`), `inverted`, and `disabled`. Mounts as an
  interactive island.
params:
  min: float
  max: float
  step: float
  defaultValue: string
  minRange: float
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
# Mirrors slider.md, but RangeSlider's value is a [from, to] pair, so `defaultValue` is a
# string of two numbers ('20, 80') parsed here into a 2-element numeric list (a plain comma
# split can't make numbers). Numeric scalar props are tested against None so a deliberate 0
# survives. `marks` is the same JSON-array string parsed as in slider.md.
import json as _json
import aardvark.components as av
props = {}
if min is not None: props['min'] = min
if max is not None: props['max'] = max
if step is not None: props['step'] = step
if minRange is not None: props['minRange'] = minRange
if defaultValue:
    # Parse the "low, high" pair. A non-numeric segment (a typo like '20, abc') raises ValueError
    # inside float(); catch it so the author gets the descriptive message below, not a raw Python
    # traceback that aborts the build.
    try:
        _pair = [float(s.strip()) for s in defaultValue.split(',') if s.strip()]
    except (ValueError, TypeError):
        _pair = None
    if not _pair or len(_pair) != 2:
        raise ValueError(
            f"rangeslider defaultValue must be two numbers (low, high), "
            f"e.g. '20, 80' — got {defaultValue!r}"
        )
    props['defaultValue'] = _pair
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if marks:
    try:
        props['marks'] = _json.loads(marks.strip())
    except (ValueError, TypeError):
        # A malformed marks JSON shouldn't abort the build — render without marks, but warn so a
        # typo isn't a silent unmarked slider (matches the other JSON-param macros).
        av.warn("rangeslider: marks is not valid JSON — rendering without marks; check the marks value")
if label: props['label'] = label
if labelAlwaysOn: props['labelAlwaysOn'] = True
if inverted: props['inverted'] = True
if disabled: props['disabled'] = True
if restrictToMarks: props['restrictToMarks'] = True
if not showLabelOnHover: props['showLabelOnHover'] = False
if attr: props['attr'] = attr
print(component('RangeSlider', **props))
```
