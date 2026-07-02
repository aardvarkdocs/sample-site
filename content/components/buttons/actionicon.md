---
title: "ActionIcon"
description: "The built-in actionicon tag — Mantine's icon-only button. Render any icon
  (Tabler, Font Awesome, image, emoji, or inline SVG) with the full ActionIcon surface:
  variant, color, size, radius, loading, disabled, gradient, plus link mode and onclick."
---

# ActionIcon

`{% raw %}{% actionicon %}{% endraw %}` is a **built-in** tag for an **icon-only button** —
a compact, square button whose whole content is a single icon. It renders a Mantine
ActionIcon, so it carries that component's full surface. The `icon` is read exactly like
the [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) tag, and an icon-only
button needs a `label` for its accessible name.

Use it as `{% raw %}{% actionicon %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'actionicon', …)`.

{% actionicon icon='heart' variant='filled' color='red' label='Like' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='heart' variant='filled' color='red' label='Like' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='heart', variant='filled', color='red', label='Like')
```
{% endAccordionSection %}
{% endAccordion %}

## The icon

The `icon` is any [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/) spec:

- a **[Tabler](https://tabler.io/icons) name** — a bare lowercase name like `settings` or `brand-github`;
- a **[Font Awesome](https://fontawesome.com/icons) class** — `fa-solid fa-gear`;
- a path/URL to an **image** — `/icons/logo.svg`;
- an **emoji** — `🔍`.

Set `filled` to use the filled Tabler style for a bare Tabler name.

{% actionicon icon='settings' label='Settings' variant='default' %} {% actionicon icon='brand-github' label='GitHub' variant='default' %} {% actionicon icon='fa-solid fa-gear' label='Settings' variant='default' %} {% actionicon icon='🔍' label='Search' variant='default' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='settings' label='Settings' variant='default' %}
{% actionicon icon='brand-github' label='GitHub' variant='default' %}
{% actionicon icon='fa-solid fa-gear' label='Settings' variant='default' %}
{% actionicon icon='🔍' label='Search' variant='default' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='settings', label='Settings', variant='default')
component('aardvark', 'actionicon', icon='brand-github', label='GitHub', variant='default')
component('aardvark', 'actionicon', icon='fa-solid fa-gear', label='Settings', variant='default')
component('aardvark', 'actionicon', icon='🔍', label='Search', variant='default')
```
{% endAccordionSection %}
{% endAccordion %}

## Accessible name

An icon-only button has no visible text, so screen readers can't name it. Always pass a
`label` — it becomes the button's `aria-label`.

{% actionicon icon='trash' color='red' label='Delete item' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='trash' color='red' label='Delete item' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='trash', color='red', label='Delete item')
```
{% endAccordionSection %}
{% endAccordion %}

## Variant

`variant` is one of `filled`, `light` (default), `outline`, `subtle`, `transparent`,
`white`, `default`, or `gradient`.

{% actionicon icon='star' variant='filled' label='filled' %} {% actionicon icon='star' variant='light' label='light' %} {% actionicon icon='star' variant='outline' label='outline' %} {% actionicon icon='star' variant='subtle' label='subtle' %} {% actionicon icon='star' variant='default' label='default' %} {% actionicon icon='star' variant='transparent' label='transparent' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='star' variant='filled' label='filled' %}
{% actionicon icon='star' variant='light' label='light' %}
{% actionicon icon='star' variant='outline' label='outline' %}
{% actionicon icon='star' variant='subtle' label='subtle' %}
{% actionicon icon='star' variant='default' label='default' %}
{% actionicon icon='star' variant='transparent' label='transparent' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for v in ('filled', 'light', 'outline', 'subtle', 'default', 'transparent'):
    component('aardvark', 'actionicon', icon='star', variant=v, label=v)
```
{% endAccordionSection %}
{% endAccordion %}

### Gradient

`variant='gradient'` takes `gradientFrom`, `gradientTo`, and `gradientDeg` (degrees).

{% actionicon icon='bolt' variant='gradient' gradientFrom='orange' gradientTo='red' gradientDeg=45 label='Sunset' %} {% actionicon icon='bolt' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 label='Indigo to cyan' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='bolt' variant='gradient' gradientFrom='orange' gradientTo='red' gradientDeg=45 label='Sunset' %}
{% actionicon icon='bolt' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 label='Indigo to cyan' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='bolt', variant='gradient',
          gradientFrom='orange', gradientTo='red', gradientDeg=45, label='Sunset')
component('aardvark', 'actionicon', icon='bolt', variant='gradient',
          gradientFrom='indigo', gradientTo='cyan', gradientDeg=90, label='Indigo to cyan')
```
{% endAccordionSection %}
{% endAccordion %}

## Color, size, and radius

`color` takes any theme color or a CSS color. `size` accepts the Mantine tokens
(`xs`–`xl`); `radius` accepts `xs`–`xl` or any CSS value. `autoContrast` auto-picks a
glyph color that meets contrast against the button background.

{% actionicon icon='heart' color='grape' label='grape' %} {% actionicon icon='heart' color='teal' label='teal' %} {% actionicon icon='heart' size='lg' radius='xl' label='lg + xl radius' %} {% actionicon icon='heart' size='xl' label='xl' %} {% actionicon icon='heart' color='yellow' autoContrast label='autoContrast' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='heart' color='grape' label='grape' %}
{% actionicon icon='heart' color='teal' label='teal' %}
{% actionicon icon='heart' size='lg' radius='xl' label='lg + xl radius' %}
{% actionicon icon='heart' size='xl' label='xl' %}
{% actionicon icon='heart' color='yellow' autoContrast label='autoContrast' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='heart', color='grape', label='grape')
component('aardvark', 'actionicon', icon='heart', color='teal', label='teal')
component('aardvark', 'actionicon', icon='heart', size='lg', radius='xl', label='lg + xl radius')
component('aardvark', 'actionicon', icon='heart', size='xl', label='xl')
component('aardvark', 'actionicon', icon='heart', color='yellow', autoContrast=True, label='autoContrast')
```
{% endAccordionSection %}
{% endAccordion %}

## Loading and disabled

`loading` shows a spinner (and blocks clicks); `disabled` renders the button disabled.

{% actionicon icon='check' loading=true label='Saving' %} {% actionicon icon='check' disabled=true label='Disabled' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='check' loading=true label='Saving' %}
{% actionicon icon='check' disabled=true label='Disabled' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='check', loading=True, label='Saving')
component('aardvark', 'actionicon', icon='check', disabled=True, label='Disabled')
```
{% endAccordionSection %}
{% endAccordion %}

## Link mode

Set `url` and the button renders as a link (`<a href>`): it navigates on click and works
without JavaScript. `target`, `rel`, and `download` pass through, exactly as on
[{% raw %}`{% button %}`{% endraw %}](/components/buttons/button/).

{% actionicon icon='brand-github' variant='default' url='https://github.com' target='_blank' rel='noopener noreferrer' label='GitHub' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='brand-github' variant='default' url='https://github.com' target='_blank' rel='noopener noreferrer' label='GitHub' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='brand-github', variant='default',
          url='https://github.com', target='_blank', rel='noopener noreferrer', label='GitHub')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Icon-only buttons are the natural toolbar control — group several in a
`{% raw %}{% group %}{% endraw %}` next to a heading:

{% group gap='xs' %}
{% actionicon icon='edit' variant='subtle' label='Edit' %}
{% actionicon icon='copy' variant='subtle' label='Duplicate' %}
{% actionicon icon='trash' variant='subtle' color='red' label='Delete' %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group gap='xs' %}
{% actionicon icon='edit' variant='subtle' label='Edit' %}
{% actionicon icon='copy' variant='subtle' label='Duplicate' %}
{% actionicon icon='trash' variant='subtle' color='red' label='Delete' %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='edit', variant='subtle', label='Edit')
component('aardvark', 'actionicon', icon='copy', variant='subtle', label='Duplicate')
component('aardvark', 'actionicon', icon='trash', variant='subtle', color='red', label='Delete')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default. Bare boolean flags (`filled`, `loading`,
`disabled`, `autoContrast`) set the option to `True`; in Python pass `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `icon` | Tabler name / Font Awesome class / image path / emoji / inline `<svg>` | The icon spec, read like [{% raw %}`{% icon %}`{% endraw %}](/components/data-display/icon/). |
| `filled` | bool flag | Use the filled Tabler style for a bare Tabler name. |
| `label` | string | Accessible name (`aria-label`) — always set this. |
| `variant` | `filled`, `light` (default), `outline`, `subtle`, `transparent`, `white`, `default`, `gradient` | Visual style. |
| `color` | theme color name or CSS color | Button color. |
| `size` | `xs`–`xl` | Button size. |
| `radius` | `xs`–`xl` or any CSS value | Corner radius. |
| `loading` | bool flag | Show a spinner and block clicks. |
| `disabled` | bool flag | Render disabled. |
| `autoContrast` | bool flag | Auto-pick a glyph color that meets contrast. |
| `url` | relative path or `http(s)://` URL | Render as a link (`<a href>`). `javascript:`/`data:`/`vbscript:`/`file:`/`blob:` schemes are rejected at build time. |
| `target` | e.g. `_blank` | Where to open the link (link mode). |
| `rel` | e.g. `noopener noreferrer` | Link relationship (link mode). |
| `download` | filename string | Suggest a filename for the linked file (link mode). |
| `id` | string | HTML `id` on the rendered button (or `<a>`). |
| `onclick` | JS expression string | JavaScript run on click. In Python pass `attr={'onclick': '…'}`. |
| `gradientFrom` | color | Start color (`variant='gradient'`). |
| `gradientTo` | color | End color (`variant='gradient'`). |
| `gradientDeg` | number (degrees) | Angle (`variant='gradient'`). |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | size token or CSS value | Margin (Mantine spacing system). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | size token or CSS value | Padding (Mantine spacing system). |

## CSS Selectors

Each action icon mounts inside an island wrapper carrying `data-aardvark-island="ActionIcon"`; Mantine's Styles API exposes the button root, the icon slot, and the loading overlay.

{% raw %}
```css
[data-aardvark-island="ActionIcon"]  /* the island wrapper */
.mantine-ActionIcon-root             /* the <button> */
.mantine-ActionIcon-icon             /* the icon slot */
.mantine-ActionIcon-loader           /* the loading spinner (loading=true) */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered
button. The `onclick` shortcut is the common case: set `onclick` to a JavaScript expression
and it runs when the button is clicked. In Python, `onclick` rides this same channel — pass
`attr={'onclick': '…'}`.

{% actionicon icon='bell' onclick="(() => alert('Ding!'))()" label='Ring' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='bell' onclick="(() => alert('Ding!'))()" label='Ring' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='bell', label='Ring',
          attr={'onclick': "(() => alert('Ding!'))()"})
```
{% endAccordionSection %}
{% endAccordion %}

For any other attribute — `data-*`, ARIA, or a full multi-line handler — pass the `attr={…}`
dict directly:

{% actionicon icon='heart' variant='filled' color='red' label='Like' attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% actionicon icon='heart' variant='filled' color='red' label='Like' attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'actionicon', icon='heart', variant='filled', color='red', label='Like',
          attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

(See the [{% raw %}`{% button %}`{% endraw %}](/components/buttons/button/) page's note about
`onclick` as a stored-XSS surface on multi-author sites, and the site-wide `attrPolicy`.)
