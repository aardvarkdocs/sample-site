---
title: "Dropzone"
description: "The built-in dropzone tag — a drag-and-drop file upload zone with a built-in drag-state overlay. Usage, the accept/maxSize props, a live example, CSS selectors, and injecting attributes."
---

# Dropzone

A **drag-and-drop file upload zone**: drop files onto it, or click it to open the native file
picker. It shows a built-in drag-state overlay (an accept/reject tint as files hover) and hydrates
into an interactive island. Reach for it when a file field needs a generous drop target rather than
the compact [FileInput](/components/inputs/fileinput/) button.

Restrict what it takes with `accept` (a comma-separated MIME list or a JSON array), cap file size
with `maxSize` (bytes), and toggle `multiple`, `loading`, and `disabled`. The block body is the
zone's resting content — the prompt a visitor sees before they drag anything in.

Use it as `{% raw %}{% dropzone %}…{% endDropzone %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'dropzone', …)`.

## A basic zone

The block body is the prompt; `accept` and `maxSize` constrain what may be dropped.

{% dropzone accept='image/png,image/jpeg' maxSize=5242880 h='180' %}
**Drag images here** or click to choose — PNG or JPEG, up to 5&nbsp;MB.
{% endDropzone %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dropzone accept='image/png,image/jpeg' maxSize=5242880 h='180' %}
**Drag images here** or click to choose — PNG or JPEG, up to 5&nbsp;MB.
{% endDropzone %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dropzone',
          accept='image/png,image/jpeg', maxSize=5242880, h='180',
          children='**Drag images here** or click to choose — PNG or JPEG, up to 5 MB.')
```
{% endAccordionSection %}
{% endAccordion %}

## Single file, disabled, and loading

`multiple` is on by default; set `multiple=false` for a one-file zone. `loading` overlays a spinner
and `disabled` greys the zone out and stops it capturing files.

{% dropzone multiple=false accept='application/pdf' %}
Drop a single **PDF**, or click to browse.
{% endDropzone %}

{% dropzone disabled=true %}
Uploads are paused right now.
{% endDropzone %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dropzone multiple=false accept='application/pdf' %}
Drop a single **PDF**, or click to browse.
{% endDropzone %}

{% dropzone disabled=true %}
Uploads are paused right now.
{% endDropzone %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dropzone', multiple=False, accept='application/pdf',
          children='Drop a single **PDF**, or click to browse.')

component('aardvark', 'dropzone', disabled=True,
          children='Uploads are paused right now.')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `accept` | MIME list (`image/png,image/jpeg`) or a JSON array | Restrict accepted file types; omit to accept any file. |
| `maxSize` | integer (bytes) | Maximum size of a single file. |
| `multiple` | bool (`true` / `false`) | Allow several files at once (default `true`). |
| `loading` | bool (`true` / `false`) | Show a loading overlay over the zone. |
| `disabled` | bool (`true` / `false`) | Disable file capturing and grey the zone out. |
| `radius` | `xs`–`xl` or a CSS length | Corner radius. |
| `h` | number or CSS length | Height of the zone. |
| `minHeight` | number or CSS length | Minimum height of the zone. |
| `maw` | number or CSS length | Maximum width of the zone. |
| `name` | string | Form control name submitted with the value. |

## CSS Selectors

The tag mounts as an island, so its rendered markup carries the island's data attributes plus
Mantine's own component classes — target either to restyle a zone. The outer mount element exposes
`data-aardvark-island` (the bare component name) and, because the zone resolves through the
`dropzone` component library, a separate `data-aardvark-lib`:

{% raw %}
```css
/* Every dropzone on the page (the island mount element) */
[data-aardvark-island="Dropzone"] {
  border-style: dashed;
}

/* Only zones that resolve through the dropzone library */
[data-aardvark-lib="dropzone"][data-aardvark-island="Dropzone"] {
  --dropzone-radius: 12px;
}

/* Mantine's own classes on the hydrated element */
.mantine-Dropzone-root {
  background: var(--mantine-color-gray-0);
}
.mantine-Dropzone-inner {
  padding: 2rem;
}
```
{% endraw %}

## Injecting Attributes

Pass an `attr` map to set raw HTML attributes (or inline handlers) on the zone's rendered root
element — useful for hooks your own scripts read, analytics ids, or data attributes:

{% dropzone attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Drop files here{% endDropzone %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dropzone attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}Drop files here{% endDropzone %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dropzone', children='Drop files here', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
