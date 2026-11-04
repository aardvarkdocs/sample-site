---
name: switch
description: A toggle switch with a label. Set `label` (or the block body), `defaultChecked`,
  plus `color`, `size`, `radius`, `disabled`, `labelPosition` (left / right),
  `description`/`error` helper text, and the on/off track text `onLabel` / `offLabel`
  (short strings). Mounts as an interactive island.
params:
  label: string
  description: string
  error: string
  onLabel: string
  offLabel: string
  defaultChecked: { type: bool, default: false }
  disabled: { type: bool, default: false }
  color: string
  size: string
  radius: string
  labelPosition: string
  withThumbIndicator: { type: bool, default: false }
body: python
---
```python
# Mirrors checkbox.md. `onLabel`/`offLabel` are the short strings shown inside the track
# in the on/off positions (Mantine also accepts a React node there; props travel as JSON, so
# any tag or component('Switch', …) call can pass a character but never a React element —
# a real icon component means a project snippet).
# Uncontrolled here, so `defaultChecked` sets the initial on/off state. The label (either
# form) is PLAIN TEXT — it rides Mantine's `label` prop as a string, so Markdown in the
# block body is NOT rendered (`**bold**` shows literal asterisks); see checkbox.md.
props = {}
_label = label or children
if _label: props['label'] = _label
if description: props['description'] = description
if error: props['error'] = error
if onLabel: props['onLabel'] = onLabel
if offLabel: props['offLabel'] = offLabel
if defaultChecked: props['defaultChecked'] = True
if disabled: props['disabled'] = True
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if labelPosition: props['labelPosition'] = labelPosition
# Mantine 9 defaults withThumbIndicator to TRUE (a colored dot in the thumb). Forward the
# value explicitly (not only when truthy) so the macro's default of false holds the prior
# no-indicator look AND an explicit withThumbIndicator=false is honored rather than silently
# falling back to Mantine's true default.
props['withThumbIndicator'] = bool(withThumbIndicator)
if attr: props['attr'] = attr
print(component('Switch', **props))
```
