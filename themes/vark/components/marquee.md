---
name: marquee
description: A scrolling ticker — content that slides continuously across the row (logos,
  announcements, a tagline). Set `direction` (left, right, up, down), `duration` (ms for one
  loop), `gap` (space between the looping copies, a CSS length), `pauseOnHover`, and `fadeEdges`
  (a gradient fade at the edges). The block body is the scrolling content, rendered as inline
  Markdown (raw HTML and inline Markdown — **bold**, `code`, links — pass through; block-level
  Markdown is not), so items scroll as a single row. Close with {% endMarquee %}.
params:
  direction: { type: string, default: left }
  duration: { type: int, default: 40000 }
  gap: { type: string, default: 2rem }
  pauseOnHover: { type: bool, default: true }
  fadeEdges: { type: bool, default: false }
body: python
---
```python
# The marquee tag renders Mantine's Marquee: content sliding continuously across the row.
# Mantine 9's Marquee has no `speed` prop — it scrolls over a fixed `duration` (ms per loop) —
# and expresses direction as orientation + reverse, so this macro maps the friendly `direction`
# (left/right/up/down) onto them: right => reverse, up => vertical, down => vertical + reverse.
# fadeEdges is forwarded explicitly (Mantine's own default is true) so the macro default of
# false holds the prior hard-edge look; pauseOnHover is forwarded True by default (Mantine's
# own default is off). The block body is the scrolling content, rendered as INLINE Markdown
# (render_inline_markdown → inline HTML, no <p> wrapper) with blank-line runs collapsed. That
# keeps discrete items (logo pills, badges) as direct children of Mantine's repeated group, so
# `gap` spaces them uniformly. The old blank-line block wrapping produced a <p> around the body,
# which let `gap` apply only BETWEEN the repeated copies (not between items within a copy) — a
# wider gap recurring once per set that read as a visible "seam" in the loop. Same inline-body
# idiom as text.md / mark.md / list.md.
import re
import aardvark.components as av
_dir = (direction or 'left').strip().lower()
_props = {}
if _dir in ('up', 'down'): _props['orientation'] = 'vertical'
if _dir in ('right', 'down'): _props['reverse'] = True
if duration is not None: _props['duration'] = duration
if gap: _props['gap'] = gap
if pauseOnHover: _props['pauseOnHover'] = True
_props['fadeEdges'] = bool(fadeEdges)
_body = re.sub(r'\n\s*\n+', '\n', av.render_inline_markdown((children or '').strip()))
print(component('Marquee', children=_body, attr=attr, **_props))
```
