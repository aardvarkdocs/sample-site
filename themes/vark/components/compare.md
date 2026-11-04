---
name: compare
description: An image-comparison slider (Community Component — Mantine Compare by gfazioli).
  Drag, hover, or auto-play a divider to reveal one image over another. Give it `leftImage`
  and `rightImage` (URLs, with optional `leftAlt`/`rightAlt`), then set `variant` (drag /
  hover / fixed), `aspectRatio` (e.g. 16/9), `radius`, `angle` (0 = vertical divider, 90 =
  horizontal), `defaultPosition` / `position` (0-100), `sliderColor` / `sliderWidth`,
  `leftLabel` / `rightLabel`, and the auto-play fields `autoPlay`, `autoPlaySpeed`,
  `autoPlayEasing`.
params:
  leftImage: string
  rightImage: string
  leftAlt: string
  rightAlt: string
  leftLabel: string
  rightLabel: string
  variant: string
  aspectRatio: string
  radius: string
  sliderColor: string
  autoPlayEasing: string
  angle: float
  position: float
  defaultPosition: float
  minDragBound: float
  maxDragBound: float
  keyboardStep: float
  keyboardShiftStep: float
  sliderWidth: float
  autoPlaySpeed: float
  disabled: { type: bool, default: false }
  autoPlay: { type: bool, default: false }
  handleOnly: { type: bool, default: false }
body: python
---
```python
# Renders the Compare island (Compare.jsx), which wraps Mantine's Compare
# from @gfazioli/mantine-compare (a Community Component). Mantine's leftSection/rightSection
# are required React nodes (the two images), which a build-time macro can't construct — so
# the island takes leftImage/rightImage URLs and builds the <img> sections itself. Every
# other prop is scalar and passes straight through (Mantine validates the values); unset
# props are omitted so Mantine's defaults apply. Compare takes no body content.
props = {}
# Image URLs + alts and text labels for the island to assemble the sections.
for _k, _v in (
    ('leftImage', leftImage), ('rightImage', rightImage),
    ('leftAlt', leftAlt), ('rightAlt', rightAlt),
    ('leftLabel', leftLabel), ('rightLabel', rightLabel),
    ('variant', variant), ('aspectRatio', aspectRatio), ('radius', radius),
    ('sliderColor', sliderColor), ('autoPlayEasing', autoPlayEasing),
):
    if _v: props[_k] = _v
# Numeric pass-through props (`is not None` so angle=0 / position=0 survive).
for _k, _v in (
    ('angle', angle), ('position', position), ('defaultPosition', defaultPosition),
    ('minDragBound', minDragBound), ('maxDragBound', maxDragBound),
    ('keyboardStep', keyboardStep), ('keyboardShiftStep', keyboardShiftStep),
    ('sliderWidth', sliderWidth), ('autoPlaySpeed', autoPlaySpeed),
):
    if _v is not None: props[_k] = _v
# Boolean flags: forwarded only when turned ON (all default False).
if disabled: props['disabled'] = True
if autoPlay: props['autoPlay'] = True
if handleOnly: props['handleOnly'] = True
print(component('Compare', attr=attr, **props))
```
