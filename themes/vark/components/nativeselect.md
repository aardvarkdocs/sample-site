---
name: nativeselect
description: A native HTML `<select>` styled like the other inputs. The shared Input wrapper
  surface (label, description, error, withAsterisk, required, disabled, size, radius, variant)
  plus `data` — the options as a `|`- or comma-delimited string (e.g. `data='React|Vue|Svelte'`).
  `defaultValue` pre-selects an option; `leftSection`/`rightSection` take text.
params:
  label: string
  description: string
  error: string
  data: string
  defaultValue: string
  variant: string
  size: string
  radius: string
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  disabled: { type: bool, default: false }
  leftSection: string
  rightSection: string
body: python
---
```python
# Mirrors textinput.md for the shared wrapper props. NativeSelect's `data` is an array,
# which can't ride a scalar param — so it arrives as a delimited STRING and is split
# here into the list Mantine expects. Split on `|` if present (lets option labels carry
# commas), else on commas; each option is trimmed and blanks are dropped. Unset
# (None/''/False) → omitted so Mantine defaults apply. No children slot.
_field = {
    'label': label, 'description': description, 'error': error,
    'defaultValue': defaultValue, 'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'leftSection': leftSection, 'rightSection': rightSection,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
if data:
    sep = '|' if '|' in data else ','
    options = [opt.strip() for opt in data.split(sep) if opt.strip()]
    if options:
        props['data'] = options
if attr: props['attr'] = attr
print(component('NativeSelect', **props))
```
