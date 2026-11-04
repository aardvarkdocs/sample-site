---
name: articleCard
description: A blog-style article card — a title, a teaser `description` (or the block body), a
  byline with an avatar (initials when there is none), a `date`, a badge, `tags="a, b"` and an
  optional cover image, in five layouts (`variant` horizontal, footer, background, vertical or
  plain). `href` (or `url`) links the whole card. It is the card the taxonomy tag's article
  listing renders; use it standalone or inside a cardGrid. Close with {% endArticleCard %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
# Renders the ArticleCard island (ArticleCard.jsx).
import aardvark.components as av

href = av.link_href(attrs)

drop = (
    "href", "url", "onclick", "component", "variant", "date", "dateDisplay",
    "cols", "colsBase", "colsSm", "colsMd", "colsLg", "colsXl", "colsOverrides",
    "spacing", "verticalSpacing",
)
props = av.safe_attrs(attrs, *drop)

# `variant` accepts the gallery aliases (withfooter -> footer, image -> background,
# grid -> plain), normalized to the island's own names.
variant_raw = attrs.get("variant")
if variant_raw not in (None, "", True):
    variant = av.ARTICLE_CARD_VARIANTS.get(str(variant_raw).strip().lower())
    if variant is None:
        av.warn(
            f"Aardvark: {{% articleCard %}} variant={variant_raw!r} isn't a card variant "
            f"(one of {', '.join(sorted(set(av.ARTICLE_CARD_VARIANTS)))}) — using the default"
        )
    else:
        props["variant"] = variant

# badgeColor rides into a Mantine color prop / inline style, like the card's colors.
av.drop_unsafe_css(props, ("badgeColor",), tag="articleCard")

# The body is a plain-text fallback for description=: the card's excerpt is a Text line, not a
# Markdown region, so a body is only used when no `description` attribute is given.
body = children.strip()
if body and not props.get("description"):
    props["description"] = body

# `tags="a, b"` convenience (like the card's `badges`): split into the list the island takes.
tags_val = props.get("tags")
if isinstance(tags_val, str):
    props["tags"] = [t.strip() for t in tags_val.split(",") if t.strip()]

# A `date` without `dateDisplay` is formatted here, so the island never touches locale APIs
# (server-side rendering stays deterministic).
date_val = attrs.get("date")
if date_val not in (None, "", True):
    try:
        when, has_time, instant = av.parse_date(date_val, "{% articleCard %} date")
    except av.DateError as exc:
        av.warn(f"Aardvark: {exc} — dropping the date")
    else:
        # The machine-readable <time datetime> keeps the authored offset (the same as `when` when
        # none was given); the human-facing dateDisplay stays on the wall clock. The taxonomy's
        # cards and feeds split it the same way.
        props["date"] = instant.isoformat()
        props["dateDisplay"] = str(attrs.get("dateDisplay") or av.display_date(when, has_time))
elif attrs.get("dateDisplay"):
    props["dateDisplay"] = str(attrs["dateDisplay"])

if href:
    title = props.get("title")
    if isinstance(title, str) and title.strip():
        props["href"] = href
    else:
        # The card's stretched link takes its accessible name from the title, so a link with an
        # empty title is a large interactive target with no name (WCAG 2.4.4 / 4.1.2). Warn and
        # render a non-clickable card rather than ship a nameless link.
        av.warn(
            "Aardvark: {% articleCard %} has a link (href/url) but no title — a link "
            "needs a non-empty accessible name, so rendering the card non-clickable. "
            "Add title=\"…\" to make it a link."
        )
# `onclick` rides the attr= channel (a raw HTML attribute), merged over attr={…}.
print(component("ArticleCard", attr=av.merge_onclick(attr, attrs), **props))
```
