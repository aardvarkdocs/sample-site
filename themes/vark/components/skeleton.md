---
name: skeleton
description: A loading placeholder — a shimmering grey block standing in for content that
  hasn't loaded. Set `height` and `width` (numbers are px, or any CSS value), `radius`,
  toggle `circle` (a round avatar placeholder), and control `visible` and `animate`.
  Wrap content as the block body and it shows through once `visible=false`.
params:
  height: string
  width: string
  radius: string
  circle: { type: bool, default: false }
  visible: { type: bool, default: true }
  animate: { type: bool, default: true }
body: python
---
```python
# Mirrors button.md: dimensions/radius pass straight through to Mantine (which validates
# them) and unset ones are omitted so Mantine's defaults apply (width 100%, height auto).
# circle/visible/animate are real booleans whose Mantine defaults are False/True/True, so
# they're always forwarded (not just when truthy) — otherwise visible=false / animate=false
# from the author would be silently dropped. Numbers given as strings ('40') are converted
# to rem by Mantine, matching its own numeric-prop behavior.
props = {}
if height: props['height'] = height
if width: props['width'] = width
if radius: props['radius'] = radius
if circle: props['circle'] = True
props['visible'] = visible
props['animate'] = animate
if attr: props['attr'] = attr
# The block body is the content the skeleton stands in for (shown once visible=false) — bracket it
# with blank lines so the single Markdown pass renders any prose (paragraphs, emphasis, links,
# lists) rather than leaving it literal inside the island's one-line <div> (the block-component
# convention). A lone nested island still passes through fine. An empty/self-closing body (the
# bare-dimension placeholder, the common case) stays '' so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Skeleton', children=_body, **props))
```
