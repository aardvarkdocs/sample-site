---
name: contextmenu
description: >-
  A right-click context menu — the mantine-contextmenu community extension. `label`
  is the visible right-click target; `items` is a JSON array of entries — an action
  object (a `key`, a `title`, plus optional `href`, `color`, and a Tabler `icon`
  name) or a divider object (a `divider` key). On a static page an action with an
  `href` navigates there when picked.
params:
  label: { type: string, default: Right-click here }
  items: string
body: python
---
```python
# Renders the ContextMenu island (ContextMenu.jsx), which wraps the
# mantine-contextmenu extension in its own ContextMenuProvider and shows the menu on a
# right-click. The structured menu entries can't ride a scalar param, so `items` arrives
# as a JSON-array string and is parsed here; the resulting list of plain dicts JSON-encodes
# cleanly onto the island's props channel.
import json as _json
import aardvark.components as av
_items = []
if items:
    try:
        _items = _json.loads(items)
    except ValueError as _e:
        raise ValueError(
            "contextmenu: `items` must be a JSON array, e.g. "
            "items='[{\"key\": \"copy\", \"title\": \"Copy\"}, {\"divider\": true}]'. "
            f"Parse error: {_e}"
        ) from None
    if not isinstance(_items, list):
        raise ValueError("contextmenu: `items` must be a JSON array (got a non-list).")
    # Reject unsafe link schemes in item hrefs at build time, matching the link-bearing tags
    # (menu/anchor/navlink). The island's sanitizeHref strips them at render time (defense in
    # depth), but a build-time error tells the author instead of silently dropping the link.
    for _it in _items:
        if isinstance(_it, dict) and _it.get('href') and av.is_unsafe_href(_it['href']):
            raise ValueError(
                f"contextmenu: unsafe href {_it['href']!r} in items — use a relative path or an http(s):// link"
            )
props = {'label': label, 'items': _items}
# Hand the island the configured Tabler CDN base so a self-hosted / CSP-restricted /
# version-pinned site resolves item icons the same way (theme.iconCdn / theme.iconVersion);
# the island falls back to the pinned default when it's absent. Mirrors blockquote.md / card.
props['iconCdn'] = av.tabler_icon_cdn(globals())
if attr: props['attr'] = attr
# The island renders no body (it shows the right-click `label` target only), so this is a
# self-closing tag with no children channel, like the lightbox tag.
print(component('ContextMenu', **props))
```
