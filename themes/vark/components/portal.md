---
name: portal
description: A render-target primitive — it renders its content into a different part of the
  DOM (by default the end of document.body) instead of where the tag sits. Useful for
  overlays, popovers, and tooltips that must escape a parent's overflow or stacking context.
  Set `target` to a CSS selector to render into a specific element. By default many portals share
  one generated target node; set `reuseTargetNode=false` to give each its own. The block body is
  the portalled content. Close with {% endPortal %}.
params:
  target: string
  reuseTargetNode: { type: bool, default: true }
body: python
---
```python
# A low-level render-target primitive: Mantine's Portal moves its children to another DOM
# node (document.body by default, or `target` — a selector or element) without changing the
# React tree. It has no visual styling of its own; the content renders wherever it's
# portalled. Mirrors button.md — unset (None / '' / False) props are omitted so Mantine's
# defaults apply. The block body is the portalled content, wrapped in blank lines so the
# single Markdown pass renders it (the block-component convention). attr= forwards raw HTML
# attributes.
_p = {'target': target}
_props = {k: v for k, v in _p.items() if v not in (None, '', False)}
# reuseTargetNode is forwarded EXPLICITLY (same idiom as marquee.md's fadeEdges): the filter
# above drops a False, and Mantine's own default is True — so leaving it to the filter made
# `reuseTargetNode=false` silently keep the shared node, i.e. the flag could not be turned off
# at all. Forwarding the bool makes both directions real; the default matches Mantine's.
_props['reuseTargetNode'] = bool(reuseTargetNode)
_body = "\n\n" + (children or '') + "\n\n"
print(component('Portal', children=_body, attr=attr, **_props))
```
