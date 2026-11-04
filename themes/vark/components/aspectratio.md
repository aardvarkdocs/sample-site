---
name: aspectratio
description: Keeps its content at a fixed width-to-height ratio as it scales — handy for
  responsive embeds (video, maps, images). Set `ratio` to a number, e.g. `1.7777` for 16/9
  or `1` for a square (defaults to 1). The block body is the content. Forwards the Mantine
  spacing/sizing system (`m`/`p`/`w`/`h`/…). See https://mantine.dev/core/aspect-ratio/.
params:
  ratio: float
  # Mantine spacing/sizing system (Mantine size tokens or any CSS value)
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
# Mirrors the other layout builtins: props pass straight through to Mantine; unset
# (None/'') are omitted so Mantine's default applies (ratio 1). `ratio` is a plain number
# (width / height). The block body is the content; blank lines wrap it so it renders as
# Markdown.
_a = {
    'ratio': ratio,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _a.items() if v not in (None, '')}
print(component('AspectRatio', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
