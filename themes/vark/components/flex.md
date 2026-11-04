---
name: flex
description: A flexbox container with the full CSS flex surface exposed as responsive props.
  Set `direction` (`flex-direction`), `wrap` (`flex-wrap`), `justify` (`justify-content`),
  `align` (`align-items`), `gap`, `rowGap`, and `columnGap` (Mantine size tokens or any CSS
  value). The block body is the content. Forwards the Mantine spacing/sizing system
  (`m`/`p`/`w`/`h`/…). See https://mantine.dev/core/flex/.
params:
  # Flex options
  direction: string
  wrap: string
  justify: string
  align: string
  gap: string
  rowGap: string
  columnGap: string
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
# Mirrors group.md / stack.md: props pass straight through to Mantine; unset (None/'')
# are omitted so Mantine's defaults apply. Flex sets no default direction/justify/align
# (it is a thin Box wrapper over CSS flex). The block body is the content; blank lines
# wrap it so it renders as Markdown.
_f = {
    'direction': direction, 'wrap': wrap, 'justify': justify, 'align': align,
    'gap': gap, 'rowGap': rowGap, 'columnGap': columnGap,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _f.items() if v not in (None, '')}
print(component('Flex', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
