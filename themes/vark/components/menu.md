---
name: menu
description: >-
  A dropdown menu of actions/links anchored to a trigger button. `label` is the
  trigger; `items` is a JSON array of entries — an item object (a `label`, plus
  optional `href`, `color`, `disabled`), a section-heading object (a `section` key),
  or a divider object (a `divider` key). Set `position`, `width`, `shadow`, `trigger`
  (`click`/`hover`), `withArrow`, `offset`, `radius`, `targetVariant`, and
  `closeOnItemClick`.
params:
  label: { type: string, default: Menu }
  items: string
  position: string
  width: int
  shadow: string
  trigger: string
  withArrow: { type: bool, default: false }
  offset: int
  radius: string
  targetVariant: string
  closeOnItemClick: { type: bool, default: true }
body: python
---
```python
# Renders the Menu island (Menu.jsx), which builds Menu.Target (a Button labelled
# `label`) + Menu.Dropdown holding Menu.Item / Menu.Label / Menu.Divider entries.
# The structured menu entries can't ride a scalar param, so `items` arrives as a
# JSON-array string and is parsed here; the resulting list of plain dicts
# JSON-encodes cleanly onto the island's props channel.
import json as _json
import aardvark.components as av
_items = []
if items:
    try:
        _items = _json.loads(items)
    except ValueError as _e:
        raise ValueError(
            "menu: `items` must be a JSON array, e.g. "
            "items='[{\"label\": \"Profile\", \"href\": \"/me/\"}, {\"divider\": true}]'. "
            f"Parse error: {_e}"
        ) from None
    if not isinstance(_items, list):
        raise ValueError("menu: `items` must be a JSON array (got a non-list).")
    # Reject unsafe link schemes in item hrefs at build time, matching the other link-bearing tags
    # (anchor/button/actionicon/unstyledbutton/navlink/breadcrumbs). The island's sanitizeHref
    # strips them at render time (defense in depth), but a build-time error tells the author instead
    # of silently dropping the link. Items can be label/section/divider objects — only ones with an
    # href are checked.
    for _it in _items:
        if isinstance(_it, dict) and _it.get('href') and av.is_unsafe_href(_it['href']):
            raise ValueError(
                f"menu: unsafe href {_it['href']!r} in items — use a relative path or an http(s):// link"
            )
props = {'label': label, 'items': _items}
if position: props['position'] = position
if width is not None: props['width'] = width
if shadow: props['shadow'] = shadow
if trigger: props['trigger'] = trigger
if withArrow: props['withArrow'] = True
if offset is not None: props['offset'] = offset
if radius: props['radius'] = radius
if targetVariant: props['targetVariant'] = targetVariant
if not closeOnItemClick: props['closeOnItemClick'] = False
if attr: props['attr'] = attr
print(snippet('Menu', **props))
```
