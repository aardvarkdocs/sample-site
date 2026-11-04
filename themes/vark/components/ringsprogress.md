---
name: ringsprogress
description: A multi-ring (concentric) progress indicator — a Community Component wrapping
  @gfazioli/mantine-rings-progress. Pass `rings` as a JSON array of objects (e.g.
  `[{"value":75,"color":"cyan"},{"value":40,"color":"orange"}]`), and optionally set `size`
  (px), `thickness` (px), `gap` (px between rings), `roundCaps`, `animate`, `glow`,
  `showValues`, `startAngle`, `direction` (clockwise / counterclockwise), and `label`
  (text shown in the center). Distinct from the singular `{% ringprogress %}` (Mantine core).
params:
  rings: { type: string, required: true }
  size: int
  thickness: int
  gap: int
  roundCaps: { type: bool, default: true }
  animate: { type: bool, default: false }
  glow: { type: bool, default: false }
  showValues: { type: bool, default: false }
  startAngle: int
  direction: string
  label: string
body: python
---
```python
# RingsProgress's `rings` is a required array of {value, color, …} objects — a structure the
# flat JSON props channel of component('RingsProgress', …) can't carry as a typed tag
# attribute, so it arrives as a JSON string and the RingsProgress island
# (RingsProgress.jsx) maps it onto the vendor <RingsProgress rings>. `label`
# is plain text shown in the center. Other props are omitted when unset so the vendor's
# defaults apply. Numeric props are tested against None (not truthiness) so a deliberate 0
# (e.g. startAngle=0) survives.
import json as _json
try:
    _rings = _json.loads(rings)
except (ValueError, TypeError):
    _rings = None
if not isinstance(_rings, list):
    # Bad/empty JSON: degrade to a visible build-time comment rather than a crash (mirrors
    # ringprogress.md).
    print("<!-- aardvark: ringsprogress `rings` must be a JSON array of "
          "{value, color} objects -->")
else:
    props = {'rings': _rings}
    if size is not None: props['size'] = size
    if thickness is not None: props['thickness'] = thickness
    if gap is not None: props['gap'] = gap
    if roundCaps is False: props['roundCaps'] = False
    if animate: props['animate'] = True
    if glow: props['glow'] = True
    if showValues: props['showValues'] = True
    if startAngle is not None: props['startAngle'] = startAngle
    if direction: props['direction'] = direction
    if label: props['label'] = label
    if attr: props['attr'] = attr
    print(component('RingsProgress', **props))
```
