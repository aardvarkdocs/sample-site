---
description: Tabs live in the config; left-nav menus are defined in page front matter,
  Hugo-style — menu, parent, navtitle, weight, and heading.
icon: fa-solid fa-sitemap
menu: docs
title: Navigation menus
weight: 24
---

# Navigation menus

Navigation has two parts: the **horizontal tabs** (in `aardvark.config.yaml`) and each
tab's **left-nav menu** (defined in page front matter). The config stays tiny —
no hand-maintained nav tree — and the sidebar is a property of your content.

## Tabs (config)

Each tab gets a `link` and an `id`. The `id` is also the **menu name** that pages
target. A tab with `items:` instead of a `link` becomes a dropdown.

```yaml
tabs:
  - label: Docs
    link: /
    id: docs
  - label: Components
    link: /components/
    id: components
```

A tab is highlighted whenever the current page belongs to its menu, so a tab
linked to `/` stays active on its nested sub-pages.

## Menus (front matter)

Add a page to a tab's left nav with front-matter keys:

| Key | Meaning |
| --- | --- |
| `menu` | The tab `id` this page joins (top-level placement). |
| `parent` | The `id` of the parent entry (nests this page under it). |
| `id` | This entry's id, for children to reference. Defaults to the page's path. |
| `navtitle` | A shorter label for the sidebar and breadcrumbs when the page `title` is too long for the narrow nav. The `<title>` tag and on-page H1 keep the full `title`. |
| `weight` | Optional ordering override. Siblings list **alphabetically by label** by default; give a page a `weight` to pull it ahead (lowest first). |
| `heading` | A label string rendered above this entry as a section divider; the page itself stays a normal, clickable entry. |
| `icon` | An icon shown to the **left** of this entry's label (see [Icons](#icons)). |
| `heading-icon` | An icon for the `heading` section label above this entry. |

Entries list **alphabetically by their nav label** out of the box, so new pages
slot into place with no bookkeeping. Reach for `weight` only when you want a
specific order — a weighted entry jumps ahead of the alphabetical ones. And when a
page's `title` is too long for the narrow sidebar, give it a short `navtitle`:

```yaml
---
title: Templating & data
navtitle: Templating # short sidebar label; <title> and H1 keep "Templating & data"
menu: docs           # joins the "docs" tab's left nav
parent: authoring    # nested under the entry whose id is "authoring"
weight: 10           # optional — overrides the alphabetical default
---
```

## Sections from folders

The easy path: give a folder's `index.md` a `menu` (or `parent`), and **every
other file in that folder joins it automatically** — no per-file front matter.
A page's id defaults to its path, so `components/button.md` has id
`components/button` and `modes/index.md` has id `modes`.

```bash
content/components/
  index.md        # menu: components  -> the "Components" section (a real page)
  button.md       # auto-joins Components
  action-icon.md  # auto-joins Components
```

## Two kinds of entry, plus labels

- **Leaf** — a page with no children: a plain link.
- **Branch** — a page that has children (e.g. a folder `index.md`): its label
  links to its own page, and a **caret** expands/collapses the subtree. Click the
  caret to peek inside without navigating.

A `heading:` string adds a **non-clickable section label** above an entry — the
"Getting Started" and "Authoring" labels in this sidebar are leaves whose first
item carries a `heading`, with the rest of the group as plain siblings beneath it.
The current page's ancestor branches render expanded, so the nav is correct even
before JavaScript loads.

## Icons

Give a page an `icon:` and it renders to the **left** of that page's label in the
left nav. `heading-icon:` does the same for the `heading` section label above it —
the "Getting Started" group in this sidebar shows both. A value is read **exactly like
an [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) spec** — same sources, same rules:

- **A [Tabler](https://tabler.io/icons) icon name** — a bare lowercase name like `rocket`
  or `brand-github` (the default for a bare name). Tabler glyphs are lazy-loaded from a CDN,
  so only the icons your nav uses are fetched, and they tint with the link color.
- **A Font Awesome class** — explicit, e.g. `fa-solid fa-rocket`, `fab fa-github`.
- **A path to an image** — any `.svg`/`.png`/`.jpg`/… under `static/`, e.g.
  `/icons/folder.svg`. Square images read best.
- **An emoji** — any non-ASCII glyph, e.g. `🚀`.

The icon is capped to one line so it never makes the nav row taller.

```yaml
---
title: Quickstart
menu: docs
icon: bolt                     # a Tabler icon, left of this page's label
heading: Getting Started
heading-icon: fa-solid fa-flag # a Font Awesome glyph, left of the section label above it
---
```

A bare name is a **Tabler** icon — Font Awesome must be written out (`fa-solid fa-bolt`),
exactly as in the [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) tag. Font Awesome glyphs also need the FA
stylesheet loaded: set `theme.fontawesome: true` in `aardvark.config.yaml` (this site does),
or pass a kit/CDN URL to self-host or use Pro. Tabler, image, and emoji icons need none of that.
