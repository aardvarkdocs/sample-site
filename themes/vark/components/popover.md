---
name: popover
description: A click-toggled floating panel anchored to a trigger button. `target` is the
  trigger label; the block body is the dropdown content (Markdown). Set `position`,
  `width` (number or `target`), `shadow`, `withArrow`, `arrowSize`, `offset`, `radius`,
  `trapFocus`, `closeOnClickOutside`, `targetVariant` (the trigger button's variant), and
  `opened` (force-show, for docs/screenshots). Close with {% endPopover %}.
params:
  target: { type: string, default: Toggle }
  position: string
  width: string
  shadow: string
  withArrow: { type: bool, default: false }
  arrowSize: int
  offset: int
  radius: string
  trapFocus: { type: bool, default: false }
  closeOnClickOutside: { type: bool, default: true }
  targetVariant: string
  opened: { type: bool, default: false }
body: python
---
```python
# Renders the Popover island (Popover.jsx), which assembles Popover.Target (a Button
# labelled `target`) + Popover.Dropdown (the block body). Every prop passes straight
# through to Mantine <Popover> (it validates the values); unset props are omitted so
# Mantine's own defaults apply.
#
# `width` accepts a number ("320") or the string "target" (match the trigger width);
# it's coerced to an int when numeric so Mantine gets a number, else passed as-is.
# closeOnClickOutside defaults to True (Mantine's own default) and is forwarded only
# when an author turns it off, so the prop stays out of the markup in the common case.
props = {'target': target}
if position: props['position'] = position
if width:
    props['width'] = int(width) if width.lstrip('-').isdigit() else width
if shadow: props['shadow'] = shadow
if withArrow: props['withArrow'] = True
if arrowSize is not None: props['arrowSize'] = arrowSize
if offset is not None: props['offset'] = offset
if radius: props['radius'] = radius
if trapFocus: props['trapFocus'] = True
if not closeOnClickOutside: props['closeOnClickOutside'] = False
if targetVariant: props['targetVariant'] = targetVariant
if opened: props['opened'] = True
if attr: props['attr'] = attr
# The block body is the dropdown content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Popover', children=_body, **props))
```
