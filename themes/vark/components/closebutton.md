---
name: closebutton
description: A close (✕) button — Mantine CloseButton. Exposes size, radius, variant,
  color, disabled, and an optional `icon` spec (Tabler name / Font Awesome class / image /
  emoji / inline <svg>) to replace the default ✕. `label` sets the accessible name, which
  defaults to "Close".
params:
  # Optional icon spec to replace the default ✕ — read exactly like the {% icon %} tag.
  icon: string
  filled: { type: bool, default: false }
  # Accessible name. Mantine sets none of its own, so an unset label defaults to "Close"
  # below rather than shipping a button with no accessible name at all.
  label: string
  # Appearance / behavior
  variant: string
  color: string
  size: string
  radius: string
  disabled: { type: bool, default: false }
  # HTML id on the rendered button
  id: string
  # JavaScript click handler — any JS expression (rides the raw-attribute channel)
  onclick: string
  # Mantine spacing system
  m: string
  mt: string
  mb: string
  ml: string
  mr: string
  mx: string
  my: string
body: python
---
```python
# Renders the CloseButton island (CloseButton.jsx). The default ✕ needs nothing;
# an optional `icon` spec is resolved to a React node there (it can't ride this JSON props channel).
# Every other prop passes straight through to Mantine's CloseButton; unset (None / '' / False) props
# are omitted so Mantine's own defaults apply. `onclick` rides the islands attr= channel (a raw HTML
# attribute — a string of JS, not a React function prop), matching the button tag.
import aardvark.components as av
_props = {}
if icon: _props['icon'] = icon
if filled: _props['filled'] = True
# A ✕ is not text, and Mantine's CloseButton sets no aria-label of its own, so an unset
# label would ship a button with no accessible name at all. Default it instead.
_props['label'] = label or 'Close'
_p = {
    # Mantine's CloseButton has no `color` prop — its ✕ is a fixed gray, and an unknown
    # `color` would ride through to the DOM as a dead HTML attribute. `c` (the style prop
    # that sets the element's text color) is what tints the glyph, since CloseIcon paints
    # with currentColor — so the author-facing `color=` maps onto it.
    'variant': variant, 'c': color, 'size': size, 'radius': radius,
    'disabled': disabled, 'id': id,
    'm': m, 'mt': mt, 'mb': mb, 'ml': ml, 'mr': mr, 'mx': mx, 'my': my,
}
for k, v in _p.items():
    if v not in (None, '', False):
        _props[k] = v
_attr = dict(attr) if attr else {}
if onclick: _attr['onclick'] = onclick
_attr = _attr or None
# Only when there IS a bare Tabler name to resolve, mirroring list / card: the island's
# LazyTablerIcon fetch needs the configured base (theme.iconCdn / theme.iconVersion) or a
# self-hosted or CSP-restricted site silently falls back to the public CDN. av.tabler_icon_cdn
# reads the build's config and falls back to the pinned default in a bare render with none.
# Setting it unconditionally would put the key on every icon-less button too.
if icon:
    _props['iconCdn'] = av.tabler_icon_cdn(globals())
print(snippet('CloseButton', attr=_attr, **_props))
```
