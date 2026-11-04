---
name: window
description: A draggable, resizable window with a title bar and window controls (a Community
  Component wrapping @gfazioli/mantine-window). The block body is the window content. Set `title`
  (header text), `draggable` (`none`/`window`/`header`/`both`), `resizable`
  (`none`/`vertical`/`horizontal`/`both`), `color`, `radius`, `shadow`, and toggle the controls
  (`withCloseButton`, `withCollapseButton`, `withToolsButton`). By default the window sits inside
  the page flow; pass `withinPortal=true` to float it over the whole viewport instead. This is a
  different component from the Mantine-core `floatingwindow` builtin. Close with {% endWindow %}.
params:
  title: string
  draggable: string
  resizable: string
  color: string
  radius: string
  shadow: string
  width: int
  height: int
  withinPortal: { type: bool, default: false }
  withCloseButton: { type: bool, default: true }
  withCollapseButton: { type: bool, default: true }
  withToolsButton: { type: bool, default: true }
  withBorder: { type: bool, default: true }
body: python
---
```python
# Renders the Window island (Window.jsx), a thin wrapper around the community
# @gfazioli/mantine-window. The island defaults withinPortal to False (an in-page demo window in
# a relative host) — pass withinPortal=true to float it over the viewport. The block body is the
# window content. Unset props are omitted so the package's own defaults apply (resizable 'both',
# draggable 'both', shadow 'md'). The with* toggles default True but are forwarded explicitly so
# an author can turn them off; an unset width/height lets the package size the window.
props = {
    'withinPortal': withinPortal,
    'withCloseButton': withCloseButton,
    'withCollapseButton': withCollapseButton,
    'withToolsButton': withToolsButton,
    'withBorder': withBorder,
}
if title: props['title'] = title
if draggable: props['draggable'] = draggable
if resizable: props['resizable'] = resizable
if color: props['color'] = color
if radius: props['radius'] = radius
if shadow: props['shadow'] = shadow
if width is not None and width > 0: props['defaultWidth'] = width
if height is not None and height > 0: props['defaultHeight'] = height
if attr: props['attr'] = attr
# Bracket the body with blank lines so the single Markdown pass renders it (paragraphs,
# emphasis, links, nested islands) rather than swallowing it as raw HTML — same trick as
# aside.md / blockquote.md.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('Window', children=_body, **props))
```
