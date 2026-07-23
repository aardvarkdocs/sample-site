---
title: "Map"
description: "The built-in map tag — an embedded OpenFreeMap / MapLibre map with one pin per location. Pins take a street address (geocoded at build time, no API key) or explicit coordinates. Usage, options, and a live example."
---

# Map

A **built-in** tag that embeds an interactive map with a marker for each location.
It renders [OpenFreeMap](https://openfreemap.org) vector tiles with
[MapLibre GL JS](https://maplibre.org) — both **free and keyless** — so a map *just
works* with nothing to sign up for.

Drop a pin by **street address** and the address is turned into coordinates once, at
build time, by the free [Nominatim](https://nominatim.org) (OpenStreetMap) geocoder —
cached so a rebuild never re-looks-up an address it already knows. Prefer to be exact
(or build offline)? Give a pin explicit `lat` / `lng` and no geocoding happens at all.

## Usage

Wrap the map in `{% raw %}{% map %} … {% endMap %}{% endraw %}` and give each location
its own self-closing `{% raw %}{% pin %}{% endraw %}`. The simplest form is an address
and a label:

{% raw %}
```aardvark
{% map %}
{% pin address="British Museum, London" label="British Museum" %}
{% pin address="Tower of London, London" label="Tower of London" %}
{% pin address="Buckingham Palace, London" label="Buckingham Palace" %}
{% endMap %}
```
{% endraw %}

At build time each `address` is geocoded and baked into the page as coordinates, so the
reader's browser only loads the basemap and drops the markers — it never geocodes.

## Live example

The same three London landmarks, pinned by explicit coordinates so the page needs no
network when it builds — the source below and the map it renders match exactly. With no
`center` or `zoom` set, the map frames all the pins automatically:

{% raw %}
```aardvark
{% map height=420 %}
{% pin lat=51.5194 lng=-0.1270 label="British Museum" description="Great Russell St" %}
{% pin lat=51.5081 lng=-0.0759 label="Tower of London" description="A royal fortress since 1066" %}
{% pin lat=51.5014 lng=-0.1419 label="Buckingham Palace" color="#c2255c" %}
{% endMap %}
```
{% endraw %}

renders, live:

{% map height=420 %}
{% pin lat=51.5194 lng=-0.1270 label="British Museum" description="Great Russell St" %}
{% pin lat=51.5081 lng=-0.0759 label="Tower of London" description="A royal fortress since 1066" %}
{% pin lat=51.5014 lng=-0.1419 label="Buckingham Palace" color="#c2255c" %}
{% endMap %}

Click a marker for its popup. The map keeps the **© OpenStreetMap contributors** and
**OpenFreeMap** attribution in the corner — that crediting is required, so don't remove it.

## Pinning a location

A `{% raw %}{% pin %}{% endraw %}` is placed one of two ways:

- **By address** — `{% raw %}{% pin address="350 Fifth Ave, New York, NY" %}{% endraw %}`.
  Geocoded at build time (cached). Easiest to author; needs a network connection the
  first time it's built.
- **By coordinates** — `{% raw %}{% pin lat=40.7484 lng=-73.9857 %}{% endraw %}`. Exact,
  reproducible, and never touches the network. Use this for precision, for places a
  geocoder won't find, or to keep a build fully offline.

An address that can't be resolved (typo, or an offline build with a cold cache) is
**skipped with a build warning** rather than failing the build — so one bad address
never breaks your docs.

## Options

Every `{% raw %}{% map %}{% endraw %}` attribute is optional:

| `{% raw %}{% map %}{% endraw %}` attribute | Effect |
| --- | --- |
| `style="liberty"` | Basemap style: `liberty` (default), `bright`, `positron`, or a full MapLibre style URL. |
| `zoom=12` | Initial zoom level. Omit to auto-fit the pins. |
| `center="51.50,-0.12"` | Center as `"lat,lng"` — or an address. Omit to auto-fit the pins. |
| `height=420` | Map height in pixels (default `400`). |
| `interactive=false` | Lock the map (no pan/zoom, no zoom buttons) for a static locator. |

Each `{% raw %}{% pin %}{% endraw %}` takes:

| `{% raw %}{% pin %}{% endraw %}` attribute | Effect |
| --- | --- |
| `address="…"` | Street address, geocoded at build time. Use this **or** `lat`/`lng`. |
| `lat=…` `lng=…` | Explicit coordinates (skips geocoding). `lon` is accepted as an alias for `lng`. |
| `label="…"` | Bold heading in the marker's popup (and the location's name in the fallback list). |
| `description="…"` | A line of detail below the label in the popup. |
| `color="#c2255c"` | Marker color (any CSS color). |

## Geocoding, privacy & offline builds

Geocoding runs **only at build time** and only for `address` pins — the published page
contains coordinates, never an address lookup. Results are cached under
`.aardvark-cache/` (git-ignored), so addresses are resolved once and reused on every
later build.

### Forcing a re-lookup

Each geocoded address is cached as one small JSON file under `.aardvark-cache/geo/`,
named by a hash of the address (its contents are the resolved `lat` / `lng` and place
name). The cache is purely derived and git-ignored, so clearing it is always safe — it
just costs a fresh lookup on the next build. To drop **every** cached coordinate and
re-resolve on the next build:

```sh
rm -rf .aardvark-cache/geo
```

To drop a **single** entry — say the geocoder placed a pin in the wrong spot and you want
it looked up again — the filenames are hashed, so match the file by the (wrong) coordinate
you saw on the map, then delete it and rebuild:

```sh
grep -rl 43.6532 .aardvark-cache/geo | xargs rm
```

(To skip geocoding for a location altogether, give its pin explicit `lat` / `lng`.)

The default geocoder is Nominatim's public server, used within its
[usage policy](https://operations.osmfoundation.org/policies/nominatim/): one request
per second, a descriptive `User-Agent`, and aggressive caching. For heavier use, switch to
Google — all via the optional `map` block in `aardvark.config.yaml`:

{% raw %}
```yaml
map:
  geocoder: nominatim          # default; or "google"
  # googleApiKey: "…"          # required when geocoder: google
  # rateLimit: 1.0             # requests per second
  # timeout: 10                # seconds per geocoder request
  style: liberty               # default basemap
  # maplibreVersion: "5.24.0"  # pin a different MapLibre release
```
{% endraw %}

MapLibre GL JS loads from a pinned CDN release whose [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
hash the browser verifies. If you override `maplibreVersion` (or point `maplibreJs` /
`maplibreCss` at your own URLs), aardvark can't know the hash and ships **no** SRI for it —
you then own the supply-chain integrity of whatever that release serves.

**Content-Security-Policy:** SRI checks the bytes but doesn't grant permission to fetch them. If
your site sends a CSP, the browser blocks MapLibre's `<script>` and `<link>` unless their origin
is allow-listed — and the map silently drops to the fallback list below with a console error. The
default release loads from `cdn.jsdelivr.net`, so add `https://cdn.jsdelivr.net` to both
`script-src` and `style-src`, or point `maplibreJs` / `maplibreCss` at a self-hosted copy so no
third-party origin is needed. (Cloud hosts and WAFs sometimes set a CSP for you — check there if a
map renders fine locally but vanishes once deployed.)

No JavaScript? A reader (or a search crawler) without the map still gets an accessible
list of the pinned locations, each linking to its spot on OpenStreetMap — the same list
screen readers use.

## CSS Selectors

The map mounts inside an island wrapper carrying `data-aardvark-island="Map"` and renders its own class names — target the container, the MapLibre canvas, and the no-JavaScript fallback list.

{% raw %}
```css
[data-aardvark-island="Map"]  /* the island wrapper */
.aardvark-map                 /* the map container */
.aardvark-map-canvas          /* the MapLibre canvas */
.aardvark-map-fallback        /* the no-JS location list */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered map root. (Style it through the CSS parts above, and configure the map with the
documented attributes — `style`, `zoom`, `center`, `height`, `interactive` — plus each
`{% raw %}{% pin %}{% endraw %}`.)

{% map height=420 attr={'data-analytics': 'office-map', 'aria-label': 'London landmarks'} %}
{% pin lat=51.5194 lng=-0.1270 label="British Museum" %}
{% pin lat=51.5081 lng=-0.0759 label="Tower of London" %}
{% pin lat=51.5014 lng=-0.1419 label="Buckingham Palace" %}
{% endMap %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% map height=420 attr={'data-analytics': 'office-map', 'aria-label': 'London landmarks'} %}
{% pin lat=51.5194 lng=-0.1270 label="British Museum" %}
{% pin lat=51.5081 lng=-0.0759 label="Tower of London" %}
{% pin lat=51.5014 lng=-0.1419 label="Buckingham Palace" %}
{% endMap %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
{% raw %}
```python
component('aardvark', 'map', height=420,
          attr={'data-analytics': 'office-map', 'aria-label': 'London landmarks'}, children='''
{% pin lat=51.5194 lng=-0.1270 label="British Museum" %}
{% pin lat=51.5081 lng=-0.0759 label="Tower of London" %}
{% pin lat=51.5014 lng=-0.1419 label="Buckingham Palace" %}
''')
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}
