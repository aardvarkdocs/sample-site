---
name: collapse
description: A primitive that animates its content open and closed by height. It needs an
  open/closed state — set `opened` (true to show, false to hide) and the optional
  `transitionDuration` (ms) and `transitionTimingFunction`. On a static page the state is
  fixed at render; for interactive open/close drive it from your own component. The block body
  is the collapsible content. Close with {% endCollapse %}.
params:
  opened: { type: bool, default: true }
  transitionDuration: int
  transitionTimingFunction: string
  animateOpacity: { type: bool, default: true }
body: python
---
```python
# A height-animation primitive: Mantine's Collapse shows/hides its content with a height
# transition, driven by its `expanded` prop. This macro exposes it as `opened` and maps it to
# `expanded`. On a static page the value is fixed at render time (default opened=true so the
# content is visible); real open/close toggling needs a stateful parent (a snippet that calls
# component('Collapse', ...) with its own state, or your own island).
# Other props pass straight through to Mantine (which validates them); unset ones are
# omitted. The block body
# is the collapsible content, wrapped in blank lines so the single Markdown pass renders it
# (the block-component convention). attr= forwards raw HTML attributes.
_c = {
    'transitionDuration': transitionDuration,
    'transitionTimingFunction': transitionTimingFunction,
    'animateOpacity': animateOpacity,
}
_props = {k: v for k, v in _c.items() if v not in (None, '')}
# Mantine's required prop is `expanded` (renamed from `in` in Mantine 9); map our `opened`
# onto it.
_props['expanded'] = bool(opened)
_body = "\n\n" + (children or '') + "\n\n"
print(component('Collapse', children=_body, attr=attr, **_props))
```
