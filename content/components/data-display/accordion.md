---
title: "Accordion"
description: "The built-in accordion tag — collapsible sections whose bodies are full Markdown. Usage, options, and a live example with source."
---

# Accordion

A compound built-in tag for collapsible sections. The parent `{% raw %}{% accordion %}{% endraw %}`
wraps one or more `{% raw %}{% accordionSection title="…" %}{% endraw %}` children; each section's
`title` is the clickable control and everything between the section tags is its panel body. That
body is ordinary **Markdown** — headings, lists, code, links, even nested `component(...)` calls —
and renders as such. By default one panel is open at a time; add `multiple` to let several stay open.

Use it as `{% raw %}{% accordion %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'accordion', …)` — nesting `component('aardvark',
'accordionSection', …)` calls as its `children`.

## Basic accordion

A single-open accordion with two sections. Each panel body is full Markdown.

{% accordion %}
{% accordionSection title="Section One" %}
**Markdown content**

_This builds great!_
{% endAccordionSection %}
{% accordionSection title="Section Two" %}
**More Markdown content**

- This bulleted list actually renders!
- See?
{% endAccordionSection %}
{% endAccordion %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% accordion %}
{% accordionSection title="Section One" %}
**Markdown content**

_This builds great!_
{% endAccordionSection %}
{% accordionSection title="Section Two" %}
**More Markdown content**

- This bulleted list actually renders!
- See?
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'accordion', children=(
    component('aardvark', 'accordionSection', title='Section One',
              children='**Markdown content**\n\n_This builds great!_')
    + component('aardvark', 'accordionSection', title='Section Two',
                children='**More Markdown content**\n\n- This bulleted list actually renders!\n- See?')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Multiple open panels

By default opening one panel closes the others. Add the bare `multiple` flag to let several stay
open at once. In `multiple` mode, `defaultValue` takes a comma-separated list of section `value`s to
open on load (a section's `value` defaults to a slug of its `title`, or set it explicitly).

{% accordion multiple defaultValue="install" %}
{% accordionSection title="Install" value="install" %}
Run `npm install`.
{% endAccordionSection %}
{% accordionSection title="Build" %}
Run `vark build`.
{% endAccordionSection %}
{% endAccordion %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% accordion multiple defaultValue="install" %}
{% accordionSection title="Install" value="install" %}
Run `npm install`.
{% endAccordionSection %}
{% accordionSection title="Build" %}
Run `vark build`.
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'accordion', multiple=True, defaultValue='install', children=(
    component('aardvark', 'accordionSection', title='Install', value='install',
              children='Run `npm install`.')
    + component('aardvark', 'accordionSection', title='Build',
                children='Run `vark build`.')
))
```
{% endAccordionSection %}
{% endAccordion %}

## A single panel open on load

In single-open mode, `defaultValue` is one section `value` — the panel to expand on load. Here the
second section is open from the start.

{% accordion defaultValue="usage" %}
{% accordionSection title="Overview" value="overview" %}
What the tool does, in a sentence.
{% endAccordionSection %}
{% accordionSection title="Usage" value="usage" %}
How to run it, expanded by default.
{% endAccordionSection %}
{% endAccordion %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% accordion defaultValue="usage" %}
{% accordionSection title="Overview" value="overview" %}
What the tool does, in a sentence.
{% endAccordionSection %}
{% accordionSection title="Usage" value="usage" %}
How to run it, expanded by default.
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'accordion', defaultValue='usage', children=(
    component('aardvark', 'accordionSection', title='Overview', value='overview',
              children='What the tool does, in a sentence.')
    + component('aardvark', 'accordionSection', title='Usage', value='usage',
                children='How to run it, expanded by default.')
))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A panel body is full Markdown, so it can hold any other built-in — here an
[icon](/components/data-display/icon/) in the title text and a nested
[card](/components/data-display/card/) in the body.

{% accordion %}
{% accordionSection title="What ships in the box" %}
Everything you need to build and deploy:

{% card title="Static output" subtitle="Plain HTML, CSS, and JS — host it anywhere." icon="package" %}{% endCard %}
{% endAccordionSection %}
{% accordionSection title="Get started" %}
Run {% icon 'rocket' %} `vark build` and you're live.
{% endAccordionSection %}
{% endAccordion %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% accordion %}
{% accordionSection title="What ships in the box" %}
Everything you need to build and deploy:

{% card title="Static output" subtitle="Plain HTML, CSS, and JS — host it anywhere." icon="package" %}{% endCard %}
{% endAccordionSection %}
{% accordionSection title="Get started" %}
Run {% icon 'rocket' %} `vark build` and you're live.
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
box = ('Everything you need to build and deploy:\n\n'
       + component('aardvark', 'card', title='Static output',
                   subtitle='Plain HTML, CSS, and JS — host it anywhere.', icon='package'))
start = 'Run ' + component('aardvark', 'icon', 'rocket') + " `vark build` and you're live."
component('aardvark', 'accordion', children=(
    component('aardvark', 'accordionSection', title='What ships in the box', children=box)
    + component('aardvark', 'accordionSection', title='Get started', children=start)
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

### `{% raw %}{% accordion %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `multiple` | bare flag (`multiple`) | Allow several panels open at once. Off by default (single-open). |
| `defaultValue` | a section `value`, or a comma-separated list with `multiple` | Panel(s) expanded on load. In single-open mode one `value`; in `multiple` mode a comma-separated list (`"a,b"`). |

The look is fixed to Mantine's `contained` variant — there is no author-facing `variant`.

### `{% raw %}{% accordionSection %}{% endraw %}`

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | string | The clickable control label. |
| `value` | string | Stable id for the panel, used by the parent's `defaultValue`. Defaults to a slug of `title` (deduplicated if two titles collide). |

The body between `{% raw %}{% accordionSection %}{% endraw %}` and
`{% raw %}{% endAccordionSection %}{% endraw %}` is the panel content (full Markdown). In the Python
form it is the `children` argument.
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Accordion"]` — or through the Mantine Styles API classes (`.mantine-Accordion-root` and its inner parts):

{% raw %}
```css
/* Every rendered Accordion carries this island marker */
[data-aardvark-island="Accordion"] { }

/* Mantine Styles API class on the root element */
.mantine-Accordion-root { }
.mantine-Accordion-item { }
.mantine-Accordion-control { }
.mantine-Accordion-panel { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered accordion root. (Scalar attributes beyond the ones it handles — like `multiple` to
keep several panels open, or a `defaultValue` — pass straight through to the underlying Mantine
`Accordion`; `attr={…}` is the channel for raw HTML attributes.)

{% accordion multiple defaultValue="overview" attr={'data-analytics': 'faq', 'aria-label': 'Frequently asked questions'} %}
{% accordionSection title="Overview" %}
A single panel of body text, open by default.
{% endAccordionSection %}
{% accordionSection title="Details" %}
A second panel that can stay open alongside it.
{% endAccordionSection %}
{% endAccordion %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% accordion multiple defaultValue="overview" attr={'data-analytics': 'faq', 'aria-label': 'Frequently asked questions'} %}
{% accordionSection title="Overview" %}
A single panel of body text, open by default.
{% endAccordionSection %}
{% accordionSection title="Details" %}
A second panel that can stay open alongside it.
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'accordion', multiple=True, defaultValue='overview',
          attr={'data-analytics': 'faq', 'aria-label': 'Frequently asked questions'}, children=(
    component('aardvark', 'accordionSection', title='Overview', value='overview',
              children='A single panel of body text, open by default.')
    + component('aardvark', 'accordionSection', title='Details',
                children='A second panel that can stay open alongside it.')
))
```
{% endAccordionSection %}
{% endAccordion %}
