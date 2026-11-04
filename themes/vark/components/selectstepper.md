---
name: selectstepper
description: An option-cycling stepper — a Community Component wrapping
  @gfazioli/mantine-select-stepper. Prev/next arrows step through a list of choices. Pass
  `data` as a JSON array — either of strings (e.g. `["React","Vue","Svelte"]`) or of
  `{"value","label"}` objects — and optionally set `defaultValue`, `label`, `description`,
  `orientation` (horizontal / vertical), `size`, `variant`, `loop` (infinite cycling), and
  `disabled`. Transitions are animated by default; pass `animate=false` to turn that off.
params:
  data: { type: string, required: true }
  defaultValue: string
  label: string
  description: string
  orientation: string
  size: string
  variant: string
  loop: { type: bool, default: false }
  animate: { type: bool, default: true }
  disabled: { type: bool, default: false }
body: python
---
```python
# SelectStepper's `data` is a required array (string[] or {value,label}[]) — a structure the
# flat JSON props channel can't carry as a typed tag attribute, so it arrives as a JSON
# string and the SelectStepper island (SelectStepper.jsx) maps it onto the
# vendor <SelectStepper data>. The island owns the controlled value (this is an interactive
# stepper) and seeds it from `defaultValue` when given, else the first option. Other props
# are omitted when unset so the vendor's defaults apply.
import json as _json
try:
    _data = _json.loads(data)
except (ValueError, TypeError):
    _data = None
if not isinstance(_data, list):
    # Bad/empty JSON: degrade to a visible build-time comment rather than a crash (mirrors
    # ringprogress.md).
    print("<!-- aardvark: selectstepper `data` must be a JSON array of strings or "
          "{value, label} objects -->")
else:
    props = {'data': _data}
    if defaultValue: props['defaultValue'] = defaultValue
    if label: props['label'] = label
    if description: props['description'] = description
    if orientation: props['orientation'] = orientation
    if size: props['size'] = size
    if variant: props['variant'] = variant
    if loop: props['loop'] = True
    # animate defaults ON upstream, so it is forwarded only when turned OFF (sending the
    # non-default) — forwarding it only when ON would leave no way to switch it off.
    if animate is False: props['animate'] = False
    if disabled: props['disabled'] = True
    if attr: props['attr'] = attr
    print(component('SelectStepper', **props))
```
