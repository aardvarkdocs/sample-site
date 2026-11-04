---
name: filebutton
description: A button that opens the native file picker (Mantine FileButton). `label` is
  the button text; `accept` limits file types (e.g. "image/png,image/jpeg") and
  `multiple` allows selecting several. Demo only — it shows the chosen file name but does
  not upload. Customize the Button look (variant, color, size, radius).
params:
  label: string
  accept: string
  multiple: { type: bool, default: false }
  variant: string
  color: string
  size: string
  radius: string
body: python
---
```python
# Mantine's FileButton is a render-prop component (children is a function that gets an onClick to
# open the picker), which a build-time macro can't author — so the FileButton island
# (FileButton.jsx) supplies the default render (a Button that opens the picker and
# shows the chosen name). Unset props are omitted so the island's / Mantine's defaults apply.
_props = {}
if label: _props['label'] = label
if accept: _props['accept'] = accept
if multiple: _props['multiple'] = True
if variant: _props['variant'] = variant
if color: _props['color'] = color
if size: _props['size'] = size
if radius: _props['radius'] = radius
if attr: _props['attr'] = attr
print(snippet('FileButton', **_props))
```
