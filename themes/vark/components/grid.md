---
name: grid
description: A flexible 12-column grid (columns can span and offset). Content goes in cells
  spread across `columns` (default 12) tracks. Provide cells either as the block body (each
  top-level block becomes one auto-width cell) or with `items` (a `|`-separated list of cell
  texts) plus optional `spans` (a comma-separated list of column spans, one per item). Set
  `gap` (Mantine size token or any CSS value), `justify`, `align`, `grow`, `overflow`, and
  the default per-cell `span`. See https://mantine.dev/core/grid/.
params:
  # Cell content via param (alternative to the block body)
  items: string
  spans: string
  span: string
  # Grid options
  columns: int
  gap: string
  justify: string
  align: string
  grow: { type: bool, default: false }
  overflow: string
body: python
---
```python
# Renders the Grid island (Grid.jsx), which owns the Grid -> Grid.Col mapping (Grid is
# compound; the cells can't ride the flat JSON props channel). `items` (a `|`-separated
# string) becomes a list of { content, span } cells — spans pairs each item with a column
# span from the comma-separated `spans` (falling back to the grid-wide `span`, then
# 'auto'). Without `items`, the block body is passed through and the island wraps each
# top-level element in one auto-spanning Grid.Col. Unset props are omitted so Mantine's
# Grid defaults apply (columns 12, gap 'md', span 'auto'). (Mantine 9 renamed Grid's
# `gutter` prop → `gap`.)
_props = {}
if columns is not None: _props['columns'] = columns
if gap: _props['gap'] = gap
if justify: _props['justify'] = justify
if align: _props['align'] = align
if grow: _props['grow'] = True
if overflow: _props['overflow'] = overflow
if span: _props['span'] = span

if items:
    _cells = [c.strip() for c in items.split('|')]
    _spanlist = [s.strip() for s in spans.split(',')] if spans else []
    _items = []
    for _i, _content in enumerate(_cells):
        _cell = {'content': _content}
        if _i < len(_spanlist) and _spanlist[_i]:
            _s = _spanlist[_i]
            # Numeric spans ride as numbers (Mantine treats "auto"/"content" specially).
            _cell['span'] = int(_s) if _s.isdigit() else _s
        _items.append(_cell)
    _props['items'] = _items
    print(snippet('Grid', attr=attr, **_props))
else:
    print(snippet('Grid', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
