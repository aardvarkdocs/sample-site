---
description: The default theme is full, editable HTML source in themes/vark/. Override
  the layout and styles however you like.
heading: Theming
heading-icon: fa-solid fa-palette
icon: fa-solid fa-brush
menu: docs
title: Theme & customization
weight: 40
---

# Theme & customization

A **theme** is a self-contained folder of HTML templates plus the CSS, JS, fonts, and
logos they use. aardvark ships one theme, **`vark`** (the default docs theme), as
**full, editable source** — there's no hidden layout. `vark new` copies it into your
project's `themes/vark/` so you own it.

## Where the theme lives

The bundled `vark` theme is packaged with aardvark at `aardvark/themes/vark/`. `vark new`
copies it into your project at **`themes/vark/`** — that's your editable copy, and a
project-local `themes/<name>/` wins over the bundled theme of the same name, so you own
the full source. Edit the files right there in `themes/vark/`.

For a one-off tweak where you don't want to fork the whole theme, drop a single file in
**`templates/`** instead: any file there overrides the same-named file in the active
theme (delete it to fall back). So `themes/vark/` is "I own this theme" and `templates/`
is "I'm patching one file of it".

Theme CSS/JS/asset files must sit at the **top level** of the theme (or `templates/`) —
only top-level files are emitted to `/_aardvark/`, with per-build fingerprinted
filenames. Keep nested assets (images, icon sets, extra fonts) in `static/`
instead, where the whole tree is copied and fingerprinted.

## Files

- **`themes/vark/default.html`** — the page layout, rendered by the same `{% raw %}{% %}{% endraw %}`
  engine as your content. It places the header, sidebar nav, content slot, TOC,
  and the "Was this page helpful?" widget. **Every theme must provide a `default.html`**
  — it's the layout used for any page that doesn't pick another.
- **`themes/vark/theme.scss`** — the color system and chrome styles. The `$`-variables at the
  top are the single source of truth for every color (light + dark); compiled to
  `/_aardvark/theme-<sha>.css` at build time. See [Colors](#colors). In source
  templates, keep writing `/_aardvark/theme.css`; aardvark rewrites it during the build.
- **`themes/vark/color-scheme.js`** — light/dark handling (see [Light & dark mode](/theming/dark-mode/)).

## Selecting a theme

The active theme is `theme.name` in `aardvark.config.yaml`; it defaults to `vark`:

```yaml
theme:
  name: vark            # the default — a bundled theme, or one you ship yourself
```

To ship your own theme, drop its folder at `themes/<name>/` in your project (it must
contain a `default.html`) and point `theme.name` at it. A project-local `themes/<name>/`
wins over a bundled theme of the same name; an unknown name warns and falls back to
`vark`, so a typo never breaks the build. Per-file `templates/` overrides still apply
on top of whichever theme is active.

## Page templates

Every page uses the theme's `default.html` unless it asks for another. A theme can hold
any number of templates beside `default.html` (e.g. `landing.html`, `blog.html`); a page
opts into one with a `pagetype:` front-matter key:

```yaml
---
title: Launch
pagetype: landing      # renders with the theme's landing.html
---
```

`pagetype: landing` resolves `landing.html` through the same cascade as the default
layout (your `templates/landing.html` first, then the active theme's). A `pagetype:`
that names a template the theme doesn't have warns at build time and falls back to
`default.html`, so a misspelling degrades gracefully instead of failing.

This site ships a `landing.html` in its theme and a page that opts into it. Here's the
whole template, read straight from the theme file so it never drifts from what actually
renders:

```html src="../../themes/vark/landing.html" title="themes/vark/landing.html" lines
```

{% card icon="layout-2" title="See it live" cta="Open the landing example" href="/theming/landing-example/" accent="grape" %}
The landing example renders with `landing.html` instead of `default.html` — same theme,
a different layout (no sidebar, a centered hero).
{% endCard %}

## What the layout receives

`default.html` (and any `pagetype:` template) is rendered with these variables (in
addition to the usual `data`/`site`/`config`/`page`):

| Variable | Contents |
| --- | --- |
| `content` | The rendered page HTML |
| `title` | The page title |
| `nav_html` | The page's isolated left nav, built from front-matter menus |
| `breadcrumbs_html` | The breadcrumb trail (a Mantine island), or `""` |
| `toc_html` | The on-this-page table of contents |
| `page_url` | The current page's URL |
| `css_files` / `js_files` | Your root CSS/JS assets, already rewritten to fingerprinted build URLs |
| `head_extra` / `body_extra` | Integration + islands tags |

Because it's the same engine, you can use Python, `component(...)`, and
`asset(path)` in the layout too — e.g. embed a Mantine component in the header
or construct a dynamic URL to a fingerprinted static asset.

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
`themes/vark/default.html` lets you move or restyle it.

## Colors

Every color on the site is declared once, in your theme's **`themes/vark/theme.scss`** — the
single source of truth. Run `vark new` to get an editable copy of the theme in your project,
then edit the `$`-variables at the top of `theme.scss`. The file is compiled to
`/_aardvark/theme-<sha>.css` at build time (with [Sass](https://sass-lang.com)), and the rest
of the stylesheet only ever references those variables — so changing one value recolors the
whole site. Your theme source can still link `/_aardvark/theme.css`; the output HTML is
rewritten to the fingerprinted URL.

Each color is a **light/dark pair**, so both schemes are always covered:

```scss
// Chrome
$bg-light:      #ffffff;   $bg-dark:      #1a1b1e;   // page background
$fg-light:      #1a1b1e;   $fg-dark:      #c9c9c9;   // body text
$surface-light: #f5f3ff;   $surface-dark: #221d33;   // cards & panels

// Brand — primary also drives links, focus rings & active nav, and seeds the Mantine island
// palette, so color="primary" / color="secondary" resolve in components.
$primary-light:   #7048e8;  $primary-dark:   #a78bfa;
$secondary-light: #0ca678;  $secondary-dark: #38d9a9;

// Code & tables get their own knobs. The default theme keeps them a neutral grey ($neutral,
// below) rather than the brand-tinted $surface used for cards — retint freely.
$neutral-light: #f8f9fa;           $neutral-dark: #25262b;
$code-bg-light:         $neutral-light;  $code-bg-dark:         $neutral-dark;  // fenced code blocks
$code-inline-bg-light:  $neutral-light;  $code-inline-bg-dark:  $neutral-dark;  // `inline code`
$table-stripe-light:    $neutral-light;  $table-stripe-dark:    $neutral-dark;  // zebra rows
$table-header-bg-light: $fg-light;       $table-header-bg-dark: $fg-dark;        // header band
```

Because it's real Sass, you can **derive** shades instead of hand-picking each one — the accent
fill is just `rgba($primary-light, 0.12)`, so it tracks the brand automatically. The full set of
variables — chrome, brand, code, tables, diff, plus advanced semantic colors (API method chips,
status dots, shadows) — sits grouped and commented at the top of `theme.scss`.

The brand `primary` link color is checked by the build-time [contrast audit](/accessibility/),
so custom-brand links stay WCAG-readable on both schemes.

> **Moved from config.** Colors used to be set under `theme.colors` in `aardvark.config.yaml`.
> That's been replaced by `theme.scss`; a `theme.colors` block in config is now ignored (the
> build warns and points you here).

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
stylesheet or `themes/vark/theme.scss`):

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
