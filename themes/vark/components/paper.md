---
name: paper
description: A surface — a card-like panel with a shadow, rounded corners, padding, and an
  optional border. Set `shadow` (xs–xl), `radius` (xs–xl or a CSS value), `withBorder` for a
  1px outline, and `p` (padding). The block body is the content. Close with {% endPaper %}.
params:
  shadow: string
  radius: string
  withBorder: { type: bool, default: false }
  # Mantine spacing system (padding / margin — Mantine size tokens or any CSS value)
  p: string
  pt: string
  pb: string
  pl: string
  pr: string
  px: string
  py: string
  m: string
  mt: string
  mb: string
  ml: string
  mr: string
  mx: string
  my: string
  # Color shortcuts + sizing
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
# Mirrors button.md / text.md: every prop passes straight through to Mantine's Paper (which
# validates the values) and unset (None / '' / False) props are omitted so Mantine's own
# defaults apply (no shadow, radius 'sm', no border). withBorder is a real bool param so a
# bare `withBorder` flag survives as True. The block body is the panel content — wrapped in
# blank lines so the single Markdown pass renders it as Markdown (the block-component convention),
# the same convention as aside.md.
_paper = {
    'shadow': shadow, 'radius': radius, 'withBorder': withBorder,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _paper.items() if v not in (None, '', False)}
# Default a comfortable padding so an unset `p` still renders a panel (Mantine's Paper has
# no padding by default). ANY explicit padding the author sets — the `p` shorthand, an axis
# (`px`/`py`), or a single side (`pt`/`pb`/`pl`/`pr`) — suppresses the default, so the default
# never collides with (and risks overriding, per CSS source order) a side the author specified.
if not any(k in _props for k in ('p', 'px', 'py', 'pt', 'pb', 'pl', 'pr')):
    _props['p'] = 'md'
_body = "\n\n" + (children or '') + "\n\n"
print(component('Paper', children=_body, attr=attr, **_props))
```
