---
name: textinput
description: A single-line text input. Exposes the full Mantine Input wrapper surface —
  label, description, placeholder, error, withAsterisk, required, disabled, size, radius,
  variant (default, filled, unstyled) — plus `type` (email, url, tel, search, password,
  number, …), `defaultValue`, and `leftSection`/`rightSection` text.
params:
  label: string
  description: string
  placeholder: string
  error: string
  type: string
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
# Mirrors badge.md: every prop passes straight through to the
# Mantine TextInput (it validates the values); unset props (None/''/False) are
# omitted so Mantine's own defaults apply. leftSection/rightSection arrive as text —
# a build-time macro can't construct a React icon element. There is no children slot:
# a text field has no body, so the rendered island is self-closing.
_field = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'type': type, 'defaultValue': defaultValue,
    'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'leftSection': leftSection, 'rightSection': rightSection,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
if attr: props['attr'] = attr
print(component('TextInput', **props))
```
