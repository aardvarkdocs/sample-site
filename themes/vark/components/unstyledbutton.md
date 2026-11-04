---
name: unstyledbutton
description: A button with no styles (Mantine UnstyledButton) — a clean, accessible
  <button> (or <a> link via `url`) you style yourself. The label is the block body or a
  `text` param. Forwards the Mantine spacing/sizing/color style system and an `id`.
params:
  text: string
  # Link mode (component='a' + href)
  url: string
  target: string
  rel: string
  download: string
  # HTML id on the rendered button (or <a> in link mode)
  id: string
  # JavaScript click handler — any JS expression (rides the raw-attribute channel)
  onclick: string
  # Mantine spacing / color / sizing style system
  m: string
  mt: string
  mb: string
  ml: string
  mr: string
  mx: string
  my: string
  p: string
  pt: string
  pb: string
  pl: string
  pr: string
  px: string
  py: string
  bg: string
  c: string
  w: string
  h: string
  miw: string
  mih: string
  maw: string
  mah: string
body: python
---
```python
# UnstyledButton has no icon/section props, so it goes straight through component('UnstyledButton',
# ...) — no island needed. Unset (None / '' / False) props are omitted so Mantine's own defaults
# apply; `url` renders it as a link (component='a' + href). `onclick` rides the islands attr= channel
# (a raw HTML attribute — a string of JS, not a React function prop), matching the button tag.
# The inline `text=` string is escaped (a stored-XSS surface on multi-author sites); the block-form
# `children` is already-rendered template output and may carry intentional markup.
import html as _h
import aardvark.components as av
_props = {}
_p = {
    'id': id,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
for k, v in _p.items():
    if v not in (None, '', False):
        _props[k] = v
# Reject unsafe link targets at build time — dangerous schemes (javascript:/data:/…) and
# protocol-relative URLs (//host) — the build-time analog of sanitizeHref, shared with the other
# link-mode tags via av.is_unsafe_href.
if av.is_unsafe_href(url):
    raise ValueError(f"unstyledbutton: unsafe url {url!r} — use a relative path or an http(s):// link")
if url:
    _props['component'] = 'a'
    _props['href'] = url
    if target: _props['target'] = target
    if rel: _props['rel'] = rel
    if download: _props['download'] = download
_attr = dict(attr) if attr else {}
if onclick: _attr['onclick'] = onclick
_attr = _attr or None
_label = children if children else _h.escape(text or '')
print(component('UnstyledButton', children=_label, attr=_attr, **_props))
```
