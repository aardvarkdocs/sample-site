---
name: linechart
description: A line chart. Pass `data` (a JSON array of row objects) and `series` (a JSON array of
  `{name, color}` lines), set `dataKey` (the x-axis field), `h` (height, px), and toggle
  `withLegend`. Renders client-side. Close with {% endLinechart %}.
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
# The linechart tag renders Mantine's LineChart from @mantine/charts (the `charts` component
# library; client-rendered — Recharts needs live container dimensions). `data` is a JSON array of
# row objects and `series` a JSON array of {name, color}; both are parsed here so the island gets
# clean data. A malformed array warns and degrades to empty rather than aborting the build.
import json as _json
import aardvark.components as av
def _arr(s, field):
    if not s:
        return []
    try:
        v = _json.loads(s)
    except (ValueError, TypeError):
        av.warn(f"linechart: {field} is not valid JSON — using an empty array; check the value")
        return []
    if not isinstance(v, list):
        av.warn(f"linechart: {field} must be a JSON array — using an empty array")
        return []
    return v
props = {'data': _arr(data, 'data'), 'series': _arr(series, 'series')}
if dataKey: props['dataKey'] = dataKey
if h is not None: props['h'] = h
if curveType: props['curveType'] = curveType
if unit: props['unit'] = unit
if withLegend: props['withLegend'] = True
print(component('charts', 'LineChart', attr=attr, **props))
```
