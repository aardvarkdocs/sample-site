---
name: reflection
description: A Community Component (wraps @gfazioli/mantine-reflection, MIT) that paints a
  mirrored reflection beneath the block body. Turn on `ripple` for an animated water ripple
  and tune it with `rippleStrength`, `rippleFrequency`, `rippleSpeed`. Control the mirror
  with `reflectionOpacity`, `reflectionDistance`, `reflectionBlur`, and add a contact shadow
  with `shadowSize`, `shadowOpacity`, `shadowBlur`, `shadowColor`. Close with {% endReflection %}.
params:
  ripple: { type: bool, default: false }
  rippleStrength: float
  rippleFrequency: float
  rippleSpeed: float
  rippleOctaves: int
  rippleSeed: float
  reflectionDistance: float
  reflectionOpacity: float
  reflectionBlur: float
  reflectionStretch: float
  shadowSize: float
  shadowOffset: float
  shadowOpacity: float
  shadowBlur: float
  shadowColor: string
  disableChildren: { type: bool, default: false }
body: python
---
```python
# Renders the Reflection island (Reflection.jsx), which wraps
# @gfazioli/mantine-reflection. Every prop passes straight through to Reflection (which
# validates the values); unset props are omitted so the package defaults apply. Numeric
# params are typed (int/float) and bool toggles are bool, so a bare flag like `ripple` is a
# real True, never the "True" string trap. The block body is the content to reflect.
props = {}
if ripple: props['ripple'] = True
if rippleStrength is not None: props['rippleStrength'] = rippleStrength
if rippleFrequency is not None: props['rippleFrequency'] = rippleFrequency
if rippleSpeed is not None: props['rippleSpeed'] = rippleSpeed
if rippleOctaves is not None: props['rippleOctaves'] = rippleOctaves
if rippleSeed is not None: props['rippleSeed'] = rippleSeed
if reflectionDistance is not None: props['reflectionDistance'] = reflectionDistance
if reflectionOpacity is not None: props['reflectionOpacity'] = reflectionOpacity
if reflectionBlur is not None: props['reflectionBlur'] = reflectionBlur
if reflectionStretch is not None: props['reflectionStretch'] = reflectionStretch
if shadowSize is not None: props['shadowSize'] = shadowSize
if shadowOffset is not None: props['shadowOffset'] = shadowOffset
if shadowOpacity is not None: props['shadowOpacity'] = shadowOpacity
if shadowBlur is not None: props['shadowBlur'] = shadowBlur
if shadowColor: props['shadowColor'] = shadowColor
if disableChildren: props['disableChildren'] = True
# The block body is the content to reflect. Bracket with blank lines so the single Markdown
# pass renders it (paragraphs, images, emphasis) rather than swallowing it as raw HTML.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Reflection', children=_body, attr=attr, **props))
```
