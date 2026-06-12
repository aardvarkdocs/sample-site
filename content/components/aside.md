---
title: "Aside"
description: "The built-in aside tag — static callouts (admonitions) with a colored bar and a Markdown body. Usage, options, and live examples with source."
---

# Aside

`{% raw %}{% aside %}{% endraw %}` is a **built-in** tag for static callouts (or admonitions): a colored left bar, an optional bold title, and a **Markdown** body. There's no close button, because it's page content, not a toast — it stays put. Close the block with `{% raw %}{% endAside %}{% endraw %}` (capital `A`).

## Color

The `color` parameter tints the left bar. It defaults to `primary`; pass `secondary` or any theme color:

{% raw %}
```aardvark
{% aside title="This feature is subject to usage limits" color="secondary" %}
Refer to your subscription plan for details.
{% endAside %}
```
{% endraw %}

renders, live:

{% aside title="This feature is subject to usage limits" color="secondary" %}
Refer to your subscription plan for details.
{% endAside %}

Any theme color works. Here's `grape`, with no title:

{% aside color="grape" %}
No title here, just a colored bar.
{% endAside %}

## Title

The `title` parameter sets an optional bold heading. Omit it for a callout with just a colored bar (on the default `primary` color):

{% aside %}
This aside has no title.
{% endAside %}

## Markdown body

The block body renders as **Markdown**, so you can use bold text and lists:

{% aside title="Heads up" %}
The body supports **Markdown**, including:

- **bold** text
- bullet lists
{% endAside %}

## Parameters

| Parameter | Description | Default |
| --- | --- | --- |
| `title` | Optional bold heading. | — |
| `color` | Color for the left bar. Accepts `primary`, `secondary`, any theme color, or a CSS color. | `primary` |

## Override it

This aside ships as a built-in. To customize it, define your own `components/aside.md` with `name: aside` in your own `components/` directory and your version wins sitewide.
