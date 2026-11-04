---
name: tooltip
description: A floating label shown on hover/focus of a single target. The target is the
  block body; `label` is the floating text. Set `position`, `color`, `withArrow`,
  `arrowSize`, `offset`, `multiline`, `width`, `radius`, `openDelay`, `closeDelay`,
  `transition`/`transitionDuration`, and `opened` (force-show, for docs/screenshots).
  Close with {% endTooltip %}.
params:
  label: string
  position: string
  color: string
  withArrow: { type: bool, default: false }
  arrowSize: int
  offset: int
  multiline: { type: bool, default: false }
  width: int
  radius: string
  openDelay: int
  closeDelay: int
  transition: string
  transitionDuration: int
  opened: { type: bool, default: false }
body: python
---
```python
# Renders the Tooltip island (Tooltip.jsx), which wraps the block body in a single
# targetable <span> and attaches Mantine's Tooltip. Every prop passes straight
# through to Mantine (it validates the values); unset props are omitted so Mantine's
# own defaults apply. `opened` is a real bool that force-shows the tooltip (handy in
# the docs/screenshots); leaving it off lets the default hover/focus behavior take
# over after hydration.
props = {}
if label: props['label'] = label
if position: props['position'] = position
if color: props['color'] = color
if withArrow: props['withArrow'] = True
if arrowSize is not None: props['arrowSize'] = arrowSize
if offset is not None: props['offset'] = offset
if multiline: props['multiline'] = True
if width is not None: props['width'] = width
if radius: props['radius'] = radius
if openDelay is not None: props['openDelay'] = openDelay
if closeDelay is not None: props['closeDelay'] = closeDelay
if opened: props['opened'] = True
# Compose Mantine's transitionProps from flat scalars, matching modal/drawer/dialog
# (the island spreads it onto <Tooltip>). Both are optional; emitted only when set.
if transition or transitionDuration is not None:
    _tp = {}
    if transition: _tp['transition'] = transition
    if transitionDuration is not None: _tp['duration'] = transitionDuration
    props['transitionProps'] = _tp
if attr: props['attr'] = attr
# The block body is the tooltip target (the hovered content) — bracket it with blank lines so
# the single Markdown pass renders it (emphasis, links, lists) rather than leaving it literal
# inside the island's one-line <div> (the block-component convention). An empty/self-closing body
# stays '' so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Tooltip', children=_body, **props))
```
