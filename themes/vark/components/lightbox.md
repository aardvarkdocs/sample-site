---
name: lightbox
description: >-
  A full-screen image lightbox — the @mantine-bites/lightbox community extension,
  built on Embla Carousel. `images` is a JSON array of `{ "src", "alt" }` objects;
  the tag renders a clickable thumbnail grid, and clicking a thumbnail opens the
  image full-screen with carousel navigation. `cols` sets the thumbnail grid width
  (default 3).
params:
  images: string
  cols: { type: int, default: 3 }
body: python
---
```python
# Renders the Lightbox island (Lightbox.jsx), which wraps the
# @mantine-bites/lightbox extension: a thumbnail grid that opens a full-screen carousel
# lightbox. The image list can't ride a scalar param, so `images` arrives as a JSON-array
# string and is parsed here; the resulting list of plain dicts JSON-encodes cleanly onto
# the island's props channel.
import json as _json
import aardvark.components as av
_images = []
if images:
    try:
        _images = _json.loads(images)
    except ValueError as _e:
        raise ValueError(
            "lightbox: `images` must be a JSON array, e.g. "
            "images='[{\"src\": \"/a.jpg\", \"alt\": \"A\"}, {\"src\": \"/b.jpg\"}]'. "
            f"Parse error: {_e}"
        ) from None
    if not isinstance(_images, list):
        raise ValueError("lightbox: `images` must be a JSON array (got a non-list).")
    # Reject unsafe schemes in image src at build time, matching the link-bearing tags. The
    # island's sanitizeHref strips them at render time (defense in depth), but a build-time
    # error tells the author instead of silently dropping the image.
    for _im in _images:
        if isinstance(_im, dict) and _im.get('src') and av.is_unsafe_href(_im['src']):
            raise ValueError(
                f"lightbox: unsafe src {_im['src']!r} in images — use a relative path or an http(s):// URL"
            )
props = {'images': _images}
# `cols` always has a value (param default 3), so pass it straight through; the island
# clamps a non-positive / non-integer value back to its own default.
props['cols'] = cols
if attr: props['attr'] = attr
print(component('Lightbox', **props))
```
