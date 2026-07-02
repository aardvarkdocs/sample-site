---
title: "Modal"
description: "The built-in modal tag — a centered dialog over a dimming overlay, with a
  built-in trigger button and open/close wiring. Usage, options, and a live example."
---

# Modal

A **built-in** tag for a modal dialog — a centered panel over a dimming overlay. It
ships with a trigger button and the open/close state wired up, so it works on a
static page with no setup: click the trigger to open, then close via the close
button, the overlay, or Escape. Set `triggerLabel` for the opener text, `title` for
the header, and tune size, layout, and the overlay/transition with the props below.
The modal starts closed and opens from its trigger button, so the page never loads
with a panel covering the content.

Use it as `{% raw %}{% modal %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'modal', …)`.

## Demonstrations

The trigger button opens the modal; the block body is the modal content:

{% modal title='Welcome' triggerLabel='Open the modal' %}
This is the modal body — any **Markdown** works here.
{% endModal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% modal title='Welcome' triggerLabel='Open the modal' %}
This is the modal body — any **Markdown** works here.
{% endModal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'modal',
    title='Welcome',
    triggerLabel='Open the modal',
    children='This is the modal body — any **Markdown** works here.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A larger, centered modal

`size` widens the panel, `centered` pins it to the vertical middle, and `radius` /
`padding` / `overlayBlur` restyle the panel and its backdrop:

{% modal title='Settings' triggerLabel='Open settings' size='lg' centered=true radius='md' padding='xl' overlayBlur=3 %}
A bigger, vertically-centered modal with a blurred backdrop.
{% endModal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% modal title='Settings' triggerLabel='Open settings' size='lg' centered=true radius='md' padding='xl' overlayBlur=3 %}
A bigger, vertically-centered modal with a blurred backdrop.
{% endModal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'modal',
    title='Settings',
    triggerLabel='Open settings',
    size='lg',
    centered=True,
    radius='md',
    padding='xl',
    overlayBlur=3,
    children='A bigger, vertically-centered modal with a blurred backdrop.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A full-screen modal

`fullScreen` expands the modal to fill the whole viewport — good for an immersive
form or an onboarding step. It still opens from its trigger and closes with the header
button or the Escape key (a full-screen panel has no surrounding backdrop to click).
`transition` / `transitionDuration` tune the open animation:

{% modal title='Onboarding' triggerLabel='Start onboarding' fullScreen=true transition='fade' transitionDuration=200 %}
A full-screen modal. Close it with the header button or the Escape key.
{% endModal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% modal title='Onboarding' triggerLabel='Start onboarding' fullScreen=true transition='fade' transitionDuration=200 %}
A full-screen modal. Close it with the header button or the Escape key.
{% endModal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'modal',
    title='Onboarding',
    triggerLabel='Start onboarding',
    fullScreen=True,
    transition='fade',
    transitionDuration=200,
    children='A full-screen modal. Close it with the header button or the Escape key.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The body is ordinary Markdown, so a modal can hold a whole form. Here a
[button](/components/buttons/button/) confirms an action and
`overlayBackgroundOpacity` darkens the backdrop:

{% modal title='Delete project?' triggerLabel='Delete' centered=true overlayBackgroundOpacity=0.7 %}
This permanently removes the project and all of its data.

{% button text='Yes, delete it' color='red' variant='filled' %}
{% endModal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% modal title='Delete project?' triggerLabel='Delete' centered=true overlayBackgroundOpacity=0.7 %}
This permanently removes the project and all of its data.

{% button text='Yes, delete it' color='red' variant='filled' %}
{% endModal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
confirm = component('aardvark', 'button', text='Yes, delete it', color='red', variant='filled')
component('aardvark', 'modal', title='Delete project?', triggerLabel='Delete', centered=True,
          overlayBackgroundOpacity=0.7,
          children='This permanently removes the project and all of its data.\n\n' + confirm)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `title` | string | Header text shown beside the close button. |
| `triggerLabel` | string, default `Open modal` | Text on the opener button. |
| `opened` | bool, default `false` | Start the modal already open on load. Usually leave this off so the page opens to the trigger button rather than a panel over the content. |
| `size` | `xs`–`xl`, a number of px, `auto`, or `100%` | Panel width. |
| `radius` | `xs`–`xl` or a number | Corner radius. |
| `padding` | `xs`–`xl` or a number | Inner padding. |
| `centered` | bool, default `false` | Vertically center the modal (off → it sits near the top). |
| `fullScreen` | bool, default `false` | Expand to fill the whole viewport. |
| `withCloseButton` | bool, default `true` | Show the header close button. |
| `closeOnClickOutside` | bool, default `true` | Close when the overlay is clicked. |
| `closeOnEscape` | bool, default `true` | Close on the Escape key. |
| `overlayBackgroundOpacity` | float `0`–`1` | Overlay opacity. |
| `overlayBlur` | float (px) | Backdrop blur behind the modal. |
| `transition` | `fade`, `pop`, `slide-up`, … | Open/close transition. |
| `transitionDuration` | integer (ms) | Transition length. |

A modal can always be closed: if you set `withCloseButton`, `closeOnClickOutside`, and
`closeOnEscape` all to `false` there'd be no way out, so the build re-enables the close
button (and prints a warning). A modal can never trap the reader.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Modal"]`, or through the Mantine Styles API classes. The modal mounts into a portal and its parts exist only while it is open. The relevant classes:

{% raw %}
```css
/* Every rendered Modal carries this island marker */
[data-aardvark-island="Modal"] { }

/* Mantine Styles API classes */
.mantine-Modal-root { }
.mantine-Modal-overlay { }
.mantine-Modal-content { }
.mantine-Modal-header { }
.mantine-Modal-title { }
.mantine-Modal-body { }
.mantine-Modal-close { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered overlay. Open the modal and click anywhere in it: the injected `onclick` reads the overlay's text and alerts it.

{% modal title='Welcome' triggerLabel='Open the modal' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click anywhere in this modal to run the injected handler.
{% endModal %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% modal title='Welcome' triggerLabel='Open the modal' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click anywhere in this modal to run the injected handler.
{% endModal %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'modal',
    title='Welcome',
    triggerLabel='Open the modal',
    children='Click anywhere in this modal to run the injected handler.',
    attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
)
```
{% endAccordionSection %}
{% endAccordion %}
