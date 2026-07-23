---
title: "AreaChart"
description: "The built-in areachart tag — an area chart from JSON data and series. Usage, the data/series shape, and a live example."
---

# AreaChart

An **area chart** — like a line chart with the region under each line filled, good for showing
volume or stacked totals. Give it the rows in `data` and the areas in `series` (`{name, color}`),
with `dataKey` for the x-axis. Renders in the browser and hydrates into an interactive island.

Use it as `{% raw %}{% areachart %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'areachart', …)`.

## A basic area chart

{% areachart h=260 dataKey='month' curveType='monotone' withLegend=true data='[
  {"month":"Jan","Requests":1200,"Errors":40},
  {"month":"Feb","Requests":1800,"Errors":30},
  {"month":"Mar","Requests":1600,"Errors":55},
  {"month":"Apr","Requests":2400,"Errors":25}
]' series='[{"name":"Requests","color":"blue.6"},{"name":"Errors","color":"red.6"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% areachart h=260 dataKey='month' curveType='monotone' withLegend=true data='[
  {"month":"Jan","Requests":1200,"Errors":40},
  {"month":"Feb","Requests":1800,"Errors":30},
  {"month":"Mar","Requests":1600,"Errors":55},
  {"month":"Apr","Requests":2400,"Errors":25}
]' series='[{"name":"Requests","color":"blue.6"},{"name":"Errors","color":"red.6"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'areachart', h=260, dataKey='month', curveType='monotone', withLegend=True,
          data='[{"month":"Jan","Requests":1200,"Errors":40}, …]',
          series='[{"name":"Requests","color":"blue.6"},{"name":"Errors","color":"red.6"}]')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array of row objects | The chart rows. |
| `series` | JSON array of `{name, color}` | One area per entry. |
| `dataKey` | string | The row field used for the x-axis. |
| `h` | integer (px, default `300`) | Chart height. |
| `curveType` | `monotone`, `linear`, `natural`, `step`, … | Curve interpolation. |
| `unit` | string | Unit appended to axis/tooltip values. |
| `withLegend` | bool (`true` / `false`) | Show the legend. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="AreaChart"]` (or the more specific `[data-aardvark-lib="charts"][data-aardvark-island="AreaChart"]` when several libraries share the page) — or through the Mantine Styles API classes (`.mantine-AreaChart-root` and its inner parts):

{% raw %}
```css
/* Every rendered AreaChart carries this island marker */
[data-aardvark-island="AreaChart"] { }

/* Scope by library + island when you have several libraries in play */
[data-aardvark-lib="charts"][data-aardvark-island="AreaChart"] { }

/* Mantine Styles API class on the root element */
.mantine-AreaChart-root { }
.mantine-AreaChart-container { }
.mantine-AreaChart-axis { }
.mantine-AreaChart-grid { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% areachart h=260 dataKey='month' withLegend=true data='[
  {"month":"Jan","Requests":1200,"Errors":40},
  {"month":"Feb","Requests":1800,"Errors":30}
]' series='[{"name":"Requests","color":"blue.6"},{"name":"Errors","color":"red.6"}]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% areachart h=260 dataKey='month' withLegend=true data='[
  {"month":"Jan","Requests":1200,"Errors":40},
  {"month":"Feb","Requests":1800,"Errors":30}
]' series='[{"name":"Requests","color":"blue.6"},{"name":"Errors","color":"red.6"}]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'areachart', h=260, dataKey='month', withLegend=True,
          data='[{"month":"Jan","Requests":1200,"Errors":40},{"month":"Feb","Requests":1800,"Errors":30}]',
          series='[{"name":"Requests","color":"blue.6"},{"name":"Errors","color":"red.6"}]',
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
