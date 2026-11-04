---
name: tab
description: One tab of a {% tabs %} set. `label` is the tab button and the Markdown body is
  the panel. `value` names the tab (for the set's `defaultValue`); it defaults to a slug of the
  label. `color`, `disabled` and any other attribute ride through to the tab. Close with
  {% endTab %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
import aardvark.components as av

# The value is the explicit one, else a slug of the label, else a page-unique fallback, then made
# unique among the tabs of the enclosing set (Mantine keys panels by value). Every other
# attribute except a stray `children` rides through to the tab; attr={...} is not forwarded.
label = str(attrs.get('label', '')).strip()
value = str(attrs.get('value') or av.slugify(label)).strip() or f"tab-{av.uid(globals())}"
value = av.dedupe_value(globals(), value)
extra = av.safe_attrs(attrs, 'label', 'value')

# The body is bracketed with blank lines so the page's Markdown pass renders it.
print(component(
    'TabsTab',
    value=value,
    label=label,
    children='\n\n' + children.strip() + '\n\n',
    **extra,
))
```
