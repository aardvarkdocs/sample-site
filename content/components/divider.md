---
title: "Divider"
description: "The built-in divider tag — a labelled or plain horizontal/vertical rule. Usage, options, and live examples (labels, position, variants, color)."
---

# Divider

A **built-in** tag for a horizontal or vertical rule — plain, or with a caption. It ships
with aardvark, so a divider is a single tag with no setup. For the underlying component and
every prop it accepts, see [Mantine's Divider docs](https://mantine.dev/core/divider/).

A plain Markdown thematic break already renders as a Divider, so you rarely need the tag for
an unadorned line:

{% raw %}
```markdown
---
```
{% endraw %}

renders, live:

---

Reach for `{% raw %}{% divider %}{% endraw %}` when you want a **label**, a **variant**, a
specific **color**, or a **vertical** rule.

## Usage

The label is the block body or a `label` param. Set any of the options below; omit one and
it takes its Mantine default:

{% raw %}
```aardvark
{% divider label='Section' %}
{% divider variant='dashed' labelPosition='center' %}Part two{% endDivider %}
```
{% endraw %}

renders, live:

{% divider label='Section' %}

{% divider variant='dashed' labelPosition='center' %}Part two{% endDivider %}

## Options

Omit any option to take its default.

| Param | Effect |
| --- | --- |
| `label` | Caption text, when not using the block body. Plain text (not Markdown). |
| `labelPosition` | `center` (default), `left`, `right`. |
| `orientation` | `horizontal` (default) or `vertical`. |
| `variant` | `solid` (default), `dashed`, `dotted`. |
| `size` | Line thickness: `xs`–`xl` (default `xs`). |
| `color` | Any theme color (`primary`, `blue`, `grape`, …); defaults to the subtle border color. |
| `m` / `mt` / `mb` / `ml` / `mr` / `mx` / `my` | Margin (spacing token or any CSS value) — `my` sets the space around a horizontal rule. |
| `p` / `pt` / … / `py` | Padding (spacing token or any CSS value). |
| `w` / `h` / `miw` / `mih` / `maw` / `mah` | Sizing — give a **vertical** rule its `h` (length). |

`attr={...}` forwards raw HTML attributes (e.g. an `id` for a deep link) onto the rendered
rule, exactly like `{% raw %}{% component('Divider', attr=...) %}{% endraw %}`.

## Labels and position

The label sits in the **center** by default; `labelPosition` moves it to the `left` or
`right`:

{% raw %}
```aardvark
{% divider label='Left' labelPosition='left' %}
{% divider label='Center' %}
{% divider label='Right' labelPosition='right' %}
```
{% endraw %}

renders, live:

{% divider label='Left' labelPosition='left' %}

{% divider label='Center' %}

{% divider label='Right' labelPosition='right' %}

## Variants and color

{% raw %}
```aardvark
{% divider variant='dashed' labelPosition='center' %}dashed{% endDivider %}
{% divider variant='dotted' labelPosition='center' %}dotted{% endDivider %}
{% divider color='primary' size='md' labelPosition='center' %}thick & colored{% endDivider %}
```
{% endraw %}

{% divider variant='dashed' labelPosition='center' %}dashed{% endDivider %}

{% divider variant='dotted' labelPosition='center' %}dotted{% endDivider %}

{% divider color='primary' size='md' labelPosition='center' %}thick & colored{% endDivider %}

## Spacing

`my` controls the breathing room around a horizontal rule (it's a Mantine spacing token or
any CSS length):

{% raw %}
```aardvark
{% divider my='xl' %}
```
{% endraw %}

renders, live — note the wider gap above and below the rule:

A paragraph above the rule.

{% divider my='xl' %}

A paragraph below the rule.

## Vertical

Set `orientation='vertical'` and give the rule an `h` (height); it's meant to sit inside a
flex row, between two pieces of content:

{% raw %}
```aardvark
<div style="display: flex; align-items: center;">
  <span>Home</span>
  {% divider orientation='vertical' h='1.25rem' mx='sm' %}
  <span>Docs</span>
  {% divider orientation='vertical' h='1.25rem' mx='sm' %}
  <span>About</span>
</div>
```
{% endraw %}

renders, live:

<div style="display: flex; align-items: center;"><span>Home</span>{% divider orientation='vertical' h='1.25rem' mx='sm' %}<span>Docs</span>{% divider orientation='vertical' h='1.25rem' mx='sm' %}<span>About</span></div>
