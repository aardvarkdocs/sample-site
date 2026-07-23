---
title: "VisuallyHidden"
description: "The built-in visuallyhidden tag — an accessibility primitive that hides content visually while keeping it available to screen readers."
---

# VisuallyHidden

`visuallyhidden` is the standard **screen-reader-only** accessibility primitive: it hides its
content *visually* — it's gone from the layout — while keeping it in the accessibility tree, so
screen readers still announce it. By design it renders **no visible output**: the content is
positioned off-screen but stays available to assistive technology. Use it for labels, captions,
and context that assistive tech needs but that would be redundant or cluttering on screen — for
example extra wording for an icon-only button, or a heading that gives screen-reader users the
structure a sighted user gets from layout. It takes no styling options. Close the block with
`{% raw %}{% endVisuallyhidden %}{% endraw %}` (one capital V).

Use it as `{% raw %}{% visuallyhidden %}…{% endVisuallyhidden %}{% endraw %}` in Markdown, or
call it from Python logic (loops, snippets) via `component('aardvark', 'visuallyhidden', …)`.

## Demonstrations

The block body is the screen-reader-only content. It produces nothing visible on the page — open
it in a screen reader, or inspect the DOM, to find the hidden run of text.

**Preview** (there is no visual difference; the hidden text is announced by assistive tech only):

Visible text: "Here is some text" {% visuallyhidden %}and this part is only for screen readers{% endVisuallyhidden %}.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Visible text: "Here is some text"
{% visuallyhidden %}and this part is only for screen readers{% endVisuallyhidden %}.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
'Visible text: "Here is some text" ' + component(
    'aardvark', 'visuallyhidden',
    children='and this part is only for screen readers')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The classic use is an **icon-only button**: the button shows only the icon, while a
`visuallyhidden` run gives screen-reader users the accessible name. The button below shows just
the trash [icon](/components/data-display/icon/), but a screen reader announces "Delete this item".

**Preview:**

<button>
  {% icon 'fa-solid fa-trash' %}
  {% visuallyhidden %}Delete this item{% endVisuallyhidden %}
</button>

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
<button>
  {% icon 'fa-solid fa-trash' %}
  {% visuallyhidden %}Delete this item{% endVisuallyhidden %}
</button>
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
label = component('aardvark', 'visuallyhidden', children='Delete this item')
icon = component('aardvark', 'icon', 'fa-solid fa-trash')
'<button>' + icon + label + '</button>'
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

`visuallyhidden` takes no styling options — it's a single-purpose accessibility wrapper.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered span if you need a hook. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="VisuallyHidden"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered VisuallyHidden carries this island marker */
[data-aardvark-island="VisuallyHidden"] { }

/* Mantine Styles API classes */
.mantine-VisuallyHidden-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered element. A `visuallyhidden` element is off-screen, so a click handler isn't practically reachable — instead, `attr` is useful for `data-*` hooks, ARIA, or an `id` that scripts and tests can target on the (otherwise invisible) node:

Visible text {% visuallyhidden attr={'data-testid': 'sr-only-note'} %}and this part is only for screen readers{% endVisuallyhidden %}. (Inspect the hidden span in DevTools to see the forwarded `data-testid`.)

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Visible text {% visuallyhidden attr={'data-testid': 'sr-only-note'} %}and this part is only for screen readers{% endVisuallyhidden %}.
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
'Visible text ' + component(
    'aardvark', 'visuallyhidden',
    children='and this part is only for screen readers',
    attr={'data-testid': 'sr-only-note'}) + '.'
```
{% endAccordionSection %}
{% endAccordion %}
