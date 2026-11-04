---
name: panel
description: A supplementary side panel — a bordered, subtly-raised surface for an aside that
  floats beside the main content on a wide viewport and stacks below it on a narrow one.
  `title` is an optional heading above the body; `side` (`right`, the default, or `left`) picks
  the edge it floats to; every other attribute (`width`, `withBorder`, …) rides through to the
  panel. The block body is the panel content, any Markdown. Close with {% endPanel %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
# Renders the Panel island (Panel.jsx). The float beside the content and the stack below it on a
# narrow viewport are pure CSS (Panel.css), so this body only shapes the props.
import aardvark.components as av

# Drop `title` from the spread and re-add it explicitly, so an empty/omitted (or whitespace-only)
# title yields NO `title` prop at all — the island then renders no heading — rather than a stray
# `title=""` prop. The spread otherwise forwards every other attribute straight through.
props = av.safe_attrs(attrs, "title")
av.coerce_flag_attrs(props, ("withBorder",))
# `width` lands verbatim in an inline style custom property (--aardvark-panel-width in Panel.jsx).
# A numeric width rides through as a Mantine px size, so only string widths need this.
av.drop_unsafe_css(props, ("width",), tag="panel", noun="length")
title = str(attrs.get("title", "")).strip()
if title:
    props["title"] = title
# The body is ordinary Markdown: bracket it with blank lines so the page's single Markdown pass
# renders it (paragraphs, lists, links) rather than leaving it literal inside the island's one-line
# <div>. An empty/self-closing body stays "" so no stray blank lines are emitted.
body = ("\n\n" + children.strip() + "\n\n") if children.strip() else ""
print(component("Panel", children=body, attr=attr, **props))
```
