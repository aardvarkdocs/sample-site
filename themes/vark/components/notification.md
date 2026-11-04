---
name: notification
description: A notification card — a titled message with a colored accent line, used to
  show a static toast/alert inline in docs. Set `title`, `color`, `radius`, and toggle
  `withCloseButton`, `withBorder`, and `loading` (swaps the accent line for a spinner).
  The block body (or a `text` param) is the message. Close with {% endNotification %}.
params:
  title: string
  text: string
  color: string
  radius: string
  withCloseButton: { type: bool, default: false }
  withBorder: { type: bool, default: false }
  loading: { type: bool, default: false }
body: python
---
```python
# Mirrors button.md / badge.md: each prop is optional and unset ones are omitted so
# Mantine's own defaults apply. The message is the block body or the `text` param.
# withCloseButton defaults to True in Mantine; here it defaults False so a static,
# inline doc notification has no dead close button — pass withCloseButton=true to show
# one (it has no onClose handler, so it's decorative). `title` rides the JSON props
# channel, so React escapes it. The message rides `children` (raw children_html), so —
# matching button.md — the inline `text=` string is html-escaped (a stored-XSS surface
# if pages come from untrusted authors) while block-form `children` is left intact (it's
# already-rendered template output that may carry intentional markup). No icon: a
# React-node icon can't ride the props channel, so the accent line conveys the type.
import html as _h
props = {}
if title: props['title'] = title
if color: props['color'] = color
if radius: props['radius'] = radius
if withCloseButton: props['withCloseButton'] = True
if withBorder: props['withBorder'] = True
if loading: props['loading'] = True
if attr: props['attr'] = attr
# Mantine's Notification shows a close button by default; suppress it unless the author
# asked for one, so the static inline form isn't cluttered with a no-op button.
if not withCloseButton:
    props['withCloseButton'] = False
# The block-form message is the prose body — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside the
# island's one-line <div> (the block-component convention). An empty/self-closing body falls back
# to the html-escaped inline `text=` (itself '' when unset), so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else _h.escape(text or '')
print(component('Notification', children=_body, **props))
```
