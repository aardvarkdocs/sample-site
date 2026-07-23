---
title: "FileButton"
description: "The built-in filebutton tag — a button that opens the native file picker.
  Constrain file types with accept, allow several with multiple. A client-side demo
  (it does not upload)."
---

# FileButton

`{% raw %}{% filebutton %}{% endraw %}` is a **built-in** tag for a **file-picker button**.
Clicking it opens the browser's native file dialog; the chosen file name appears beside the
button.

Use it as `{% raw %}{% filebutton %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'filebutton', …)`.

{% filebutton label='Upload a file' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% filebutton label='Upload a file' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'filebutton', label='Upload a file')
```
{% endAccordionSection %}
{% endAccordion %}

{% callout severity='caution' title='Demo only — no upload' %}
This tag is a **client-side demo**: it opens the picker and shows the selected file name,
but it does **not** upload anywhere — wiring a file to a server needs JavaScript you write.
Like `CopyButton`, Mantine's `FileButton` is a **render-prop** component (its child is a
`(props) => …` function), which a build-time Markdown tag can't author, so this tag supplies
the picker-and-name UI for you. For real uploads, write a
[snippet](/authoring/custom-components/) — a small React component where you hold the
render-prop and can send the chosen file wherever you like.
{% endCallout %}

## Limit file types

`accept` is a standard HTML accept string — MIME types or extensions, comma-separated.

{% filebutton label='Pick an image' accept='image/png,image/jpeg' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% filebutton label='Pick an image' accept='image/png,image/jpeg' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'filebutton', label='Pick an image', accept='image/png,image/jpeg')
```
{% endAccordionSection %}
{% endAccordion %}

## Multiple files

Set `multiple` to let the picker select several files at once.

{% filebutton label='Pick files' multiple=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% filebutton label='Pick files' multiple=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'filebutton', label='Pick files', multiple=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Appearance

`variant`, `color`, `size`, and `radius` style the button.

{% filebutton label='light' variant='light' %} {% filebutton label='outline grape' variant='outline' color='grape' %} {% filebutton label='lg' size='lg' radius='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% filebutton label='light' variant='light' %}
{% filebutton label='outline grape' variant='outline' color='grape' %}
{% filebutton label='lg' size='lg' radius='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'filebutton', label='light', variant='light')
component('aardvark', 'filebutton', label='outline grape', variant='outline', color='grape')
component('aardvark', 'filebutton', label='lg', size='lg', radius='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair the picker with a hint in a [card](/components/data-display/card/) to frame what's
expected:

{% card title='Attach your avatar' %}
PNG or JPEG, up to 2 MB.

{% filebutton label='Choose image' accept='image/png,image/jpeg' variant='light' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Attach your avatar' %}
PNG or JPEG, up to 2 MB.

{% filebutton label='Choose image' accept='image/png,image/jpeg' variant='light' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'filebutton', label='Choose image',
          accept='image/png,image/jpeg', variant='light')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. The bare boolean flag `multiple` sets the option to
`True`; in Python pass `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | Button text. |
| `accept` | HTML accept string (MIME types / extensions, comma-separated) | Limit the picker to certain file types. |
| `multiple` | bool flag | Allow selecting several files. |
| `variant` | `filled`, `light`, `outline`, `subtle`, `default`, `transparent`, `white` | Visual style. |
| `color` | theme color name or CSS color | Button color. |
| `size` | `xs`–`xl` | Button size. |
| `radius` | `xs`–`xl` or any CSS value | Corner radius. |

For a custom trigger or to actually handle the chosen file, write a
[snippet](/authoring/custom-components/) — inside your own React component you get Mantine's
`FileButton` render-prop in full.

## CSS Selectors

The picker mounts inside an island wrapper carrying `data-aardvark-island="FileButton"`; it renders a Mantine `Button` next to the chosen file name, laid out in a Mantine `Group`.

{% raw %}
```css
[data-aardvark-island="FileButton"]  /* the island wrapper */
.mantine-Group-root                  /* the button + filename row */
.mantine-Button-root                 /* the picker <button> */
.mantine-Button-label                /* the button text */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered button.

{% filebutton label='Upload a file' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% filebutton label='Upload a file' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'filebutton', label='Upload a file', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
