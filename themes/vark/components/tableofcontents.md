---
name: tableofcontents
description: An on-page table of contents (Mantine's TableOfContents). It scrapes the
  current page's headings at runtime and highlights the one in view (scroll-spy), so it
  always reflects wherever you drop it. Set `depth` (1–6) to cap which heading levels
  appear, `depthOffset` (px of indent per level), plus `variant` (light, filled, none),
  `color`, `size`, `radius`, and `autoContrast`. Provide a custom `selector` to target a
  different heading set.
params:
  depth: { type: int, default: 3 }
  depthOffset: int
  variant: string
  color: string
  size: string
  radius: string
  autoContrast: { type: bool, default: false }
  selector: string
body: python
---
```python
# Renders the TableOfContents island. The list of headings isn't known at build
# time — Mantine's TableOfContents reads them from the live DOM via scroll-spy — so this
# macro only forwards the documentable presentation props; the island owns the scroll-spy
# selector (h1..h{depth} under .aardvark-content) and the click-to-scroll + label wiring.
# `depth` always passes through (it shapes the selector); the rest are omitted when unset
# so Mantine's defaults apply.
props = {'depth': depth}
if depthOffset is not None: props['depthOffset'] = depthOffset
if variant: props['variant'] = variant
if color: props['color'] = color
if size: props['size'] = size
if radius: props['radius'] = radius
if autoContrast: props['autoContrast'] = True
if selector: props['selector'] = selector
print(snippet('TableOfContents', attr=attr, **props))
```
