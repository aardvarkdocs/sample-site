---
name: barchart
description: A bar chart. Pass `data` (a JSON array of row objects) and `series` (a JSON array of
  `{name, color}` bars), set `dataKey` (the x-axis field), `h` (height, px), and toggle
  `withLegend`. Renders client-side. Close with {% endBarchart %}.
params:
  data: string
  series: string
  dataKey: string
  h: { type: int, default: 300 }
  unit: string
  withLegend: { type: bool, default: false }
body: python
---
```python
# The barchart tag renders Mantine's BarChart from @mantine/charts (the `charts` component
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
        av.warn(f"barchart: {field} is not valid JSON — using an empty array; check the value")
        return []
    if not isinstance(v, list):
        av.warn(f"barchart: {field} must be a JSON array — using an empty array")
        return []
    return v
props = {'data': _arr(data, 'data'), 'series': _arr(series, 'series')}
if dataKey: props['dataKey'] = dataKey
if h is not None: props['h'] = h
if unit: props['unit'] = unit
if withLegend: props['withLegend'] = True
print(component('charts', 'BarChart', attr=attr, **props))
```
