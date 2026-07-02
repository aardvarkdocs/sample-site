---
title: "Spoiler"
description: "The built-in spoiler tag — collapse long content behind a show-more toggle. Usage, options, and live examples (maxHeight, labels, transition)."
---

# Spoiler

A **built-in** tag that hides long content behind a **show-more** toggle. When the block body
is taller than `maxHeight`, a toggle appears and the reader expands the rest on demand; the
body renders as ordinary Markdown. Use it as `{% raw %}{% spoiler %}{% endraw %}` in Markdown,
or call it from Python logic (loops, snippets) via `component('aardvark', 'spoiler', …)`.

## Demonstrations

A bare spoiler collapses its body once the content is taller than `maxHeight` (60px here), and
the **Show more** toggle reveals the rest:

{% spoiler maxHeight=60 %}
This region starts collapsed once its content is taller than `maxHeight`.
A **Show more** toggle reveals the rest, and **Hide** collapses it again.
The body is ordinary Markdown — **bold**, `code`, [links](/), and lists all work.

- It is good for long change notes, FAQs, and footnote-y asides.
- The toggle only appears when the content actually overflows `maxHeight`.
{% endSpoiler %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% spoiler maxHeight=60 %}
This region starts collapsed once its content is taller than `maxHeight`.
A **Show more** toggle reveals the rest, and **Hide** collapses it again.
The body is ordinary Markdown — **bold**, `code`, [links](/), and lists all work.

- It is good for long change notes, FAQs, and footnote-y asides.
- The toggle only appears when the content actually overflows `maxHeight`.
{% endSpoiler %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'spoiler', maxHeight=60, children=(
    "This region starts collapsed once its content is taller than `maxHeight`.\n"
    "A **Show more** toggle reveals the rest, and **Hide** collapses it again.\n\n"
    "- It is good for long change notes, FAQs, and footnote-y asides.\n"
    "- The toggle only appears when the content actually overflows `maxHeight`.\n"
))
```
{% endAccordionSection %}
{% endAccordion %}

### Custom labels

`showLabel` and `hideLabel` set the toggle text for the collapsed and expanded states:

{% spoiler maxHeight=40 showLabel='Read the details' hideLabel='Collapse' %}
The toggle text is yours to set. Keep `showLabel` short — it sits inline under the
collapsed content. This body is long enough to overflow the 40px `maxHeight`, so the
toggle shows.
{% endSpoiler %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% spoiler maxHeight=40 showLabel='Read the details' hideLabel='Collapse' %}
The toggle text is yours to set. Keep `showLabel` short — it sits inline under the
collapsed content. This body is long enough to overflow the 40px `maxHeight`, so the
toggle shows.
{% endSpoiler %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'spoiler', maxHeight=40,
          showLabel='Read the details', hideLabel='Collapse',
          children='The toggle text is yours to set…')
```
{% endAccordionSection %}
{% endAccordion %}

### Instant reveal

`transitionDuration=0` disables the reveal animation, so the body appears immediately:

{% spoiler maxHeight=40 transitionDuration=0 %}
With `transitionDuration=0` the content snaps open and shut with no slide. Useful when you
want the toggle behavior without any motion. This paragraph is tall enough to overflow the
40px `maxHeight`, so the toggle appears.
{% endSpoiler %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% spoiler maxHeight=40 transitionDuration=0 %}
With `transitionDuration=0` the content snaps open and shut with no slide. Useful when you
want the toggle behavior without any motion. This paragraph is tall enough to overflow the
40px `maxHeight`, so the toggle appears.
{% endSpoiler %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'spoiler', maxHeight=40, transitionDuration=0,
          children='With transitionDuration=0 the content snaps open…')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A spoiler body is full Markdown, so it can hold any other component — here a {% raw %}{% card %}{% endraw %}
and a {% raw %}{% badge %}{% endraw %} stay hidden until the reader expands the region:

{% spoiler maxHeight=50 showLabel='Show the changelog' hideLabel='Hide' %}
Recent updates {% badge color='green' %}New{% endBadge %}

{% card title="v2.0" %}
A major release with breaking changes and a migration guide.
{% endCard %}
{% endSpoiler %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% spoiler maxHeight=50 showLabel='Show the changelog' hideLabel='Hide' %}
Recent updates {% badge color='green' %}New{% endBadge %}

{% card title="v2.0" %}
A major release with breaking changes and a migration guide.
{% endCard %}
{% endSpoiler %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = "Recent updates " + component('aardvark', 'badge', color='green', children='New')
body += "\n\n" + component('aardvark', 'card', title='v2.0',
                           children='A major release with breaking changes and a migration guide.')
page.print(component('aardvark', 'spoiler', maxHeight=50,
                     showLabel='Show the changelog', hideLabel='Hide', children=body))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| (body) | Markdown | The collapsible content. Rendered as Markdown. Close the tag with `{% raw %}{% endSpoiler %}{% endraw %}`. |
| `maxHeight` | integer (pixels) | Visible height before the toggle appears. Defaults to `100`. The toggle only shows when the body is taller than this. |
| `showLabel` | string | Toggle text while collapsed. Defaults to `Show more`. |
| `hideLabel` | string | Toggle text while expanded. Defaults to `Hide`. |
| `transitionDuration` | integer (ms) | Reveal animation duration. Defaults to `200`; set `0` to disable the animation. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Spoiler"]` — or through the Mantine Styles API classes (`.mantine-Spoiler-root` and its inner parts):

{% raw %}
```css
/* Every rendered Spoiler carries this island marker */
[data-aardvark-island="Spoiler"] { }

/* Mantine Styles API class on the root element */
.mantine-Spoiler-root { }
.mantine-Spoiler-content { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% spoiler maxHeight=60 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
A paragraph long enough to be collapsed behind the Show more toggle, then revealed on click.
{% endSpoiler %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% spoiler maxHeight=60 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
A paragraph long enough to be collapsed behind the Show more toggle, then revealed on click.
{% endSpoiler %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'spoiler', maxHeight=60,
          children='A paragraph long enough to be collapsed behind the Show more toggle, then revealed on click.',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
