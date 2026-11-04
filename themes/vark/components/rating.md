---
name: rating
description: A star rating for collecting feedback or showing a score. Set `defaultValue`
  (the stars shown on load; a float, so half-stars work with `fractions`), `count` (number
  of symbols), `fractions` (sub-symbol granularity), plus the usual color/size and `readOnly`.
params:
  defaultValue: float
  count: int
  fractions: int
  color: string
  size: string
  readOnly: { type: bool, default: false }
  name: string
body: python
---
```python
# Mirrors button.md: every prop is optional and unset ones are omitted so Mantine's
# own defaults apply (count=5, fractions=1, …). Rating renders radio inputs and takes
# no children, so the body passes props only. Numeric props are tested against None
# (not truthiness) so a deliberate 0 survives instead of being silently dropped.
props = {}
if defaultValue is not None: props['defaultValue'] = defaultValue
if count is not None: props['count'] = count
if fractions is not None: props['fractions'] = fractions
if color: props['color'] = color
if size: props['size'] = size
if readOnly: props['readOnly'] = True
if name: props['name'] = name
# Forward attr (e.g. attr={'onchange': '...'}) onto the Rating's root, exactly like
# component('Rating', attr=...). `attr` is the dict parsed from the tag's attr={...}.
if attr: props['attr'] = attr
print(component('Rating', **props))
```
