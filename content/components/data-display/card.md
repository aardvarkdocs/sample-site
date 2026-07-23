---
title: "Card"
description: "The built-in card tag — flashy content cards with icons, cover and background images, gradient/glass/stat variants, whole-card outbound links, and a responsive grid. Usage, options, and live examples."
---

# Card

A **built-in** tag built from Mantine's `Card` (plus `Image`, `BackgroundImage`, `Badge`, and
`ThemeIcon`) behind one tag pair. One card does pretty much anything a card can: a title and a
**Markdown** body, an icon, a cover or full-bleed background image, badges, an accent color,
gradient/glass/stat looks, and a whole-card outbound link. Wrap a set of them in
`{% raw %}{% cardGrid %}{% endraw %}` for a responsive grid. Use it as
`{% raw %}{% card %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets)
via `component('aardvark', 'card', …)` (and `component('aardvark', 'cardGrid', …)`).

Cards are **flashy by default** — hover lift, cover-image zoom, an animated sheen on link cards,
accent borders — and all of it is reduced-motion-safe and looks right in light and dark.

## Demonstrations

### Basic card

A title and a Markdown body. Standalone, a card is a full-width block:

{% card title="What is aardvark?" %}
A documentation-focused static site generator — **Markdown in, static HTML out**, with
interactive [Mantine](https://mantine.dev) islands.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="What is aardvark?" %}
A documentation-focused static site generator — **Markdown in, static HTML out**, with
interactive [Mantine](https://mantine.dev) islands.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', title='What is aardvark?',
          children='A documentation-focused static site generator — **Markdown in, '
                   'static HTML out**, with interactive [Mantine](https://mantine.dev) islands.')
```
{% endAccordionSection %}
{% endAccordion %}

### Icons

`icon="…"` takes any **[Tabler icon](https://tabler.io/icons)** name (kebab-case, e.g. `rocket`,
`brand-github`, `bolt`). Tabler icons are **lazy-loaded** — only the icons a page actually uses
are fetched from a CDN at view time, so the full ~5,800-icon library is available without
bloating the page. `icon=` also accepts a **Font Awesome** class (`icon="fa-solid fa-rocket"`,
`icon="fab fa-github"` — needs `theme.fontawesome: true`), an emoji, an image URL, or inline
`<svg>`. `accent="…"` colors the icon chip, accent bar, hover border, and CTA.

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

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
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
Browse the icon set at [tabler.io/icons](https://tabler.io/icons).
{% endCard %}
{% endCardGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cards = component('aardvark', 'card', title='Fast builds', icon='bolt', accent='yellow',
                  children='Incremental Markdown rendering and one esbuild pass.')
cards += component('aardvark', 'card', title='Secure by default', icon='shield', accent='teal',
                   children='Author-trusted, but hardened — escaped props, sanitized links.')
cards += component('aardvark', 'card', title='Open source', icon='brand-github', accent='grape',
                   children='Browse the icon set at [tabler.io/icons](https://tabler.io/icons).')
page.print(component('aardvark', 'cardGrid', children=cards))
```
{% endAccordionSection %}
{% endAccordion %}

### Link cards

Add `href` and the **whole card** becomes a link (with a hover lift and an animated sheen).
External URLs open in a new tab and get an external-link icon automatically; internal links just
navigate. A `cta` adds a **button** at the bottom (use `ctaVariant="link"` for a plain text link
with an arrow instead). `badge`/`badges` work on any card.

{% cardGrid %}
{% card title="Quickstart" icon="rocket" badge="Popular" badgeColor="grape" href="/docs/#quickstart" cta="Get going" %}
Build your first site in a minute.
{% endCard %}
{% card title="Components" icon="components" href="/components/" cta="Browse" %}
Every Mantine component, callable from Markdown.
{% endCard %}
{% card title="Mantine" icon="fab fa-react" href="https://mantine.dev" cta="Visit" %}
The React component library under the hood.
{% endCard %}
{% endCardGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% cardGrid %}
{% card title="Quickstart" icon="rocket" badge="Popular" badgeColor="grape" href="/docs/#quickstart" cta="Get going" %}
Build your first site in a minute.
{% endCard %}
{% card title="Components" icon="components" href="/components/" cta="Browse" %}
Every Mantine component, callable from Markdown.
{% endCard %}
{% card title="Mantine" icon="fab fa-react" href="https://mantine.dev" cta="Visit" %}
The React component library under the hood.
{% endCard %}
{% endCardGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cards = component('aardvark', 'card', title='Quickstart', icon='rocket', badge='Popular',
                  badgeColor='grape', href='/docs/#quickstart', cta='Get going',
                  children='Build your first site in a minute.')
cards += component('aardvark', 'card', title='Components', icon='components',
                   href='/components/', cta='Browse',
                   children='Every Mantine component, callable from Markdown.')
page.print(component('aardvark', 'cardGrid', children=cards))
```
{% endAccordionSection %}
{% endAccordion %}

### Cover images

`image="…"` puts a full-bleed cover image at the top (it zooms on hover for link cards). Pair it
with `badge` for a label, and `alt` for accessibility (`alt=""` for a purely decorative image):

{% cardGrid colsBase=1 colsSm=2 %}
{% card title="Theming" image="/img/sample-landscape.svg" alt="" badge="Guide" href="/components/" %}
Colors, fonts, and layout — make it yours.
{% endCard %}
{% card title="Image" image="/landscape.jpg" alt="" badge="New" badgeColor="grape" href="/components/data-display/image/" %}
Zoom into any figure with a click-to-open lightbox.
{% endCard %}
{% endCardGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% cardGrid colsBase=1 colsSm=2 %}
{% card title="Theming" image="/img/sample-landscape.svg" alt="" badge="Guide" href="/components/" %}
Colors, fonts, and layout — make it yours.
{% endCard %}
{% card title="Image" image="/landscape.jpg" alt="" badge="New" badgeColor="grape" href="/components/data-display/image/" %}
Zoom into any figure with a click-to-open lightbox.
{% endCard %}
{% endCardGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
cards = component('aardvark', 'card', title='Theming', image='/img/sample-landscape.svg',
                  alt='', badge='Guide', href='/components/',
                  children='Colors, fonts, and layout — make it yours.')
cards += component('aardvark', 'card', title='Image', image='/landscape.jpg', alt='',
                   badge='New', badgeColor='grape', href='/components/data-display/image/',
                   children='Zoom into any figure with a click-to-open lightbox.')
page.print(component('aardvark', 'cardGrid', colsBase=1, colsSm=2, children=cards))
```
{% endAccordionSection %}
{% endAccordion %}

### Background-image cards

`variant="image"` makes the image the **full card background**, with the text laid over it. A
gradient scrim keeps the title and body readable on any photo (WCAG AA), in both color schemes:

{% card variant="image" image="/landscape.jpg" alt="" title="Deploy anywhere" cta="Ship it" href="/docs/#quickstart" %}
Build to static HTML and host it anywhere — a full-bleed hero with a readable scrim.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card variant="image" image="/landscape.jpg" alt="" title="Deploy anywhere" cta="Ship it" href="/docs/#quickstart" %}
Build to static HTML and host it anywhere — a full-bleed hero with a readable scrim.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', variant='image', image='/landscape.jpg', alt='',
          title='Deploy anywhere', cta='Ship it', href='/docs/#quickstart',
          children='Build to static HTML and host it anywhere — a full-bleed hero '
                   'with a readable scrim.')
```
{% endAccordionSection %}
{% endAccordion %}

### Gradient and glass

`variant="gradient"` paints the card with a gradient (derived from the theme accent, or set
explicitly with `gradient="from,to,deg"`):

{% card variant="gradient" gradient="indigo,cyan,135" icon="sparkles" title="Pro plan" cta="Upgrade" href="/docs/#quickstart" %}
Priority support and unlimited seats.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card variant="gradient" gradient="indigo,cyan,135" icon="sparkles" title="Pro plan" cta="Upgrade" href="/docs/#quickstart" %}
Priority support and unlimited seats.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', variant='gradient', gradient='indigo,cyan,135', icon='sparkles',
          title='Pro plan', cta='Upgrade', href='/docs/#quickstart',
          children='Priority support and unlimited seats.')
```
{% endAccordionSection %}
{% endAccordion %}

`variant="glass"` is a translucent, frosted surface — its **backdrop blur** shows whatever sits
behind it, so it's best over a colorful background or the page's background image (shown here over
a background image so the blur is visible):

<div style="background: url(/landscape.jpg) center / cover; padding: 2rem; border-radius: var(--mantine-radius-md);">
{% card variant="glass" icon="diamond" title="Frosted glass" %}
A translucent surface with a backdrop blur.
{% endCard %}
</div>

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card variant="glass" icon="diamond" title="Frosted glass" %}
A translucent surface with a backdrop blur.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', variant='glass', icon='diamond', title='Frosted glass',
          children='A translucent surface with a backdrop blur.')
```
{% endAccordionSection %}
{% endAccordion %}

### Stat cards and accent bars

`variant="stat"` is a centered big-number layout for KPIs (the `title` is the number, the
`subtitle` is the label). `accentBar="top"` (or `"left"`) adds a gradient accent edge:

{% cardGrid cols=3 %}
{% card variant="stat" title="99.99%" subtitle="Uptime" icon="activity" accent="teal" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="<40ms" subtitle="p99 latency" icon="gauge" accent="blue" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="4.2M" subtitle="Builds / day" icon="rocket" accent="grape" align="center" accentBar="top" %}{% endCard %}
{% endCardGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% cardGrid cols=3 %}
{% card variant="stat" title="99.99%" subtitle="Uptime" icon="activity" accent="teal" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="<40ms" subtitle="p99 latency" icon="gauge" accent="blue" align="center" accentBar="top" %}{% endCard %}
{% card variant="stat" title="4.2M" subtitle="Builds / day" icon="rocket" accent="grape" align="center" accentBar="top" %}{% endCard %}
{% endCardGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
stats = [('99.99%', 'Uptime', 'activity', 'teal'),
         ('<40ms', 'p99 latency', 'gauge', 'blue'),
         ('4.2M', 'Builds / day', 'rocket', 'grape')]
cards = ''
for title, subtitle, icon, accent in stats:
    cards += component('aardvark', 'card', variant='stat', title=title, subtitle=subtitle,
                       icon=icon, accent=accent, align='center', accentBar='top')
page.print(component('aardvark', 'cardGrid', cols=3, children=cards))
```
{% endAccordionSection %}
{% endAccordion %}

### The grid

`{% raw %}{% cardGrid %}{% endraw %}` lays cards out in a responsive grid that collapses to one
column on mobile. Use `cols=N` for a fixed wide-screen count, or `colsBase`/`colsSm`/`colsMd`/
`colsLg` for full control; `spacing` sets the gap.

### From a loop or a data file

A `{% raw %}{% card %}{% endraw %}` tag is expanded as the page is scanned, so it can't be written
*inside* a `{% raw %}{% %}{% endraw %}` `for` loop. To generate cards from a [data
file](/authoring/templating/) (or any list), use the Python form —
`component('aardvark', 'card', …)` and `component('aardvark', 'cardGrid', …)` — which return the
same markup the tags do (there's one implementation behind both). Keyword arguments are the same
attributes you'd write on the tag; `children` is the body:

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
{% raw %}
```aardvark
{%
cards = ''
for item in data.products.items:
    cards += component('aardvark', 'card', icon=item.icon, title=item.name, subtitle=item.blurb,
                       badge='$' + str(item.price), cta='Buy now')
page.print(component('aardvark', 'cardGrid', cols=3, children=cards))
%}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

The [component libraries](/components/extras/component-libraries/) page builds a small storefront
exactly this way — each card wraps a live Stripe element, all driven from `data/products.yaml`.

## With other components

A card body is full Markdown, so it holds any other component — here a {% raw %}{% badge %}{% endraw %}
and an {% raw %}{% icon %}{% endraw %} ride inside the body, and an {% raw %}{% image %}{% endraw %}
sits beneath the grid:

{% cardGrid colsBase=1 colsSm=2 %}
{% card title="Status" icon="server" accent="teal" %}
All systems {% icon "circle-check" color="green" %} {% badge color='green' variant='light' %}Operational{% endBadge %}
{% endCard %}
{% card title="Release" icon="package" accent="grape" %}
v2.0 {% badge color='grape' %}New{% endBadge %} ships today.
{% endCard %}
{% endCardGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% cardGrid colsBase=1 colsSm=2 %}
{% card title="Status" icon="server" accent="teal" %}
All systems {% icon "circle-check" color="green" %} {% badge color='green' variant='light' %}Operational{% endBadge %}
{% endCard %}
{% card title="Release" icon="package" accent="grape" %}
v2.0 {% badge color='grape' %}New{% endBadge %} ships today.
{% endCard %}
{% endCardGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body1 = ("All systems " + component('aardvark', 'icon', 'circle-check', color='green')
         + " " + component('aardvark', 'badge', color='green', variant='light', children='Operational'))
body2 = "v2.0 " + component('aardvark', 'badge', color='grape', children='New') + " ships today."
cards = component('aardvark', 'card', title='Status', icon='server', accent='teal', children=body1)
cards += component('aardvark', 'card', title='Release', icon='package', accent='grape', children=body2)
page.print(component('aardvark', 'cardGrid', colsBase=1, colsSm=2, children=cards))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

### `{% raw %}{% card %}{% endraw %}`

Set what you need, omit the rest.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | string | Card heading. Also the accessible link name when `href` is set — give a link card a `title` so screen readers announce it meaningfully (a title-less link card falls back to "Open"). |
| `subtitle` | string | A dimmed line under the title (the label, for `stat` cards). |
| (body) | Markdown | Content below the heading. Leave empty for a bare/stat card. |
| `href` / `url` | URL | Make the **whole card** a link. External URLs open in a new tab with an icon, and hovering the card shows the destination domain as a tooltip. (`url` is used only when `href` is absent.) |
| `icon` | a [Tabler](https://tabler.io/icons) name (`rocket`, `brand-github`), a Font Awesome class (`fa-solid fa-rocket`), an emoji, an image URL, or inline `<svg>` | The icon chip. |
| `image` | image URL | Cover image (top) — or the full background when `variant="image"`. |
| `alt` | string | Alt text for the image (use `alt=""` for a decorative image). |
| `variant` | `elevated` (default), `gradient`, `glass`, `image`, `stat`, `plain` | Card style. `plain` is a bare Mantine card — no shadow or hover lift. |
| `badge` | string | One badge label (any text, including a comma). |
| `badges` | comma-separated string | Several badge labels (so an individual label can't contain a comma — use `badge` for one that does). |
| `badgeColor` | any theme/CSS color | Badge color. |
| `badgeVariant` | `light` (default), `filled`, `outline`, `dot`, `transparent`, `white`, `gradient` | Mantine `Badge` variant. |
| `accent` / `color` | a Mantine palette name, a theme color, or any CSS color | Accent color for the icon chip, accent bar, hover border, and CTA. |
| `gradient` | `"from,to,deg"`, a single color (`"indigo"`), or set via `gradientFrom`/`gradientTo`/`gradientDeg` | Gradient stops for `variant="gradient"`. |
| `accentBar` | `top`, `left` | A gradient accent edge. |
| `cta` | string | A call-to-action **button** at the bottom. |
| `ctaVariant` | `link` | Render the CTA as a text link with an arrow instead of a button. |
| `buttonVariant` | `filled`, `light`, `outline`, `subtle`, `white`, `gradient`, … | Mantine `Button` variant for the CTA button. Defaults to `white` on photo/gradient cards, `light` otherwise. |
| `align` | `left` (default), `center` | Content alignment (`center` suits icon-led and stat cards). |
| `shadow` | Mantine shadow token (`xs`–`xl`) | Card shadow. |
| `radius` | `xs`–`xl` or any CSS value | Corner rounding. |
| `withBorder` | bool flag | Draw a border. |
| `padding` | Mantine spacing token or CSS size | Inner padding. |
| `sheen` | bool flag (`sheen=false`) | Turn off the animated hover sheen on a link card. |
| `id` | string | An HTML `id`. |
| `onclick` | JS expression | A JS click handler (a raw HTML attribute). |

### `{% raw %}{% cardGrid %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `cols` | integer | Columns on wide screens (collapses to 1 on mobile, 2 on tablet). Default `{base:1, sm:2, lg:3}`. |
| `colsBase` `colsSm` `colsMd` `colsLg` `colsXl` | integer | Per-breakpoint column counts. |
| `spacing` | Mantine spacing token or CSS size | Horizontal gap between cards. |
| `verticalSpacing` | Mantine spacing token or CSS size | Vertical gap between cards. |

This tag ships as a built-in; when you need something different, define your **own**
[custom component](/authoring/custom-components/) and call it the same way.
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Card"]` — or through the Mantine Styles API classes (`.mantine-Card-root` and its inner parts):

{% raw %}
```css
/* Every rendered Card carries this island marker */
[data-aardvark-island="Card"] { }

/* Mantine Styles API class on the root element */
.mantine-Card-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered card.
`card` also exposes a dedicated `onclick` shortcut for the common click case; in Python it
rides this same channel as `attr={'onclick': …}`.

{% card title="What is aardvark?" onclick="alert(this.innerText)" %}
A documentation-focused static site generator.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="What is aardvark?" onclick="alert(this.innerText)" %}
A documentation-focused static site generator.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', title='What is aardvark?',
          children='A documentation-focused static site generator.',
          attr={'onclick': 'alert(this.innerText)'})
```
{% endAccordionSection %}
{% endAccordion %}

For any other attribute — `data-*`, ARIA, analytics hooks — pass the `attr={…}` dict directly:

{% card title="Pricing" attr={'data-analytics': 'pricing-card', 'aria-label': 'Pricing card'} %}
Three tiers, no surprises.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="Pricing" attr={'data-analytics': 'pricing-card', 'aria-label': 'Pricing card'} %}
Three tiers, no surprises.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', title='Pricing', children='Three tiers, no surprises.',
          attr={'data-analytics': 'pricing-card', 'aria-label': 'Pricing card'})
```
{% endAccordionSection %}
{% endAccordion %}
