---
name: qrcode
description: A customizable QR code — a Community Component wrapping @gfazioli/mantine-qr-code.
  Set `value` (the data to encode, required), and optionally `size`, `color` (dot color,
  Mantine theme colors supported), `background`, `dotStyle` (square / rounded / dots),
  `cornerStyle` (square / rounded / dots), `image` (URL for a center logo overlay),
  `imageRadius`, and `errorCorrectionLevel` (L / M / Q / H).
params:
  value: { type: string, required: true }
  size: string
  color: string
  background: string
  dotStyle: string
  cornerStyle: string
  image: string
  imageRadius: string
  errorCorrectionLevel: string
body: python
---
```python
# Mirrors semicircleprogress.md: `value` is the only required prop (the string to encode);
# every other prop is optional and unset ones are omitted so the vendor's defaults apply.
# All props ride the flat JSON props channel onto the QrCode island
# (QrCode.jsx), which wraps the vendor <QRCode>. `attr` forwards raw HTML
# attributes onto the root.
props = {'value': value}
if size: props['size'] = size
if color: props['color'] = color
if background: props['background'] = background
if dotStyle: props['dotStyle'] = dotStyle
if cornerStyle: props['cornerStyle'] = cornerStyle
if image: props['image'] = image
if imageRadius: props['imageRadius'] = imageRadius
if errorCorrectionLevel: props['errorCorrectionLevel'] = errorCorrectionLevel
if attr: props['attr'] = attr
print(component('QrCode', **props))
```
