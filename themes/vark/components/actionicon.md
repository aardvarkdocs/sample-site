---
name: actionicon
description: An icon-only button (Mantine ActionIcon). The `icon` is an icon spec — a
  Tabler name, Font Awesome class, image path/URL, emoji, or inline <svg> — read exactly
  like the {% icon %} tag. Exposes variant, color, size, radius, loading, disabled,
  gradient, autoContrast, and a `label` for the accessible name. Link mode via `url`.
params:
  # The icon spec (Tabler name / FA class / image / emoji / inline <svg>) — see {% icon %}.
  icon: string
  # filled picks the filled Tabler style for a bare Tabler name.
  filled: { type: bool, default: false }
  # Accessible name for the icon-only button (an icon button is otherwise unnamed for SRs).
  label: string
  # Appearance / behavior
  variant: string
  color: string
  size: string
  radius: string
  loading: { type: bool, default: false }
  disabled: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
  # Link mode (component='a' + href)
  url: string
  target: string
  rel: string
  download: string
  # HTML id on the rendered button (or <a> in link mode)
  id: string
  # JavaScript click handler — any JS expression (rides the raw-attribute channel)
  onclick: string
  # Gradient variant — assembled into gradient={from, to, deg}
  gradientFrom: string
  gradientTo: string
  gradientDeg: float
  # Mantine spacing system
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
body: python
---
```python
# Renders the ActionIcon island (ActionIcon.jsx), which owns the icon-spec ->
# React-node resolution (the glyph can't ride this JSON props channel). Every other prop passes
# straight through to Mantine's ActionIcon; unset (None / '' / False) props are omitted so
# Mantine's own defaults apply. `url` renders the button as a link (component='a' + href).
# `onclick` rides the islands attr= channel (a raw HTML attribute — a string of JS, not a React
# function prop), matching the button tag.
import aardvark.components as av
_props = {'icon': icon}
if filled: _props['filled'] = True
if label: _props['label'] = label
_p = {
    'variant': variant, 'color': color, 'size': size, 'radius': radius,
    'loading': loading, 'disabled': disabled, 'autoContrast': autoContrast, 'id': id,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
}
for k, v in _p.items():
    if v not in (None, '', False):
        _props[k] = v
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
    raise ValueError(f"actionicon: unsafe url {url!r} — use a relative path or an http(s):// link")
if url:
    _props['component'] = 'a'
    _props['href'] = url
    if target: _props['target'] = target
    if rel: _props['rel'] = rel
    if download: _props['download'] = download
_attr = dict(attr) if attr else {}
if onclick: _attr['onclick'] = onclick
_attr = _attr or None
# Only when there IS a bare Tabler name to resolve, mirroring list / card: the island's
# LazyTablerIcon fetch needs the configured base (theme.iconCdn / theme.iconVersion) or a
# self-hosted or CSP-restricted site silently falls back to the public CDN. av.tabler_icon_cdn
# reads the build's config and falls back to the pinned default in a bare render with none.
# Setting it unconditionally would put the key on every icon-less button too.
if icon:
    _props['iconCdn'] = av.tabler_icon_cdn(globals())
print(snippet('ActionIcon', attr=_attr, **_props))
```
