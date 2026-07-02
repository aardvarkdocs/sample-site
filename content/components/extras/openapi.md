---
title: "OpenAPI"
description: "The built-in openapi tag — splice a single endpoint from an OpenAPI spec inline on any page, with parameter and response tables, multi-language request samples, a Try it now form, rich Markdown descriptions, and filename-discovered overlays. Or render a whole spec as a full reference. Usage, options, and a live example."
aliases:
  - /openapi/
---

# OpenAPI

A **built-in** tag that renders an OpenAPI spec as a Mantine-powered reference —
parameter and response tables, multi-language request samples, and a **"Try it
now"** form — **inline, on any page**. Point it at a **single operation** to
splice one endpoint into a guide right where you describe it; point it at the
whole spec for a complete reference.

This page is about that **single-endpoint slice** — dropping one operation into the
flow of a page. For the whole spec rendered as a full, immersive reference, head to
this site's [**Gateway API**](/api/) tab — the same tag with no slice, on a
`mode: wide` page, rendering this site's own live gateway API.

## Usage

Put your spec under `openapi/` and pass **both** `verb` and `endpoint` to render
just that one operation, inline. Paths are relative to the **site root** (where
`aardvark.config.yaml` lives):

{% raw %}
```aardvark
{% openapi 'openapi/petstore.json' verb='get' endpoint='/pet/{petId}' %}
```
{% endraw %}

The two attributes go together. Supply only one and the build stops with advice:

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

Here's a live slice — only `GET /pet/{petId}`, rendered right here in the middle
of this page:

{% openapi 'openapi/petstore.json' verb='get' endpoint='/pet/{petId}' %}

That's the point of a slice: the endpoint's full reference — its parameters,
responses, request samples, and **Try it now** form — sits inline next to your
prose, instead of sending the reader off to a separate reference page. Its
operation also joins this page's left-hand nav, the same as a heading.

## The whole spec

Omit `verb` and `endpoint` and the directive renders **every** operation — that's
the entire reference:

{% raw %}
```aardvark
{% openapi 'openapi/petstore.json' %}
```
{% endraw %}

Because it's ordinary page content, the page chooses its own layout — give it
`mode: wide` so the response tables get room to breathe. This site's
[**Gateway API**](/api/) tab does exactly that — the same tag, no slice, on a wide
page, with every operation wired into the left-hand nav. It renders this site's real
Aardvark gateway API, so it doubles as a live reference and a demonstration.

Operations are grouped in the nav by their first OpenAPI `tag`. The bucket heading
is the tag's `description` when it has one (else its `x-displayName`, else the
sentence-cased tag name) — so a tag like `pet` reads as **Everything about your
Pets** rather than a bare lowercase `pet`.

## Responses

Operations list their responses straight from the spec. Define a `responses`
block and aardvark renders one collapsible row per status code — success and errors
alike — colour-coded by class (green `2xx`, orange `4xx`, red `5xx`). Every row
documents:

- the response **description**,
- any **headers** the response declares (name, type, description),
- a **properties table** for the body schema (name, type, required, description),
  resolving `$ref`s into `components/schemas` and descending into array items,
- the **example body**, shown in the right-hand samples rail (beside the request samples on a
  wide page) as an **interactive, collapsible JSON tree** — expand or collapse any node and copy a
  single value or the whole body.

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

The interactive tree is the same community viewer behind [`{% raw %}{% jsontree %}{% endraw %}`](/components/community/jsontree/)
(the `@gfazioli/mantine-json-tree` package). It's already bundled on this site; if your own project
doesn't have that package installed, response examples render as a plain highlighted code block
instead — run `npm install @gfazioli/mantine-json-tree` to upgrade them to the tree. Non-JSON
examples always use the code block.

## Authorization

Declare a security scheme and aardvark renders an **Authorization** box at the top
of the reference. Readers paste their API key once; by default it's held in memory
for that browser session only, with a **Save this key in my browser** checkbox to
keep it (in `localStorage`) for next time. Either way it flows into both the request
samples and the **Try it now** requests, placed however the scheme declares it.

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
writes, and carry whatever credential the security scheme declares — for a bearer
scheme that's an `Authorization: Bearer YOUR_API_KEY` header (an `apiKey` scheme puts it
in its declared header, query parameter, or cookie instead), shown as a placeholder
until you enter a key. Anything you type into **Try it now** (parameters, body) is
mirrored into the samples, so the snippet always matches the request you're about
to send.

## Rich descriptions

Every `description` in the spec — the API blurb, each operation, parameters,
request-body fields, responses, headers, schema properties, and security schemes —
renders as **Markdown**, so links, emphasis, lists, and code all work. Standalone descriptions (the API intro and each
operation) go further: they accept the **full set of aardvark primitives**, so you
can drop a callout, a card grid, tabs, or any other component straight into your API
docs:

{% raw %}
```aardvark
# An operation's description:
Returns a single pet by id.

{% callout severity="caution" title="Rate limited" %}
This endpoint is capped at 60 requests per minute per key.
{% endCallout %}
```
{% endraw %}

Operation and API descriptions render as **block** content (they can hold block
components like callouts and card grids). Inline descriptions — parameter,
schema-property, and response-header rows in their tables, plus each **response's**
own blurb beside its status badge — render as **inline** Markdown, so they take
emphasis, code, links, and inline primitives like `{% raw %}{% icon %}{% endraw %}`.
These sit in tight spots (a table cell, an accordion label), so keep them short: a
block primitive like a callout dropped in an inline slot warns at build time and
belongs in an operation or API description instead. Summaries and titles stay plain
text; they're also used as headings and nav labels.

Descriptions are processed just like page content — the template engine runs before
Markdown — so wrap anything you want to *show* rather than run in a `raw` block, the
same as anywhere else on a page.

Rendered description HTML is sanitized (descriptions can come from a spec or overlay
you don't control), which drops the inline `style` attribute — so Markdown **table
column alignment** (`|:--|--:|`) isn't preserved inside an API description, though the
table itself still renders. Use a plain table, or a page body, if alignment matters.

Sanitizing strips scripts, event handlers, and `javascript:` URLs, but it allows
images and links — including external ones, exactly like a Markdown image anywhere
else. An external `<img>` still makes an outbound request when the page is viewed, so a
spec or **overlay pulled from a third party you don't vet** could phone home (a tracking
pixel). Treat an unvetted overlay like any other third-party content you'd embed.

## Overlays

Often the spec you document isn't yours to edit — a vendor's file, or one generated by a
build you don't control. An **[OpenAPI Overlay](https://spec.openapis.org/overlay/latest.html)**
customizes a base spec *without touching it*: a side file of `actions`, each selecting
node(s) with a JSONPath `target` and either **`update`**-ing or **`remove`**-ing them. Fix a
wrong summary, hide an internal operation, enrich a parameter, or drop an aardvark callout
into the overview — all from a file that survives the next time you re-download the spec.

### Setting one up

Aardvark discovers overlays **by filename** — no directive argument, no config. Drop a file
beside the spec named `<spec-stem>.overlay.{yaml,yml,json}` and it's applied on every
build. For `openapi/petstore.json` the stem is `petstore`, so the file is
`openapi/petstore.overlay.yaml`. The shape is an `overlay:` version, an optional `info:`
block (the overlay's own title/version — aardvark doesn't merge it into your spec), and the
`actions` list:

```yaml
# openapi/petstore.overlay.yaml — sits beside petstore.json, applied automatically
overlay: 1.0.0
info: { title: Petstore docs overlay, version: 1.0.0 }
actions:
  - target: "$.paths['/pet'].post.summary"   # what to select (a JSONPath)
    update: "Create a new pet listing"        # what to do with it
```

Each action needs a `target` and **exactly one** of `update` or `remove` — both together, or
neither, is skipped with a warning.

### Targeting nodes

`target` is a JSONPath into the spec — the **extended** dialect, so filter expressions work.
Common shapes:

| Target | Selects |
| --- | --- |
| `$.info.description` | the API's overview blurb |
| `$.info.title` | the API title |
| `$.paths['/pet'].post.summary` | one operation's summary |
| `$.paths['/pet/{petId}'].get` | a whole operation (e.g. to `remove` it) |
| `$.paths['/pet/{petId}'].get.parameters` | that operation's parameter **list** |
| `$.paths['/pet/findByStatus'].get.parameters[?(@.name=='status')]` | one parameter, picked by name |
| `$.components.schemas.Pet.properties.status.description` | a schema field's description |
| `$..parameters[?(@.name=='petId')].description` | **every** `petId` parameter, anywhere in the spec |
| `$` | the whole document (root) |

A `target` that matches nothing — a typo, or an operation that isn't there — emits a build
warning and is skipped, so an overlay can't break the build.

### `update` — rewrite, merge, or extend

What `update` does depends on the node it lands on:

- **A string (or other scalar) is replaced** — the summary action above swaps in new text.
- **A mapping deep-merges.** Where both sides hold a mapping the two merge key-by-key;
  otherwise your value wins. (It's the Overlay merge, *not* JSON Merge Patch — a `null`
  **replaces**, it doesn't delete; use `remove` to delete.) Add or override a field without
  restating the whole object:

  ```yaml
  - target: "$.components.schemas.Pet.properties.status"
    update: { description: "Lifecycle status.", example: "available" }
  ```

- **A list extends.** On an array, a **list** value appends each of its items; a single
  object or scalar is appended as one element. So you can add a parameter without rewriting
  the ones already there:

  ```yaml
  - target: "$.paths['/pet/findByStatus'].get.parameters"
    update:
      - { name: limit, in: query, schema: { type: integer }, description: "Max results." }
  ```

- **The root `$` deep-merges into the whole document** (with a mapping value) — the way to add
  something top-level like a `servers` entry or a site-wide `security` requirement.

### `remove` — hide a node

`remove: true` deletes the selected node — an internal operation, a deprecated parameter, a
property you'd rather not show:

```yaml
- target: "$.paths['/store/inventory'].get"   # drop one operation from the reference
  remove: true
```

`remove` must be the literal boolean `true`: a quoted `"true"`, or `remove: false`, is ignored
(with a warning) so a stray value can't silently delete half your spec. The document root `$`
can't be removed.

### Injecting aardvark primitives

Because a spec's standalone descriptions render as **content** (see [Rich descriptions](#rich-descriptions)),
an `update` that targets a `description` can drop a **callout, card grid, icon — any
primitive** straight into the rendered reference. This is the overlay's headline trick for
docs: enrich a vendor's bare spec with the same components you use on a page, without forking
it. (Wrap directives in the overlay's YAML exactly as on a page — the engine runs over
description text too.)

### Layering several overlays

Need more than one — say auth tweaks kept separate from prose? Name them with numeric prefixes
and they apply in **lexical filename order**:

```text
petstore.overlay.10-auth.yaml    # applied first
petstore.overlay.20-prose.yaml   # then this
petstore.overlay.yaml            # then this (a bare name sorts last)
```

The sort is lexical, not numeric — **zero-pad** single digits (`01`, `02`, … `10`), or an
unpadded `2-` sorts *after* `10-`.

### Best-effort by design

Overlays never fail a build. A file that won't parse, an action missing its `target`, an
unsupported JSONPath, a `target` that matches nothing — each emits a **build warning** (it
shows in the end-of-build summary) and is skipped; the rest of the overlay still applies. An
`overlay:` version that isn't `1.x` warns but applies anyway. Treat an overlay you didn't
write like any third-party content — see the sanitizing note under [Rich descriptions](#rich-descriptions).

### Live demonstration

Every petstore reference on this page — the slices above and below — is overlaid by the real
`openapi/petstore.overlay.yaml` sitting beside the spec, applied automatically. Four actions on
the upstream Swagger Petstore spec (prose abridged here):

{% raw %}
```yaml
# openapi/petstore.overlay.yaml — sits beside petstore.json, applied automatically
overlay: 1.0.0
info: { title: Petstore docs overlay, version: 1.0.0 }
actions:
  # 1. Replace the API blurb with prose + block primitives (a callout and a two-card grid).
  - target: "$.info.description"
    update: |
      Browse and manage pets {% icon "paw" %}, store orders, and users.

      {% callout severity="info" title="Sandbox API" %}
      Every operation runs against the public Petstore sandbox — data resets periodically.
      {% endCallout %}

      {% cardGrid cols=2 %}
      {% card title="Authentication" icon="key" accent="grape" %}
      Most write operations need an API key.
      {% endCard %}
      {% card title="Status codes" icon="components" accent="grape" %}
      Errors follow standard HTTP semantics.
      {% endCard %}
      {% endCardGrid %}

  # 2. Rewrite a summary you can't fix upstream.
  - target: "$.paths['/pet'].post.summary"
    update: "Create a new pet listing"

  # 3. Drop a caution callout into one operation's description.
  - target: "$.paths['/pet/findByStatus'].get.description"
    update: |
      Returns every pet matching the given **status** values.

      {% callout severity="caution" title="Deprecation" %}
      The multi-value form is being phased out — prefer a single status per request.
      {% endCallout %}

  # 4. Enrich one parameter, picked by name with a filter expression.
  - target: "$.paths['/pet/findByStatus'].get.parameters[?(@.name=='status')].description"
    update: "Filter by status — one or more of `available`, `pending`, or `sold`."
```
{% endraw %}

All four are visible right here. **Action 1** rewrites the API blurb — it renders as the
**overview** that heads every reference on this page (the **Sandbox API** callout and the
two-card grid, swapped in for the bare upstream text). **Action 2** rewrites a summary; here's a
live `POST /pet` slice showing **"Create a new pet listing"** instead of the upstream wording:

{% openapi 'openapi/petstore.json' verb='post' endpoint='/pet' %}

**Actions 3 and 4** land on `GET /pet/findByStatus` — the **Deprecation** caution in its
description and the enriched **status** parameter both come from the overlay, not the upstream
spec:

{% openapi 'openapi/petstore.json' verb='get' endpoint='/pet/findByStatus' %}

Because overlays are applied to the whole document **before** any slice is taken, an overlaid
summary, description, or parameter shows on a single-operation slice exactly as it does in a
full-spec reference.

## Options

The directive takes a quoted spec path and an optional `verb` / `endpoint` pair:

| Attribute | Effect |
| --- | --- |
| `'…'` (first argument) | Path to the OpenAPI spec, relative to the **site root** (**required**). JSON or YAML. |
| `verb='get'` | HTTP method of the operation to slice (`get`, `post`, `put`, `patch`, `delete`, …). Use **with** `endpoint`; omit **both** to render the whole spec. |
| `endpoint='/pet/{petId}'` | Path of the operation to slice — exactly as it appears in the spec, leading slash and `{param}` placeholders included. Use **with** `verb`. |

A page's [`sortableTables`](/authoring/tables/) setting (or the site `tables` block)
also governs the reference's tables — the only table switch that applies, since the
reference has no filter box.

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

## CSS Selectors

The reference mounts inside an island wrapper carrying `data-aardvark-island="ApiReference"` and renders its own class names — target the wrapper, each operation, its method badge and endpoint, the **Try it now** accordion, and the samples / responses rail.

{% raw %}
```css
[data-aardvark-island="ApiReference"]  /* the island wrapper */
.aardvark-api-op                       /* one operation section */
.aardvark-api-method                   /* the HTTP method badge */
.aardvark-api-endpoint                 /* the endpoint bar */
.aardvark-api-endpoint-url             /* the request path inside it (monospace) */
.aardvark-api-tryit                    /* the "Try it now" accordion */
.aardvark-api-rail                     /* the samples + responses rail */
```
{% endraw %}

## Injecting Attributes

`{% raw %}{% openapi %}{% endraw %}` is a self-contained directive, not a wrapped component, so it doesn't take a raw `attr={…}` channel — style it through the CSS parts above, and configure it with the documented attributes (`verb`, `endpoint`). To customize a spec you can't edit — rewrite a summary, inject a primitive, hide an operation — use an [overlay](#overlays) instead.
