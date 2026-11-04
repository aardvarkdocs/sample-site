---
name: book
description: A Community Component — an iBooks-style book whose pages turn with a draggable
  page-curl (wraps @gfazioli/mantine-book). Give the pages via `pages` (a JSON array of
  `{front, back, props}`, where `front`/`back` are page text/content), set the page `width` and
  `height` in px, pick the curl `variant` (flat/rounded), and set `revealBackground` (the
  inside-cover color). Toggle `withCover` (hard covers + centered closed book) and `disabled`,
  and set `defaultPage`. Hydrates as an interactive island.
params:
  pages: string
  width: int
  height: int
  variant: string
  revealBackground: string
  defaultPage: int
  riffleDuration: int
  withCover: { type: bool, default: false }
  disabled: { type: bool, default: false }
body: python
---
```python
# Renders the Book island (Book.jsx), a thin wrapper over @gfazioli/mantine-book.
# `pages` is a JSON array of {front, back?, props?} pages, parsed here; front/back are the page
# content (a string renders verbatim). A malformed array warns and degrades to an empty book.
# Unset (None/'') props are omitted so the upstream defaults apply; the bool toggles are forwarded
# only when set.
import json as _json
import aardvark.components as av
_pages = []
if pages:
    try:
        _v = _json.loads(pages)
        if isinstance(_v, list):
            _pages = _v
        else:
            av.warn("book: pages must be a JSON array of {front, back, props} pages — using an empty book")
    except (ValueError, TypeError):
        av.warn("book: pages is not valid JSON — using an empty book; check the value")
_props = {'pages': _pages}
if width is not None: _props['width'] = width
if height is not None: _props['height'] = height
if variant: _props['variant'] = variant
if revealBackground: _props['revealBackground'] = revealBackground
if defaultPage is not None: _props['defaultPage'] = defaultPage
if riffleDuration is not None: _props['riffleDuration'] = riffleDuration
if withCover: _props['withCover'] = True
if disabled: _props['disabled'] = True
print(component('Book', attr=attr, **_props))
```
