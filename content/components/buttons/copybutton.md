---
title: "CopyButton"
description: "The built-in copybutton tag — a button that copies a value to the clipboard
  and swaps its label to a confirmation. Customize the labels, timeout, and Button look."
---

# CopyButton

`{% raw %}{% copybutton %}{% endraw %}` is a **built-in** tag for a **copy-to-clipboard
button**. Set `value` to the text to copy; on click it writes that value to the clipboard
and briefly swaps its label to a confirmation that the copy succeeded.

Use it as `{% raw %}{% copybutton %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'copybutton', …)`.

{% copybutton value='npm install aardvark' label='Copy command' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% copybutton value='npm install aardvark' label='Copy command' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'copybutton', value='npm install aardvark', label='Copy command')
```
{% endAccordionSection %}
{% endAccordion %}

{% callout severity='info' title='Render-prop component, simplified' %}
Mantine's `CopyButton` is a **render-prop** component — its child is a
`({ copied, copy }) => …` function, which a build-time Markdown tag can't author. This tag
provides the common case for you: a button (with a hover tooltip) that copies `value` and
confirms. For a fully custom trigger, write a [snippet](/authoring/custom-components/) — a
small React component where you have the render-prop in hand.
{% endCallout %}

## Labels and timeout

`label` is the resting text; `copiedLabel` is shown after a copy; `timeout` (ms) controls
how long the confirmation stays before reverting.

{% copybutton value='hello@example.com' label='Copy email' copiedLabel='Copied!' timeout=2000 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% copybutton value='hello@example.com' label='Copy email' copiedLabel='Copied!' timeout=2000 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'copybutton', value='hello@example.com', label='Copy email',
          copiedLabel='Copied!', timeout=2000)
```
{% endAccordionSection %}
{% endAccordion %}

## Appearance

`variant`, `color`, `size`, and `radius` style the button (it turns teal on a successful
copy regardless).

{% copybutton value='one' variant='light' label='light' %} {% copybutton value='two' variant='outline' color='grape' label='outline grape' %} {% copybutton value='three' size='lg' radius='xl' label='lg + xl radius' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% copybutton value='one' variant='light' label='light' %}
{% copybutton value='two' variant='outline' color='grape' label='outline grape' %}
{% copybutton value='three' size='lg' radius='xl' label='lg + xl radius' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'copybutton', value='one', variant='light', label='light')
component('aardvark', 'copybutton', value='two', variant='outline', color='grape', label='outline grape')
component('aardvark', 'copybutton', value='three', size='lg', radius='xl', label='lg + xl radius')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Drop a copy button next to a value you want readers to grab — here paired with the value in
a [code](/components/typography/code/) span inside a `{% raw %}{% group %}{% endraw %}`:

{% group gap='xs' %}
{% code %}aardvark_live_a1b2c3{% endCode %}
{% copybutton value='aardvark_live_a1b2c3' label='Copy key' copiedLabel='Copied' size='xs' %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group gap='xs' %}
{% code %}aardvark_live_a1b2c3{% endCode %}
{% copybutton value='aardvark_live_a1b2c3' label='Copy key' copiedLabel='Copied' size='xs' %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'copybutton', value='aardvark_live_a1b2c3',
          label='Copy key', copiedLabel='Copied', size='xs')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | string | The text copied to the clipboard. |
| `label` | string | Resting button text. |
| `copiedLabel` | string | Text shown briefly after a copy. |
| `timeout` | integer (milliseconds) | How long the confirmation stays before reverting. |
| `variant` | `filled`, `light`, `outline`, `subtle`, `default`, `transparent`, `white` | Visual style. |
| `color` | theme color name or CSS color | Button color. |
| `size` | `xs`–`xl` | Button size. |
| `radius` | `xs`–`xl` or any CSS value | Corner radius. |

For a custom trigger element, write a [snippet](/authoring/custom-components/) — inside your
own React component you get Mantine's `CopyButton` render-prop in full.

## CSS Selectors

The button mounts inside an island wrapper carrying `data-aardvark-island="CopyButton"` and renders a Mantine `Button`, so Mantine's Button Styles API classes apply to the rendered element.

{% raw %}
```css
[data-aardvark-island="CopyButton"]  /* the island wrapper */
.mantine-Button-root                 /* the rendered <button> */
.mantine-Button-label                /* the resting / confirmation text */
.mantine-Button-inner                /* the content row */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered button.

{% copybutton value='npm install aardvark' label='Copy command' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% copybutton value='npm install aardvark' label='Copy command' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'copybutton', value='npm install aardvark', label='Copy command', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
