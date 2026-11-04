---
name: kbd
description: A keyboard key — renders a `<kbd>` styled like a physical key, for documenting
  shortcuts (e.g. Ctrl, ⌘, Enter). The key text is the block body or a `text` param; set
  `size` (xs–xl) to scale it. Close with {% endKbd %}.
params:
  text: string
  size: string
body: python
---
```python
# Mirrors badge.md: `size` passes straight through to Mantine (which validates it) and is
# omitted when unset so Mantine's default ('sm') applies. The key is the block body (the
# rich form) or the `text=` shortcut.
props = {}
if size: props['size'] = size
# The inline `text=` string is HTML-escaped (a stored-XSS surface for untrusted authors);
# block-form `children` is already-rendered template output and left intact. Mirrors pill.md.
import html as _h
_label = children if children else _h.escape(text or '')
# An INLINE island (a <span> wrapper), because a key belongs mid-sentence: "Press Ctrl + C".
# Mantine's Kbd renders a <kbd>, which is phrasing content, so a block <div> wrapper here was
# invalid inside the enclosing <p> — the browser hoisted it out and split the sentence across
# separate lines. Mirrors the other inline built-ins (icon, mark, numberformatter).
print(inline_component('Kbd', children=_label, attr=attr, **props))
```
