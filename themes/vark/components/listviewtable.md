---
name: listviewtable
description: A Finder-style list-view table with optional column reordering and resizing (the
  Community Component wrapping @gfazioli/mantine-list-view-table). Pass the rows as a JSON
  array of record objects through `data`, and the columns as a JSON array of
  `{key, title, sortable, width, textAlign, sticky}` definitions through `columns`. Toggle
  `withTableBorder`, `striped`, `highlightOnHover`, `withColumnBorders`, `withRowBorders`,
  `stickyHeader`, `enableColumnReordering`, and `enableColumnResizing`; set `height`. Hydrates
  as an interactive island.
params:
  data: string
  columns: string
  height: string
  rowKey: string
  borderRadius: string
  striped: { type: bool, default: false }
  withTableBorder: { type: bool, default: false }
  withColumnBorders: { type: bool, default: true }
  withRowBorders: { type: bool, default: true }
  highlightOnHover: { type: bool, default: false }
  stickyHeader: { type: bool, default: false }
  tabularNums: { type: bool, default: false }
  enableColumnReordering: { type: bool, default: false }
  enableColumnResizing: { type: bool, default: false }
body: python
---
```python
# The listviewtable tag renders @gfazioli/mantine-list-view-table's <ListViewTable> via the
# built-in island (ListViewTable.jsx). The author's `data` (an array of row
# records) and `columns` (an array of {key, title, sortable, width, textAlign, sticky, …}
# definitions) are JSON STRINGS, parsed here and handed straight to the island through the JSON
# props channel (json.dumps in the collector). A malformed array shouldn't abort the build, so
# it warns and degrades to an empty array (same posture as barchart.md's data/series). Every
# other prop is optional; unset (None/'') props are omitted so the component's own defaults
# apply. listviewtable takes no children — it's a table viewer, so the body is ignored.
import json as _json
import aardvark.components as av

def _arr(s, field):
    if not s:
        return []
    try:
        v = _json.loads(s)
    except (ValueError, TypeError):
        av.warn(f"listviewtable: {field} is not valid JSON — using an empty array; check the value")
        return []
    if not isinstance(v, list):
        av.warn(f"listviewtable: {field} must be a JSON array — using an empty array")
        return []
    return v

props = {'data': _arr(data, 'data'), 'columns': _arr(columns, 'columns')}

# String/scalar props: forwarded only when set (None/'' omitted so the upstream defaults apply).
for _k, _v in (('height', height), ('rowKey', rowKey), ('borderRadius', borderRadius)):
    if _v not in (None, ''):
        props[_k] = _v

# Boolean toggles. Those defaulting OFF upstream (the rest) are forwarded only when turned ON;
# withRowBorders and withColumnBorders default ON, so each is forwarded only when turned OFF
# (sending the non-default) — forwarding them only when ON would leave no way to switch them off.
if striped: props['striped'] = True
if withTableBorder: props['withTableBorder'] = True
if not withColumnBorders: props['withColumnBorders'] = False
if not withRowBorders: props['withRowBorders'] = False
if highlightOnHover: props['highlightOnHover'] = True
if stickyHeader: props['stickyHeader'] = True
if tabularNums: props['tabularNums'] = True
if enableColumnReordering: props['enableColumnReordering'] = True
if enableColumnResizing: props['enableColumnResizing'] = True

print(component('ListViewTable', attr=attr, **props))
```
