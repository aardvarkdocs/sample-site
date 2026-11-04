---
name: communityMarquee
description: A scrolling ticker with extra flair — a Community Component wrapping
  @gfazioli/mantine-marquee. Like the built-in `marquee`, content slides continuously across
  the row, but this variant adds `variant` (default, isometric, circle), responsive
  `vertical`, fade-edge modes (`fadeEdges` of true/linear/ellipse/rect + `fadeEdgesSize`),
  `repeat`, and the 3D `tilt`/`perspective`/`rotate`/`skew` controls. Set `direction` (left,
  right, up, down), `duration` (seconds for one loop), `gap` (space between the items and the
  looping copies, a theme spacing name xs-xl or a CSS length), and `pauseOnHover` (also pauses
  on keyboard focus). The block body is the scrolling content, rendered as inline Markdown (raw
  HTML and inline Markdown pass through; block-level Markdown is not), so items scroll as a
  single row. Close with {% endCommunityMarquee %}.
params:
  direction: { type: string, default: left }
  variant: string
  duration: int
  gap: string
  repeat: int
  pauseOnHover: { type: bool, default: false }
  fadeEdges: string
  fadeEdgesSize: string
  tilt: int
  perspective: int
  rotate: int
  skew: int
body: python
---
```python
# Renders the CommunityMarquee island (CommunityMarquee.jsx), which wraps
# @gfazioli/mantine-marquee's Marquee. Named distinctly from the built-in marquee tag
# (which wraps Mantine core's own native Marquee) because both ship and the registry keys must
# not collide — see the island header.
#
# The gfazioli Marquee expresses direction as `vertical` (up/down) + `reverse` (right/down), so
# this macro maps the friendly `direction` onto them, mirroring the native marquee.md. Every
# other prop passes straight through to the package (which validates the values); unset props
# are omitted so the package's own defaults apply. The block body is the scrolling content,
# rendered as INLINE Markdown (render_inline_markdown → inline HTML, no <p> wrapper) with
# blank-line runs collapsed, so discrete items stay direct children of the repeated group and
# `gap` spaces them uniformly (the old blank-line block wrapping produced a <p> that collapsed
# the inter-item gap into a visible loop "seam"). Mirrors the native marquee.md.
import re
import aardvark.components as av
_dir = (direction or 'left').strip().lower()
_props = {}
if _dir in ('up', 'down'): _props['vertical'] = True
if _dir in ('right', 'down'): _props['reverse'] = True
if variant: _props['variant'] = variant
if duration is not None: _props['duration'] = duration
if gap: _props['gap'] = gap
if repeat is not None: _props['repeat'] = repeat
if pauseOnHover: _props['pauseOnHover'] = True
# fadeEdges accepts a bare flag (→ 'true' from the string-param coercion) meaning the default
# fade, or a named mode (linear / ellipse / rect). Map 'true' to the boolean the package wants;
# a named mode passes through; anything else (unset / 'false') leaves it off.
_fe = (fadeEdges or '').strip().lower()
if _fe == 'true':
    _props['fadeEdges'] = True
elif _fe in ('linear', 'ellipse', 'rect'):
    _props['fadeEdges'] = _fe
if fadeEdgesSize: _props['fadeEdgesSize'] = fadeEdgesSize
if tilt is not None: _props['tilt'] = tilt
if perspective is not None: _props['perspective'] = perspective
if rotate is not None: _props['rotate'] = rotate
if skew is not None: _props['skew'] = skew
_body = re.sub(r'\n\s*\n+', '\n', av.render_inline_markdown((children or '').strip()))
print(component('CommunityMarquee', children=_body, attr=attr, **_props))
```
