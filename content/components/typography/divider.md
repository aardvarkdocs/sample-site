---
title: "Divider"
description: "The built-in divider tag — a labelled or plain horizontal/vertical rule. Usage, options, and live examples (labels, position, variants, color)."
---

# Divider

`divider` is a horizontal or vertical rule — plain, or with a caption. It ships with aardvark, so a divider is a single tag with no setup. A plain Markdown thematic break (`---`) already renders as a Divider, so reach for the tag when you want a **label**, a **variant**, a specific **color**, or a **vertical** rule.

Use it as `{% raw %}{% divider %}{% endraw %}` in Markdown, or call it from Python logic (loops, snippets) via `component('aardvark', 'divider', …)`.

## Demonstrations

The label is the block body or a `label` param. A plain `divider` with a centered label, and a dashed one with a body label:

{% divider label='Section' %}

{% divider variant='dashed' labelPosition='center' %}Part two{% endDivider %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% divider label='Section' %}
{% divider variant='dashed' labelPosition='center' %}Part two{% endDivider %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'divider', label='Section')
component('aardvark', 'divider', variant='dashed', labelPosition='center',
          children='Part two')
```
{% endAccordionSection %}
{% endAccordion %}

The label sits in the **center** by default; `labelPosition` moves it `left` or `right`:

{% divider label='Left' labelPosition='left' %}

{% divider label='Center' %}

{% divider label='Right' labelPosition='right' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% divider label='Left' labelPosition='left' %}
{% divider label='Center' %}
{% divider label='Right' labelPosition='right' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
for pos in ('left', 'center', 'right'):
    component('aardvark', 'divider', label=pos.title(), labelPosition=pos)
```
{% endAccordionSection %}
{% endAccordion %}

`variant`, `color`, and `size` change the line itself — dashed, dotted, or a thick colored rule:

{% divider variant='dashed' labelPosition='center' %}dashed{% endDivider %}

{% divider variant='dotted' labelPosition='center' %}dotted{% endDivider %}

{% divider color='primary' size='md' labelPosition='center' %}thick & colored{% endDivider %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% divider variant='dashed' labelPosition='center' %}dashed{% endDivider %}
{% divider variant='dotted' labelPosition='center' %}dotted{% endDivider %}
{% divider color='primary' size='md' labelPosition='center' %}thick & colored{% endDivider %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'divider', variant='dashed', labelPosition='center',
          children='dashed')
component('aardvark', 'divider', variant='dotted', labelPosition='center',
          children='dotted')
component('aardvark', 'divider', color='primary', size='md', labelPosition='center',
          children='thick & colored')
```
{% endAccordionSection %}
{% endAccordion %}

`my` controls the breathing room around a horizontal rule (a spacing token or any CSS length):

A paragraph above the rule.

{% divider my='xl' %}

A paragraph below the rule — note the wider gap above and below.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% divider my='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'divider', my='xl')
```
{% endAccordionSection %}
{% endAccordion %}

Set `orientation='vertical'` and give the rule an `h` (height); a vertical rule is meant to sit inside a flex row, between two pieces of content:

<div style="display: flex; align-items: center;"><span>Home</span>{% divider orientation='vertical' h='1.25rem' mx='sm' %}<span>Docs</span>{% divider orientation='vertical' h='1.25rem' mx='sm' %}<span>About</span></div>

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
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
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
rule = component('aardvark', 'divider', orientation='vertical', h='1.25rem', mx='sm')
'<div style="display: flex; align-items: center;">' \
    '<span>Home</span>' + rule + '<span>Docs</span>' + rule + '<span>About</span></div>'
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A divider separates sections inside any surface. Here it splits a `paper` panel:

{% paper withBorder=true p='lg' radius='md' %}
**Account**
{% divider label='Danger zone' labelPosition='left' color='red' my='md' %}
Deleting your account is permanent.
{% endPaper %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% paper withBorder=true p='lg' radius='md' %}
**Account**
{% divider label='Danger zone' labelPosition='left' color='red' my='md' %}
Deleting your account is permanent.
{% endPaper %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    '**Account**'
    + component('aardvark', 'divider', label='Danger zone',
                labelPosition='left', color='red', my='md')
    + 'Deleting your account is permanent.'
)
component('aardvark', 'paper', withBorder=True, p='lg', radius='md', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Spacing and sizing values take a Mantine token (`xs`–`xl`) or any CSS length.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | Plain text (not Markdown) | Caption text, when not using the block body. |
| `labelPosition` | `center` (default) / `left` / `right` | Where the label sits on the rule. |
| `orientation` | `horizontal` (default) / `vertical` | Rule direction. A vertical rule needs an `h`. |
| `variant` | `solid` (default) / `dashed` / `dotted` | Line style. |
| `size` | `xs`–`xl` (default `xs`) | Line thickness. |
| `color` | A theme color (`primary`, `blue`, `red`, …) | Line color. Defaults to the subtle border color. |
| `m` / `mt` / `mb` / `ml` / `mr` / `mx` / `my` | Spacing token or any CSS value | Margin — `my` sets the space around a horizontal rule. |
| `p` / `pt` / `pb` / `pl` / `pr` / `px` / `py` | Spacing token or any CSS value | Padding. |
| `w` / `h` | Any CSS length | Sizing — give a **vertical** rule its `h`. |
| `miw` / `mih` / `maw` / `mah` | Any CSS length | Min/max width and min/max height. |

`attr={...}` forwards raw HTML attributes (e.g. an `id` for a deep link) onto the rendered rule.

## CSS Selectors

Target the rendered element through its island marker, `[data-aardvark-island="Divider"]`, or through the Mantine Styles API classes:

{% raw %}
```css
/* Every rendered Divider carries this island marker */
[data-aardvark-island="Divider"] { }

/* Mantine Styles API classes */
.mantine-Divider-root { }
.mantine-Divider-label { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% divider label='Section' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% divider label='Section' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'divider', label='Section', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
