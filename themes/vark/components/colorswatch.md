---
name: colorswatch
description: A swatch that displays a single color — a disc unless `radius` squares it off.
  Set `color` (any CSS color value — `#fff`, `rgba(...)`, a named color, etc.; required),
  `size` (any CSS value, numbers are rem), `radius` (xs–xl or any CSS value), and `withShadow` (an inner box-shadow, on by
  default — set `withShadow=false` to remove it). An optional block body renders inside the
  swatch (e.g. a check icon to mark it selected).
params:
  color: { type: string, required: true }
  size: string
  radius: string
  withShadow: { type: bool, default: true }
body: python
---
```python
# Mirrors badge.md / image.md: `color` always passes through; `size` and `radius` are
# omitted when None/empty so Mantine's own defaults apply. `withShadow` defaults to true in
# Mantine, so only forward it when the author turns it OFF — passing withShadow=True is a
# harmless no-op but forwarding the False is the case that actually changes the render.
props = {}
if size: props['size'] = size
if radius: props['radius'] = radius
if not withShadow: props['withShadow'] = False
# An optional body renders inside the swatch; with none, children stays None.
print(component('ColorSwatch', color=color, children=(children or None), attr=attr, **props))
```
