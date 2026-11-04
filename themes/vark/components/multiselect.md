---
name: multiselect
description: A multi-value select that collects chosen options as removable pills (Mantine
  MultiSelect). Give options via `data` (a comma-separated list, or `value::label` pairs) or
  `dataJson` (a full JSON array for grouped / disabled / labelled options), `defaultValue` (a
  comma-separated list of pre-selected values), `maxValues` to cap selections, plus the usual
  input fields — label, placeholder, description, error, size, radius, variant — and the
  toggles searchable, clearable, disabled, required, withAsterisk, hidePickedOptions, and
  nothingFoundMessage. Hydrates as an interactive island.
params:
  data: list
  dataJson: string
  defaultValue: list
  label: string
  placeholder: string
  description: string
  error: string
  size: string
  radius: string
  variant: string
  nothingFoundMessage: string
  checkIconPosition: string
  maxValues: int
  maxDropdownHeight: int
  searchable: { type: bool, default: false }
  clearable: { type: bool, default: false }
  disabled: { type: bool, default: false }
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  hidePickedOptions: { type: bool, default: false }
  withCheckIcon: { type: bool, default: true }
  withScrollArea: { type: bool, default: true }
body: python
---
```python
# Mirrors select.md, but the value is a list. `data` items are strings or `value::label`
# pairs -> {value,label}; `dataJson` (full JSON array, wins over `data`) carries
# grouped/disabled forms. `defaultValue` is a list of value strings (the `list` param
# type comma-splits a string for you). Numeric maxValues is checked against None so a
# deliberate 0 survives. Unset (None/'') props are omitted so Mantine's defaults apply.
import json as _json
import aardvark.components as av

def _opt(item):
    # Double-colon separator so a value containing a single ':' (URL, time, ns token) isn't split.
    if '::' in item:
        v, _, l = item.partition('::')
        return {'value': v.strip(), 'label': l.strip()}
    return item

if dataJson:
    try:
        _data = _json.loads(dataJson)
        if not isinstance(_data, list):
            # Valid JSON, but not an array of options — an author mistake that would silently
            # ship an empty dropdown, so warn rather than degrade quietly.
            av.warn("multiselect: dataJson must be a JSON array of options — got a non-list value; falling back to no options")
            _data = []
    except (ValueError, TypeError):
        # A malformed dataJson shouldn't abort the build — degrade to no options, but warn so a
        # typo (e.g. a missing bracket) isn't a silent broken dropdown.
        av.warn("multiselect: dataJson is not valid JSON — falling back to no options; check the dataJson value")
        _data = []
elif data:
    _data = [_opt(i) for i in data]
else:
    _data = []

_ms = {
    'label': label, 'placeholder': placeholder, 'description': description,
    'error': error, 'size': size, 'radius': radius, 'variant': variant,
    'nothingFoundMessage': nothingFoundMessage, 'checkIconPosition': checkIconPosition,
    'maxDropdownHeight': maxDropdownHeight,
}
_props = {k: v for k, v in _ms.items() if v not in (None, '')}
if _data: _props['data'] = _data
if defaultValue: _props['defaultValue'] = list(defaultValue)
if maxValues is not None: _props['maxValues'] = maxValues
if searchable: _props['searchable'] = True
if clearable: _props['clearable'] = True
if disabled: _props['disabled'] = True
if required: _props['required'] = True
if withAsterisk: _props['withAsterisk'] = True
if hidePickedOptions: _props['hidePickedOptions'] = True
if not withCheckIcon: _props['withCheckIcon'] = False
if not withScrollArea: _props['withScrollArea'] = False
if attr: _props['attr'] = attr
print(component('MultiSelect', **_props))
```
