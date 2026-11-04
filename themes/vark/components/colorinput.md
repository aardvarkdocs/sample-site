---
name: colorinput
description: A text input with a color swatch and a dropdown color picker. Set `label`,
  `placeholder`, `defaultValue`, `format` (hex / hexa / rgb / rgba / hsl / hsla), `swatches`
  (a comma-separated list of colors), `size`, `radius`, `withPicker`, `disallowInput`, and
  `disabled`. Mounts as an interactive island.
params:
  label: string
  description: string
  placeholder: string
  defaultValue: string
  format: string
  swatches: string
  size: string
  radius: string
  disabled: { type: bool, default: false }
  disallowInput: { type: bool, default: false }
  withPicker: { type: bool, default: true }
  withEyeDropper: { type: bool, default: true }
body: python
---
```python
# `swatches` is non-scalar — accept a comma-separated string of colors and parse here into
# the list Mantine expects (it rides the JSON props channel as a real array). Other props
# mirror badge.md (unset → omitted). `withPicker`/`withEyeDropper` default to true in
# Mantine, so they're only emitted when the author turns them off. Uncontrolled here, so
# `defaultValue` sets the initial color the reader can change.
props = {}
if label: props['label'] = label
if description: props['description'] = description
if placeholder: props['placeholder'] = placeholder
if defaultValue: props['defaultValue'] = defaultValue
if format: props['format'] = format
if swatches:
    props['swatches'] = [s.strip() for s in swatches.split(',') if s.strip()]
if size: props['size'] = size
if radius: props['radius'] = radius
if disabled: props['disabled'] = True
if disallowInput: props['disallowInput'] = True
if not withPicker: props['withPicker'] = False
if not withEyeDropper: props['withEyeDropper'] = False
if attr: props['attr'] = attr
print(component('ColorInput', **props))
```
