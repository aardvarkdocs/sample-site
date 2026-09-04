---
title: "Map"
description: "The built-in map tag — an embedded OpenFreeMap / MapLibre map with one pin per location. Pins take a street address (geocoded at build time, no API key) or explicit coordinates. Usage, options, and a live example."
---

# Map

A **built-in** tag that embeds an interactive map with a marker for each location.
It renders [OpenFreeMap](https://openfreemap.org) vector tiles with
[MapLibre GL JS](https://maplibre.org) — both **free and keyless** — so a map *just
works* with nothing to sign up for.

Aardvark uses the audited `mantine-map` package as an internal implementation dependency;
it does not expose a second community tag. {% raw %}`{% map %}`{% endraw %} is the only map
authoring surface. **You install nothing for it**: Aardvark ships that runtime, stages it into
your build cache, and publishes its content-hashed worker on your own site.
The executable map engine therefore loads from your own site rather than a JavaScript CDN.
The selected remote style, tiles, glyphs, and sprites are provider data, not executable CDN
runtime.

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

Click a marker for its popup. The map keeps **MapLibre | OpenFreeMap © OpenMapTiles | ©
OpenStreetMap contributors** attribution in the corner — that crediting is required, so don't
remove it. That corner credit accompanies the OpenFreeMap styles; point `style` at a full style
URL of your own and it isn't rendered, because it would be crediting the wrong people — whatever
your provider's terms require is then yours to put on the page.

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
| `lat=…` `lng=…` | Explicit coordinates (skips geocoding). `lon` is accepted as an alias for `lng`. A pair outside Earth's bounds (latitude ±90, longitude ±180) warns and drops the pin rather than placing it at some wrapped spot. |
| `label="…"` | Bold heading in the marker's popup (and the location's name in the fallback list). `title` is accepted as an alias. |
| `description="…"` | A line of detail below the label in the popup. |
| `color="#c2255c"` | Marker color — a plain CSS color: a hex value, a named color, or an `rgb()` / `hsl()` function. Anything else warns and the pin keeps the default color. |

## Geocoding, privacy & offline builds

Geocoding runs **only at build time** and only for `address` pins — the published page
contains coordinates, never an address lookup. Results are cached under
`.aardvark-cache/` (git-ignored), so addresses are resolved once and reused on every
later build.

### Forcing a re-lookup

Each geocoded address is cached as one small JSON file under `.aardvark-cache/geo/`,
named by a hash of the address (its contents are the resolved `lat` / `lng` and place
name). The cache is purely derived and git-ignored, so clearing it is always safe — it
just costs a fresh lookup on the next build.

A confirmed **"no match"** is cached too: that's an answer, not a failure, so a spelling the
geocoder doesn't recognize isn't re-asked on every build — clear its entry once you think the
provider would answer differently. A lookup that fails because the *network* is down is never
cached, so it simply retries on the next build.

To drop **every** cached coordinate and re-resolve on the next build:

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
  # userAgent: "…"             # the identifying User-Agent Nominatim's policy asks for
  style: liberty               # default basemap
  # height: 400                # default map height in pixels
```
{% endraw %}

`mantine-map` and MapLibre GL JS are shipped by Aardvark, not by your site. The first build
that renders a map extracts them into `.aardvark-cache/` (nothing is downloaded, and every
extracted file is checked against a digest recorded when it was vendored), then bundles that
runtime and CSS and emits a self-contained, content-hashed worker under `/_aardvark/maplibre/`.
There is nothing to install and no runtime JavaScript or CSS CDN dependency to configure.

**A project with its own installed `mantine-map` keeps using that copy.** Aardvark stages
nothing then — and removes anything it staged earlier, so its copy can never shadow yours — and
the version resolved from your `node_modules` is the one that gets bundled. It is the installed
tree that decides, not the manifest: a package your `package.json` lists but nobody installed
isn't a copy Aardvark can build against.

Your copy has to be **exactly 0.4.0**, the version the map surface is built against. A different
one is dropped with a warning rather than quietly swapped for Aardvark's — substituting a
version for a dependency you installed deliberately isn't Aardvark's call. Remove the pin to
hand the runtime back to Aardvark. **A dropped map still exits 0**: the build warns, renders the
accessible location list in place of the map, and carries on — so a map that disappears this way
is easy to miss in a build that otherwise passes. (Upgrading from 0.3.3, the one release that
moved the runtime off the CDN but still read it from your own `node_modules`: the `mantine-map`
and `maplibre-gl` pins it asked for can go, since Aardvark now supplies both.)

**Content-Security-Policy:** allow the local worker with `worker-src 'self'`, and allow
MapLibre's image forms with `img-src 'self' data: blob:`. The basemap style still names its
own remote style, tile, glyph, sprite, and image providers, so add those origins under
`connect-src` and `img-src` as appropriate. These responses are map data, not executable
runtime fetched from a CDN. The default OpenFreeMap styles use OpenFreeMap-hosted resources.
(Cloud hosts and WAFs sometimes set a CSP for you — check there if a map renders locally but
loses its basemap after deployment.)

No JavaScript? A reader (or a search crawler) without the map still gets an accessible
list of the pinned locations, each linking to its spot on OpenStreetMap — the same list
screen readers use.

**Turn maps off site-wide** with `map: false` in `aardvark.config.yaml`. Every
{% raw %}`{% map %}`{% endraw %} then renders nothing at all — not even the location list — and
the build does no geocoding, so a site that has switched maps off never reaches the network for
an address.

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
