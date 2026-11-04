---
name: anchor
description: A styled text link built on Mantine's Anchor (a themed `<a>`). Set `url`
  for the destination (with `target`/`rel`/`download` link attributes), and style the
  text with the Mantine Text surface — `underline` (always, hover, never, not-hover),
  `c` (color), `size`, `fw` (font weight), `inherit` (match surrounding text), and
  `variant='gradient'` with `gradientFrom`/`gradientTo`/`gradientDeg`. The label is the
  block body or a `text` param.
params:
  # Label
  text: string
  # Link mode
  url: { type: string, required: true }
  target: string
  rel: string
  download: string
  # Text styling (Mantine Text surface)
  underline: string
  c: string
  size: string
  fw: string
  inherit: { type: bool, default: false }
  lineClamp: int
  # Gradient text — variant='gradient' + assembled gradient={from, to, deg}
  variant: string
  gradientFrom: string
  gradientTo: string
  gradientDeg: float
body: python
---
```python
# Mirrors button.md's link mode: every prop passes straight through to Mantine's Anchor
# (Anchor is Text + an <a>, so the Text styling props — underline/c/size/fw/inherit/
# lineClamp — and a gradient variant all apply). Unset (None/''/False) props are omitted
# so Mantine's defaults apply. `url` becomes the href; target/rel/download ride the React
# props channel (Anchor's root is the <a>, so they land as real link attributes).
# Reject unsafe link targets at build time — dangerous schemes (javascript:/data:/…) and
# protocol-relative URLs (//host) — so the author gets a clear error rather than a link the JS
# sanitizeHref silently drops at render time. Shared guard (av.is_unsafe_href) so the six
# link-mode tags stay in sync.
import aardvark.components as av
if av.is_unsafe_href(url):
    raise ValueError(f"anchor: unsafe url {url!r} — use a relative path or an http(s):// link")
_a = {
    'href': url, 'target': target, 'rel': rel, 'download': download,
    'underline': underline, 'c': c, 'size': size, 'fw': fw,
    'inherit': inherit, 'variant': variant,
}
_props = {k: v for k, v in _a.items() if v not in (None, '', False)}
# lineClamp is numeric — guard on None so a deliberate 0 isn't dropped by the
# `not in (None, '', False)` filter above (0 == False in Python).
if lineClamp is not None:
    _props['lineClamp'] = lineClamp
if gradientFrom or gradientTo or gradientDeg is not None:
    _g = {}
    if gradientFrom: _g['from'] = gradientFrom
    if gradientTo: _g['to'] = gradientTo
    if gradientDeg is not None: _g['deg'] = gradientDeg
    _props['gradient'] = _g
# Escape the inline `text=` string (a stored-XSS surface if pages come from untrusted
# authors); leave block-form `children` intact — it's already-rendered template output.
import html as _h
_label = children if children else _h.escape(text or '')
# A link is phrasing content — mount via inline_component so it flows inline in a sentence
# (a <span>-wrapped island) rather than a block <div> that drops onto its own line.
print(inline_component('Anchor', children=_label, attr=attr, **_props))
```
