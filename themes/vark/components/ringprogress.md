---
name: ringprogress
description: A circular (donut) progress ring with one or more colored sections. Pass
  `sections` as a JSON array of objects (e.g. `[{"value":40,"color":"cyan"},{"value":15,"color":"orange"}]`),
  and optionally set `size` (px), `thickness` (px), `roundCaps` (rounded section ends),
  and `label` (text shown in the center).
params:
  sections: { type: string, required: true }
  size: int
  thickness: int
  roundCaps: { type: bool, default: false }
  label: string
body: python
---
```python
# RingProgress's `sections` is a required array of {value, color} objects — a structure
# the flat JSON props channel of component('RingProgress', ...) can't carry as a typed
# tag attribute, so it arrives as a JSON string and the RingProgress island
# (RingProgress.jsx) maps it onto Mantine's <RingProgress sections>.
# `label` is plain text, rendered centered via Mantine's Text inside the island. Other
# props are omitted when unset so Mantine's defaults apply (size 120, thickness ~12).
import json as _json
try:
    _sections = _json.loads(sections)
except (ValueError, TypeError):
    _sections = None
if not isinstance(_sections, list):
    # Bad/empty JSON: degrade to a visible build-time comment rather than a crash.
    print("<!-- aardvark: ringprogress `sections` must be a JSON array of "
          "{value, color} objects -->")
else:
    props = {'sections': _sections}
    if size is not None: props['size'] = size
    if thickness is not None: props['thickness'] = thickness
    if roundCaps: props['roundCaps'] = True
    if label: props['label'] = label
    if attr: props['attr'] = attr
    print(snippet('RingProgress', **props))
```
