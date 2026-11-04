---
name: prompt
description: A copyable AI-prompt block — shows a block of prompt text with a copy button plus
  "Open in …" deep-link buttons (ChatGPT, Claude, Cursor) that pre-fill the prompt in that tool.
  `title` is an optional heading; the block body is the literal prompt text (kept verbatim, NOT
  Markdown-rendered — wrap any literal template syntax in a raw block). `actions` selects which
  deep-link buttons to show. Close with {% endPrompt %}.
params:
  title: string
  actions: { type: list, default: [copy, chatgpt, claude, cursor] }
body: python
---
```python
# Renders the Prompt island (Prompt.jsx), which owns the copy button and the
# "Open in ChatGPT / Claude / Cursor" deep-link buttons. The island builds each deep link from the
# prompt text at render time (chatgpt.com/?q=..., claude.ai/new?q=..., cursor://...?text=...), so
# the raw prompt string must reach it EXACTLY -- not through the page's Markdown pass, which would
# mangle fenced code, angle brackets, and blank lines a prompt often contains.
#
# So the body rides the JSON `text` prop (verbatim), NOT `children`: `children` would be spliced
# back into the page and rendered as Markdown (the block-component convention), whereas `text` is
# serialized into data-aardvark-props and handed to the island untouched. The author is expected to
# wrap literal template syntax in a raw block so the template engine leaves it alone (this
# codebase's usual convention for literal template syntax).
#
# `children` is None for a self-closing tag and a string for a block body. Writing the body on its
# own lines (the readable form) puts one newline right after the open tag and, before the close
# tag, a newline plus the close tag's own indentation — all tag formatting, not prompt content. So
# strip one leading newline and one trailing newline-plus-trailing-whitespace-line (covers an
# indented/nested {prompt} block, whose close tag sits after leading spaces). The prompt's OWN
# internal blank lines and indentation are preserved.
import re as _re
_text = (children or '')
_text = _re.sub(r'\A\n', '', _text)      # drop the single newline right after the open tag
_text = _re.sub(r'\n[ \t]*\Z', '', _text)  # drop the trailing newline + the close tag's indent
print(component('Prompt', text=_text, title=title, actions=actions, attr=attr))
```
