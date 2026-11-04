---
name: depthselect
description: A Community Component — a 3D "Time Machine"-style stack select where cards recede
  into depth and you riffle through them (wraps @gfazioli/mantine-depth-select). Give the cards
  via `data` (a JSON array of `{value, view}`, where `view` is the card's text/content), set
  `visibleCards`, and tune the depth look with `scaleStep`, `translateYStep`, `opacityStep`, and
  `blurStep`. Toggle `withControls` / `withScrollNavigation` / `loop`, and set `controlsPosition`,
  `transitionDuration` (ms), and `defaultValue`. Hydrates as an interactive island.
params:
  data: string
  defaultValue: string
  visibleCards: int
  controlsPosition: string
  transitionDuration: int
  scaleStep: float
  translateYStep: int
  opacityStep: float
  blurStep: int
  ariaLabel: string
  withControls: { type: bool, default: true }
  withScrollNavigation: { type: bool, default: true }
  loop: { type: bool, default: false }
body: python
---
```python
# Renders the DepthSelect island (DepthSelect.jsx), a thin wrapper over
# @gfazioli/mantine-depth-select. `data` is a JSON array of {value, view} cards, parsed here;
# `view` is the card content (a string renders verbatim). A malformed array warns and degrades
# to an empty stack. Unset (None/'') props are omitted so the upstream defaults apply; the bool
# toggles default-on (withControls/withScrollNavigation) are forwarded only when turned off.
import json as _json
import aardvark.components as av
_cards = []
if data:
    try:
        _v = _json.loads(data)
        if isinstance(_v, list):
            _cards = _v
        else:
            av.warn("depthselect: data must be a JSON array of {value, view} cards — using an empty stack")
    except (ValueError, TypeError):
        av.warn("depthselect: data is not valid JSON — using an empty stack; check the value")
_props = {'data': _cards}
if defaultValue: _props['defaultValue'] = defaultValue
if visibleCards is not None: _props['visibleCards'] = visibleCards
if controlsPosition: _props['controlsPosition'] = controlsPosition
if transitionDuration is not None: _props['transitionDuration'] = transitionDuration
if scaleStep is not None: _props['scaleStep'] = scaleStep
if translateYStep is not None: _props['translateYStep'] = translateYStep
if opacityStep is not None: _props['opacityStep'] = opacityStep
if blurStep is not None: _props['blurStep'] = blurStep
if ariaLabel: _props['ariaLabel'] = ariaLabel
if not withControls: _props['withControls'] = False
if not withScrollNavigation: _props['withScrollNavigation'] = False
if loop: _props['loop'] = True
print(component('DepthSelect', attr=attr, **_props))
```
