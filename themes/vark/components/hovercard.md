---
name: hovercard
description: A floating card that opens when you hover its trigger (a richer Tooltip whose
  body is full Markdown). `target` is the inline trigger text; the block body is the card
  content. Set `position`, `width`, `shadow`, `withArrow`, `arrowSize`, `offset`, `radius`,
  `openDelay`, and `closeDelay`. Close with {% endHovercard %}.
params:
  target: { type: string, default: Hover me }
  position: string
  width: string
  shadow: string
  withArrow: { type: bool, default: false }
  arrowSize: int
  offset: int
  radius: string
  openDelay: int
  closeDelay: int
body: python
---
```python
# Renders the HoverCard island (HoverCard.jsx), which assembles HoverCard.Target (an
# Anchor labelled `target`) + HoverCard.Dropdown (the block body). Every prop passes
# straight through to Mantine <HoverCard> (it validates the values); unset props are
# omitted so Mantine's own defaults apply.
#
# `width` accepts a number ("320") or the string "target"; it's coerced to an int when
# numeric so Mantine gets a number, else passed as-is.
props = {'target': target}
if position: props['position'] = position
if width:
    props['width'] = int(width) if width.lstrip('-').isdigit() else width
if shadow: props['shadow'] = shadow
if withArrow: props['withArrow'] = True
if arrowSize is not None: props['arrowSize'] = arrowSize
if offset is not None: props['offset'] = offset
if radius: props['radius'] = radius
if openDelay is not None: props['openDelay'] = openDelay
if closeDelay is not None: props['closeDelay'] = closeDelay
if attr: props['attr'] = attr
# The block body is the card content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('HoverCard', children=_body, **props))
```
