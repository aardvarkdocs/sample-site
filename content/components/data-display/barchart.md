---
title: "BarChart"
description: "The built-in barchart tag — a bar chart from JSON data and series. Usage, the data/series shape, and a live example."
---

# BarChart

A **bar chart** for comparing values across categories. Give it the rows in `data` (a JSON array
of objects) and the bars in `series` (a JSON array of `{name, color}`), with `dataKey` naming the
category axis. Renders in the browser and hydrates into an interactive island.

Use it as `{% raw %}{% barchart %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'barchart', …)`.

## A basic bar chart

{% barchart h=260 dataKey='product' withLegend=true data='[
  {"product":"Free","Q1":40,"Q2":55},
  {"product":"Pro","Q1":80,"Q2":120},
  {"product":"Team","Q1":30,"Q2":48}
]' series='[{"name":"Q1","color":"violet.6"},{"name":"Q2","color":"blue.6"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% barchart h=260 dataKey='product' withLegend=true data='[
  {"product":"Free","Q1":40,"Q2":55},
  {"product":"Pro","Q1":80,"Q2":120},
  {"product":"Team","Q1":30,"Q2":48}
]' series='[{"name":"Q1","color":"violet.6"},{"name":"Q2","color":"blue.6"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'barchart', h=260, dataKey='product', withLegend=True,
          data='[{"product":"Free","Q1":40,"Q2":55}, …]',
          series='[{"name":"Q1","color":"violet.6"},{"name":"Q2","color":"blue.6"}]')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array of row objects | The chart rows. |
| `series` | JSON array of `{name, color}` | One bar series per entry. |
| `dataKey` | string | The row field used for the category axis. |
| `h` | integer (px, default `300`) | Chart height. |
| `unit` | string | Unit appended to axis/tooltip values. |
| `withLegend` | bool (`true` / `false`) | Show the legend. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="BarChart"]` (or the more specific `[data-aardvark-lib="charts"][data-aardvark-island="BarChart"]` when several libraries share the page) — or through the Mantine Styles API classes (`.mantine-BarChart-root` and its inner parts):

{% raw %}
```css
/* Every rendered BarChart carries this island marker */
[data-aardvark-island="BarChart"] { }

/* Scope by library + island when you have several libraries in play */
[data-aardvark-lib="charts"][data-aardvark-island="BarChart"] { }

/* Mantine Styles API class on the root element */
.mantine-BarChart-root { }
.mantine-BarChart-container { }
.mantine-BarChart-axis { }
.mantine-BarChart-bar { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% barchart h=260 dataKey='product' withLegend=true data='[
  {"product":"Free","Q1":40,"Q2":55},
  {"product":"Pro","Q1":80,"Q2":120}
]' series='[{"name":"Q1","color":"violet.6"},{"name":"Q2","color":"blue.6"}]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% barchart h=260 dataKey='product' withLegend=true data='[
  {"product":"Free","Q1":40,"Q2":55},
  {"product":"Pro","Q1":80,"Q2":120}
]' series='[{"name":"Q1","color":"violet.6"},{"name":"Q2","color":"blue.6"}]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'barchart', h=260, dataKey='product', withLegend=True,
          data='[{"product":"Free","Q1":40,"Q2":55},{"product":"Pro","Q1":80,"Q2":120}]',
          series='[{"name":"Q1","color":"violet.6"},{"name":"Q2","color":"blue.6"}]',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
