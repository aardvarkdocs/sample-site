---
title: "Affix"
description: "The built-in affix tag — pins content to a fixed spot in the viewport as
  the page scrolls. Usage, options, and a live example."
---

# Affix

A **built-in** tag that pins its content to a fixed spot in the viewport — it stays
put as the page scrolls, which makes it ideal for a "back to top" button, a chat
launcher, or any floating action. Pick a corner with `position` and the pixel
distance from those edges with `offset`; `zIndex` controls stacking. The block body
is the pinned content.

Use it as `{% raw %}{% affix %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'affix', …)`.

## Demonstrations

A bottom-right affix (the default corner). It pins to the viewport, so the button
below stays in the corner as you scroll the page:

{% affix position='bottom-right' offset=24 %}
{% button text='Back to top' url='#' variant='filled' %}
{% endAffix %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% affix position='bottom-right' offset=24 %}
{% button text='Back to top' url='#' variant='filled' %}
{% endAffix %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'affix',
    position='bottom-right',
    offset=24,
    children=component('aardvark', 'button', text='Back to top', url='#', variant='filled'),
)
```
{% endAccordionSection %}
{% endAccordion %}

### Anchored to other corners and edges

`position` takes any corner (`bottom-right`, `bottom-left`, `top-right`,
`top-left`). A single token like `top` or `left` is completed into a corner using
the default `bottom`/`right` (so `top` → top-right, `left` → bottom-left). A larger
`offset` pushes it further from the named edges, and `zIndex` lifts it above other
fixed elements:

{% affix position='top-left' offset=80 zIndex=300 %}
{% button text='Top-left action' variant='light' color='grape' %}
{% endAffix %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% affix position='top-left' offset=80 zIndex=300 %}
{% button text='Top-left action' variant='light' color='grape' %}
{% endAffix %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'affix',
    position='top-left',
    offset=80,
    zIndex=300,
    children=component('aardvark', 'button', text='Top-left action', variant='light', color='grape'),
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The block body is ordinary Markdown, so any tag can be pinned. Here a
[card](/components/data-display/card/) holds a small stack of actions in the
bottom-right corner:

{% affix position='bottom-right' offset=24 zIndex=300 %}
{% card shadow='md' padding='sm' radius='md' withBorder=true %}
{% button text='Help' variant='light' size='xs' fullWidth=true %}
{% endCard %}
{% endAffix %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% affix position='bottom-right' offset=24 zIndex=300 %}
{% card shadow='md' padding='sm' radius='md' withBorder=true %}
{% button text='Help' variant='light' size='xs' fullWidth=true %}
{% endCard %}
{% endAffix %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'button', text='Help', variant='light', size='xs', fullWidth=True)
card = component('aardvark', 'card', shadow='md', padding='sm', radius='md', withBorder=True, children=inner)
component('aardvark', 'affix', position='bottom-right', offset=24, zIndex=300, children=card)
```
{% endAccordionSection %}
{% endAccordion %}

Because an affix is pinned to the viewport rather than rendered in the page flow, it
sits over your content — keep it small and out of the way of the main reading column.

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `position` | `bottom-right` (default), `bottom-left`, `top-right`, `top-left` (a single token like `top` or `left` is completed to a corner with the default `bottom`/`right`) | Corner to pin the content to. |
| `offset` | integer (px), default `20` | Distance from each named edge. |
| `zIndex` | integer | Stacking order, for sitting above or below other fixed elements. Omitted by default so Mantine's default applies. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Affix"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Affix carries this island marker */
[data-aardvark-island="Affix"] { }

/* Mantine Styles API classes */
.mantine-Affix-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% affix position='bottom-right' offset=24 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% button text='Back to top' url='#' variant='filled' %}
{% endAffix %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% affix position='bottom-right' offset=24 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% button text='Back to top' url='#' variant='filled' %}
{% endAffix %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'affix', position='bottom-right', offset=24,
          children=component('aardvark', 'button', text='Back to top', url='#', variant='filled'),
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
