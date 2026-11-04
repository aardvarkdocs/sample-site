---
name: update
description: An inline release note — one entry on a timeline rail, with a version or date label
  on the left and the Markdown body beside it. `label` is the rail heading (`v1.2.0`,
  `2026-07-03`); `description` is an optional dimmed sub-label under it; `tags="a, b"` renders a
  small badge cloud; `bullet` takes a Tabler icon name, an emoji or short text; every other
  attribute (`color`, …) rides through to the entry. Several in a row read as one continuous
  rail. For a whole release log kept in a data file, use the changelog tag instead. Close with
  {% endUpdate %}.
close: required
childScope: true
passthrough: true
body: python
---
```python
# Renders the Update island (Update.jsx): the Mantine Timeline with a single Item, so adjacent
# entries join into one rail (Update.css). It reuses the Timeline island's accent (--tl-color).
import aardvark.components as av

# The body is the entry's content — bracketed in blank lines so the page's single Markdown pass
# renders it (headings, lists, links, code) rather than leaving it literal inside the island's
# one-line <div>. An empty/self-closing body stays '' so no stray blank lines are emitted.
body = children.strip()
children = "\n\n" + body + "\n\n" if body else ""

# `label` / `description` are consumed here; everything else (`tags`, `color`, `bullet`, …)
# rides through as an Update island prop. Each is text, a string or a number; unset (None) or
# blank is absent, and any other value (a bare flag reads as True) is dropped with a warning
# rather than shown as "True".
props = av.safe_attrs(attrs, "label", "description")
for key, example in (("label", "v1.2.0"), ("description", "2026-07-03")):
    value = attrs.get(key)
    if value is None:
        continue
    if isinstance(value, bool) or not isinstance(value, (str, int, float)):
        av.warn(
            f"Aardvark: {{% update %}} ignoring {key}={value!r} — {key} is text, e.g. "
            f"{key}=\"{example}\" (in {av.call_source(globals())})"
        )
        continue
    text = str(value).strip()
    if text:
        props[key] = text
# `tags` is a comma-separated convenience for several labels; split a STRING into a list here so
# the island never string-splits (like the card's `badges`). A pre-split list or tuple — from the
# Python form, component('aardvark', 'update', tags=[...]) — is taken too. Either way each label
# is trimmed and a blank one dropped, as the changelog's tags= and the taxonomy's tagFilter= read
# theirs, then deduped in order, so a repeated label (tags="api, api") renders one badge, not two.
# Any other type (a bare `tags` flag reads as True) is no tag list: dropped with a warning, like
# label and description.
tags = props.get("tags")
if isinstance(tags, str):
    tags = tags.split(",")
if isinstance(tags, (list, tuple)):
    tags = list(dict.fromkeys(str(t).strip() for t in tags if str(t).strip()))
elif tags is not None:
    av.warn(
        f"Aardvark: {{% update %}} ignoring tags={tags!r} — tags is a comma-separated list, "
        f"e.g. tags=\"api, cli\" (in {av.call_source(globals())})"
    )
    tags = None
if tags:  # set in place, so the island's props keep the order they were written in
    props["tags"] = tags
else:  # tags="" / tags=",," / a bare flag leave nothing to render
    props.pop("tags", None)
# A `bullet` may be a Tabler icon name the island fetches at mount — add the icon CDN base (which
# honors theme.iconCdn/iconVersion) only for a non-empty STRING bullet, as the card and timeline
# do. Testing for a real string, not just truthiness, keeps a bare `bullet` flag (True) from adding
# a CDN it can't use. An emoji or short-text bullet never reaches the CDN, so the base is harmless.
bullet = attrs.get("bullet")
if isinstance(bullet, str) and bullet.strip():
    props["iconCdn"] = av.tabler_icon_cdn(globals())
print(component("Update", children=children, attr=attr, **props))
```
