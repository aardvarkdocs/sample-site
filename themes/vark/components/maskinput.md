---
name: maskinput
description: >-
  A text input that formats entry against a fixed pattern — phone numbers, dates,
  card numbers. Set `mask` with `9` for a digit, `a` for a letter, `A` for an uppercase
  letter, `*` for a letter or digit, `#` for a digit or sign, and any other character as a
  literal separator (e.g. `mask='(999) 999-9999'`). Carries the shared Input wrapper surface
  too — label, description, placeholder, error, withAsterisk, required, disabled, size,
  radius, variant.
params:
  mask: string
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
  leftSection: string
  rightSection: string
body: python
---
```python
# The maskinput tag renders Mantine's MaskInput (Mantine 9.1+): a text field whose entry is
# formatted against a fixed `mask` pattern. Mask tokens: 9=digit, a=letter, A=uppercase
# letter, *=letter or digit, #=digit or sign; any other character is a literal separator
# inserted automatically. The component is uncontrolled (defaultValue seeds it, no value
# wiring). Wrapper props (label, error, size, …) flow through; unset (None/''/False) props
# are omitted so Mantine's defaults apply. No children slot.
_field = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'defaultValue': defaultValue,
    'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'leftSection': leftSection, 'rightSection': rightSection,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
# mask is the whole point of the component; always pass it (an empty mask degrades to a plain
# field) so an omitted mask never reaches Mantine's parser as undefined.
props['mask'] = mask or ''
if attr: props['attr'] = attr
print(component('MaskInput', **props))
```
