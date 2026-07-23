---
title: "FloatingWindow"
description: "The built-in floatingwindow tag — a draggable titled panel you can grab
  by its header and move around. Usage, options, and a live example."
---

# FloatingWindow

A **built-in** tag for a draggable floating panel — a titled window that opens **over
the page** and floats above your content; grab its header to move it around the
viewport. It's a handy container for a help bubble, a mini-map, or any side panel the
reader can reposition. A **trigger button** opens it (set its text with `triggerLabel`),
then set the header text with `title`, size it with `width`, and toggle the close button
and border with `withCloseButton` and `withBorder`.

Use it as `{% raw %}{% floatingwindow %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'floatingwindow', …)`.

## Demonstrations

Click the trigger to open a titled window that floats over the page — grab its header and drag it around:

{% floatingwindow triggerLabel='Show tips' title='Tips' width=320 %}
**Drag me** by the title bar to move this window around the page.
{% endFloatingwindow %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingwindow triggerLabel='Show tips' title='Tips' width=320 %}
**Drag me** by the title bar to move this window around the page.
{% endFloatingwindow %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'floatingwindow',
    triggerLabel='Show tips',
    title='Tips',
    width=320,
    children='**Drag me** by the title bar to move this window around the page.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A borderless window without a close button

`shadow` and `radius` restyle the card; `withCloseButton=false` and
`withBorder=false` strip the chrome for a lighter panel:

{% floatingwindow triggerLabel='Open note' title='Note' width=280 shadow='md' radius='lg' withCloseButton=false withBorder=false %}
A lighter floating panel — no border, no close button.
{% endFloatingwindow %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingwindow triggerLabel='Open note' title='Note' width=280 shadow='md' radius='lg' withCloseButton=false withBorder=false %}
A lighter floating panel — no border, no close button.
{% endFloatingwindow %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'floatingwindow',
    triggerLabel='Open note',
    title='Note',
    width=280,
    shadow='md',
    radius='lg',
    withCloseButton=False,
    withBorder=False,
    children='A lighter floating panel — no border, no close button.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so a window can hold richer content — here a
[button](/components/buttons/button/) inside a draggable help panel:

{% floatingwindow triggerLabel='Need help?' title='Need help?' width=300 shadow='xl' %}
Reach support without leaving the page.

{% button text='Contact us' variant='light' fullWidth=true %}
{% endFloatingwindow %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingwindow triggerLabel='Need help?' title='Need help?' width=300 shadow='xl' %}
Reach support without leaving the page.

{% button text='Contact us' variant='light' fullWidth=true %}
{% endFloatingwindow %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
btn = component('aardvark', 'button', text='Contact us', variant='light', fullWidth=True)
component('aardvark', 'floatingwindow', triggerLabel='Need help?', title='Need help?',
          width=300, shadow='xl',
          children='Reach support without leaving the page.\n\n' + btn)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `triggerLabel` | string, default `Open window` | Text of the button that opens the window. |
| `title` | string | Header text shown in the draggable title bar. |
| `width` | integer (px), default `320` | Window width. |
| `shadow` | `xs`–`xl` (default `xl`) | Drop shadow. |
| `radius` | `xs`–`xl` or a number (default `md`) | Corner radius. |
| `withCloseButton` | bool, default `true` | Show the close button in the header. |
| `withBorder` | bool, default `true` | Draw a border around the window. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="FloatingWindow"]`, or through the Mantine Styles API classes. The window mounts on the client and exists only while it is open. The relevant classes:

{% raw %}
```css
/* Every rendered FloatingWindow carries this island marker */
[data-aardvark-island="FloatingWindow"] { }

/* Mantine Styles API classes */
.mantine-FloatingWindow-root { }

/* The demo adds these to the title bar */
.aardvark-fw-bar { }
.aardvark-fw-close { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% floatingwindow triggerLabel='Show tips' title='Tips' width=320 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
**Drag me** by the title bar to move this window around the page.
{% endFloatingwindow %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% floatingwindow triggerLabel='Show tips' title='Tips' width=320 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
**Drag me** by the title bar to move this window around the page.
{% endFloatingwindow %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'floatingwindow', triggerLabel='Show tips', title='Tips', width=320,
          children='**Drag me** by the title bar to move this window around the page.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
