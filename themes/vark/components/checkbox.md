---
name: checkbox
description: A single checkbox with a label. Set `label` (or the block body), `defaultChecked`,
  plus the usual `color`, `size`, `radius`, `disabled`, `indeterminate`, `labelPosition`
  (left / right), and `description`/`error` helper text. Mounts as an interactive island.
params:
  label: string
  description: string
  error: string
  defaultChecked: { type: bool, default: false }
  indeterminate: { type: bool, default: false }
  disabled: { type: bool, default: false }
  color: string
  size: string
  radius: string
  labelPosition: string
  iconColor: string
  autoContrast: { type: bool, default: false }
body: python
---
```python
# Mirrors badge.md / rating.md: every prop is optional and unset (None / '' / False)
# values are omitted so Mantine's own defaults apply. `label` falls back to the block
# body so the block form (checkbox … endCheckbox wrapping a label) works too. Checkbox is uncontrolled here
# (no form wiring), so `defaultChecked` sets the initial state the reader can toggle.
# The label (either form) is PLAIN TEXT — it rides Mantine's `label` prop as a string, so
# Markdown in the block body is NOT rendered (`**bold**` shows literal asterisks). Keep it a
# short plain label; for anything richer, build the control with component('Checkbox', …) directly.
props = {}
_label = label or children
if _label: props['label'] = _label
if description: props['description'] = description
if error: props['error'] = error
if defaultChecked: props['defaultChecked'] = True
if indeterminate: props['indeterminate'] = True
if disabled: props['disabled'] = True
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if labelPosition: props['labelPosition'] = labelPosition
if iconColor: props['iconColor'] = iconColor
if autoContrast: props['autoContrast'] = True
if attr: props['attr'] = attr
print(component('Checkbox', **props))
```
