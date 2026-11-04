---
name: floatingindicator
description: >-
  Mantine's FloatingIndicator positioning primitive — the sliding highlight box that
  powers SegmentedControl / Tabs / Stepper internally. It needs live element refs, so
  this tag renders a small self-contained demo, a row of buttons (`labels`, a comma
  list) whose active highlight slides on click. Use it to see the primitive; reach for
  SegmentedControl / Tabs for a real control.
params:
  labels: list
body: python
---
```python
# Renders the FloatingIndicator island (FloatingIndicator.jsx). FloatingIndicator
# is a low-level primitive that animates a highlight between two element refs — it
# has no build-time-supplyable props of its own, so the only input is the demo's
# button `labels` (a comma-split list). The island owns the refs/active-state
# wiring the primitive requires.
_labels = labels or ['One', 'Two', 'Three']
print(snippet('FloatingIndicator', labels=_labels, attr=attr))
```
