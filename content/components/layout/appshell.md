---
title: "AppShell"
description: "The built-in appshell tag — a page-level layout shell that positions a header, navbar, aside, and footer around a main content area. Regions, sizes, layout modes, borders, and a full attribute reference."
---

# AppShell

`{% raw %}{% appshell %}{% endraw %}` is a **built-in** tag for a **page-level layout shell**.
It positions a header, navbar, aside, and footer around a main content area, the way an
application's chrome wraps its content. Each region is opt-in — you add one by setting its
text param — and the block body is the main content. Reach for it when you're scaffolding an
app-style layout or a self-contained demo of one.

Use it as `{% raw %}{% appshell %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'appshell', …)`.

{% callout severity='info' title='A self-contained frame' %}
AppShell is a page-level primitive whose header, navbar, aside, and footer are normally fixed
to the viewport. On an aardvark page (which already has its own header and sidebar) that would
take over the whole page, so the tag renders the shell inside a **bounded, self-contained
frame** — each live example below sits in its own box and never escapes it. Size the frame with
`height` (pixels, default 380).
{% endCallout %}

## Header and navbar

Set the `header` / `navbar` text params to add those regions; the block body is the main
content area, which sits to the right of the navbar and below the header. Sizes are in
pixels.

{% appshell header='My App' navbar='Navigation' headerHeight=56 navbarWidth=200 padding='md' %}
The main content area sits to the right of the navbar and below the header.
{% endAppshell %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% appshell header='My App' navbar='Navigation' headerHeight=56 navbarWidth=200 padding='md' %}
The main content area sits to the right of the navbar and below the header.
{% endAppshell %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'appshell', header='My App', navbar='Navigation',
          headerHeight=56, navbarWidth=200, padding='md',
          children='The main content area sits to the right of the navbar and below the header.')
```
{% endAccordionSection %}
{% endAccordion %}

## All four regions

Add `aside` (a right column) and `footer` (a bottom bar) the same way. A region only renders,
and only reserves its size, once its text param is set.

{% appshell header='Dashboard' navbar='Menu' aside='Details' footer='© 2026' headerHeight=48 footerHeight=40 navbarWidth=160 asideWidth=160 padding='md' %}
Header, navbar, aside, and footer all framing the main content.
{% endAppshell %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% appshell header='Dashboard' navbar='Menu' aside='Details' footer='© 2026' headerHeight=48 footerHeight=40 navbarWidth=160 asideWidth=160 padding='md' %}
Header, navbar, aside, and footer all framing the main content.
{% endAppshell %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'appshell', header='Dashboard', navbar='Menu',
          aside='Details', footer='© 2026', headerHeight=48, footerHeight=40,
          navbarWidth=160, asideWidth=160, padding='md',
          children='Header, navbar, aside, and footer all framing the main content.')
```
{% endAccordionSection %}
{% endAccordion %}

## Layout mode

`layout` controls how the regions stack. `default` (the default) offsets the main content so
the header, navbar, and aside frame it; `alt` makes the header and footer span the full width,
with the navbar and aside tucked beneath the header.

{% appshell header='Full-width header' navbar='Nav' footer='Full-width footer' layout='alt' headerHeight=48 footerHeight=40 navbarWidth=160 padding='md' %}
With layout='alt', the header and footer run edge to edge.
{% endAppshell %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% appshell header='Full-width header' navbar='Nav' footer='Full-width footer' layout='alt' headerHeight=48 footerHeight=40 navbarWidth=160 padding='md' %}
With layout='alt', the header and footer run edge to edge.
{% endAppshell %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'appshell', header='Full-width header', navbar='Nav',
          footer='Full-width footer', layout='alt', headerHeight=48,
          footerHeight=40, navbarWidth=160, padding='md',
          children="With layout='alt', the header and footer run edge to edge.")
```
{% endAccordionSection %}
{% endAccordion %}

## Borders off

Each region draws a border by default. Set `withBorder` to `false` to remove them for a
flatter, seamless look.

{% appshell header='Borderless' navbar='Nav' headerHeight=48 navbarWidth=160 padding='md' withBorder=false %}
No dividers between the regions.
{% endAppshell %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% appshell header='Borderless' navbar='Nav' headerHeight=48 navbarWidth=160 padding='md' withBorder=false %}
No dividers between the regions.
{% endAppshell %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'appshell', header='Borderless', navbar='Nav',
          headerHeight=48, navbarWidth=160, padding='md', withBorder=False,
          children='No dividers between the regions.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The block body is ordinary Markdown, so you can drop other components into the main area — a
[`{% raw %}{% stack %}{% endraw %}`](/components/layout/stack/) of buttons, a badge, a
callout, whatever the page needs.

{% appshell header='Settings' navbar='Sections' headerHeight=48 navbarWidth=180 padding='md' %}
{% stack gap='sm' %}
{% badge size='lg' %}Profile{% endBadge %}
{% button text='Save changes' %}
{% endStack %}
{% endAppshell %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% appshell header='Settings' navbar='Sections' headerHeight=48 navbarWidth=180 padding='md' %}
{% stack gap='sm' %}
{% badge size='lg' %}Profile{% endBadge %}
{% button text='Save changes' %}
{% endStack %}
{% endAppshell %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = (
    component('aardvark', 'stack', gap='sm',
              children=component('aardvark', 'badge', size='lg', children='Profile')
                       + component('aardvark', 'button', text='Save changes'))
)
component('aardvark', 'appshell', header='Settings', navbar='Sections',
          headerHeight=48, navbarWidth=180, padding='md', children=body)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

A region is only rendered (and only reserves its size) when its text param is set. Omit
anything else to take its Mantine default.

| Attribute | Values | Description |
| --- | --- | --- |
| `header` | any text | Header region text. Setting it adds a top bar. |
| `navbar` | any text | Navbar region text. Setting it adds a left column. |
| `aside` | any text | Aside region text. Setting it adds a right column. |
| `footer` | any text | Footer region text. Setting it adds a bottom bar. |
| `headerHeight` | a number, px (`60` default) | Height of the header region. |
| `footerHeight` | a number, px (`60` default) | Height of the footer region. |
| `navbarWidth` | a number, px (`250` default) | Width of the navbar column. |
| `asideWidth` | a number, px (`250` default) | Width of the aside column. |
| `padding` | `xs`–`xl` or any CSS value | Padding around the main content area. |
| `layout` | `default`, `alt` | `default` offsets Main inside the regions; `alt` makes header/footer span full width. |
| `withBorder` | `true`, `false` (default `true`) | Draw a border on each region. Set `false` to remove. |
| `height` | integer (pixels, default `380`) | Height of the self-contained frame the shell renders inside, so it stays a bounded preview instead of taking over the page. |


## CSS Selectors

Each `appshell` carries `data-aardvark-island="AppShell"` on its wrapper, and Mantine exposes its parts as `mantine-AppShell-*` classes — target either to style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="AppShell"] {
  /* style every appshell on the page */
}

.mantine-AppShell-root {
  /* the root part */
}

.mantine-AppShell-header {
  /* the header part */
}

.mantine-AppShell-navbar {
  /* the navbar part */
}

.mantine-AppShell-main {
  /* the main part */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the rendered element.

{% appshell header='My App' navbar='Navigation' headerHeight=56 navbarWidth=200 padding='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
The main content area sits to the right of the navbar and below the header.
{% endAppshell %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% appshell header='My App' navbar='Navigation' headerHeight=56 navbarWidth=200 padding='md' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
The main content area sits to the right of the navbar and below the header.
{% endAppshell %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'appshell', header='My App', navbar='Navigation',
          headerHeight=56, navbarWidth=200, padding='md',
          children='The main content area sits to the right of the navbar and below the header.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
