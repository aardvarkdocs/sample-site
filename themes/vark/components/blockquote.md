---
name: blockquote
description: A styled pull-quote — the Mantine Blockquote element. Set `cite` for an
  attribution line, `color` to tint the accent bar and icon, `radius` for rounded
  corners, and `icon` (a Tabler icon name, e.g. quote) for the badge in the corner.
  The quote text is the block body (Markdown) or a `text` param. A plain Markdown `>`
  quote still works for ordinary quotes; reach for this when you want the icon, color,
  or citation. Close with {% endBlockquote %}.
params:
  text: string
  cite: string
  color: string
  radius: string
  icon: string
  iconSize: int
body: python
---
```python
# Renders the Blockquote island (Blockquote.jsx), which owns the icon-name ->
# React-node resolution (Mantine's Blockquote `icon` is a node, so it can't ride this
# JSON props channel — same reason Callout has an island). Every other prop passes
# straight through to Mantine's Blockquote (which validates the values); unset props
# are omitted so Mantine's defaults apply.
import aardvark.components as av
props = {}
if cite: props['cite'] = cite
if color: props['color'] = color
if radius: props['radius'] = radius
if iconSize is not None and iconSize > 0: props['iconSize'] = iconSize
if icon:
    props['icon'] = icon
    # Mirror the card builtin: hand the island the configured Tabler CDN base so a
    # self-hosted / CSP-restricted / version-pinned site resolves icons the same way
    # (theme.iconCdn / theme.iconVersion). The island falls back to the pinned default
    # when it's absent. av.tabler_icon_cdn reads the build's config, and falls back to the
    # pinned default CDN in a bare render with no config in scope.
    props['iconCdn'] = av.tabler_icon_cdn(globals())
# The body is the quote text. Bracket it with blank lines so the single Markdown pass
# renders it as Markdown (paragraphs, emphasis, links) rather than swallowing it as raw
# HTML — same trick as aside.md. The `text=` shortcut is the plain-text alternative:
# Markdown won't format it, and since the collector embeds an island's children as raw HTML
# (NOT JSON), the inline text= is html.escape()'d here — the same stored-XSS guard as
# badge/chip/kbd/pill. The block body is already-rendered template output and left intact.
import html as _h
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else _h.escape(text or '')
print(component('Blockquote', children=_body, attr=attr, **props))
```
