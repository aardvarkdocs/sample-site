---
name: scene
description: A decorative animated background (Community Component — Mantine Scene by
  gfazioli). Layers effects — gradients, glow blobs, dot grids, noise grain — behind the
  block body. Turn layers on with the flags `gradient`, `glow`, `dotGrid`, `noise` (each
  takes optional color shortcuts like `glowColor`, `dotColor`, `gradientFrom`/`gradientTo`),
  or pass `layersJson` (a JSON array of `{kind, ...}` descriptors) for full control. Base
  props `fullscreen` (fixed, covers the viewport), `zIndex`, `interactive` (mouse tracking),
  `reducedMotion` (auto / always / never), and `lazy`. Close with {% endScene %}.
params:
  layersJson: string
  reducedMotion: string
  gradientFrom: string
  gradientTo: string
  gradientType: string
  glowColor: string
  dotColor: string
  zIndex: int
  interactiveEasing: float
  fullscreen: { type: bool, default: false }
  interactive: { type: bool, default: false }
  lazy: { type: bool, default: false }
  gradient: { type: bool, default: false }
  glow: { type: bool, default: false }
  dotGrid: { type: bool, default: false }
  noise: { type: bool, default: false }
body: python
---
```python
# Renders the Scene island (Scene.jsx), which wraps Mantine's Scene from
# @gfazioli/mantine-scene (a Community Component). Mantine's Scene is a compound component
# whose effects are CHILDREN (<Scene.Gradient/>, <Scene.Glow/>, …) — a build-time macro
# can't construct React children, so this hands the island a flat `layers` array and the
# island maps each entry to its Scene sub-component. The block body is the foreground content
# layered over the scene.
import json as _json
import aardvark.components as av

# Build the layer list. `layersJson` (a full JSON array of {kind, ...} descriptors, where
# `kind` is the layer type and the rest are that sub-component's props) wins when set;
# otherwise the boolean flags compose layers from a few common shortcut props. Order is
# back-to-front: gradient, glow, dotGrid, noise. `kind` (not `type`) names the layer so a
# gradient's own `type` prop (radial/linear/conic) doesn't clash with the selector.
_layers = []
if layersJson:
    try:
        _parsed = _json.loads(layersJson)
        if isinstance(_parsed, list):
            _layers = _parsed
        else:
            av.warn("scene: layersJson must be a JSON array of layer descriptors — falling back to the layer flags")
    except (ValueError, TypeError):
        av.warn("scene: layersJson is not valid JSON — falling back to the layer flags; check the value")
if not _layers:
    if gradient:
        _g = {'kind': 'gradient'}
        if gradientType: _g['type'] = gradientType  # radial / linear / conic
        if gradientFrom: _g['from'] = gradientFrom
        if gradientTo: _g['to'] = gradientTo
        _layers.append(_g)
    if glow:
        _gl = {'kind': 'glow'}
        if glowColor: _gl['color'] = glowColor
        _layers.append(_gl)
    if dotGrid:
        _d = {'kind': 'dotGrid'}
        if dotColor: _d['color'] = dotColor
        _layers.append(_d)
    if noise:
        _layers.append({'kind': 'noise'})

props = {}
if _layers: props['layers'] = _layers
if reducedMotion: props['reducedMotion'] = reducedMotion
if zIndex is not None: props['zIndex'] = zIndex
if interactiveEasing is not None: props['interactiveEasing'] = interactiveEasing
if fullscreen: props['fullscreen'] = True
if interactive: props['interactive'] = True
if lazy: props['lazy'] = True

# The block body is the foreground content. Bracket with blank lines so it renders as
# Markdown (same trick as blockquote.md / mask.md).
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Scene', children=_body, attr=attr, **props))
```
