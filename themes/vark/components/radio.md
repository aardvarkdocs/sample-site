---
name: radio
description: A single radio button with a label. Set `label` (or the block body),
  `defaultChecked`, plus the usual `color`, `size`, `disabled`, `labelPosition` (left /
  right), and `description`/`error` helper text. For a group, give several radios the same
  `name`. Mounts as an interactive island.
params:
  label: string
  description: string
  error: string
  name: string
  value: string
  defaultChecked: { type: bool, default: false }
  disabled: { type: bool, default: false }
  color: string
  size: string
  labelPosition: string
  iconColor: string
  autoContrast: { type: bool, default: false }
body: python
---
```python
# Mirrors checkbox.md: optional props, unset values omitted so Mantine's defaults apply;
# `label` falls back to the block body. Give several radio tags the same `name` to make
# them mutually exclusive (standard HTML radio-group behavior). Uncontrolled here, so
# `defaultChecked` picks the initially selected option. The label (either form) is PLAIN
# TEXT — it rides Mantine's `label` prop as a string, so Markdown in the block body is NOT
# rendered (`**bold**` shows literal asterisks); see checkbox.md.
props = {}
_label = label or children
if _label: props['label'] = _label
if description: props['description'] = description
if error: props['error'] = error
if name: props['name'] = name
if value: props['value'] = value
if defaultChecked: props['defaultChecked'] = True
if disabled: props['disabled'] = True
if color: props['color'] = color
if size: props['size'] = size
if labelPosition: props['labelPosition'] = labelPosition
if iconColor: props['iconColor'] = iconColor
if autoContrast: props['autoContrast'] = True
if attr: props['attr'] = attr
print(component('Radio', **props))
```
