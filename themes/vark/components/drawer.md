---
name: drawer
description: A slide-in drawer panel with a trigger button — click to open, close via
  the close button, overlay click, or Escape. Set `title`, `position`
  (left/right/top/bottom), `size`, `offset`, `radius`, `padding`, `withCloseButton`,
  `closeOnClickOutside`, `closeOnEscape`, and overlay/transition tuning
  (`overlayBackgroundOpacity`, `overlayBlur`, `transition`, `transitionDuration`).
  `triggerLabel` sets the opener button text; start it open with `opened`. The block
  body is the drawer content. Close with {% endDrawer %}.
params:
  title: string
  triggerLabel: string
  opened: { type: bool, default: false }
  position: string
  size: string
  offset: int
  radius: string
  padding: string
  withCloseButton: { type: bool, default: true }
  closeOnClickOutside: { type: bool, default: true }
  closeOnEscape: { type: bool, default: true }
  overlayBackgroundOpacity: float
  overlayBlur: float
  transition: string
  transitionDuration: int
body: python
---
```python
# Builds the Mantine <Drawer> prop object the Drawer island spreads. Mirrors
# modal.md: each field maps straight to a Mantine Drawer prop, unset props are
# omitted, and the structured overlayProps/transitionProps objects are composed from
# flat params. position picks the edge the drawer slides from (default 'left').
import aardvark.components as av
drawer = {}
if title: drawer['title'] = title
if position: drawer['position'] = position
if size: drawer['size'] = size
if offset is not None: drawer['offset'] = offset
if radius: drawer['radius'] = radius
if padding: drawer['padding'] = padding
drawer['withCloseButton'] = withCloseButton
drawer['closeOnClickOutside'] = closeOnClickOutside
drawer['closeOnEscape'] = closeOnEscape
# Dismissal safety net (mirrors modal.md). The slide-in drawer covers the page over an overlay;
# its only dismiss affordances are the close button, an overlay click, and Escape. Turning off
# all three leaves a drawer that can never be closed on a static page (no app code to call
# onClose). Force the close button back on, and warn, so every drawer stays dismissible.
if not withCloseButton and not closeOnClickOutside and not closeOnEscape:
    drawer['withCloseButton'] = True
    av.warn("drawer: withCloseButton, closeOnClickOutside and closeOnEscape are all off, which would "
          "leave no way to close the drawer — re-enabling the close button so it stays dismissible")
if overlayBackgroundOpacity is not None or overlayBlur is not None:
    overlay = {}
    if overlayBackgroundOpacity is not None: overlay['backgroundOpacity'] = overlayBackgroundOpacity
    if overlayBlur is not None: overlay['blur'] = overlayBlur
    drawer['overlayProps'] = overlay
if transition or transitionDuration is not None:
    tp = {}
    if transition: tp['transition'] = transition
    if transitionDuration is not None: tp['duration'] = transitionDuration
    drawer['transitionProps'] = tp
props = {'drawerProps': drawer}
if triggerLabel: props['triggerLabel'] = triggerLabel
if opened: props['opened'] = True
if attr: props['attr'] = attr
# The block body is the drawer content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Drawer', children=_body, **props))
```
