---
name: treeselect
description: A single-select dropdown over hierarchical data — pick a leaf from a collapsible
  tree. Give the hierarchy via `data` — a JSON array of nested nodes, each with `value`,
  `label`, and an optional `children` array — plus the usual input fields (label, placeholder,
  description, error, size, radius, variant) and disabled / clearable / searchable. Mounts as
  an interactive island.
params:
  data: string
  label: string
  placeholder: string
  description: string
  error: string
  size: string
  radius: string
  variant: string
  disabled: { type: bool, default: false }
  clearable: { type: bool, default: false }
  searchable: { type: bool, default: false }
body: python
---
```python
# The treeselect tag renders Mantine's TreeSelect: a single-select dropdown over a
# collapsible hierarchy. `data` is a JSON string parsed here into the nested
# {value,label,children} tree TreeSelect expects (it can't comma-split like the flat select
# family) — a malformed or non-list value warns and degrades to an empty tree rather than
# aborting the build. Unset (None/'') props are omitted so Mantine's defaults apply.
import json as _json
import aardvark.components as av

try:
    _data = _json.loads(data) if data else []
    if data and not isinstance(_data, list):
        # Valid JSON, but not an array of nodes — an author mistake that would otherwise
        # ship an empty tree with no signal, so warn rather than degrade quietly.
        av.warn("treeselect: data must be a JSON array of {value,label,children} nodes — got a non-list value; falling back to an empty tree")
        _data = []
except (ValueError, TypeError):
    # A malformed data= JSON shouldn't abort the build — degrade to an empty tree, but warn so
    # a typo (e.g. a missing bracket) isn't a silent broken dropdown. Mirrors select.md's
    # warn-and-degrade posture for its dataJson sibling (a build error is reserved for unsafe
    # input like a bad href, not an author typo in option data).
    av.warn("treeselect: data is not valid JSON — falling back to an empty tree; check the data value")
    _data = []

_props = {}
if label: _props['label'] = label
if placeholder: _props['placeholder'] = placeholder
if description: _props['description'] = description
if error: _props['error'] = error
if size: _props['size'] = size
if radius: _props['radius'] = radius
if variant: _props['variant'] = variant
if disabled: _props['disabled'] = True
if clearable: _props['clearable'] = True
if searchable: _props['searchable'] = True
# Branch nodes are containers, not values. Mantine gates that on expandOnClick, which is
# unset by default — so without this a click on a branch row selects that branch and closes
# the dropdown, contradicting the leaf-picking this tag exists for. With it, a branch click
# expands or collapses and only a leaf resolves to a selection.
_props['expandOnClick'] = True
if attr: _props['attr'] = attr
print(component('TreeSelect', data=_data, **_props))
```
