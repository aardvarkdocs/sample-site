---
title: "Expandable"
description: "The built-in expandable tag — a single collapsible disclosure whose body is full Markdown. Hand-written <details>/<summary> is upgraded to the same widget."
---

# Expandable

A **built-in** tag for a single collapsible disclosure — one control, one panel.
It's built from Mantine's `Accordion` pieces: literally an
[accordion](/components/accordion/) with exactly one item. The body is ordinary
**Markdown** — headings, lists, code, links, even nested `component(...)` calls — and
renders as such.

Reach for `{% raw %}{% expandable %}{% endraw %}` when you want a lone "click to reveal"
panel; reach for the [accordion](/components/accordion/) when several sections should
share one open-at-a-time group.

## Usage

Wrap the body in `{% raw %}{% expandable title="…" %} … {% endExpandable %}{% endraw %}`:

{% raw %}
```aardvark
{% expandable title="Show the proof" %}
**Markdown content** renders here.

- Lists work
- So does `code`
{% endExpandable %}
```
{% endraw %}

renders, live:

{% expandable title="Show the proof" %}
**Markdown content** renders here.

- Lists work
- So does `code`
{% endExpandable %}

The `title` is the clickable control; everything between the tags is its panel body.

## Options

Attributes on the open tag pass straight through as Mantine `Accordion` props. A bare
attribute (no `=`) is a boolean flag — `open` means start expanded.

| Attribute | Effect |
| --- | --- |
| `title="…"` | The control label (defaults to "Details"). |
| `open` | Start expanded instead of collapsed. |

Start one open with `open`:

{% raw %}
```aardvark
{% expandable title="Already open" open %}
You can see me without clicking.
{% endExpandable %}
```
{% endraw %}

{% expandable title="Already open" open %}
You can see me without clicking.
{% endExpandable %}

## Raw `<details>` is upgraded automatically

You don't have to use the tag. Hand-written `<details>`/`<summary>` HTML — the kind
GitHub and many Markdown authors already write — is rendered as the **same** widget, so
a disclosure matches the rest of your docs instead of falling back to the browser's bare
default. Put a blank line after `</summary>` (and before `</details>`) so the body
renders as Markdown — without it the whole block stays raw HTML and inline Markdown
like `**bold**` won't render:

```html
<details>
<summary>Written as plain HTML</summary>

This **Markdown** body renders, and the disclosure looks just like the tag above.

</details>
```

renders, live:

<details>
<summary>Written as plain HTML</summary>

This **Markdown** body renders, and the disclosure looks just like the tag above.

</details>

Add the `open` attribute (`<details open>`) to start it expanded.
