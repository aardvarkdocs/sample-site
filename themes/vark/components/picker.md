---
name: picker
description: An animated iOS-style scroll/wheel picker (a Community Component wrapping
  @gfazioli/mantine-picker). Give the options as `data` — a comma-separated list (e.g.
  `data='Red, Green, Blue'`) — and optionally a starting `defaultValue`. Tune the wheel with
  `itemHeight` (px), `visibleItems` (odd count), `loop` (wrap around, on by default), `animate`,
  `withHighlight` and `withDividers` (the selection band, both on by default), and `size`. The
  selected value is highlighted in the centre; drag, scroll, or arrow-key through it.
params:
  data: list
  defaultValue: string
  value: string
  itemHeight: int
  visibleItems: int
  loop: { type: bool, default: true }
  animate: { type: bool, default: true }
  withHighlight: { type: bool, default: true }
  withDividers: { type: bool, default: true }
  size: string
  label: string
  disabled: { type: bool, default: false }
  readOnly: { type: bool, default: false }
body: python
---
```python
# Renders the Picker island (Picker.jsx), a thin wrapper around the community
# @gfazioli/mantine-picker. `data` is the list of options (a `list` param: a comma-separated
# string or a Python list); the island owns the live selection state, so `value` only seeds it
# like `defaultValue` (why: islands/Picker.jsx). Unset props are omitted so the package's own
# defaults apply (loop True, animate True, withHighlight/withDividers True, itemHeight 40,
# visibleItems 3). loop/animate/withHighlight/withDividers default True but are forwarded
# explicitly so an author can turn them off.
props = {
    'loop': loop,
    'animate': animate,
    'withHighlight': withHighlight,
    'withDividers': withDividers,
}
if data: props['data'] = data
if defaultValue is not None: props['defaultValue'] = defaultValue
if value is not None: props['value'] = value
if itemHeight is not None and itemHeight > 0: props['itemHeight'] = itemHeight
if visibleItems is not None and visibleItems > 0 and visibleItems % 2 == 1: props['visibleItems'] = visibleItems
if size: props['size'] = size
if label: props['label'] = label
if disabled: props['disabled'] = True
if readOnly: props['readOnly'] = True
if attr: props['attr'] = attr
print(component('Picker', **props))
```
