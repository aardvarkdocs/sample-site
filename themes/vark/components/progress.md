---
name: progress
description: A progress bar. The simple form takes a single `value` (0–100) plus `color`,
  `size`, `radius`, and the `striped` / `animated` toggles. For a multi-segment bar, pass
  `sections` as a JSON array of objects (e.g. `[{"value":35,"color":"cyan"},{"value":20,"color":"orange"}]`)
  — each object accepts `value`, `color`, `striped`, and `animated`.
params:
  value: float
  color: string
  size: string
  radius: string
  striped: { type: bool, default: false }
  animated: { type: bool, default: false }
  sections: string
body: python
---
```python
# Two shapes share one tag. With `sections` (a JSON array), the bar is multi-segment and
# renders through the ProgressRoot island (ProgressRoot.jsx), which builds the
# Progress.Root / Progress.Section compound tree — that can't be expressed on the flat JSON
# props channel of a single component('Progress', ...) call (and ProgressRoot keeps it distinct
# from the simple native Progress). Without it, the simple single-`value` form forwards straight
# to Mantine's native Progress. Either way unset
# props are omitted so Mantine's defaults apply (size 'md', value 0). Numeric props are
# tested against None so a deliberate 0 survives.
import json as _json
if sections:
    try:
        _sections = _json.loads(sections)
    except (ValueError, TypeError):
        _sections = None
    if not isinstance(_sections, list):
        # Bad/empty JSON: degrade to a visible build-time comment rather than a crash,
        # matching Aardvark's unknown-component behavior.
        print("<!-- aardvark: progress `sections` must be a JSON array of "
              "{value, color, striped?, animated?} objects -->")
    else:
        _props = {'sections': _sections}
        if size: _props['size'] = size
        if radius: _props['radius'] = radius
        if attr: _props['attr'] = attr
        print(snippet('ProgressRoot', **_props))
else:
    _props = {}
    if value is not None: _props['value'] = value
    if color: _props['color'] = color
    if size: _props['size'] = size
    if radius: _props['radius'] = radius
    if striped: _props['striped'] = True
    if animated: _props['animated'] = True
    if attr: _props['attr'] = attr
    print(component('Progress', **_props))
```
