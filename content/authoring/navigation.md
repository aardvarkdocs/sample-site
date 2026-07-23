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
no hand-maintained nav tree — and the sidebar is a property of your content. The
tabs are optional: [omit them](#optional-a-site-with-no-tabs) and you get just the
sidebar, or turn a tab into a [dropdown](#dropdown-tabs) when it fronts a deep section.

## Tabs (config)

Each tab gets a `link` and an `id`. The `id` is also the **menu name** that pages
target. Add `icon:` to show a glyph beside the tab label.

```yaml
tabs:
  - label: Docs
    icon: book-2
    link: /
    id: docs
  - label: Components
    icon: components
    link: /components/
    id: components
```

A tab is highlighted whenever the current page belongs to its menu, so a tab
linked to `/` stays active on its nested sub-pages.

## Dropdown tabs

Give a tab `items:` instead of a `link:` and it becomes a **dropdown** — clicking
the tab opens a menu of child links (hover and keyboard both work, with a no-JS
fallback). Each child takes a `label`, a `link`, and an optional `icon:`. This is
handy when one tab fronts a deep section and you want to expose its sub-areas up
top. Keep the tab's `id:` — it still names the left-nav menu, so your `menu:`
front matter is unchanged and the tab stays lit across the **whole** section, not
only the sub-pages it lists:

```yaml
tabs:
  - label: Docs
    icon: book-2
    id: docs            # names the "docs" menu; no `link:`, so this tab is a dropdown
    items:
      - label: Getting Started
        icon: flag
        link: /docs/
      - label: Authoring
        icon: pencil
        link: /authoring/templating/
      - label: Theming
        icon: palette
        link: /theming/
      - label: Deploy
        icon: rocket
        link: /deploy/
```

Because the dropdown children are ordinary links, don't give them their own `id:`
unless you mean to open a **separate** menu — an `id` on a child names its own menu
the same way a top-level tab's does. Point children at pages that already live in
the section (the `menu: docs` pages, here) so their landing links stay in sync.

## Optional: a site with no tabs

The horizontal tab bar is optional. **Omit `tabs:` entirely** and no bar renders at
all — every page just shows the left-nav sidebar for [its own menu](#menus-front-matter).
Give a section's `index.md` a `menu:` and the rest of the folder
[auto-joins it](#sections-from-folders); the menu name no longer has to match a tab.

```yaml
# aardvark.config.yaml — no `tabs:` key at all
site:
  name: My Docs
```

```yaml
---
# content/guide/index.md
title: Guide
menu: guide     # names this section's sidebar; siblings auto-join, no tab needed
---
```

Reach for this when a site is a single flat section (or a handful you'd rather not
surface as tabs) — you keep the content-driven sidebar with zero header chrome.

## Menus (front matter)

Add a page to a tab's left nav with front-matter keys:

| Key | Meaning |
| --- | --- |
| `menu` | The tab `id` this page joins (top-level placement). |
| `nav` | `nav: false` keeps the page **in** its menu (so its tab stays lit when you visit it) but **out** of the sidebar list — for pages readers reach through a listing rather than the nav, like this site's knowledge-base articles and changelog entries. (Whether to hide a taxonomy's members is per-site taste: our blog keeps its posts in the sidebar as an archive.) |
| `parent` | The `id` of the parent entry (nests this page under it). |
| `id` | This entry's id, for children to reference. Defaults to the page's path. |
| `navtitle` | A shorter label for the sidebar and breadcrumbs when the page `title` is too long for the narrow nav. The `<title>` tag and on-page H1 keep the full `title`. |
| `weight` | Optional ordering override. Siblings list **alphabetically by label** by default; give a page a `weight` to pull it ahead (lowest first). |
| `heading` | A label string rendered above this entry as a section divider; the page itself stays a normal, clickable entry. |
| `icon` | An icon shown to the **left** of this entry's label (see [Icons](#icons)). |
| `heading-icon` | An icon for the `heading` section label above this entry. |

Pages can also carry `taxonomy:` front matter — tag-based membership that drives
changelog / knowledge-base / blog listings and can add a per-page tag nav to the sidebar;
see the [Taxonomy component](/components/extras/taxonomy/).

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

Use `icon:` on horizontal tabs, dropdown tab children, or pages in the left nav. The
glyph renders to the **left** of that item's label. `heading-icon:` does the same for
the `heading` section label above a left-nav entry — the "Getting Started" group in
this sidebar shows both. A value is read **exactly like an [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) spec** — same sources, same rules:

- **A [Tabler](https://tabler.io/icons) icon name** — a bare lowercase name like `rocket`
  or `brand-github` (the default for a bare name). Aardvark bakes Tabler glyphs directly into the
  static navigation — from the outline set bundled with aardvark, or your locally installed
  `@tabler/icons` package when you've pinned a different `theme.iconVersion` — so they paint with
  the page and tint with the link color, with no JavaScript or icon request on the normal path.
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
A custom `theme.iconCdn` is authoritative (it may serve different SVGs): navigation uses its runtime
loader and `vark build` stays quiet. A `theme.iconVersion` that is neither bundled with aardvark nor
installed locally also falls back to the runtime loader — but there `vark build` warns which glyphs
it couldn't bake.
