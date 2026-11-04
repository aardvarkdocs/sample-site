---
name: fileinput
description: A file picker styled like the other inputs. The shared Input wrapper surface
  (label, description, placeholder, error, withAsterisk, required, disabled, size, radius,
  variant) plus the FileInput specifics — `accept` (an accept-attribute string like
  `image/png,image/jpeg`), `multiple` (allow several files), and `clearable` (show a clear
  button once a file is chosen).
params:
  label: string
  description: string
  placeholder: string
  error: string
  variant: string
  size: string
  radius: string
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  disabled: { type: bool, default: false }
  accept: string
  multiple: { type: bool, default: false }
  clearable: { type: bool, default: false }
  leftSection: string
  rightSection: string
body: python
---
```python
# Mirrors textinput.md for the shared wrapper props and adds the FileInput-only fields:
# accept is the native accept-attribute string, multiple lets the picker take several
# files, and clearable shows a clear button. Unset (None/''/False) → omitted so Mantine
# defaults apply. No children slot.
_field = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'accept': accept, 'multiple': multiple, 'clearable': clearable,
    'leftSection': leftSection, 'rightSection': rightSection,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
if attr: props['attr'] = attr
print(component('FileInput', **props))
```
