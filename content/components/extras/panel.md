---
title: "Panel"
description: "The built-in panel tag — a supplementary side panel that floats beside the main content on a wide screen and stacks below it on a narrow one. Usage, options, and live examples."
---

# Panel

`panel` is a **supplementary side panel** — a bordered, subtly-raised surface for secondary
content that sits *beside* the main text. Use it for a "see also", an API note, related links, or
any aside that supports the main flow without interrupting it. On a wide screen the panel floats to
one side and the surrounding text wraps alongside it; on a narrow screen it drops into place as a
full-width block. It ships with aardvark, so a side panel is a single tag with no setup.

The block body is the panel content (any Markdown), and an optional `title` renders a small heading
above it. Use it as `{% raw %}{% panel %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'panel', …)`. Close it with
`{% raw %}{% endPanel %}{% endraw %}`.

## Demonstrations

A titled panel floats to the right by default, and the main content wraps around it:

{% panel title="See also" %}
Related reading:

- [The layout overview](/components/layout/)
- [Paper surfaces](/components/layout/paper/)
- [The AppShell](/components/layout/appshell/)
{% endPanel %}

The panel keeps secondary material close to the text it supports without pushing it out of the way.
On a wide viewport it floats beside this paragraph; shrink the window and it stacks into a
full-width block above this text instead. This is the whole point of a side panel — it stays out of
the main reading path while remaining a glance away, and the responsive stacking means it never
crushes the prose on a phone.

<br clear="all">

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% panel title="See also" %}
Related reading:

- [The layout overview](/components/layout/)
- [Paper surfaces](/components/layout/paper/)
- [The AppShell](/components/layout/appshell/)
{% endPanel %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'panel',
    title='See also',
    children=(
        'Related reading:\n\n'
        '- [The layout overview](/components/layout/)\n'
        '- [Paper surfaces](/components/layout/paper/)\n'
        '- [The AppShell](/components/layout/appshell/)'),
)
```
{% endAccordionSection %}
{% endAccordion %}

### Float to the left

Set `side="left"` to float the panel to the left edge instead:

{% panel title="Note" side="left" %}
A panel can float to **either** side — pick whichever keeps it nearest the content it supports.
{% endPanel %}

The surrounding paragraph flows around whichever side the panel takes. Left-floating panels read
well next to a list or a definition that the panel annotates, since the eye reaches the panel before
the text it comments on. As with the default right float, the panel drops below the text as a
full-width block once the viewport is too narrow to sit prose beside it.

<br clear="all">

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% panel title="Note" side="left" %}
A panel can float to **either** side — pick whichever keeps it nearest the content it supports.
{% endPanel %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'panel',
    title='Note', side='left',
    children='A panel can float to **either** side — pick whichever keeps it nearest the content it supports.',
)
```
{% endAccordionSection %}
{% endAccordion %}

## Without a title

`title` is optional — omit it for a plain surface:

{% panel %}
No heading here — just a raised surface for a quick aside.
{% endPanel %}

<br clear="all">

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% panel %}
No heading here — just a raised surface for a quick aside.
{% endPanel %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'panel',
          children='No heading here — just a raised surface for a quick aside.')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | Any string | Optional heading shown above the body. Omit it for a plain surface. |
| `side` | `right` (default), `left` | Which edge the panel floats to on a wide viewport. |
| `width` | Any CSS length (e.g. `18rem`, `40%`) | Cap the floated panel's width. Defaults to a comfortable column. |
| `shadow` | `xs` (default) / `sm` / `md` / `lg` / `xl` | Drop shadow / elevation. |
| `radius` | `xs`–`xl`, or any CSS value | Corner rounding (default `md`). |
| `withBorder` | bare flag or `true` / `false` (default `true`) | The 1px border. |
| `p` / `px` / `py` / `pt` / `pb` / `pl` / `pr` | Spacing token or any CSS value | Padding (defaults to `lg`). |
| `attr` | `{…}` | Raw HTML attributes forwarded onto the rendered element (see below). |
| *(body)* | Markdown | The panel content, written between `{% raw %}{% panel %}{% endraw %}` and `{% raw %}{% endPanel %}{% endraw %}` (`children=` from Python). |

## CSS Selectors

Each `panel` carries `data-aardvark-island="Panel"` on its wrapper, and the rendered Mantine Paper
exposes its root as `mantine-Paper-root` — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Panel"] {
  /* style every panel on the page */
}

[data-aardvark-island="Panel"] .aardvark-panel-title {
  /* the optional heading */
}

[data-aardvark-island="Panel"] .aardvark-panel-body {
  /* the Markdown body */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered
element.

{% panel title="Interactive" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click this panel to fire the handler.
{% endPanel %}

<br clear="all">

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% panel title="Interactive" attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
Click this panel to fire the handler.
{% endPanel %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'panel',
    title='Interactive',
    children='Click this panel to fire the handler.',
    attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''},
)
```
{% endAccordionSection %}
{% endAccordion %}
