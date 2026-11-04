---
name: lensselect
description: A Community Component — a fisheye/lens magnification select where the item under the
  cursor swells like a macOS Dock icon and its neighbours scale by proximity (wraps
  @gfazioli/mantine-lens-select). Give items via `data` (a JSON array of `{value, view}`, `view`
  optional) or generate a numeric range with `count` (values 1..N) or `min`/`max`/`step`. Tune the
  lens with `magnification` and `lensRange`, set `orientation` (horizontal/vertical), `itemSize`,
  `gap`, `selectionMode` (click/hover), and `easing`. Toggle `withScale`, `withOpacity`,
  `withBlur`, `expandOnHover`, `withWheel`, `loop`, and `withIndicator`. Hydrates as an
  interactive island.
params:
  data: string
  defaultValue: string
  count: int
  min: float
  max: float
  step: float
  precision: int
  orientation: string
  magnification: float
  lensRange: int
  itemSize: string
  gap: string
  selectionMode: string
  easing: string
  transitionDuration: int
  pillColor: string
  hoverColor: string
  activeColor: string
  pillRadius: string
  ariaLabel: string
  withScale: { type: bool, default: true }
  withOpacity: { type: bool, default: false }
  withBlur: { type: bool, default: false }
  expandOnHover: { type: bool, default: false }
  withWheel: { type: bool, default: false }
  loop: { type: bool, default: false }
  withIndicator: { type: bool, default: false }
body: python
---
```python
# Renders the LensSelect island (LensSelect.jsx), a thin wrapper over
# @gfazioli/mantine-lens-select. Items come either from `data` (a JSON array of {value, view},
# parsed here — `view` is optional and renders verbatim when a string) or from the generated
# numeric range (count / min / max / step). A malformed `data` warns and degrades to no items
# (so the count/range path can still take over). Unset (None/'') props are omitted so the
# upstream defaults apply; withScale defaults on, so it's forwarded only when turned off.
import json as _json
import aardvark.components as av
_props = {}
if data:
    try:
        _v = _json.loads(data)
        if isinstance(_v, list):
            _props['data'] = _v
        else:
            av.warn("lensselect: data must be a JSON array of {value, view} items — ignoring it")
    except (ValueError, TypeError):
        av.warn("lensselect: data is not valid JSON — ignoring it; check the value")
if defaultValue: _props['defaultValue'] = defaultValue
if count is not None: _props['count'] = count
if min is not None: _props['min'] = min
if max is not None: _props['max'] = max
if step is not None: _props['step'] = step
if precision is not None: _props['precision'] = precision
if orientation: _props['orientation'] = orientation
if magnification is not None: _props['magnification'] = magnification
if lensRange is not None: _props['lensRange'] = lensRange
if itemSize: _props['itemSize'] = itemSize
if gap: _props['gap'] = gap
if selectionMode: _props['selectionMode'] = selectionMode
if easing: _props['easing'] = easing
if transitionDuration is not None: _props['transitionDuration'] = transitionDuration
if pillColor: _props['pillColor'] = pillColor
if hoverColor: _props['hoverColor'] = hoverColor
if activeColor: _props['activeColor'] = activeColor
if pillRadius: _props['pillRadius'] = pillRadius
if ariaLabel: _props['ariaLabel'] = ariaLabel
if not withScale: _props['withScale'] = False
if withOpacity: _props['withOpacity'] = True
if withBlur: _props['withBlur'] = True
if expandOnHover: _props['expandOnHover'] = True
if withWheel: _props['withWheel'] = True
if loop: _props['loop'] = True
if withIndicator: _props['withIndicator'] = True
print(component('LensSelect', attr=attr, **_props))
```
