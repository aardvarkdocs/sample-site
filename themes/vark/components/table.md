---
name: table
description: A data table — the Mantine Table element. Give the header cells in `head`
  (pipe-separated) and the body in `rows` (rows separated by `;`, cells by `|`, or a JSON
  array of arrays); each cell renders inline Markdown. Toggle `striped`, `highlightOnHover`,
  `withTableBorder`, `withColumnBorders`, `withRowBorders`, set `horizontalSpacing` /
  `verticalSpacing`, add a `caption` (`captionSide` top/bottom), or `stickyHeader` to pin the
  header while scrolling. A plain Markdown table still works; reach for this when you want the
  borders, striping, hover, caption, or sticky header.
params:
  head: string
  rows: string
  caption: string
  captionSide: string
  striped: { type: string, default: "" }
  highlightOnHover: { type: bool, default: false }
  withTableBorder: { type: bool, default: false }
  withColumnBorders: { type: bool, default: false }
  withRowBorders: { type: bool, default: true }
  stickyHeader: { type: bool, default: false }
  stickyHeaderOffset: int
  maxHeight: int
  horizontalSpacing: string
  verticalSpacing: string
  minWidth: string
body: python
---
```python
# Renders the Table island (Table.jsx), which maps the head/rows data to the compound
# Table.Thead/Tbody/Tr/Th/Td tree (a build-time macro can't emit that nested island tree
# through the JSON props channel — same reason Steps / List / Card have islands). Scalar
# props pass straight through to Mantine's Table (which validates the values); unset props
# are omitted so Mantine's defaults apply.
import json
import aardvark.components as av

def _cells(line):
    return [c.strip() for c in line.split('|')]

# Header: one pipe-separated line of cells. Empty -> no <thead>.
_head_src = _cells(head.strip()) if (head or '').strip() else []

# Body rows: a JSON array of arrays (for cells with literal pipes/semicolons), or the common
# `cell | cell ; cell | cell` shorthand — rows split on `;` or a newline, cells on `|`.
_rows_src = []
_raw = (rows or '').strip()
if _raw:
    if _raw.startswith('['):
        try:
            parsed = json.loads(_raw)
            if isinstance(parsed, list):
                _rows_src = [[str(c) for c in (r if isinstance(r, list) else [r])] for r in parsed]
        except ValueError:
            _rows_src = []  # not valid JSON → fall through to the delimited split below
    if not _rows_src:
        import re as _re
        _lines = [ln for ln in _re.split(r'[;\n]', _raw) if ln.strip()]
        _rows_src = [_cells(ln) for ln in _lines]

# Each cell renders inline Markdown (so **bold** / `code` / [links] format) — the island
# injects the resulting inline HTML inside a <Table.Th>/<Table.Td>. These fragments ride
# inside serialized island props, so resolve fingerprints and deploy prefixes before that
# opaque boundary.
_head = [av.render_inline_fragment(globals(), c) for c in _head_src]
_body = [[av.render_inline_fragment(globals(), c) for c in row] for row in _rows_src]

props = {'head': _head, 'rows': _body}
if caption: props['caption'] = caption
if captionSide: props['captionSide'] = captionSide
# striped takes True (stripe odd rows) or Mantine's 'odd' / 'even' to choose which set. It's a
# string param, so a bare `striped` flag (or striped=true, or striped=True via the component()
# form, which stringifies to 'True') arrives as 'true' — map that to the boolean Mantine wants;
# 'odd' / 'even' pass through; everything else (unset / '' / 'false') → no striping. Mirrors the
# bool|string handling on text.md's `truncate`.
_striped = (striped or '').strip().lower()
if _striped == 'true':
    props['striped'] = True
elif _striped in ('odd', 'even'):
    props['striped'] = _striped
if highlightOnHover: props['highlightOnHover'] = True
if withTableBorder: props['withTableBorder'] = True
if withColumnBorders: props['withColumnBorders'] = True
# withRowBorders defaults to True in Mantine; expose turning it OFF.
if withRowBorders is False: props['withRowBorders'] = False
if stickyHeader: props['stickyHeader'] = True
if stickyHeaderOffset is not None: props['stickyHeaderOffset'] = stickyHeaderOffset
# maxHeight caps the sticky-header scroll window (px); the island defaults to 320 when unset.
if maxHeight is not None: props['maxHeight'] = maxHeight
if horizontalSpacing: props['horizontalSpacing'] = horizontalSpacing
if verticalSpacing: props['verticalSpacing'] = verticalSpacing
if minWidth: props['minWidth'] = minWidth
print(component('Table', attr=attr, **props))
```
