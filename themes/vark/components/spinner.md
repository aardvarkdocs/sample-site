---
name: spinner
description: An SVG loading spinner (Community Component, @gfazioli/mantine-spinner). Set
  `variant` (fade, pulse, grow, trail), `segments` (count), `segmentShape` (line, dot,
  arc), `size`, `thickness`, `color`, `direction` (clockwise, counter-clockwise),
  `duration`, `glow`, and `progress` (0–100) for a determinate spinner. Pass `gradientFrom`
  / `gradientTo` for a two-colour gradient. An optional body (e.g. a percentage label)
  renders inside. Close with {% endSpinner %}.
params:
  variant: string
  segments: int
  segmentShape: string
  size: string
  thickness: float
  inner: float
  color: string
  direction: string
  duration: float
  glow: float
  progress: float
  minOpacity: float
  hueRotate: { type: bool, default: false }
  gradientFrom: string
  gradientTo: string
body: python
---
```python
# Renders the Spinner island (Spinner.jsx), which wraps @gfazioli/mantine-spinner's
# `Spinner`. Every prop is optional and unset ones are omitted so the package's own
# defaults apply. Numeric props are tested against None so a deliberate 0 (e.g. progress=0,
# glow=0) survives. `gradientFrom`/`gradientTo` compose the package's `gradient={from,to}`
# object. `attr` forwards raw HTML attributes onto the root.
props = {}
if variant: props['variant'] = variant
if segments is not None: props['segments'] = segments
if segmentShape: props['segmentShape'] = segmentShape
if size: props['size'] = size
if thickness is not None: props['thickness'] = thickness
if inner is not None: props['inner'] = inner
if color: props['color'] = color
if direction: props['direction'] = direction
if duration is not None: props['duration'] = duration
if glow is not None: props['glow'] = glow
if progress is not None: props['progress'] = progress
if minOpacity is not None: props['minOpacity'] = minOpacity
if hueRotate: props['hueRotate'] = True
if gradientFrom or gradientTo:
    gradient = {}
    if gradientFrom: gradient['from'] = gradientFrom
    if gradientTo: gradient['to'] = gradientTo
    props['gradient'] = gradient
if attr: props['attr'] = attr
# The body is an optional centred label (e.g. a progress percentage). Block-form children
# is already-rendered template output and left intact; an empty body is dropped so the
# package renders a plain spinner.
print(component('Spinner', children=(children or ''), **props))
```
