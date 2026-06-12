---
title: "Card"
description: "The built-in card tag — flashy content cards with icons, cover and background images, gradient/glass/stat variants, whole-card outbound links, and a responsive grid. Usage, options, and live examples."
---

# Card

A **built-in** tag built from Mantine's `Card` (plus `Image`, `BackgroundImage`, `Badge`,
and `ThemeIcon`) behind one tag pair. One card does pretty much anything a card can: a
title and a **Markdown** body, an icon, a cover or full-bleed background image, badges, an
accent color, gradient/glass/stat looks, and a whole-card outbound link. Wrap a set of them
in `{% raw %}{% cardGrid %}{% endraw %}` for a responsive grid.

Cards are **flashy by default** — hover lift, cover-image zoom, an animated sheen on link
cards, accent borders — and all of it is **reduced-motion-safe** and looks right in light
and dark.

## Basic card

A title and a Markdown body. Standalone, a card is a full-width block:

{% raw %}
```aardvark
{% card title="What is aardvark?" %}
A documentation-focused static site generator — **Markdown in, static HTML out**, with
interactive [Mantine](https://mantine.dev) islands.
{% endCard %}
```
{% endraw %}

renders, live:

{% card title="What is aardvark?" %}
A documentation-focused static site generator — **Markdown in, static HTML out**, with
interactive [Mantine](https://mantine.dev) islands.
{% endCard %}

## Icons

`icon="…"` takes any **[Tabler icon](https://tabler.io/icons)** name (kebab-case, e.g.
`rocket`, `brand-github`, `bolt`). Tabler icons are **lazy-loaded** — only the icons a page
actually uses are fetched from a CDN at view time, so the full ~5,800-icon library is available
without bloating the page. `icon=` also accepts a **Font Awesome** class
(`icon="fa-solid fa-rocket"`, `icon="fab fa-github"` — needs `theme.fontawesome: true`), an
emoji, an image URL, or inline `<svg>`.

{% raw %}
```aardvark
{% cardGrid %}
{% card title="Fast builds" icon="bolt" accent="yellow" %}
Incremental Markdown rendering and one esbuild pass.
{% endCard %}
{% card title="Secure by default" icon="shield" accent="teal" %}
Author-trusted, but hardened — escaped props, sanitized links.
{% endCard %}
{% card title="Open source" icon="brand-github" accent="grape" %}
Browse the icon set at tabler.io/icons.
{% endCard %}
{% endCardGrid %}
```
{% endraw %}

{% cardGrid %}
{% card title="Fast builds" icon="bolt" accent="yellow" %}
Incremental Markdown rendering and one esbuild pass.
{% endCard %}
{% card title="Secure by default" icon="shield" accent="teal" %}
Author-trusted, but hardened — escaped props, sanitized links.
{% endCard %}
{% card title="Open source" icon="brand-github" accent="grape" %}
Browse the icon set at [tabler.io/icons](https://tabler.io/icons).
{% endCard %}
{% endCardGrid %}

## Link cards

Add `href` and the **whole card** becomes a link (with a hover lift and an animated sheen).
External URLs open in a new tab and get an external-link icon automatically; internal links
just navigate. A `cta` adds a **button** at the bottom (use `ctaVariant="link"` for a plain
text link with an arrow instead). `badge`/`badges` work on any card, and `icon` takes a Tabler
name **or** a Font Awesome class — the Mantine card below uses `fab fa-react`.

{% raw %}
```aardvark
{% cardGrid %}
{% card title="Quickstart" icon="rocket" badge="Popular" badgeColor="grape" href="/getting-started/quickstart/" cta="Get going" %}
Build your first site in a minute.
{% endCard %}
{% card title="Components" icon="components" href="/components/raw/" cta="Browse" %}
Every Mantine component, callable from Markdown.
{% endCard %}
{% card title="Mantine" icon="fab fa-react" href="https://mantine.dev" cta="Visit" %}
The React component library under the hood.
{% endCard %}
{% endCardGrid %}
```
{% endraw %}

{% cardGrid %}
{% card title="Quickstart" icon="rocket" badge="Popular" badgeColor="grape" href="/getting-started/quickstart/" cta="Get going" %}
Build your first site in a minute.
{% endCard %}
{% card title="Components" icon="components" href="/components/raw/" cta="Browse" %}
Every Mantine component, callable from Markdown.
{% endCard %}
{% card title="Mantine" icon="fab fa-react" href="https://mantine.dev" cta="Visit" %}
The React component library under the hood.
{% endCard %}
{% endCardGrid %}

## Cover images

`image="…"` puts a full-bleed cover image at the top (it zooms on hover for link cards).
Pair it with `badge` for a label, and `alt` for accessibility (`alt=""` for a purely
decorative image):

{% raw %}
```aardvark
{% cardGrid colsBase=1 colsSm=2 %}
{% card title="Theming" image="/img/sample-landscape.svg" alt="" badge="Guide" href="/components/raw/" %}
Colors, fonts, and layout — make it yours.
{% endCard %}
{% card title="Carousel" image="/landscape.jpg" alt="" badge="New" badgeColor="grape" href="/components/carousel/" %}
Flip through captioned images in a lightbox.
{% endCard %}
{% endCardGrid %}
```
{% endraw %}

{% cardGrid colsBase=1 colsSm=2 %}
{% card title="Theming" image="/img/sample-landscape.svg" alt="" badge="Guide" href="/components/raw/" %}
Colors, fonts, and layout — make it yours.
{% endCard %}
{% card title="Carousel" image="/landscape.jpg" alt="" badge="New" badgeColor="grape" href="/components/carousel/" %}
Flip through captioned images in a lightbox.
{% endCard %}
{% endCardGrid %}

## Background-image cards

`variant="image"` makes the image the **full card background**, with the text laid over it.
A gradient scrim keeps the title and body readable on any photo (WCAG AA), in both color
schemes:

{% raw %}
```aardvark
{% card variant="image" image="/landscape.jpg" alt="" title="Deploy anywhere" cta="Ship it" href="/getting-started/quickstart/" %}
Build to static HTML and host it anywhere — a full-bleed hero with a readable scrim.
{% endCard %}
```
{% endraw %}

{% card variant="image" image="/landscape.jpg" alt="" title="Deploy anywhere" cta="Ship it" href="/getting-started/quickstart/" %}
Build to static HTML and host it anywhere — a full-bleed hero with a readable scrim.
{% endCard %}

## Gradient & glass

`variant="gradient"` paints the card with a gradient (derived from the theme accent, or set
explicitly with `gradient="from,to,deg"`).

{% raw %}
```aardvark
{% card variant="gradient" gradient="indigo,cyan,135" icon="sparkles" title="Pro plan" cta="Upgrade" href="/getting-started/quickstart/" %}
Priority support and unlimited seats.
{% endCard %}
```
{% endraw %}

{% card variant="gradient" gradient="indigo,cyan,135" icon="sparkles" title="Pro plan" cta="Upgrade" href="/getting-started/quickstart/" %}
Priority support and unlimited seats.
{% endCard %}

`variant="glass"` is a translucent, frosted surface — its **backdrop blur** shows whatever sits
behind it, so it's best over a colorful background or the page's background image:

{% raw %}
```aardvark
{% card variant="glass" icon="diamond" title="Frosted glass" %}
A translucent surface with a backdrop blur.
{% endCard %}
```
{% endraw %}

shown over a background image so the blur is visible:

<div style="background: url(/landscape.jpg) center / cover; padding: 2rem; border-radius: var(--mantine-radius-md);">
{% card variant="glass" icon="diamond" title="Frosted glass" %}
A translucent surface with a backdrop blur.
{% endCard %}
</div>

## Stat cards & accent bars

`variant="stat"` is a centered big-number layout for KPIs. `accentBar="top"` (or `"left"`)
adds a gradient accent edge.

{% raw %}
```aardvark
{% cardGrid cols=3 %}
{% card variant="stat" title="99.99%" subtitle="Uptime" icon="activity" accent="teal" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="<40ms" subtitle="p99 latency" icon="gauge" accent="blue" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="4.2M" subtitle="Builds / day" icon="rocket" accent="grape" align="center" accentBar="top" %}{% endCard %}
{% endCardGrid %}
```
{% endraw %}

{% cardGrid cols=3 %}
{% card variant="stat" title="99.99%" subtitle="Uptime" icon="activity" accent="teal" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="<40ms" subtitle="p99 latency" icon="gauge" accent="blue" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="4.2M" subtitle="Builds / day" icon="rocket" accent="grape" align="center" accentBar="top" %}{% endCard %}
{% endCardGrid %}

## The grid

`{% raw %}{% cardGrid %}{% endraw %}` lays cards out in a responsive grid that collapses to one
column on mobile. Use `cols=N` for a fixed wide-screen count, or `colsBase`/`colsSm`/`colsMd`/
`colsLg` for full control; `spacing` sets the gap.

## Options

`{% raw %}{% card %}{% endraw %}` attributes — set what you need, omit the rest:

| Attribute | Effect |
| --- | --- |
| `title` | Card heading. Also the accessible link name when `href` is set — give a link card a `title` so screen readers announce it meaningfully (a title-less link card falls back to "Open"). |
| `subtitle` | A dimmed line under the title (the label, for `stat` cards). |
| (body) | Markdown content below the heading. Leave empty for a bare/stat card. |
| `href` / `url` | Make the **whole card** a link. External URLs open in a new tab with an icon, and hovering the card shows the destination domain as a tooltip. |
| `icon` | A [Tabler](https://tabler.io/icons) name (`rocket`, `brand-github`), a Font Awesome class (`fa-solid fa-rocket`), an emoji, an image URL, or inline `<svg>`. |
| `image` | Cover image (top) — or the full background when `variant="image"`. |
| `alt` | Alt text for the image (use `alt=""` for a decorative image). |
| `variant` | `elevated` (default), `gradient`, `glass`, `image`, `stat`, or `plain` (a bare Mantine card — no shadow or hover lift). |
| `badge` / `badges` | `badge` is one label (any text); `badges` is a comma-separated list of labels (so an individual label can't contain a comma — use `badge` for one that does). |
| `badgeColor` / `badgeVariant` | Badge color and Mantine `Badge` variant (`light` default, `filled`, `outline`, `dot`, `transparent`, `white`, `gradient`). |
| `accent` / `color` | Accent color (a Mantine palette name, a theme color, or any CSS color) for the icon chip, accent bar, hover border, and CTA. |
| `gradient` | `"from,to,deg"` for `variant="gradient"` — or a single color (`gradient="indigo"`), or `gradientFrom`/`gradientTo`/`gradientDeg`. |
| `accentBar` | `top` or `left` — a gradient accent edge. |
| `cta` | A call-to-action **button** at the bottom. `ctaVariant="link"` renders a text link with an arrow instead. |
| `buttonVariant` | Mantine `Button` variant for the CTA button (`filled`, `light`, `outline`, `subtle`, `white`, `gradient`, …). Defaults to `white` on photo/gradient cards, `light` otherwise. |
| `align` | `left` (default) or `center` (suits icon-led and stat cards). |
| `shadow`, `radius`, `withBorder`, `padding` | Standard Mantine `Card` options. |
| `sheen=false` | Turn off the animated hover sheen on a link card. |
| `id`, `onclick` | An HTML `id` and a JS click handler, like `{% raw %}{% button %}{% endraw %}`. |

`{% raw %}{% cardGrid %}{% endraw %}` attributes:

| Attribute | Effect |
| --- | --- |
| `cols` | Columns on wide screens (collapses to 1 on mobile, 2 on tablet). Default `{base:1, sm:2, lg:3}`. |
| `colsBase`, `colsSm`, `colsMd`, `colsLg`, `colsXl` | Per-breakpoint column counts. |
| `spacing`, `verticalSpacing` | Gap between cards (a Mantine spacing token or CSS size). |

This tag ships as a built-in; when you need something different, define your **own**
[custom component](/authoring/custom-components/) and call it the same way.
