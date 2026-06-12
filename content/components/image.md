---
title: "Image"
description: "Built-in image handling — Mantine Image with a no-upscale default width, click-to-zoom lightbox, and percentage sizing. Plain Markdown images get it automatically."
---

# Image

Images render through Mantine's `Image` component with two extras aardvark adds on top:
they fill the content width **without** being upscaled past their natural size, and — when
there's more detail to reveal — clicking one opens it in a **dimmed full-image lightbox**.
This is **built in** — no setup.

## Plain Markdown images

A normal Markdown image on its own line gets the treatment automatically — write Markdown
as usual:

```markdown
![Mountains at dusk over a still lake](/landscape.jpg)
```

renders, live (it's wider than the column, so it's scaled down — click it to zoom):

![Mountains at dusk over a still lake](/landscape.jpg)

A large image fills the content column; a small one stays its natural size (no blurry
upscaling). Images written *inside a sentence* stay plain inline images.

## Tooltips and captions

An image's Markdown **title** — the quoted text after the URL — shows as a **tooltip** on
hover, falling back to the **alt text** when there's no title:

```markdown
![A still mountain lake at dusk](/landscape.jpg "Hover me — dusk over the lake")
```

renders, live (hover the image):

![A still mountain lake at dusk](/landscape.jpg "Hover me — dusk over the lake")

For a **visible caption** under the image, use the `{% raw %}{% image %}{% endraw %}` tag's
`caption` — it's opt-in, so plain Markdown images never grow one:

{% raw %}
```aardvark
{% image src='/landscape.jpg' alt='A still mountain lake at dusk' caption='Figure 1 — dusk over the lake' size='60%' align='center' %}
```
{% endraw %}

renders, live:

{% image src='/landscape.jpg' alt='A still mountain lake at dusk' caption='Figure 1 — dusk over the lake' size='60%' align='center' %}

The figure shrinks to the image, so the caption is exactly as wide as what it describes, and
`align` places it. The alt text still shows as a tooltip (unless it would just repeat the
caption).

## The `{% raw %}{% image %}{% endraw %}` tag

When you need options — a specific size, alignment, or any Mantine `Image` prop — use the
`{% raw %}{% image %}{% endraw %}` tag instead. It renders exactly the same component:

{% raw %}
```aardvark
{% image src='/landscape.jpg' alt='Mountains at dusk over a still lake' size='60%' align='center' %}
```
{% endraw %}

renders, live:

{% image src='/landscape.jpg' alt='Mountains at dusk over a still lake' size='60%' align='center' %}

## Options

Omit any option to take its default.

| Param | Effect |
| --- | --- |
| `src` | Image URL (required). |
| `alt` | Alternative text. Shows as a hover tooltip and names the lightbox dialog for screen readers. |
| `caption` | Visible figure caption shown below the image. Opt-in — omit it for no caption. |
| `size` | Scale the image to a percentage of the content width, e.g. `50%`. Aspect ratio is preserved. Defaults to natural size, capped to the column. |
| `align` | `left` (default), `center`, or `right` — positions a scaled image. |
| `zoom` | `true` (default) opens a lightbox on click — but only while the image is scaled down; one already at full size isn't clickable. `false` disables it entirely. |
| `fit` | `object-fit`: `cover` (default), `contain`, `fill`, `none`, `scale-down`. |
| `radius` | Rounded corners — `xs`–`xl` or any CSS value. |
| `fallbackSrc` | Image shown if `src` fails to load. |
| `loading` | `lazy` to defer offscreen images. |
| `srcSet` / `sizes` | Responsive sources — passed straight to the underlying `<img>`. |
| `bd` | Border, e.g. `1px solid gray`. |
| `bg` | Background color (shows through a transparent image). |
| `opacity` | Image opacity, e.g. `0.8`. |
| `m` / `p` / `w` / `h` / `maw` / … | The Mantine [spacing & sizing](/components/raw/) props. |

For anything beyond these — event handlers like `onError`, or arbitrary props — drop to
the raw Mantine component with `{% raw %}{% component('Image', …) %}{% endraw %}`.

## Sizing

`size` is a percentage of the content column and preserves the aspect ratio. Pair it with
`align` to place a smaller image:

{% raw %}
```aardvark
{% image src='/landscape.jpg' size='35%' align='left' %}
{% image src='/landscape.jpg' size='35%' align='center' %}
```
{% endraw %}

{% image src='/landscape.jpg' size='35%' align='left' %}
{% image src='/landscape.jpg' size='35%' align='center' %}

## Disabling zoom

Set `zoom=false` for an image that shouldn't open a lightbox even while it's scaled down
(decorative art, or a diagram you don't want enlarged):

{% raw %}
```aardvark
{% image src='/landscape.jpg' size='40%' zoom=false %}
```
{% endraw %}

{% image src='/landscape.jpg' size='40%' zoom=false %}

## Full-size images aren't clickable

Zoom is only offered when the page is showing the image *smaller* than it really is — a
lightbox would have nothing more to reveal otherwise. An image already at its natural size
stays static: no zoom cursor, no lightbox. (Resize the window narrower and a large image
becomes scaled-down, and clickable again.)

{% raw %}
```aardvark
{% image src='/logo-light.svg' alt='The aardvark logo' %}
```
{% endraw %}

{% image src='/logo-light.svg' alt='The aardvark logo' %}
