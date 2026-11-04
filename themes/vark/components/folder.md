---
name: folder
description: A folder in a {% tree %}, holding nested {% folder %} and {% file %} blocks.
  `name` (required) is the label; `defaultOpen`, `openable`, `href`, `comment` and
  `highlighted` ride through. Close with {% endFolder %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
import aardvark.components as av

# Like the tree's, a folder's children are only islands, so the blank lines between them go.
body = av.collapse_blank_lines(children)
# A nameless folder would render as a silent empty-label row, so it fails the build.
name = str(attrs.get('name', '')).strip()
if not name:
    raise av.ComponentError(
        "{% folder %} requires a `name` attribute (the folder's display name)"
        f" (in {av.call_source(globals())})"
    )
# `name` would collide with the island-name argument of component(), so the display name rides
# as the `label` prop.
props = av.safe_attrs(attrs, 'name')
props['label'] = name
av.coerce_flag_attrs(props, ('defaultOpen', 'openable', 'highlighted'))
print(component('TreeFolder', children=body, attr=attr, **props))
```
