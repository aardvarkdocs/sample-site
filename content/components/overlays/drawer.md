---
title: "Drawer"
description: "The built-in drawer tag — a panel that slides in from any edge, with a
  built-in trigger button and open/close wiring. Usage, options, and a live example."
---

# Drawer

A **built-in** tag for a drawer — a panel that slides in from an edge of the screen
over a dimming overlay. Like [Modal](/components/overlays/modal/), it ships
with a trigger button and the open/close state wired up, so it works on a static
page: click the trigger to open, then close via the close button, the overlay, or
Escape. Pick the edge it slides from with `position`, set the header with `title`,
and tune size, padding, and the overlay/transition with the props below. The drawer
starts closed and opens from its trigger button, so the page never loads with the
panel in the reader's way.

Use it as `{% raw %}{% drawer %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'drawer', …)`.

## Demonstrations

The trigger button opens the drawer; the block body is its content:

{% drawer title='Navigation' triggerLabel='Open the drawer' position='right' %}
Drawer content — any **Markdown** works here.
{% endDrawer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% drawer title='Navigation' triggerLabel='Open the drawer' position='right' %}
Drawer content — any **Markdown** works here.
{% endDrawer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'drawer',
    title='Navigation',
    triggerLabel='Open the drawer',
    position='right',
    children='Drawer content — any **Markdown** works here.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A detached drawer from the bottom

`position` picks the edge; `offset` floats the drawer off the edges, `radius` rounds
its corners, and `padding` / `size` size the panel:

{% drawer title='Filters' triggerLabel='Open from bottom' position='bottom' offset=16 radius='md' padding='lg' size='md' %}
A detached drawer that slides up from the bottom.
{% endDrawer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% drawer title='Filters' triggerLabel='Open from bottom' position='bottom' offset=16 radius='md' padding='lg' size='md' %}
A detached drawer that slides up from the bottom.
{% endDrawer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'drawer',
    title='Filters',
    triggerLabel='Open from bottom',
    position='bottom',
    offset=16,
    radius='md',
    padding='lg',
    size='md',
    children='A detached drawer that slides up from the bottom.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A tuned overlay and a deliberate close

This drawer darkens and blurs the backdrop (`overlayBackgroundOpacity`, `overlayBlur`)
and tunes the slide (`transition`, `transitionDuration`). It also sets
`closeOnClickOutside=false` so a stray click on the dimmed backdrop won't dismiss it —
you close it deliberately with the header button or the Escape key:

{% drawer title='Cart' triggerLabel='Open the cart' position='left' overlayBackgroundOpacity=0.6 overlayBlur=2 transition='slide-right' transitionDuration=250 closeOnClickOutside=false %}
Your cart slides in over a blurred backdrop. Close it with the header button or
Escape — clicking the backdrop won't dismiss it.
{% endDrawer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% drawer title='Cart' triggerLabel='Open the cart' position='left' overlayBackgroundOpacity=0.6 overlayBlur=2 transition='slide-right' transitionDuration=250 closeOnClickOutside=false %}
Your cart slides in over a blurred backdrop. Close it with the header button or
Escape — clicking the backdrop won't dismiss it.
{% endDrawer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'drawer',
    title='Cart',
    triggerLabel='Open the cart',
    position='left',
    overlayBackgroundOpacity=0.6,
    overlayBlur=2,
    transition='slide-right',
    transitionDuration=250,
    closeOnClickOutside=False,
    children=(
        'Your cart slides in over a blurred backdrop. Close it with the header '
        'button or Escape — clicking the backdrop won\'t dismiss it.'
    ),
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so a drawer can hold a navigation list or a form.
Here a [button](/components/buttons/button/) closes out an applied-filters
panel:

{% drawer title='Filters' triggerLabel='Filter results' position='right' size='sm' %}
Choose the facets to narrow the list.

{% button text='Apply filters' variant='filled' fullWidth=true %}
{% endDrawer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% drawer title='Filters' triggerLabel='Filter results' position='right' size='sm' %}
Choose the facets to narrow the list.

{% button text='Apply filters' variant='filled' fullWidth=true %}
{% endDrawer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
apply = component('aardvark', 'button', text='Apply filters', variant='filled', fullWidth=True)
component('aardvark', 'drawer', title='Filters', triggerLabel='Filter results', position='right', size='sm',
          children='Choose the facets to narrow the list.\n\n' + apply)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `title` | string | Header text shown beside the close button. |
| `triggerLabel` | string, default `Open drawer` | Text on the opener button. |
| `opened` | bool, default `false` | Start the drawer already open on load. Usually leave this off so the page opens to the trigger button rather than a panel covering the content. |
| `position` | `left` (default), `right`, `top`, `bottom` | Edge the drawer slides from. |
| `size` | `xs`–`xl`, a number of px, or a percentage | Panel width (or height for top/bottom). |
| `offset` | integer (px) | Gap between the drawer and the viewport edges (a detached drawer). |
| `radius` | `xs`–`xl` or a number | Corner radius. |
| `padding` | `xs`–`xl` or a number | Inner padding. |
| `withCloseButton` | bool, default `true` | Show the header close button. |
| `closeOnClickOutside` | bool, default `true` | Close when the overlay is clicked. |
| `closeOnEscape` | bool, default `true` | Close on the Escape key. |
| `overlayBackgroundOpacity` | float `0`–`1` | Overlay opacity. |
| `overlayBlur` | float (px) | Backdrop blur behind the drawer. |
| `transition` | `slide-right`, `slide-left`, `fade`, … | Open/close transition. |
| `transitionDuration` | integer (ms) | Transition length. |

A drawer can always be closed: if you set `withCloseButton`, `closeOnClickOutside`, and
`closeOnEscape` all to `false` there'd be no way out, so the build re-enables the close
button (and prints a warning). A drawer can never trap the reader.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Drawer"]`, or through the Mantine Styles API classes. The drawer mounts into a portal and its parts exist only while it is open. The relevant classes:

{% raw %}
```css
/* Every rendered Drawer carries this island marker */
[data-aardvark-island="Drawer"] { }

/* Mantine Styles API classes */
.mantine-Drawer-root { }
.mantine-Drawer-overlay { }
.mantine-Drawer-content { }
.mantine-Drawer-header { }
.mantine-Drawer-title { }
.mantine-Drawer-body { }
.mantine-Drawer-close { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered overlay. Open the drawer and click anywhere in it: the injected `onclick` reads the overlay's text and alerts it.

{% drawer title='Navigation' triggerLabel='Open the drawer' position='right' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click anywhere in this drawer to run the injected handler.
{% endDrawer %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% drawer title='Navigation' triggerLabel='Open the drawer' position='right' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click anywhere in this drawer to run the injected handler.
{% endDrawer %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'drawer', title='Navigation', triggerLabel='Open the drawer', position='right',
          children='Click anywhere in this drawer to run the injected handler.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
