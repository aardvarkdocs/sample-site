---
title: "Lightbox"
description: "The community Lightbox tag — a full-screen image lightbox wrapping the @mantine-bites/lightbox extension, built on Embla Carousel. Usage, options, and live examples."
menu: components
parent: community
weight: 20
---

# Lightbox

A **full-screen image lightbox**: the tag renders a thumbnail grid, and clicking a thumbnail
opens that image full-screen with carousel navigation between the rest. `images` is a JSON
array of `{ "src", "alt" }` objects; `cols` sets how many thumbnails sit per row.

A **Community Component** — wraps [Lightbox](https://rilrom.github.io/mantine-bites/lightbox/)
by **rilrom**, **MIT** licensed, npm `@mantine-bites/lightbox` (built on
[Embla Carousel](https://www.embla-carousel.com/)).

Use it as `{% raw %}{% lightbox %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'lightbox', …)`.

## Demonstrations

### A thumbnail grid

Pass `images` as a JSON array of `{ "src", "alt" }` objects. Each renders as a thumbnail;
click one to open the full-screen lightbox and swipe (or arrow) through the set.

{% lightbox images='[
  {"src": "https://picsum.photos/id/10/1200/800", "alt": "Forest"},
  {"src": "https://picsum.photos/id/20/1200/800", "alt": "Desk"},
  {"src": "https://picsum.photos/id/30/1200/800", "alt": "Coffee"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% lightbox images='[
  {"src": "https://picsum.photos/id/10/1200/800", "alt": "Forest"},
  {"src": "https://picsum.photos/id/20/1200/800", "alt": "Desk"},
  {"src": "https://picsum.photos/id/30/1200/800", "alt": "Coffee"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'lightbox', images='''[
  {"src": "https://picsum.photos/id/10/1200/800", "alt": "Forest"},
  {"src": "https://picsum.photos/id/20/1200/800", "alt": "Desk"},
  {"src": "https://picsum.photos/id/30/1200/800", "alt": "Coffee"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

### Grid width

Set `cols` to change how many thumbnails sit per row — here four across a tighter gallery.

{% lightbox cols=4 images='[
  {"src": "https://picsum.photos/id/40/1200/800", "alt": "One"},
  {"src": "https://picsum.photos/id/50/1200/800", "alt": "Two"},
  {"src": "https://picsum.photos/id/60/1200/800", "alt": "Three"},
  {"src": "https://picsum.photos/id/70/1200/800", "alt": "Four"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% lightbox cols=4 images='[
  {"src": "https://picsum.photos/id/40/1200/800", "alt": "One"},
  {"src": "https://picsum.photos/id/50/1200/800", "alt": "Two"},
  {"src": "https://picsum.photos/id/60/1200/800", "alt": "Three"},
  {"src": "https://picsum.photos/id/70/1200/800", "alt": "Four"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'lightbox', cols=4, images='''[
  {"src": "https://picsum.photos/id/40/1200/800", "alt": "One"},
  {"src": "https://picsum.photos/id/50/1200/800", "alt": "Two"},
  {"src": "https://picsum.photos/id/60/1200/800", "alt": "Three"},
  {"src": "https://picsum.photos/id/70/1200/800", "alt": "Four"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because `images` is plain data, a Python caller can build the gallery from a loop — for
example mapping a list of asset URLs — and render it under a
[Title](/components/typography/title/) heading:

{% title order=4 %}Gallery{% endTitle %}

{% lightbox images='[
  {"src": "https://picsum.photos/id/80/1200/800", "alt": "A"},
  {"src": "https://picsum.photos/id/90/1200/800", "alt": "B"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% title order=4 %}Gallery{% endTitle %}

{% lightbox images='[
  {"src": "https://picsum.photos/id/80/1200/800", "alt": "A"},
  {"src": "https://picsum.photos/id/90/1200/800", "alt": "B"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
import json

assets = [
    ('https://picsum.photos/id/80/1200/800', 'A'),
    ('https://picsum.photos/id/90/1200/800', 'B'),
]
images = json.dumps([{'src': src, 'alt': alt} for src, alt in assets])

component('aardvark', 'title', order=4, children='Gallery')
component('aardvark', 'lightbox', images=images)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `images` | JSON array string | The gallery images. Each is a `{ "src", "alt" }` object. Relative paths and `http(s)://` URLs are allowed; unsafe schemes are rejected at build time. |
| `cols` | integer | Thumbnails per row in the grid. Defaults to `3`. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the grid wrapper element. See [Injecting Attributes](#injecting-attributes). |

## CSS Selector

The grid wrapper carries `data-aardvark-lightbox`, and each thumbnail button carries the
class `aardvark-lightbox-thumb`; target them to restyle the gallery:

```css
[data-aardvark-lightbox] .aardvark-lightbox-thumb:hover {
  transform: scale(1.05);
}
```

The full-screen overlay and carousel chrome are styled by the upstream
`@mantine-bites/lightbox` stylesheet, which the component pulls in automatically.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes onto the grid wrapper element — useful for
`id`, `data-*`, ARIA attributes, or anything not exposed as a named param:

{% lightbox attr={'id': 'demo-gallery', 'data-role': 'lightbox'} images='[{"src": "https://picsum.photos/id/100/1200/800", "alt": "Sample"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% lightbox attr={'id': 'demo-gallery', 'data-role': 'lightbox'} images='[{"src": "https://picsum.photos/id/100/1200/800", "alt": "Sample"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'lightbox', attr={'id': 'demo-gallery', 'data-role': 'lightbox'},
          images='[{"src": "https://picsum.photos/id/100/1200/800", "alt": "Sample"}]')
```
{% endAccordionSection %}
{% endAccordion %}
