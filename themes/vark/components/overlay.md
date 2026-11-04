---
name: overlay
description: A dimming layer over a box — for spotlighting content, a hover scrim, or a
  disabled state. Set `color`, `backgroundOpacity` (0–1), `blur` (px backdrop blur),
  `radius`, and `zIndex`; or a `gradientFrom`/`gradientTo`/`gradientDeg` gradient
  instead of a flat color. The block body renders centered on top of the veil. Close
  with {% endOverlay %}.
params:
  color: string
  backgroundOpacity: float
  blur: float
  radius: string
  zIndex: int
  gradientFrom: string
  gradientTo: string
  gradientDeg: int
body: python
---
```python
# Forwards to the Overlay island, which wraps Mantine's <Overlay> in a
# positioned box so it's visible inline (Overlay alone fills its nearest positioned
# ancestor — unpredictable on a doc page). Each field maps to a Mantine Overlay prop;
# unset props are omitted so Mantine's defaults apply. The three gradient* params
# compose Mantine's `gradient` CSS string (a linear-gradient), which Overlay uses in
# place of a flat color when set.
props = {}
if backgroundOpacity is not None: props['backgroundOpacity'] = backgroundOpacity
if blur is not None: props['blur'] = blur
if radius: props['radius'] = radius
if zIndex is not None: props['zIndex'] = zIndex
# color and gradient are mutually exclusive — Mantine's Overlay takes either a flat `color` OR a
# `gradient` CSS string (a linear-gradient), not both; a requested gradient wins.
if gradientFrom or gradientTo or gradientDeg is not None:
    frm = gradientFrom or 'rgba(0, 0, 0, 0.6)'
    to = gradientTo or 'rgba(0, 0, 0, 0.0)'
    deg = gradientDeg if gradientDeg is not None else 90
    props['gradient'] = f'linear-gradient({deg}deg, {frm}, {to})'
elif color:
    props['color'] = color
if attr: props['attr'] = attr
# The block body renders centered over the veil — bracket it with blank lines so the single
# Markdown pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal
# inside the island's one-line <div> (the block-component convention). An empty/self-closing body
# stays '' so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Overlay', children=_body, **props))
```
