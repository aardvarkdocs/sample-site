---
name: pagination
description: An interactive pager (Mantine's Pagination). Set `total` (the number of
  pages, required) and the active page tracks clicks out of the box. Seed the initial
  page with `defaultValue`; tune the shape with `siblings` and `boundaries` (how many
  page buttons flank the current page and the ends), `size`, `radius`, `color`, `gap`,
  `withEdges` (first/last jump buttons), `withControls` (prev/next arrows), `disabled`,
  and `autoContrast`.
params:
  total: { type: int, required: true }
  defaultValue: int
  siblings: int
  boundaries: int
  size: string
  radius: string
  color: string
  gap: string
  withEdges: { type: bool, default: false }
  withControls: { type: bool, default: true }
  disabled: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
body: python
---
```python
# Renders the Pagination island, which owns the active-page state (Mantine's
# Pagination is controlled, so it can't be made interactive from a build-time macro).
# `total` always passes through; the rest are omitted when unset so Mantine's defaults
# apply. Numeric props (defaultValue/siblings/boundaries) are tested against None so a
# deliberate 0 survives. withControls defaults to True (matching Mantine) and is only
# forwarded when explicitly turned off.
props = {'total': total}
if defaultValue is not None: props['defaultValue'] = defaultValue
if siblings is not None: props['siblings'] = siblings
if boundaries is not None: props['boundaries'] = boundaries
if size: props['size'] = size
if radius: props['radius'] = radius
if color: props['color'] = color
if gap: props['gap'] = gap
if withEdges: props['withEdges'] = True
if not withControls: props['withControls'] = False
if disabled: props['disabled'] = True
if autoContrast: props['autoContrast'] = True
print(snippet('Pagination', attr=attr, **props))
```
