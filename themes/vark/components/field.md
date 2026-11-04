---
name: field
description: A hand-authored API field row — the field `name` (mono), its `type`,
  `required`/`deprecated` badges, an optional `default`, an optional request
  `location` badge (query/path/body/header/cookie), and a Markdown body = the
  description. Use for API references NOT driven by an OpenAPI spec. One tag covers
  both request parameters and response fields; a response field simply omits
  `location`. Close with {% endField %}.
params:
  name: { type: string, required: true }
  type: string
  required: { type: bool, default: false }
  deprecated: { type: bool, default: false }
  default: string
  location: string
body: python
---
```python
# Renders the ApiField island (ApiField.jsx) — one labeled field row for an API
# reference you write BY HAND, when no OpenAPI spec drives the page. (The spec-driven twin is the
# openapi tag -> ApiReference.jsx, which renders the same information straight from the spec.)
#
# ONE tag serves both request parameters and response fields because the two render identically.
# The only request-only affordance is the `location` badge, and a response field just omits it.
#
# `location` mirrors OpenAPI's `in`: WHERE the value rides in the request — query / path / body /
# header / cookie. It is the thing that makes a row a request parameter; a response field is only a
# key in the returned payload, so it has no location. Omit it and the row is a response field.
_location = str(location or '').strip()

# Every declared param maps to one island prop. Unset optionals (None/''/False) are OMITTED so the
# island applies its own defaults rather than serializing a stream of null/false props. `name` is
# required by the schema, so it is always present; `type`, `default` and `location` are plain
# strings (a bare default=0 arrives coerced to "0", so it survives this truthiness gate);
# `required`/`deprecated` are booleans that ride only when true (an absent badge is the common case).
props = {'name': name}
if type: props['type'] = type
if required: props['required'] = True
if deprecated: props['deprecated'] = True
if default: props['default'] = default
if _location: props['location'] = _location
if attr: props['attr'] = attr
# The block body is the field's description — bracket it with blank lines so the page's single
# Markdown pass renders it (paragraphs, emphasis, links, inline code, lists) rather than leaving it
# literal inside the island's one-line <div> (the block-component convention). An
# empty/self-closing body stays '' so no stray blank lines are emitted.
_body = ("\n\n" + children + "\n\n") if (children or '').strip() else ''
print(component('ApiField', children=_body, **props))
```
