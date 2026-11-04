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
logos they use. Aardvark ships one theme, **`vark`** (the default docs theme), as
**full, editable source** — there's no hidden layout. `vark new` copies it into your
project's `themes/vark/` so you own it.

## Where the theme lives

The bundled `vark` theme is packaged with Aardvark at `aardvark/themes/vark/`. `vark new`
copies its layout, styles and scripts into your project at **`themes/vark/`** — that's your
editable copy, and a project-local `themes/<name>/` wins over the bundled theme of the same
name, so you own the full source. Edit the files right there in `themes/vark/`. The theme's
built-in components, its islands and its `theme.yaml` stay in aardvark and are layered under
your folder (see [Layers and `theme.yaml`](#layers-and-themeyaml)), so they keep up with
aardvark upgrades.

For a one-off tweak where you don't want to fork the whole theme, drop a single file in
**`templates/`** instead: any file there overrides the same-named file in the active
theme (delete it to fall back). So `themes/vark/` is "I own this theme" and `templates/`
is "I'm patching one file of it". A layout override there is named `default.html`; the
older name `base.html` still works but warns at build time.

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
  templates, keep writing `/_aardvark/theme.css`; Aardvark rewrites it during the build.
- **`themes/vark/color-scheme.js`** — light/dark handling (see [Light & dark mode](/theming/dark-mode/)).
- **`themes/vark/components/`** — the theme's built-in components, such as
  `{% raw %}{% callout %}{% endraw %}` and `{% raw %}{% button %}{% endraw %}`: one `.md`
  definition per tag (`callout.md`, `button.md`, …), written the way your own
  [custom components](/authoring/custom-components/) are. `vark new` doesn't copy the folder; the
  packaged one is layered under yours, and a definition you add there replaces the packaged one
  for the same tag (see [Layers and `theme.yaml`](#layers-and-themeyaml)).
- **`themes/vark/theme.yaml`** — optional, and not copied by `vark new`. It is merged over the
  packaged theme's own `theme.yaml` (see [Layers and `theme.yaml`](#layers-and-themeyaml)), for
  example to add React component libraries the site calls from Markdown beyond Mantine and your
  own snippets. A `componentLibraries:` block in your `aardvark.config.yaml` can add to these,
  replace one, or remove one without touching the theme; this site declares its libraries there
  (see [Component libraries](/components/extras/component-libraries/)).
- **`themes/vark/THIRD_PARTY_NOTICES`** — the copyright notices and license texts for the
  third-party code in the theme: the Mermaid and Markdeep diagram scripts, the styles it adapts
  from Markdeep and Shiki, and the Tabler icons on its code-block buttons. A build publishes it in
  `/_aardvark/THIRD_PARTY_NOTICES.txt`, followed by the licenses of the npm packages in your
  site's component bundle and of the Tabler icons in its pages, so your site carries the notices
  for the code it serves. A theme
  of your own, or `templates/`, can ship its own file of that name (with or without `.txt`); the
  build adds it to that same file.

## Selecting a theme

The active theme is `theme.name` in `aardvark.config.yaml`; it defaults to `vark`:

```yaml
theme:
  name: vark            # the default — a bundled theme, or one you ship yourself
```

To ship your own theme, drop its folder at `themes/<name>/` in your project (it must
contain a `default.html`) and point `theme.name` at it. Its top-level templates and assets come
from that folder whole, so it holds every one its layout uses (copying `themes/vark/` is the
usual start); what it builds on is vark's components, islands and component libraries (see
[Building on another theme](#building-on-another-theme)). A project-local `themes/<name>/` wins
over a bundled theme of the same name; an unknown name warns and falls back to `vark`, so a
typo never breaks the build. Per-file `templates/` overrides still apply on top of whichever
theme is active.

## Layers and `theme.yaml`

aardvark reads a theme as **layers**: the packaged theme of that name (only `vark` ships), then
your `themes/<name>/` on top of it. Part of a theme merges across the layers, and part doesn't:

- A theme's **`components/`** and **`islands/`** folders and its **`theme.yaml`** are merged
  across the layers. A file in your folder replaces the packaged file of the same name, and
  everything you don't override keeps coming from aardvark, new components included when you
  upgrade. Every `.md` file in `components/` is a component definition, as in your project's own
  `components/` (a `README.md`, `CONTRIBUTING.md` or `CHANGELOG.md` excepted).
- The **top-level templates and assets** (`default.html`, `theme.scss`, the scripts) are not
  merged: they come from the top theme folder alone, with `templates/` on top, as described
  above. A file missing from that folder is not filled in from the packaged theme.

`vark new` sets up exactly this: it copies the top-level files, not the theme's `theme.yaml`.
A folder whose `theme.yaml` declares `themeApi` is a **complete** theme instead: it replaces the
packaged theme of the same name rather than layering over it (it still builds on the theme it
extends, below). Use that for a theme you maintain in full: a complete `vark` builds on no
other theme unless its `theme.yaml` says `extends:`, so none of the packaged built-in components
lie beneath it; it defines the ones its pages use in its own `components/`. Its components
follow the rules aardvark's own do: each needs a
[Python body](/authoring/custom-components/#python-bodies), and an unknown front-matter key
stops the build. An island under a name aardvark already has (a Mantine component, a packaged
`vark` island) is treated as the packaged one is, so a complete copy of `vark` builds exactly as
the packaged theme does; an island of its own is your code, like a snippet. A folder without
`themeApi` follows the rules of your
project's `components/`, and its islands are your own code, like
[snippets](/authoring/custom-snippets/): aardvark doesn't read their props for search, PDF or the
Markdown export.

### Building on another theme

A theme named anything other than `vark` builds on the packaged `vark`: its `components/`,
`islands/` and `theme.yaml` go on top of vark's, so they only need the files the theme changes.
Its top-level templates and assets don't layer; they come from its own folder whole.
`extends:` in its `theme.yaml` names another theme to build on, and `extends: null` builds on
nothing:

```yaml
# themes/brand/theme.yaml
extends: vark        # the packaged vark plus your themes/vark/; null for none
```

`extends` names a theme in your `themes/` folder or a packaged one, with both of its layers.
Without it, a theme builds on the packaged `vark` alone, so a `themes/vark/` folder left in the
project doesn't change a site whose theme is another. A value that isn't a plain theme name, a
theme that doesn't exist, a loop, or a chain of more than four `extends` links stops the chain
at that theme with a build warning. The theme then builds on the packaged `vark`, unless the
chain already reached `vark`, so a typo there doesn't break the build either.

### `theme.yaml` keys

| Key | What it does |
| --- | --- |
| `themeApi` | The theme API version the theme is written against, as a quoted `"MAJOR.MINOR"` string: `"1.0"` today. Declaring it makes the folder a complete theme. Keep the quotes: YAML reads an unquoted `1.10` as the number `1.1`. A theme that needs a newer theme API than your aardvark implements stops the build, naming both versions. |
| `extends` | The theme this one builds on (see above). |
| `componentLibraries` | Extra React component libraries, merged one key at a time over the layers below: an entry replaces the one with the same key, and `<key>: null` removes it. The packaged `vark` declares `charts` and `carousel`. See [Component libraries](/components/extras/component-libraries/). |

In a complete theme an unknown key or a malformed value stops the build; in a folder without
`themeApi` it warns and is ignored. A `theme.yaml` that can't be read, as a file or as YAML,
stops the build in any folder, since aardvark can't tell whether it declares `themeApi`. So does
the `themes/` folder, a theme folder, or its `components/` or `islands/`, when it is a symlink to
nothing or a file.
`theme.yaml` is build input: a built site never serves it.

## The theme's islands

A theme's `islands/` folder holds its React components. Each `.jsx` or `.tsx` file is one
island, named by its file: `Card.jsx` is the island the `{% raw %}{% card %}{% endraw %}`
component mounts, and what `component('Card')` names. A file whose name starts with `_` is a
helper the islands beside it import (`import { normalizeComment } from './_treeHelpers'`),
never an island itself, and an island's stylesheet sits beside it (`Card.jsx` imports
`./Card.css`). An island or helper in your folder replaces the packaged one of the same name
whatever its extension: your `ArticleCard.tsx` replaces `ArticleCard.jsx`, in the listings that
show article cards too, since vark's islands import one another without the extension
(`./ArticleCard`). Write your imports that way too. A `.js` or `.ts` file named like an island
is not one: the build skips the islands bundle, with a warning naming both files, until one is
renamed. Every island a site uses is bundled into one script and one stylesheet. Only the
files at the top of `islands/` are bundled (`.jsx`, `.tsx`, `.js`, `.ts` and `.css`), so keep
helpers there too: an island that imports a file in a subfolder or a `.json` file, or a
stylesheet whose `url(./…)` names an image, gets a build warning naming the import, and the
bundle fails. Two file names that differ only in letter case would be one file on a
case-insensitive disk, and two islands or helpers whose names do (`Tabs.jsx`, `tabs.tsx`) are
one import, so the build bundles the first (the lower layer's) and warns about the other; the
islands that are that file or import it render as their static placeholders.

The site chrome is aardvark's own and belongs to no theme: the search box, the reader assistant,
page feedback, the survey, the 404 page's search suggestions, the breadcrumbs, the tag cloud,
the header buttons and the fallback navigation icon (`Search`, `AiAssistant`, `PageFeedback`,
`Survey`, `NotFoundSuggestions`, `SiteBreadcrumbs`, `TagCloud`, `TopButton` and `NavIcon`). A
theme island with one of those names is ignored, with a build warning.

### Modules aardvark provides to islands

An island imports its siblings in `islands/` (by `./`), npm packages the site installs, and the
modules below, which aardvark provides under the specifier `@aardvark/islands/<name>`. The site
chrome is built from them too, so a theme's islands behave like it. They are part of theme API
`"1.0"`, and they are the only aardvark modules an island may import. An import that climbs out
of `islands/` (`../`, in any `import`, `import()`, `require()` or stylesheet `@import`) reaches
aardvark's own files, which can change in any release, so the build warns about it.

```jsx
import { sanitizeHref } from '@aardvark/islands/safe-href';
```

#### `@aardvark/islands/safe-href`

`sanitizeHref(href)` returns `href` when it is an http(s) or relative URL and `undefined`
otherwise — a `javascript:`, `data:` or protocol-relative URL, even percent-encoded — so a link
built from an author's attribute can't run script. It reads no browser globals, so it also runs
in the build's prerender.

#### `@aardvark/islands/tabler-icons`

[Tabler](https://tabler.io/icons) icons, fetched once per name from the icon CDN the build
passes an island as `iconCdn`. `LazyTablerIcon({ name, iconCdn, style, className })` renders a
fixed-size box and fills it with the icon when it arrives. `classifyIcon(value)` sorts an icon
value into `svg`, `image`, `fa`, `emoji`, `tabler`, `unknown` or `none`;
`tablerIconUrl(iconCdn, name, style)` is the URL an icon is fetched from. `sanitizeSvg(svg)`
rebuilds an SVG an author wrote or the icon CDN served from an allowlist of SVG elements and
attributes, keeping only same-document references, and returns `null` for anything that isn't
one `<svg>`. It is meant for those two sources, not for SVG from untrusted input. `tablerGlyph(icon, iconCdn, className)` renders a Tabler
name only, `bulletNode(bullet, iconCdn, className)` a Tabler name or any other text as it is, and
`resolveCardIcon(icon, options)` any icon value inside a Mantine `ThemeIcon`.

#### `@aardvark/islands/code-actions`

The Copy and Download buttons of a code block: the default export, `CodeActions({ text,
filename })`, and `HighlightedPre({ code, codeHtml, lang, className, ariaLabel })`, the
`<pre><code>` they sit beside. They render the same markup the theme's `code-blocks.js` adds to
Markdown code: an `.aardvark-code-actions` group of `.aardvark-code-btn` buttons, each carrying
`data-aardvark-code-action="copy"` or `"download"`, and a copy announced through the page's
`#aardvark-live` region. A theme that draws its own code buttons keeps that attribute:
[Content Reach](/content-reach/) counts code copies by it.

#### `@aardvark/islands/highlight`

A small syntax highlighter for code an island renders itself. It emits the class names the
build's own highlighting uses, so the theme's syntax colors apply: `tokenizeCode(code, lang)`,
`highlightHtml(code, lang)`, `resolveHighlightLanguage(lang)` and `LANG_SYNTAX` (the languages it
knows), with `extForLang(lang)`, `codeDownloadFilename({ title, lang, index, uid })` and
`codeDownloadFilenames(specs)` for the file a Download button saves.

#### `@aardvark/islands/tag-cloud`

Tag filtering for listing islands, shared with the chrome's tag cloud so all of them read and
write the same `#tag=` address: `collectTags(entries)`, `filterByActiveTags(items, active)`,
`useTagFilter()`, `useSyncedTagFilter(tagSlugs)`, `tagsFromHash(hash, tagSlugs)`,
`samePath(a, b)`, `dispatchTaxonomyFilterChange(slugs)`, and the `TagBadge` and `TagCloudBox`
components.

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
`default.html`, so a misspelling degrades gracefully instead of failing. The value must
be a bare template name — anything with a slash or `..` in it is rejected with a warning
and the page renders with `default.html`; `pagetype: default` is the same as leaving it
unset.

This site ships a `landing.html` in its `templates/` folder and a page that opts into it.
Here's the whole template, read straight from the file so it never drifts from what
actually renders:

```html src="../../templates/landing.html" title="templates/landing.html" lines
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
| `not_found_html` | The 404 page's "Were you looking for…" search suggestions island; `""` on every other page (see below) |
| `title` | The page title |
| `nav_html` | The page's isolated left nav, built from front-matter menus |
| `breadcrumbs_html` | The breadcrumb trail (a Mantine island), or `""` |
| `toc_html` | The on-this-page table of contents |
| `page_url` | The current page's URL |
| `full_title` | The complete `<title>` text |
| `seo_head` | The canonical, robots, Open Graph / Twitter, hreflang, and JSON-LD tags |
| `theme_style` | The inline `<style>` with the resolved theme variables (palette, syntax colors, background image) |
| `layout_class` | The page's `mode:` class for the layout grid (`aardvark-mode-wide`, …), `""` for the default layout |
| `lang` | The page's language code |
| `brand_html` / `tabs_html` | The header brand and the horizontal tab bar |
| `top_buttons_html` / `search_html` | The header call-to-action buttons and the search box |
| `footer_html` / `powered_by_html` | The site-wide footer and the Powered-by line (`""` when off) |
| `banner_html` / `banner_id` | The announcement banner and its id (`""` when there is none) |
| `css_files` / `js_files` | Your root CSS/JS assets, already rewritten to fingerprinted build URLs |
| `head_extra` / `body_extra` | Integration + islands tags |
| `t(key)` / `escape(s)` | Translate a UI string into the page's language; escape a string for use in an HTML attribute |
| `asset(path)` | Resolve a stable path (`/_aardvark/theme.css`, `/img/logo.svg`) to its fingerprinted build URL |

Because it's the same engine, you can use Python, `component(...)`, and
`asset(path)` in the layout too — e.g. embed a Mantine component in the header
or construct a dynamic URL to a fingerprinted static asset.

The built-in `vark` theme renders `not_found_html` just before `content`
(`{% raw %}{% not_found_html %}{% content %}{% endraw %}`). It's empty on normal pages, so it's harmless
everywhere — but a **fully custom `default.html` must include the
`{% raw %}{% not_found_html %}{% endraw %}` slot** to get the search-powered 404 suggestions (see
[Search → 404 suggestions](/search/#404-suggestions)). Omitting it degrades gracefully: the 404 page
still shows your static `404.md`, just without the "Were you looking for…" island.

## Nav

The horizontal tabs are the only navigation configured in `aardvark.config.yaml`
(`tabs:`, each with a `label`, a `link`, and an `id`). The left sidebar is a property
of the content: a page joins a tab's menu with `menu: <tab-id>` in its front matter,
nests under another page with `parent: <id>`, orders itself with `weight:`, and can
put a section divider above itself with `heading:`. Each tab gets its own isolated
tree, and the current page is highlighted automatically with its ancestor branches
expanded. See [Navigation menus](/authoring/navigation/) for the full mechanism,
including sections that assemble themselves from folders.

## Breadcrumbs

Every page (except the home page) gets a breadcrumb trail at the top of the
content, rendered with Mantine's
[Breadcrumbs](https://mantine.dev/core/breadcrumbs/) component. The trail is
**menu-based**, not URL-based: Aardvark finds the page in its tab's sidebar tree and
reads *tab → section → ancestors → page*. It leads with the page's owning tab, then
the `heading:` divider that groups the page (if there is one), then each ancestor
branch, then the page itself — on this site the Installation page shows
`Docs / Getting Started / Installation`, and the Button reference shows
`Docs / Components / Built-in Components / Buttons / Button`. A page that belongs to
no tab menu falls back to `Home / <page title>` (its `navtitle` when set). Ancestor pages link to themselves,
the tab crumb links when the tab has a `link:`, a section divider is a label only,
and the last crumb — the current page — never links.

It's on by default. Turn it off — or tune it — with a top-level `breadcrumbs:`
block in `aardvark.config.yaml`:

```yaml
breadcrumbs: false            # disable entirely
```

```yaml
breadcrumbs:
  enabled: true               # default
  home: true                  # keep the leading crumb — the owning tab, or Home (default true)
  homeLabel: Home             # label of the Home fallback crumb (localized like nav labels)
  separator: "/"              # the separator between crumbs (defaults to "/")
```

Individual pages can opt out without touching the config: set `breadcrumb: false`
in a page's front matter to hide the trail on just that page. This site's Changelog,
Blog, and Support pages all do it — each is the landing page of its own tab, so its
trail would just repeat the tab's name above the title (`Changelog / Changelog`).
This hides only the *visible* trail — the page's hover-card preview and its
`BreadcrumbList` structured data still reflect its place in the hierarchy.

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

Because it's real Sass, you can **derive** shades instead of hand-picking each one — the
active-nav fill is just `rgba($primary-light, 0.12)`, so it tracks the brand automatically. The full set of
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

## Powered by Aardvark

Every page ends with a small **Powered by Aardvark** footer linking to
[aardvarkdocs.com](https://aardvarkdocs.com). Its logo swaps with the active light/dark
scheme, just like the header brand.

It's on by default. Sites with any [build-time AI](/ai-features/) feature enabled —
`ai.frontmatter`, `ai.examples`, or `ai.skills` (the reader-facing assistant alone doesn't
count) — can remove it from `aardvark.config.yaml`:

```yaml
poweredBy: false              # honored with ai.frontmatter / ai.examples / ai.skills on
```

With none of those build-time AI features on the link is kept — the attribution is genuinely appreciated — so
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
built-in `one-light` / `one-dark` pair used by default. A named preset also sets the code
block's background so themes like Monokai look right. A name Pygments doesn't know warns
at build time and keeps the built-in default.

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
`bash`, `json`, and so on. Aardvark template examples have a dedicated `aardvark` label
that colors the `{% raw %}{% %}{% endraw %}` directives — tag and attribute names and their
values — and renders the surrounding Markdown body.

Shell fences (`bash`, `sh`, `shell`, `zsh`) color the command name, flags, variables, and
`NAME=value` assignments — more than Pygments' stock bash lexer, which leaves bare commands
and their arguments uncolored.
