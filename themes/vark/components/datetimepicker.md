---
name: datetimepicker
description: A combined date-and-time field that opens a calendar plus a time picker. Seed it
  with `defaultValue` (a `YYYY-MM-DD HH:mm:ss` string), toggle `withSeconds`, set the display
  `valueFormat`, and carry the usual Input wrapper — label, description, placeholder, error,
  size, radius, variant, required / withAsterisk, disabled, clearable. Mounts as an interactive
  island.
params:
  defaultValue: string
  valueFormat: string
  withSeconds: { type: bool, default: false }
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
# The datetimepicker tag renders the built-in DateTimePicker wrapper around @mantine/dates.
# Mantine 9 dates are STRINGS: `defaultValue` is a 'YYYY-MM-DD HH:mm:ss' string (never a Date).
# `withSeconds` adds the seconds field. Uncontrolled here (defaultValue seeds it); unset
# (None/''/False) props are omitted so Mantine's defaults apply.
_field = {
    'defaultValue': defaultValue, 'valueFormat': valueFormat,
    'label': label, 'description': description, 'placeholder': placeholder, 'error': error,
    'size': size, 'radius': radius, 'variant': variant,
    'withSeconds': withSeconds, 'required': required, 'withAsterisk': withAsterisk,
    'disabled': disabled, 'clearable': clearable,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
print(component('DateTimePicker', attr=attr, **props))
```
