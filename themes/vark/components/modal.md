---
name: modal
description: A centered modal dialog with a trigger button — click to open, close via
  the close button, overlay click, or Escape. Set `title`, `size`, `radius`, `padding`,
  `centered`, `fullScreen`, `withCloseButton`, `closeOnClickOutside`, `closeOnEscape`,
  and overlay/transition tuning (`overlayBackgroundOpacity`, `overlayBlur`,
  `transition`, `transitionDuration`). `triggerLabel` sets the opener button text;
  start it open with `opened`. The block body is the modal content. Close with
  {% endModal %}.
params:
  title: string
  triggerLabel: string
  opened: { type: bool, default: false }
  size: string
  radius: string
  padding: string
  centered: { type: bool, default: false }
  fullScreen: { type: bool, default: false }
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
# Builds the Mantine <Modal> prop object the Modal island spreads. Every
# field maps straight to a Mantine Modal prop (Mantine validates the values); unset
# props are omitted so Mantine's own defaults apply. The two structured props are
# composed from flat params: overlayProps (backgroundOpacity/blur) and
# transitionProps (transition/duration) — a build-time macro can't pass nested
# objects through an attr, so they're flattened here and recombined.
#
# withCloseButton/closeOnClickOutside/closeOnEscape default to True (Mantine's own
# defaults) but are still emitted explicitly so an author can turn them OFF — a bool
# param defaulting True can only be observed when forwarded.
import aardvark.components as av
modal = {}
if title: modal['title'] = title
if size: modal['size'] = size
if radius: modal['radius'] = radius
if padding: modal['padding'] = padding
if centered: modal['centered'] = True
if fullScreen: modal['fullScreen'] = True
modal['withCloseButton'] = withCloseButton
modal['closeOnClickOutside'] = closeOnClickOutside
modal['closeOnEscape'] = closeOnEscape
# Dismissal safety net. On a static page the island's useDisclosure is the only open/close
# state, and the only things that flip it closed are Mantine's own dismiss affordances — the
# close button, an overlay click, or Escape. Turning off all three leaves a modal that opens
# over the whole page with NO way out (there's no app code here to call onClose). Force the
# close button back on, and warn, so every modal can always be dismissed.
if not withCloseButton and not closeOnClickOutside and not closeOnEscape:
    modal['withCloseButton'] = True
    av.warn("modal: withCloseButton, closeOnClickOutside and closeOnEscape are all off, which would "
          "leave no way to close the modal — re-enabling the close button so it stays dismissible")
if overlayBackgroundOpacity is not None or overlayBlur is not None:
    overlay = {}
    if overlayBackgroundOpacity is not None: overlay['backgroundOpacity'] = overlayBackgroundOpacity
    if overlayBlur is not None: overlay['blur'] = overlayBlur
    modal['overlayProps'] = overlay
if transition or transitionDuration is not None:
    tp = {}
    if transition: tp['transition'] = transition
    if transitionDuration is not None: tp['duration'] = transitionDuration
    modal['transitionProps'] = tp
props = {'modalProps': modal}
if triggerLabel: props['triggerLabel'] = triggerLabel
if opened: props['opened'] = True
if attr: props['attr'] = attr
# The block body is the modal content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Modal', children=_body, **props))
```
