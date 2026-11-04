---
name: transition
description: An animation primitive that fades / slides / scales its content in and out. Set
  `transition` (fade, slide-up/down/left/right, scale, scale-x/y, skew-up/down,
  rotate-left/right, pop, …), `duration` (ms), `mounted` (the initial shown state), and
  `timingFunction`. Ships with a trigger button (`triggerLabel`) that toggles the content, so
  the enter/leave animation plays on a static page. The block body is the animated content.
  Close with {% endTransition %}.
params:
  mounted: { type: bool, default: true }
  transition: { type: string, default: fade }
  duration: { type: int, default: 250 }
  timingFunction: string
  keepMounted: { type: bool, default: false }
  triggerLabel: string
body: python
---
```python
# Renders the Transition island (Transition.jsx). Mantine's Transition uses a
# function-as-children render prop to apply its animated inline styles — a function can't ride
# this JSON props channel, so the render prop lives in the island and this macro forwards the
# plain props. The island wires a trigger button that toggles the content (so the enter/leave
# animation actually plays on a static page); `mounted` is the INITIAL state (default true so the
# content is present at render / for crawlers).
# `mounted` is ALWAYS forwarded (True or False — False starts the content hidden). A blanket
# `if v not in (None, '', False)` filter would silently swallow `mounted=False` (and, since
# 0 == False in Python, a `duration=0` too), so it's set explicitly. The rest follow the usual
# convention: strings/ints when set, keepMounted only when True (default False), triggerLabel
# only when the author overrides the island's default. The block body is the animated content,
# wrapped in blank lines so the single Markdown pass renders it (the block-component convention).
_props = {'mounted': bool(mounted)}
if transition: _props['transition'] = transition
if duration is not None: _props['duration'] = duration
if timingFunction: _props['timingFunction'] = timingFunction
if keepMounted: _props['keepMounted'] = True
if triggerLabel: _props['triggerLabel'] = triggerLabel
_body = "\n\n" + (children or '') + "\n\n"
print(snippet('Transition', children=_body, attr=attr, **_props))
```
