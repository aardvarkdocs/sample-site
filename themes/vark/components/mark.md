---
name: mark
description: Highlighted text — the Mantine Mark element, a tinted `<mark>` run for
  drawing the eye to a phrase mid-sentence. Set `color` to any theme color (defaults
  to yellow). The text is the block body (inline Markdown — **bold**, `code`, [links])
  or a `text` param. Close with {% endMark %}.
params:
  text: string
  color: string
body: python
---
```python
# Mirrors text.md: a phrasing-content highlight run. `color` passes straight through
# to Mantine's Mark (which defaults to yellow); unset props are omitted.
#
# Mark is always inline (a <mark> mid-sentence), so it mounts via inline_component —
# a block wrapper would split the surrounding paragraph. The block body renders as
# inline Markdown (render_inline_markdown → inline HTML, no <p> wrapper) so it nests
# cleanly inside the inline element; the `text=` shortcut is plain text, HTML-escaped
# (untrusted tag attribute) like button/badge handle theirs.
import html as _h
import re
import aardvark.components as av
props = {}
if color: props['color'] = color
if (children or '').strip():
    _body = re.sub(r'\n\s*\n+', '\n', av.render_inline_markdown(children.strip()))
else:
    _body = _h.escape(text or '')
print(inline_component('Mark', children=_body, attr=attr, **props))
```
