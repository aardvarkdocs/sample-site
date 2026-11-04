---
name: visuallyhidden
description: A utility primitive that hides its content visually while keeping it available to
  screen readers — for labels, captions, and context that assistive tech needs but sighted
  users get from layout. The block body is the screen-reader-only content. Close with
  {% endVisuallyhidden %}.
params: {}
body: python
---
```python
# A pure accessibility primitive: Mantine's VisuallyHidden takes no styling props of its own —
# it renders a <span> with the visually-hidden style so the content stays in the accessibility
# tree but off-screen. It produces no visible output by design. The block body is the
# screen-reader-only text, wrapped in blank lines so the single Markdown pass renders it (the
# block-component convention). attr= forwards raw HTML attributes onto the rendered span.
_body = "\n\n" + (children or '') + "\n\n"
print(component('VisuallyHidden', children=_body, attr=attr))
```
