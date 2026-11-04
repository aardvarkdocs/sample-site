---
name: areachart
description: An area chart. Pass `data` (a JSON array of row objects) and `series` (a JSON array of
  `{name, color}` areas), set `dataKey` (the x-axis field), `h` (height, px), `curveType`, and
  toggle `withLegend`. Renders client-side. Close with {% endAreachart %}.
params:
  data: string
  series: string
  dataKey: string
  h: { type: int, default: 300 }
  curveType: string
  unit: string
  withLegend: { type: bool, default: false }
body: python
---
```python
# The areachart tag renders Mantine's AreaChart from @mantine/charts (the `charts` component
# library; client-rendered). `data` (array of row objects) and `series` (array of {name, color})
# are JSON-parsed here; a malformed array warns and degrades to empty.
import json as _json
import aardvark.components as av
def _arr(s, field):
    if not s:
        return []
    try:
        v = _json.loads(s)
    except (ValueError, TypeError):
        av.warn(f"areachart: {field} is not valid JSON — using an empty array; check the value")
        return []
    if not isinstance(v, list):
        av.warn(f"areachart: {field} must be a JSON array — using an empty array")
        return []
    return v
props = {'data': _arr(data, 'data'), 'series': _arr(series, 'series')}
if dataKey: props['dataKey'] = dataKey
if h is not None: props['h'] = h
if curveType: props['curveType'] = curveType
if unit: props['unit'] = unit
if withLegend: props['withLegend'] = True
print(component('charts', 'AreaChart', attr=attr, **props))
```
