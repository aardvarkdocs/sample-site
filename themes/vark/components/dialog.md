---
name: dialog
description: A fixed, corner-anchored dialog panel (no backdrop) with a trigger button.
  Set `position` (e.g. bottom-right), `size`, `radius`, `withBorder`,
  `withCloseButton`, and transition tuning (`transition`, `transitionDuration`).
  `triggerLabel` sets the opener button text; start it open with `opened`. The block
  body is the dialog content. Close with {% endDialog %}.
params:
  triggerLabel: string
  opened: { type: bool, default: false }
  position: string
  size: string
  radius: string
  withBorder: { type: bool, default: false }
  withCloseButton: { type: bool, default: true }
  transition: string
  transitionDuration: int
body: python
---
```python
# Builds the Mantine <Dialog> prop object the Dialog island spreads. Each
# field maps straight to a Mantine Dialog prop; unset props are omitted.
#
# Mantine's Dialog `position` is an object of CSS offsets ({top/bottom/left/right});
# the friendly string form here (e.g. 'bottom-right') is parsed into that object so
# an author needn't write CSS. Each named edge sets exactly its own offset — a single
# edge (e.g. 'top') anchors to just that edge, NOT a corner. Only when no edge keyword
# matches at all do we fall back to Mantine's default bottom-right corner. A blank
# position is omitted entirely, so Mantine's own default applies. transitionProps is
# composed from the flat transition/transitionDuration params, like modal.md.
import aardvark.components as av
dialog = {}
if position:
    parts = {p.strip().lower() for p in position.replace('-', ' ').split()}
    pos = {}
    if 'top' in parts: pos['top'] = 20
    if 'bottom' in parts: pos['bottom'] = 20
    if 'left' in parts: pos['left'] = 20
    if 'right' in parts: pos['right'] = 20
    # Fall back to the default corner ONLY when the author gave no recognized edge — a
    # vertical-only ('top') or horizontal-only ('left') position must not be bumped into a
    # corner (the old `not (parts & {...})` defaults made 'top' render as top-right).
    if not pos:
        pos = {'bottom': 20, 'right': 20}
    dialog['position'] = pos
if size: dialog['size'] = size
if radius: dialog['radius'] = radius
if withBorder: dialog['withBorder'] = True
dialog['withCloseButton'] = withCloseButton
# Dismissal safety net. Unlike Modal/Drawer a Mantine Dialog has no backdrop or Escape handling —
# the header close button is its ONLY exit, and on a static page nothing else can call onClose.
# So withCloseButton=false would leave a dialog that can never be dismissed once open. Force it
# back on, and warn, so every dialog stays dismissible.
if not withCloseButton:
    dialog['withCloseButton'] = True
    av.warn("dialog: withCloseButton is off, but it's the dialog's only way to close on a static "
          "page — re-enabling the close button so it stays dismissible")
if transition or transitionDuration is not None:
    tp = {}
    if transition: tp['transition'] = transition
    if transitionDuration is not None: tp['duration'] = transitionDuration
    dialog['transitionProps'] = tp
props = {'dialogProps': dialog}
if triggerLabel: props['triggerLabel'] = triggerLabel
if opened: props['opened'] = True
if attr: props['attr'] = attr
# The block body is the dialog content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Dialog', children=_body, **props))
```
