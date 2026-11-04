---
name: floatingwindow
description: A draggable floating panel that opens over the page — a titled card you can grab by
  its header and move around the viewport. A trigger button opens it; set `triggerLabel` (button
  text), `title` (header text), `width` (px), `shadow`, `radius`, and toggle the border
  (`withBorder`, on by default). The close button is always present — it is the window's only
  way to close, so `withCloseButton=false` is restored with a warning. The block body is
  the window content. Close with {% endFloatingwindow %}.
params:
  triggerLabel: { type: string, default: Open window }
  title: string
  width: int
  shadow: string
  radius: string
  withCloseButton: { type: bool, default: true }
  withBorder: { type: bool, default: true }
body: python
---
```python
# Renders the FloatingWindow island (FloatingWindow.jsx), a thin wrapper around
# Mantine's FloatingWindow — which floats over the viewport via a Portal and is a bare draggable
# Paper. The wrapper adds the trigger button + a header drag-handle + a close button (the native
# component has no open/close of its own — closing unmounts it). `triggerLabel` is the opener
# button's text; the rest map to the window chrome / Paper styling. withCloseButton/withBorder
# default True but are forwarded explicitly so an author can turn them off; unset width/shadow/
# radius are omitted so the component's own defaults apply.
import aardvark.components as av
props = {
    'triggerLabel': triggerLabel,
    'withCloseButton': withCloseButton,
    'withBorder': withBorder,
}
# Dismissal safety net (mirrors dialog.md). A floating window has no backdrop and no Escape
# handling — the header close button is its ONLY exit, and on a static page nothing else can
# unmount it. So withCloseButton=false would leave a window that can never be dismissed once
# it is opened. Force it back on, and warn, so every window stays dismissible.
if not withCloseButton:
    props['withCloseButton'] = True
    av.warn("floatingwindow: withCloseButton is off, but it's the window's only way to close on a "
          "static page — re-enabling the close button so it stays dismissible")
if title: props['title'] = title
if width is not None: props['width'] = width
if shadow: props['shadow'] = shadow
if radius: props['radius'] = radius
if attr: props['attr'] = attr
# The block body is the window content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('FloatingWindow', children=_body, **props))
```
