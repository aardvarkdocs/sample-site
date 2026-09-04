---
title: "DonutChart"
description: "The built-in donutchart tag — a donut chart from JSON segments. Usage, the data shape, and a live example."
---

# DonutChart

A **donut chart** for part-to-whole breakdowns. Give it the segments in `data` (a JSON array of
`{name, value, color}`), size it with `size` / `thickness`, and optionally show a center
`chartLabel`. Each segment is sized as its share of the total, and hovering one opens a tooltip
with its value.

Use it as `{% raw %}{% donutchart %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'donutchart', …)`.

> **The charts need the `charts` component library.** Chart tags resolve against
> [`@mantine/charts`](https://mantine.dev/charts/getting-started/), which a site opts into: the
> package has to be installed **and** a `charts:` entry has to be declared under
> `componentLibraries:` in your theme's `theme.yaml`. Without it the chart renders nothing and
> the build reports an unknown component library. A site scaffolded by `vark new` installs the
> package but ships no `theme.yaml` — add one to turn the chart tags on. This site's copy, in
> `themes/vark/theme.yaml`, is a working example.
>
> Charts are drawn **in the browser** (they measure their live container), so they are not part
> of the pre-rendered HTML and do not appear with JavaScript turned off.

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
| `data` | JSON array of `{name, value, color}` | The donut segments. `color` is a theme color with a shade (`indigo.6`) or any CSS color. Malformed JSON warns during the build and draws an empty chart. |
| `size` | integer (px, default `160`) | Width and height of the chart. The ring runs from `size / 2 - thickness` to `size / 2`, so keep `size` **above twice `thickness`**: at exactly double there is no hole left and the donut is a solid pie, and below it the inner edge goes negative. Turning on `withLabels` grows the drawn box by 80px in **both** directions to make room for the labels — `size=180` with labels occupies 260x260. |
| `thickness` | integer (px, default `20`) | Ring thickness. |
| `chartLabel` | string | Text shown in the center. |
| `withLabels` | bool (`true` / `false`, default `false`) | Label each segment. |
| `withTooltip` | bool (`true` / `false`, default `true`) | Show the hover tooltip. |

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
