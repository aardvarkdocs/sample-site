---
name: passwordinput
description: A password input with a built-in show/hide visibility toggle. The shared Input
  wrapper surface (label, description, placeholder, error, withAsterisk, required, disabled,
  size, radius, variant) plus `defaultVisible` (start revealed) and `leftSection` text.
params:
  label: string
  description: string
  placeholder: string
  error: string
  defaultValue: string
  variant: string
  size: string
  radius: string
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
  disabled: { type: bool, default: false }
  defaultVisible: { type: bool, default: false }
  leftSection: string
body: python
---
```python
# Mirrors textinput.md. PasswordInput owns its visibility toggle (the rightSection
# slot is taken by the eye button), so only leftSection is exposed; `defaultVisible`
# starts the field revealed. Unset (None/''/False) → omitted so Mantine defaults apply.
# No children slot.
_field = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'defaultValue': defaultValue,
    'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'defaultVisible': defaultVisible, 'leftSection': leftSection,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
if attr: props['attr'] = attr
print(component('PasswordInput', **props))
```
