---
title: "Book"
description: "The built-in book tag — an iBooks-style book whose pages turn with a draggable page-curl. A Community Component wrapping @gfazioli/mantine-book."
menu: components
parent: community
weight: 50
---

# Book

`book` is an iBooks-style **book** whose pages turn with a draggable page-curl: grab the corner
of the right page and drag to flip it forward, or the left page to flip back, and the page
beneath shows through the curl as it turns. Hand it a set of pages and it hydrates into a fully
interactive island in the browser — no JavaScript to write.

A **Community Component** — wraps [Book](https://gfazioli.github.io/mantine-book/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-book`.

## Demonstrations

### A basic book

Pass the pages through `pages` as a JSON array of `{front, back}` objects — `front` and `back`
are the two sides of each physical page. Drag a page corner to turn it.

{% raw %}
```aardvark
{% book pages='[
  {"front":"Chapter 1","back":"Once upon a time…"},
  {"front":"…there was a docs site","back":"that turned its own pages."},
  {"front":"The End","back":""}
]' %}
```
{% endraw %}

{% book pages='[
  {"front":"Chapter 1","back":"Once upon a time…"},
  {"front":"…there was a docs site","back":"that turned its own pages."},
  {"front":"The End","back":""}
]' %}

### Sizing the page

`width` and `height` set the page geometry in CSS pixels (the book's play-zone is twice the
width, for the two-page spread). A taller, narrower book:

{% raw %}
```aardvark
{% book width=220 height=320 pages='[
  {"front":"A","back":"B"},
  {"front":"C","back":"D"},
  {"front":"E","back":"F"}
]' %}
```
{% endraw %}

{% book width=220 height=320 pages='[
  {"front":"A","back":"B"},
  {"front":"C","back":"D"},
  {"front":"E","back":"F"}
]' %}

### A bound volume with hard covers

Set `withCover=true` to treat the book as a physical bound volume: the first and last pages turn
rigid around the spine (hard covers, no curl) and the closed book is centered, sliding into the
two-page spread as the cover opens. Pick the curl `variant` (`flat` or `rounded`) and set
`revealBackground` for the inside-cover color.

{% raw %}
```aardvark
{% book withCover=true variant='rounded' revealBackground='#2b2b3a' pages='[
  {"front":"Front cover","back":"Title page"},
  {"front":"Page 1","back":"Page 2"},
  {"front":"Page 3","back":"Back cover"}
]' %}
```
{% endraw %}

{% book withCover=true variant='rounded' revealBackground='#2b2b3a' pages='[
  {"front":"Front cover","back":"Title page"},
  {"front":"Page 1","back":"Page 2"},
  {"front":"Page 3","back":"Back cover"}
]' %}

## With other components

Each page's `front`/`back` is rendered content, so a Book sits naturally under an introductory
[Title](/components/typography/title/):

{% raw %}
```aardvark
{% title order=3 %}Our story{% endTitle %}
{% book pages='[
  {"front":"2021","back":"We started."},
  {"front":"2023","back":"We shipped."},
  {"front":"Today","back":"You are reading it."}
]' %}
```
{% endraw %}

{% title order=3 %}Our story{% endTitle %}
{% book pages='[
  {"front":"2021","back":"We started."},
  {"front":"2023","back":"We shipped."},
  {"front":"Today","back":"You are reading it."}
]' %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `withCover`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `pages` | JSON array of `{front, back, props}` | The pages. `front`/`back` are the two sides; `props` (optional) overrides per-page settings. |
| `width` | int px (default `300`) | Page width. The play-zone is twice this. |
| `height` | int px (default `600`) | Page height. |
| `variant` | `flat` / `rounded` | The curl renderer used for every page. |
| `revealBackground` | Mantine color / CSS color | Inside-cover background, painted under the page stack. |
| `defaultPage` | int (default `0`) | Initial face index (`0` is the closed book). |
| `riffleDuration` | int ms (default `1000`) | Total time budget for a multi-page riffle. |
| `withCover` | `true` / `false` (default `false`) | Treat as a bound volume: hard covers + centered closed book. |
| `disabled` | `true` / `false` (default `false`) | Disable the drag interaction on every page. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The island mounts under a stable wrapper you can target from your own CSS:

```css
[data-aardvark-island="Book"] {
  /* your overrides */
}
```

The upstream component also exposes Mantine Styles-API class names (`root`, `page`) and CSS
variables (`--curl-page-width`, `--curl-page-height`, `--curl-reveal-background`) for finer
control.

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes onto the rendered root element — handy for
analytics hooks, test ids, or ARIA attributes the component doesn't expose as a prop. The
object passes through verbatim (it is not a React prop):

{% book attr={'data-testid': 'story-book', 'data-analytics': 'about-page'} pages='[
  {"front":"Hi","back":"There"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% book attr={'data-testid': 'story-book', 'data-analytics': 'about-page'} pages='[
  {"front":"Hi","back":"There"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'book',
          attr={'data-testid': 'story-book', 'data-analytics': 'about-page'},
          pages='''[
  {"front":"Hi","back":"There"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}
