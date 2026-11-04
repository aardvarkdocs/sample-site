---
name: burger
description: A hamburger / cross menu toggle (Mantine's Burger). Set `opened=true` to
  show the cross (an open state) instead of the three-line burger; `size` (xs–xl or any
  CSS size), `color`, `lineSize` (bar thickness in px), and `transitionDuration` (ms).
  Give it an `aria-label` via the `label` param. Static by itself — wire interactivity
  with an `onclick` handler (`attr={...}`) or use it inside a snippet.
params:
  opened: { type: bool, default: false }
  size: string
  color: string
  lineSize: int
  transitionDuration: int
  transitionTimingFunction: string
  # Accessible name — rendered as aria-label on the button
  label: string
body: python
---
```python
# Mirrors badge.md / rating.md: every prop is optional and unset ones are omitted so
# Mantine's own defaults apply. `opened` flips the burger to a cross. Numeric props
# (lineSize / transitionDuration) are tested against None so a deliberate 0 survives.
# Burger renders a <button> and takes no children. `label` becomes aria-label (the
# button has no visible text, so an accessible name matters); it rides the props
# channel so React escapes it. Forward `attr` (e.g. attr={'onclick': '...'}) onto the
# root, like component('Burger', attr=...).
props = {}
if opened: props['opened'] = True
if size: props['size'] = size
if color: props['color'] = color
if lineSize is not None: props['lineSize'] = lineSize
if transitionDuration is not None: props['transitionDuration'] = transitionDuration
if transitionTimingFunction: props['transitionTimingFunction'] = transitionTimingFunction
if label: props['aria-label'] = label
print(component('Burger', attr=attr, **props))
```
