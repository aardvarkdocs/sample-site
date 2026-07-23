---
title: "Icon"
description: "The built-in icon tag — a Mantine ThemeIcon you can drop inline in prose or a heading. Render a Tabler glyph, a Font Awesome glyph, an image, or an emoji, with the full ThemeIcon surface (variant, color, size, radius, gradient) and a tooltip on hover."
---

# Icon

A **built-in** inline tag for dropping an icon *inside* text — a sentence, a list item, or a
heading. It renders a Mantine ThemeIcon, so it carries the whole ThemeIcon surface — `variant`,
`color`, `size`, `radius`, `gradient` — while still flowing inline. By default it's a bare glyph
that **inherits the surrounding text's size and color**; add a `variant`/`color` to turn it into
a Mantine icon chip. Use it as `{% raw %}{% icon "rocket" %}{% endraw %}` in Markdown, or call it
from Python logic (loops, snippets) via `component('aardvark', 'icon', 'rocket', …)`.

The first argument is the icon, quoted. It can be a **[Tabler](https://tabler.io/icons) name**
(a bare lowercase name like `rocket` or `brand-github`), a **[Font Awesome](https://fontawesome.com/icons)
class** (`fa-solid fa-rocket`, `fab fa-github`), a path/URL to an **SVG or image file**
(`/icons/folder.svg`), or an **emoji** (`🚀`).

## Demonstrations

### Inline glyphs

A bare name renders an inline glyph that inherits the surrounding text's size and color:

Launch it {% icon "rocket" %} when you're ready, then star it {% icon "star" %} on GitHub {% icon "brand-github" %}.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Launch it {% icon "rocket" %} when you're ready, then star it {% icon "star" %} on GitHub {% icon "brand-github" %}.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
page.print("Launch it " + component('aardvark', 'icon', 'rocket')
           + " when you're ready, then star it " + component('aardvark', 'icon', 'star')
           + " on GitHub " + component('aardvark', 'icon', 'brand-github') + ".")
```
{% endAccordionSection %}
{% endAccordion %}

### Variants and colors

Pass any Mantine ThemeIcon `variant` — `filled`, `light`, `outline`, `transparent` (the
default), `white`, `default`, or `gradient` — with a `color` to turn the bare glyph into a
chip. A gradient `variant` reads `gradientFrom`/`gradientTo`/`gradientDeg`:

{% icon "rocket" variant="filled" color="blue" %} {% icon "heart" variant="light" color="pink" %} {% icon "star" variant="outline" color="yellow" %} {% icon "bell" variant="white" color="grape" %} {% icon "flame" variant="gradient" gradientFrom="orange" gradientTo="red" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% icon "rocket" variant="filled" color="blue" %}
{% icon "heart" variant="light" color="pink" %}
{% icon "star" variant="outline" color="yellow" %}
{% icon "bell" variant="white" color="grape" %}
{% icon "flame" variant="gradient" gradientFrom="orange" gradientTo="red" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'icon', 'rocket', variant='filled', color='blue')
component('aardvark', 'icon', 'heart', variant='light', color='pink')
component('aardvark', 'icon', 'star', variant='outline', color='yellow')
component('aardvark', 'icon', 'bell', variant='white', color='grape')
component('aardvark', 'icon', 'flame', variant='gradient', gradientFrom='orange', gradientTo='red')
```
{% endAccordionSection %}
{% endAccordion %}

`color` is a [Mantine color](https://mantine.dev/theming/colors/) name (`blue`, `pink`, …) or
any CSS color. `autoContrast` flips the glyph between light/dark for legibility on its
background.

### Size and radius

`size` takes a Mantine size (`xs`–`xl`) or a number of pixels; `radius` takes a Mantine radius
(`xs`–`xl`) or a number:

{% icon "rocket" variant="filled" color="blue" size="xs" %} {% icon "rocket" variant="filled" color="blue" size="sm" %} {% icon "rocket" variant="filled" color="blue" size="lg" %} {% icon "rocket" variant="filled" color="blue" size="xl" radius="xl" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% icon "rocket" variant="filled" color="blue" size="xs" %}
{% icon "rocket" variant="filled" color="blue" size="sm" %}
{% icon "rocket" variant="filled" color="blue" size="lg" %}
{% icon "rocket" variant="filled" color="blue" size="xl" radius="xl" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for s in ('xs', 'sm', 'lg', 'xl'):
    page.print(component('aardvark', 'icon', 'rocket', variant='filled', color='blue', size=s))
```
{% endAccordionSection %}
{% endAccordion %}

With **no `size`**, the icon is `1em` and tracks the surrounding text — so a bare icon grows
with whatever it sits in, including headings:

### Ship faster {% icon "rocket" %}

#### Built for teams {% icon "users" %}

### Nudging and spacing

A glyph sometimes sits a hair high or low for your text, or you want a little space around it.
Use Mantine's margin/padding [style props](https://mantine.dev/styles/style-props/) — `mt`/`mb`/`ml`/`mr`
(or the `mx`/`my`/`m` shorthands) for margin, and `pt`/`pb`/… (or `px`/`py`/`p`) for padding. A
bare number is **pixels**, and negatives nudge:

Lift it {% icon "star" mt=-2 %} up, drop it {% icon "star" mt=2 %} down, or space it {% icon "star" mx=8 %} out.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Lift it {% icon "star" mt=-2 %} up, drop it {% icon "star" mt=2 %} down, or space it {% icon "star" mx=8 %} out.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
page.print("Lift it " + component('aardvark', 'icon', 'star', mt=-2)
           + " up, drop it " + component('aardvark', 'icon', 'star', mt=2)
           + " down, or space it " + component('aardvark', 'icon', 'star', mx=8) + " out.")
```
{% endAccordionSection %}
{% endAccordion %}

A named Mantine spacing works too (`mt="xs"`), and these apply to every variant.

### Tooltip and accessible name

Give an icon a `label` and hovering (or focusing) it shows a Mantine **Tooltip** with that
text. The label is also the icon's accessible name (it sets `aria-label`) and makes the icon
keyboard-focusable, so the tooltip works without a mouse and a screen-reader user hears the name
too. Use it when a **standalone** icon *is* the meaning and nothing adjacent already says it:

{% icon "brand-github" label="View on GitHub" %} {% icon "rocket" variant="filled" color="blue" label="Deploy" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% icon "brand-github" label="View on GitHub" %} {% icon "rocket" variant="filled" color="blue" label="Deploy" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'icon', 'brand-github', label='View on GitHub')
component('aardvark', 'icon', 'rocket', variant='filled', color='blue', label='Deploy')
```
{% endAccordionSection %}
{% endAccordion %}

Icons without a `label` are decorative — they're hidden from assistive tech (`aria-hidden`), and
the surrounding text carries the meaning.

**Don't `label` an icon that's the content of a link or button.** A labelled icon is its own
keyboard focus stop, so wrapping one in an `<a>`/`<button>` makes a *second* tab stop and a
doubled screen-reader announcement. Leave the icon decorative (no `label`) and put the accessible
name on the **outer** element instead — name the link, not the icon:

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
<a href="https://github.com/…" aria-label="View on GitHub">{% icon "brand-github" %}</a>
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Tabler, Font Awesome, image, and emoji

A **bare name** is a [Tabler](https://tabler.io/icons) icon — there are over 5,800. Tabler ships
an **outline** style by default and a **filled** style for many icons; add the `filled` flag for
the filled variant. A **[Font Awesome](https://fontawesome.com/icons)** glyph needs its **full
class** (the style class `fa-solid`/`fa-regular`/`fab`/… plus the icon class) and the FA
stylesheet (`theme.fontawesome: true` in `aardvark.config.yaml`, which this site sets). A path
or URL ending in `.svg`/`.png`/`.webp`/… renders as an inline `<img>`, and a non-ASCII glyph
renders as an emoji:

{% icon "heart" %} outline, {% icon "heart" filled %} filled — {% icon "fa-solid fa-rocket" %} {% icon "fab fa-github" %} {% icon "fa-regular fa-star" %} — open the {% icon "/icons/folder.svg" %} folder, or just {% icon "🚀" %} ship it.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% icon "heart" %} outline, {% icon "heart" filled %} filled
{% icon "fa-solid fa-rocket" %} {% icon "fab fa-github" %} {% icon "fa-regular fa-star" %}
{% icon "/icons/folder.svg" %} {% icon "🚀" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'icon', 'heart')             # Tabler outline
component('aardvark', 'icon', 'heart', filled=True) # Tabler filled
component('aardvark', 'icon', 'fa-solid fa-rocket') # Font Awesome
component('aardvark', 'icon', '/icons/folder.svg')  # image
component('aardvark', 'icon', '🚀')                 # emoji
```
{% endAccordionSection %}
{% endAccordion %}

A bare `rocket` is the **Tabler** `rocket`, so Font Awesome always needs its `fa-…` class. Image
and emoji icons keep their own colors — the `color` override tints a Tabler or Font Awesome glyph
only.

## With other components

An icon flows inline inside any other component — here it leads a {% raw %}{% badge %}{% endraw %}
and labels a {% raw %}{% card %}{% endraw %}:

{% badge color='green' variant='light' leftSection='✓' %}Verified{% endBadge %} — status {% icon "circle-check" color="green" label="All systems go" %}

{% card title="Fast builds" icon="bolt" accent="yellow" %}
The icon chip up top is the same engine — `{% raw %}{% card %}{% endraw %}` takes an `icon=`.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% badge color='green' variant='light' leftSection='✓' %}Verified{% endBadge %} — status {% icon "circle-check" color="green" label="All systems go" %}

{% card title="Fast builds" icon="bolt" accent="yellow" %}
The icon chip up top is the same engine — {% card %} takes an icon=.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
page.print(component('aardvark', 'badge', color='green', variant='light',
                     leftSection='✓', children='Verified')
           + " — status "
           + component('aardvark', 'icon', 'circle-check', color='green', label='All systems go'))
page.print(component('aardvark', 'card', title='Fast builds', icon='bolt', accent='yellow',
                     children='The icon chip up top is the same engine.'))
```
{% endAccordionSection %}
{% endAccordion %}

## Loading and the CDN

The `{% raw %}{% icon %}{% endraw %}` tag is a Mantine island, so it needs the islands bundle (which this site builds). **Tabler**
glyphs add one more step: the first time a page uses a Tabler icon, aardvark fetches its SVG from
a pinned [jsDelivr](https://www.jsdelivr.com/) CDN (`cdn.jsdelivr.net`), caches it per name, and
injects it inline — only the icons a page actually uses are fetched.

Because that fetch is client-side, a **Tabler** glyph renders only after the page's JavaScript
runs: the build's server-side prerender bakes an empty reserved box (no layout shift), and the
glyph pops in on mount. **Font Awesome, image, and emoji** icons are baked into the prerendered
HTML and show with no JavaScript. So a site that must render icons without JS (or before
hydration) should prefer Font Awesome or image icons over Tabler.

Navigation `icon:` and `heading-icon:` values are latency-sensitive page chrome, so Aardvark
special-cases them: their SVGs are baked into the initial HTML and paint immediately — from the
outline set bundled with aardvark (so it works even with no local `@tabler/icons` install, e.g. a
`pip`/binary site), or from the installed package when it matches a pinned `theme.iconVersion`. A
custom `theme.iconCdn` stays authoritative — navigation keeps its runtime loader and `vark build`
emits no warning. A pinned `theme.iconVersion` that's neither bundled nor installed also falls back to
the runtime loader, and there `vark build` warns which glyphs it couldn't bake.

If your site sets a **Content-Security-Policy**, allow the CDN origin in `connect-src` (the
fetch). To self-host the icons or pin a different release, set one of these in
`aardvark.config.yaml`:

- `theme.iconCdn` — a full `http(s)` base that serves `<base>/outline/<name>.svg` (and
  `<base>/filled/<name>.svg`);
- `theme.iconVersion` — a bare `X.Y.Z` to pin the default jsDelivr package version.

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| *(first arg)* | a **Tabler** name (`rocket`, `brand-github`), a **Font Awesome** class (`fa-solid fa-rocket`), an **image** path/URL (`/icons/logo.svg`), or an **emoji** | The icon. Must be quoted. A bare name is Tabler — Font Awesome needs its `fa-…` class. |
| `variant` | `filled`, `light`, `outline`, `transparent` (default), `white`, `default`, `gradient` | Mantine ThemeIcon variant. |
| `color` | a [Mantine color](https://mantine.dev/theming/colors/) name or any CSS color | Tints the glyph (and the chip for non-transparent variants); image/emoji keep their own colors. |
| `size` | a Mantine size (`xs`–`xl`) or a number of pixels | Icon size. With no `size`, the icon is `1em` and tracks the surrounding text. |
| `radius` | a Mantine radius (`xs`–`xl`) or a number | The chip's corner rounding. |
| `mt` `mb` `ml` `mr` `mx` `my` `m` / `pt` … `p` | a bare number (pixels, negatives nudge) or a Mantine size (`mx="xs"`) | Mantine [margin/padding style props](https://mantine.dev/styles/style-props/) to nudge/space a glyph. |
| `gradientFrom` / `gradientTo` / `gradientDeg` | colors / integer degrees | For `variant="gradient"`, compose the `{from, to, deg}`. Omit to use the theme's default gradient. |
| `autoContrast` | bool flag | Flip the glyph to light/dark for legibility against its background. |
| `filled` | bool flag | Use Tabler's **filled** variant instead of the default outline (Tabler icons only). |
| `label` | string | Show a Mantine **Tooltip** on hover/focus, name the icon for assistive tech (`aria-label`), and make it keyboard-focusable. For **standalone** icons only — for an icon inside a link/button, leave it decorative and name the outer element instead. Omit it for decorative icons, which are hidden from assistive tech. |

A bare name (no `fa-…` class, no file extension, ASCII) is read as a Tabler icon — if it isn't a
real Tabler name, the loader logs a console warning and leaves the slot empty, so check the name
at [tabler.io/icons](https://tabler.io/icons). Keep `{% raw %}{% icon %}{% endraw %}` on the same
line as adjacent text: an icon alone on its own line is treated as a block, not an inline glyph.
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Icon"]` — or through the Mantine Styles API classes (`.mantine-ThemeIcon-root` and its inner parts):

{% raw %}
```css
/* Every rendered Icon carries this island marker */
[data-aardvark-island="Icon"] { }

/* Mantine Styles API class on the root element */
.mantine-ThemeIcon-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks, or an inline
event handler — onto the rendered icon. (For the icon's own surface — `variant`, `color`,
`size`, `radius`, gradient, and `label` for its accessible name and hover tooltip — use the
documented props above.)

{% icon "rocket" variant="filled" color="blue" label="Deploy" attr={'data-analytics': 'deploy-icon'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% icon "rocket" variant="filled" color="blue" label="Deploy" attr={'data-analytics': 'deploy-icon'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'icon', 'rocket', variant='filled', color='blue', label='Deploy',
          attr={'data-analytics': 'deploy-icon'})
```
{% endAccordionSection %}
{% endAccordion %}
