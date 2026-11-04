---
name: fieldset
description: A bordered group of related fields with a `legend` caption. Wrap a set of
  inputs in `{% fieldset legend='…' %}` … `{% endFieldset %}` — the block body holds the
  fields. Set `variant` (default, filled, unstyled), `radius`, and `disabled` (disable
  every control inside). Close with {% endFieldset %}.
params:
  legend: string
  variant: string
  radius: string
  disabled: { type: bool, default: false }
body: python
---
```python
# Fieldset is a CONTAINER, not a field: the block body (children) holds the grouped
# inputs, and `legend` is its caption. `disabled` cascades a disabled attribute to
# every control inside. Unset (None/''/False) → omitted so Mantine's defaults apply.
props = {}
if legend: props['legend'] = legend
if variant: props['variant'] = variant
if radius: props['radius'] = radius
if disabled: props['disabled'] = True
if attr: props['attr'] = attr
# The block body holds the grouped fields — bracket it with blank lines so the single Markdown pass
# renders any prose between fields (paragraphs, emphasis, links, lists) rather than leaving it
# literal inside the island's one-line <div> (the block-component convention). A run of nested
# input islands still passes through fine. An empty/self-closing body stays '' so no stray blank
# lines.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Fieldset', children=_body, **props))
```
