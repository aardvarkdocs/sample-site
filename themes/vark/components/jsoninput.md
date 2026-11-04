---
name: jsoninput
description: A textarea that validates and (optionally) reformats JSON. The shared Input
  wrapper surface (label, description, placeholder, error, withAsterisk, required, disabled,
  size, radius, variant) plus the JsonInput specifics — `formatOnBlur` (pretty-print on
  blur), `validationError` (message for invalid JSON), `autosize`, `minRows`/`maxRows`.
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
  formatOnBlur: { type: bool, default: false }
  validationError: string
  autosize: { type: bool, default: false }
  minRows: int
  maxRows: int
body: python
---
```python
# Mirrors textarea.md (JsonInput is a Textarea that parses JSON) and adds the
# JSON-only fields: formatOnBlur pretty-prints valid JSON when the field loses focus,
# and validationError is the message shown when the content isn't valid JSON. Unset
# (None/''/False) → omitted. minRows/maxRows are ints filtered separately with
# `is not None` — a 0 equals False in Python, so the (None, '', False) filter below
# would wrongly drop it. No children.
_field = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'defaultValue': defaultValue,
    'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'formatOnBlur': formatOnBlur, 'validationError': validationError,
    'autosize': autosize,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
for k, v in {'minRows': minRows, 'maxRows': maxRows}.items():
    if v is not None:
        props[k] = v
if attr: props['attr'] = attr
print(component('JsonInput', **props))
```
