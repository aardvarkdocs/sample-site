---
title: "Notification"
description: "The built-in notification tag — a titled message card with a colored accent line, border, loading state, and radius. Usage, options, and live examples."
---

# Notification

A built-in tag for a notification card — a titled message with a colored accent
line, handy for showing a static "toast" inline in your docs. The message is the
block body (or a `text` param); `title` is optional. Toggle `withBorder`,
`loading`, and a decorative `withCloseButton`, and set the `color` and `radius`.

Use it as `{% raw %}{% notification %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'notification', …)`.

## Demonstrations

### Title, message, and color

The message is the block body; `title` is optional; `color` sets the accent line:

{% notification title="Changes saved" color="green" %}
Your project was saved successfully.
{% endNotification %}

{% notification title="Deploy failed" color="red" %}
The accent line color conveys the type of message.
{% endNotification %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% notification title="Changes saved" color="green" %}
Your project was saved successfully.
{% endNotification %}

{% notification title="Deploy failed" color="red" %}
The accent line color conveys the type of message.
{% endNotification %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'notification', title='Changes saved', color='green',
          children='Your project was saved successfully.')
component('aardvark', 'notification', title='Deploy failed', color='red',
          children='The accent line color conveys the type of message.')
```
{% endAccordionSection %}
{% endAccordion %}

### Border and radius

`withBorder` draws a border around the card; `radius` rounds its corners:

{% notification title="Heads up" color="yellow" withBorder=true radius="lg" %}
A border and a yellow accent line, with extra corner rounding.
{% endNotification %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% notification title="Heads up" color="yellow" withBorder=true radius="lg" %}
A border and a yellow accent line, with extra corner rounding.
{% endNotification %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'notification', title='Heads up', color='yellow',
          withBorder=True, radius='lg',
          children='A border and a yellow accent line, with extra corner rounding.')
```
{% endAccordionSection %}
{% endAccordion %}

### Loading

`loading` swaps the accent line for a spinner — use it for an in-progress
message:

{% notification title="Uploading…" loading=true %}
Your files are being processed.
{% endNotification %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% notification title="Uploading…" loading=true %}
Your files are being processed.
{% endNotification %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'notification', title='Uploading…', loading=True,
          children='Your files are being processed.')
```
{% endAccordionSection %}
{% endAccordion %}

### Close button

`withCloseButton` shows a close button. It's decorative here (a static page has no
dismiss handler), so it's off by default:

{% notification title="Dismissible" color="blue" withCloseButton=true %}
Pass `withCloseButton=true` to show the button.
{% endNotification %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% notification title="Dismissible" color="blue" withCloseButton=true %}
Pass `withCloseButton=true` to show the button.
{% endNotification %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'notification', title='Dismissible', color='blue',
          withCloseButton=True,
          children='Pass `withCloseButton=true` to show the button.')
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

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | Any string | Optional bold heading shown above the message. |
| `text` | Any string | The message, when not using the block body. |
| `color` | Any theme color (`blue`, `green`, `red`, …) or a CSS color value | Color of the accent line. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or a CSS value | Corner rounding of the card. |
| `withCloseButton` | bool (default `false`) | Show a close button. Decorative here — it has no dismiss handler on a static page. |
| `withBorder` | bool (default `false`) | Draw a border around the card. |
| `loading` | bool (default `false`) | Replace the accent line with a spinner. |
| *(body)* | Markdown | The message, written between the tags (`children=` from Python). Falls back to `text` when empty. |


## CSS Selectors

Each `notification` carries `data-aardvark-island="Notification"` on its wrapper, and Mantine exposes its parts as `mantine-Notification-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Notification"] {
  /* style every notification on the page */
}

.mantine-Notification-root {
  /* the root part */
}

.mantine-Notification-title {
  /* the title part */
}

.mantine-Notification-description {
  /* the description part */
}

.mantine-Notification-closeButton {
  /* the closeButton part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% notification title="Changes saved" color="green" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Your settings were updated.
{% endNotification %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% notification title="Changes saved" color="green" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Your settings were updated.
{% endNotification %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'notification', title='Changes saved', color='green',
          children='Your settings were updated.', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
