---
title: "NumberFormatter"
description: "The built-in numberformatter tag — format a number with thousands separators, fixed decimals, and a currency-style prefix/suffix. Usage, options, and live examples."
---

# NumberFormatter

A built-in tag that formats a number for display — thousands separators, a fixed number of decimals,
a custom decimal separator, and a currency-style prefix or suffix. It renders inline text, so it
drops straight into a sentence. Give it a `value` plus any of the formatting options; omit an option
to take its default.

Use it as `{% raw %}{% numberformatter value='1234' %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'numberformatter', …)`.

## Currency with thousands grouping

A `prefix`, comma grouping (the bare `thousandSeparator` flag), and two fixed decimal places.

{% numberformatter value='1234567.89' prefix='$' thousandSeparator decimalScale=2 fixedDecimalScale=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberformatter value='1234567.89' prefix='$' thousandSeparator decimalScale=2 fixedDecimalScale=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberformatter', value='1234567.89', prefix='$',
          thousandSeparator=True, decimalScale=2, fixedDecimalScale=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Plain thousands grouping

The bare `thousandSeparator` flag groups with commas and nothing else.

{% numberformatter value='9999' thousandSeparator %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberformatter value='9999' thousandSeparator %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberformatter', value='9999', thousandSeparator=True)
```
{% endAccordionSection %}
{% endAccordion %}

## A suffix

`suffix` appends text after the number — here a percent sign.

{% numberformatter value='98.6' suffix='%' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberformatter value='98.6' suffix='%' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberformatter', value='98.6', suffix='%')
```
{% endAccordionSection %}
{% endAccordion %}

## A custom separator (European style)

Pass a string to `thousandSeparator` for a custom group separator and set `decimalSeparator` for the
decimal point — here a space groups and a comma is the decimal point, padded to two places.

{% numberformatter value='1234567.5' thousandSeparator=' ' decimalSeparator=',' decimalScale=2 fixedDecimalScale=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberformatter value='1234567.5' thousandSeparator=' ' decimalSeparator=',' decimalScale=2 fixedDecimalScale=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberformatter', value='1234567.5', thousandSeparator=' ',
          decimalSeparator=',', decimalScale=2, fixedDecimalScale=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Because it renders inline text, a formatted number drops into any other component's body — here
inside a [card](/components/data-display/card/) subtitle composed in Python.

{% card title="Total revenue" subtitle="Up and to the right." icon="trending-up" %}
{% numberformatter value='2480000' prefix='$' thousandSeparator %} this quarter.
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title="Total revenue" subtitle="Up and to the right." icon="trending-up" %}
{% numberformatter value='2480000' prefix='$' thousandSeparator %} this quarter.
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
amount = component('aardvark', 'numberformatter', value='2480000', prefix='$', thousandSeparator=True)
component('aardvark', 'card', title='Total revenue', subtitle='Up and to the right.',
          icon='trending-up', children=amount + ' this quarter.')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `value` | string or number | The number to format. Rides as a string and is parsed (`"1234.5"` works). |
| `prefix` | string | Text shown before the number, e.g. `$`. |
| `suffix` | string | Text shown after the number, e.g. ` USD` or `%`. |
| `thousandSeparator` | bare flag, or a separator string | A bare flag groups with commas; pass a string (e.g. `' '` or `'.'`) for a custom separator. |
| `decimalScale` | int | Maximum number of decimal places. A deliberate `0` means no decimals. |
| `decimalSeparator` | string | The character used for the decimal point. |
| `fixedDecimalScale` | bool (default `false`) | Pad to `decimalScale` with trailing zeros. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="NumberFormatter"]` — it renders a plain `<span>` carrying the formatted value:

{% raw %}
```css
/* Every rendered NumberFormatter carries this island marker */
[data-aardvark-island="NumberFormatter"] { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% numberformatter value='1234567.89' prefix='$' thousandSeparator=',' decimalScale=2 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberformatter value='1234567.89' prefix='$' thousandSeparator=',' decimalScale=2 attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberformatter', value='1234567.89', prefix='$',
          thousandSeparator=',', decimalScale=2, attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
