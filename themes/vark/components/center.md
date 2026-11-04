---
name: center
description: Centers its content both horizontally and vertically. Set `inline=true` to
  center inline content (renders as `inline-flex` rather than `flex`). The block body is the
  content. Forwards the Mantine spacing/sizing system (`m`/`p`/`w`/`h`/…). See
  https://mantine.dev/core/center/.
params:
  inline: { type: bool, default: false }
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
# (None/''/False) are omitted so Mantine's defaults apply. `inline` switches the
# container to inline-flex. The block body is the content; blank lines wrap it so it
# renders as Markdown.
_c = {
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _c.items() if v not in (None, '')}
if inline: _props['inline'] = True
print(component('Center', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
