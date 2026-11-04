---
name: donutchart
description: A donut chart. Pass `data` as a JSON array of `{name, value, color}` segments; set
  `size` and `thickness` (px), an optional center `chartLabel`, and toggle `withLabels` /
  `withTooltip`. Renders client-side. Close with {% endDonutchart %}.
params:
  data: string
  size: int
  thickness: int
  chartLabel: string
  withLabels: { type: bool, default: false }
  withTooltip: { type: bool, default: true }
body: python
---
```python
# The donutchart tag renders Mantine's DonutChart from @mantine/charts (the `charts` component
# library; client-rendered). `data` is a JSON array of {name, value, color} segments, parsed here;
# a malformed array warns and degrades to empty.
import json as _json
import aardvark.components as av
_segments = []
if data:
    try:
        _v = _json.loads(data)
        _segments = _v if isinstance(_v, list) else []
        if not isinstance(_v, list):
            av.warn("donutchart: data must be a JSON array of {name, value, color} segments — using an empty chart")
    except (ValueError, TypeError):
        av.warn("donutchart: data is not valid JSON — using an empty chart; check the value")
props = {'data': _segments}
if size is not None: props['size'] = size
if thickness is not None: props['thickness'] = thickness
if chartLabel: props['chartLabel'] = chartLabel
if withLabels: props['withLabels'] = True
# withTooltip defaults on; forward only when turned off so Mantine's default applies otherwise.
if not withTooltip: props['withTooltip'] = False
print(component('charts', 'DonutChart', attr=attr, **props))
```
