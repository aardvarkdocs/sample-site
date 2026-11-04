---
name: copybutton
description: A button that copies a value to the clipboard (Mantine CopyButton). Set
  `value` to the text to copy; the button swaps its label to a confirmation for a moment
  after a copy. Customize `label`, `copiedLabel`, `timeout`, and the Button look
  (variant, color, size, radius).
params:
  value: string
  label: string
  copiedLabel: string
  timeout: int
  variant: string
  color: string
  size: string
  radius: string
body: python
---
```python
# Mantine's CopyButton is a render-prop component (children is a function), which a build-time macro
# can't author — so the CopyButton island (CopyButton.jsx) supplies the default
# render (a Button + Tooltip that copies `value` and confirms). Unset props are omitted so the
# island's / Mantine's defaults apply.
_props = {}
if value: _props['value'] = value
if label: _props['label'] = label
if copiedLabel: _props['copiedLabel'] = copiedLabel
if timeout is not None: _props['timeout'] = timeout
if variant: _props['variant'] = variant
if color: _props['color'] = color
if size: _props['size'] = size
if radius: _props['radius'] = radius
if attr: _props['attr'] = attr
print(snippet('CopyButton', **_props))
```
