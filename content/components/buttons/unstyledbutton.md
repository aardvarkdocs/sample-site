---
title: "UnstyledButton"
description: "The built-in unstyledbutton tag — Mantine's UnstyledButton: a clean,
  accessible button (or link) with no visual styles, for you to style yourself. Forwards
  the Mantine spacing / color / sizing system, id, onclick, and link attributes."
---

# UnstyledButton

`{% raw %}{% unstyledbutton %}{% endraw %}` is a **built-in** tag for a **button with no
styles** — Mantine's UnstyledButton. It renders a real, accessible `<button>`
(keyboard-focusable, correct semantics) with **none** of Mantine's button chrome, so you
can paint it however you like with the Mantine style props or your own CSS.

Use it as `{% raw %}{% unstyledbutton %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'unstyledbutton', …)`.

{% unstyledbutton text='A plain, accessible button' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% unstyledbutton text='A plain, accessible button' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', text='A plain, accessible button')
```
{% endAccordionSection %}
{% endAccordion %}

## Label

Give the label inline with `text`, or as the block body when it wraps other markup. In
Python, pass the body as `children`.

{% unstyledbutton text='Inline label' %} {% unstyledbutton %}Block label{% endUnstyledbutton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% unstyledbutton text='Inline label' %}
{% unstyledbutton %}Block label{% endUnstyledbutton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', text='Inline label')
component('aardvark', 'unstyledbutton', children='Block label')
```
{% endAccordionSection %}
{% endAccordion %}

## Style it yourself

The whole point is that you supply the look. The Mantine style props are forwarded —
padding (`p`, `px`, …), background (`bg`), text color (`c`), sizing (`w`, `h`), and the rest
— so you can build a custom button inline:

{% unstyledbutton text='Custom' bg='grape.6' c='white' px='md' py='xs' %} {% unstyledbutton text='Bordered' c='grape' px='md' py='xs' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% unstyledbutton text='Custom' bg='grape.6' c='white' px='md' py='xs' %}
{% unstyledbutton text='Bordered' c='grape' px='md' py='xs' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', text='Custom', bg='grape.6', c='white', px='md', py='xs')
component('aardvark', 'unstyledbutton', text='Bordered', c='grape', px='md', py='xs')
```
{% endAccordionSection %}
{% endAccordion %}

For anything more involved, reach for a [snippet](/authoring/custom-components/) or a CSS
class via `id`.

## Link mode

Set `url` and it renders as a link (`<a href>`) instead of a `<button>`: it navigates on
click and works without JavaScript. `target`, `rel`, and `download` pass through.

{% unstyledbutton text='Go to components' url='/components/' c='grape' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% unstyledbutton text='Go to components' url='/components/' c='grape' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', text='Go to components', url='/components/', c='grape')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because it carries no chrome of its own, an unstyled button is the right base for a fully
custom clickable surface — here a whole row in a [card](/components/data-display/card/),
styled inline:

{% card title='Recent activity' %}
{% unstyledbutton url='/components/' c='grape' p='xs' w='100%' %}View all 24 events →{% endUnstyledbutton %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Recent activity' %}
{% unstyledbutton url='/components/' c='grape' p='xs' w='100%' %}View all 24 events →{% endUnstyledbutton %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', children='View all 24 events →',
          url='/components/', c='grape', p='xs', w='100%')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | string | Label, when not using the block body. |
| `url` | relative path or `http(s)://` URL | Render as a link (`<a href>`). `javascript:`/`data:`/`vbscript:`/`file:`/`blob:` schemes are rejected at build time. |
| `target` | e.g. `_blank` | Where to open the link (link mode). |
| `rel` | e.g. `noopener noreferrer` | Link relationship (link mode). |
| `download` | filename string | Suggest a filename for the linked file (link mode). |
| `id` | string | HTML `id` on the rendered button (or `<a>`). |
| `onclick` | JS expression string | JavaScript run on click. In Python pass `attr={'onclick': '…'}`. |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | size token or CSS value | Margin (Mantine spacing system). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | size token or CSS value | Padding (Mantine spacing system). |
| `bg`, `c` | color | Background, text color. |
| `w`, `h`, `miw`, `mih`, `maw`, `mah` | size token or CSS value | Width / height / min / max. |

## CSS Selectors

Each button mounts inside an island wrapper carrying `data-aardvark-island="UnstyledButton"`; Mantine's Styles API exposes the (chrome-free) root element.

{% raw %}
```css
[data-aardvark-island="UnstyledButton"]  /* the island wrapper */
.mantine-UnstyledButton-root             /* the rendered <button> / <a> */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered
button. The `onclick` shortcut is the common case: set `onclick` to a JavaScript expression
and it runs on click. In Python, `onclick` rides this same channel — pass `attr={'onclick': '…'}`.

{% unstyledbutton text='Click me' onclick="(() => alert('Hi!'))()" c='grape' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% unstyledbutton text='Click me' onclick="(() => alert('Hi!'))()" c='grape' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', text='Click me', c='grape',
          attr={'onclick': "(() => alert('Hi!'))()"})
```
{% endAccordionSection %}
{% endAccordion %}

For any other attribute — `data-*`, ARIA, or a full multi-line handler — pass the `attr={…}`
dict directly:

{% unstyledbutton text='A plain, accessible button' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% unstyledbutton text='A plain, accessible button' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'unstyledbutton', text='A plain, accessible button', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

(See the [{% raw %}`{% button %}`{% endraw %}](/components/buttons/button/) page's note about
`onclick` as a stored-XSS surface on multi-author sites, and the site-wide `attrPolicy`.)
