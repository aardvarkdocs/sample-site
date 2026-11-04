---
name: callout
description: A callout / admonition — a titled box with a severity color and a matching
  icon. `severity` is one of success (green), info (primary), caution (yellow), or
  warning (red); `title` is optional; the block body is the message.
  Close with {% endCallout %}.
params:
  title: string
  severity: { type: string, default: info }
body: python
---
```python
# Renders the Callout island (Callout.jsx), which owns the severity -> color +
# icon mapping (the icon is a React node, so it can't be passed through this
# JSON props channel). An unset title is None -> the snippet renders no title;
# an unknown severity falls back to info there.
#
# The block body is the message — bracket it with blank lines so the single Markdown pass renders
# it (paragraphs, emphasis, links, lists) rather than leaving it literal inside the island's
# one-line <div> (the block-component convention). An empty/self-closing body stays '' so no stray
# blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(snippet('Callout', severity=severity, title=title, children=_body, attr=attr))
```
