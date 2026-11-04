---
name: autocomplete
description: A free-text input with a suggestion dropdown (Mantine Autocomplete). Unlike
  Select the typed value need not match an option. Give suggestions via `data` (a
  comma-separated list) or `dataJson` (a full JSON array for grouped suggestions), plus the
  usual input fields — label, placeholder, description, error, size, radius, variant,
  defaultValue — and the toggles clearable, disabled, required, withAsterisk, and
  withScrollArea. Hydrates as an interactive island.
params:
  data: list
  dataJson: string
  label: string
  placeholder: string
  description: string
  error: string
  defaultValue: string
  size: string
  radius: string
  variant: string
  maxDropdownHeight: int
  clearable: { type: bool, default: false }
  disabled: { type: bool, default: false }
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  withScrollArea: { type: bool, default: true }
body: python
---
```python
# Mirrors select.md. Autocomplete suggestions are plain strings or {group, items}
# groups (no per-option label, since the typed value is free text), so `data` stays a
# list of strings; `dataJson` carries grouped/JSON forms and WINS over `data`. Unset
# (None/'') props are omitted so Mantine's defaults apply. No children — form control.
import json as _json
import aardvark.components as av

if dataJson:
    try:
        _data = _json.loads(dataJson)
        if not isinstance(_data, list):
            # Valid JSON, but not an array of suggestions — warn rather than silently empty.
            av.warn("autocomplete: dataJson must be a JSON array of suggestions — got a non-list value; falling back to no suggestions")
            _data = []
    except (ValueError, TypeError):
        # A malformed dataJson shouldn't abort the build — degrade to no suggestions, but warn so a
        # typo (e.g. a missing bracket) isn't a silent broken field.
        av.warn("autocomplete: dataJson is not valid JSON — falling back to no suggestions; check the dataJson value")
        _data = []
elif data:
    _data = list(data)
else:
    _data = []

_ac = {
    'label': label, 'placeholder': placeholder, 'description': description,
    'error': error, 'defaultValue': defaultValue, 'size': size, 'radius': radius,
    'variant': variant, 'maxDropdownHeight': maxDropdownHeight,
}
_props = {k: v for k, v in _ac.items() if v not in (None, '')}
if _data: _props['data'] = _data
if clearable: _props['clearable'] = True
if disabled: _props['disabled'] = True
if required: _props['required'] = True
if withAsterisk: _props['withAsterisk'] = True
if not withScrollArea: _props['withScrollArea'] = False
if attr: _props['attr'] = attr
print(component('Autocomplete', **_props))
```
