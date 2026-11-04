---
name: textarea
description: A multi-line text input. The full Input wrapper surface (label, description,
  placeholder, error, withAsterisk, required, disabled, size, radius, variant) plus the
  Textarea specifics — `autosize` (grow with content), `minRows`/`maxRows`, and `resize`
  (none, both, horizontal, vertical).
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
  autosize: { type: bool, default: false }
  minRows: int
  maxRows: int
  resize: string
  leftSection: string
  rightSection: string
body: python
---
```python
# Mirrors textinput.md (the shared Input wrapper props) and adds the Textarea-only
# fields. Unset (None/''/False) → omitted so Mantine's own defaults apply; `autosize`
# makes the box grow with its content. No children slot — a field has no body.
# minRows/maxRows are ints filtered separately with `is not None` — 0 is falsy AND
# equals False in Python, so the (None, '', False) filter below would wrongly drop a 0.
_field = {
    'label': label, 'description': description, 'placeholder': placeholder,
    'error': error, 'defaultValue': defaultValue,
    'variant': variant, 'size': size, 'radius': radius,
    'required': required, 'withAsterisk': withAsterisk, 'disabled': disabled,
    'autosize': autosize, 'resize': resize,
    'leftSection': leftSection, 'rightSection': rightSection,
}
props = {k: v for k, v in _field.items() if v not in (None, '', False)}
for k, v in {'minRows': minRows, 'maxRows': maxRows}.items():
    if v is not None:
        props[k] = v
if attr: props['attr'] = attr
print(component('Textarea', **props))
```
