---
name: datepickerinput
description: A date field that opens a calendar popover to pick a day, a range, or several days.
  Set `type` (`default` / `range` / `multiple`), seed it with `defaultValue` (a `YYYY-MM-DD`
  string, or a JSON array of them for range/multiple), and carry the usual Input wrapper — label,
  description, placeholder, error, size, radius, variant, required / withAsterisk, disabled,
  clearable. Mounts as an interactive island.
params:
  type: string
  defaultValue: string
  valueFormat: string
  label: string
  description: string
  placeholder: string
  error: string
  size: string
  radius: string
  variant: string
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  disabled: { type: bool, default: false }
  clearable: { type: bool, default: false }
body: python
---
```python
# The datepickerinput tag renders the built-in DatePickerInput wrapper around @mantine/dates.
# Mantine 9's dates are STRINGS: `defaultValue` is a 'YYYY-MM-DD' string for the default single
# type, or a JSON array of two ('range') / several ('multiple') such strings — we parse a
# leading-'[' value as JSON so range/multiple can ride the scalar param channel. Unset props are
# omitted so Mantine's defaults apply.
import json as _json
import aardvark.components as av
_dv = defaultValue
if isinstance(defaultValue, str) and defaultValue.strip().startswith('['):
    try:
        _dv = _json.loads(defaultValue)
    except (ValueError, TypeError):
        # Not valid JSON — fall back to the raw string rather than aborting the build, but warn:
        # a range/multiple picker handed a bare string renders no selection at all, so a typo
        # here must not pass silently (matches the marks handling in slider.md).
        av.warn(
            "datepickerinput: defaultValue looks like a JSON array but is not valid JSON — "
            "using it as a plain string; check the defaultValue"
        )
        _dv = defaultValue
_field = {
    'type': type, 'valueFormat': valueFormat,
    'label': label, 'description': description, 'placeholder': placeholder, 'error': error,
    'size': size, 'radius': radius, 'variant': variant,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled, 'clearable': clearable,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
if _dv not in (None, ''):
    props['defaultValue'] = _dv
print(component('DatePickerInput', attr=attr, **props))
```
