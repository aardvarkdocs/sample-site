---
name: group
description: A flex row — lays its children out horizontally with consistent gaps. Set
  `justify` (`justify-content`) and `align` (`align-items`), `gap` (a Mantine size token or
  any CSS value), `wrap` (`wrap`, `nowrap`), `grow` to make children share the width equally,
  and `preventGrowOverflow`. The block body is the content. Forwards the Mantine
  spacing/sizing system (`m`/`p`/`w`/`h`/…). See https://mantine.dev/core/group/.
params:
  # Group layout options
  justify: string
  align: string
  gap: string
  wrap: string
  grow: { type: bool, default: false }
  preventGrowOverflow: { type: bool, default: true }
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
# Mirrors badge.md / button.md: every prop passes straight through to Mantine (which
# validates it); unset (None/'') props are omitted so Mantine's defaults apply
# (justify 'flex-start', align 'center', gap 'md', wrap 'wrap'). The block body is the
# content. `preventGrowOverflow` defaults to True (Mantine's own default), so it is only
# forwarded when explicitly turned off. Blank lines wrap the body so the single Markdown
# pass renders it as Markdown (the block-component convention).
_g = {
    'justify': justify, 'align': align, 'gap': gap, 'wrap': wrap,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _g.items() if v not in (None, '')}
if grow: _props['grow'] = True
if not preventGrowOverflow: _props['preventGrowOverflow'] = False
print(component('Group', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
