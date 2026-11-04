---
name: colorpicker
description: An inline color picker — a saturation field plus hue (and alpha) sliders. Set
  `format` (hex / hexa / rgb / rgba / hsl / hsla), `defaultValue`, `swatches` (a
  comma-separated list of colors), `size`, `fullWidth`, and `withPicker`. Mounts as an
  interactive island.
params:
  defaultValue: string
  format: string
  swatches: string
  swatchesPerRow: int
  size: string
  fullWidth: { type: bool, default: false }
  withPicker: { type: bool, default: true }
body: python
---
```python
# Like colorinput.md, `swatches` is non-scalar — accept a comma-separated string of colors
# and parse here into a real array on the JSON props channel. `swatchesPerRow` is tested
# against None so a deliberate value survives. `withPicker` defaults to true in Mantine
# (set it false to show only the swatches), so it's only emitted when turned off.
# Uncontrolled here, so `defaultValue` sets the initial color the reader can change.
props = {}
if defaultValue: props['defaultValue'] = defaultValue
if format: props['format'] = format
if swatches:
    props['swatches'] = [s.strip() for s in swatches.split(',') if s.strip()]
if swatchesPerRow is not None: props['swatchesPerRow'] = swatchesPerRow
if size: props['size'] = size
if fullWidth: props['fullWidth'] = True
if not withPicker: props['withPicker'] = False
if attr: props['attr'] = attr
print(component('ColorPicker', **props))
```
