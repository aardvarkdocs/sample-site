---
name: divider
description: A horizontal or vertical divider — a plain rule or a labelled one. Set
  `label` (or use the block body) for a caption, `labelPosition` (left, center, right)
  to place it, `variant` (solid, dashed, dotted), `size` (xs–xl line thickness),
  `color`, and `orientation` (horizontal or vertical). Plain Markdown `---` already
  renders a plain Divider; use this tag when you want a label or options. Forwards the
  Mantine spacing/sizing system (`m`/`my`/`w`/`h`/…).
params:
  # Label (also accepted as the block body)
  label: string
  labelPosition: string
  # Divider options
  orientation: string
  variant: string
  size: string
  color: string
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
  w: string
  h: string
  miw: string
  mih: string
  maw: string
  mah: string
body: python
---
```python
# Mirrors button.md / image.md: every prop passes straight through to Mantine (which
# validates it) and unset (None/'') props are omitted so Mantine's defaults apply
# (orientation 'horizontal', variant 'solid', labelPosition 'center'). The label is the
# block body or the `label` param — plain text: it rides the JSON props channel as
# Mantine's `label` prop, so React escapes it (no manual escape needed; Markdown in the
# body won't format). `attr={...}` forwards raw HTML attributes, like component(..., attr=).
_div = {
    'labelPosition': labelPosition, 'orientation': orientation,
    'variant': variant, 'size': size, 'color': color,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _div.items() if v is not None and v != ''}
_label = (children or '').strip() or (label or '')
if _label:
    _props['label'] = _label
print(component('Divider', attr=attr, **_props))
```
