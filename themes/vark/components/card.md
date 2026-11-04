---
name: card
description: A content card that does almost anything a card can — a title and a Markdown body,
  a Tabler icon, a cover image or a full-bleed background (`variant="image"`), `badge` or
  `badges="a, b"`, an `accent` color, `gradient`, `glass` and `stat` looks, and a whole-card link
  (`href`, or `url`). Works standalone or inside a cardGrid. `onclick` attaches a click handler.
  Close with {% endCard %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
# Renders the Card island (Card.jsx), built from Mantine's Card plus Image / BackgroundImage /
# Badge / ThemeIcon. The body shapes the props so the island stays presentation-only.
import aardvark.components as av

href = av.link_href(attrs)
# The Markdown body becomes the card content, bracketed in blank lines so the page's single
# Markdown pass renders it; an empty body (a stat card, say) emits no content.
body = children.strip()
children = "\n\n" + body + "\n\n" if body else ""

# Names handled explicitly, or that belong only to the card grid — never spread as card props.
# `component` is dropped on purpose: Mantine Card is polymorphic, so `component="a"` would render
# the whole Card as an <a> with the title's stretched-link <Anchor> nested inside it — invalid
# <a>-in-<a>, and exactly the accessibility hazard the stretched-link pattern avoids. Links go
# through `href`, so authors never need `component`.
drop = (
    "href", "url", "onclick", "component", "iconCdn",
    "gradient", "gradientFrom", "gradientTo", "gradientDeg",
    "cols", "colsBase", "colsSm", "colsMd", "colsLg", "colsXl", "colsOverrides",
    "spacing", "verticalSpacing",
)
props = av.safe_attrs(attrs, *drop)
# accent/color/iconColor/badgeColor land verbatim in an inline style in the island (the
# --aardvark-card-accent var, Mantine color props), just like gradient stops.
av.drop_unsafe_css(props, ("accent", "color", "iconColor", "badgeColor"), tag="card")
if attrs.get("variant") == "image" and not attrs.get("image"):
    # The "image" variant overlays text on a full-bleed background; without an `image` it degrades
    # to a normal card (the island guards against invisible light-on-light text), so surface the
    # likely authoring mistake rather than shipping a blank-looking card.
    av.warn('Aardvark: {% card variant="image" %} needs an `image` to use as the background — '
            "rendering as a normal card")
if href:
    props["href"] = href
# `gradient` is composed into a {from, to, deg} object here, so the island never parses it.
grad = av.parse_gradient(attrs, tag="card")
if grad is not None:
    props["gradient"] = grad
av.coerce_flag_attrs(props, ("withBorder", "external", "sheen"))
# The Tabler icon CDN base (honors theme.iconCdn/iconVersion), only when there is an icon to fetch.
if attrs.get("icon"):
    props["iconCdn"] = av.tabler_icon_cdn(globals())
# `badges` is a comma-separated convenience for several labels; split it into a list here so the
# island never string-splits. A single label that itself contains a comma uses the singular `badge`
# (which is never split).
if isinstance(props.get("badges"), str):
    props["badges"] = [b.strip() for b in props["badges"].split(",") if b.strip()]

# `onclick` rides the attr= channel (a raw HTML attribute, not a React prop), merged over attr={…}.
print(component("Card", children=children, attr=av.merge_onclick(attr, attrs), **props))
```
