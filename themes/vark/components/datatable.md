---
name: datatable
description: A themed data grid (the Community Component wrapping icflorescu's
  mantine-datatable). Give it `columns` (a JSON array of `{accessor, title?, textAlign?,
  width?}` column definitions) and `records` (a JSON array of row objects keyed by
  each column's accessor), plus the usual table toggles — withTableBorder, withColumnBorders,
  striped, highlightOnHover, noHeader — and `borderRadius`, `height`, and `noRecordsText`.
  Renders a semantic table; the grid's controlled features (sorting, selection, pagination)
  need state a static page can't hold, so they are not exposed. Self-closing
  ({% datatable … %}); it takes no body.
params:
  columns: string
  records: string
  height: string
  borderRadius: string
  noRecordsText: string
  withTableBorder: { type: bool, default: false }
  withColumnBorders: { type: bool, default: false }
  striped: { type: bool, default: false }
  highlightOnHover: { type: bool, default: false }
  noHeader: { type: bool, default: false }
body: python
---
```python
# The datatable tag renders the DataTable island (DataTable.jsx), which wraps
# `mantine-datatable`. `columns` and `records` arrive as JSON STRING params (a column def's
# render/sort callbacks can't ride a build-time macro, but the static {accessor, title, …}
# shape and the row data can) and are parsed here so the island receives clean arrays. A
# malformed array warns and degrades to [] rather than aborting the build — mirroring
# select.md / linechart.md. The table is a form-free display widget, so the body is ignored.
import json as _json
import aardvark.components as av

def _arr(s, field):
    # Parse a JSON-array string param; warn + degrade to [] on anything that isn't a list, so a
    # typo (missing bracket, an object instead of an array) is a visible build warning rather
    # than a silent broken table.
    if not s:
        return []
    try:
        v = _json.loads(s)
    except (ValueError, TypeError):
        av.warn(f"datatable: {field} is not valid JSON — using an empty array; check the value")
        return []
    if not isinstance(v, list):
        av.warn(f"datatable: {field} must be a JSON array — using an empty array")
        return []
    return v

# columns/records always ride the props channel (even when empty) — the island requires both
# to be arrays. Everything else is omitted unless set so Mantine-Datatable's own defaults apply.
def _presentation_only(cols):
    # `sortable` is a CONTROLLED feature, and it is not a macro param — but it can still arrive
    # inside the `columns` JSON. The installed package renders a sortable header as
    # `role: l?"button":void 0, tabIndex: l?0:void 0, onClick: _` where `_` comes from
    # `onSortStatusChange`; a build-time tag has nowhere to keep the sort state or supply that
    # handler, so forwarding it ships a focusable header announced to a screen reader as a button
    # that does nothing. Drop it and say so — a dead control is worse than no control.
    _dropped = []
    _clean = []
    for _col in cols:
        if isinstance(_col, dict) and _col.get('sortable'):
            _dropped.append(str(_col.get('accessor', '?')))
            _col = {_k: _v for _k, _v in _col.items() if _k != 'sortable'}
        _clean.append(_col)
    if _dropped:
        av.warn(
            "datatable: dropping sortable on column(s) " + ', '.join(_dropped)
            + " - sorting needs state and a change handler this tag cannot supply, so the header"
            + " would be focusable but do nothing; sort the records before passing them in"
        )
    return _clean

props = {'columns': _presentation_only(_arr(columns, 'columns')), 'records': _arr(records, 'records')}
if height: props['height'] = height
if borderRadius: props['borderRadius'] = borderRadius
if noRecordsText: props['noRecordsText'] = noRecordsText
# Boolean toggles, all defaulting OFF — forwarded only when turned on so the props dict stays
# minimal (a bare flag like `striped` coerces to "True"/truthy, which the `if` normalizes).
if withTableBorder: props['withTableBorder'] = True
if withColumnBorders: props['withColumnBorders'] = True
if striped: props['striped'] = True
if highlightOnHover: props['highlightOnHover'] = True
if noHeader: props['noHeader'] = True
print(component('DataTable', attr=attr, **props))
```
