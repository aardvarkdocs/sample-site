---
name: chip
description: A chip — a checkbox/radio styled as a pill. The label is the block body or a
  `text` param. Set `variant` (filled / light / outline), `color`, `size`, `radius`,
  `defaultChecked`, `disabled`, and `type` (checkbox / radio). Mounts as an interactive
  island.
params:
  text: string
  variant: string
  color: string
  size: string
  radius: string
  type: string
  defaultChecked: { type: bool, default: false }
  disabled: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
body: python
---
```python
# Mirrors badge.md: optional props, unset values omitted so Mantine's defaults apply; the
# label is the block body or the `text` param. Uncontrolled here, so `defaultChecked` sets
# whether the chip starts selected. `type` is 'checkbox' (default) or 'radio'.
props = {}
if variant: props['variant'] = variant
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if type: props['type'] = type
if defaultChecked: props['defaultChecked'] = True
if disabled: props['disabled'] = True
if autoContrast: props['autoContrast'] = True
if attr: props['attr'] = attr
# The inline `text=` string is HTML-escaped (a stored-XSS surface for untrusted authors);
# block-form `children` is already-rendered template output and left intact. Mirrors pill.md.
import html as _h
_label = children if children else _h.escape(text or '')
print(component('Chip', children=_label, **props))
```
