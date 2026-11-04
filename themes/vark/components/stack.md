---
name: stack
description: A flex column — stacks its children vertically with a consistent gap. Set
  `justify` (`justify-content`), `align` (`align-items`), and `gap` (a Mantine size token
  or any CSS value). The block body is the content. Forwards the Mantine spacing/sizing
  system (`m`/`p`/`w`/`h`/…). See https://mantine.dev/core/stack/.
params:
  # Stack layout options
  justify: string
  align: string
  gap: string
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
# Mirrors group.md: props pass straight through to Mantine; unset (None/'') are omitted
# so Mantine's defaults apply (justify 'flex-start', align 'stretch', gap 'md'). The
# block body is the content; blank lines wrap it so it renders as Markdown.
_s = {
    'justify': justify, 'align': align, 'gap': gap,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _s.items() if v not in (None, '')}
print(component('Stack', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
