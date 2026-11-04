---
name: timeinput
description: A time field built on the browser's native time control. Seed it with `defaultValue`
  (a `HH:mm` string, or `HH:mm:ss` with `withSeconds`), and carry the usual Input wrapper — label,
  description, error, size, radius, variant, required / withAsterisk, disabled. Mounts as an
  interactive island.
params:
  defaultValue: string
  withSeconds: { type: bool, default: false }
  label: string
  description: string
  error: string
  size: string
  radius: string
  variant: string
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  disabled: { type: bool, default: false }
body: python
---
```python
# The timeinput tag renders the built-in TimeInput wrapper around @mantine/dates — a thin wrapper
# over the native <input type="time">. `defaultValue` is a 'HH:mm' string (or 'HH:mm:ss' when
# withSeconds is set). Uncontrolled here (defaultValue seeds it); unset (None/''/False) props are
# omitted so Mantine's defaults apply.
_field = {
    'defaultValue': defaultValue,
    'label': label, 'description': description, 'error': error,
    'size': size, 'radius': radius, 'variant': variant,
    'withSeconds': withSeconds, 'required': required, 'withAsterisk': withAsterisk,
    'disabled': disabled,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
print(component('TimeInput', attr=attr, **props))
```
