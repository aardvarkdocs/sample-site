---
name: tagsinput
description: A free-text tags field — type a value and press Enter to add a removable pill
  (Mantine TagsInput). Optional `data` (a comma-separated list) gives autocomplete
  suggestions, `defaultValue` pre-fills tags, `maxTags` caps the count, `splitChars` sets the
  separators that commit a tag, plus the usual input fields — label, placeholder, description,
  error, size, radius, variant — and the toggles searchable, clearable, disabled, required,
  withAsterisk, acceptValueOnBlur, and allowDuplicates. Hydrates as an interactive island.
params:
  data: list
  dataJson: string
  defaultValue: list
  splitChars: list
  label: string
  placeholder: string
  description: string
  error: string
  size: string
  radius: string
  variant: string
  maxTags: int
  maxDropdownHeight: int
  searchable: { type: bool, default: false }
  clearable: { type: bool, default: false }
  disabled: { type: bool, default: false }
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  acceptValueOnBlur: { type: bool, default: true }
  allowDuplicates: { type: bool, default: false }
body: python
---
```python
# Mirrors multiselect.md, but tags are free text — `data` is only autocomplete suggestions
# (plain strings), so no value:label parsing. `defaultValue` is a list of tag strings;
# `splitChars` is a list of separator chars. The `list` type comma-splits the value and
# strips each entry, so the comma itself (it IS the separator) and whitespace cannot be
# listed: splitChars=";,|" -> [';','|']. Mantine's own default is [','], which any value
# passed here replaces.
# `dataJson` (full JSON array, wins over `data`) carries grouped suggestion forms. Numeric
# maxTags is checked against None so a deliberate 0 survives. Unset props are omitted.
import json as _json
import aardvark.components as av

if dataJson:
    try:
        _data = _json.loads(dataJson)
        if not isinstance(_data, list):
            # Valid JSON, but not an array of suggestions — an author mistake that would silently
            # ship an empty list, so warn rather than degrade quietly.
            av.warn("tagsinput: dataJson must be a JSON array of suggestions — got a non-list value; falling back to none")
            _data = []
    except (ValueError, TypeError):
        # A malformed dataJson shouldn't abort the build — degrade to no suggestions, but warn so a
        # typo (e.g. a missing bracket) isn't silent.
        av.warn("tagsinput: dataJson is not valid JSON — falling back to no suggestions; check the dataJson value")
        _data = []
elif data:
    _data = list(data)
else:
    _data = []

_ti = {
    'label': label, 'placeholder': placeholder, 'description': description,
    'error': error, 'size': size, 'radius': radius, 'variant': variant,
    'maxDropdownHeight': maxDropdownHeight,
}
_props = {k: v for k, v in _ti.items() if v not in (None, '')}
if _data: _props['data'] = _data
if defaultValue: _props['defaultValue'] = list(defaultValue)
if splitChars: _props['splitChars'] = list(splitChars)
if maxTags is not None: _props['maxTags'] = maxTags
if searchable: _props['searchable'] = True
if clearable: _props['clearable'] = True
if disabled: _props['disabled'] = True
if required: _props['required'] = True
if withAsterisk: _props['withAsterisk'] = True
if not acceptValueOnBlur: _props['acceptValueOnBlur'] = False
if allowDuplicates: _props['allowDuplicates'] = True
if attr: _props['attr'] = attr
print(component('TagsInput', **_props))
```
