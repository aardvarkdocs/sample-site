---
name: title
description: A heading — the Mantine Title element (`<h1>`–`<h6>`). Set `order` (1–6)
  for the level, `size` for a visual size independent of the level, and the usual
  typography props — `c` (color), `ta` (align), `tt` (transform), `fw` (weight),
  `lh`/`lts`. The text is the block body (inline Markdown) or a `text` param. Use this
  when you want a heading with explicit styling; a plain Markdown `#` heading still
  works for ordinary headings. Close with {% endTitle %}.
params:
  text: string
  order: int
  size: string
  c: string
  ta: string
  tt: string
  fw: string
  lh: string
  lts: string
  id: string
  m: string
  mt: string
  mb: string
  ml: string
  mr: string
  mx: string
  my: string
body: python
---
```python
# Mirrors text.md: every typographic prop passes straight through to Mantine's Title
# (which validates the values) and unset props are omitted so Mantine's defaults apply.
# `order` (1–6) sets the heading level (<h1>–<h6>); `size` overrides only the visual
# size, independent of the level. The remaining props are the Mantine style system.
import aardvark.components as av
_title = {
    'order': order, 'size': size, 'c': c, 'ta': ta, 'tt': tt, 'fw': fw,
    'lh': lh, 'lts': lts, 'id': id,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
}
_props = {k: v for k, v in _title.items() if v not in (None, '', False)}
# order is an int param: 0/negative would be a meaningless heading level, so keep it
# only when 1–6 (Mantine's valid range); anything else falls back to Mantine's default.
if order is not None and 1 <= order <= 6:
    _props['order'] = order
else:
    _props.pop('order', None)
# The block body renders as inline Markdown (so **bold** / `code` / [links] format)
# nested inside the single heading element; the `text=` shortcut is plain text,
# HTML-escaped (untrusted tag attribute) like button/badge handle theirs.
import html as _h
import re
if (children or '').strip():
    _body = re.sub(r'\n\s*\n+', '\n', av.render_inline_markdown(children.strip()))
else:
    _body = _h.escape(text or '')
print(component('Title', children=_body, attr=attr, **_props))
```
