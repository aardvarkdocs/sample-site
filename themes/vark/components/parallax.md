---
name: parallax
description: A Community Component (wraps @gfazioli/mantine-parallax, MIT) that tilts the
  block body in 3D toward the pointer for a parallax effect. Tune the motion with
  `maxRotation`, `perspective`, `hoverScale`, `transitionDuration`, `transitionEasing`, and
  `resetOnLeave`. Layer on `lightEffect`, `glareEffect`, and `shadowEffect` (with their
  color/size props) for shine and depth, `springEffect` for a bouncy feel, and
  `gyroscopeEnabled`/`keyboardEnabled` for non-pointer control. Close with {% endParallax %}.
params:
  disabled: { type: bool, default: false }
  perspective: int
  maxRotation: float
  hoverScale: float
  threshold: float
  transitionDuration: int
  transitionEasing: string
  touchEnabled: { type: bool, default: true }
  resetOnLeave: { type: bool, default: true }
  invertRotation: { type: bool, default: false }
  lightEffect: { type: bool, default: false }
  lightColor: string
  lightIntensity: float
  glareEffect: { type: bool, default: false }
  glareColor: string
  glareMaxOpacity: float
  shadowEffect: { type: bool, default: false }
  shadowColor: string
  shadowBlur: float
  springEffect: { type: bool, default: false }
  springStiffness: float
  springDamping: float
  gyroscopeEnabled: { type: bool, default: false }
  keyboardEnabled: { type: bool, default: false }
  w: string
  h: string
body: python
---
```python
# Renders the Parallax island (Parallax.jsx), which wraps @gfazioli/mantine-parallax. Every
# prop passes straight through to Parallax (which validates the values); unset props are
# omitted so the package defaults apply. Numeric params are typed (int/float) and bool
# toggles are bool, so a bare flag like `lightEffect` is a real True, never the "True"
# string trap. The block body is the content to tilt.
props = {}
if disabled: props['disabled'] = True
if perspective is not None: props['perspective'] = perspective
if maxRotation is not None: props['maxRotation'] = maxRotation
if hoverScale is not None: props['hoverScale'] = hoverScale
if threshold is not None: props['threshold'] = threshold
if transitionDuration is not None: props['transitionDuration'] = transitionDuration
if transitionEasing: props['transitionEasing'] = transitionEasing
# touchEnabled / resetOnLeave default to True in the package; expose turning them OFF
# (the table.md::withRowBorders pattern) — `if x:` would never emit the False that disables them.
if touchEnabled is False: props['touchEnabled'] = False
if resetOnLeave is False: props['resetOnLeave'] = False
if invertRotation: props['invertRotation'] = True
if lightEffect: props['lightEffect'] = True
if lightColor: props['lightColor'] = lightColor
if lightIntensity is not None: props['lightIntensity'] = lightIntensity
if glareEffect: props['glareEffect'] = True
if glareColor: props['glareColor'] = glareColor
if glareMaxOpacity is not None: props['glareMaxOpacity'] = glareMaxOpacity
if shadowEffect: props['shadowEffect'] = True
if shadowColor: props['shadowColor'] = shadowColor
if shadowBlur is not None: props['shadowBlur'] = shadowBlur
if springEffect: props['springEffect'] = True
if springStiffness is not None: props['springStiffness'] = springStiffness
if springDamping is not None: props['springDamping'] = springDamping
if gyroscopeEnabled: props['gyroscopeEnabled'] = True
if keyboardEnabled: props['keyboardEnabled'] = True
# `w`/`h` accept a Mantine size token or a number; pass an all-digit value as an int so it
# becomes a pixel count (Mantine treats a bare number as px), else pass the token through.
if w: props['w'] = int(w) if str(w).isdigit() else w
if h: props['h'] = int(h) if str(h).isdigit() else h
# The block body is the content to tilt. Bracket with blank lines so the single Markdown
# pass renders it (paragraphs, headings, emphasis) rather than swallowing it as raw HTML.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Parallax', children=_body, attr=attr, **props))
```
