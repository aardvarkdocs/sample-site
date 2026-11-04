---
name: loader
description: A loading indicator. Set `type` (oval, bars, dots), `size` (xs–xl or a
  number of px), and `color` (any theme color or CSS value). Takes no children — drop
  it in place wherever something is loading.
params:
  type: string
  size: string
  color: string
body: python
---
```python
# Mirrors button.md: every prop is optional and unset ones are omitted so Mantine's
# own defaults apply (type 'oval', size 'md'). Loader renders SVG/CSS spinners and
# takes no children, so the body passes props only. `attr` forwards raw HTML
# attributes onto the root, exactly like component('Loader', attr=...).
props = {}
if type: props['type'] = type
if size: props['size'] = size
if color: props['color'] = color
if attr: props['attr'] = attr
print(component('Loader', **props))
```
