---
name: tabs
description: Tabbed panels with Markdown bodies, a sliding underline and a content crossfade.
  Put one or more {% tab %} blocks in the body. Every attribute (`variant`, `orientation`,
  `color`, `radius`, `grow`, `keepMounted`, `defaultValue`, …) passes through to Mantine's
  Tabs; pick the tab open at first with `defaultValue`. Close with {% endTabs %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
import aardvark.components as av

# The children are already rendered: a run of TabsTab islands from the nested tab tags. Every
# attribute except a stray `children` passes through as a Tabs prop, in the order the author
# wrote it. A bare `value` would make Mantine's Tabs controlled, so the tabs would not switch
# on click: the initially open tab is `defaultValue`.
# Tabs built in a Python loop never entered this tag's value scope, so two with like labels
# could share a value; make the direct children's values unique here.
body = av.dedupe_child_island_values(children.strip(), 'TabsTab', container='Tabs')
print(component('Tabs', children=body, attr=attr, **av.safe_attrs(attrs)))
```
