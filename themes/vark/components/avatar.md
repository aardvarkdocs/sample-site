---
name: avatar
description: A user avatar — an image with a graceful initials/placeholder fallback. Set
  `src` for the image; when it's missing or fails to load, Mantine shows the block body or,
  with a `name`, auto-generated initials. Set `name` (used for initials and, with
  `color='initials'`, a deterministic color), `alt`, `size` (xs–xl or any CSS value),
  `radius` (xs–xl, or '100%' for a circle — the default), `color` (any theme color or
  `initials`), `variant` (filled, light, outline, transparent, white, default, gradient),
  and `autoContrast`. For `variant='gradient'`, set any of `gradientFrom`/`gradientTo`/`gradientDeg`.
params:
  src: string
  name: string
  alt: string
  size: string
  radius: string
  color: string
  variant: string
  autoContrast: { type: bool, default: false }
  gradientFrom: string
  gradientTo: string
  gradientDeg: int
body: python
---
```python
# Mirrors badge.md: every prop passes straight through to Mantine (which validates the
# values) and unset props are omitted so Mantine's own defaults apply. The placeholder
# (shown when src is missing/broken) is the block body, or — with no body — Mantine's own
# initials-from-`name` fallback. The three gradient* params compose Mantine's
# `gradient={from,to,deg}` object (used when variant='gradient').
props = {}
if src: props['src'] = src
if name: props['name'] = name
if alt: props['alt'] = alt
if size: props['size'] = size
if radius: props['radius'] = radius
if color: props['color'] = color
if variant: props['variant'] = variant
if autoContrast: props['autoContrast'] = True
if gradientFrom or gradientTo or gradientDeg is not None:
    gradient = {}
    if gradientFrom: gradient['from'] = gradientFrom
    if gradientTo: gradient['to'] = gradientTo
    if gradientDeg is not None: gradient['deg'] = gradientDeg
    props['gradient'] = gradient
# A body is the explicit placeholder; with none, children is left None so Mantine renders
# its own initials/placeholder (passing children='' would suppress that fallback).
print(component('Avatar', children=(children or None), attr=attr, **props))
```
