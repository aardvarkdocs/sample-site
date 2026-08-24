---
title: Maps run on your own site, not a CDN
date: 2026-08-22
version: "0.3.3"
taxonomy:
  - name: changes
    tags: [components, build]
nav: false
noindex: true
---

# Maps run on your own site, not a CDN

{% raw %}`{% map %}`{% endraw %} used to pull MapLibre GL JS from a public CDN at runtime. It now bundles a
runtime served from your own site and publishes the map worker as a same-origin asset, so
nothing executable in a map comes from a third party. A map keeps working when a CDN is
blocked or slow, and it needs no CDN allowance in a Content-Security-Policy.

In 0.3.3 this runtime came from your own `node_modules`, so a site upgrading from an earlier
release had to add `mantine-map` to its `package.json` first — otherwise the build warned,
dropped the interactive map, and fell back to the accessible list of locations the tag always
renders for readers without JavaScript. **That is no longer necessary**: Aardvark ships the
runtime and stages it into your build cache, so a map works with nothing installed. A project
that has its own installed `mantine-map` keeps using that copy — which still has to be exactly
0.4.0, or the map is dropped as before; Aardvark will not silently swap its runtime in for a
dependency you installed on purpose.

Three knobs are gone with the CDN they pointed at: `map.maplibreVersion`, `map.maplibreJs`
and `map.maplibreCss` no longer do anything, and are ignored without a warning — delete
them rather than waiting to be told. If you set a Content-Security-Policy, a map now needs
`worker-src 'self'` and `img-src 'self' data: blob:`; the basemap's own style, tile, glyph
and sprite origins still belong under `connect-src`/`img-src`, since those carry map data
rather than code.

The runtime is only shipped by sites that use it: a page tree with no {% raw %}`{% map %}`{% endraw %} emits
neither the MapLibre bundle nor the worker.

Released in 0.3.3. See [Map](/components/extras/map/).
