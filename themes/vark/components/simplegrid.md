---
name: simplegrid
description: A responsive grid where every column is the same width. Set `cols` (the number
  of columns) and `spacing`/`verticalSpacing` (Mantine size tokens or any CSS value). Columns
  and spacing can adapt per breakpoint with the `*Sm`/`*Md`/`*Lg`/`*Xl` props. The block body
  holds the cells (each top-level block becomes one cell). Forwards the Mantine spacing/sizing
  system (`m`/`p`/`w`/`h`/…). See https://mantine.dev/core/simple-grid/.
params:
  # Base column count + responsive overrides (Mantine `cols` object)
  cols: int
  colsSm: int
  colsMd: int
  colsLg: int
  colsXl: int
  # Horizontal spacing + responsive overrides (Mantine `spacing` object)
  spacing: string
  spacingSm: string
  spacingMd: string
  spacingLg: string
  spacingXl: string
  # Vertical spacing + responsive overrides (Mantine `verticalSpacing` object)
  verticalSpacing: string
  verticalSpacingSm: string
  verticalSpacingMd: string
  verticalSpacingLg: string
  verticalSpacingXl: string
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
# (None/'') are omitted so Mantine's defaults apply (cols 1, spacing 'md'). Each of cols /
# spacing / verticalSpacing accepts a plain value OR a Mantine responsive object
# ({ base, sm, md, lg, xl }); the `*Sm`..`*Xl` params, when set, compose that object with
# the base value as `base`. The block body holds the cells (each top-level Markdown block
# becomes one grid cell); blank lines wrap it so it renders as Markdown.
def _responsive(base, sm, md, lg, xl):
    breaks = {'sm': sm, 'md': md, 'lg': lg, 'xl': xl}
    overrides = {k: v for k, v in breaks.items() if v is not None}
    if not overrides:
        return base
    obj = dict(overrides)
    if base is not None:
        obj['base'] = base
    return obj

_props = {}
_cols = _responsive(cols, colsSm, colsMd, colsLg, colsXl)
if _cols is not None: _props['cols'] = _cols
_spacing = _responsive(spacing, spacingSm, spacingMd, spacingLg, spacingXl)
if _spacing is not None: _props['spacing'] = _spacing
_vspacing = _responsive(verticalSpacing, verticalSpacingSm, verticalSpacingMd, verticalSpacingLg, verticalSpacingXl)
if _vspacing is not None: _props['verticalSpacing'] = _vspacing

_style = {
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'bg': bg, 'c': c, 'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props.update({k: v for k, v in _style.items() if v not in (None, '')})
print(component('SimpleGrid', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
