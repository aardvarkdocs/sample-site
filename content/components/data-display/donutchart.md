---
title: "DonutChart"
description: "The built-in donutchart tag — a donut chart from JSON segments. Usage, the data shape, and a live example."
---

# DonutChart

A **donut chart** for part-to-whole breakdowns. Give it the segments in `data` (a JSON array of
`{name, value, color}`), size it with `size` / `thickness`, and optionally show a center
`chartLabel`. Renders in the browser and hydrates into an interactive island.

Use it as `{% raw %}{% donutchart %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'donutchart', …)`.

## A basic donut chart

{% donutchart size=180 thickness=28 withLabels=true chartLabel='Traffic' data='[
  {"name":"Search","value":48,"color":"indigo.6"},
  {"name":"Direct","value":27,"color":"teal.6"},
  {"name":"Referral","value":25,"color":"orange.6"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% donutchart size=180 thickness=28 withLabels=true chartLabel='Traffic' data='[
  {"name":"Search","value":48,"color":"indigo.6"},
  {"name":"Direct","value":27,"color":"teal.6"},
  {"name":"Referral","value":25,"color":"orange.6"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'donutchart', size=180, thickness=28, withLabels=True, chartLabel='Traffic',
          data='[{"name":"Search","value":48,"color":"indigo.6"}, …]')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array of `{name, value, color}` | The donut segments. |
| `size` | integer (px, default `160`) | Outer chart size. |
| `thickness` | integer (px, default `20`) | Ring thickness. |
| `chartLabel` | string | Text shown in the center. |
| `withLabels` | bool (`true` / `false`) | Label each segment. |
| `withTooltip` | bool (default `true`) | Show the hover tooltip. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="DonutChart"]` (or the more specific `[data-aardvark-lib="charts"][data-aardvark-island="DonutChart"]` when several libraries share the page) — or through the Mantine Styles API classes (`.mantine-DonutChart-root` and its inner parts):

{% raw %}
```css
/* Every rendered DonutChart carries this island marker */
[data-aardvark-island="DonutChart"] { }

/* Scope by library + island when you have several libraries in play */
[data-aardvark-lib="charts"][data-aardvark-island="DonutChart"] { }

/* Mantine Styles API class on the root element */
.mantine-DonutChart-root { }
.mantine-DonutChart-label { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% donutchart size=180 thickness=28 withLabels=true chartLabel='Traffic' data='[
  {"name":"Search","value":48,"color":"indigo.6"},
  {"name":"Direct","value":27,"color":"teal.6"},
  {"name":"Referral","value":25,"color":"orange.6"}
]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% donutchart size=180 thickness=28 withLabels=true chartLabel='Traffic' data='[
  {"name":"Search","value":48,"color":"indigo.6"},
  {"name":"Direct","value":27,"color":"teal.6"},
  {"name":"Referral","value":25,"color":"orange.6"}
]' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'donutchart', size=180, thickness=28, withLabels=True, chartLabel='Traffic',
          data='''[
  {"name":"Search","value":48,"color":"indigo.6"},
  {"name":"Direct","value":27,"color":"teal.6"},
  {"name":"Referral","value":25,"color":"orange.6"}
]''', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
