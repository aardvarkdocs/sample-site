---
title: "Collapse"
description: "The built-in collapse tag — a primitive that animates content open and closed by height. How it works on a static page, options, and a live example."
---

# Collapse

`collapse` is a **height-animation primitive**. It shows or hides its content with a smooth height transition, keyed off an open/closed flag (`opened`). On a static docs page the state is fixed at render time — `opened=true` renders the content visible, `opened=false` renders it collapsed away — so it's the lower-level building block underneath an interactive section, not a click-to-toggle widget by itself. For a ready-made collapsible section with no code, reach for the [Accordion](/components/data-display/accordion/) tag instead.

Use it as `{% raw %}{% collapse %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'collapse', …)`.

> **The static-page caveat.** Collapse animates content *open and closed by height*, which is inherently **stateful** — the animation runs when the open state *changes*. To get real interactive open/close, drive `opened` from your own component (a [snippet](/authoring/components-and-snippets/) that toggles it from React state, often paired with a button). Mantine's prop is named `in`, a reserved word in the template language, so this tag exposes it as **`opened`**.

## Demonstrations

The block body is the collapsible content; `opened` fixes its state at render time. With `opened=true` the content is visible:

{% paper withBorder=true p='md' radius='md' %}
{% collapse opened=true %}
This content is inside a Collapse with `opened=true`, so it's shown. In a stateful component, toggling `opened` would animate it open and closed by height.
{% endCollapse %}
{% endPaper %}

With `opened=false` the body is rendered collapsed — nothing visible below:

{% collapse opened=false %}
You won't see this on a static page — opened=false renders it collapsed.
{% endCollapse %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% collapse opened=true %}
Visible because opened=true. Set opened=false and it renders collapsed.
{% endCollapse %}

{% collapse opened=false %}
You won't see this on a static page — opened=false renders it collapsed.
{% endCollapse %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'collapse', opened=True,
          children='Visible because opened=true.')
component('aardvark', 'collapse', opened=False,
          children="You won't see this on a static page.")
```
{% endAccordionSection %}
{% endAccordion %}

`transitionDuration` (ms), `transitionTimingFunction` (CSS easing), and `animateOpacity` tune the animation that runs when a stateful parent toggles `opened`:

{% paper withBorder=true p='md' radius='md' %}
{% collapse opened=true transitionDuration=400 transitionTimingFunction='ease-in-out' animateOpacity=true %}
A slower, eased expansion — these props shape the open/close animation a stateful parent triggers.
{% endCollapse %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% collapse opened=true transitionDuration=400 transitionTimingFunction='ease-in-out' animateOpacity=true %}
A slower, eased expansion — these props shape the open/close animation a stateful parent triggers.
{% endCollapse %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'collapse',
    opened=True,
    transitionDuration=400,
    transitionTimingFunction='ease-in-out',
    animateOpacity=True,
    children='A slower, eased expansion.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Collapse is content-agnostic — the body is ordinary Markdown and other tags. Here a `paper` surface wraps an open collapse holding a `divider` and text:

{% paper shadow='sm' withBorder=true radius='md' p='lg' %}
**Details**
{% collapse opened=true %}
{% divider my='sm' %}
This panel's body is a Collapse — a stateful parent could hide it behind a toggle.
{% endCollapse %}
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper shadow='sm' withBorder=true radius='md' p='lg' %}
**Details**
{% collapse opened=true %}
{% divider my='sm' %}
This panel's body is a Collapse — a stateful parent could hide it behind a toggle.
{% endCollapse %}
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
collapsed = (
    component('aardvark', 'divider', my='sm')
    + "This panel's body is a Collapse — a stateful parent could hide it behind a toggle."
)
inner = '**Details**' + component('aardvark', 'collapse', opened=True, children=collapsed)
component('aardvark', 'paper', shadow='sm', withBorder=True, radius='md', p='lg',
          children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `opened` | bare flag or `true` / `false` (default `true`) | Whether the content is shown. Maps to Mantine's `in`; `opened=false` collapses it. |
| `transitionDuration` | An integer (milliseconds) | Length of the open/close animation. |
| `transitionTimingFunction` | A CSS easing (`ease-in-out`, `linear`, `cubic-bezier(…)`) | Easing for the height animation. |
| `animateOpacity` | bare flag or `true` / `false` (default `true`) | Fade the content as it expands / collapses. |

`attr={...}` forwards raw HTML attributes onto the rendered element.


## CSS Selectors

Each `collapse` carries `data-aardvark-island="Collapse"` on its wrapper; it animates a single element with no Mantine Styles API parts, so target the island wrapper.

{% raw %}
```css
[data-aardvark-island="Collapse"] {
  /* style every collapse on the page */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% collapse opened=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Shown when opened.
{% endCollapse %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% collapse opened=true attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Shown when opened.
{% endCollapse %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'collapse', opened=True,
          children='Shown when opened.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
