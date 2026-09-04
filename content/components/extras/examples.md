---
title: "Examples"
description: "The built-in requestExample and responseExample tags — side-by-side request/response panels for API docs, pinned in the right column. Each wraps one or more fenced code blocks and renders a titled panel with per-block syntax highlighting and copy/download; multiple blocks get a tab strip. Usage, options, and live examples."
---

# Examples

Two **built-in** tags for API documentation: `{% raw %}{% requestExample %}{% endraw %}` and
`{% raw %}{% responseExample %}{% endraw %}`. Each wraps one or more **fenced code blocks** and
renders a titled panel — a **Request** or a **Response** — with per-block **syntax highlighting**
and **copy / download**. They're built to sit **pinned in a page's right-hand column** next to your
prose, so a reader sees the call and the payload side by side; drop several blocks in one tag and
they stack into a **tab strip** (curl / Python / JavaScript, or one panel per status code).

Both tags share one island, so everything below applies to both — only the default heading, icon,
and accent color change (request vs. response).

Use them as `{% raw %}{% requestExample %}{% endraw %}` / `{% raw %}{% responseExample %}{% endraw %}`
in Markdown, or call them from Python logic (loops, snippets) via
`component('aardvark', 'requestExample', …)` / `component('aardvark', 'responseExample', …)`.

## Usage

Wrap each example in a normal Markdown **code fence**. The fence's language drives the
highlighting; everything between the tags is taken **verbatim** (so `{% raw %}{% … %}{% endraw %}`
inside the code is shown literally, never executed):

{% raw %}
````aardvark
{% requestExample %}
```bash
curl https://api.example.com/v1/pets \
  -H "Authorization: Bearer $TOKEN"
```
{% endRequestExample %}
````
{% endraw %}

renders, live:

{% requestExample %}
```bash
curl https://api.example.com/v1/pets \
  -H "Authorization: Bearer $TOKEN"
```
{% endRequestExample %}

The response twin is identical, with a **Response** heading and a distinct accent:

{% responseExample %}
```json
{
  "id": 1,
  "name": "Rex",
  "species": "dog",
  "adopted": false
}
```
{% endResponseExample %}

## Multiple languages

Put **several fenced blocks** in one `{% raw %}{% requestExample %}{% endraw %}` and the panel adds
a **tab strip** — one tab per block. The tab label is the block's `title=` if it has one, otherwise
its language — and, for a fence with neither, `Example 1`, `Example 2`, … so every tab stays
clickable. Perfect for showing the same call in curl, Python, and JavaScript:

{% raw %}
````aardvark
{% requestExample %}
```bash
curl https://api.example.com/v1/pets
```
```python
import requests
requests.get("https://api.example.com/v1/pets")
```
```javascript
await fetch("https://api.example.com/v1/pets");
```
{% endRequestExample %}
````
{% endraw %}

renders, live:

{% requestExample %}
```bash
curl https://api.example.com/v1/pets
```
```python
import requests
requests.get("https://api.example.com/v1/pets")
```
```javascript
await fetch("https://api.example.com/v1/pets");
```
{% endRequestExample %}

## Titling the panel and each block

Give the whole panel a heading with `title=`, and label an individual block with a `title="…"`
**fence decorator** (the same one Markdown code fences accept). Block titles become the tab labels
when there's more than one:

{% raw %}
````aardvark
{% responseExample title="Responses" %}
```json title="200 OK"
{ "id": 1, "name": "Rex" }
```
```json title="404 Not Found"
{ "error": "pet not found" }
```
{% endResponseExample %}
````
{% endraw %}

renders, live:

{% responseExample title="Responses" %}
```json title="200 OK"
{ "id": 1, "name": "Rex" }
```
```json title="404 Not Found"
{ "error": "pet not found" }
```
{% endResponseExample %}

## Pinning beside your prose

The panels are plain block islands, so they lay out wherever you place them. To get the classic
**two-column API layout** — prose on the left, a sticky example panel on the right — drop the tag
inside a [Grid](/components/layout/grid/) column (or your theme's right-rail). On a narrow screen
the panel simply stacks under the prose.

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the rendered
panel root, the same on both tags:

{% requestExample title="Create a pet" attr={'id': 'create-pet', 'data-analytics': 'api-example'} %}
```bash
curl https://api.example.com/v1/pets -X POST \
  -H "Authorization: Bearer $TOKEN"
```
{% endRequestExample %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
````aardvark
{% requestExample title="Create a pet" attr={'id': 'create-pet', 'data-analytics': 'api-example'} %}
```bash
curl https://api.example.com/v1/pets -X POST \
  -H "Authorization: Bearer $TOKEN"
```
{% endRequestExample %}
````
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'requestExample', title='Create a pet',
          children='```bash\ncurl https://api.example.com/v1/pets -X POST\n```',
          attr={'id': 'create-pet', 'data-analytics': 'api-example'})
```
{% endAccordionSection %}
{% endAccordion %}

## Options

| Attribute | Applies to | Description |
| --- | --- | --- |
| `title` | the tag | Overrides the panel heading (default **Request** / **Response**). |
| `title="…"` | a fence | A per-block heading; also the tab label when there are several blocks. |
| *(fence language)* | a fence | Drives syntax highlighting and the download file extension (`json`, `bash`, `python`, …). |
| `attr` | the tag | Raw HTML attributes (`{…}`) forwarded onto the rendered panel root element (see above). |
| *(any other)* | the tag | Passes straight through to the rendered panel as a prop. |

Syntax highlighting is baked in at **build time** — the same pass that colors every code fence on
the site — so a panel arrives already colored. When the build didn't color a block (site syntax
highlighting is off, or no lexer matched the language), the panel highlights it in the browser
instead, so a block is never left flat just because the build skipped it. A fence with **no**
language renders as plain, copyable text either way.

{% callout title="Good to know" %}
The body is taken **verbatim**, so the tags only ever see fenced code — a `{% raw %}{% … %}{% endraw %}`
inside a block is displayed, never executed. A tag containing **no** fenced block emits a build
warning and renders an empty panel reading "No example provided", rather than a bare titled box:
if a panel looks empty, check that each example is wrapped in a fence.
{% endCallout %}
