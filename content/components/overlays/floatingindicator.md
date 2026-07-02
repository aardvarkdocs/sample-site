---
title: "FloatingIndicator"
description: "The built-in floatingindicator tag — a demo of Mantine's low-level sliding-highlight positioning primitive that powers SegmentedControl, Tabs, and Stepper."
---

# FloatingIndicator

`FloatingIndicator` is a **low-level positioning primitive**: it animates a single
highlight box from one target element to another, given a root ref and a target ref. It
has no behavior of its own — it is the engine Mantine uses inside **SegmentedControl**,
**Tabs**, and **Stepper** to slide their active highlight. Because the primitive needs
live element refs (which a build-time tag can't supply), this tag renders a small
self-contained **demo**: a row of buttons whose active highlight slides on click, set by
`labels` (a comma-separated list).

Use it as `{% raw %}{% floatingindicator %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'floatingindicator', …)`.

## Demonstration

Click the segments — the highlight box slides between them. The sliding box is the
`FloatingIndicator`; the row and click handling around it are the wiring that a real
control (SegmentedControl, Tabs) provides for you.

{% floatingindicator labels='Day, Week, Month' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingindicator labels='Day, Week, Month' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'floatingindicator', labels=['Day', 'Week', 'Month'])
```
{% endAccordionSection %}
{% endAccordion %}

The default `labels` is `One, Two, Three`, so the bare tag still renders three segments:

{% floatingindicator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingindicator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'floatingindicator')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The primitive is meant to live *inside* a real control. In practice you reach for a
component that already wires the indicator for you — for example aardvark's built-in
[Tabs](/components/navigation/tabs/), which slides an underline indicator on switch.
The demo below shows the standalone primitive sitting beside a short note rendered by
the [Text](/components/typography/text/) tag:

{% floatingindicator labels='Code, Preview, Diff' %}

{% text size='sm' c='dimmed' %}The highlight above is the same primitive Tabs uses internally.{% endText %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingindicator labels='Code, Preview, Diff' %}

{% text size='sm' c='dimmed' %}The highlight above is the same primitive Tabs uses internally.{% endText %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'floatingindicator', labels=['Code', 'Preview', 'Diff'])
component('aardvark', 'text', size='sm', c='dimmed',
          children='The highlight above is the same primitive Tabs uses internally.')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

`FloatingIndicator` has no build-time-supplyable props of its own — it is a primitive
that animates a highlight between two element refs, so the only input is the demo's
button labels. Style and behavior come from the control that hosts it (see
[Tabs](/components/navigation/tabs/) for a production-ready animated indicator).

| Attribute | Valid values | Description |
| --- | --- | --- |
| `labels` | Comma-separated list of strings | Button labels for the demo row whose active highlight slides on click. Defaults to `One, Two, Three`. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="FloatingIndicator"]`, or through the Mantine Styles API classes. The Mantine root is the sliding highlight box. The relevant classes:

{% raw %}
```css
/* Every rendered FloatingIndicator carries this island marker */
[data-aardvark-island="FloatingIndicator"] { }

/* Mantine Styles API classes */
.mantine-FloatingIndicator-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% floatingindicator labels='Day, Week, Month' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingindicator labels='Day, Week, Month' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'floatingindicator', labels=['Day', 'Week', 'Month'],
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
