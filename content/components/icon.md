---
title: "Icon"
description: "The built-in icon tag — a Mantine ThemeIcon you can drop inline in prose or a heading. Render a Tabler glyph, a Font Awesome glyph, an image, or an emoji, with the full ThemeIcon surface (variant, color, size, radius, gradient) and a tooltip on hover."
---

# Icon

A **built-in** inline tag for dropping an icon *inside* text — a sentence, a list item, or a
heading. It renders a Mantine [**ThemeIcon**](https://mantine.dev/core/theme-icon/), so it carries
ThemeIcon's whole surface — `variant`, `color`, `size`, `radius`, `gradient` — while still flowing
inline. By default it's a bare glyph that **inherits the surrounding text's size and color**, so it
matches its context; add a `variant`/`color` to turn it into a Mantine icon chip.

## Usage

The first argument is the icon, quoted. It can be:

- a **[Tabler](https://tabler.io/icons) icon name** — a bare lowercase name like `rocket` or
  `brand-github` (the default for a bare name);
- a **[Font Awesome](https://fontawesome.com/icons) class** — `fa-solid fa-rocket`, `fab fa-github`;
- a path/URL to an **SVG or image file** — `/icons/folder.svg`;
- an **emoji** — `🚀`.

{% raw %}
```aardvark
Launch it {% icon "rocket" %} when you're ready, then star it {% icon "star" %} on GitHub {% icon "brand-github" %}.
```
{% endraw %}

renders, live:

Launch it {% icon "rocket" %} when you're ready, then star it {% icon "star" %} on GitHub {% icon "brand-github" %}.

## Variants

Pass any Mantine ThemeIcon **`variant`** — `filled`, `light`, `outline`, `transparent` (the
default), `white`, `default`, or `gradient` — with a **`color`** to turn the bare glyph into a chip:

{% raw %}
```aardvark
{% icon "rocket" variant="filled" color="blue" %}
{% icon "heart" variant="light" color="pink" %}
{% icon "star" variant="outline" color="yellow" %}
{% icon "bell" variant="white" color="grape" %}
{% icon "flame" variant="gradient" gradientFrom="orange" gradientTo="red" %}
```
{% endraw %}

{% icon "rocket" variant="filled" color="blue" %}
{% icon "heart" variant="light" color="pink" %}
{% icon "star" variant="outline" color="yellow" %}
{% icon "bell" variant="white" color="grape" %}
{% icon "flame" variant="gradient" gradientFrom="orange" gradientTo="red" %}

`color` is a [Mantine color](https://mantine.dev/theming/colors/) name (`blue`, `pink`, …) or any
CSS color. A gradient `variant` reads `gradientFrom`/`gradientTo`/`gradientDeg`; omit them to use the
theme's default gradient. `autoContrast` flips the glyph between light/dark for legibility on its
background.

## Size and radius

**`size`** takes a Mantine size (`xs`–`xl`) or a number of pixels; **`radius`** takes a Mantine
radius (`xs`–`xl`) or a number:

{% raw %}
```aardvark
{% icon "rocket" variant="filled" color="blue" size="xs" %}
{% icon "rocket" variant="filled" color="blue" size="sm" %}
{% icon "rocket" variant="filled" color="blue" size="lg" %}
{% icon "rocket" variant="filled" color="blue" size="xl" radius="xl" %}
```
{% endraw %}

{% icon "rocket" variant="filled" color="blue" size="xs" %}
{% icon "rocket" variant="filled" color="blue" size="sm" %}
{% icon "rocket" variant="filled" color="blue" size="lg" %}
{% icon "rocket" variant="filled" color="blue" size="xl" radius="xl" %}

With **no `size`**, the icon is `1em` and tracks the surrounding text — so a bare
{% raw %}`{% icon %}`{% endraw %} grows with whatever it sits in, including headings:

### Ship faster {% icon "rocket" %}

#### Built for teams {% icon "users" %}

## Nudging and spacing

A glyph sometimes sits a hair high or low for your text, or you want a little space around it. Use
Mantine's margin/padding [**style props**](https://mantine.dev/styles/style-props/) — `mt`/`mb`/`ml`/`mr`
(or the `mx`/`my`/`m` shorthands) for margin, and `pt`/`pb`/… (or `px`/`py`/`p`) for padding. A bare
number is **pixels**, and negatives nudge:

{% raw %}
```aardvark
Lift it {% icon "star" mt=-2 %} up, drop it {% icon "star" mt=2 %} down, or space it {% icon "star" mx=8 %} out.
```
{% endraw %}

Lift it {% icon "star" mt=-2 %} up, drop it {% icon "star" mt=2 %} down, or space it {% icon "star" mx=8 %} out.

A named Mantine spacing works too (`mt="xs"`), and these apply to every variant.

## Tooltip on hover

Give an icon a **`label`** and hovering (or focusing) it shows a Mantine **Tooltip** with that text.
The label is also the icon's accessible name (it sets `aria-label`) and makes the icon
keyboard-focusable, so the tooltip works without a mouse and a screen-reader user hears the name too.
Use it when a **standalone** icon *is* the meaning and nothing adjacent already says it:

{% raw %}
```aardvark
{% icon "brand-github" label="View on GitHub" %} {% icon "rocket" variant="filled" color="blue" label="Deploy" %}
```
{% endraw %}

{% icon "brand-github" label="View on GitHub" %} {% icon "rocket" variant="filled" color="blue" label="Deploy" %}

Icons without a `label` are decorative — they're hidden from assistive tech (`aria-hidden`), and the
surrounding text carries the meaning.

**Don't `label` an icon that's the content of a link or button.** A labelled icon is its own keyboard
focus stop, so wrapping one in an `<a>`/`<button>` makes a *second* tab stop and a doubled
screen-reader announcement. Leave the icon decorative (no `label`) and put the accessible name on the
**outer** element instead — name the link, not the icon:

{% raw %}
```aardvark
<a href="https://github.com/…" aria-label="View on GitHub">{% icon "brand-github" %}</a>
```
{% endraw %}

## Tabler icons

A **bare name** is a [Tabler](https://tabler.io/icons) icon — there are over 5,800. Browse the set
at [tabler.io/icons](https://tabler.io/icons) and use the name exactly as it appears. Tabler ships
an **outline** style by default and a **filled** style for many icons; add the `filled` flag for the
filled variant:

{% raw %}
```aardvark
{% icon "heart" %} outline, {% icon "heart" filled %} filled — and {% icon "star" %} / {% icon "star" filled %}.
```
{% endraw %}

{% icon "heart" %} outline, {% icon "heart" filled %} filled — and {% icon "star" %} / {% icon "star" filled %}.

Tabler glyphs are **lazy-loaded**: each icon's SVG is fetched once from a pinned CDN the first time a
page uses it, then injected inline so it inherits the icon's color. (See
[Loading and the CDN](#loading-and-the-cdn).)

## Font Awesome icons

To use a [Font Awesome](https://fontawesome.com/icons) glyph, give its **full class** — the style
class (`fa-solid`, `fa-regular`, `fab`, …) plus the icon class:

{% raw %}
```aardvark
{% icon "fa-solid fa-rocket" %} {% icon "fab fa-github" %} {% icon "fa-regular fa-star" %}
```
{% endraw %}

{% icon "fa-solid fa-rocket" %} {% icon "fab fa-github" %} {% icon "fa-regular fa-star" %}

A bare `rocket` is the **Tabler** `rocket`, so Font Awesome always needs its `fa-…` class. Font
Awesome glyphs also need the FA stylesheet: set `theme.fontawesome: true` in `aardvark.config.yaml`
(this site does).

## Images and emoji

A path or URL ending in `.svg`/`.png`/`.webp`/… renders as an inline `<img>`, and a non-ASCII glyph
renders as an emoji — both boxed to the icon size:

{% raw %}
```aardvark
Open the {% icon "/icons/folder.svg" %} folder, or just {% icon "🚀" %} ship it.
```
{% endraw %}

Open the {% icon "/icons/folder.svg" %} folder, or just {% icon "🚀" %} ship it.

Image and emoji icons keep their own colors — the `color` override tints a Tabler or Font Awesome
glyph only.

## Loading and the CDN

The icon is a Mantine island, so it needs the islands bundle (which this site builds). **Tabler**
glyphs add one more step: the first time a page uses a Tabler icon, aardvark fetches its SVG from a
pinned [jsDelivr](https://www.jsdelivr.com/) CDN (`cdn.jsdelivr.net`), caches it per name, and
injects it inline — only the icons a page actually uses are fetched. This mirrors how the
{% raw %}`{% card %}`{% endraw %} and {% raw %}`{% map %}`{% endraw %} components load their assets.

Because that fetch is client-side, a **Tabler** glyph renders only after the page's JavaScript runs:
the build's server-side prerender bakes an empty reserved box (no layout shift), and the glyph pops
in on mount. **Font Awesome, image, and emoji** icons are baked into the prerendered HTML and show
with no JavaScript. So a site that must render icons without JS (or before hydration) should prefer
Font Awesome or image icons over Tabler.

If your site sets a **Content-Security-Policy**, allow the CDN origin in `connect-src` (the fetch).
To self-host the icons or pin a different release, set one of these in `aardvark.config.yaml` (both
are shared with {% raw %}`{% card %}`{% endraw %}):

- `theme.iconCdn` — a full `http(s)` base that serves `<base>/outline/<name>.svg` (and
  `<base>/filled/<name>.svg`);
- `theme.iconVersion` — a bare `X.Y.Z` to pin the default jsDelivr package version.

## Options

| Param | Effect |
| --- | --- |
| *(first arg)* | The icon: a **Tabler** name (`rocket`, `brand-github`), a **Font Awesome** class (`fa-solid fa-rocket`), an **image** path/URL (`/icons/logo.svg`), or an **emoji**. Must be quoted. A bare name is Tabler — Font Awesome needs its `fa-…` class. |
| `variant` | Mantine ThemeIcon variant: `filled`, `light`, `outline`, `transparent` (default), `white`, `default`, `gradient`. |
| `color` | A [Mantine color](https://mantine.dev/theming/colors/) name or any CSS color. Tints the glyph (and the chip for non-transparent variants); image/emoji keep their own colors. |
| `size` | A Mantine size (`xs`–`xl`) or a number of pixels. With no `size`, the icon is `1em` and tracks the surrounding text. |
| `radius` | A Mantine radius (`xs`–`xl`) or a number — the chip's corner rounding. |
| `mt` `mb` `ml` `mr` `mx` `my` `m` / `pt` … `p` | Mantine [margin/padding style props](https://mantine.dev/styles/style-props/) to nudge/space a glyph. A bare number is pixels and negatives nudge (`mt=-2` lifts it); a Mantine size (`mx="xs"`) works too. |
| `gradient` | For `variant="gradient"`: `gradientFrom`/`gradientTo`/`gradientDeg` compose the `{from, to, deg}`. Omit to use the theme's default gradient. |
| `autoContrast` | Flip the glyph to light/dark for legibility against its background. |
| `filled` | Use Tabler's **filled** variant instead of the default outline (Tabler icons only). |
| `label` | Show a Mantine **Tooltip** on hover/focus, name the icon for assistive tech (`aria-label`), and make it keyboard-focusable. For **standalone** icons only — for an icon inside a link/button, leave it decorative and name the outer element instead. Omit it for decorative icons, which are hidden from assistive tech. |

A bare name (no `fa-…` class, no file extension, ASCII) is read as a Tabler icon — if it isn't a
real Tabler name, the loader logs a console warning and leaves the slot empty, so check the name at
[tabler.io/icons](https://tabler.io/icons). Keep {% raw %}`{% icon %}`{% endraw %} on the same line
as adjacent text: an icon alone on its own line is treated as a block, not an inline glyph.
