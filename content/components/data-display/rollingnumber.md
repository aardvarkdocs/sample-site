---
title: "RollingNumber"
description: "The built-in rollingnumber tag — an animated counter that rolls up to its value the first time it scrolls into view. Usage, options, and live examples."
---

# RollingNumber

A built-in tag for an animated counter — the digits **roll to `value`, re-animating each time the
value changes**, the way a live dashboard figure ticks as it updates. It renders inline, so it drops
into a sentence or heading, and the usual `size`, `color`, and `fw` props style it. Give it a `value`
to show; the roll runs over 600 ms by default. On a static page it shows the final value (there's no
value change to animate).

Use it as `{% raw %}{% rollingnumber value='1000' %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'rollingnumber', …)`.

## A styled stat

A large grape-colored count, grouped with commas by default.

{% rollingnumber value='128000' size='2.5rem' fw='700' color='grape' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rollingnumber value='128000' size='2.5rem' fw='700' color='grape' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rollingnumber', value='128000', size='2.5rem', fw='700', color='grape')
```
{% endAccordionSection %}
{% endAccordion %}

## A faster, linear roll

Shorten `animationDuration` (in milliseconds) and set `timingFunction='linear'` for a steady, quick count.

{% rollingnumber value='99' animationDuration=800 timingFunction='linear' size='xl' fw='700' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rollingnumber value='99' animationDuration=800 timingFunction='linear' size='xl' fw='700' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rollingnumber', value='99', animationDuration=800,
          timingFunction='linear', size='xl', fw='700')
```
{% endAccordionSection %}
{% endAccordion %}

## A decimal stat

`decimalScale` fixes the number of decimal places — here a `4.9` rating shown to one decimal — and
`animationDuration` lengthens the roll.

{% rollingnumber value='4.9' decimalScale=1 animationDuration=2000 size='xl' fw='700' color='teal' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rollingnumber value='4.9' decimalScale=1 animationDuration=2000 size='xl' fw='700' color='teal' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rollingnumber', value='4.9', decimalScale=1,
          animationDuration=2000, size='xl', fw='700', color='teal')
```
{% endAccordionSection %}
{% endAccordion %}

## Without comma grouping

Comma grouping is on by default. Set `thousandSeparator=false` to count a bare number — useful for
years, IDs, or counts that shouldn't read as a quantity.

{% rollingnumber value='2026' thousandSeparator=false size='xl' fw='700' color='blue' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rollingnumber value='2026' thousandSeparator=false size='xl' fw='700' color='blue' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rollingnumber', value='2026', thousandSeparator=False,
          size='xl', fw='700', color='blue')
```
{% endAccordionSection %}
{% endAccordion %}

## Prefix and suffix

`prefix` and `suffix` wrap the number with fixed text — a currency symbol, a percent sign, a unit —
so the whole figure rolls as one.

{% rollingnumber value='1299' prefix='$' size='xl' fw='700' color='green' %}

{% rollingnumber value='98' suffix='%' size='xl' fw='700' color='blue' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rollingnumber value='1299' prefix='$' size='xl' fw='700' color='green' %}

{% rollingnumber value='98' suffix='%' size='xl' fw='700' color='blue' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rollingnumber', value='1299', prefix='$', size='xl', fw='700', color='green')

component('aardvark', 'rollingnumber', value='98', suffix='%', size='xl', fw='700', color='blue')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because it renders inline, a rolling stat drops into any other component's body — here as the
headline figure in a [card](/components/data-display/card/) composed in Python.

{% card title="Active installs" subtitle="And climbing." icon="download" %}
{% rollingnumber value='54213' size='2rem' fw='700' color='indigo' %} developers
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="Active installs" subtitle="And climbing." icon="download" %}
{% rollingnumber value='54213' size='2rem' fw='700' color='indigo' %} developers
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
stat = component('aardvark', 'rollingnumber', value='54213', size='2rem', fw='700', color='indigo')
component('aardvark', 'card', title='Active installs', subtitle='And climbing.',
          icon='download', children=stat + ' developers')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | string or number | The number to show. Rides as a string and is parsed (`"1234"` and `"12.5"` both work). The roll animates whenever this value changes. |
| `animationDuration` | int (milliseconds) | Roll length (default `600`). A deliberate `0` jumps straight to the value. |
| `timingFunction` | `linear`, `ease` (default), `ease-in`, `ease-out`, `ease-in-out`, or any CSS timing function | The roll's easing curve. |
| `decimalScale` | int | Fixed number of decimal places (defaults to the value's own). |
| `fixedDecimalScale` | bool (default `false`) | Pad with trailing zeros to match `decimalScale`. |
| `thousandSeparator` | bool (default `true`) | Group with commas. Set `false` to disable. |
| `prefix` | string | Fixed text before the number (e.g. `$`). |
| `suffix` | string | Fixed text after the number (e.g. `%`). |
| `size` | a Mantine size token (`xs`–`xl`) or a CSS size (e.g. `2.5rem`) | Font size. |
| `color` | a Mantine color name or hex | Text color. |
| `fw` | a CSS font-weight (e.g. `700`) | Font weight. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="RollingNumber"]` — or through the Mantine Styles API classes (`.mantine-RollingNumber-root` and its inner parts):

{% raw %}
```css
/* Every rendered RollingNumber carries this island marker */
[data-aardvark-island="RollingNumber"] { }

/* Mantine Styles API class on the root element */
.mantine-RollingNumber-root { }
.mantine-RollingNumber-digit { }
.mantine-RollingNumber-char { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% rollingnumber value='128000' size='2.5rem' fw='700' color='grape' attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rollingnumber value='128000' size='2.5rem' fw='700' color='grape' attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rollingnumber', value='128000', size='2.5rem', fw='700', color='grape',
          attr={'onclick': '''
const value = this.getAttribute('aria-label');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
