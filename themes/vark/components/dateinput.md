---
name: dateinput
description: A free-typing date field — type a date or pick it, parsed against `valueFormat`.
  Seed it with `defaultValue` (a `YYYY-MM-DD` string), set the display `valueFormat`, and carry
  the usual Input wrapper — label, description, placeholder, error, size, radius, variant,
  required / withAsterisk, disabled, clearable. Mounts as an interactive island.
params:
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
# The dateinput tag renders the built-in DateInput wrapper around @mantine/dates. Mantine 9's
# dates take/return date STRINGS, so
# `defaultValue` is a 'YYYY-MM-DD' string (never a Date) — include time in both defaultValue and
# valueFormat if you want it (e.g. valueFormat='YYYY-MM-DD HH:mm'). Uncontrolled here, so
# defaultValue seeds the field; unset (None/''/False) props are omitted so Mantine's defaults
# apply.
_field = {
    'defaultValue': defaultValue, 'valueFormat': valueFormat,
    'label': label, 'description': description, 'placeholder': placeholder, 'error': error,
    'size': size, 'radius': radius, 'variant': variant,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled, 'clearable': clearable,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
print(component('DateInput', attr=attr, **props))
```
