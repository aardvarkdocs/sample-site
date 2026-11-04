---
name: timeline
description: A vertical timeline of events — a run of bullets joined by a connecting line,
  each with a title and body. Pass the events as a JSON array in `items` (each object takes
  `title`, `content`, and optionally `bullet` — a Tabler icon name, emoji, or short text —
  plus per-item `color` and `lineVariant` of `solid`/`dashed`/`dotted`). Set `active` (index
  of the last highlighted item), `bulletSize`, `lineWidth`, `radius`, `color`, `align`
  (`left`/`right`), `reverseActive`, and `autoContrast`.
params:
  items: string
  active: int
  bulletSize: int
  lineWidth: int
  radius: string
  color: string
  align: string
  reverseActive: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
body: python
---
```python
# Renders the Timeline island (Timeline.jsx), which owns the Timeline / Timeline.Item compound
# tree — a Timeline.Item's bullet/title/body are React nodes that can't ride the JSON props
# channel of component('Timeline', ...). The events arrive as a JSON array string in `items`;
# we parse it here and forward the list, so the island gets plain data and never parses author
# text. Timeline-level props are optional and unset ones are omitted so Mantine's own defaults
# apply (active=-1, align='left', …); numeric props are tested against None so a deliberate 0
# (e.g. active=0) survives.
import json
import aardvark.components as av

parsed = []
if items:
    try:
        data = json.loads(items)
        if isinstance(data, list):
            parsed = [it for it in data if isinstance(it, dict)]
    except (ValueError, TypeError):
        # A malformed items= JSON shouldn't abort the build — degrade to an empty timeline
        # (the island renders nothing) so a single typo is visible, not fatal. The page-level
        # unknown-component/warning posture is the same family of non-fatal degrade.
        parsed = []

props = {'items': parsed}
if active is not None: props['active'] = active
if bulletSize is not None: props['bulletSize'] = bulletSize
if lineWidth is not None: props['lineWidth'] = lineWidth
if radius: props['radius'] = radius
if color: props['color'] = color
if align: props['align'] = align
if reverseActive: props['reverseActive'] = True
if autoContrast: props['autoContrast'] = True
# The Tabler CDN base for a lazily-fetched bullet glyph (honors theme.iconCdn/iconVersion),
# exactly like the built-in icon and card islands. av.tabler_icon_cdn falls back to the CDN
# default in a bare render with no config.
props['iconCdn'] = av.tabler_icon_cdn(globals())
print(snippet('Timeline', attr=attr, **props))
```
