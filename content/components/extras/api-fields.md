---
title: "API Fields"
description: "The built-in field tag — hand-authored API parameter and response-field rows for references that aren't driven by an OpenAPI spec. One tag renders a labeled row: the field name, its type, required/deprecated badges, an optional default, an optional request-location badge, and a Markdown description. Usage, options, and live examples."
---

# API Fields

A **built-in** tag for documenting an API **by hand** — when there is no OpenAPI spec
driving the page. `{% raw %}{% field %}{% endraw %}` renders one labeled row: the field
**name** (monospace), its **type**, `required` / `deprecated` badges, an optional
**default**, an optional **location** badge (query / path / body / header / cookie), and a
**Markdown description** written as the block body.

**One tag covers both request parameters and response fields**, because the two render
identically. The only request-only affordance is the `location` badge — and a response
field, being just a key in the returned payload, simply omits it.

This is for prose you write yourself. If you already have an OpenAPI spec, reach for
[**OpenAPI**](/components/extras/openapi/) instead — it renders parameter and response
tables straight from the spec, with a "Try it now" form. `field` is the spec-free
counterpart: drop one row at a time into a guide.

Use it as `{% raw %}{% field %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'field', …)`.

## What `location` means

`location` is the one attribute that makes a row a **request parameter**. It answers the
question a name and a type can't: *where does this value go in the HTTP request?*

| `location` | Where the value rides | Example |
| --- | --- | --- |
| `query` | The URL query string | `GET /pets?limit=20` |
| `path` | A URL path segment | `GET /pets/{petId}` |
| `header` | A request header | `X-Api-Version: 2` |
| `cookie` | The `Cookie` header | `Cookie: session=abc` |
| `body` | The request body | `{"limit": 20}` |

It is the hand-authored mirror of OpenAPI's `in` field: a `field` with `location="query"`
renders exactly what `{% raw %}{% openapi %}{% endraw %}` shows for `in: query`. A
**response** field has no request location, so you just leave `location` off.

## Request parameters

`{% raw %}{% field %}{% endraw %}` takes the field `name` (the only required attribute),
an optional `type`, the `required` and `deprecated` flags, an optional `default`, and an
optional `location`. The block body is the description — full Markdown. Close it with
`{% raw %}{% endField %}{% endraw %}`.

{% field name="query" type="string" required=true location="query" %}
The search term to match against. Case-insensitive; supports `AND` / `OR` operators.
{% endField %}

{% field name="limit" type="integer" default="20" location="query" %}
Maximum number of results to return. Must be between **1** and **100**.
{% endField %}

{% field name="petId" type="string" required=true location="path" %}
The unique identifier of the pet, from a prior [list response](/components/extras/openapi/).
{% endField %}

{% field name="X-Api-Version" type="string" deprecated=true location="header" %}
Pins the request to a legacy API version. **Deprecated** — omit it to use the current version.
{% endField %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% field name="query" type="string" required=true location="query" %}
The search term to match against. Case-insensitive; supports `AND` / `OR` operators.
{% endField %}

{% field name="limit" type="integer" default="20" location="query" %}
Maximum number of results to return. Must be between **1** and **100**.
{% endField %}

{% field name="petId" type="string" required=true location="path" %}
The unique identifier of the pet, from a prior list response.
{% endField %}

{% field name="X-Api-Version" type="string" deprecated=true location="header" %}
Pins the request to a legacy API version. **Deprecated** — omit it to use the current version.
{% endField %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'field', name='query', type='string',
          required=True, location='query',
          children='The search term to match against. Case-insensitive.')
component('aardvark', 'field', name='limit', type='integer',
          default='20', location='query',
          children='Maximum number of results to return. Must be between **1** and **100**.')
```
{% endAccordionSection %}
{% endAccordion %}

## Response fields

A response field is the same tag with **no `location`** — there is nowhere in a request
for it to go. Everything else works identically.

{% field name="id" type="string" required=true %}
The unique identifier for the object, prefixed with its type (e.g. `pet_8xKq…`).
{% endField %}

{% field name="object" type="string" required=true %}
The type of object. Always **`pet`** for this endpoint.
{% endField %}

{% field name="tags" type="array" default="[]" %}
The labels attached to this pet. Each entry has an `id` and a `name`.
{% endField %}

{% field name="legacyStatus" type="integer" deprecated=true %}
The old numeric status code. **Deprecated** in favor of the string `status` field.
{% endField %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% field name="id" type="string" required=true %}
The unique identifier for the object, prefixed with its type (e.g. `pet_8xKq…`).
{% endField %}

{% field name="object" type="string" required=true %}
The type of object. Always **`pet`** for this endpoint.
{% endField %}

{% field name="tags" type="array" default="[]" %}
The labels attached to this pet. Each entry has an `id` and a `name`.
{% endField %}

{% field name="legacyStatus" type="integer" deprecated=true %}
The old numeric status code. **Deprecated** in favor of the string `status` field.
{% endField %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'field', name='id', type='string', required=True,
          children='The unique identifier for the object.')
component('aardvark', 'field', name='tags', type='array', default='[]',
          children='The labels attached to this pet. Each entry has an `id` and a `name`.')
```
{% endAccordionSection %}
{% endAccordion %}

## Request vs response fields

One tag serves both. A **request parameter** carries a `location` (`query`, `path`, `body`,
`header`, or `cookie` — OpenAPI's `in`, where the value rides in the request); a **response
field** is just a key in the returned payload, so it omits `location` and shows no location
badge. Nothing else differs — the two render identically.

{% raw %}
```aardvark
{% field name="petId" type="integer" required=true location="path" %}
A request parameter — the `location` badge marks where it rides.
{% endField %}

{% field name="id" type="string" %}
A response field — no location, no badge.
{% endField %}
```
{% endraw %}

## Rich descriptions

The body is full Markdown, so a field description can hold emphasis, links, inline
code, and lists — handy for enumerating allowed values or nested shapes:

{% field name="status" type="string" required=true %}
The lifecycle state of the pet. One of:

- `available` — ready to be adopted.
- `pending` — an adoption is in progress.
- `sold` — no longer available.

See the [status guide](/components/extras/openapi/) for the full state machine.
{% endField %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% field name="status" type="string" required=true %}
The lifecycle state of the pet. One of:

- `available` — ready to be adopted.
- `pending` — an adoption is in progress.
- `sold` — no longer available.

See the status guide for the full state machine.
{% endField %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `name` | Any string (**required**) | The field name, shown in monospace. The row's anchor. |
| `type` | Any string | The field's type (`string`, `integer`, `array`, …), shown as dimmed mono text. |
| `required` | `true` / `false` (default) | Shows a `required` badge when true. |
| `deprecated` | `true` / `false` (default) | Shows a `deprecated` badge when true. |
| `default` | Any string | Shows `default: <value>` after the badges. |
| `location` | `query`, `path`, `body`, `header`, `cookie` (or any string) | A color-coded badge showing where the parameter is sent in the request. Omit it for a response field. |
| `attr` | `{…}` | Raw HTML attributes forwarded onto the rendered field row (see below). |
| *(body)* | Markdown | The description, written between the open and close tags (`children=` from Python). |

## CSS Selectors

Every row renders the same `ApiField` island, so one wrapper class targets them all.

{% raw %}
```css
[data-aardvark-island="ApiField"] {
  /* style every field row on the page */
}

[data-aardvark-island="ApiField"] .aardvark-api-field-name {
  /* the monospace field name */
}

[data-aardvark-island="ApiField"] .aardvark-api-field-body {
  /* the Markdown description */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including an `id` for deep-linking) straight
onto the rendered field row.

{% field name="apiKey" type="string" required=true location="header" attr={'id': 'field-api-key'} %}
Your secret API key. This row carries `id="field-api-key"` so you can link straight to it.
{% endField %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% field name="apiKey" type="string" required=true location="header" attr={'id': 'field-api-key'} %}
Your secret API key. This row carries `id="field-api-key"` so you can link straight to it.
{% endField %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'field', name='apiKey', type='string', required=True,
          location='header', children='Your secret API key.',
          attr={'id': 'field-api-key'})
```
{% endAccordionSection %}
{% endAccordion %}
