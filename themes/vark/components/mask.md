---
name: mask
description: A cursor-follow spotlight mask (Community Component — Mantine Mask by
  gfazioli). Reveals the block body through a soft radial or linear gradient that tracks the
  pointer. Set `variant` (radial / linear), `withCursorMask` to make the spotlight follow the
  cursor, `activation` (always / hover / focus / pointer), `maskRadius` (px or CSS length),
  `maskOpacity` (0-1), `maskFeather` (0 = hard edge, 100 = full fade), `invertMask` to hide
  the center instead, plus `animation` (lerp / none) and `easing`. Distinct from the
  `maskinput` text-input component. Close with {% endMask %}.
params:
  variant: string
  activation: string
  animation: string
  maskAngle: string
  maskRadius: string
  maskRadiusX: string
  maskRadiusY: string
  maskOpacity: float
  maskFeather: float
  maskTransparencyStart: float
  maskTransparencyEnd: float
  maskX: float
  maskY: float
  easing: float
  cursorOffsetX: float
  cursorOffsetY: float
  clampPadding: float
  withCursorMask: { type: bool, default: false }
  trackPointerOnDocument: { type: bool, default: false }
  invertMask: { type: bool, default: false }
  clampToBounds: { type: bool, default: false }
  recenterOnResize: { type: bool, default: false }
  recenterOnChildrenChange: { type: bool, default: false }
body: python
---
```python
# Renders the Mask island (Mask.jsx), which wraps Mantine's Mask from
# @gfazioli/mantine-mask (a Community Component). Every prop is scalar, so it passes
# straight through to Mantine (which validates the values); unset props are omitted so
# Mantine's defaults apply. The block body is the content the spotlight reveals.
props = {}
# String pass-through props (None/'' omitted).
for _k, _v in (
    ('variant', variant), ('activation', activation), ('animation', animation),
    ('maskAngle', maskAngle), ('maskRadius', maskRadius),
    ('maskRadiusX', maskRadiusX), ('maskRadiusY', maskRadiusY),
):
    if _v: props[_k] = _v
# Numeric pass-through props (kept when set; `is not None` so a meaningful 0 survives).
for _k, _v in (
    ('maskOpacity', maskOpacity), ('maskFeather', maskFeather),
    ('maskTransparencyStart', maskTransparencyStart), ('maskTransparencyEnd', maskTransparencyEnd),
    ('maskX', maskX), ('maskY', maskY), ('easing', easing),
    ('cursorOffsetX', cursorOffsetX), ('cursorOffsetY', cursorOffsetY),
    ('clampPadding', clampPadding),
):
    if _v is not None: props[_k] = _v
# Boolean flags: forwarded only when turned ON (all default False), so props stays minimal.
if withCursorMask: props['withCursorMask'] = True
if trackPointerOnDocument: props['trackPointerOnDocument'] = True
if invertMask: props['invertMask'] = True
if clampToBounds: props['clampToBounds'] = True
if recenterOnResize: props['recenterOnResize'] = True
if recenterOnChildrenChange: props['recenterOnChildrenChange'] = True
# The block body is the masked content. Bracket it with blank lines so the single Markdown
# pass renders it as Markdown (paragraphs, emphasis, nested components) — same trick as
# blockquote.md.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Mask', children=_body, attr=attr, **props))
```
