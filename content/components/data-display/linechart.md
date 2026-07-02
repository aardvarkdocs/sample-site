---
title: "LineChart"
description: "The built-in linechart tag — a line chart from JSON data and series. Usage, the data/series shape, and a live example."
---

# LineChart

A **line chart** for trends over time or any ordered axis. Give it the rows in `data` (a JSON
array of objects) and the lines in `series` (a JSON array of `{name, color}`), and name the
x-axis field with `dataKey`. It renders in the browser (it's Recharts-backed) and hydrates into
an interactive island.

Use it as `{% raw %}{% linechart %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'linechart', …)`.

## A basic line chart

Each `series` entry names a key in the row objects and the color to draw it; `dataKey` is the
x-axis field.

{% linechart h=260 dataKey='month' withLegend=true data='[
  {"month":"Jan","Signups":120,"Active":80},
  {"month":"Feb","Signups":180,"Active":110},
  {"month":"Mar","Signups":160,"Active":135},
  {"month":"Apr","Signups":240,"Active":190}
]' series='[{"name":"Signups","color":"indigo.6"},{"name":"Active","color":"teal.6"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% linechart h=260 dataKey='month' withLegend=true data='[
  {"month":"Jan","Signups":120,"Active":80},
  {"month":"Feb","Signups":180,"Active":110},
  {"month":"Mar","Signups":160,"Active":135},
  {"month":"Apr","Signups":240,"Active":190}
]' series='[{"name":"Signups","color":"indigo.6"},{"name":"Active","color":"teal.6"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'linechart', h=260, dataKey='month', withLegend=True,
          data='[{"month":"Jan","Signups":120,"Active":80}, …]',
          series='[{"name":"Signups","color":"indigo.6"},{"name":"Active","color":"teal.6"}]')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array of row objects | The chart rows. |
| `series` | JSON array of `{name, color}` | One line per entry; `name` is a key in each row, `color` a Mantine color. |
| `dataKey` | string | The row field used for the x-axis. |
| `h` | integer (px, default `300`) | Chart height. |
| `curveType` | `monotone`, `linear`, `natural`, `step`, … | Line interpolation. |
| `unit` | string | Unit appended to axis/tooltip values. |
| `withLegend` | bool (`true` / `false`) | Show the legend. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="LineChart"]` (or the more specific `[data-aardvark-lib="charts"][data-aardvark-island="LineChart"]` when several libraries share the page) — or through the Mantine Styles API classes (`.mantine-LineChart-root` and its inner parts):

{% raw %}
```css
/* Every rendered LineChart carries this island marker */
[data-aardvark-island="LineChart"] { }

/* Scope by library + island when you have several libraries in play */
[data-aardvark-lib="charts"][data-aardvark-island="LineChart"] { }

/* Mantine Styles API class on the root element */
.mantine-LineChart-root { }
.mantine-LineChart-container { }
.mantine-LineChart-axis { }
.mantine-LineChart-line { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% linechart h=260 dataKey='month' withLegend=true data='[
  {"month":"Jan","Signups":120,"Active":80},
  {"month":"Feb","Signups":180,"Active":110}
]' series='[{"name":"Signups","color":"indigo.6"},{"name":"Active","color":"teal.6"}]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% linechart h=260 dataKey='month' withLegend=true data='[
  {"month":"Jan","Signups":120,"Active":80},
  {"month":"Feb","Signups":180,"Active":110}
]' series='[{"name":"Signups","color":"indigo.6"},{"name":"Active","color":"teal.6"}]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'linechart', h=260, dataKey='month', withLegend=True,
          data='[{"month":"Jan","Signups":120,"Active":80},{"month":"Feb","Signups":180,"Active":110}]',
          series='[{"name":"Signups","color":"indigo.6"},{"name":"Active","color":"teal.6"}]',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
