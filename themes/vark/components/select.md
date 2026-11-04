---
name: select
description: A searchable single-select dropdown (Mantine Select). Give it options via
  `data` (a comma-separated list, or `value::label` pairs) or `dataJson` (a full JSON array
  for grouped / disabled / labelled options), plus the usual input fields — label,
  placeholder, description, error, size, radius, variant, defaultValue — and the toggles
  searchable, clearable, disabled, required, withAsterisk, allowDeselect, checkIconPosition,
  and nothingFoundMessage. Hydrates as an interactive island.
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
  nothingFoundMessage: string
  checkIconPosition: string
  maxDropdownHeight: int
  searchable: { type: bool, default: false }
  clearable: { type: bool, default: false }
  disabled: { type: bool, default: false }
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  allowDeselect: { type: bool, default: true }
  withCheckIcon: { type: bool, default: true }
  withScrollArea: { type: bool, default: true }
body: python
---
```python
# Mirrors badge.md / rating.md: every prop is optional and unset (None/'') props are
# omitted so Mantine's own defaults apply. `data` comma-splits to a list of plain string
# options (the `list` param type); `value::label` items become {value, label} objects so a
# short author string can still carry a display label. `dataJson`, when set, is a full JSON
# array (objects, {group, items} groups, disabled flags) and WINS over `data`. The parsed
# list rides the JSON props channel straight to Mantine's `data` prop (json.dumps in the
# collector). Select takes no children — it's a form control, so the body is ignored.
import json as _json
import aardvark.components as av

def _opt(item):
    # "value" or "value::label" -> a string or {value,label} option. A DOUBLE colon so a plain
    # value that contains a single ':' — a URL (https://…), a time (10:30), a namespace token —
    # passes through unsplit instead of being mangled into {'value':'https','label':'//…'}.
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
            av.warn("select: dataJson must be a JSON array of options — got a non-list value; falling back to no options")
            _data = []
    except (ValueError, TypeError):
        # A malformed dataJson shouldn't abort the build — degrade to no options, but warn so a
        # typo (e.g. a missing bracket) isn't a silent broken dropdown.
        av.warn("select: dataJson is not valid JSON — falling back to no options; check the dataJson value")
        _data = []
elif data:
    _data = [_opt(i) for i in data]
else:
    _data = []

_sel = {
    'label': label, 'placeholder': placeholder, 'description': description,
    'error': error, 'defaultValue': defaultValue, 'size': size, 'radius': radius,
    'variant': variant, 'nothingFoundMessage': nothingFoundMessage,
    'checkIconPosition': checkIconPosition, 'maxDropdownHeight': maxDropdownHeight,
}
_props = {k: v for k, v in _sel.items() if v not in (None, '')}
if _data: _props['data'] = _data
# Boolean toggles: those defaulting to True are forwarded only when turned OFF (sending
# the non-default), the rest only when turned ON — so the props dict stays minimal.
if searchable: _props['searchable'] = True
if clearable: _props['clearable'] = True
if disabled: _props['disabled'] = True
if required: _props['required'] = True
if withAsterisk: _props['withAsterisk'] = True
if not allowDeselect: _props['allowDeselect'] = False
if not withCheckIcon: _props['withCheckIcon'] = False
if not withScrollArea: _props['withScrollArea'] = False
if attr: _props['attr'] = attr
print(component('Select', **_props))
```
