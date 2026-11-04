---
name: list
description: An ordered or unordered list — the Mantine List element. Give the items in
  `items`, pipe-separated (`First | Second | Third`) or as a JSON array; each item renders
  inline Markdown. Set `type` (unordered, the default, or ordered), `size`, `spacing`,
  `withPadding` to indent, `center` to vertically center an item against its bullet/icon,
  and `icon` (a Tabler name) to swap the bullet for an icon on every item. A plain Markdown
  list still works; reach for this when you want the icon, sizing, or spacing controls.
params:
  items: string
  type: string
  size: string
  spacing: string
  withPadding: { type: bool, default: false }
  center: { type: bool, default: false }
  icon: string
body: python
---
```python
# Renders the List island (List.jsx), which maps the items to the List + List.Item tree
# (List is compound and its `icon` is a React node, so the build-time macro can't emit it
# through the JSON props channel — same reason Steps / Card have islands). Every scalar
# prop passes straight through to Mantine's List (which validates the values); unset
# props are omitted so Mantine's defaults apply.
import json
import aardvark.components as av
# Parse `items` into a list of source strings: a JSON array (for items that contain a
# literal pipe) or, more commonly, a pipe-separated string. Empty entries are dropped so a
# trailing `|` doesn't render a blank item.
_raw = (items or '').strip()
_sources = []
if _raw:
    if _raw.startswith('['):
        try:
            parsed = json.loads(_raw)
            if isinstance(parsed, list):
                _sources = [str(x) for x in parsed]
        except ValueError:
            _sources = []  # not valid JSON → fall through to the pipe split below
    if not _sources:
        _sources = [s.strip() for s in _raw.split('|')]
_sources = [s for s in _sources if s.strip()]
# Each item renders inline Markdown (so **bold** / `code` / [links] format) with no <p>
# wrapper — the island injects it inside a <List.Item>. render_inline_markdown passes raw
# HTML through, matching the author-trusted posture of the other body-rendering builtins.
# These fragments ride inside serialized island props, where the later page Markdown pass
# deliberately cannot enter, so resolve fingerprints and deploy prefixes at this producer boundary.
_html_items = [av.render_inline_fragment(globals(), s) for s in _sources]
props = {'items': _html_items}
if type: props['type'] = type
if size: props['size'] = size
if spacing: props['spacing'] = spacing
if withPadding: props['withPadding'] = True
if center: props['center'] = True
if icon:
    props['icon'] = icon
    # Mirror the card builtin: pass the configured Tabler CDN base so a self-hosted /
    # CSP / version-pinned site resolves icons the same way (the island falls back to
    # the pinned default when it's absent). av.tabler_icon_cdn reads the build's config, and
    # falls back to the pinned default CDN in a bare render with no config in scope.
    props['iconCdn'] = av.tabler_icon_cdn(globals())
print(component('List', attr=attr, **props))
```
