---
name: scrollbuttons
description: A horizontal scroll container with prev/next buttons — the content scrolls
  sideways and overlay chevron controls appear at each edge to page through it (handy for
  card rows, image strips, or tab-like rails). Set `scrollAmount` (pixels per button click),
  `controlSize` (button size), `edgeGradientColor` (the fade behind the controls),
  `draggable`, and `showStartControl` / `showEndControl` to pin a control on. The block body
  is the row of (wide) children. Close with {% endScrollbuttons %}.
params:
  scrollAmount: int
  controlSize: string
  edgeGradientColor: string
  draggable: { type: bool, default: true }
  showStartControl: { type: bool, default: false }
  showEndControl: { type: bool, default: false }
body: python
---
```python
# The scrollbuttons tag renders Mantine 9's native Scroller — a horizontal scroll region that
# overlays prev/next chevron buttons at the edges so readers can page a wide row of content. It is
# a real @mantine/core export, so it resolves on the default mantine source (no theme library
# needed). Unset (None/''/False) props are filtered so Mantine's own defaults apply, EXCEPT the two
# bool flags below: draggable defaults to True in Mantine and is only worth forwarding when the
# author turns it off, while showStartControl / showEndControl default to False and are only
# forwarded when turned on. controlSize accepts a number or a CSS length; it arrives here as a
# string and passes straight through. The block body is the scrolling content, wrapped in blank
# lines so the single Markdown pass renders it (the block-component convention). attr= forwards raw
# HTML attributes onto the rendered element.
_candidate = {
    'scrollAmount': scrollAmount,
    'controlSize': controlSize,
    'edgeGradientColor': edgeGradientColor,
    'showStartControl': showStartControl,
    'showEndControl': showEndControl,
}
_props = {k: v for k, v in _candidate.items() if v not in (None, '', False)}
# draggable is True by default in Mantine, so only forward it when explicitly disabled.
if not draggable:
    _props['draggable'] = False
_body = "\n\n" + (children or '') + "\n\n"
print(component('Scroller', children=_body, attr=attr, **_props))
```
