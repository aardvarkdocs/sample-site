---
name: jsontree
description: An interactive, collapsible JSON tree viewer with syntax highlighting (the
  Community Component wrapping @gfazioli/mantine-json-tree). Pass the value to display as a
  JSON string through `data` (an object, array, or scalar); set `rootName` for the root
  label, `defaultExpanded` to open the tree on load with `maxDepth` levels (-1 = all; the tree
  starts collapsed without it), `size` for the font scale, and toggle
  `withBorder`, `showLineNumbers`, `showIndentGuides`, `showItemsCount`, `showPathOnHover`,
  `withCopyToClipboard`, `withCopyAll`, `withExpandAll`, `withSearch`, and `withKeyCountBadge`.
  Hydrates as an interactive island.
params:
  data: string
  rootName: string
  size: string
  maxDepth: int
  maxHeight: string
  searchPlaceholder: string
  displayFunctions: string
  borderRadius: string
  defaultExpanded: { type: bool, default: false }
  withBorder: { type: bool, default: false }
  showLineNumbers: { type: bool, default: false }
  showIndentGuides: { type: bool, default: false }
  showItemsCount: { type: bool, default: false }
  showPathOnHover: { type: bool, default: false }
  withCopyToClipboard: { type: bool, default: false }
  withCopyAll: { type: bool, default: false }
  withExpandAll: { type: bool, default: false }
  withSearch: { type: bool, default: false }
  withKeyCountBadge: { type: bool, default: false }
  stickyHeader: { type: bool, default: false }
body: python
---
```python
# The jsontree tag renders @gfazioli/mantine-json-tree's <JsonTree> via the built-in island
# (JsonTree.jsx). The author's `data` is a JSON STRING — an object, array,
# or scalar — parsed here and handed straight to the island's `data` prop through the JSON
# props channel (json.dumps in the collector). A malformed `data` shouldn't abort the build,
# so it warns and degrades to an empty object rather than shipping a silent broken viewer
# (same posture as select.md's dataJson / treeselect.md's data). Every other prop is optional;
# unset (None/'') props are omitted so the component's own defaults apply. jsontree takes no
# children — it's a viewer, so the body is ignored.
import json as _json
import aardvark.components as av

if data:
    try:
        _data = _json.loads(data)
    except (ValueError, TypeError):
        av.warn("jsontree: data is not valid JSON — falling back to an empty object; check the data value")
        _data = {}
else:
    _data = {}

props = {'data': _data}

# String/scalar props: forwarded only when set (None/'' omitted so the upstream defaults apply).
for _k, _v in (
    ('rootName', rootName), ('size', size), ('maxHeight', maxHeight),
    ('searchPlaceholder', searchPlaceholder), ('displayFunctions', displayFunctions),
    ('borderRadius', borderRadius),
):
    if _v not in (None, ''):
        props[_k] = _v
# maxDepth is an int — 0 (collapsed) and -1 (expand all) are meaningful, so forward whenever set.
if maxDepth is not None:
    props['maxDepth'] = maxDepth

# Boolean toggles all default OFF upstream, so each is forwarded only when turned ON, keeping
# the props dict minimal.
for _k, _v in (
    ('defaultExpanded', defaultExpanded), ('withBorder', withBorder),
    ('showLineNumbers', showLineNumbers), ('showIndentGuides', showIndentGuides),
    ('showItemsCount', showItemsCount), ('showPathOnHover', showPathOnHover),
    ('withCopyToClipboard', withCopyToClipboard), ('withCopyAll', withCopyAll),
    ('withExpandAll', withExpandAll), ('withSearch', withSearch),
    ('withKeyCountBadge', withKeyCountBadge), ('stickyHeader', stickyHeader),
):
    if _v:
        props[_k] = True

print(component('JsonTree', attr=attr, **props))
```
