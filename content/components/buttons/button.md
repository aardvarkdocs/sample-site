---
title: "Button"
description: "The built-in button tag — a styled button or link with the full Mantine
  Button surface: variant, color, size, gradient, sections, link target/rel/download,
  spacing, id selectors. Usage, options, and live examples."
---

# Button

`{% raw %}{% button %}{% endraw %}` is a **built-in** tag for buttons and
button-styled links — every Mantine Button capability, exposed as a single tag with
no setup. The header's top-bar call-to-action buttons (`topButtons` in
`aardvark.config.yaml`) use the same tag.

Use it as `{% raw %}{% button %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'button', …)`.

{% button text='Get started' url='#' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Get started' url='#' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Get started', url='#')
```
{% endAccordionSection %}
{% endAccordion %}

## Label

Give the label inline with `text`, or as the block body (handy when the label wraps
other markup). In Python, pass the body as `children`.

{% button text='Inline label' %} {% button %}Block label{% endButton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Inline label' %}
{% button %}Block label{% endButton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Inline label')
component('aardvark', 'button', children='Block label')
```
{% endAccordionSection %}
{% endAccordion %}

## Linking

Set `url` and the button renders as a link (`<a href>`): it navigates on click and
works even without JavaScript. A scoped style keeps the link looking like a button
rather than inheriting the theme's prose-link color and underline.

{% button text='Browse components' url='/components/' %} {% button text='Plain button' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Browse components' url='/components/' %}
{% button text='Plain button' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Browse components', url='/components/')
component('aardvark', 'button', text='Plain button')
```
{% endAccordionSection %}
{% endAccordion %}

### Open in a new tab / download a file

When `url` is set, link-only attributes pass through: `target`, `rel`, `download`.
Pair `target='_blank'` with `rel='noopener noreferrer'` for security.

{% button text='Mantine docs' url='https://mantine.dev' target='_blank' rel='noopener noreferrer' %} {% button text='Download report' url='/report.pdf' download='report.pdf' variant='outline' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Mantine docs' url='https://mantine.dev' target='_blank' rel='noopener noreferrer' %}
{% button text='Download report' url='/report.pdf' download='report.pdf' variant='outline' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Mantine docs', url='https://mantine.dev',
          target='_blank', rel='noopener noreferrer')
component('aardvark', 'button', text='Download report', url='/report.pdf',
          download='report.pdf', variant='outline')
```
{% endAccordionSection %}
{% endAccordion %}

## Variant

`variant` is one of `filled` (default), `outline`, `light`, `subtle`, `default`,
`transparent`, `white`, or `gradient`.

{% button text='filled' variant='filled' %} {% button text='outline' variant='outline' %} {% button text='light' variant='light' %} {% button text='subtle' variant='subtle' %} {% button text='default' variant='default' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='filled' variant='filled' %}
{% button text='outline' variant='outline' %}
{% button text='light' variant='light' %}
{% button text='subtle' variant='subtle' %}
{% button text='default' variant='default' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for v in ('filled', 'outline', 'light', 'subtle', 'default'):
    component('aardvark', 'button', text=v, variant=v)
```
{% endAccordionSection %}
{% endAccordion %}

### Gradient

`variant='gradient'` takes `gradientFrom`, `gradientTo`, and `gradientDeg` (a
number, in degrees). They compose into a single Mantine gradient. Supply all three
together — if you omit any, Mantine fills in its default for the missing field,
usually not what you intended.

{% button text='Sunset' variant='gradient' gradientFrom='orange' gradientTo='red' gradientDeg=45 %} {% button text='Indigo → cyan' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Sunset' variant='gradient' gradientFrom='orange' gradientTo='red' gradientDeg=45 %}
{% button text='Indigo → cyan' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Sunset', variant='gradient',
          gradientFrom='orange', gradientTo='red', gradientDeg=45)
component('aardvark', 'button', text='Indigo → cyan', variant='gradient',
          gradientFrom='indigo', gradientTo='cyan', gradientDeg=90)
```
{% endAccordionSection %}
{% endAccordion %}

## Color

`color` takes any theme color (a brand color from your theme's `theme.scss`, like
`primary` or `secondary`) or a CSS color. It defaults to the theme's primary.

{% button text='grape' color='grape' %} {% button text='teal' variant='outline' color='teal' %} {% button text='custom hex' color='#e8590c' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='grape' color='grape' %}
{% button text='teal' variant='outline' color='teal' %}
{% button text='custom hex' color='#e8590c' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='grape', color='grape')
component('aardvark', 'button', text='teal', variant='outline', color='teal')
component('aardvark', 'button', text='custom hex', color='#e8590c')
```
{% endAccordionSection %}
{% endAccordion %}

`autoContrast` picks a label color (white or black) that meets contrast against the
button's background — useful with `filled` on light or non-Mantine colors.

{% button text='autoContrast' color='yellow' autoContrast %} {% button text='no autoContrast' color='yellow' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='autoContrast' color='yellow' autoContrast %}
{% button text='no autoContrast' color='yellow' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='autoContrast', color='yellow', autoContrast=True)
component('aardvark', 'button', text='no autoContrast', color='yellow')
```
{% endAccordionSection %}
{% endAccordion %}

## Size, radius, and full-width

`size` accepts the Mantine size tokens (`xs`–`xl`) plus the compact variants
(`compact-xs`–`compact-xl`). `radius` accepts `xs`–`xl` or any CSS value. `fullWidth`
stretches the button to its container's width.

{% button text='compact-md' size='compact-md' %} {% button text='md (default)' %} {% button text='lg + xl radius' size='lg' radius='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='compact-md' size='compact-md' %}
{% button text='md (default)' %}
{% button text='lg + xl radius' size='lg' radius='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='compact-md', size='compact-md')
component('aardvark', 'button', text='md (default)')
component('aardvark', 'button', text='lg + xl radius', size='lg', radius='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## Sections

`leftSection` and `rightSection` render content beside the label — a small string is
the simplest case (emoji, arrow, short text). The Button's flex layout gives them
the right spacing automatically.

{% button text='Continue' rightSection='→' %} {% button text='New' leftSection='★' variant='outline' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Continue' rightSection='→' %}
{% button text='New' leftSection='★' variant='outline' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Continue', rightSection='→')
component('aardvark', 'button', text='New', leftSection='★', variant='outline')
```
{% endAccordionSection %}
{% endAccordion %}

When `fullWidth` is on, `justify` controls how the sections and label distribute
horizontally (any CSS `justify-content` value):

{% button text='Settings' leftSection='⚙' rightSection='›' fullWidth justify='space-between' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Settings' leftSection='⚙' rightSection='›' fullWidth justify='space-between' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Settings', leftSection='⚙', rightSection='›',
          fullWidth=True, justify='space-between')
```
{% endAccordionSection %}
{% endAccordion %}

## Form buttons

Inside a `<form>`, `type='submit'` makes the button submit the form (the HTML
default; `type='reset'` and `type='button'` are also accepted).

{% button text='Submit' type='submit' %} {% button text='Reset' type='reset' variant='outline' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Submit' type='submit' %}
{% button text='Reset' type='reset' variant='outline' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Submit', type='submit')
component('aardvark', 'button', text='Reset', type='reset', variant='outline')
```
{% endAccordionSection %}
{% endAccordion %}

## Disabled

{% button text='Disabled' disabled %} {% button text='Disabled outline' variant='outline' disabled %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Disabled' disabled %}
{% button text='Disabled outline' variant='outline' disabled %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Disabled', disabled=True)
component('aardvark', 'button', text='Disabled outline', variant='outline', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Selectors (`id`)

Set `id` to give CSS and JS something to target. It lands on the rendered button
(or `<a>` in link mode), so `#cta` works in stylesheets and
`document.getElementById('cta')` in scripts.

{% button text='Pick me' id='cta' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Pick me' id='cta' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Pick me', id='cta')
```
{% endAccordionSection %}
{% endAccordion %}

## Spacing & sizing

The Button accepts Mantine's spacing system — margin (`m`, `mt`, `mb`, `ml`, `mr`,
`mx`, `my`) and padding (`p`, `pt`, `pb`, `pl`, `pr`, `px`, `py`) with the same
size tokens as everywhere else (`xs`, `sm`, `md`, `lg`, `xl`) or any CSS value.
`bg`/`c` shortcut background and text color, and `w`/`h`/`miw`/`mih`/`maw`/`mah`
size the button.

{% button text='Wide' w='240' my='sm' %} {% button text='With air' m='md' px='xl' %} {% button text='Painted' bg='grape.6' c='white' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Wide' w='240' my='sm' %}
{% button text='With air' m='md' px='xl' %}
{% button text='Painted' bg='grape.6' c='white' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Wide', w='240', my='sm')
component('aardvark', 'button', text='With air', m='md', px='xl')
component('aardvark', 'button', text='Painted', bg='grape.6', c='white')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A button sits naturally inside other primitives — here in a [card](/components/data-display/card/),
with a `{% raw %}{% group %}{% endraw %}` to lay a pair side by side:

{% card title='Upgrade your plan' %}
Unlock private repos, custom domains, and priority support.

{% group %}
{% button text='Upgrade' variant='gradient' gradientFrom='grape' gradientTo='pink' gradientDeg=135 %}
{% button text='Compare plans' variant='subtle' url='/components/' %}
{% endGroup %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Upgrade your plan' %}
Unlock private repos, custom domains, and priority support.

{% group %}
{% button text='Upgrade' variant='gradient' gradientFrom='grape' gradientTo='pink' gradientDeg=135 %}
{% button text='Compare plans' variant='subtle' url='/components/' %}
{% endGroup %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Upgrade', variant='gradient',
          gradientFrom='grape', gradientTo='pink', gradientDeg=135)
component('aardvark', 'button', text='Compare plans', variant='subtle', url='/components/')
```
{% endAccordionSection %}
{% endAccordion %}

## In the header

The site's top-bar call-to-action buttons are the same tag. Configure them with
`topButtons` in `aardvark.config.yaml` — each entry accepts every field below. The
default is a **Login** (outline) + **Sign up** (grape→pink gradient at 135°) pair;
set `topButtons: []` to hide them.

## Attributes

Omit any attribute to take its Mantine default. Bare boolean flags (`fullWidth`,
`disabled`, `autoContrast`) set the option to `True`; in Python pass `=True`.

### Label
| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | string | Label, when not using the block body. |

### Link mode (`url` set → `<a href>`)
| Attribute | Valid values | Description |
| --- | --- | --- |
| `url` | relative path or `http(s)://` URL | Navigate here on click; works without JS. `javascript:`/`data:`/`vbscript:`/`file:`/`blob:` schemes are rejected at build time. |
| `target` | e.g. `_blank` | Where to open the link (`_blank` for a new tab). |
| `rel` | e.g. `noopener noreferrer` | Link relationship; pair with `target='_blank'`. |
| `download` | filename string | Suggest a filename for the linked file. |

### State & behavior
| Attribute | Valid values | Description |
| --- | --- | --- |
| `variant` | `filled` (default), `outline`, `light`, `subtle`, `default`, `transparent`, `white`, `gradient` | Visual style. |
| `color` | theme color name or CSS color | Button color. Defaults to the theme primary. |
| `size` | `xs`–`xl`, `compact-xs`–`compact-xl` | Button size. |
| `radius` | `xs`–`xl` or any CSS value | Corner radius. |
| `fullWidth` | bool flag | Stretch to the container's width. |
| `disabled` | bool flag | Render disabled. |
| `autoContrast` | bool flag | Auto-pick a label color that meets contrast. |
| `justify` | any CSS `justify-content` value | Distribution of the label + sections row. |
| `type` | `button` (default), `submit`, `reset` | Button behavior inside a `<form>`. |
| `id` | string | HTML `id` on the rendered button (or `<a>`). |
| `onclick` | JS expression string | JavaScript run on click. In Python pass `attr={'onclick': '…'}`. |

### Sections
| Attribute | Valid values | Description |
| --- | --- | --- |
| `leftSection` | string | Content rendered to the left of the label. |
| `rightSection` | string | Content rendered to the right of the label. |

### Gradient variant (`variant='gradient'`)
| Attribute | Valid values | Description |
| --- | --- | --- |
| `gradientFrom` | color | Start color. |
| `gradientTo` | color | End color. |
| `gradientDeg` | number (degrees) | Angle. |

### Spacing, color, and sizing (Mantine style system)
| Attribute | Valid values | Description |
| --- | --- | --- |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | size token or CSS value | Margin. |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | size token or CSS value | Padding. |
| `bg`, `c` | color | Background, text color. |
| `w`, `h` | size token or CSS value | Width, height. |
| `miw`, `mih`, `maw`, `mah` | size token or CSS value | Min / max width and height. |

## CSS Selectors

Each button mounts inside an island wrapper carrying `data-aardvark-island="Button"`; Mantine's Styles API breaks the rendered element into the root, the inner content row, the label, and any icon section.

{% raw %}
```css
[data-aardvark-island="Button"]  /* the island wrapper */
.mantine-Button-root             /* the <button> / <a> */
.mantine-Button-inner            /* the content row */
.mantine-Button-label            /* the text label */
.mantine-Button-section          /* a left/right icon slot */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — onto the rendered
button. The `onclick` shortcut is the common case: set `onclick` to a JavaScript expression
and it runs when the button is clicked — including an inline anonymous function called on the
spot. In Python, `onclick` rides this same channel — pass `attr={'onclick': '…'}`. The value
is any JS that's valid in an `onclick` attribute — a single expression, a comma-chained
sequence, or an IIFE for multi-statement logic.

{% button text='Say hi' onclick="(() => alert('Hello world!'))()" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Say hi' onclick="(() => alert('Hello world!'))()" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Say hi',
          attr={'onclick': "(() => alert('Hello world!'))()"})
```
{% endAccordionSection %}
{% endAccordion %}

For any other attribute — `data-*`, ARIA, or a full multi-line handler — pass the `attr={…}`
dict directly:

{% button text='Get started' url='#' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% button text='Get started' url='#' attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'button', text='Get started', url='#', attr={'onclick': '''
event.preventDefault();
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

{% callout severity='warning' title='Stored-XSS surface on multi-author sites' %}
`onclick` ships whatever JavaScript a page author types straight to readers' browsers
— it runs unsandboxed and with full access to cookies, storage, and the document. On
a single-author site that's fine (you wrote the JS). On a multi-author site, lock it
down site-wide with the `attrPolicy` block in `aardvark.config.yaml`:
`deny: ['on*']` refuses every inline event handler, or use `allow:` for an allowlist.
{% endCallout %}
