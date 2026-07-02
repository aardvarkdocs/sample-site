---
title: "Choropleth Map"
description: "The choropleth community component — shade GeoJSON regions by a data value. Canvas-rendered, with projections, zoom, a legend, and Mantine theme colors."
menu: components
parent: community
weight: 30
---

# Choropleth Map

`choropleth` shades the regions of a **GeoJSON** map by a data value — the classic
"darker = bigger number" thematic map. You give it a GeoJSON `FeatureCollection` and a
small array of `{id, value}` rows; it matches each row to a feature by a property key and
colors the region on a sequential scale. It renders on a `<canvas>` for performance, picks
up your Mantine theme colors (including dark mode), and supports multiple projections, zoom
and pan, hover tooltips, and a gradient legend.

It renders client-side. On a static page (and for no-JS / screen-reader visitors) the tag
falls back to an accessible list of the data points (region → value) until the live map
mounts.

A **Community Component** — wraps [ChoroplethMap](https://maetes.github.io/mantine-choropleth/)
by **maetes**, **MIT** licensed, npm `mantine-choropleth`.

{% callout severity="info" title="Mantine compatibility" %}
`mantine-choropleth@0.0.2` declares a Mantine **8** peer dependency, but it runs on the
Mantine **9** that this site uses: every `@mantine/core` and `@mantine/hooks` API it imports
(`Paper`, `Text`, `Box`, `Tooltip`, `useMantineTheme`, `useMantineColorScheme`,
`useElementSize`, `useMergedRef`) is unchanged in v9, and it already uses the v9 `c` color
prop. The stale peer range is relaxed for install with an `overrides` entry in
`package.json`. If the package ships a Mantine-9 release, drop the override and bump the dep.
{% endCallout %}

Use it as `{% raw %}{% choropleth … %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'choropleth', …)`.

## Demonstrations

Pass `mapData` (a GeoJSON `FeatureCollection`, as a JSON string) and `data` (a JSON array of
`{id, value, label?}` rows). `propertyKey` names the feature property that each row's `id`
matches — here the toy map's features carry a `name` property. Live render below; on this
static page the map mounts on the client.

{% choropleth h=320 propertyKey='name' mantineColor='grape' mapData='{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"West"},"geometry":{"type":"Polygon","coordinates":[[[0,0],[2,0],[2,2],[0,2],[0,0]]]}},{"type":"Feature","properties":{"name":"East"},"geometry":{"type":"Polygon","coordinates":[[[2,0],[4,0],[4,2],[2,2],[2,0]]]}}]}' data='[{"id":"West","value":40,"label":"West"},{"id":"East","value":90,"label":"East"}]' %}

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% choropleth h=320 propertyKey='name' mantineColor='grape'
   mapData='{"type":"FeatureCollection","features":[ … ]}'
   data='[{"id":"West","value":40},{"id":"East","value":90}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'choropleth',
          h=320, propertyKey='name', mantineColor='grape',
          mapData='{"type":"FeatureCollection","features":[ … ]}',
          data='[{"id":"West","value":40},{"id":"East","value":90}]')
```
{% endAccordionSection %}
{% endAccordion %}

### Projection, zoom, and a legend

`projection` switches the map projection (`mercator`, `naturalEarth1`, `orthographic`,
`albers`, …). Set `zoomEnabled` for zoom and pan, and pass a `legend` JSON object to show a
gradient legend.

{% raw %}
```aardvark
{% choropleth h=420 propertyKey='iso_a3' projection='naturalEarth1'
   mantineColor='teal' zoomEnabled=true
   mapData='…your world GeoJSON…'
   data='[{"id":"USA","value":100},{"id":"DEU","value":80},{"id":"FRA","value":60}]'
   legend='{"show":true,"position":"bottom-right","title":"Population"}' %}
```
{% endraw %}

GeoJSON for world or admin boundaries is yours to bring — fetch a `FeatureCollection` you
trust and pass it as the `mapData` string. `propertyKey` must name the property on each
feature that your `data` rows' `id` values match (e.g. `iso_a3`, `name`).

## With other components

The choropleth sits inside the normal content flow, so it composes with layout primitives.
Here it's wrapped in a [Paper](/components/layout/paper/) surface with a heading above it.

{% raw %}
```aardvark
{% paper withBorder=true p='md' radius='md' %}
### Regional sales

{% choropleth h=300 propertyKey='name'
   mapData='{"type":"FeatureCollection","features":[ … ]}'
   data='[{"id":"West","value":40},{"id":"East","value":90}]' %}
{% endPaper %}
```
{% endraw %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `zoomEnabled`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `mapData` | GeoJSON `FeatureCollection` (JSON string) | The map to render. Required to show a map; malformed JSON warns and falls back. |
| `data` | JSON array of `{id, value, label?}` | The values to shade by. `id` matches a feature via `propertyKey`; `value` drives the color; `label` shows in the tooltip / fallback list. |
| `propertyKey` | string (default `id`) | The GeoJSON feature property each `data` row's `id` is matched against (e.g. `iso_a3`, `name`). |
| `projection` | `mercator`, `equirectangular`, `orthographic`, `naturalEarth1`, `albers`, `albersUsa`, `conicEqualArea` | Map projection. |
| `mantineColor` | A Mantine color name (e.g. `blue`, `teal`, `grape`) | Color for the sequential scale. |
| `colorSchemeType` | `sequential`, `diverging`, `categorical` | Color scheme type. |
| `strokeWidth` | number (default `0.5`) | Region border stroke width. |
| `h` | number (px, default `400`) | Map height. |
| `zoomEnabled` | `true` / `false` (default `false`) | Enable zoom and pan. |
| `legend` | JSON object (`{show, position, title, …}`) | Gradient legend configuration. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

The full [mantine-choropleth](https://maetes.github.io/mantine-choropleth/) prop set
(custom color interpolators, diverging midpoints, tooltip modes, animation, …) is available
when you call the component from Python; the tag above surfaces the common scalar and JSON
options.

## CSS Selector

The rendered wrapper carries a stable hook you can target from your own CSS:

```css
[data-aardvark-choropleth] {
  /* the wrapper around the canvas map (and its SSR / no-JS fallback list) */
}
```

The wrapper gains `data-ready` once the live canvas map has mounted on the client, so you can
style the pre-mount fallback distinctly:

```css
[data-aardvark-choropleth]:not([data-ready]) {
  /* the accessible fallback list, before the map renders */
}
```

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes onto the rendered wrapper element — useful for
test ids, `data-*` hooks, or ARIA overrides that the named attributes above don't cover.

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% choropleth h=300 propertyKey='name' attr={'data-testid': 'sales-map', 'data-region': 'emea'}
   mapData='{"type":"FeatureCollection","features":[ … ]}'
   data='[{"id":"West","value":40},{"id":"East","value":90}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'choropleth',
          h=300, propertyKey='name',
          attr={'data-testid': 'sales-map', 'data-region': 'emea'},
          mapData='{"type":"FeatureCollection","features":[ … ]}',
          data='[{"id":"West","value":40},{"id":"East","value":90}]')
```
{% endAccordionSection %}
{% endAccordion %}
