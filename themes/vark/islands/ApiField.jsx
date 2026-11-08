/* @aardvark-island {"implements": ["ApiField@1"]} */
import { forwardRef } from 'react';
import { Badge, Code, Group, Text } from '@mantine/core';
import './ApiField.css';

// The island behind the built-in {% field %} tag (field.md). It renders
// one labeled field row for a hand-authored API reference — the sort you write by hand next to prose
// when there is NO OpenAPI spec driving the page (that's the separate, spec-driven {% openapi %} →
// ApiReference.jsx). Covers Mintlify's ParamField and ResponseField, which render identically.
//
// ONE tag serves both request parameters and response fields, because the only request-only
// affordance is the `location` badge (query/path/body/header/cookie — OpenAPI's `in`, i.e. where the
// value rides in the REQUEST). A response field is just a key in the returned payload, so it omits
// `location` and the badge doesn't render.
//
// The description is the block body: it arrives as `children` — already-rendered
// Markdown (paragraphs, emphasis, links, inline code, lists, even nested islands),
// reconstructed into real React children by the islands runtime's hydration tree — so
// we render {children} directly rather than taking a description string prop. That is
// exactly how {% callout %} carries its message body.
//
// SSR note: pure composition of @mantine/core primitives — no effects, no window — so the
// build-time prerenderer (renderToString) bakes the row verbatim and the client
// hydrateRoots it (falling back to createRoot only when the island wasn't prerendered).

// The location badge is a request-only concept: it renders whenever a `location` is given (a response
// field simply omits `location`, so the badge doesn't render). A small per-location color makes
// query/path/body/header/cookie scannable at a glance;
// an unrecognized location still renders, just in the neutral 'gray'. Keys are lowercased
// on lookup so `location="Query"` maps the same as `location="query"`.
const LOCATION_COLORS = {
  __proto__: null, // null-proto: an author-controlled `location` key can't resolve to an inherited Object.prototype member
  query: 'blue',
  path: 'grape',
  body: 'teal',
  header: 'orange',
  cookie: 'pink',
};

// forwardRef so `attr={...}` (and the collector's ref) reaches the rendered root DOM
// node. Mirrors the snippets/*.jsx + Callout.jsx convention.
const ApiField = forwardRef(function ApiField(
  { name, type, required = false, deprecated = false, default: defaultValue, location, children, ...rest },
  ref,
) {
  // `location` alone marks a row as a request parameter and drives the badge; a response field simply
  // omits it. An empty/whitespace `location` is treated as unset.
  const loc = typeof location === 'string' && location.trim() ? location.trim() : null;
  const locColor = loc ? LOCATION_COLORS[loc.toLowerCase()] || 'gray' : null;

  return (
    // Spread author props FIRST so a stray className (via component('aardvark', 'field', …)) can't
    // clobber the scoped class the CSS keys off — matching Panel.jsx / ExamplePanel.jsx.
    <div ref={ref} {...rest} className="aardvark-api-field">
      <Group className="aardvark-api-field-head" gap="xs" wrap="wrap" align="center">
        {/* The field name is the anchor of the row — monospace, like a code identifier. */}
        <Code className="aardvark-api-field-name">{name}</Code>

        {/* Type reads as secondary metadata, so it's dimmed mono text rather than a badge. */}
        {type ? (
          <Text component="span" className="aardvark-api-field-type" c="dimmed">
            {type}
          </Text>
        ) : null}

        {loc ? (
          <Badge className="aardvark-api-field-badge" size="sm" variant="light" color={locColor} radius="sm">
            {loc}
          </Badge>
        ) : null}

        {required ? (
          <Badge className="aardvark-api-field-badge" size="sm" variant="light" color="red" radius="sm">
            required
          </Badge>
        ) : null}

        {deprecated ? (
          <Badge className="aardvark-api-field-badge" size="sm" variant="light" color="yellow" radius="sm">
            deprecated
          </Badge>
        ) : null}

        {/* `defaultValue` is a string (the macro passes a plain string), so an empty string is
            treated as "no default" and the affordance is omitted. Shown as `default: <value>`
            with the value in mono so it lines up visually with the field name and type. */}
        {defaultValue ? (
          <Text component="span" className="aardvark-api-field-default" c="dimmed">
            default:{' '}
            <Code className="aardvark-api-field-default-value">{defaultValue}</Code>
          </Text>
        ) : null}
      </Group>

      {/* The description body — rendered Markdown as real React children (see the module note).
          Only wrapped when there's actually a body so an emptied row leaves no dangling block. */}
      {children ? <div className="aardvark-api-field-body">{children}</div> : null}
    </div>
  );
});

export default ApiField;
