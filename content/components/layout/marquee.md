---
title: "Marquee"
description: "The built-in marquee tag — a continuously scrolling ticker for logos, announcements, or a tagline. Usage, options, and live examples."
---

# Marquee

`marquee` is a **scrolling ticker** — content that slides continuously across the row, the way logo strips and announcement bars do. The content is repeated so the loop is seamless, it pauses while the pointer is over it (`pauseOnHover`), and it respects `prefers-reduced-motion` (the content holds still for readers who've asked to reduce motion).

Use it as `{% raw %}{% marquee %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'marquee', …)`.

## Demonstrations

The block body is the scrolling content; `duration` sets how long one loop takes in milliseconds (lower is faster):

{% marquee duration=15000 %}
Ship docs faster &nbsp;•&nbsp; Markdown in, static site out &nbsp;•&nbsp; no build step to babysit &nbsp;•&nbsp;
{% endMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% marquee duration=15000 %}
Ship docs faster — Markdown in, static site out — no build step to babysit — &nbsp;
{% endMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'marquee',
    duration=15000,
    children='Ship docs faster — Markdown in, static site out — no build step to babysit — &nbsp;',
)
```
{% endAccordionSection %}
{% endAccordion %}

`direction='right'` reverses the scroll and a lower `duration` moves it faster. The items can themselves be other built-in tags:

{% marquee direction='right' duration=8000 %}
{% badge color='blue' %}React{% endBadge %} {% badge color='grape' %}Mantine{% endBadge %} {% badge color='green' %}Markdown{% endBadge %} {% badge color='orange' %}Static{% endBadge %} &nbsp;
{% endMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% marquee direction='right' duration=8000 %}
{% badge color='blue' %}React{% endBadge %} {% badge color='grape' %}Mantine{% endBadge %} {% badge color='green' %}Markdown{% endBadge %} {% badge color='orange' %}Static{% endBadge %} &nbsp;
{% endMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
badges = ' '.join(
    component('aardvark', 'badge', color=c, children=label)
    for c, label in (('blue', 'React'), ('grape', 'Mantine'),
                     ('green', 'Markdown'), ('orange', 'Static'))
)
component('aardvark', 'marquee', direction='right', duration=8000,
          children=badges + ' &nbsp;')
```
{% endAccordionSection %}
{% endAccordion %}

`gap` widens the space between the looping copies, and `pauseOnHover=false` keeps it scrolling even under the pointer:

{% marquee gap='4rem' pauseOnHover=false %}
Never stops &nbsp;•&nbsp; wider gap between repeats &nbsp;•&nbsp;
{% endMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% marquee gap='4rem' pauseOnHover=false %}
Never stops — wider gap between repeats — &nbsp;
{% endMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'marquee',
    gap='4rem', pauseOnHover=False,
    children='Never stops — wider gap between repeats — &nbsp;',
)
```
{% endAccordionSection %}
{% endAccordion %}

By default the strip pauses while the pointer is over it (`pauseOnHover` is on) — hover any marquee above to see it hold.

## With other components

A marquee makes a tidy announcement bar inside a `paper` surface:

{% paper withBorder=true radius='md' p='sm' %}
{% marquee %}
{% badge color='red' %}live{% endBadge %} &nbsp; Maintenance window tonight 22:00 UTC &nbsp;•&nbsp; status page updated &nbsp;•&nbsp;
{% endMarquee %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true radius='md' p='sm' %}
{% marquee %}
{% badge color='red' %}live{% endBadge %} &nbsp; Maintenance window tonight 22:00 UTC &nbsp;•&nbsp; status page updated &nbsp;•&nbsp;
{% endMarquee %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
ticker = component(
    'aardvark', 'marquee',
    children=(
        component('aardvark', 'badge', color='red', children='live')
        + ' &nbsp; Maintenance window tonight 22:00 UTC &nbsp;•&nbsp; status page updated &nbsp;•&nbsp;'
    ),
)
component('aardvark', 'paper', withBorder=True, radius='md', p='sm', children=ticker)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `direction` | `left` (default) / `right` / `up` / `down` | Scroll direction (`up`/`down` scroll vertically). |
| `duration` | An integer, milliseconds for one loop (default `40000`) | Loop length — lower is faster. |
| `gap` | Any CSS length (default `2rem`) | Space between the looping copies. |
| `pauseOnHover` | bare flag or `true` / `false` (default `true`) | Pause the scroll while the pointer is over it. Set `false` to keep scrolling. |
| `fadeEdges` | `true` / `false` (default `false`) | Fade the content to transparent at the start/end edges. |

`attr={...}` forwards raw HTML attributes onto the rendered element.


## CSS Selectors

Each `marquee` carries `data-aardvark-island="Marquee"` on its wrapper, and Mantine exposes its parts as `mantine-Marquee-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Marquee"] {
  /* style every marquee on the page */
}

.mantine-Marquee-root {
  /* the root part */
}

.mantine-Marquee-group {
  /* the group part */
}

.mantine-Marquee-content {
  /* the content part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% marquee duration=15000 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
This text scrolls across the screen.
{% endMarquee %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% marquee duration=15000 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
This text scrolls across the screen.
{% endMarquee %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'marquee', duration=15000,
          children='This text scrolls across the screen.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
