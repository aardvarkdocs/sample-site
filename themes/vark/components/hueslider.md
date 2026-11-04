---
name: hueslider
description: A slider for picking a hue (0–360) along the color spectrum. Set `defaultValue`
  (the starting hue) and `size`. Mounts as an interactive island.
params:
  defaultValue: int
  size: string
  radius: string
body: python
---
```python
# A thin slider whose track is the full hue spectrum (one of Mantine's ColorPicker
# building blocks). `radius` is accepted but INERT: Mantine's HueSlider takes ColorSliderOptions,
# which has no radius prop, and radius is not a Box style prop either (the Box shorthand is
# `bdrs`), so the value only lands as a dead HTML attribute. The param stays to keep existing
# sites building; it is deliberately absent from the description above and from the docs page.
# `defaultValue` is the starting hue 0–360, tested against None so a
# deliberate 0 (red) survives. Uncontrolled here — the reader drags to a new hue.
props = {}
if defaultValue is not None: props['defaultValue'] = defaultValue
if size: props['size'] = size
if radius: props['radius'] = radius
if attr: props['attr'] = attr
print(component('HueSlider', **props))
```
