---
name: pill
description: A small rounded pill / token — the chip MultiSelect and TagsInput render for
  each value (Mantine Pill). Set `variant` (default, contrast), `size` (xs–xl), `radius`,
  `withRemoveButton` to show an × button, and `disabled`. The label is the block body or a
  `text` param. Close with {% endPill %}.
params:
  text: string
  variant: string
  size: string
  radius: string
  withRemoveButton: { type: bool, default: false }
  disabled: { type: bool, default: false }
body: python
---
```python
# Mirrors badge.md: every prop passes straight through to Mantine (it validates the values)
# and unset (None/'') props are omitted so Mantine's defaults apply. The label is the block
# body or the `text` param — the inline `text=` is HTML-escaped (a stored-XSS surface for
# untrusted authors), while block-form `children` is already-rendered template output and
# left intact. withRemoveButton only shows the × in this static demo; there's no handler.
import html as _h
_pill = {'variant': variant, 'size': size, 'radius': radius}
_props = {k: v for k, v in _pill.items() if v not in (None, '')}
if withRemoveButton: _props['withRemoveButton'] = True
if disabled: _props['disabled'] = True
if attr: _props['attr'] = attr
_label = children if children else _h.escape(text or '')
print(component('Pill', children=_label, **_props))
```
