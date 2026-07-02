---
title: "Dialog"
description: "The built-in dialog tag — a small corner-anchored panel with no backdrop,
  with a built-in trigger button. Usage, options, and a live example."
---

# Dialog

A **built-in** tag for a dialog — a small, fixed panel anchored to a corner of the
viewport, with no backdrop (the rest of the page stays interactive). It ships with a
trigger button and the open/close state wired up. Since there's no overlay to click,
dismiss it with its own close button. Anchor it with `position`, size and shape it
with `size` / `radius` / `withBorder`, and tune the open/close with the props below.
It starts closed and opens from its trigger button.

Use it as `{% raw %}{% dialog %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'dialog', …)`.

## Demonstrations

The trigger button opens the dialog; the block body is its content:

{% dialog triggerLabel='Show the dialog' position='bottom-right' %}
A quick, non-blocking message in the corner.
{% endDialog %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dialog triggerLabel='Show the dialog' position='bottom-right' %}
A quick, non-blocking message in the corner.
{% endDialog %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'dialog',
    triggerLabel='Show the dialog',
    position='bottom-right',
    children='A quick, non-blocking message in the corner.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### Bordered, top-left, larger

`position` anchors to any corner or edge; `size` widens the panel, `radius` rounds
it, and `withBorder` draws an outline:

{% dialog triggerLabel='Top-left dialog' position='top-left' size='lg' radius='md' withBorder=true %}
A bordered dialog anchored to the top-left corner.
{% endDialog %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dialog triggerLabel='Top-left dialog' position='top-left' size='lg' radius='md' withBorder=true %}
A bordered dialog anchored to the top-left corner.
{% endDialog %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'dialog',
    triggerLabel='Top-left dialog',
    position='top-left',
    size='lg',
    radius='md',
    withBorder=True,
    children='A bordered dialog anchored to the top-left corner.',
)
```
{% endAccordionSection %}
{% endAccordion %}

### A tuned pop-in transition

`transition` / `transitionDuration` tune how the dialog appears from its corner.
Because a Dialog has no backdrop, its close button is the only way to dismiss it — so
it always stays available:

{% dialog triggerLabel='Open the dialog' position='bottom-left' transition='pop' transitionDuration=200 %}
A corner dialog that pops in. Dismiss it with the close button.
{% endDialog %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dialog triggerLabel='Open the dialog' position='bottom-left' transition='pop' transitionDuration=200 %}
A corner dialog that pops in. Dismiss it with the close button.
{% endDialog %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'dialog',
    triggerLabel='Open the dialog',
    position='bottom-left',
    transition='pop',
    transitionDuration=200,
    children='A corner dialog that pops in. Dismiss it with the close button.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A [dialog](/components/overlays/dialog/) and a [notification](/components/feedback/notification/)
combine into a **dismissable toast**: the dialog supplies the corner anchor, the trigger button,
and a real dismiss (its close button), while the notification supplies the toast styling — the
colored accent line and the title. Click *Show notification*, then dismiss it with the close
button in the panel's corner.

{% dialog triggerLabel='Show notification' position='bottom-right' size='lg' %}
{% notification title='Changes saved' color='green' %}
Your project settings were updated.
{% endNotification %}
{% endDialog %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dialog triggerLabel='Show notification' position='bottom-right' size='lg' %}
{% notification title='Changes saved' color='green' %}
Your project settings were updated.
{% endNotification %}
{% endDialog %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
toast = component('aardvark', 'notification', title='Changes saved', color='green',
                  children='Your project settings were updated.')
component('aardvark', 'dialog', triggerLabel='Show notification', position='bottom-right',
          size='lg', children=toast)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Values | Description |
| --- | --- | --- |
| `triggerLabel` | string, default `Open dialog` | Text on the opener button. |
| `opened` | bool, default `false` | Start the dialog already open on load. Usually leave this off so it opens from the trigger button. |
| `position` | `bottom-right` (default), `bottom-left`, `top-right`, `top-left`, or a single edge | Corner or edge to anchor to. |
| `size` | `xs`–`xl`, a number of px, or a percentage | Panel width. |
| `radius` | `xs`–`xl` or a number | Corner radius. |
| `withBorder` | bool, default `false` | Draw a border around the panel. |
| `withCloseButton` | bool, default `true` | Show the close button. It's the dialog's only dismissal (there's no backdrop or Escape), so if you turn it off the build re-enables it and warns. |
| `transition` | `pop`, `fade`, `slide-up`, … | Open/close transition. |
| `transitionDuration` | integer (ms) | Transition length. |

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Dialog"]`, or through the Mantine Styles API classes. Its parts render only while the dialog is shown. The relevant classes:

{% raw %}
```css
/* Every rendered Dialog carries this island marker */
[data-aardvark-island="Dialog"] { }

/* Mantine Styles API classes */
.mantine-Dialog-root { }
.mantine-Dialog-closeButton { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered overlay. Open the dialog and click it: the injected `onclick` reads the overlay's text and alerts it.

{% dialog triggerLabel='Show the dialog' position='bottom-right' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click this dialog to run the injected handler.
{% endDialog %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dialog triggerLabel='Show the dialog' position='bottom-right' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click this dialog to run the injected handler.
{% endDialog %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dialog', triggerLabel='Show the dialog', position='bottom-right',
          children='Click this dialog to run the injected handler.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
