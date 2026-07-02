---
title: Aardvark Gateway API
description: The live, auto-generated HTTP reference for the Aardvark cloud gateway — rendered inline by the openapi directive on a wide-mode page.
menu: api
mode: wide
weight: 1
---

The reference below is the **real, user-facing API of the [Aardvark cloud
gateway](/ai/)** — the metered OpenRouter proxy and dashboard backend behind the
reader assistant. Chat, reader telemetry, dashboard analytics, account and API-key
management, team, billing, and magic-link auth are all here, rendered inline by the
`{% raw %}{% openapi %}{% endraw %}` directive on an ordinary Markdown page set to
`mode: wide` — no dedicated page generator, just a component.

It also doubles as the headline demonstration of that directive: every operation
below is wired into the left-hand nav, with parameter and response tables,
multi-language request samples, and a **Try it now** form. To splice a **single
endpoint** into a page instead of the whole spec, see [OpenAPI](/components/extras/openapi/)
under Components.

The spec it renders, `openapi/aardvark-gateway.json`, isn't hand-written: it's
**extracted from the gateway's own source** — every route's auth, request fields,
query params, response shape, and error codes — and regenerated on every change, so
this reference can't drift from the code it documents. (That's the same drift-proof
loop you'd wire up for your own API.)

{% openapi 'openapi/aardvark-gateway.json' %}
