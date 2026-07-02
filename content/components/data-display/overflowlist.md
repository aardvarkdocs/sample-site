---
title: "OverflowList"
description: "The built-in overflowlist tag — a single-line row of labels that collapses any overflow into a +N counter, re-fitting on resize. Usage, options, and live examples."
---

# OverflowList

A built-in tag for a single-line row of labels (rendered as [badges](/components/data-display/badge/))
that collapses any overflow into a trailing "+N" counter when they don't all fit. It measures the
items at runtime and re-fits as the row resizes — narrow the window and watch the counter grow. Hover
the counter to see the hidden labels. Pass the labels in `items`, either comma-separated or as a JSON
array.

Use it as `{% raw %}{% overflowlist items='A, B, C' %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'overflowlist', …)`.

## A row of labels

The default look: light badges, comma-separated `items`. Try narrowing the window — the trailing
counter grows to absorb whatever no longer fits.

{% overflowlist items='React, Vue, Svelte, Solid, Angular, Preact, Qwik, Lit, Ember' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overflowlist items='React, Vue, Svelte, Solid, Angular, Preact, Qwik, Lit, Ember' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'overflowlist',
          items='React, Vue, Svelte, Solid, Angular, Preact, Qwik, Lit, Ember')
```
{% endAccordionSection %}
{% endAccordion %}

## Items as a JSON array

`items` also accepts a JSON array of strings — handy when a label itself contains a comma.

{% overflowlist items='["Engineering", "Design, Research", "Sales & Marketing", "Operations"]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overflowlist items='["Engineering", "Design, Research", "Sales & Marketing", "Operations"]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'overflowlist',
          items='["Engineering", "Design, Research", "Sales & Marketing", "Operations"]')
```
{% endAccordionSection %}
{% endAccordion %}

## Badge variant, color, and size

The badges take the usual Mantine `variant`, `color`, and `size` — here filled indigo badges at the
large size.

{% overflowlist variant='filled' color='indigo' size='lg' items='design, build, ship, measure, iterate, repeat' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overflowlist variant='filled' color='indigo' size='lg' items='design, build, ship, measure, iterate, repeat' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'overflowlist', variant='filled', color='indigo', size='lg',
          items='design, build, ship, measure, iterate, repeat')
```
{% endAccordionSection %}
{% endAccordion %}

## Wider spacing

`gap` sets the space between badges — a Mantine size token or a px value.

{% overflowlist gap='md' variant='outline' items='alpha, beta, gamma, delta, epsilon, zeta, eta' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overflowlist gap='md' variant='outline' items='alpha, beta, gamma, delta, epsilon, zeta, eta' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'overflowlist', gap='md', variant='outline',
          items='alpha, beta, gamma, delta, epsilon, zeta, eta')
```
{% endAccordionSection %}
{% endAccordion %}

## Without the counter tooltip

The hidden labels show in a tooltip on the counter by default. Set `withTooltip=false` to turn it
off — the counter still collapses overflow, just without the hover reveal.

{% overflowlist withTooltip=false items='one, two, three, four, five, six, seven, eight' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overflowlist withTooltip=false items='one, two, three, four, five, six, seven, eight' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'overflowlist', withTooltip=False,
          items='one, two, three, four, five, six, seven, eight')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Drop a row of tags into any other component's body — here inside a
[card](/components/data-display/card/) composed in Python.

{% card title="Stack" subtitle="What this service is built on." icon="stack-2" %}
{% overflowlist variant='light' color='grape' items='TypeScript, React, Postgres, Redis, Docker, Kubernetes, Terraform' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="Stack" subtitle="What this service is built on." icon="stack-2" %}
{% overflowlist variant='light' color='grape' items='TypeScript, React, Postgres, Redis, Docker, Kubernetes, Terraform' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tags = component('aardvark', 'overflowlist', variant='light', color='grape',
                 items='TypeScript, React, Postgres, Redis, Docker, Kubernetes, Terraform')
component('aardvark', 'card', title='Stack', subtitle='What this service is built on.',
          icon='stack-2', children=tags)
```
{% endAccordionSection %}
{% endAccordion %}

## Progressive enhancement

Measurement happens in the browser, so before JavaScript runs (and in the build-time prerender) every
item shows with no counter — the collapse is pure progressive enhancement. The first item always
stays visible even in a very narrow container.

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `items` | comma-separated string, or a JSON array of strings | The labels. A comma-separated string splits on commas; a JSON array (`'["a","b"]'`) keeps commas inside a label. |
| `variant` | `light` (default), `filled`, `outline`, `dot`, `transparent`, `white`, `default`, `gradient` | Badge variant. |
| `color` | a Mantine color name or hex | Badge color. |
| `size` | `xs`, `sm`, `md` (default), `lg`, `xl` | Badge size. |
| `gap` | a Mantine size token (`xs`–`xl`) or a px value | Spacing between badges (default `xs`). |
| `withTooltip` | bool (default `true`) | Show the hidden labels in a tooltip on the counter. Set `false` to disable. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="OverflowList"]` — or through the Mantine Styles API classes (`.mantine-OverflowList-root` and its inner parts):

{% raw %}
```css
/* Every rendered OverflowList carries this island marker */
[data-aardvark-island="OverflowList"] { }

/* Mantine Styles API class on the root element */
.mantine-OverflowList-root { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% overflowlist items='React, Vue, Svelte, Solid, Angular, Preact, Qwik, Lit, Ember' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% overflowlist items='React, Vue, Svelte, Solid, Angular, Preact, Qwik, Lit, Ember' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'overflowlist',
          items='React, Vue, Svelte, Solid, Angular, Preact, Qwik, Lit, Ember',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
