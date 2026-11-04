---
name: overflowlist
description: A single-line row of labels (rendered as badges) that collapses any overflow into a
  trailing "+N" counter when they don't all fit — it MEASURES the items at runtime and re-fits on
  resize, so the number shown is responsive. Pass the labels in `items`, either comma-separated
  (`items="React, Vue, Svelte"`) or as a JSON array. Style the badges with `variant`, `color`, and
  `size`; set `gap` for the spacing; the hidden labels show in a tooltip on the counter unless you
  set `withTooltip=false`.
params:
  items: string
  variant: string
  color: string
  size: string
  gap: string
  withTooltip: { type: bool, default: true }
body: python
---
```python
# Renders the OverflowList island (OverflowList.jsx) — a thin wrapper that
# supplies Mantine's native OverflowList with its Badge renderItem + "+N" renderOverflow, while
# the native component measures and fits. The labels arrive as `items`: a JSON array of strings,
# or a plain comma-separated string. We parse here and forward a clean list so the island never
# parses author text. Style props are optional and unset ones are omitted so the island's own
# defaults apply (variant 'light', size 'md', gap 'xs').
import json

labels = []
if items:
    try:
        data = json.loads(items)
        if isinstance(data, list):
            labels = [str(v) for v in data]
        else:
            # Valid JSON that isn't a list (e.g. a bare number) — treat the raw text as one label.
            labels = [str(items)]
    except (ValueError, TypeError):
        # Not JSON — comma-split, mirroring the Accordion defaultValue / `list`-type convention.
        labels = [v.strip() for v in items.split(',') if v.strip()]

props = {'items': labels}
if variant: props['variant'] = variant
if color: props['color'] = color
if size: props['size'] = size
if gap: props['gap'] = gap
if not withTooltip: props['withTooltip'] = False
print(component('OverflowList', attr=attr, **props))
```
