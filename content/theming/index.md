---
description: The default theme is full, editable HTML source in templates/. Override
  the layout and styles however you like.
heading: Theming
heading-icon: fa-solid fa-palette
icon: fa-solid fa-brush
menu: docs
title: Theme & customization
weight: 40
---

# Theme & customization

The default docs theme is shipped as **full, editable source** in your project's
`templates/` directory — there's no hidden layout. `vark new` copies it in so you
own it.

## Files

- **`templates/base.html`** — the page layout, rendered by the same `{% raw %}{% %}{% endraw %}`
  engine as your content. It places the header, sidebar nav, content slot, TOC,
  and the "Was this page helpful?" widget.
- **`templates/theme.css`** — the chrome styles. Emitted to `/_aardvark/theme.css`.
- **`templates/color-scheme.js`** — light/dark handling (see [Light & dark mode](/theming/dark-mode/)).

Any file you place in `templates/` overrides the packaged default of the same
name; delete a file to fall back to the built-in.

## What the layout receives

`base.html` is rendered with these variables (in addition to the usual
`data`/`site`/`config`/`page`):

| Variable | Contents |
| --- | --- |
| `content` | The rendered page HTML |
| `title` | The page title |
| `nav_html` | The page's isolated left nav, built from front-matter menus |
| `breadcrumbs_html` | The breadcrumb trail (a Mantine island), or `""` |
| `toc_html` | The on-this-page table of contents |
| `page_url` | The current page's URL |
| `css_files` / `js_files` | Your root assets |
| `head_extra` / `body_extra` | Integration + islands tags |

Because it's the same engine, you can use Python and `component(...)` in the
layout too — e.g. embed a Mantine component in the header.

## Nav

The sidebar comes from the `nav:` tree in `aardvark.config.yaml`: groups with
`items`, each item a `label` + `link`. The current page is highlighted
automatically.

## Breadcrumbs

Every page (except the home page) gets a breadcrumb trail at the top of the
content, rendered with Mantine's
[Breadcrumbs](https://mantine.dev/core/breadcrumbs/) component. The trail is **menu-based**:
aardvark finds the current page in your `nav:` tree and shows the path of menu
labels to it — e.g. a page under the *Buttons & actions* group shows
`Home / Buttons & actions / Button`. Pages absent from the nav fall back to
`Home / <page title>`.

It's on by default. Turn it off — or tune it — with a top-level `breadcrumbs:`
block in `aardvark.config.yaml`:

```yaml
breadcrumbs: false            # disable entirely
```

```yaml
breadcrumbs:
  enabled: true               # default
  home: true                  # prepend a linked Home crumb (default true)
  homeLabel: Home             # its label (localized like nav labels)
  separator: "/"              # Mantine's separator (defaults to "/")
```

Individual pages can opt out without touching the config: set `breadcrumb: false`
in a page's front matter to hide the trail on just that page. The Changelog does
this, since a `Home / Changelog` crumb adds nothing above its title. This hides
only the *visible* trail — the page's hover-card preview and its `BreadcrumbList`
structured data still reflect its place in the hierarchy.

Labels and links are localized per language just like the sidebar nav. The
trail is rendered into the `breadcrumbs_html` layout variable, so editing
`templates/base.html` lets you move or restyle it.

## Colors

Set your palette under `theme.colors`, split into `light:` and `dark:`. There are two kinds:

- **Named palette colors** — `primary`, `secondary`, and any others you add become Mantine
  colors you can use in components (`color="primary"`). `primary` is the default and also drives
  the chrome **accent**: prose links, focus rings, and the active nav item. Its link color is
  checked by the build-time contrast audit, so brand links stay readable on both schemes.
- **Chrome slots** — `background`, `text`, `surface`, `hover`, `border`, and `muted` feed the
  theme's CSS variables (`--aardvark-bg`, `--aardvark-fg`, `--aardvark-surface`, …) directly.

```yaml
theme:
  colors:
    light:
      primary: "#7048e8"
      background: "#ffffff"          # --aardvark-bg
      text: "#1a1b1e"                # --aardvark-fg
      surface: "#f5f3ff"             # --aardvark-surface — cards, code blocks
      hover: "#f1f3f5"               # --aardvark-hover
      muted: "#6b7280"               # --aardvark-muted
      border: "rgba(0, 0, 0, 0.08)"  # --aardvark-border
    dark:
      primary: "#a78bfa"
      # …the same slots, with dark values
```

Every slot is optional: anything you omit keeps the theme's built-in default. The sample
`aardvark.config.yaml` lists each slot with its default value — so the config, not the
stylesheet, is the one place to see and change every color.

## Page background

Give the whole page a background image with `theme.backgroundImage`. Drop the file in
`static/` and point at it — the image layers over the background color and shows through
behind the content, sidebar, and TOC (the header keeps its solid band):

```yaml
theme:
  backgroundImage: /backgrounds/page.svg   # one image, sensible defaults
```

Use a mapping for a separate dark-mode image and to control placement:

```yaml
theme:
  backgroundImage:
    light: /backgrounds/light.svg   # light mode (also used in dark unless `dark` is set)
    dark: /backgrounds/dark.svg     # optional dark-mode image
    size: cover                     # how it's scaled
    position: center                # where it's anchored
    repeat: no-repeat               # whether it tiles
    attachment: scroll              # scroll with the page, or `fixed` to stay put (desktop only)
```

Each knob takes a friendly word **or** any raw CSS value, so you can do whatever CSS allows:

| Knob | Options | What it does |
| --- | --- | --- |
| `size` | `cover` / `fill` / `scaled` · `fit` (contain) · `stretch` · `original` · a length like `400px` | How the image is scaled. `cover` fills the page, cropping overflow; `fit` shows all of it. |
| `position` | `center` · `top` · `bottom` · `left` · `right` · pairs like `right top` · `50% 20%` | Where the image is anchored. |
| `repeat` | `no-repeat` / `once` · `tile` / `tiled` (repeat) · `horizontal` · `vertical` | Whether and how it tiles. |
| `attachment` | `scroll` (default) · `fixed` · `local` | `scroll` moves the image with the page; `fixed` keeps it still (a parallax look) — but `fixed` is **unsupported on iOS Safari**, so it's a desktop-only opt-in. |

The defaults (when you set only an image) are `cover` · `center` · `no-repeat` · `scroll` —
a full-bleed image. Add `attachment: fixed` for a parallax background that stays put as you
scroll, but only target desktop with it: iOS Safari doesn't support fixed backgrounds. For a
small repeating texture, set `size: original` and `repeat: tile` instead.

The image also extends up through the sticky header and tab bar — but only with
`attachment: fixed`, where it's viewport-locked and lines up seamlessly with the page. Under
the default `scroll` the bars stay solid (the image would otherwise be sized to each bar's own
box and seam at the edge), and the background lives on the page body alone.

## Favicon

Set the browser-tab (and bookmark) icon with `theme.favicon`. Drop the file in
`static/` and point at it — the extension sets the `<link type>`, so an SVG scales to
any tab size:

```yaml
theme:
  favicon: /favicon.svg
```

Ship several formats by passing a list — the browser picks the best one it can render,
which is handy for a legacy `.ico` fallback alongside a scalable SVG:

```yaml
theme:
  favicon:
    - /favicon.svg
    - /favicon.ico
```

Leave it unset and the browser just probes `/favicon.ico` on its own.

## Powered by aardvark

Every page ends with a small **Powered by aardvark** footer linking to
[aardvarkdocs.com](https://aardvarkdocs.com). Its logo swaps with the active light/dark
scheme, just like the header brand.

It's on by default. Sites with [build-time AI](/ai-features/) enabled — any `ai:` feature —
can remove it from `aardvark.config.yaml`:

```yaml
poweredBy: false              # honored on the AI/paid tier
```

On the free tier the link is kept — the attribution is genuinely appreciated — so
`poweredBy: false` there is ignored, and the build prints a friendly note. Either way the
footer is wrapped in a stable id, so you can always hide it with one line of CSS (in a root
stylesheet or `templates/theme.css`):

```css
#aardvark-powered-by { display: none; }
```

## Syntax highlighting

Fenced code blocks are highlighted at build time with
[Pygments](https://pygments.org) — no client-side JavaScript. Choose a color theme
for each scheme under `theme.syntax`:

```yaml
theme:
  syntax:
    theme: one-light       # light-mode preset
    themeDark: one-dark    # dark-mode preset
```

Set `enabled: false` under `theme.syntax` to turn highlighting off entirely — code blocks
then render as plain `<pre><code>` with no token coloring.

`theme` and `themeDark` accept any Pygments style — for example `monokai`, `dracula`,
`nord`, `github-dark`, `solarized-light`, `solarized-dark`, or `gruvbox-dark` — plus the
built-in `one-light` / `one-dark` pair used by default. A dark preset also sets the code
block's background so themes like Monokai look right.

To fine-tune, override individual token colors by name (these win over the preset).
Light colors go under `colors:`, dark under `colorsDark:`:

```yaml
theme:
  syntax:
    colors:                # light
      keyword: "#a626a4"
      string: "#50a14f"
      comment: "#a0a1a7"
    colorsDark:            # dark
      keyword: "#c678dd"
      string: "#98c379"
```

The recognized token names are `comment`, `keyword`, `constant`, `string`, `number`,
`function`, `builtin`, `decorator`, `class`, `variable`, `attribute`, `tag`,
`operator`, and `heading` (Markdown headings inside a code sample).

### Code block labels

Tag each fenced block with its language so it highlights correctly — `python`, `yaml`,
`bash`, `json`, and so on. aardvark template examples have a dedicated `aardvark` label
that colors the `{% raw %}{% %}{% endraw %}` directives — tag and attribute names and their
values — and renders the surrounding Markdown body.

Shell fences (`bash`, `sh`, `shell`, `zsh`) color the command name, flags, variables, and
`NAME=value` assignments — more than Pygments' stock bash lexer, which leaves bare commands
and their arguments uncolored.
