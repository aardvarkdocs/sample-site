---
name: affix
description: Pins its content to a fixed spot in the viewport (it stays put as the page
  scrolls) — handy for a "back to top" button or a floating action. Set `position`
  (a corner like bottom-right, or any combination of top/bottom/left/right) and the
  pixel `offset` from those edges; `zIndex` controls stacking. The block body is the
  pinned content. Close with {% endAffix %}.
params:
  position: { type: string, default: bottom-right }
  offset: { type: int, default: 20 }
  zIndex: int
body: python
---
```python
# Forwards straight to Mantine's <Affix> (it pins children to the viewport). Affix's
# `position` prop is an object of CSS offsets ({top/bottom/left/right}); the friendly
# corner string here (e.g. 'bottom-right') is parsed into that object so an author
# needn't write CSS. `offset` (px) is the distance from each named edge. An unset
# zIndex is omitted so Mantine's default applies.
parts = {p.strip().lower() for p in position.replace('-', ' ').split()}
pos = {}
if 'top' in parts: pos['top'] = offset
if 'bottom' in parts or not (parts & {'top', 'bottom'}): pos['bottom'] = offset
if 'left' in parts: pos['left'] = offset
if 'right' in parts or not (parts & {'left', 'right'}): pos['right'] = offset
props = {'position': pos}
if zIndex is not None: props['zIndex'] = zIndex
if attr: props['attr'] = attr
# The block body is the pinned content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Affix', children=_body, **props))
```
