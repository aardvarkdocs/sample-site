---
name: scrollarea
description: A scrollable region with styled, overlay scrollbars. Constrain it with `h`
  (height) and/or `w` (width); set `type` (hover, scroll, always, auto, never) to control when
  the bars show, `scrollbarSize` (px), `offsetScrollbars` to inset the content, and
  `scrollHideDelay` (ms). The block body is the (overflowing) content. Close with
  {% endScrollarea %}.
params:
  type: string
  scrollbarSize: int
  scrollHideDelay: int
  offsetScrollbars: { type: bool, default: false }
  # Sizing — give it an `h` (and/or `w`) so the content can overflow and scroll
  h: string
  w: string
  miw: string
  mih: string
  maw: string
  mah: string
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
  bg: string
body: python
---
```python
# Mirrors button.md / text.md: every prop passes straight through to Mantine's ScrollArea
# (which validates the values) and unset (None / '' / False) props are omitted so Mantine's
# own defaults apply (type 'hover', scrollbarSize 12). offsetScrollbars is a real bool param
# so a bare flag survives as True. The block body is the overflowing content — wrapped in
# blank lines so the single Markdown pass renders it as Markdown (the block-component convention).
_sa = {
    'type': type, 'scrollbarSize': scrollbarSize, 'scrollHideDelay': scrollHideDelay,
    'offsetScrollbars': offsetScrollbars,
    'h': h, 'w': w, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py, 'bg': bg,
}
_props = {k: v for k, v in _sa.items() if v not in (None, '', False)}
_body = "\n\n" + (children or '') + "\n\n"
print(component('ScrollArea', children=_body, attr=attr, **_props))
```
