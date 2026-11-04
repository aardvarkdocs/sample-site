---
name: input
description: The low-level base input primitive that every other field is built on — no
  label, description, or error message of its own, just the styled control. Reach for it
  when you want the input box without the wrapper. Set `variant` (default, filled, unstyled),
  `size`, `radius`, `type`, `placeholder`, `disabled`, `error` (boolean error styling),
  `leftSection`/`rightSection` text, and `defaultValue`.
params:
  placeholder: string
  type: string
  defaultValue: string
  variant: string
  size: string
  radius: string
  disabled: { type: bool, default: false }
  error: { type: bool, default: false }
  leftSection: string
  rightSection: string
body: python
---
```python
# Input is the UNSTYLED BASE wrapper — TextInput/PasswordInput/etc. compose it with an
# Input.Wrapper to add label/description/error MESSAGES. Here `error` is a BOOLEAN that
# only adds error styling (there's no wrapper to render a message). Unset (None/''/False)
# → omitted so Mantine's defaults apply. No children slot — it's a single control.
props = {}
_scalar = {'placeholder': placeholder, 'type': type, 'defaultValue': defaultValue,
           'variant': variant, 'size': size, 'radius': radius,
           'leftSection': leftSection, 'rightSection': rightSection}
for k, v in _scalar.items():
    if v not in (None, ''):
        props[k] = v
if disabled: props['disabled'] = True
if error: props['error'] = True
if attr: props['attr'] = attr
print(component('Input', **props))
```
