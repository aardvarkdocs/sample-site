---
name: loadingoverlay
description: A loading veil with a centered spinner over a box of content — for an
  area that's fetching or processing. The block body is the covered content; toggle
  the veil with `visible` (on by default). Tune the veil with `overlayBackgroundOpacity`,
  `overlayBlur`, and `overlayRadius`; the spinner with `loaderType` (oval/bars/dots),
  `loaderSize`, and `loaderColor`; and stacking with `zIndex`. Close with
  {% endLoadingoverlay %}.
params:
  visible: { type: bool, default: true }
  overlayBackgroundOpacity: float
  overlayBlur: float
  overlayRadius: string
  loaderType: string
  loaderSize: string
  loaderColor: string
  zIndex: int
body: python
---
```python
# Forwards to the LoadingOverlay island, which wraps Mantine's
# <LoadingOverlay> in a positioned box holding the body (LoadingOverlay covers its
# nearest positioned ancestor, so it needs one). The structured overlayProps and
# loaderProps objects are composed from the flat params here, since a build-time
# macro can't pass nested objects through an attr. Unset fields are omitted so
# Mantine's defaults apply. `visible` defaults True so the doc demo shows the veil.
props = {'visible': visible}
overlay = {}
if overlayBackgroundOpacity is not None: overlay['backgroundOpacity'] = overlayBackgroundOpacity
if overlayBlur is not None: overlay['blur'] = overlayBlur
if overlayRadius: overlay['radius'] = overlayRadius
if overlay: props['overlayProps'] = overlay
loader = {}
if loaderType: loader['type'] = loaderType
if loaderSize: loader['size'] = loaderSize
if loaderColor: loader['color'] = loaderColor
if loader: props['loaderProps'] = loader
if zIndex is not None: props['zIndex'] = zIndex
if attr: props['attr'] = attr
# The block body is the covered content — bracket it with blank lines so the single Markdown
# pass renders it (paragraphs, emphasis, links, lists) rather than leaving it literal inside
# the island's one-line <div> (the block-component convention). An empty/self-closing body stays ''
# so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('LoadingOverlay', children=_body, **props))
```
