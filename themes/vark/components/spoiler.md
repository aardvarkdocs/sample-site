---
name: spoiler
description: A collapsible region that hides long content behind a show-more toggle. The
  block body is the content (rendered as Markdown); when it's taller than `maxHeight`
  (pixels, 100 by default) a toggle appears. Set `showLabel`/`hideLabel` for the toggle text
  and `transitionDuration` (ms, 0 to disable the animation). Close with {% endSpoiler %}.
params:
  maxHeight: int
  showLabel: { type: string, default: Show more }
  hideLabel: { type: string, default: Hide }
  transitionDuration: int
body: python
---
```python
# Mantine's Spoiler requires showLabel/hideLabel (no defaults of its own), so this macro
# supplies sensible ones; maxHeight/transitionDuration are omitted when unset so Mantine's
# defaults apply (100px height, 200ms). Numeric props are tested against None (not
# truthiness) so a deliberate 0 (e.g. transitionDuration=0 to disable the animation)
# survives instead of being silently dropped.
props = {'showLabel': showLabel, 'hideLabel': hideLabel}
if maxHeight is not None: props['maxHeight'] = maxHeight
if transitionDuration is not None: props['transitionDuration'] = transitionDuration
# Blank lines around the body so the single Markdown pass renders it as Markdown (matching
# aside.md) rather than swallowing it as raw HTML.
print(component('Spoiler', children="\n\n" + (children or '') + "\n\n", attr=attr, **props))
```
