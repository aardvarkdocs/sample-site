---
name: badge
description: A badge for labels, statuses, and counts. Set `variant` (filled, light,
  outline, dot, transparent, white, default, gradient), plus the usual badge fields
  (color, size, radius, fullWidth, circle, autoContrast). For `variant='gradient'`, set
  any of `gradientFrom`, `gradientTo`, `gradientDeg`. `leftSection`/`rightSection` take
  text. The label is the block body or a `text` param.
params:
  text: string
  variant: string
  color: string
  size: string
  radius: string
  fullWidth: { type: bool, default: false }
  circle: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
  leftSection: string
  rightSection: string
  gradientFrom: string
  gradientTo: string
  gradientDeg: int
body: python
---
```python
# Mirrors button.md: every prop passes straight through to Mantine
# (it validates the values); unset props are omitted so Mantine's own defaults apply.
# The three gradient* params compose Mantine's `gradient={from,to,deg}` object (used
# when variant='gradient'). leftSection/rightSection arrive as text — a build-time macro
# can't construct a React icon element.
props = {}
if variant: props['variant'] = variant
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if fullWidth: props['fullWidth'] = True
if circle: props['circle'] = True
if autoContrast: props['autoContrast'] = True
if leftSection: props['leftSection'] = leftSection
if rightSection: props['rightSection'] = rightSection
if gradientFrom or gradientTo or gradientDeg is not None:
    gradient = {}
    if gradientFrom: gradient['from'] = gradientFrom
    if gradientTo: gradient['to'] = gradientTo
    if gradientDeg is not None: gradient['deg'] = gradientDeg
    props['gradient'] = gradient
if attr: props['attr'] = attr
# The inline `text=` string is HTML-escaped (a stored-XSS surface for untrusted authors —
# the collector embeds children as raw HTML), while block-form `children` is already-rendered
# template output and left intact. Mirrors pill.md / button.md.
import html as _h
_label = children if children else _h.escape(text or '')
print(component('Badge', children=_label, **props))
```
