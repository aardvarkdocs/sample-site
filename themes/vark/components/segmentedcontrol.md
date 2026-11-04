---
name: segmentedcontrol
description: A segmented control — a row of mutually exclusive options. Give `data` a
  comma-separated list (`One, Two, Three`) or a JSON array of `{label, value}` objects, plus
  `color`, `size`, `radius`, `defaultValue`, `fullWidth`, `orientation` (horizontal /
  vertical), `disabled`, and `readOnly`. Mounts as an interactive island.
params:
  data: string
  defaultValue: string
  color: string
  size: string
  radius: string
  orientation: string
  fullWidth: { type: bool, default: false }
  disabled: { type: bool, default: false }
  readOnly: { type: bool, default: false }
  withItemsBorders: { type: bool, default: true }
body: python
---
```python
# `data` is non-scalar, so it can't ride the tag as a scalar attr — accept it as a string
# and parse here into the list Mantine's SegmentedControl expects. A leading '[' is parsed
# as JSON (a list of {label, value} objects, or of bare strings); otherwise it's a simple
# comma-separated list of labels (each becomes its own value). The parsed list rides the
# JSON props channel as a real array. Other props mirror badge.md (unset → omitted).
import json as _json
import aardvark.components as av
props = {}
if data:
    _d = data.strip()
    if _d.startswith('['):
        try:
            _parsed = _json.loads(_d)
        except (ValueError, TypeError):
            _parsed = None
        if isinstance(_parsed, list):
            props['data'] = _parsed
        else:
            # A malformed (or non-array) JSON data= shouldn't abort the build — degrade to no
            # segments, but warn so a typo, or a Python list stringified into this string param,
            # isn't a silently empty control (matches the other JSON-param macros).
            av.warn("segmentedcontrol: data is not a valid JSON array — rendering no segments; check the data value")
            props['data'] = []
    else:
        props['data'] = [s.strip() for s in _d.split(',') if s.strip()]
if defaultValue: props['defaultValue'] = defaultValue
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if orientation: props['orientation'] = orientation
if fullWidth: props['fullWidth'] = True
if disabled: props['disabled'] = True
if readOnly: props['readOnly'] = True
# withItemsBorders defaults to true in Mantine; only emit when the author turns it off.
if not withItemsBorders: props['withItemsBorders'] = False
if attr: props['attr'] = attr
print(component('SegmentedControl', **props))
```
