---
name: backgroundimage
description: A box that displays an image as its background with content overlaid on top.
  Set `src` (the image URL, required) and `radius` (xs–xl or any CSS value) to round the
  corners; the block body is the overlaid content. Also forwards the Mantine spacing/sizing
  system (`p`/`m`/`w`/`h`/`maw`/…) so you can size and pad the box.
  Close with {% endBackgroundimage %}.
params:
  src: { type: string, required: true }
  radius: string
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
# Mirrors image.md / divider.md: `src` always passes through; `radius` and the Mantine
# spacing/sizing props are omitted when None/empty so Mantine's own defaults apply. The
# block body is the overlaid content (already-rendered template output) — passed through as
# children, so a nested text / heading / image renders on top of the background.
_box = {
    'radius': radius,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
    'p': p, 'pt': pt, 'pb': pb, 'pl': pl, 'pr': pr, 'px': px, 'py': py,
    'w': w, 'h': h, 'miw': miw, 'mih': mih, 'maw': maw, 'mah': mah,
}
_props = {k: v for k, v in _box.items() if v is not None and v != ''}
# The block body is the overlaid content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). A lone nested island (text/heading/
# image) still passes through fine. An empty/self-closing body stays '' so no stray blank lines.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('BackgroundImage', src=src, children=_body, attr=attr, **_props))
```
