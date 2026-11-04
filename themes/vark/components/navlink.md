---
name: navlink
description: A navigation link (Mantine's NavLink) — a `label` with an optional
  `description`, a `leftSection`/`rightSection` icon (any {% icon %} spec — a Tabler
  name, Font Awesome class, image path, emoji, or inline SVG), `href`, `active`,
  `variant` (light, filled, subtle), `color`, `disabled`, `noWrap`, and `autoContrast`.
  Nest sub-links by passing a JSON array to `items` (one level); set `childrenOffset`
  and `defaultOpened` to control the nested group.
params:
  label: { type: string, required: true }
  description: string
  href: string
  # Icon specs — resolved to glyphs in the island, like {% icon %}
  leftSection: string
  rightSection: string
  # State / style
  active: { type: bool, default: false }
  variant: string
  color: string
  disabled: { type: bool, default: false }
  noWrap: { type: bool, default: false }
  autoContrast: { type: bool, default: false }
  # Nesting — a JSON array of nested-link descriptors ([{label, href, ...}, ...])
  items: string
  childrenOffset: int
  defaultOpened: { type: bool, default: false }
body: python
---
```python
# Renders the NavLink island, which resolves the leftSection/rightSection icon
# specs to React glyph nodes (the props channel can't carry a React element) and maps a
# nested-link descriptor array onto nested Mantine <NavLink>s. Scalars pass straight
# through; unset (None/''/False) props are omitted so Mantine's defaults apply.
#
# Nested links go in the `items` param (a JSON array of {label, href, ...}), NOT the
# block body — NavLink's nested entries are sub-links, not free text, and 'children' is
# a reserved param name (the body slot) in the custom-component schema. The island reads
# the descriptor array as its `items` prop.
#
# Only `defaultOpened` is exposed (not Mantine's controlled `opened`): a build-time macro
# can't supply the onChange a controlled NavLink needs, so an `opened` group would be
# frozen — `defaultOpened` is the uncontrolled, user-toggleable equivalent.
import json as _json
import aardvark.components as av

# Reject unsafe link targets at build time, matching anchor/button/actionicon/unstyledbutton.
# The island's sanitizeHref already strips them at render time (defense in depth), but a
# build-time error tells the author instead of silently dropping the link. Guards the top-level
# href AND every nested item href (the descriptor array is parsed below, so checking it is
# trivial), so the whole link tree is covered — not just a single scalar href. The shared
# av.is_unsafe_href covers dangerous schemes + protocol-relative URLs.
def _reject_unsafe_href(_h, _where):
    if av.is_unsafe_href(_h):
        raise ValueError(f"navlink: unsafe href {_h!r} in {_where} — use a relative path or an http(s):// link")
_reject_unsafe_href(href, 'the link')

_nav = {
    'label': label, 'description': description, 'href': href,
    'leftSection': leftSection, 'rightSection': rightSection,
    'active': active, 'variant': variant, 'color': color,
    'disabled': disabled, 'noWrap': noWrap, 'autoContrast': autoContrast,
    'defaultOpened': defaultOpened,
}
_props = {k: v for k, v in _nav.items() if v not in (None, '', False)}
if childrenOffset is not None:
    _props['childrenOffset'] = childrenOffset
if items:
    try:
        _nested = _json.loads(items) if isinstance(items, str) else items
    except (ValueError, TypeError) as _e:
        raise av.ComponentError(
            "navlink: the `items` param is not valid JSON. Pass a JSON array of "
            "nested-link objects, each with a label and optional href. (" + str(_e) + ")"
        ) from None
    if _nested:
        # Guard every nested item's href the same way as the top-level one; recurse since a
        # nested item can itself carry an `items` array.
        def _reject_nested(_arr):
            for _it in (_arr or []):
                if isinstance(_it, dict):
                    _reject_unsafe_href(_it.get('href'), 'a nested item')
                    _reject_nested(_it.get('items'))
        _reject_nested(_nested)
        # Rides the props channel as a structured `items` array (NOT `children=`, which
        # snippet() consumes as the block-body string and would drop the data).
        _props['items'] = _nested
# The island's LazyTablerIcon fetch needs the Tabler CDN base (honors theme.iconCdn /
# theme.iconVersion), exactly like the icon / card tags inject it — without it a
# bare-Tabler-name leftSection/rightSection would fetch from an undefined base.
# av.tabler_icon_cdn reads the build's config, and falls back to the pinned default CDN in a
# bare render with none, so the macro stays renderable there.
_props['iconCdn'] = av.tabler_icon_cdn(globals())
print(snippet('NavLink', attr=attr, **_props))
```
