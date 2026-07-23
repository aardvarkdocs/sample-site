---
title: "HoverCard"
description: "The built-in hovercard tag — a richer tooltip that opens on hover with a full Markdown body and open/close delays. Usage, options, and live examples."
---

# HoverCard

A floating card that opens when you **hover** its trigger — think of it as a Tooltip
whose body is full **Markdown** rather than a plain label. `target` is the inline trigger
text; the block body is the card content. The card reveals on hover after the page
hydrates, so in a static screenshot you'll see only the trigger link; hover it in a live
browser to open the card.

Use it as `{% raw %}{% hovercard %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'hovercard', …)`.

## Demonstrations

### Basic

`target` is the inline trigger; everything between the tags is the card body. Hover the
trigger to reveal it.

Hover {% hovercard target='@aardvark' width='280' shadow='md' withArrow=true %}
**Aardvark** — a static site generator.

Markdown in, fast static site out.
{% endHovercard %} to see the card.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Hover {% hovercard target='@aardvark' width='280' shadow='md' withArrow=true %}
**Aardvark** — a static site generator.

Markdown in, fast static site out.
{% endHovercard %} to see the card.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hovercard', target='@aardvark', width='280',
          shadow='md', withArrow=True,
          children='**Aardvark** — a static site generator.\n\n'
                   'Markdown in, fast static site out.')
```
{% endAccordionSection %}
{% endAccordion %}

### Position and delays

`position` anchors the card on any edge; `openDelay` / `closeDelay` tune how eagerly it
appears and lingers, so you can move the pointer onto the card without it snapping shut.

Hover {% hovercard target='slowly' position='top' openDelay=300 closeDelay=200 width='240' withArrow=true %}
Opens after a beat, and lingers so you can move onto it.
{% endHovercard %} here.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Hover {% hovercard target='slowly' position='top' openDelay=300 closeDelay=200 width='240' withArrow=true %}
Opens after a beat, and lingers so you can move onto it.
{% endHovercard %} here.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hovercard', target='slowly', position='top',
          openDelay=300, closeDelay=200, width='240', withArrow=True,
          children='Opens after a beat, and lingers so you can move onto it.')
```
{% endAccordionSection %}
{% endAccordion %}

### Radius, offset, and arrow size

`radius` rounds the card, `offset` sets the gap to the trigger, and `arrowSize` sizes the
pointer that `withArrow` draws.

Hover {% hovercard target='details' width='260' radius='lg' offset=12 withArrow=true arrowSize=10 shadow='lg' %}
A roomier card with a larger arrow and more breathing room.
{% endHovercard %} for the full look.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Hover {% hovercard target='details' width='260' radius='lg' offset=12 withArrow=true arrowSize=10 shadow='lg' %}
A roomier card with a larger arrow and more breathing room.
{% endHovercard %} for the full look.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hovercard', target='details', width='260',
          radius='lg', offset=12, withArrow=True, arrowSize=10, shadow='lg',
          children='A roomier card with a larger arrow and more breathing room.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because the body is full Markdown, it can host other tags. Here the card holds a
[Badge](/components/data-display/badge/) and a link:

Hover {% hovercard target='status' width='240' shadow='md' withArrow=true %}
{% badge color='green' variant='light' %}Operational{% endBadge %}

All systems normal. See the [status page](/).
{% endHovercard %} for details.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Hover {% hovercard target='status' width='240' shadow='md' withArrow=true %}
{% badge color='green' variant='light' %}Operational{% endBadge %}

All systems normal. See the [status page](/).
{% endHovercard %} for details.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hovercard', target='status', width='240',
          shadow='md', withArrow=True,
          children=component('aardvark', 'badge', color='green',
                             variant='light', children='Operational')
                   + '\n\nAll systems normal. See the [status page](/).')
```
{% endAccordionSection %}
{% endAccordion %}

## HoverCard vs. Tooltip vs. Popover

- **[Tooltip](/components/overlays/tooltip/)** — a short plain-text label, on hover.
- **HoverCard** — a richer Markdown body, on hover (this tag).
- **[Popover](/components/overlays/popover/)** — a Markdown panel, on click.

## Attributes

Omit any attribute to take its Mantine default. The card body is the block body (or, from
Python, `children`).

| Attribute | Valid values | Description |
| --- | --- | --- |
| `target` | string | The inline trigger text. Defaults to `Hover me`. |
| `position` | `bottom` (default), `top`, `left`, `right`, plus the `-start` / `-end` variants | Edge the card anchors to. |
| `width` | integer (pixels), or `target` to match the trigger | Card width. |
| `shadow` | `xs`–`xl` | Drop shadow on the card. |
| `withArrow` | bare flag → `true` | Draw a pointer at the anchored edge. |
| `arrowSize` | integer (pixels) | Arrow size. |
| `offset` | integer (pixels) | Gap between the trigger and the card. |
| `radius` | `xs`–`xl` or a number | Card corner radius. |
| `openDelay` | integer (milliseconds) | Delay before opening on hover. |
| `closeDelay` | integer (milliseconds) | Delay before closing after the pointer leaves. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="HoverCard"]`, or through the Mantine Styles API classes. The card mounts into a portal and its parts exist only while it is shown. The relevant classes:

{% raw %}
```css
/* Every rendered HoverCard carries this island marker */
[data-aardvark-island="HoverCard"] { }

/* Mantine Styles API classes */
.mantine-HoverCard-root { }
.mantine-HoverCard-dropdown { }
.mantine-HoverCard-arrow { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered card. Hover the target to show the card, then click it: the injected `onclick` reads the card's text and alerts it.

Hover {% hovercard target='@aardvark' width='280' shadow='md' withArrow=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click this card to run the injected handler.
{% endHovercard %} to see the card.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Hover {% hovercard target='@aardvark' width='280' shadow='md' withArrow=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click this card to run the injected handler.
{% endHovercard %} to see the card.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hovercard', target='@aardvark', width='280',
          shadow='md', withArrow=True,
          children='Click this card to run the injected handler.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
