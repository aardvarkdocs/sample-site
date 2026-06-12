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
`aardvark.config.yaml`) use the same tag. For the underlying component and
every prop it accepts, see [Mantine's Button docs](https://mantine.dev/core/button/).

{% raw %}
```aardvark
{% button text='Get started' url='#' %}
```
{% endraw %}

renders, live:

{% button text='Get started' url='#' %}

## Label

Give the label inline with `text`, or as the block body (handy when the label wraps
other markup):

{% raw %}
```aardvark
{% button text='Inline label' %}
{% button %}Block label{% endButton %}
```
{% endraw %}

{% button text='Inline label' %} {% button %}Block label{% endButton %}

## Linking

Set `url` and the button renders as a link (`<a href>`): it navigates on click and
works even without JavaScript. A scoped style keeps the link looking like a button
rather than inheriting the theme's prose-link color and underline.

{% button text='Browse components' url='/components/' %} {% button text='Plain button' %}

### Open in a new tab / download a file

When `url` is set, link-only attributes pass through: `target`, `rel`, `download`.
Pair `target='_blank'` with `rel='noopener noreferrer'` for security.

{% raw %}
```aardvark
{% button text='Mantine docs' url='https://mantine.dev' target='_blank' rel='noopener noreferrer' %}
{% button text='Download report' url='/report.pdf' download='report.pdf' %}
```
{% endraw %}

{% button text='Mantine docs' url='https://mantine.dev' target='_blank' rel='noopener noreferrer' %} {% button text='Download report' url='/report.pdf' download='report.pdf' variant='outline' %}

## Variant

`variant` is one of `filled` (default), `outline`, `light`, `subtle`, `default`,
`transparent`, `white`, or `gradient`.

{% raw %}
```aardvark
{% button text='outline' variant='outline' %}
{% button text='light' variant='light' %}
```
{% endraw %}

{% button text='filled' variant='filled' %} {% button text='outline' variant='outline' %} {% button text='light' variant='light' %} {% button text='subtle' variant='subtle' %} {% button text='default' variant='default' %}

### Gradient

`variant='gradient'` takes `gradientFrom`, `gradientTo`, and `gradientDeg` (a
number, in degrees). They compose into a single Mantine gradient.

{% raw %}
```aardvark
{% button text='Sunset' variant='gradient' gradientFrom='orange' gradientTo='red' gradientDeg=45 %}
```
{% endraw %}

{% button text='Sunset' variant='gradient' gradientFrom='orange' gradientTo='red' gradientDeg=45 %} {% button text='Indigo → cyan' variant='gradient' gradientFrom='indigo' gradientTo='cyan' gradientDeg=90 %}

Supply all three together. If you omit any, Mantine fills in its default for the
missing field — usually not what you intended.

## Color

`color` takes any theme color (built-in palette or your `theme.colors`) or a CSS
color. It defaults to the theme's primary.

{% button text='grape' color='grape' %} {% button text='teal' variant='outline' color='teal' %} {% button text='custom hex' color='#e8590c' %}

## Size, radius, and full-width

`size` accepts the Mantine size tokens (`xs`–`xl`) plus the compact variants
(`compact-xs`–`compact-xl`). `radius` accepts `xs`–`xl` or any CSS value. `fullWidth`
stretches the button to its container's width.

{% button text='compact-md' size='compact-md' %} {% button text='md (default)' %} {% button text='lg + xl radius' size='lg' radius='xl' %}

## Sections

`leftSection` and `rightSection` render content beside the label — a small string is
the simplest case (emoji, arrow, short text). The Button's flex layout gives them
the right spacing automatically.

{% raw %}
```aardvark
{% button text='Continue' rightSection='→' %}
{% button text='New' leftSection='★' variant='outline' %}
```
{% endraw %}

{% button text='Continue' rightSection='→' %} {% button text='New' leftSection='★' variant='outline' %}

When `fullWidth` is on, `justify` controls how the sections and label distribute
horizontally (any CSS `justify-content` value):

{% button text='Settings' leftSection='⚙' rightSection='›' fullWidth justify='space-between' %}

## Form buttons

Inside a `<form>`, `type='submit'` makes the button submit the form (the HTML
default; `type='reset'` and `type='button'` are also accepted).

{% raw %}
```aardvark
{% button text='Submit' type='submit' %}
{% button text='Reset' type='reset' variant='outline' %}
```
{% endraw %}

{% button text='Submit' type='submit' %} {% button text='Reset' type='reset' variant='outline' %}

## Selectors (`id`)

Set `id` to give CSS and JS something to target. It lands on the rendered button
(or `<a>` in link mode), so `#cta` works in stylesheets and
`document.getElementById('cta')` in scripts.

{% raw %}
```aardvark
{% button text='Pick me' id='cta' %}
```
{% endraw %}

{% button text='Pick me' id='cta' %}

## Spacing & sizing

The Button accepts Mantine's spacing system — margin (`m`, `mt`, `mb`, `ml`, `mr`,
`mx`, `my`) and padding (`p`, `pt`, `pb`, `pl`, `pr`, `px`, `py`) with the same
size tokens as everywhere else (`xs`, `sm`, `md`, `lg`, `xl`) or any CSS value.
`bg`/`c` shortcut background and text color, and `w`/`h`/`miw`/`mih`/`maw`/`mah`
size the button.

{% raw %}
```aardvark
{% button text='Wide' w='100%' %}
{% button text='With air' m='md' px='xl' %}
{% button text='Painted' bg='grape' c='white' %}
```
{% endraw %}

{% button text='Wide' w='240' my='sm' %} {% button text='With air' m='md' px='xl' %} {% button text='Painted' bg='grape.6' c='white' %}

## High-contrast labels

`autoContrast` picks a label color (white or black) that meets contrast against
the button's background — useful with `filled` on light or non-Mantine colors.

{% button text='autoContrast' color='yellow' autoContrast %} {% button text='no autoContrast' color='yellow' %}

## Disabled

{% button text='Disabled' disabled %} {% button text='Disabled outline' variant='outline' disabled %}

## Options

Omit any option to take its Mantine default.

### Label
| Param | Effect |
| --- | --- |
| `text` | Label, when not using the block body. |

### Link mode (`url` set → `<a href>`)
| Param | Effect |
| --- | --- |
| `url` | Navigate here on click; works without JS. |
| `target` | `_blank` to open in a new tab. |
| `rel` | `noopener noreferrer` when targeting a new tab. |
| `download` | Suggest a filename for the linked file. |

### State & behavior
| Param | Effect |
| --- | --- |
| `variant` | `filled`, `outline`, `light`, `subtle`, `default`, `transparent`, `white`, `gradient`. |
| `color` | Mantine color name or a CSS color. |
| `size` | `xs`–`xl` or `compact-xs`–`compact-xl`. |
| `radius` | `xs`–`xl` or any CSS value. |
| `fullWidth` | Stretch to the container's width. |
| `disabled` | Render disabled. |
| `autoContrast` | Auto-pick a label color that meets contrast. |
| `justify` | `justify-content` for the label + sections row. |
| `type` | `button` (default), `submit`, `reset`. |
| `id` | HTML `id` on the rendered button (or `<a>`). |
| `onclick` | JavaScript expression run when the button is clicked. |

### Sections
| Param | Effect |
| --- | --- |
| `leftSection` | Content rendered to the left of the label. |
| `rightSection` | Content rendered to the right of the label. |

### Gradient variant (`variant='gradient'`)
| Param | Effect |
| --- | --- |
| `gradientFrom` | Start color. |
| `gradientTo` | End color. |
| `gradientDeg` | Angle, in degrees. |

### Spacing, color, and sizing (Mantine style system)
| Param | Effect |
| --- | --- |
| `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` | Margin (token or CSS value). |
| `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` | Padding. |
| `bg`, `c` | Background, text color. |
| `w`, `h` | Width, height. |
| `miw`, `mih`, `maw`, `mah` | Min / max width and height. |

Anything not on this list is reachable via the raw [component island](/components/raw/) —
call `{% raw %}{% component('Button', ...) %}{% endraw %}` directly.

## Custom click action

Set `onclick` to a JavaScript expression and it runs when the button is clicked —
including an inline anonymous function called on the spot:

{% raw %}
```aardvark
{% button text='Say hi' onclick="(() => alert('Hello world!'))()" %}
```
{% endraw %}

{% button text='Say hi' onclick="(() => alert('Hello world!'))()" %}

The value is any JS that's valid in an `onclick` attribute — a single expression,
a comma-chained sequence, or an IIFE for multi-statement logic.

{% callout severity='warning' title='Stored-XSS surface on multi-author sites' %}
`onclick` ships whatever JavaScript a page author types straight to readers' browsers
— it runs unsandboxed and with full access to cookies, storage, and the document. On
a single-author site that's fine (you wrote the JS). On a multi-author site, lock it
down site-wide with the `attrPolicy` block in `aardvark.config.yaml`:
`deny: ['on*']` refuses every inline event handler, or use `allow:` for an allowlist.
{% endCallout %}

## In the header

The site's top-bar call-to-action buttons are the same tag. Configure them with
`topButtons` in `aardvark.config.yaml` — each entry accepts every field above. The
default is a **Login** (outline) + **Sign up** (grape→pink gradient at 135°) pair;
set `topButtons: []` to hide them.
