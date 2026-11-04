---
name: text
description: Styled text — the full Mantine Text surface in one tag. Set the weight
  (`fw`), size (`size`/`fz`), style (`fs`), decoration (`td`), transform (`tt`),
  alignment (`ta`), color (`c`), font family (`ff`), line height (`lh`), and letter
  spacing (`lts`); use `variant='gradient'` with `gradientFrom`/`gradientTo`/`gradientDeg`
  for gradient text; `truncate` or `lineClamp` to clip overflow; and the Mantine
  spacing/sizing system (`m`/`p`/`w`/…). The text is the block body (inline Markdown —
  **bold**, `code`, [links]) or a `text` param. Close with {% endText %}.
params:
  # Content (also accepted as the block body)
  text: string
  # Typography
  size: string
  fw: string
  fs: string
  td: string
  tt: string
  ta: string
  c: string
  ff: string
  fz: string
  lh: string
  lts: string
  # Variant + gradient (variant='gradient' → gradient={from,to,deg})
  variant: string
  gradientFrom: string
  gradientTo: string
  gradientDeg: float
  # Overflow
  truncate: string
  lineClamp: int
  # Behavior
  inline: { type: bool, default: false }
  inherit: { type: bool, default: false }
  span: { type: bool, default: false }
  # HTML id on the rendered element — for CSS / JS selectors
  id: string
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
  # Visual + sizing
  bg: string
  opacity: string
  w: string
  h: string
  miw: string
  mih: string
  maw: string
  mah: string
body: python
---
```python
# Mirrors button.md: every typographic + style prop passes straight through to
# Mantine's Text (which validates the values), and unset props (None / '' / False)
# are omitted so Mantine's own defaults apply. This is the full Text styling surface
# — weight / size / style / decoration / transform / align / color / font-family /
# line-height / letter-spacing, the gradient variant, overflow clipping, plus the
# Mantine spacing + sizing system.
import aardvark.components as av
_text = {
    'size': size, 'fw': fw, 'fs': fs, 'td': td, 'tt': tt, 'ta': ta, 'c': c,
    'ff': ff, 'fz': fz, 'lh': lh, 'lts': lts, 'variant': variant, 'id': id,
    'inline': inline, 'inherit': inherit, 'span': span,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'opacity': opacity, 'w': w, 'h': h,
    'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _text.items() if v not in (None, '', False)}
# truncate takes True (single-line ellipsis) or 'start' / 'end'. It's a string param, so a
# bare `truncate` flag (or truncate=true) arrives as 'true' — map that to the boolean Mantine
# wants; 'start' / 'end' pass through; everything else (unset / '' / 'false' / an unrecognized
# value) → off. An unrecognized value is dropped, not raised: that mirrors Callout's
# unknown-severity fallback and the "Mantine validates" pass-through posture of button/badge —
# the library doesn't gate value domains build-side.
# lineClamp is a positive line count, so keep only > 0: 0 / negative / unset all give a
# meaningless `-webkit-line-clamp` (and warn). (gradientDeg / opacity below keep a literal
# 0 — there it's valid.)
_t = (truncate or '').strip().lower()
if _t == 'true':
    _props['truncate'] = True
elif _t in ('start', 'end'):
    _props['truncate'] = _t
if lineClamp and lineClamp > 0:
    _props['lineClamp'] = lineClamp
# Gradient text: variant='gradient' + gradient={from,to,deg} (mirrors button/badge);
# gradientDeg is tested against None so deg=0 survives.
if gradientFrom or gradientTo or gradientDeg is not None:
    _g = {}
    if gradientFrom: _g['from'] = gradientFrom
    if gradientTo: _g['to'] = gradientTo
    if gradientDeg is not None: _g['deg'] = gradientDeg
    _props['gradient'] = _g
# The text is the block body (preferred, the rich form) or the `text=` shortcut (plain).
# The block body renders as inline Markdown (**bold**, *italic*, `code`, [links]):
# render_inline_markdown emits inline HTML with no <p> wrapper, so it nests cleanly inside
# the single <p> Mantine's Text renders — a block Markdown body would nest a <p> inside
# that <p>. children is already-rendered template output (trusted); blank lines in the
# result are collapsed so the island stays one Markdown "HTML block" and rides the page's
# Markdown pass through verbatim (Markdown leaves a one-line HTML block as is). The inline
# `text=` param comes straight off the tag (untrusted), so — like button.md — it's HTML-escaped
# plain text, not run through render_inline_markdown (which passes raw HTML through: a
# stored-XSS surface).
import html as _h
import re
if (children or '').strip():
    _body = re.sub(r'\n\s*\n+', '\n', av.render_inline_markdown(children.strip()))
else:
    _body = _h.escape(text or '')
# span=true asks Mantine's Text to render an inline <span> (no paragraph margins) for use
# mid-sentence, so mount it in a <span> island wrapper too (inline_component) — a block <div>
# wrapper inside a <p> is invalid and the browser would split the paragraph. The default is a
# block paragraph (<div> wrapper + inner <p>). `span` rides _props either way so the inner
# Mantine element matches the wrapper.
_emit = inline_component if span else component
print(_emit('Text', children=_body, attr=attr, **_props))
```
