---
description: Render an OpenAPI spec inline on any page — the full reference or a single operation.
menu: api
title: OpenAPI reference
weight: 10
---

# OpenAPI reference

The `{% raw %}{% openapi %}{% endraw %}` directive renders an OpenAPI spec as a
Mantine-powered reference — every operation in an accordion, parameter and
response tables, and a **"Try it now"** form — **inline, on any page**. It's just
content, so you can surround it with prose and pick the page's layout.

## Render a spec

Put your spec under `openapi/` and point the directive at it. Paths are relative
to the **site root** (where `aardvark.config.yaml` lives):

{% raw %}
```aardvark
{% openapi 'openapi/petstore.json' %}
```
{% endraw %}

That's the whole reference. Because it's ordinary page content, the page chooses
its own layout — this site's [**/api/**](/api/) sets `mode: wide` so the response
tables get room to breathe.

## A single operation

Pass **both** `verb` and `endpoint` to render just one operation:

{% raw %}
```aardvark
{% openapi 'openapi/petstore.json' verb='get' endpoint='/pet/findByStatus' %}
```
{% endraw %}

The two go together. Supply only one and the build stops with advice:

{% raw %}
```text
{% openapi %} got verb='get' but no endpoint. Rendering a single operation
needs BOTH verb and endpoint, e.g.
{% openapi 'openapi/petstore.json' verb='get' endpoint='/your/endpoint' %}.
Omit both to render the whole spec.
```
{% endraw %}

`endpoint` must match the spec's path exactly — leading slash and any `{param}`
placeholders included. A bad pair lists the operations that *do* exist.

Here's a live slice — only `GET /pet/{petId}`, rendered right here on this page:

{% openapi 'openapi/petstore.json' verb='get' endpoint='/pet/{petId}' %}

## Responses

Operations list their responses straight from the spec. Define a `responses`
block and aardvark renders one collapsible row per status code — success and errors
alike — colour-coded by class (green `2xx`, orange `4xx`, red `5xx`). Every row
documents:

- the response **description**,
- any **headers** the response declares (name, type, description),
- a **properties table** for the body schema (name, type, required, description),
  resolving `$ref`s into `components/schemas` and descending into array items,
- the **example body** as formatted JSON, with a copy button.

```yaml
responses:
  '200':
    description: The requested pet.
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Pet'
        example:
          id: 7
          name: Fido
          status: available
  '404':
    description: No pet with that id exists.
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
        example:
          code: 404
          message: pet 7 not found
```

## Authorization

Declare a security scheme and aardvark renders an **Authorization** box at the top
of the reference. Readers paste their API key once; by default it's held in memory
for that browser session only, with a **Save this key in my browser** checkbox to
keep it (in `localStorage`) for next time. Either way it flows into both the request
samples and the **Try it now** requests as an `Authorization` header.

Add the scheme under `components.securitySchemes` and apply it — site-wide with a
top-level `security`, or per operation:

```yaml
security:
  - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: API key
      description: API key sent as a bearer token in the Authorization header.
```

Bearer tokens (`Authorization: Bearer <key>`), API keys in a header, query string,
or cookie (`type: apiKey` with `in: header`/`query`/`cookie`), and HTTP Basic
(`type: http, scheme: basic` — paste `username:password`, base64-encoded for you)
are all handled — though cookie keys appear only in the request samples, since the
in-browser Try it now can't set cookies. An operation opts out
of auth with `security: []`; a spec that defines a single scheme but omits
`security` still shows the box and applies that scheme.

## Request samples

Every operation shows ready-to-run **request samples**, generated from the spec and
switchable by tab — **cURL**, **Python** (`requests`), **JavaScript** (`fetch`),
**Go** (`net/http`), **PHP** (curl), and **Rust** (`reqwest`).

Samples fill in the path and query parameters, include the example request body for
writes, and carry the `Authorization` header — showing `Bearer YOUR_API_KEY` until
you enter a key. Anything you type into **Try it now** (parameters, body) is
mirrored into the samples, so the snippet always matches the request you're about
to send.

## How it works

The directive loads and parses the spec and emits the built-in `ApiReference`
React component (an island) with the spec as a prop; slicing simply narrows the
spec to one operation first. The "Try it now" form builds the request from your
path and query parameters and runs `fetch` against the spec's `servers[0].url`
(subject to the API's CORS policy). Security schemes ride along on that same prop,
so the Authorization key and the per-language samples are computed in the browser —
your key never leaves it.

With [build-time AI](/ai-features/) enabled, aardvark *augments* authored examples:
when an operation's success response has no `example`, it generates a realistic
one. Examples you write in the spec always win.
