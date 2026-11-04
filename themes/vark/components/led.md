---
name: led
description: An LED status indicator (Community Component, @gfazioli/mantine-led). Set
  `value` (on/off), `color` (lit color) and `offColor`, `size` (xs–xl, a number of px, or a
  CSS length), `variant` (flat,
  3d, neon, dot), and `shape` (circle, square, rectangle). Animate with `animate` plus
  `animationType` (pulse, flash, breathe, blink, glow, none). A `label` (or the block body)
  renders next to the LED, positioned with `labelPosition` (left, right). Close with
  {% endLed %}.
params:
  value: bool
  color: string
  offColor: string
  size: string
  variant: string
  shape: string
  radius: string
  animate: { type: bool, default: false }
  animationType: string
  animationDuration: float
  intensity: float
  label: string
  labelPosition: string
  tooltip: string
  gradientFrom: string
  gradientTo: string
body: python
---
```python
# Renders the Led island (Led.jsx), which wraps @gfazioli/mantine-led's
# `Led`. Mantine's Led `label` is a React node, so the island owns the label resolution
# (plain-text `label` param, else the block body); everything else passes straight through.
# Every prop is optional and unset ones are omitted so the package's own defaults apply.
# `value` is gated on `is not None` so a deliberate `value=false` (LED off) is honored
# rather than dropped like an unset prop. `gradientFrom`/`gradientTo` compose the package's
# `gradient={from,to}` object. `attr` forwards raw HTML attributes onto the root.
props = {}
if value is not None: props['value'] = value
if color: props['color'] = color
if offColor: props['offColor'] = offColor
if size: props['size'] = size
if variant: props['variant'] = variant
if shape: props['shape'] = shape
if radius: props['radius'] = radius
if animate: props['animate'] = True
if animationType: props['animationType'] = animationType
if animationDuration is not None: props['animationDuration'] = animationDuration
if intensity is not None: props['intensity'] = intensity
if label: props['label'] = label
if labelPosition: props['labelPosition'] = labelPosition
if tooltip: props['tooltip'] = tooltip
if gradientFrom or gradientTo:
    gradient = {}
    if gradientFrom: gradient['from'] = gradientFrom
    if gradientTo: gradient['to'] = gradientTo
    props['gradient'] = gradient
if attr: props['attr'] = attr
# The body is an optional label node (the island uses it when no plain-text `label` is set).
# Block-form children is already-rendered template output and left intact; an empty body is
# dropped so the LED renders with no label.
print(component('Led', children=(children or ''), **props))
```
