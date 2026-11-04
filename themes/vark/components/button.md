---
name: button
description: A styled button or link. Supports variant, color, size, radius, gradient,
  sections, link attributes (target, rel, download), the Mantine spacing/sizing system,
  `id`, and an `onclick` handler — every Mantine Button capability in a single tag.
params:
  # Label
  text: string
  # Link mode (component='a' + href)
  url: string
  target: string
  rel: string
  download: string
  # State / behavior
  variant: string
  color: string
  size: string
  radius: string
  fullWidth: { type: bool, default: false }
  disabled: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
  justify: string
  type: string
  # HTML id on the rendered button (or <a> in link mode) — for CSS / JS selectors
  id: string
  # JavaScript click handler — any JS expression, evaluated when the button is
  # clicked (typically an inline anonymous function, e.g. "(() => alert('hi'))()")
  onclick: string
  # Sections (string content — emoji, arrow, short text; for richer React nodes use
  # {% component('Button', leftSection=..., ...) %} directly)
  leftSection: string
  rightSection: string
  # Gradient variant — assembled into gradient={from, to, deg}
  gradientFrom: string
  gradientTo: string
  gradientDeg: float
  # Mantine spacing system (margin / padding — Mantine size tokens or any CSS value)
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
  # Color shortcuts + sizing
  bg: string
  c: string
  w: string
  h: string
  miw: string
  mih: string
  maw: string
  mah: string
emits: [Button]
body: python
---
```python
# The header's topButtons take these same fields (the Button page's "In the header"); the
# chrome reads them from this front matter.
# Unset (None / '' / False) → omitted so Mantine's own
# defaults apply; url renders the Button as a link (component='a' + href), and a
# scoped reset in theme.css (.aardvark-content a:not(.mantine-Button-root)) keeps it
# looking like a button rather than a prose link. `id` is forwarded as a React prop
# and lands on the rendered DOM element (so `#id` selectors work in CSS / JS).
# `onclick` rides the islands `attr=` channel (raw HTML attribute, not a React prop —
# React would expect a function, but we have a string of JS).
import aardvark.components as av
_btn = {
    'variant': variant, 'color': color, 'size': size, 'radius': radius,
    'fullWidth': fullWidth, 'disabled': disabled,
    'autoContrast': autoContrast, 'justify': justify, 'type': type, 'id': id,
    'leftSection': leftSection, 'rightSection': rightSection,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _btn.items() if v not in (None, '', False)}
if gradientFrom or gradientTo or gradientDeg is not None:
    _g = {}
    if gradientFrom: _g['from'] = gradientFrom
    if gradientTo: _g['to'] = gradientTo
    if gradientDeg is not None: _g['deg'] = gradientDeg
    _props['gradient'] = _g
# Reject unsafe link targets at build time — dangerous schemes (javascript:/data:/…) and
# protocol-relative URLs (//host) — the build-time analog of sanitizeHref, shared with the other
# link-mode tags via av.is_unsafe_href.
if av.is_unsafe_href(url):
    raise ValueError(f"button: unsafe url {url!r} — use a relative path or an http(s):// link")
if url:
    _props['component'] = 'a'
    _props['href'] = url
    if target: _props['target'] = target
    if rel: _props['rel'] = rel
    if download: _props['download'] = download
_attr = dict(attr) if attr else {}
if onclick: _attr['onclick'] = onclick
_attr = _attr or None
# Match the header top-bar buttons: escape the inline `text=` string (a stored-XSS surface if
# pages come from untrusted authors), but leave block-form `children` intact — it's
# already-rendered template output and may carry intentional markup.
import html as _h
_label = children if children else _h.escape(text or '')
print(component('Button', children=_label, attr=_attr, **_props))
```
