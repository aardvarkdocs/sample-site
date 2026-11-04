---
name: borderAnimate
description: An animated border around any content — a Community Component wrapping
  @gfazioli/mantine-border-animate. Set `variant` (beam, glow, pulse), `beamMode` (dot,
  wedge, comet), `size` (xs–xl, the dot's size), `spread` (the wedge's width in degrees),
  `duration` (seconds), the gradient colors `colorFrom` / `colorTo`, `radius`, `blur` (xs–xl,
  glow softness), `progress` (0–100, where a static effect sits), `borderWidth`,
  `borderOpacity`, and the `withMask` / `pauseOnHover` toggles. The wrapped content is the
  block body. Close with {% endBorderAnimate %}.
params:
  variant: string
  beamMode: string
  size: string
  spread: float
  duration: float
  colorFrom: string
  colorTo: string
  radius: string
  blur: string
  progress: float
  borderWidth: string
  borderOpacity: float
  withMask: bool
  pauseOnHover: { type: bool, default: false }
  animate: { type: bool, default: true }
body: python
---
```python
# Renders the BorderAnimate island (BorderAnimate.jsx), which wraps
# @gfazioli/mantine-border-animate's BorderAnimate. Every prop passes straight through to the
# package; unset props are omitted so the package's own defaults apply. Numeric params are
# tested against None so an explicit 0 (e.g. progress=0, borderOpacity=0) survives.
import aardvark.components as av

_props = {}
if variant: _props['variant'] = variant
# The package renders nothing for a beam mode it doesn't know, and v3 renamed both v2 modes
# (path -> dot, conic -> wedge), so an unknown value would ship a border with no beam. Warn
# and fall back to the package default instead.
if beamMode in ('dot', 'wedge', 'comet'):
    _props['beamMode'] = beamMode
elif beamMode:
    av.warn(
        f"borderAnimate: beamMode {beamMode!r} isn't a beam mode — use dot, wedge or comet "
        "(path is now dot, conic is now wedge); using the default dot"
    )
if size: _props['size'] = size
if spread is not None: _props['spread'] = spread
if duration is not None: _props['duration'] = duration
if colorFrom: _props['colorFrom'] = colorFrom
if colorTo: _props['colorTo'] = colorTo
if radius: _props['radius'] = radius
if blur: _props['blur'] = blur
if progress is not None: _props['progress'] = progress
if borderWidth: _props['borderWidth'] = borderWidth
if borderOpacity is not None: _props['borderOpacity'] = borderOpacity
# withMask's package default depends on the variant (off for glow, on otherwise), so it is
# forwarded only when the author sets it. animate defaults ON for every variant; forward it
# explicitly so an `animate=false` override reaches the package. pauseOnHover defaults OFF.
if withMask is not None: _props['withMask'] = withMask
_props['animate'] = bool(animate)
if pauseOnHover: _props['pauseOnHover'] = True
# The wrapped content is the block body. Bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, nested components) rather than swallowing it as raw
# HTML — same trick as blockquote/aside.
_body = "\n\n" + (children or '') + "\n\n"
print(component('BorderAnimate', children=_body, attr=attr, **_props))
```
