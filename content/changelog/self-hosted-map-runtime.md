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

The runtime is read out of your own `node_modules`, so **a site upgrading from an earlier
release has to install `mantine-map` 0.4.0** — add it to `package.json` *and* run your package
manager, since it is the installed tree that decides and a listed-but-uninstalled package is not
a copy Aardvark can build against. Until that copy is there, the build warns,
drops the interactive map and falls back to the accessible list of locations the tag always
renders for readers without JavaScript — the build still succeeds, which is what makes a
vanished map easy to overlook. Pin the version exactly: a copy that is not 0.4.0 is dropped the
same way, since that is the version the map surface is built against. Sites scaffolded by 0.3.3
already carry the pin. **This install requirement is 0.3.3 only** — 0.4.0 ships the runtime inside
Aardvark and stages it automatically, so a project that installs nothing gets a working map again
(a project with its own installed copy keeps using that one).

Three knobs are gone with the CDN they pointed at: `map.maplibreVersion`, `map.maplibreJs`
and `map.maplibreCss` no longer do anything, and are ignored without a warning — delete
them rather than waiting to be told. If you set a Content-Security-Policy, a map now needs
`worker-src 'self'` and `img-src 'self' data: blob:`; the basemap's own style, tile, glyph
and sprite origins still belong under `connect-src`/`img-src`, since those carry map data
rather than code.

The runtime is only shipped by sites that use it: a page tree with no {% raw %}`{% map %}`{% endraw %} emits
neither the MapLibre bundle nor the worker.

Released in 0.3.3. See [Map](/components/extras/map/).
