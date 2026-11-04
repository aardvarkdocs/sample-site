---
name: code
description: Inline or block code — the Mantine Code element. By default it's an inline
  `<code>` run for a short token mid-sentence; add `block` for a standalone fenced-style
  block. Set `color` to tint the background. The code text is the block body or a `code`
  param; it's shown verbatim (no Markdown, no syntax highlighting). For highlighted,
  multi-line source, use a fenced ``` code block instead. Close with {% endCode %}.
params:
  code: string
  block: { type: bool, default: false }
  color: string
body: python
---
```python
# Mirrors button.md / badge.md: props pass straight through to Mantine's Code
# (which validates them) and unset props are omitted so Mantine's defaults apply.
# `block` switches Mantine Code from an inline <code> to a standalone <pre>-style
# block; `color` tints the background.
#
# The body is shown verbatim — Code is for a literal token/snippet, not formatted
# Markdown — so it's HTML-escaped (mirrors button/badge's `text=` handling) rather
# than run through render_inline_markdown. `children` is already-rendered template
# output, but as code we want the literal source: prefer the raw `code=` param, then
# fall back to the (text-only) body. Both are escaped so `<`, `&`, etc. read literally.
import html as _h
props = {}
if block: props['block'] = True
if color: props['color'] = color
# Inline by default: mount via inline_component so an inline code tag mid-sentence
# renders an inline <code> in a <span> wrapper (a block <div> would split the
# paragraph). When `block` is set, it's a standalone block, so use the block
# component() wrapper.
_emit = component if block else inline_component
_text = code if code is not None else (children or '')
print(_emit('Code', children=_h.escape(_text), attr=attr, **props))
```
