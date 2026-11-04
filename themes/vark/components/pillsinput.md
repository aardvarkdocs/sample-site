---
name: pillsinput
description: A composition primitive — the input *shell* that holds a row of pills plus a
  text field (Mantine PillsInput). It is what MultiSelect and TagsInput are built on; on its
  own it renders the bordered, labelled container only (put pills in the body with the
  {% raw %}{% pill %}{% endraw %} tag). For a ready-made interactive multi-value field reach
  for {% raw %}{% multiselect %}{% endraw %} or {% raw %}{% tagsinput %}{% endraw %} instead.
  Set the usual input fields — label, description, error, size, radius, variant —
  and disabled / required. Close with {% endPillsinput %}.
params:
  label: string
  description: string
  error: string
  size: string
  radius: string
  variant: string
  disabled: { type: bool, default: false }
  required: { type: bool, default: false }
  withAsterisk: { type: bool, default: false }
body: python
---
```python
# A low-level primitive (the wrapper MultiSelect/TagsInput compose). Unset (None/'') props
# are omitted so Mantine's defaults apply. The block body is the shell's content — pills
# (the pill tag) and/or a field; it rides through as children. Mirrors divider.md's
# children-or-empty handling. No interactivity is wired here (a static container); the doc
# page points readers at the multiselect / tagsinput tags for the high-level versions.
_pi = {
    'label': label, 'description': description, 'error': error,
    'size': size, 'radius': radius, 'variant': variant,
}
_props = {k: v for k, v in _pi.items() if v not in (None, '')}
if disabled: _props['disabled'] = True
if required: _props['required'] = True
if withAsterisk: _props['withAsterisk'] = True
if attr: _props['attr'] = attr
print(component('PillsInput', children=(children or ''), **_props))
```
