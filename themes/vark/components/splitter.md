---
name: splitter
description: Two panels side by side (or stacked) with a draggable divider between them. Give
  the panels as the `first` and `second` text params, or put the first panel in the block body
  and the second in `second`. Set `defaultSize` (the first panel's initial size as a percentage)
  and `orientation` (`horizontal` for side-by-side, `vertical` for stacked); drag the handle to
  resize.
params:
  first: string
  second: string
  defaultSize: int
  orientation: string
body: python
---
```python
# Renders the Splitter island (Splitter.jsx), a thin wrapper that composes
# Mantine's compound Splitter / Splitter.Pane — which a flat macro can't emit directly (the
# panes are children). `first`/`second` are the panel texts; if `first` is omitted the block
# body is the first panel. `defaultSize` is the first pane's initial size as a percentage
# (0–100); the second pane takes the rest. Unset props are omitted so the island's defaults
# apply (defaultSize 50, orientation 'horizontal').
# `first` and the block body are two ways to give the SAME (first) panel: the island uses
# `first` when set and otherwise falls back to the body. Supplying both silently drops the
# body, so warn — the author meant one or the other.
import aardvark.components as av
_props = {}
if first and (children or '').strip():
    av.warn("splitter: `first=` is set, so the block body is ignored — put the first panel in `first=` OR in the body, not both")
if first: _props['first'] = first
if second: _props['second'] = second
if defaultSize is not None: _props['defaultSize'] = defaultSize
if orientation: _props['orientation'] = orientation
print(component('Splitter', children="\n\n" + (children or '') + "\n\n", attr=attr, **_props))
```
