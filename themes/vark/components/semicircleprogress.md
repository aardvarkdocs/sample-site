---
name: semicircleprogress
description: A half-circle (gauge) progress indicator. Set `value` (0–100, required),
  `size` (svg diameter in px), `thickness` (arc thickness in px), `orientation`
  (up or down), `fillDirection` (left-to-right or right-to-left), `label` (text in the
  center) with `labelPosition` (center or bottom), and `filledSegmentColor` /
  `emptySegmentColor`.
params:
  value: { type: float, required: true }
  size: int
  thickness: int
  orientation: string
  fillDirection: string
  label: string
  labelPosition: string
  filledSegmentColor: string
  emptySegmentColor: string
body: python
---
```python
# Mirrors button.md: `value` is the only required prop; every other prop is optional and
# unset ones are omitted so Mantine's defaults apply (size 200, thickness 12,
# orientation 'up', fillDirection 'left-to-right', labelPosition 'bottom'). Numeric props
# are tested against None (not truthiness) so a deliberate 0 survives. `label` is plain
# text on the JSON props channel (React escapes it); a richer node needs the component()
# call form directly. `attr` forwards raw HTML attributes onto the root.
props = {'value': value}
if size is not None: props['size'] = size
if thickness is not None: props['thickness'] = thickness
if orientation: props['orientation'] = orientation
if fillDirection: props['fillDirection'] = fillDirection
if label: props['label'] = label
if labelPosition: props['labelPosition'] = labelPosition
if filledSegmentColor: props['filledSegmentColor'] = filledSegmentColor
if emptySegmentColor: props['emptySegmentColor'] = emptySegmentColor
if attr: props['attr'] = attr
print(component('SemiCircleProgress', **props))
```
