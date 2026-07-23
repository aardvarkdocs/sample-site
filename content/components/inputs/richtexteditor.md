---
title: "RichTextEditor"
description: "A live in-page rich-text editor — a formatting toolbar over an editable document, backed by Tiptap and @mantine/tiptap. Usage, the content seed, CSS selectors, and attribute injection."
---

# RichTextEditor

A **live rich-text editor** you drop straight into a page: a formatting toolbar above an
editable document area. The toolbar buttons reflect and toggle the current selection's
formatting — **bold**, *italic*, underline — turn the current block into a bullet list, and
attach or remove a link. Typing, selecting, and the usual keyboard shortcuts
(`Cmd`/`Ctrl`+`B`, `+I`, `+U`) all drive the same document.

The editor is a runtime object — a Tiptap instance built from `useEditor()`, with its own
document model and command chain — so it can't be produced from Markdown attributes the way a
plain field is. It ships instead as a **project snippet**
(`snippets/RichTextEditor.jsx`), which Aardvark exposes as the `{% raw %}{% RichTextEditor %}{% endraw %}`
tag automatically. It renders a placeholder during the build and hydrates into the interactive
editor in the browser.

## A live editor

`content` seeds the initial document. Pass an HTML string; Tiptap parses it into the document
model, so inline formatting in the seed survives into the editable view.

{% RichTextEditor content='<p>Hello <strong>world</strong></p>' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% RichTextEditor content='<p>Hello <strong>world</strong></p>' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('RichTextEditor', content='<p>Hello <strong>world</strong></p>')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `content` | HTML string (e.g. `<p>Hi <strong>there</strong></p>`) | Seeds the initial document; parsed into the editor's model client-side. Defaults to an empty document. |
| `attr` | `{ ... }` (a dict) | Raw HTML attributes injected onto the editor's root element — see [Injecting Attributes](#injecting-attributes). |

## CSS Selectors

The tag emits a hydration island wrapper, and the editor inside carries Mantine's
`RichTextEditor` Styles API class names. Target the wrapper to position or frame the whole
widget, and the inner classes to restyle the toolbar or the editable area:

{% raw %}
```css
/* The island wrapper the tag emits (the snippet's outermost node). */
[data-aardvark-island="RichTextEditor"] {
  max-width: 640px;
}

/* The editor root, toolbar, and editable content area. */
.mantine-RichTextEditor-root {
  border-radius: var(--mantine-radius-md);
}
.mantine-RichTextEditor-toolbar {
  /* the sticky bar of formatting controls */
}
.mantine-RichTextEditor-content {
  min-height: 200px; /* the editable document area */
}
```
{% endraw %}

## Injecting Attributes

`attr` forwards a dict of raw HTML attributes onto the editor's **root** element. The snippet
forwards its `ref` to that node, so anything in `attr` — `id`, `data-*`, `style`, an inline
handler — lands directly on the `.mantine-RichTextEditor-root` element. Here it is wired to
`onchange`, so when an edit is committed on blur, the handler reads the editor HTML, logs it to
the console, and alerts it:

{% RichTextEditor content='<p>x</p>' attr={'onchange': '''
const editor = event.target.closest('[contenteditable="true"]') || this.querySelector('[contenteditable="true"]');
const value = this.value || this.dataset.aardvarkValue || (editor ? editor.innerHTML : '');
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% RichTextEditor content='<p>x</p>' attr={'onchange': '''
const editor = event.target.closest('[contenteditable="true"]') || this.querySelector('[contenteditable="true"]');
const value = this.value || this.dataset.aardvarkValue || (editor ? editor.innerHTML : '');
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('RichTextEditor', content='<p>x</p>', attr={'onchange': '''
const editor = event.target.closest('[contenteditable="true"]') || this.querySelector('[contenteditable="true"]');
const value = this.value || this.dataset.aardvarkValue || (editor ? editor.innerHTML : '');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
