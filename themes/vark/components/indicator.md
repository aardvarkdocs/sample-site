---
name: indicator
description: A small dot or label badge positioned over the corner of another element — a
  notification count on an avatar, a status dot on an icon, and so on. The block body is the
  element being marked; set `label` for the text/count shown in the indicator (omit it for a
  plain dot), `color` (any theme color), `size` (dot diameter in px), `position` (top-start,
  top-center, top-end, middle-start, …, bottom-end), `offset` (nudge in px, for rounded
  targets), `withBorder`, `processing` (a pulsing animation), `disabled` (render the child
  only), and `inline` (lay the container out inline). Close with {% endIndicator %}.
params:
  label: string
  color: string
  size: int
  position: string
  offset: int
  radius: string
  withBorder: { type: bool, default: false }
  disabled: { type: bool, default: false }
  processing: { type: bool, default: false }
  inline: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
body: python
---
```python
# Mirrors badge.md / rating.md: every prop is optional and unset ones are omitted so
# Mantine's own defaults apply (position 'top-end', size 10, …). The block body is the
# target element (already-rendered template output — e.g. a nested avatar or icon); it
# always passes through as children, which Mantine positions the indicator over. Numeric
# props are tested against None (not truthiness) so a deliberate 0 survives.
props = {}
if label: props['label'] = label
if color: props['color'] = color
if size is not None: props['size'] = size
if position: props['position'] = position
if offset is not None: props['offset'] = offset
if radius: props['radius'] = radius
if withBorder: props['withBorder'] = True
if disabled: props['disabled'] = True
if processing: props['processing'] = True
if inline: props['inline'] = True
if autoContrast: props['autoContrast'] = True
# The block body is the marked element — bracket it with blank lines so the single Markdown
# pass renders it (emphasis, links, lists) rather than leaving it literal inside the island's
# one-line <div> (the block-component convention). A lone nested island (avatar/icon) still passes
# through fine. An empty/self-closing body stays '' so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Indicator', children=_body, attr=attr, **props))
```
