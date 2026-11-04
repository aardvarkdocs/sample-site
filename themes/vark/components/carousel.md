---
name: carousel
description: A slides carousel — a horizontal (or vertical) strip of slides with optional
  prev/next controls and indicator dots. Put one or more {% slide %} blocks in the body. Set
  `slideSize` (slide width, e.g. `70%` or a number), `slideGap` (gap between slides), `height`
  (required for vertical), `orientation` (`horizontal`/`vertical`), `controlSize`,
  `controlsOffset`, and the `loop` / `withControls` / `withIndicators` toggles. Renders
  client-side. Close with {% endCarousel %}.
params:
  slideSize: string
  slideGap: string
  height: string
  h: string
  orientation: string
  controlSize: string
  controlsOffset: string
  initialSlide: int
  loop: { type: bool, default: false }
  withControls: { type: bool, default: true }
  withIndicators: { type: bool, default: false }
  withKeyboardEvents: { type: bool, default: true }
body: python
---
```python
# The carousel tag renders Mantine's Carousel from @mantine/carousel (declared as the `carousel`
# component library by the packaged vark theme's theme.yaml; ssr: false because embla
# measures live DOM on mount, so it is client-rendered only). The block body is a run of slide
# island divs produced by the nested slide tags, which are already rendered to HTML by the time
# this macro runs; they pass straight through as `children` (no blank-line Markdown wrap — each
# slide wraps its own body). Unset (None/'') props are omitted so Mantine's own defaults apply.
#
# Mantine 9's Carousel has no top-level `loop` prop — looping is an embla option — so the `loop`
# flag is forwarded as emblaOptions={'loop': True}. withControls and withKeyboardEvents default
# to True (Mantine's own defaults), so they are only forwarded when explicitly turned off.
_c = {
    'slideSize': slideSize, 'slideGap': slideGap, 'height': height, 'h': h,
    'orientation': orientation, 'controlSize': controlSize, 'controlsOffset': controlsOffset,
}
props = {k: v for k, v in _c.items() if v not in (None, '')}
if initialSlide is not None: props['initialSlide'] = initialSlide
if loop: props['emblaOptions'] = {'loop': True}
if not withControls: props['withControls'] = False
if withIndicators: props['withIndicators'] = True
if not withKeyboardEvents: props['withKeyboardEvents'] = False
print(component('carousel', 'Carousel', children=(children or '').strip(), attr=attr, **props))
```
