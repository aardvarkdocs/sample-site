---
name: alphaslider
description: A slider for picking an alpha (opacity, 0–1) for a given `color`. Set `color`
  (the base color the alpha applies to, e.g. `#1c7ed6`), `defaultValue` (starting alpha, 1 when
  unset), and `size`. Mounts as an interactive island.
params:
  color: string
  defaultValue: float
  size: string
  radius: string
body: python
---
```python
# A thin slider whose track fades the given `color` from transparent to opaque (one of
# Mantine's ColorPicker building blocks). `color` is required for the gradient track to
# render; `defaultValue` is the starting alpha 0–1, tested against None so a deliberate 0
# (fully transparent) survives. Uncontrolled here — the reader drags to a new alpha.
props = {}
if color: props['color'] = color
if defaultValue is not None: props['defaultValue'] = defaultValue
if size: props['size'] = size
if radius: props['radius'] = radius
if attr: props['attr'] = attr
print(component('AlphaSlider', **props))
```
