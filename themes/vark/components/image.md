---
name: image
description: An image — full content width by default (but never upscaled past its
  natural size), click to open in a dimmed full-image lightbox. Set `size` (e.g.
  '50%') to scale it — a percentage of the content width, aspect ratio preserved —
  `align` (left, center, right) to position a scaled image, and `zoom=false` to
  disable the lightbox. A `caption` renders a visible figure caption below the image
  (opt-in); the `alt` text shows as a hover tooltip. Forwards the full Mantine Image surface — `alt`, `fit`,
  `radius`, `fallbackSrc`, `loading`, responsive `srcSet`/`sizes`, visual
  `bd`/`bg`/`opacity` — plus the spacing/sizing system (`m`/`p`/`w`/`h`/`maw`/…).
  Plain Markdown `![alt](src)` images on their own line get this same treatment
  automatically; use this tag when you need the options.
params:
  src: { type: string, required: true }
  alt: string
  caption: string
  # Behavior
  size: string
  zoom: { type: bool, default: true }
  align: { type: string, default: left }
  # Mantine Image options
  fit: string
  radius: string
  fallbackSrc: string
  loading: string
  # Responsive sources (native <img> srcset/sizes)
  srcSet: string
  sizes: string
  # Visual framing (Mantine Box style props)
  bd: string
  bg: string
  opacity: string
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
# Renders the ZoomImage island (ZoomImage.jsx), which owns the
# no-upscale default width and the click-to-zoom lightbox. src/alt and the behavior
# flags (zoom, align) always pass through; `size` and the Mantine Image/spacing
# props are omitted when None/empty so ZoomImage's (and Mantine's) own defaults
# apply. These are all string params (no booleans), so the identity-safe `is not
# None and != ''` test is right — and it keeps a literal '0' (e.g. opacity='0')
# rather than dropping it the way `not in (None, '', False)` would.
_img = {
    'fit': fit, 'radius': radius, 'fallbackSrc': fallbackSrc, 'loading': loading,
    'srcSet': srcSet, 'sizes': sizes, 'bd': bd, 'bg': bg, 'opacity': opacity,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _img.items() if v is not None and v != ''}
if size:
    _props['size'] = size
# `caption` renders a visible <figcaption> beneath the image — opt-in, no default. The
# alt text becomes a hover tooltip instead, matching a plain Markdown `![alt](src)`; it's
# dropped when it would only repeat the caption. Both omitted when empty.
if caption:
    _props['caption'] = caption
if alt and alt != caption:
    _props['tooltip'] = alt
if attr: _props['attr'] = attr
print(snippet('ZoomImage', src=src, alt=(alt or ''), zoom=zoom, align=align, **_props))
```
