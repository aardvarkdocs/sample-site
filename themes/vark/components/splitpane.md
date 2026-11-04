---
name: splitpane
description: Two resizable panes with a styled, draggable resizer between them (a Community
  Component wrapping @gfazioli/mantine-split-pane). Give the panes as the `first` and `second`
  text params, or put the first pane in the block body and the second in `second`. Set
  `orientation` (`vertical` for side-by-side — the default — or `horizontal` for stacked),
  `initialSize` (the first pane's initial width/height), and style the handle with `variant`,
  `color`, `size`, `radius`, and `knobSize`. This is a different component from the Mantine-core
  `splitter` builtin.
params:
  first: string
  second: string
  orientation: string
  initialSize: string
  variant: string
  color: string
  size: string
  radius: string
  knobSize: string
body: python
---
```python
# Renders the SplitPane island (SplitPane.jsx), a thin wrapper that composes
# the community @gfazioli/mantine-split-pane's compound Split / Split.Pane / Split.Resizer —
# which a flat macro can't emit directly (the panes are children). `first`/`second` are the pane
# texts; if `first` is omitted the block body is the first pane. Unset props are omitted so the
# package's defaults apply (orientation 'vertical', the default resizer variant).
# `first` and the block body are two ways to give the SAME (first) pane: the island uses `first`
# when set and otherwise falls back to the body. Supplying both silently drops the body, so warn
# — the author meant one or the other.
import aardvark.components as av
_props = {}
if first and (children or '').strip():
    av.warn("splitpane: `first=` is set, so the block body is ignored — put the first pane in `first=` OR in the body, not both")
if first: _props['first'] = first
if second: _props['second'] = second
if orientation: _props['orientation'] = orientation
if initialSize: _props['initialSize'] = initialSize
if variant: _props['variant'] = variant
if color: _props['color'] = color
if size: _props['size'] = size
if radius: _props['radius'] = radius
if knobSize: _props['knobSize'] = knobSize
print(component('SplitPane', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
