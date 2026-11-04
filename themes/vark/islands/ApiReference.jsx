import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  Code,
  Group,
  Modal,
  NumberInput,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
  VisuallyHidden,
} from '@mantine/core';
import {
  IconBrandGolang,
  IconBrandJavascript,
  IconBrandPhp,
  IconBrandPython,
  IconBrandRust,
  IconLink,
  IconTerminal2,
} from '@tabler/icons-react';
import CodeActions from '@aardvark/islands/code-actions';
import { tokenizeCode, highlightHtml, extForLang } from '@aardvark/islands/highlight';

const METHOD_COLORS = {
  __proto__: null, // null-proto lookup table (defense-in-depth; `method` is currently a fixed METHODS constant, not author text)
  get: 'blue',
  post: 'green',
  put: 'yellow',
  patch: 'orange',
  delete: 'red',
};

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
const UNTAGGED_TAG = null;
const UNTAGGED_TAG_ANCHOR = 'aardvark-api-untagged';

// Render an OpenAPI description. At build time aardvark renders its Markdown + primitives to
// HTML and stashes it on an `x-aardvark-description-html` sibling; here we turn that back into
// React through the islands runtime's shared island tree (globalThis.__aardvarkHtmlToReact,
// installed by the generated entry) so nested primitives (a callout, a card grid, even a map)
// hydrate like any other island, on the client and in the SSR prerender alike. With no rich
// html (a plain spec) or no converter (a bare render where the entry didn't run) it falls back
// to the plain `text`, so a description with no markup looks exactly as it did before. Block
// prose is a <div> (it may hold block islands); inline prose (table cells, accordion labels)
// is a <span> so it stays valid phrasing content.
// Block-level elements that can't live inside phrasing content (a <span>, or an Accordion.Control
// <button>). If rendered prose contains one, Prose must wrap in <div>, and callers that render into a
// phrasing slot must route it elsewhere. Shared so the detection can't drift between the two.
//
// This is exactly the BLOCK subset of the build's prose allowlist, _PROSE_HTML_TAGS (the tags nh3
// keeps). The build's _PROSE_BLOCK_HTML *warn* set is broader (figure/details/section/aside/
// address) because it runs on the PRE-sanitize HTML; nh3 then strips those tags — they aren't
// allowlisted — so they can never reach this regex. Keep this in sync with the block tags in
// _PROSE_HTML_TAGS, NOT the warn set.
const PROSE_BLOCK_RE = /<(?:div|p|ul|ol|table|blockquote|pre|h[1-6])[\s/>]/i;

function Prose({ html, text, inline, ...textProps }) {
  const convert = typeof globalThis !== 'undefined' && globalThis.__aardvarkHtmlToReact;
  // A string `html` (even "") is the build's rendered result and is authoritative — the raw {% %}
  // source must NEVER reach the reader. So once html is a string we commit to it: with no converter
  // (a bare / third-party render where the entry didn't install __aardvarkHtmlToReact) we render
  // nothing rather than fall through to `text`, which for island-only prose is the raw source. The
  // `typeof html === 'string'` guard is deliberate — true for "" (an authoritative empty render),
  // false for an absent prop OR a non-string value (a malformed/overlay-injected boolean/number),
  // which then degrades to the `text` fallback instead of disappearing silently (`false != null`).
  if (typeof html === 'string') {
    if (!convert) return null;
    const kids = convert(html);
    if (!kids || !kids.length) return null;
    // Inline cells/labels are phrasing content, so default to <span>; but if a (misused) block
    // primitive left a block element in the html, wrap in <div> so we don't emit invalid <span><div>.
    const block = !inline || PROSE_BLOCK_RE.test(html);
    return (
      <Text component={block ? 'div' : 'span'} className="aardvark-api-prose" {...textProps}>
        {kids}
      </Text>
    );
  }
  if (text == null || text === '') return null;
  return <Text component={inline ? 'span' : undefined} {...textProps}>{text}</Text>;
}

// Saved keys (when the reader ticks "remember") are namespaced per spec — title +
// version — so two ApiReference instances for different specs never collide on one
// sessionStorage slot. sessionStorage is per-origin + per-tab and persists across
// navigations within that tab, so the collision to avoid is between specs in the same
// tab (two on one page, or across page loads) — not across origins or separate tabs.
const STORAGE_KEY_PREFIX = 'aardvark-api-key';
function storageKeyFor(spec) {
  const info = (spec && spec.info) || {};
  // Encode the parts so a ':' in a title/version can't collide two specs' keys.
  return `${STORAGE_KEY_PREFIX}:${encodeURIComponent(info.title || 'api')}:${encodeURIComponent(info.version || '')}`;
}

// What persisting the remembered key should do on a user change. Clearing the field
// (key === '') while "remember" stays on must NOT wipe a saved key — only unchecking
// "remember" removes it. Returns 'set' | 'remove' | 'none'.
function storageAction(key, keep) {
  if (keep && key) return 'set';
  if (!keep) return 'remove';
  return 'none';
}

function collectOperationsInPathOrder(spec) {
  const ops = [];
  const paths = spec.paths || {};
  Object.keys(paths).forEach((path) => {
    // Resolve a path-item $ref (OpenAPI 3.1: `/pets: { $ref: "#/components/pathItems/…" }`) so its
    // operations are collected. MUST match the build's OpenAPI parser (_resolve_ref, as its
    // operation_nav_items uses it) so the rendered sections and the build-time sidebar nav agree.
    const item = resolveRef(spec, paths[path] || {});
    METHODS.forEach((method) => {
      if (item[method]) {
        ops.push({ path, method, op: item[method] });
      }
    });
  });
  return ops;
}

function tagDisplayLabel(spec, tag) {
  const found = ((spec && spec.tags) || []).find((t) => {
    const name = t && t.name;
    return typeof name === 'string' && name.trim() === tag;
  });
  if (found) {
    const display = found['x-displayName'];
    if (typeof display === 'string' && display.trim()) return display.trim();
    if (typeof found.description === 'string') {
      const firstLine = found.description.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
      if (firstLine) return firstLine;
    }
  }
  const label = String(tag || '').replace(/[-_]/g, ' ').trim().replace(/\s+/g, ' ');
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : (tag || '');
}

function firstOperationTag(op) {
  const tags = op && op.tags;
  const tag = Array.isArray(tags) && tags.length ? tags[0] : null;
  return typeof tag === 'string' && tag.trim() ? tag.trim() : null;
}

function tagGroupKey(tag) {
  return typeof tag === 'string' && tag.trim() ? tag.trim() : UNTAGGED_TAG;
}

function tagGroupLabel(spec, tag) {
  return tag === UNTAGGED_TAG ? 'Other' : tagDisplayLabel(spec, tag);
}

function operationGroups(spec) {
  const groups = new Map();
  collectOperationsInPathOrder(spec).forEach((item) => {
    const tag = tagGroupKey(firstOperationTag(item.op));
    if (!groups.has(tag)) groups.set(tag, { tag, label: tagGroupLabel(spec, tag), ops: [] });
    groups.get(tag).ops.push(item);
  });

  const ordered = [];
  const seen = new Set();
  ((spec && spec.tags) || []).forEach((t) => {
    const rawName = t && t.name;
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (name && groups.has(name) && !seen.has(name)) {
      ordered.push(groups.get(name));
      seen.add(name);
    }
  });
  groups.forEach((group, tag) => {
    if (tag !== UNTAGGED_TAG && !seen.has(tag)) ordered.push(group);
  });
  if (groups.has(UNTAGGED_TAG)) ordered.push(groups.get(UNTAGGED_TAG));
  return ordered;
}

function collectOperations(spec) {
  return operationGroups(spec).flatMap((group) => group.ops);
}

function baseUrl(spec) {
  if (spec.servers && spec.servers.length) return spec.servers[0].url || '';
  return '';
}

// Follow a (possibly chained) $ref like "#/components/schemas/Pet" into the spec. Splits on a
// literal "/" and does NOT apply RFC 6901 ~1/~0 unescaping (a component named with "/" or "~"
// won't resolve) — mirrors _resolve_ref in the build's OpenAPI parser.
function resolveRef(spec, node) {
  let cur = node;
  const seen = new Set();
  while (cur && cur.$ref && !seen.has(cur.$ref)) {
    seen.add(cur.$ref);
    const parts = cur.$ref.replace(/^#\//, '').split('/');
    let target = spec;
    for (const p of parts) target = target && target[p];
    cur = target;
  }
  return cur || {};
}

// An operation's parameters with $refs resolved and dangling stubs dropped (resolveRef returns {}
// for an unresolvable $ref — no name/in). The single resolve step shared by ParamsTable (renders all
// kinds) and buildRequest/TryIt (which then narrow to in===path/query) — one place to keep in sync.
function resolvedParams(spec, op) {
  return (op.parameters || []).map((p) => resolveRef(spec, p)).filter((p) => p.name || p.in);
}

// A schema is an implicit object only when it actually NAMES fields. An empty `properties: {}` (truthy but
// fieldless — how a free-form object/map is often written) is NOT, so it must not be labelled `object`.
const namesFields = (s) => !!s && !!s.properties && Object.keys(s.properties).length > 0;

function jsonScalarLabel(value) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

// Human-readable type label for a schema: "string", "integer (a | b)", "array<Pet>", "object".
function typeLabel(spec, schema) {
  const s = flattenAllOf(spec, schema);
  if (!s || typeof s !== 'object') return '-';
  if (schemaDefinitelyImpossible(spec, s)) return 'never';
  if (s.type === 'array' && hasUnprojectedItemEvaluation(s)) {
    return 'array (positional)';
  }
  if (s.type === 'array' && s.items !== undefined) {
    const item = flattenAllOf(spec, s.items);
    // `any` for a truly untyped item ({} = "any value", or empty `properties`); `object` only when it has
    // named fields (implicit object). Avoids a misleading `array<object>` for an items-less/typeless array.
    return `array<${schemaDefinitelyImpossible(spec, item) ? 'never' : (item.type || (namesFields(item) ? 'object' : 'any'))}>`;
  }
  let label = Array.isArray(s.type) ? s.type.join(' | ') : (s.type || (namesFields(s) ? 'object' : ''));
  if (Array.isArray(s.enum) && s.enum.length) {
    const choices = s.enum.map(jsonScalarLabel).join(' | ');
    label = label ? `${label} (${choices})` : choices;
  } else if (s.const !== undefined) {
    const choice = jsonScalarLabel(s.const);
    label = label ? `${label} (${choice})` : choice;
  }
  return label || '-';
}

// --- Combinators (allOf / oneOf / anyOf) ------------------------------------------------------
//
// Two shapes reach this renderer and both must work:
//
//   (a) the textbook union — `oneOf: [{ $ref: A }, { $ref: B }]` plus `discriminator: { propertyName,
//       mapping }`. Each branch is a COMPLETE schema.
//   (b) the sibling union — a real `type: object` + `properties` + `required`, with a SIBLING `oneOf`
//       whose branches are constraint OVERLAYS: a per-branch `required` list and a one-element `enum`
//       pinning the discriminator, and no property schemas of their own.
//
// In (b) the parent's properties/required still apply and must be ANDed with the branch's — a branch
// read on its own describes only the keys it constrains, not the parent's whole object.

// Cap on how deep an `allOf` chain is followed. Every descent advances it — for the same reason
// synthesizeExample's allOf merge does — so the standard "base + self" idiom
// (`A: { allOf: [{ $ref: A }, …] }`) terminates instead of recursing forever.
const ALLOF_MAX_DEPTH = 6;
const INTERSECTION_MAX_DEPTH = 25;
const INTERSECTION_MAX_REF_PAIRS = 256;
const IMPOSSIBILITY_MAX_NODES = 256;

// An allOf has no override order: every member constrains the same value. Keep the exact members on
// the projected schema, and derive only facts this renderer consumes. Unknown constraints therefore
// remain semantically intact instead of one side being silently selected. The marker stops a later
// flattenAllOf call from re-expanding our already-normalized projection.
const INTERSECTION_PROJECTION = 'x-aardvark-intersection-projection';
const INTERSECTION_CONFLICTS = 'x-aardvark-intersection-conflicts';
const INTERSECTION_DESCRIPTIONS = 'x-aardvark-intersection-descriptions';
const SYNTHESIS_UNSAFE = 'x-aardvark-synthesis-unsafe';
const JSON_TYPE_ORDER = ['null', 'boolean', 'object', 'array', 'integer', 'number', 'string'];
const SUPPORTED_STRING_FORMATS = new Set(['date-time', 'date', 'email', 'uri', 'url', 'uuid']);

// Assertions this projection either retains exactly or derives enough facts from for the example
// synthesizer. Any other non-extension keyword (minimum, pattern, contains, if/then/else, …) remains
// exact in `allOf`, but the synthesizer must abstain because it cannot prove its sample satisfies it.
const PROJECTED_ASSERTION_KEYWORDS = new Set([
  '$ref', '$id', '$schema', '$anchor', '$comment', '$defs', 'definitions',
  'type', 'nullable', 'enum', 'const', 'properties', 'required', 'items',
  'additionalProperties', 'allOf', 'oneOf', 'anyOf', 'not', 'discriminator',
  'example', 'examples', 'default', 'title', 'description', 'format',
  'summary',
  'readOnly', 'writeOnly', 'deprecated', 'externalDocs', 'xml',
]);

function withSynthesisSafety(schema) {
  if (!schema || typeof schema !== 'object' || schema[SYNTHESIS_UNSAFE]) return schema;
  const unsupported = Object.keys(schema)
    .some((key) => !key.startsWith('x-') && !PROJECTED_ASSERTION_KEYWORDS.has(key));
  const residualAllOf = Array.isArray(schema.allOf) && schema.allOf.length
    && !schema[INTERSECTION_PROJECTION];
  return unsupported || residualAllOf
    ? { ...schema, [SYNTHESIS_UNSAFE]: true } : schema;
}

// Compare Unicode code points explicitly. Unlike localeCompare this is stable across the server's
// and browser's locales, and it matches Python's ordinary string ordering in the PDF renderer.
function compareText(a, b) {
  const left = Array.from(String(a));
  const right = Array.from(String(b));
  for (let i = 0; i < Math.min(left.length, right.length); i += 1) {
    const delta = left[i].codePointAt(0) - right[i].codePointAt(0);
    if (delta) return delta;
  }
  return left.length - right.length;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort(compareText).map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function canonicalValues(values) {
  const byKey = new Map();
  values.forEach((value) => byKey.set(canonicalJson(value), value));
  return Array.from(byKey.entries()).sort(([a], [b]) => compareText(a, b)).map(([, value]) => value);
}

function exactIntersectionMembers(...schemas) {
  return canonicalValues(schemas.flatMap((schema) => (
    schema && schema[INTERSECTION_PROJECTION] && Array.isArray(schema.allOf)
      ? schema.allOf : [schema]
  )));
}

function setOwnValue(target, key, value) {
  Object.defineProperty(target, key, {
    value, enumerable: true, configurable: true, writable: true,
  });
}

function ownValue(target, key) {
  return target && Object.prototype.hasOwnProperty.call(target, key) ? target[key] : undefined;
}

function schemaTypes(type) {
  if (typeof type === 'string') return [type];
  if (!Array.isArray(type)) return null;
  const unique = Array.from(new Set(type.filter((item) => typeof item === 'string')));
  // `integer` is a subset of `number`, so listing both adds no domain beyond `number`.
  return unique.includes('number') ? unique.filter((item) => item !== 'integer') : unique;
}

function effectiveSchemaTypes(schema) {
  const types = schemaTypes(schema && schema.type);
  if (!types) return null;
  const out = new Set(types);
  // OpenAPI 3.0 represents `T | null` as `type: T, nullable: true`.
  if (schema.nullable === true) out.add('null');
  return JSON_TYPE_ORDER.filter((type) => out.has(type));
}

function intersectTypes(a, b) {
  if (!a) return b;
  if (!b) return a;
  const out = new Set();
  for (const left of a) {
    for (const right of b) {
      if (left === right) out.add(left);
      else if ((left === 'number' && right === 'integer') || (left === 'integer' && right === 'number')) out.add('integer');
    }
  }
  return JSON_TYPE_ORDER.filter((type) => out.has(type));
}

function valueMatchesTypes(value, types) {
  if (!types) return true;
  const kind = value === null ? 'null'
    : Array.isArray(value) ? 'array'
      : (typeof value === 'number' && Number.isInteger(value)) ? 'integer'
        : typeof value;
  return types.includes(kind) || (kind === 'integer' && types.includes('number'));
}

function valueMatchesKnownFormat(schema, value) {
  if (!schema || typeof schema.format !== 'string') return true;
  const format = schema.format.toLowerCase();
  // OpenAPI formats are open-ended annotations. Validate only the formats this synthesizer actively
  // interprets; unfamiliar/type-specific formats (int64, double, binary, vendor formats) stay neutral.
  if (!SUPPORTED_STRING_FORMATS.has(format)) return true;
  if (typeof value !== 'string') return true;
  if (format === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (format === 'uuid') {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
  const validDate = (text) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!match) return false;
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    return date.getUTCFullYear() === Number(match[1])
      && date.getUTCMonth() === Number(match[2]) - 1
      && date.getUTCDate() === Number(match[3]);
  };
  if (format === 'date') return validDate(value);
  if (format === 'date-time') {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
    if (!match || !validDate(value.slice(0, 10))) return false;
    const [, , , , hour, minute, second, , offsetHour, offsetMinute] = match;
    // Date.parse normalizes invalid RFC 3339 values such as 24:00:00 instead of rejecting them.
    // Check the ABNF ranges before using it as positive evidence. Leap seconds remain unknown below:
    // they are valid RFC 3339 at declared instants, but JavaScript's parser cannot prove them.
    if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 60
      || (offsetHour !== undefined && (Number(offsetHour) > 23 || Number(offsetMinute) > 59))) {
      return false;
    }
    return !Number.isNaN(Date.parse(value));
  }
  try { return !!new URL(value).protocol; } catch (e) { return false; }
}

function domainAllowsType(types, values, type) {
  if (types !== null && !types.includes(type)) return false;
  if (values !== null && !values.some((value) => valueMatchesTypes(value, [type]))) return false;
  return true;
}

// Validate only facts this renderer actually projects. Unknown assertions deliberately do not make
// an enum value impossible; they merely set SYNTHESIS_UNSAFE. Known object/array facts do matter,
// because preferring an enum literal that lacks a required property would be provably invalid.
function valueMatchesProjectedFacts(spec, schema, value, depth = 0) {
  if (depth > INTERSECTION_MAX_DEPTH) return null;
  const s = flattenAllOf(spec, schema);
  if (schemaDefinitelyImpossible(spec, s)) return false;
  const choices = enumConstraint(s);
  if (choices !== null && !choices.some((item) => canonicalJson(item) === canonicalJson(value))) {
    return false;
  }
  const types = effectiveSchemaTypes(s);
  if (!valueMatchesTypes(value, types)) return false;
  let unknown = false;
  const formatMatch = valueMatchesKnownFormat(s, value);
  // Format vocabularies and runtime parsers differ at valid edges (RFC 3339 leap seconds, email
  // domain forms, year ranges). A mismatch is therefore unknown, not proof that an enum is empty.
  if (formatMatch !== true) unknown = true;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const required = Array.isArray(s.required) ? s.required : [];
    if (required.some((name) => !Object.prototype.hasOwnProperty.call(value, name))) return false;
    const props = s.properties && typeof s.properties === 'object' ? s.properties : {};
    for (const [name, child] of Object.entries(props)) {
      if (!Object.prototype.hasOwnProperty.call(value, name)) continue;
      const match = valueMatchesProjectedFacts(spec, child, value[name], depth + 1);
      if (match === false) return false;
      if (match === null) unknown = true;
    }
    const extras = Object.keys(value).filter((name) => !Object.prototype.hasOwnProperty.call(props, name));
    const unknownAdmission = hasUnprojectedPropertyAdmission(s);
    if (s.additionalProperties === false && extras.length) {
      if (!unknownAdmission) return false;
      unknown = true;
    }
    if (!unknownAdmission && s.additionalProperties && typeof s.additionalProperties === 'object') {
      for (const name of extras) {
        const match = valueMatchesProjectedFacts(
          spec, s.additionalProperties, value[name], depth + 1,
        );
        if (match === false) return false;
        if (match === null) unknown = true;
      }
    }
  } else if (Array.isArray(value) && s.items !== undefined) {
    if (hasUnprojectedItemEvaluation(s)) return null;
    for (const item of value) {
      const match = valueMatchesProjectedFacts(spec, s.items, item, depth + 1);
      if (match === false) return false;
      if (match === null) unknown = true;
    }
  }
  return unknown ? null : true;
}

function enumConstraint(schema) {
  const values = Array.isArray(schema.enum) ? schema.enum : null;
  if (schema.const === undefined) return values;
  if (!values) return [schema.const];
  return values.some((value) => canonicalJson(value) === canonicalJson(schema.const))
    ? [schema.const] : [];
}

function displayFact(a, b, key) {
  const av = a[key], bv = b[key];
  if (av === undefined) return bv;
  if (bv === undefined) return av;
  if (canonicalJson(av) === canonicalJson(bv)) return av;
  // Annotations do not change validity. Retain one deterministic authored value for display instead
  // of dropping all prose merely because two allOf members annotate the same field differently.
  return compareText(canonicalJson(av), canonicalJson(bv)) <= 0 ? av : bv;
}

function descriptionValues(schema) {
  if (Array.isArray(schema[INTERSECTION_DESCRIPTIONS])) return schema[INTERSECTION_DESCRIPTIONS];
  const text = typeof schema['x-aardvark-description-text'] === 'string'
    ? schema['x-aardvark-description-text']
    : (typeof schema.description === 'string' ? schema.description : null);
  return text === null ? [] : [text];
}

function projectDescription(a, b, out) {
  const values = canonicalValues([...descriptionValues(a), ...descriptionValues(b)]);
  if (!values.length) return;
  out[INTERSECTION_DESCRIPTIONS] = values;
  if (values.length > 1) {
    // Conflicting rich bundles cannot be concatenated safely as HTML. Preserve every authored text
    // value in deterministic plain prose; the original HTML remains intact in the exact allOf members.
    out.description = values.join('\n\n');
    return;
  }
  const sources = [a, b]
    .filter((schema) => descriptionValues(schema).some((value) => canonicalJson(value) === canonicalJson(values[0])))
    .sort((left, right) => compareText(canonicalJson(left), canonicalJson(right)));
  const source = sources[0] || {};
  ['description', 'x-aardvark-description-html', 'x-aardvark-description-text'].forEach((key) => {
    if (source[key] !== undefined) out[key] = source[key];
  });
}

function isImpossibleSchema(schema) {
  const choices = schema && typeof schema === 'object' ? enumConstraint(schema) : null;
  return !!(schema && typeof schema === 'object'
    && (schema.not === true
      || (schema.not && typeof schema.not === 'object' && !Object.keys(schema.not).length)
      || (choices !== null && !choices.length)
      || (Array.isArray(schema.oneOf) && !schema.oneOf.length)
      || (Array.isArray(schema.anyOf) && !schema.anyOf.length)));
}

// Prove nested union contradictions without pretending to implement arbitrary JSON Schema. A
// oneOf/anyOf is impossible only when EVERY resolvable branch is itself definitely impossible after
// applying the parent's constraints. Missing refs and the depth bound stay unknown, never false.
function schemaDefinitelyImpossible(spec, schema, depth = 0, state = null) {
  const proof = state || { memo: new Map(), remaining: IMPOSSIBILITY_MAX_NODES };
  const s = flattenAllOf(spec, schema);
  if (isImpossibleSchema(s)) return true;
  if (depth >= ALLOF_MAX_DEPTH) return false;
  const memoKey = `${depth}\u0000${canonicalJson(s)}`;
  if (proof.memo.has(memoKey)) return proof.memo.get(memoKey);
  // A compact ref DAG can encode exponentially many logical paths. Exhaustion is uncertainty, not
  // proof of satisfiability: return false so callers preserve/render the schema conservatively.
  if (proof.remaining <= 0) return false;
  proof.remaining -= 1;
  const parent = stripCombinators(s);
  for (const key of ['oneOf', 'anyOf']) {
    const raw = s[key];
    if (!Array.isArray(raw) || !raw.length) continue;
    let allImpossible = true;
    for (const node of raw) {
      const branch = resolveSchemaNode(spec, node);
      if (branch === undefined) {
        allImpossible = false;
        break;
      }
      const merged = intersectSchemas(spec, parent, branch, 0, true);
      if (!schemaDefinitelyImpossible(spec, merged, depth + 1, proof)) {
        allImpossible = false;
        break;
      }
    }
    if (allImpossible) {
      proof.memo.set(memoKey, true);
      return true;
    }
  }
  proof.memo.set(memoKey, false);
  return false;
}

// Schema-only resolver that preserves OpenAPI 3.1 boolean schemas and distinguishes a valid `{}`
// target from a genuinely missing ref. General OpenAPI callers keep resolveRef's historical `{}`
// fallback; combinator filtering needs the richer result so it cannot change `anyOf: [A, {}]` into A.
function resolveSchemaNode(spec, node) {
  let cur = node;
  const seen = new Set();
  const siblings = [];
  while (cur && typeof cur === 'object' && typeof cur.$ref === 'string' && !seen.has(cur.$ref)) {
    seen.add(cur.$ref);
    const sibling = { ...cur };
    delete sibling.$ref;
    if (Object.keys(sibling).length) siblings.push(sibling);
    const parts = cur.$ref.replace(/^#\//, '').split('/');
    let target = spec;
    for (const part of parts) target = target && target[part];
    if (target === undefined || target === null) return undefined;
    cur = target;
  }
  if (cur === true || cur === false) return siblings.length ? { allOf: [cur, ...siblings] } : cur;
  if (!cur || typeof cur !== 'object') return undefined;
  // OpenAPI 3.1 / JSON Schema applies siblings of `$ref` as an intersection. Keep them as exact
  // allOf members so the projection retains branch-local titles, fields and requirements instead of
  // silently replacing the whole branch with the referenced base schema.
  return siblings.length ? { allOf: [cur, ...siblings] } : cur;
}

function hasUnprojectedPropertyAdmission(schema) {
  if (!schema || typeof schema !== 'object') return false;
  if (schema.patternProperties !== undefined || schema.unevaluatedProperties !== undefined) return true;
  return !!(schema[INTERSECTION_PROJECTION] && Array.isArray(schema.allOf)
    && schema.allOf.some(hasUnprojectedPropertyAdmission));
}

function hasUnprojectedItemEvaluation(schema) {
  if (!schema || typeof schema !== 'object') return false;
  if (schema.prefixItems !== undefined || schema.unevaluatedItems !== undefined) return true;
  return !!(schema[INTERSECTION_PROJECTION] && Array.isArray(schema.allOf)
    && schema.allOf.some(hasUnprojectedItemEvaluation));
}

function propertyConstraint(schema, name) {
  const props = schema.properties && typeof schema.properties === 'object' ? schema.properties : {};
  if (Object.prototype.hasOwnProperty.call(props, name)) return props[name];
  // A matching pattern/unevaluated-property rule may still admit this name. Keep the exact member
  // and let SYNTHESIS_UNSAFE make examples abstain rather than falsely deriving `never`.
  if (hasUnprojectedPropertyAdmission(schema)) return {};
  if (schema.additionalProperties === false) return { not: {} };
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    return schema.additionalProperties;
  }
  return {};
}

function schemaContainsRef(schema, depth = 0) {
  if (!schema || typeof schema !== 'object' || depth > 8) return depth > 8;
  if (typeof schema.$ref === 'string') return true;
  const children = [
    ...Object.values(schema.properties || {}),
    schema.items, schema.additionalProperties, schema.not, schema.if, schema.then, schema.else,
    schema.contains,
    ...(Array.isArray(schema.prefixItems) ? schema.prefixItems : []),
    ...(Array.isArray(schema.allOf) ? schema.allOf : []),
    ...(Array.isArray(schema.oneOf) ? schema.oneOf : []),
    ...(Array.isArray(schema.anyOf) ? schema.anyOf : []),
  ];
  return children.some((child) => schemaContainsRef(child, depth + 1));
}

function boundedSchemaFacts(spec, schema) {
  const resolved = resolveSchemaNode(spec, schema);
  if (resolved === false) return { not: {} };
  if (resolved === true) return {};
  return withSynthesisSafety(resolved || {});
}

function boundedIntersectionSummary(spec, a, b, depth = 0) {
  const out = {
    [INTERSECTION_PROJECTION]: true,
    allOf: exactIntersectionMembers(a, b),
    [SYNTHESIS_UNSAFE]: true,
  };
  const aTypes = effectiveSchemaTypes(a), bTypes = effectiveSchemaTypes(b);
  let types = intersectTypes(aTypes, bTypes);
  let impossible = isImpossibleSchema(a) || isImpossibleSchema(b)
    || !!(aTypes && bTypes && !types.length);
  const aEnum = enumConstraint(a), bEnum = enumConstraint(b);
  let values = aEnum !== null ? aEnum : bEnum;
  if (aEnum !== null && bEnum !== null) {
    const allowed = new Set(bEnum.map(canonicalJson));
    values = aEnum.filter((value) => allowed.has(canonicalJson(value)));
  }
  if (values !== null) {
    values = canonicalValues(values).filter((value) => valueMatchesTypes(value, types));
    if (!values.length) impossible = true;
    else out.enum = values;
  }
  if (types !== null && values && values.length) {
    types = types.filter((type) => values.some((value) => valueMatchesTypes(value, [type])));
  }
  if (types && types.length) out.type = types.length === 1 ? types[0] : types;
  if (types && types.includes('null')) out.nullable = true;
  if (depth < SCHEMA_MAX_DEPTH - 1 && domainAllowsType(types, values, 'object')) {
    const names = Array.from(new Set([
      ...Object.keys(a.properties || {}), ...Object.keys(b.properties || {}),
      ...(a.required || []), ...(b.required || []),
    ])).sort(compareText);
    if (names.length) {
      out.properties = {};
      names.forEach((name) => {
        const av = boundedSchemaFacts(spec, propertyConstraint(a, name));
        const bv = boundedSchemaFacts(spec, propertyConstraint(b, name));
        const child = canonicalJson(av) === canonicalJson(bv)
          ? av : boundedIntersectionSummary(spec, av, bv, depth + 1);
        setOwnValue(out.properties, name, child);
      });
    }
    const required = Array.from(new Set([...(a.required || []), ...(b.required || [])])).sort(compareText);
    if (required.length) out.required = required;
    // Match the full projection's exact proof: an object-only schema cannot be inhabited when one
    // of its required properties has an impossible intersection. Do not propagate for a wider
    // domain (`object | null`, for example), because a non-object value may still satisfy it.
    const objectOnly = !!(types && types.length === 1 && types[0] === 'object');
    if (objectOnly
      && required.some((name) => out.properties && isImpossibleSchema(out.properties[name]))) {
      impossible = true;
    }
  }
  if (depth < SCHEMA_MAX_DEPTH - 1 && domainAllowsType(types, values, 'array')
    && (a.items !== undefined || b.items !== undefined)) {
    if (a.items === undefined) out.items = b.items;
    else if (b.items === undefined) out.items = a.items;
    else {
      const av = boundedSchemaFacts(spec, a.items);
      const bv = boundedSchemaFacts(spec, b.items);
      out.items = canonicalJson(av) === canonicalJson(bv)
        ? av : boundedIntersectionSummary(spec, av, bv, depth + 1);
    }
  }
  if (impossible) out.not = {};
  return out;
}

function boundedCachedFacts(cached, depth = 0) {
  const out = {};
  [
    'type', 'enum', 'nullable', 'not', 'title', 'description',
    'x-aardvark-description-html', 'x-aardvark-description-text',
    'format', 'readOnly', 'writeOnly', 'deprecated',
    'oneOf', 'anyOf', 'discriminator', 'example', 'default',
    INTERSECTION_CONFLICTS, INTERSECTION_DESCRIPTIONS, SYNTHESIS_UNSAFE,
  ].forEach((key) => {
    if (cached && cached[key] !== undefined) out[key] = cached[key];
  });
  if (cached && depth < SCHEMA_MAX_DEPTH - 1) {
    if (Array.isArray(cached.required) && cached.required.length) out.required = cached.required;
    if (cached.properties && typeof cached.properties === 'object') {
      out.properties = {};
      Object.entries(cached.properties).forEach(([name, child]) => {
        setOwnValue(out.properties, name, boundedCachedFacts(child, depth + 1));
      });
    }
    if (Object.prototype.hasOwnProperty.call(cached, 'items')) {
      out.items = cached.items && typeof cached.items === 'object'
        ? boundedCachedFacts(cached.items, depth + 1) : cached.items;
    }
    if (Object.prototype.hasOwnProperty.call(cached, 'additionalProperties')) {
      out.additionalProperties = cached.additionalProperties
        && typeof cached.additionalProperties === 'object'
        ? boundedCachedFacts(cached.additionalProperties, depth + 1)
        : cached.additionalProperties;
    }
  }
  return out;
}

function boundedMemoizedIntersection(left, right, cached) {
  return {
    ...boundedCachedFacts(cached),
    [INTERSECTION_PROJECTION]: true,
    allOf: exactIntersectionMembers(left, right),
    [SYNTHESIS_UNSAFE]: true,
  };
}

function intersectSchemas(
  spec,
  left,
  right,
  allOfDepth = 0,
  preserveLeftOrder = false,
  intersectionDepth = 0,
  seenRefPairs = new Set(),
  refPairBudget = INTERSECTION_MAX_REF_PAIRS,
  refPairMemo = new Map(),
) {
  if (canonicalJson(left) === canonicalJson(right)) {
    return withSynthesisSafety(flattenAllOf(spec, left, allOfDepth + 1));
  }
  const leftRef = left && typeof left === 'object' && typeof left.$ref === 'string' ? left.$ref : null;
  const rightRef = right && typeof right === 'object' && typeof right.$ref === 'string' ? right.$ref : null;
  let nextSeenRefPairs = seenRefPairs;
  let nextRefPairBudget = refPairBudget;
  let refPair = null;
  let memoizedRefPair = false;
  if (leftRef && rightRef) {
    const nodes = [canonicalJson(left), canonicalJson(right)];
    if (!preserveLeftOrder) nodes.sort(compareText);
    refPair = `${preserveLeftOrder ? 'ordered' : 'commutative'}\u0000${nodes.join('\u0000')}`;
    if (seenRefPairs.has(refPair)) {
      const members = exactIntersectionMembers(left, right);
      return { [INTERSECTION_PROJECTION]: true, allOf: members, [SYNTHESIS_UNSAFE]: true };
    }
    memoizedRefPair = refPairMemo.has(refPair);
  }
  // Consult the memo before flattening a completed pair again. A repeated pair can point at schemas
  // whose children contain large allOf graphs; flattening those children first would reopen a fresh
  // recursion budget and duplicate the entire projection before this bounded path got a chance to run.
  if (memoizedRefPair && seenRefPairs.size) {
    return boundedMemoizedIntersection(left, right, refPairMemo.get(refPair));
  }
  const a = withSynthesisSafety(flattenAllOf(spec, left, allOfDepth + 1));
  const b = withSynthesisSafety(flattenAllOf(spec, right, allOfDepth + 1));
  if (!Object.keys(a).length) return b;
  if (!Object.keys(b).length) return a;
  // A ∩ A = A. Besides being exact, this stops two identical recursive refs from repeatedly
  // intersecting their child refs until the runtime stack overflows.
  if (canonicalJson(a) === canonicalJson(b)) return a;
  // The budget guards recursive expansion, not authored breadth. Resolve leaf ref pairs first so
  // hundreds of independent fields do not consume it; if recursion does exhaust the shared budget,
  // retain provable scalar/type facts instead of degrading every remaining field to `-`.
  if (refPair && (schemaContainsRef(a) || schemaContainsRef(b))) {
    if (refPairBudget <= 0) return boundedIntersectionSummary(spec, a, b);
    nextRefPairBudget = refPairBudget - 1;
    nextSeenRefPairs = new Set(seenRefPairs).add(refPair);
  }
  const members = exactIntersectionMembers(a, b);
  const out = { [INTERSECTION_PROJECTION]: true, allOf: members };

  const conflicts = new Set([
    ...(Array.isArray(a[INTERSECTION_CONFLICTS]) ? a[INTERSECTION_CONFLICTS] : []),
    ...(Array.isArray(b[INTERSECTION_CONFLICTS]) ? b[INTERSECTION_CONFLICTS] : []),
  ]);

  // Different mutually-recursive schemas do not necessarily become structurally identical. Retain
  // their exact conjunction but stop deriving deeper display facts after a bounded descent.
  if (intersectionDepth > INTERSECTION_MAX_DEPTH) {
    out[SYNTHESIS_UNSAFE] = true;
    return out;
  }

  const aTypes = effectiveSchemaTypes(a), bTypes = effectiveSchemaTypes(b);
  let types = intersectTypes(aTypes, bTypes);
  const bothTyped = aTypes && bTypes;
  let impossible = !!((aTypes && !aTypes.length) || (bTypes && !bTypes.length)
    || (bothTyped && !types.length));

  const aEnum = enumConstraint(a), bEnum = enumConstraint(b);
  let values = aEnum !== null ? aEnum : bEnum;
  if (aEnum !== null && bEnum !== null) {
    const allowed = new Set(bEnum.map(canonicalJson));
    values = aEnum.filter((value) => allowed.has(canonicalJson(value)));
  }
  if (values !== null) {
    values = canonicalValues(values).filter((value) => valueMatchesTypes(value, types));
    if (!values.length) impossible = true;
  }
  if (types !== null && values !== null && values.length) {
    types = types.filter((type) => values.some((value) => valueMatchesTypes(value, [type])));
    if (!types.length) impossible = true;
  }

  const canBeObject = domainAllowsType(types, values, 'object');
  const canBeArray = domainAllowsType(types, values, 'array');
  let required = [];
  if (canBeObject) {
    const propertyNames = new Set([
      ...Object.keys(a.properties || {}),
      ...Object.keys(b.properties || {}),
      ...(Array.isArray(a.required) ? a.required : []),
      ...(Array.isArray(b.required) ? b.required : []),
    ]);
    if (propertyNames.size) {
      out.properties = {};
      const orderedNames = preserveLeftOrder
        ? [
          ...Object.keys(a.properties || {}),
          ...Object.keys(b.properties || {}).filter((name) => !Object.prototype.hasOwnProperty.call(a.properties || {}, name)),
          ...Array.from(propertyNames).filter((name) => (
            !Object.prototype.hasOwnProperty.call(a.properties || {}, name)
            && !Object.prototype.hasOwnProperty.call(b.properties || {}, name)
          )),
        ]
        : Array.from(propertyNames).sort(compareText);
      orderedNames.forEach((name) => {
        const av = propertyConstraint(a, name), bv = propertyConstraint(b, name);
        const child = intersectSchemas(
          spec, av, bv, 0, preserveLeftOrder, intersectionDepth + 1, nextSeenRefPairs,
          nextRefPairBudget, refPairMemo,
        );
        Object.defineProperty(out.properties, name, {
          value: child, enumerable: true, configurable: true, writable: true,
        });
      });
    }
    required = Array.from(new Set([...(a.required || []), ...(b.required || [])]));
    if (!preserveLeftOrder) required.sort(compareText);
    if (required.length) out.required = required;
  }
  const objectOnly = !!(types && types.length === 1 && types[0] === 'object');
  if (objectOnly
    && required.some((name) => out.properties && isImpossibleSchema(out.properties[name]))) impossible = true;

  if (canBeArray && (a.items !== undefined || b.items !== undefined)) {
    out.items = a.items === undefined ? b.items
      : b.items === undefined ? a.items
        : intersectSchemas(
          spec, a.items, b.items, 0, preserveLeftOrder, intersectionDepth + 1, nextSeenRefPairs,
          nextRefPairBudget, refPairMemo,
        );
  }
  if (canBeObject && (a.additionalProperties !== undefined || b.additionalProperties !== undefined)) {
    if (a.additionalProperties === undefined) out.additionalProperties = b.additionalProperties;
    else if (b.additionalProperties === undefined) out.additionalProperties = a.additionalProperties;
    else if (a.additionalProperties === false || b.additionalProperties === false) out.additionalProperties = false;
    else if (a.additionalProperties === true) out.additionalProperties = b.additionalProperties;
    else if (b.additionalProperties === true) out.additionalProperties = a.additionalProperties;
    else out.additionalProperties = intersectSchemas(
      spec, a.additionalProperties, b.additionalProperties, 0, preserveLeftOrder,
      intersectionDepth + 1, nextSeenRefPairs, nextRefPairBudget, refPairMemo,
    );
  }

  if (values !== null) {
    let structuralUnknown = false;
    const formatForValidation = conflicts.has('format')
      || (a.format !== undefined && b.format !== undefined
        && canonicalJson(a.format) !== canonicalJson(b.format))
      ? undefined : (a.format === undefined ? b.format : a.format);
    values = values.filter((value) => {
      // Assertion annotations are copied below, after structural facts. Include an unambiguous format
      // in this validation view now so `allOf: [format:email, enum:['not valid']]` is recognized as
      // impossible instead of retaining a literal that violates the other member.
      const validationFacts = { ...out, enum: values };
      if (formatForValidation !== undefined) validationFacts.format = formatForValidation;
      const match = valueMatchesProjectedFacts(spec, validationFacts, value);
      if (match === null) structuralUnknown = true;
      return match !== false;
    });
    if (structuralUnknown) out[SYNTHESIS_UNSAFE] = true;
    if (!values.length) impossible = true;
    else out.enum = values;
  }
  if (types !== null && values !== null && values.length) {
    types = types.filter((type) => values.some((value) => valueMatchesTypes(value, [type])));
  }
  if (!domainAllowsType(types, values, 'object')) {
    delete out.properties;
    delete out.required;
    delete out.additionalProperties;
  }
  if (!domainAllowsType(types, values, 'array')) delete out.items;
  if (types && types.length) out.type = types.length === 1 ? types[0] : types;

  // Display annotations do not constrain validity. Keep one deterministic value rather than losing
  // field prose; the exact authored annotations remain in `allOf`.
  ['title'].forEach((key) => {
    const value = displayFact(a, b, key);
    if (value !== undefined) out[key] = value;
  });
  projectDescription(a, b, out);
  // Assertion/control facts may be copied from one side, but a disagreement must remain conflicted
  // through later N-way reductions rather than disappearing and then being resurrected by member 3.
  [
    'format', 'readOnly', 'writeOnly', 'deprecated', 'oneOf', 'anyOf', 'discriminator',
    'example', 'default',
  ].forEach((key) => {
    if (conflicts.has(key)) return;
    const av = a[key], bv = b[key];
    if (av !== undefined && bv !== undefined && canonicalJson(av) !== canonicalJson(bv)) {
      conflicts.add(key);
      return;
    }
    const value = av === undefined ? bv : av;
    if (value === undefined) return;
    if ((key === 'example' || key === 'default')
      && (!valueMatchesTypes(value, types)
        || valueMatchesProjectedFacts(spec, out, value) !== true
        || (out.enum && !out.enum.some((item) => canonicalJson(item) === canonicalJson(value))))) return;
    out[key] = value;
  });
  if (types && types.includes('null')) out.nullable = true;
  if (conflicts.size) out[INTERSECTION_CONFLICTS] = Array.from(conflicts).sort(compareText);
  if (a[SYNTHESIS_UNSAFE] || b[SYNTHESIS_UNSAFE]
    || Object.values(out.properties || {}).some((child) => child && child[SYNTHESIS_UNSAFE])
    || (out.items && typeof out.items === 'object' && out.items[SYNTHESIS_UNSAFE])
    || ['format', 'oneOf', 'anyOf'].some((key) => conflicts.has(key))
    || (a.not && !isImpossibleSchema(a)) || (b.not && !isImpossibleSchema(b))) {
    out[SYNTHESIS_UNSAFE] = true;
  }
  if (impossible || isImpossibleSchema(a) || isImpossibleSchema(b)) out.not = {};
  if (refPair) refPairMemo.set(refPair, out);
  return out;
}

// Collapse allOf into one order-independent projection. A schema without allOf is returned untouched,
// preserving the overwhelmingly common path. A self-referential chain stops at ALLOF_MAX_DEPTH.
function flattenAllOf(spec, schema, depth = 0) {
  const resolved = resolveSchemaNode(spec, schema);
  if (resolved === false) return { not: {} };
  if (resolved === true) return {};
  const s = resolved || {};
  if (!s || typeof s !== 'object') return {};
  if (s[INTERSECTION_PROJECTION]) return s;
  if (!Array.isArray(s.allOf) || !s.allOf.length || depth > ALLOF_MAX_DEPTH) return s;
  const parent = { ...s };
  delete parent.allOf;
  const parts = Object.keys(parent).length ? [parent, ...s.allOf] : s.allOf;
  let out = {};
  const members = parts.map((sub) => flattenAllOf(spec, sub, depth + 1))
    .sort((a, b) => compareText(canonicalJson(a), canonicalJson(b)));
  for (const member of members) {
    out = intersectSchemas(spec, out, member, depth + 1);
  }
  return out;
}

// A merged variant must NOT carry the union keywords that produced it. synthesizeExample reads
// `s.oneOf || s.anyOf` before it ever looks at `properties`, so a variant still holding its parent's
// `oneOf` collapses straight back to branch 0 — the exact bug variants exist to fix. `discriminator`
// goes too, so nothing can re-derive variants from a variant (which is what bounds the recursion).
function stripCombinators(s) {
  const hasOneOf = Array.isArray(s.oneOf) && s.oneOf.length > 0;
  const hasAnyOf = Array.isArray(s.anyOf) && s.anyOf.length > 0;
  if (!hasOneOf && !hasAnyOf && !s.discriminator) return s;
  const out = { ...s };
  if (hasOneOf) delete out.oneOf;
  if (hasAnyOf) delete out.anyOf;
  delete out.discriminator;
  return out;
}

// The single literal a branch pins `name` to: OpenAPI 3.1's `const`, or a ONE-element `enum` (3.0 has
// no `const`, so that's how most 3.0 specs write a discriminator).
// A multi-value enum is a CHOICE, not a pin, and must not count: the sibling shape's parent carries
// `type: { enum: ['oidc', 'saml'] }`, which would otherwise "pin" every branch to 'oidc' and label
// every tab identically.
const NO_PIN = Symbol('no discriminator pin');

function pinnedValue(branch, name) {
  if (!name) return NO_PIN;
  const p = (branch.properties || {})[name];
  if (!p || typeof p !== 'object') return NO_PIN;
  if (p.const !== undefined) return p.const;
  if (Array.isArray(p.enum) && p.enum.length === 1) return p.enum[0];
  return NO_PIN;
}

// The one property EVERY branch pins to its own literal — the implicit discriminator of a spec that
// writes no `discriminator` keyword (the sibling union, shape (b) above). null when the
// branches don't agree on one, which just drops the tab labels to a later fallback. Takes RESOLVED
// branches: the "every branch pins it" test means a single unresolved (or dangling) member would veto
// the inference for all the others.
function inferPinnedProp(branches) {
  for (const name of Object.keys(branches[0].properties || {})) {
    const values = branches.map((b) => pinnedValue(b, name));
    if (values.every((value) => value !== NO_PIN)
      && new Set(values.map(canonicalJson)).size === branches.length) return name;
  }
  return null;
}

function discriminatorMappingValue(node, disc) {
  const ref = node && typeof node.$ref === 'string' ? node.$ref : null;
  if (!ref || !disc.mapping || typeof disc.mapping !== 'object') return null;
  const base = ref.split('/').pop();
  for (const [key, target] of Object.entries(disc.mapping)) {
    if (target === ref || target === base) return key;
  }
  return null;
}

function implicitDiscriminatorValue(node, disc) {
  return disc && typeof disc.propertyName === 'string' && disc.propertyName
    && node && typeof node.$ref === 'string' ? node.$ref.split('/').pop() : null;
}

// A variant's tab label, most-authored signal first so a spec that names its branches wins.
// `node` is the UNRESOLVED branch (resolveRef returns the target and DISCARDS sibling keys, so
// `node.$ref` — the source of fallbacks 1 and 4 — is gone once resolved); `b` is the resolved one.
function variantLabel(node, b, disc, propName, i) {
  const ref = typeof node.$ref === 'string' ? node.$ref : null;
  // 1. the discriminator MAPPING key, reverse-looked-up: the key is the authored human name. Values
  //    may be a full '#/components/schemas/X' or the bare 'X' — accept both.
  const mapped = discriminatorMappingValue(node, disc);
  if (mapped !== null) return mapped;
  // 2. the literal this branch pins the discriminator to — the sibling shape's only signal
  //    ('oidc'/'saml'), and also right for a $ref branch carrying `type: { const }` with no mapping.
  const pinned = pinnedValue(b, propName);
  if (pinned !== NO_PIN) return jsonScalarLabel(pinned);
  // 3. the branch's own title, 4. the component name behind the $ref, 5. positional last resort.
  if (typeof node.title === 'string' && node.title) return node.title;
  if (typeof b.title === 'string' && b.title) return b.title;
  if (ref) return ref.split('/').pop();
  return `Variant ${i + 1}`;
}

// Parent + constraint-overlay branch → one self-contained variant (shape (b)). Both schemas apply,
// so use the same intersection projection as allOf: required names union, overlapping enums intersect
// (`['oidc','saml']` AND `['oidc']` becomes `['oidc']`), and unfamiliar constraints remain composed.
// Parent-first field order is presentation-only and stays stable for this authored sibling shape.
function mergeOverlay(spec, parent, branch) {
  const combined = intersectSchemas(spec, stripCombinators(parent), branch, 0, true);
  const impossible = schemaDefinitelyImpossible(spec, combined);
  const projected = stripCombinators(combined);
  // One-level rendering deliberately strips a branch's nested union. Preserve the one exact fact we
  // can prove before doing so: if every nested choice is impossible, this whole projected branch is
  // `never`, not merely synthesis-unsafe/unknown.
  return impossible ? { ...projected, not: {} } : projected;
}

// Keywords a branch may carry while still describing NO shape of its own — it only restricts the
// shape its parent already declared. An ALLOW-list, not a deny-list of shape keywords, and that
// direction is the whole safety property: a keyword nobody thought of falls on the "this branch says
// something about shape" side and the branch set keeps rendering as variant tabs, which is the
// behavior that shipped. A deny-list would silently flatten every union built from a keyword this
// list forgot. `title`/`description` are here because prose alone still isn't a shape.
const CONSTRAINT_ONLY_KEYWORDS = new Set([
  'required', 'minProperties', 'maxProperties', 'dependentRequired', 'dependencies',
  'title', 'summary', 'description', 'x-aardvark-description-html', 'x-aardvark-description-text',
]);

// Annotation keys may accompany a constraint overlay, but cannot make a branch one by themselves:
// two `{ title: ... }` branches both accept every value, so `oneOf` rejects every value rather than
// describing one parent shape with two constraints. Keep this assertion subset aligned with the PDF.
const CONSTRAINT_ONLY_ASSERTION_KEYWORDS = new Set([
  'required', 'minProperties', 'maxProperties', 'dependentRequired', 'dependencies',
]);

// These are the constraint-only branches the lightweight example validator can evaluate exactly.
// Other branches still render as one constrained shape, but example synthesis/selection must abstain:
// accepting a parent-shaped object without checking minProperties/dependencies would manufacture (or
// attribute) an example that satisfies none of the union branches.
const REQUIRED_CONSTRAINT_KEYWORDS = new Set([
  'required', 'title', 'summary', 'description', 'x-aardvark-description-html',
  'x-aardvark-description-text',
]);

// Classify allowed vocabulary separately from actual assertions so annotations remain allowed next
// to an assertion without counting as one. Intersection projections need the aggregate result: an
// annotation-only member AND a required-only member is still one constraint overlay.
function constraintOnlyBranchFacts(branch) {
  if (branch && branch[INTERSECTION_PROJECTION] && Array.isArray(branch.allOf)) {
    const members = branch.allOf.map(constraintOnlyBranchFacts);
    return {
      allowed: members.length > 0 && members.every((member) => member.allowed),
      constrained: members.some((member) => member.constrained),
    };
  }
  const keys = Object.keys(branch || {});
  return {
    allowed: keys.length > 0 && keys.every((key) => CONSTRAINT_ONLY_KEYWORDS.has(key)),
    constrained: keys.some((key) => CONSTRAINT_ONLY_ASSERTION_KEYWORDS.has(key)),
  };
}

// A branch that constrains without describing: at least one assertion keyword, and nothing outside
// the constraint/annotation allow-list. Empty and annotation-only branches both say "any value".
function isConstraintOnlyBranch(branch) {
  const facts = constraintOnlyBranchFacts(branch);
  return facts.allowed && facts.constrained;
}

function usableUnionBranches(spec, schema) {
  const raw = schema.oneOf || schema.anyOf;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((node) => resolveSchemaNode(spec, node) !== undefined)
    .map((node) => ({
      node: node && typeof node === 'object' ? node : {},
      schema: flattenAllOf(spec, node),
    }));
}

/**
 * A very common JSON-Schema idiom writes oneOf/anyOf branches as CONSTRAINTS over ONE shape rather
 * than as a union of shapes:
 *
 *     { type: 'object', properties: { a, b, c }, anyOf: [ { required: ['a'] }, { required: ['b'] } ] }
 *
 * That says "at least one of a or b", not "this is two different objects". Rendered as variants it
 * produced an EMPTY top-level table plus tabs labelled "Variant 1"/"Variant 2" (no branch pins a
 * discriminator and none has a title, so every label falls through to the positional last resort) —
 * asserting two shapes where there is one, under labels carrying no information.
 *
 * Returns `{ kind, groups }` — one `required` list per branch — when EVERY branch is constraint-only,
 * else null. Branches are resolved first, so the same idiom factored into `$ref`s to constraint-only
 * components is caught too. Genuine unions are untouched: the sibling shape's branches each carry a
 * `properties` overlay pinning the discriminator, and a textbook `$ref` branch resolves to a full
 * object — both fail isConstraintOnlyBranch on the first branch.
 */
function constraintUnion(spec, schema) {
  const s = schema && typeof schema === 'object' ? schema : {};
  if (Array.isArray(s.oneOf) && s.oneOf.length && Array.isArray(s.anyOf) && s.anyOf.length) return null;
  const branches = usableUnionBranches(spec, s).map((entry) => entry.schema);
  if (branches.length < 2) return null;
  if (!branches.every(isConstraintOnlyBranch)) return null;
  return { kind: s.oneOf ? 'oneOf' : 'anyOf', groups: branches.map((b) => (Array.isArray(b.required) ? b.required : [])) };
}

function requiredConstraintUnionIsExact(spec, schema) {
  const branches = usableUnionBranches(spec, schema).map((entry) => entry.schema);
  const memberIsExact = (branch) => {
    if (branch && branch[INTERSECTION_PROJECTION] && Array.isArray(branch.allOf)) {
      return branch.allOf.length > 0 && branch.allOf.every(memberIsExact);
    }
    return Object.keys(branch || {}).every((key) => REQUIRED_CONSTRAINT_KEYWORDS.has(key));
  };
  return branches.length >= 2 && branches.every((branch) => (
    Array.isArray(branch.required)
    && branch.required.length > 0
    && memberIsExact(branch)
  ));
}

// The constraint set as one line of prose, to sit above the parent's (unchanged) flat table. Only the
// `required`-based form is rendered: it is the idiom that motivated this, and it is the only one that
// states itself in a sentence. A branch set carrying minProperties/dependentRequired returns null and
// the table renders with no note — no note is strictly worse than an invented one.
function constraintUnionNote(kind, groups) {
  if (!groups.length || groups.some((g) => !g.length)) return null;
  const lead = kind === 'oneOf' ? 'Exactly one of' : 'At least one of';
  // A one-key branch is a plain alternative; a MULTI-key branch is a group whose members are required
  // TOGETHER. Flattening those into one comma list would claim four independent options where the
  // schema demands two specific pairs, so join a group with ` + ` and separate groups with `; `.
  const flat = groups.every((g) => g.length === 1);
  const body = flat ? groups.map((g) => g[0]).join(', ') : groups.map((g) => g.join(' + ')).join('; ');
  return `${lead}: ${body}.`;
}

/**
 * Split a union schema into self-contained variants, or return null when it isn't a union — so every
 * caller keeps its existing single-schema path untouched for the overwhelmingly common case.
 *
 * Returns `{ kind, propertyName, variants: [{ key, label, value, schema }] }`, where each `schema` is
 * COMPLETE and safe to hand straight back to schemaToRows / synthesizeExample / bodyFields:
 *   - kind         'oneOf' | 'anyOf' — the keyword that produced the split (they mean different
 *                  things to a reader, so the render layer captions them differently).
 *   - propertyName the discriminator property, from `discriminator.propertyName` or inferred from the
 *                  branches (null when there isn't one). Try-it pins this property per branch.
 *   - value        the literal this branch pins `propertyName` to (null when it pins nothing).
 *
 * Deliberately NON-recursive: exactly one level. stripCombinators makes re-entry impossible, so a
 * nested combinator inside a branch keeps the pre-existing first-branch behavior — a known limitation
 * worth documenting rather than papering over with an unbounded walk.
 */
function schemaVariants(spec, schema) {
  const s = flattenAllOf(spec, schema);
  if (!s || typeof s !== 'object') return null;
  // A contradictory root admits no value, regardless of any otherwise displayable branches it also
  // carries. Do not present a selector whose every projected branch is impossible while the schema
  // documentation correctly says "No values satisfy this schema."
  if (schemaDefinitelyImpossible(spec, s)) return null;
  // Both keywords constrain the same instance. Choosing one and stripping both from each projected
  // branch discards the other constraint, so abstain instead of displaying false branch schemas.
  if (Array.isArray(s.oneOf) && s.oneOf.length && Array.isArray(s.anyOf) && s.anyOf.length) return null;
  const raw = s.oneOf || s.anyOf; // same precedence synthesizeExample uses — diverging would make the
  // tab you see disagree with the example you read.
  if (!Array.isArray(raw) || !raw.length) return null; // an empty union has no usable branch
  // Branches used purely as CONSTRAINTS over the parent's own shape are not variants — there is one
  // shape here, restricted. Bail before anything else so the caller keeps the single-schema path it
  // used before variant tabs: the parent's flat table, and (schemaToRows) a line of prose naming the
  // constraint instead of two content-free tabs over an empty table.
  if (constraintUnion(spec, s)) return null;
  const disc = (s.discriminator && typeof s.discriminator === 'object') ? s.discriminator : {};
  // Resolve every branch UP FRONT and drop only genuinely missing refs. A literal or referenced `{}`
  // is a valid any-value schema and must remain; collapsing it changes oneOf/anyOf semantics.
  const kept = usableUnionBranches(spec, s).map(({ node, schema: b }) => ({ node, b }));
  // A single SURVIVING branch is not a choice to present, but it still constrains the schema. Keep it
  // internally so callers can normalize it into the parent's shape; rendering it as absent drops the
  // sole branch's fields/required rules (including when the other authored branches were dangling).
  if (!kept.length) return null;
  const explicitDiscriminator = typeof disc.propertyName === 'string' && !!disc.propertyName;
  const propName = (explicitDiscriminator && disc.propertyName)
    || inferPinnedProp(kept.map((k) => k.b));
  const variants = kept.map(({ node, b }, i) => {
    const nestedUnion = (Array.isArray(b.oneOf) && b.oneOf.length)
      || (Array.isArray(b.anyOf) && b.anyOf.length);
    const authoredPin = pinnedValue(b, propName);
    const mappedValue = discriminatorMappingValue(node, disc);
    const implicitValue = implicitDiscriminatorValue(node, disc);
    const hasValue = authoredPin !== NO_PIN || mappedValue !== null || implicitValue !== null;
    const value = authoredPin !== NO_PIN ? authoredPin
      : mappedValue !== null ? mappedValue : implicitValue;
    // JSON Schema siblings always apply to every branch, including scalar parents. mergeOverlay is
    // an identity when the parent contains only its union/discriminator, so use it uniformly.
    let merged = mergeOverlay(spec, s, b);
    // OpenAPI discriminator mappings define a required wire tag even when component schemas omit
    // the property constraint. An inferred const/enum pin is only a useful label: JSON Schema's
    // `properties` keyword does not itself require that optional property to be present.
    if (explicitDiscriminator && propName && hasValue
      && (merged.type === 'object' || namesFields(merged))) {
      const properties = {};
      setOwnValue(properties, propName, { enum: [value] });
      merged = intersectSchemas(spec, merged, {
        type: 'object', required: [propName], properties,
      }, 0, true);
    }
    // Variant rendering intentionally stops after one level. A branch-level union is still part of
    // that branch's validity even though its parent fields are what the table can show; stripping it
    // must not make invented examples or branch attribution claim that the parent fields alone are
    // valid. Keep the display projection, but conservatively abstain from matching/synthesis.
    if (nestedUnion) merged = { ...merged, [SYNTHESIS_UNSAFE]: true };
    return {
      key: String(i),
      label: variantLabel(node, b, disc, propName, i),
      value,
      hasValue,
      schema: merged,
    };
  });
  return { kind: s.oneOf ? 'oneOf' : 'anyOf', propertyName: propName || null, variants };
}

// Cap on how deep schemaToRows flattens nested objects/array-items. The Gateway API spec nests ~3
// deep (e.g. `metrics.languages[].language`); the cap is a backstop against a self-referential
// user schema (a tree/thread node) that the per-branch `$ref` guard below doesn't already cut.
const SCHEMA_MAX_DEPTH = 6;

// Flatten a schema's named fields into table rows, recursing into nested OBJECT properties (`parent.child`)
// and ARRAY-of-object items (`parent[].child`) so a field's description shows no matter how deep it sits —
// the standard error envelope keeps its docs on `error.code`/`error.message`, a level below the `error`
// row. Each row carries its own description (build-time html, text, or the raw string). `seen` holds the
// `$ref` targets on the current descent path so a recursive schema is cut (siblings may reuse a ref); the
// depth cap is the final backstop.
function flattenProperties(spec, schema, prefix, depth, seen, out) {
  const required = new Set(schema.required || []);
  const props = schema.properties || {};
  for (const name of Object.keys(props)) {
    const raw = props[name];
    const prop = flattenAllOf(spec, raw);
    const path = prefix + name;
    out.push({
      name: path,
      type: typeLabel(spec, raw),
      required: required.has(name),
      description: prop.description || '',
      descriptionHtml: prop['x-aardvark-description-html'],
      descriptionText: prop['x-aardvark-description-text'],
    });
    if (depth >= SCHEMA_MAX_DEPTH) continue;
    // Pick the child object to descend into: a nested object's own fields, or an array's item object.
    let child = null, childPrefix = null, childRaw = null;
    if (prop.properties && Object.keys(prop.properties).length) {
      child = prop; childRaw = raw; childPrefix = path + '.';
    } else if (prop.items) {
      const item = flattenAllOf(spec, prop.items);
      if (item && item.properties && Object.keys(item.properties).length) { child = item; childRaw = prop.items; childPrefix = path + '[].'; }
    }
    if (!child) continue;
    const ref = (childRaw && childRaw.$ref) || null;
    if (ref && seen.has(ref)) continue; // cycle on this path — stop descending
    flattenProperties(spec, child, childPrefix, depth + 1, ref ? new Set(seen).add(ref) : seen, out);
  }
}

// Flatten a schema's properties into table rows. Arrays descend into their item schema, and a
// free-form map ({ additionalProperties } with no named properties) descends into its VALUE schema
// so an object-valued map still tabulates. Nested objects/arrays flatten recursively (flattenProperties),
// so a deep field's docs render too. When there are no named fields to tabulate — a map of
// scalars, a bare scalar/primitive body, an array of scalars — there are no rows, but `note`
// describes the shape so the response is documented instead of blank (e.g. an inventory map or a
// login token string would otherwise show an example with no schema docs at all). ResponsesDocs
// renders `note`: above the table when there are rows, on its own when there aren't.
//
// COMBINATORS: `allOf` is merged into a single object before flattening (flattenAllOf), so it
// tabulates like any other object. A `oneOf`/`anyOf` union instead returns a `variants` array —
// `{ key, label, rows, note }` per branch, each a recursive call on that branch's self-contained
// schema — which SchemaDocs renders as one tab per variant. `rows` is then empty at the top level
// (every row lives under a tab, where its per-branch `required` marker is actually correct), and
// `variants` is ABSENT for a non-union schema, which keeps the plain `{ rows, note }` shape.
function schemaToRows(spec, schema, allowVariants = true) {
  let s = flattenAllOf(spec, schema);
  let note = null;
  if (schemaDefinitelyImpossible(spec, s)) return { rows: [], note: 'No values satisfy this schema.' };
  if (s.type === 'array' && hasUnprojectedItemEvaluation(s)) {
    return { rows: [], note: 'Array with positional item constraints.' };
  }
  if (s.type === 'array' && s.items !== undefined) {
    note = 'Array — each item:';
    s = flattenAllOf(spec, s.items);
    if (schemaDefinitelyImpossible(spec, s)) return { rows: [], note: 'Array — no items are allowed.' };
  }
  // A union: hand each branch back through this function for its own table. `allowVariants: false`
  // makes the one-level-only contract structural rather than incidental — stripCombinators already
  // guarantees a variant can't re-derive variants, but a union nested under an `additionalProperties`
  // value schema shouldn't be able to fan out either.
  if (allowVariants) {
    const union = schemaVariants(spec, s);
    if (union) {
      // A one-member oneOf/anyOf is an intersection with that sole branch, not a user choice. The
      // normalized schemaVariants branch already includes the parent, so keep the ordinary flat path
      // and avoid a one-tab selector/caption. Re-enter the single-schema pipeline so a sole array
      // branch still descends into its item object instead of stopping at an array shape note.
      if (union.variants.length === 1) {
        const normalized = schemaToRows(spec, union.variants[0].schema, false);
        return { rows: normalized.rows, note: note || normalized.note };
      } else {
        return {
          rows: [],
          note,
          variantKind: union.kind,
          variants: union.variants.map((v) => {
            const sub = schemaToRows(spec, v.schema, false);
            return { key: v.key, label: v.label, rows: sub.rows, note: sub.note };
          }),
        };
      }
    }
  }
  // A schema has named fields to tabulate only when `properties` is a NON-EMPTY object. An empty
  // `properties: {}` is a valid (and common, alongside additionalProperties) way to write a
  // free-form map, and `{}` is truthy in JS — so check the key count, not just presence.
  const hasNamedProps = (x) => !!(x && x.properties && Object.keys(x.properties).length);
  // A free-form map: { type: object, additionalProperties: <valueSchema> } with no named properties.
  // `additionalProperties: true` is the boolean shorthand for an empty (any-value) schema, so treat
  // it like `additionalProperties: {}` — otherwise a spec written that way would document nothing.
  // (`false` means a closed object, not a map, and is correctly excluded by the truthiness check.)
  const addlProps = s.additionalProperties === true ? {} : s.additionalProperties;
  if (!hasNamedProps(s) && addlProps && typeof addlProps === 'object') {
    const valueLabel = typeLabel(spec, addlProps);
    const value = resolveRef(spec, addlProps);
    // An empty/typeless value schema (`additionalProperties: {}` — OpenAPI's way of saying "values
    // of any type") yields typeLabel's '-' sentinel. Phrase that as "any values" rather than letting
    // a bare dash leak into the prose ("Map of string keys to - values").
    const values = valueLabel === '-' ? 'any values' : `${valueLabel} values`;
    // `note` here is only ever 'Array — each item:' (the array-descent branch fired) or null. When
    // it's set, fold it into an "each item IS A map" clause rather than prefixing the standalone
    // "Map of …" sentence: "Array — each item: Map of …" reads as if a list should follow the colon
    // but the sentence completes itself. The early-return and the tabular "— each value:" cases both
    // build on this lead.
    const lead = note
      ? `Array — each item is a map of string keys to ${values}`
      : `Map of string keys to ${values}`;
    if (hasNamedProps(value)) {
      note = `${lead} — each value:`; // object-valued map → tabulate the value object's fields
      s = value;
    } else {
      return { rows: [], note: `${lead}.` }; // scalar/opaque value → shape note only, no table
    }
  }
  const rows = [];
  flattenProperties(spec, s, '', 0, new Set(), rows);
  // No named fields (a bare scalar body, an array of scalars, …): describe the type so the response
  // isn't left blank. A plain `object` with neither properties nor a map gets no note — the example
  // already conveys it, and "object" would add nothing.
  if (!rows.length) {
    const label = typeLabel(spec, s);
    if (label && label !== '-' && label !== 'object') {
      note = note === 'Array — each item:' ? `Array of ${label} values.` : `A single ${label} value.`;
    } else {
      // No scalar label worth showing (a top-level opaque object, or an array of opaque objects).
      // Drop any note the array-descent branch set: an `{ type: array, items: { type: object } }`
      // would otherwise leave a dangling "Array — each item:" with no table beneath it, so
      // ResponsesDocs (which renders a note even when rows are empty) would show a Body heading
      // followed by nothing. null suppresses the section, matching the pre-note behavior.
      note = null;
    }
  }
  // A constraint-only oneOf/anyOf contributes no rows — it restricts the table just built. Appended
  // (never assigned) so a shape note the branches above set — 'Array — each item:', a map's "Map of
  // string keys to …" — survives alongside it; `s` is the schema those rows came from, so after an
  // array/map descent the constraint read here is the one that governs THOSE rows.
  const constraint = constraintUnion(spec, s);
  if (constraint) {
    const text = constraintUnionNote(constraint.kind, constraint.groups);
    if (text) note = note ? `${note} ${text}` : text;
  }
  return { rows, note };
}

// Map an HTTP status code to a Mantine color (matches the METHOD_COLORS convention).
function statusColor(code) {
  const n = parseInt(code, 10);
  if (n >= 200 && n < 300) return 'green';
  if (n >= 300 && n < 400) return 'blue';
  if (n >= 400 && n < 500) return 'orange';
  if (n >= 500) return 'red';
  return 'gray';
}

// Prefer the application/json media type, else the first defined one.
function jsonContent(resp) {
  const content = resp.content || {};
  if (content['application/json']) return content['application/json'];
  const keys = Object.keys(content);
  return keys.length ? content[keys[0]] : null;
}

// Authored media examples in precedence order. A singular `example` wins outright; otherwise every
// inline/resolved entry in `examples` is available for per-variant matching. The schema-level example
// remains a fallback only when the media block supplied no usable value, preserving the old priority.
function authoredMediaExamples(spec, media) {
  if (!media) return [];
  if (media.example !== undefined) return [media.example];
  const examples = [];
  if (media.examples && typeof media.examples === 'object') {
    Object.values(media.examples).forEach((entry) => {
      const resolved = resolveRef(spec, entry);
      if (resolved && resolved.value !== undefined) examples.push(resolved.value);
    });
  }
  if (examples.length) return examples;
  if (media.schema !== undefined) {
    if (media.schema && typeof media.schema === 'object' && media.schema.example !== undefined) {
      return [media.schema.example];
    }
    const schema = flattenAllOf(spec, media.schema);
    if (schema && schema.example !== undefined) return [schema.example];
  }
  return [];
}

// The union represented after schemaToRows descends through at most one array wrapper. Request docs
// and response docs both expose an item union as tabs, so every interactive caller must make that
// same projection: split the item schema, then wrap each selected branch back in the complete array
// schema. Keeping the wrapper is what makes examples and synthesis remain arrays instead of silently
// turning the selected item into the whole request/response body. Root unions use their variants
// directly. Tuple/unevaluated-item schemas stay on the unsplit path, matching schemaToRows.
function schemaVariantsThroughArray(spec, schema) {
  const root = flattenAllOf(spec, schema);
  if (schemaDefinitelyImpossible(spec, root)) return null;
  const arrayRoot = root.type === 'array' && root.items !== undefined
    && !hasUnprojectedItemEvaluation(root) ? root : null;
  const union = schemaVariants(spec, arrayRoot ? flattenAllOf(spec, root.items) : root);
  if (!union) return null;
  return {
    ...union,
    arrayRoot,
    variants: union.variants.map((variant) => ({
      ...variant,
      schema: arrayRoot ? { ...arrayRoot, items: variant.schema } : variant.schema,
    })),
  };
}

// An authored array belongs to an item-variant tab when at least one element routes to it:
// oneOf items must match that variant exclusively, anyOf items merely have to include it.
// An empty array is shape-neutral and belongs to every tab.
function arrayExampleRoutesTo(spec, union, example, selectedIndex) {
  if (!example.length) return true;
  return example.some((item) => {
    const possible = union.variants
      .map((variant, index) => (topLevelValueMatchesSchema(
        spec, variant.schema.items, item, 0, true, true,
      ) ? index : -1))
      .filter((index) => index >= 0);
    return union.kind === 'oneOf'
      ? possible.length === 1 && possible[0] === selectedIndex
      : possible.includes(selectedIndex);
  });
}

// A response's example, as both the parsed `value` (for the interactive JsonTree) and a
// pretty-printed `text` (for the flat code-block fallback). Prefers an authored media example
// (`example`, else the first matching entry in `examples`), then the response schema's own `example` (OpenAPI
// lets a schema carry one — common, and it means a response whose media block has no inline
// example still gets one for free), then the build-time AI example (op['x-aardvark-example'], a
// JSON string) for the first success code. Returns null when there's no example anywhere. `value`
// is undefined when only a non-JSON / unparseable string example exists — callers then show the
// `text` in a code block, never a tree.
function responseExample(spec, op, code, resp, synthesisSchema, validationSchema = null) {
  const media = jsonContent(resp);
  // Authored and AI examples are annotations, not exemptions from the schema. An impossible root can
  // never have a valid example; returning one would put a body in the rail beside documentation that
  // correctly says no value satisfies the response schema.
  if (media && media.schema !== undefined && schemaDefinitelyImpossible(spec, media.schema)) {
    return null;
  }
  const hasSynthesisSchema = synthesisSchema !== undefined && synthesisSchema !== null;
  const hasValidationSchema = validationSchema !== undefined && validationSchema !== null;
  const candidateMatches = (candidate, allowUnknownAssertions = false) => {
    if (allowUnknownAssertions && hasSynthesisSchema && hasValidationSchema) {
      const union = schemaVariantsThroughArray(spec, validationSchema);
      if (union && union.variants.length > 1) {
        // Array item tabs describe the shapes that MAY occur inside one response, not mutually
        // exclusive whole-response variants. Preserve a valid authored mixed array under every item
        // tab; branch-specific homogeneous synthesis remains the fallback when no array is authored.
        if (union.arrayRoot) {
          if (!Array.isArray(candidate)
            || !topLevelValueMatchesSchema(spec, validationSchema, candidate, 0, false, true)) {
            return false;
          }
          if (!candidate.length) return true; // must stay AHEAD of the selectedIndex reject below
          const selectedIndex = union.variants.findIndex((variant) => (
            canonicalJson(variant.schema) === canonicalJson(synthesisSchema)
          ));
          if (selectedIndex < 0) return false;
          return arrayExampleRoutesTo(spec, union, candidate, selectedIndex);
        }
        const shapeNeutralObject = candidate && typeof candidate === 'object'
          && !Array.isArray(candidate) && !Object.keys(candidate).length;
        const possible = union.variants.filter((variant) => topLevelValueMatchesSchema(
          spec, variant.schema, candidate, 0, !shapeNeutralObject, true,
        ));
        const selected = possible.some((variant) => (
          canonicalJson(variant.schema) === canonicalJson(synthesisSchema)
        ));
        if (!selected || (union.kind === 'oneOf' && possible.length !== 1)) return false;
        if (shapeNeutralObject) return true;
      }
    }
    return (!hasSynthesisSchema || topLevelValueMatchesSchema(
      spec, synthesisSchema, candidate, 0, true, allowUnknownAssertions,
    ))
    && (!hasValidationSchema || topLevelValueMatchesSchema(
      spec, validationSchema, candidate, 0, false, allowUnknownAssertions,
    ));
  };
  // Authored values should survive assertions this lightweight matcher cannot evaluate (pattern,
  // minimum, dependencies, ...), while known contradictions still reject them and ambiguous branch
  // matches still route nowhere. Invented/AI fallbacks remain strict below.
  let value = authoredMediaExamples(spec, media)
    .find((candidate) => candidateMatches(candidate, true));
  if (value !== undefined) {
    return { value, text: JSON.stringify(value, null, 2) };
  }
  value = undefined;
  // Build-time AI example — a JSON string for a 2xx. Parse it so the tree can render it too,
  // keeping the original text for the code-block fallback when it isn't valid JSON.
  if (op['x-aardvark-example'] && String(code).charAt(0) === '2') {
    const text = op['x-aardvark-example'];
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { /* not JSON — leave value undefined so the code-block fallback shows the raw text */ }
    if ((!hasSynthesisSchema && !hasValidationSchema)
      || (parsed !== undefined && candidateMatches(parsed))) {
      return { value: parsed, text };
    }
  }
  // Final fallback: SYNTHESIZE a representative example from the response schema. The source-extracted
  // success (2xx) bodies document a SHAPE but carry no literal example to lift (the handler builds the body
  // dynamically), so without this a 200 would render nothing — only the errors (which carry extracted example
  // bodies) would show. A real-shaped synthesized body means the success response IS shown, and because the
  // rail/docs default to the first 2xx WITH an example, it also becomes the default.
  if (media && media.schema !== undefined) {
    // A selected response-variant tab may provide a self-contained branch schema here. It affects
    // only this final synthesized fallback. Authored media/schema/AI examples still win when they fit
    // the selected branch; a non-matching operation-wide example falls through so the rail cannot
    // show Cat data beside the selected Dog schema.
    const synth = synthesizeExample(spec, hasSynthesisSchema ? synthesisSchema : media.schema);
    if (synth !== undefined && candidateMatches(synth)) {
      return { value: synth, text: JSON.stringify(synth, null, 2) };
    }
  }
  return null;
}

// A type/format/enum-driven sample for a string leaf — realistic where the schema says enough, else a
// generic "string". Keeps synthesized examples readable without inventing data the schema doesn't imply.
function sampleString(s) {
  const fmt = (s.format || '').toLowerCase();
  if (fmt === 'date-time') return '2025-01-01T00:00:00Z';
  if (fmt === 'date') return '2025-01-01';
  if (fmt === 'email') return 'user@example.com';
  if (fmt === 'uri' || fmt === 'url') return 'https://example.com';
  if (fmt === 'uuid') return '00000000-0000-0000-0000-000000000000';
  return 'string';
}

// Build a representative example VALUE from a schema, walked structurally (objects → each property, arrays →
// one item), so a response that documents a shape but no example still renders a real-shaped body. Honors an
// inline `example`/`default`/`enum` when present (preferring authored data), resolves $refs, merges allOf, and
// takes the first oneOf/anyOf branch. Depth-capped so a self-referential schema can't recurse forever. Returns
// `undefined` when the schema carries no synthesizable type (e.g. an empty `{}`), so the caller treats it as
// "no example" — only an explicit `type: "null"` yields a real `null`.
const SYNTH_MAX_DEPTH = 6;
function synthesizeExample(spec, schema, depth = 0) {
  const s = withSynthesisSafety(flattenAllOf(spec, schema));
  if (!s || typeof s !== 'object' || depth > SYNTH_MAX_DEPTH) return undefined;
  if (Array.isArray(s.oneOf) && s.oneOf.length && Array.isArray(s.anyOf) && s.anyOf.length) {
    return undefined;
  }
  if (schemaDefinitelyImpossible(spec, s)) return undefined;
  // A representative value cannot be chosen safely without evaluating a non-trivial negation or a
  // composition whose recursive projection hit its bound. Authored examples still win in
  // responseExample/requestBodyExample; only this invented fallback abstains.
  if ((s.not && typeof s.not === 'object' && Object.keys(s.not).length) || s[SYNTHESIS_UNSAFE]) {
    return undefined;
  }
  const constraint = constraintUnion(spec, s);
  if (constraint && (constraint.kind === 'oneOf' || !requiredConstraintUnionIsExact(spec, s))) {
    return undefined;
  }
  if (s.example !== undefined && topLevelValueMatchesSchema(spec, s, s.example)) return s.example;
  if (s.const !== undefined) {
    return topLevelValueMatchesSchema(spec, s, s.const) ? s.const : undefined;
  }
  if (Array.isArray(s.enum)) {
    return s.enum.find((candidate) => topLevelValueMatchesSchema(spec, s, candidate));
  }
  if (s.default !== undefined && topLevelValueMatchesSchema(spec, s, s.default)) return s.default;
  if (s[INTERSECTION_PROJECTION]) {
    const projected = { ...s };
    delete projected.allOf;
    delete projected[INTERSECTION_PROJECTION];
    return synthesizeExample(spec, projected, depth + 1);
  }
  if (Array.isArray(s.allOf) && s.allOf.length) {
    const merged = {};
    let any = false;
    // depth + 1 even though allOf merges into the SAME level: a self-referential `allOf: [{$ref: self}]`
    // (a "base + self" composition) would otherwise recurse forever — the cap must advance on every descent.
    for (const sub of s.allOf) {
      const v = synthesizeExample(spec, sub, depth + 1);
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        Object.entries(v).forEach(([key, value]) => setOwnValue(merged, key, value));
        any = true;
      }
    }
    if (any) return merged;
  }
  const branches = s.oneOf || s.anyOf;
  // A CONSTRAINT-only branch set ({ required: ['a'] } etc.) describes no shape, so descending into
  // branch 0 synthesizes from an object with no properties and yields `undefined` — the operation
  // loses its example entirely. Fall through to the parent's own properties instead, which is the one
  // shape actually being constrained.
  if (Array.isArray(branches) && branches.length && !constraintUnion(spec, s)) {
    // Synthesize from the merged FIRST VARIANT, not the bare first branch. In the sibling shape the
    // parent names its own fields and each branch is a constraint overlay carrying only `required` and
    // a pinned discriminator literal — so `branches[0]` alone renders `{"type":"oidc"}` and silently
    // drops every one of the parent's properties. A sole surviving branch is normalized with its
    // parent rather than presented as a choice. (The merged variant has its combinators stripped, so
    // this can't re-enter here; depth + 1 still advances so a recursive union hits the cap and
    // terminates.)
    const union = schemaVariants(spec, s);
    if (union) {
      for (const variant of union.variants) {
        const value = synthesizeExample(spec, variant.schema, depth + 1);
        if (value !== undefined && topLevelValueMatchesSchema(spec, s, value)) return value;
      }
      return undefined;
    }
    return synthesizeExample(spec, branches[0], depth + 1);
  }
  // Treat a schema as an OBJECT for synthesis only when it actually describes structure: non-empty
  // `properties` (namesFields — the SAME test typeLabel/schemaToRows use) OR a free-form map
  // (additionalProperties). An empty `properties: {}` with no additionalProperties names nothing, so it
  // stays untyped here and falls through to `undefined` — no misleading `{}` (or `[{}]` for
  // `items: { properties: {} }`); that matches how the field tables render such a schema as "any".
  const isMap = s.additionalProperties === true || (!!s.additionalProperties && typeof s.additionalProperties === 'object');
  const declaredType = Array.isArray(s.type) ? s.type[0] : s.type;
  const type = declaredType || (namesFields(s) || isMap ? 'object' : (s.items ? 'array' : null));
  switch (type) {
    case 'string': return sampleString(s);
    case 'integer':
    case 'number': return 0;
    case 'boolean': return true;
    case 'null': return null;
    case 'array': {
      // No item schema → []. Otherwise synthesize the single item: only a NON-synthesizable item
      // (undefined — e.g. an empty `{}`) collapses to []; a real value, INCLUDING an explicit null
      // (items: { type: "null" }), is kept as [item]. (Mirrors the function contract: only `undefined`
      // means "not synthesizable" — don't conflate it with a genuine null.)
      if (!s.items) return [];
      const item = synthesizeExample(spec, s.items, depth + 1);
      return item === undefined ? [] : [item];
    }
    case 'object': {
      const out = {};
      const props = s.properties || {};
      const required = new Set(s.required || []);
      // Skip a property that isn't synthesizable (undefined) so `out` stays JSON-serializable — an
      // `undefined` member would render in the JsonTree but be silently dropped by JSON.stringify (ex.text),
      // making the two views disagree. A real null is JSON-valid and IS kept.
      for (const [k, v] of Object.entries(props)) {
        const sv = synthesizeExample(spec, v, depth + 1);
        if (sv !== undefined) setOwnValue(out, k, sv);
        else if (required.has(k)) return undefined;
      }
      // A required property need not appear in `properties`; without a schema there is no truthful
      // representative value to invent, so abstain instead of emitting an object that violates it.
      if (Array.from(required).some((name) => !Object.prototype.hasOwnProperty.call(out, name))) {
        return undefined;
      }
      // A free-form map (additionalProperties, no named fields) → one representative entry so it isn't blank
      // (same undefined-skip so the entry never lands as a non-JSON value).
      if (!Object.keys(props).length && s.additionalProperties && typeof s.additionalProperties === 'object') {
        const sv = synthesizeExample(spec, s.additionalProperties, depth + 1);
        if (sv !== undefined) out.key = sv;
      }
      // A required-only anyOf is the one constraint union we can synthesize from the parent shape,
      // but required names need not be declared in `properties`. Prove the completed object actually
      // satisfies at least one branch before returning it; otherwise `{ properties:{x}, anyOf:
      // [{required:[a]}, {required:[b]}] }` would invent the invalid `{x:"string"}`.
      return constraint && !topLevelValueMatchesSchema(spec, s, out) ? undefined : out;
    }
    default: return undefined; // no synthesizable type (e.g. an empty `{}`) → caller treats as "no example"
  }
}

// Whether a response example should render as the interactive JsonTree (objects and arrays,
// which are worth exploring) rather than the flat code block (scalars, or a non-JSON /
// unparseable example whose value is undefined — a one-line tree adds nothing there).
function exampleIsTree(value) {
  return value !== null && typeof value === 'object';
}

// ---------------------------------------------------------------------------
// Authorization
//
// securitySchemes live on the spec and reach us untouched (slicing keeps
// everything but `paths`), so the key a reader types can flow into both the
// generated samples and the live "Try it now" request.
// ---------------------------------------------------------------------------

function securitySchemes(spec) {
  return (spec && spec.components && spec.components.securitySchemes) || {};
}

function isCookieScheme(scheme) {
  return !!scheme && (scheme.type || '').toLowerCase() === 'apikey' && scheme.in === 'cookie';
}

function isBasicScheme(scheme) {
  return !!scheme && (scheme.type || '').toLowerCase() === 'http'
    && (scheme.scheme || '').toLowerCase() === 'basic';
}

function securityRequirements(spec, op) {
  if (op && op.security !== undefined) return Array.isArray(op.security) ? op.security : null;
  if (spec && spec.security !== undefined) return Array.isArray(spec.security) ? spec.security : null;
  return null;
}

function namedScheme(schemes, name) {
  return name && schemes[name] ? { ...schemes[name], id: name } : null;
}

function schemesForRequirement(schemes, req) {
  return Object.keys(req || {}).map((name) => namedScheme(schemes, name)).filter(Boolean);
}

function hasCookieFreeSecurityAlternative(spec, op) {
  const reqs = securityRequirements(spec, op);
  const schemes = securitySchemes(spec);
  if (reqs) {
    if (!reqs.length) return true;
    return reqs.some((req) => {
      const names = req && typeof req === 'object' ? Object.keys(req) : [];
      if (!names.length) return true; // OpenAPI's empty requirement object means "public".
      const resolved = schemesForRequirement(schemes, req);
      // A named requirement that cannot be resolved is not public; the UI has no
      // scheme to apply, so it must not enable browser Try-it for that alternative.
      return resolved.length === names.length && resolved.every((scheme) => !isCookieScheme(scheme));
    });
  }
  const names = Object.keys(schemes);
  if (!names.length) return true;
  if (names.length === 1) return !isCookieScheme(namedScheme(schemes, names[0]));
  // With multiple declared schemes but no `security` block, the panel deliberately
  // does not guess which auth field to show. Still fail closed if every known
  // option is a browser-managed cookie, matching the lone-cookie-scheme path.
  return names.some((name) => !isCookieScheme(namedScheme(schemes, name)));
}

// The security scheme that applies to an operation: its own `security`, else the
// spec-wide one; an explicit empty requirement means "public". With no `security`
// declared anywhere we assume a lone defined scheme, so a key field still appears.
// When alternatives are declared, prefer a single non-cookie scheme: the live
// Try-it request cannot set Cookie, and the Gateway API's dashboard routes
// intentionally list the session cookie before the secret bearer.
function schemeForOp(spec, op) {
  const schemes = securitySchemes(spec);
  const reqs = securityRequirements(spec, op);
  if (reqs) {
    const single = [];
    const compoundNoCookie = [];
    const compoundFallback = [];
    for (const req of reqs) {
      const resolved = schemesForRequirement(schemes, req);
      if (!resolved.length) continue;
      if (resolved.length === 1) single.push(resolved[0]);
      else {
        // A requirement object with multiple schemes means AND (all required); we
        // resolve only the first, since the panel is a single key field. Documented
        // limitation — a compound `security: [{a: [], b: []}]` applies just `a`.
        if (resolved.every((scheme) => !isCookieScheme(scheme))) compoundNoCookie.push(resolved[0]);
        else compoundFallback.push(resolved[0]);
      }
    }
    return single.find((s) => !isCookieScheme(s)) || compoundNoCookie[0] || single[0] || compoundFallback[0] || null;
  }
  const names = Object.keys(schemes);
  if (names.length === 1) return namedScheme(schemes, names[0]);
  return null;
}

function tryItAvailability(spec, op) {
  if (op && op['x-aardvark-browser-tryit'] === false) {
    return {
      enabled: false,
      reason: op['x-aardvark-browser-tryit-reason'] || 'This endpoint is not available from browser-based Try it now. Use a generated request sample instead.',
    };
  }
  if (!hasCookieFreeSecurityAlternative(spec, op)) {
    return {
      enabled: false,
      reason: 'This operation uses a browser-managed cookie. Try it now cannot set that cookie from this docs page, so use the generated request sample or the dashboard instead.',
    };
  }
  return { enabled: true, reason: '' };
}

// How a scheme applies the token: { in: 'header' | 'query' | 'cookie', name, value }.
// in:query → query parameter; in:cookie → Cookie header (shown in the samples; the
// live fetch can't set it); everything else (header keys, http bearer/basic, oauth2)
// → a request header.
function authApply(scheme, token) {
  if (!scheme) return null;
  const type = (scheme.type || '').toLowerCase();
  if (type === 'apikey' && scheme.name) {
    if (scheme.in === 'query') return { in: 'query', name: scheme.name, value: token };
    // Cookie values are sent verbatim — servers don't URL-decode them — so do NOT
    // percent-encode (that would corrupt e.g. base64 tokens, whose +/= are valid
    // cookie-octets). Strip only what breaks Cookie header syntax: ';' and whitespace.
    if (scheme.in === 'cookie') return { in: 'cookie', name: 'Cookie', value: `${scheme.name}=${String(token).replace(/[\\,;"\s]/g, '')}` };
    return { in: 'header', name: scheme.name, value: token };
  }
  if (isBasicScheme(scheme)) {
    // Basic auth wants base64(user:pass); the reader pastes the raw credentials.
    // Encode via TextEncoder -> Latin-1 bytes so btoa is UTF-8-safe (accented/CJK).
    let encoded = token;
    try {
      encoded = btoa(Array.from(new TextEncoder().encode(token), (b) => String.fromCharCode(b)).join(''));
    } catch (e) { /* malformed input: last resort */ }
    return { in: 'header', name: 'Authorization', value: `Basic ${encoded}` };
  }
  // http bearer, oauth2, or anything unrecognised: a bearer token is the safe default.
  return { in: 'header', name: 'Authorization', value: `Bearer ${token}` };
}

// ---------------------------------------------------------------------------
// Request samples
//
// One small request model is built from the spec (reflecting anything typed into
// the form) and rendered into each language by a dependency-free generator.
// ---------------------------------------------------------------------------

// A concrete value for a parameter in a sample: what the reader typed, else the
// spec's example, else a {placeholder} naming the parameter.
function sampleParamValue(p, live) {
  if (live !== undefined && live !== '') return { value: live, placeholder: false };
  if (p.example !== undefined) return { value: p.example, placeholder: false };
  if (p.schema && p.schema.example !== undefined) return { value: p.schema.example, placeholder: false };
  return { value: `{${p.name}}`, placeholder: true };
}

function requestBodyMedia(spec, op) {
  if (!op.requestBody) return null;
  const rb = resolveRef(spec, op.requestBody);
  const content = rb.content || {};
  return content['application/json'] || content[Object.keys(content)[0]] || null;
}

// The Content-Type to send for a body — matches requestBodyMedia's selection
// (prefer application/json, else the first declared media type) instead of always
// claiming JSON for a spec that only declares e.g. text/plain or multipart.
function requestBodyContentType(spec, op) {
  if (!op.requestBody) return null;
  const content = resolveRef(spec, op.requestBody).content || {};
  if (content['application/json']) return 'application/json';
  return Object.keys(content)[0] || null;
}

// ---------------------------------------------------------------------------
// Media-aware body serialization
//
// A structured body is serialized for the media type requestBodyContentType picks, never
// JSON.stringify'd unconditionally: an operation whose FIRST declared media type isn't JSON would
// otherwise publish a JSON document labelled as something else. Samples must also be media-correct
// when x-aardvark-browser-tryit:false prevents exercising the endpoint from the browser.
// ---------------------------------------------------------------------------

// The boundary the SAMPLE multipart document uses. FIXED, never random: this island is PRERENDERED at
// build time and that baked markup is what the .md mirror, the whole-site PDF and the search index
// read, so a per-render boundary would make every build differ from the last with no semantic change.
// A sample is an illustration; the LIVE path hands fetch() a FormData and lets the browser mint a real
// boundary. The long random-looking tail is the one concession to the usual reason boundaries are
// generated: a field value that happened to contain the delimiter would corrupt the document, and this
// is chosen to make that collision impossible in practice rather than merely unlikely.
const SAMPLE_MULTIPART_BOUNDARY = '----AardvarkFormBoundary9tKq2Xr7vLm3';

// How a structured body has to be serialized for a media type. Everything that isn't a form encoding
// is JSON: `bodySerialization(null)` and `bodySerialization('application/json')` both answer 'json'.
// Parameters are stripped (`…; charset=utf-8`) and the type is lowercased, because a media type is
// case-insensitive and specs write both.
function bodySerialization(contentType) {
  const base = String(contentType || '').split(';')[0].trim().toLowerCase();
  if (base === 'application/x-www-form-urlencoded') return 'form';
  if (base === 'multipart/form-data') return 'multipart';
  return 'json';
}

// The [name, value] pairs a form-encoded body carries — the ONE place a field value becomes a wire
// string, shared by the urlencoded encoder, the multipart document, and (through the decoders below)
// every sample that builds a form client-side. A non-scalar value is JSON-encoded rather than dropped:
// a form field has no representation for a nested object, and a JSON string is what every server-side
// form parser that accepts structured data expects to find there. String(v) would otherwise render an
// object as the literal "[object Object]".
function bodyPairs(obj) {
  return Object.keys(obj).map((k) => {
    const v = obj[k];
    return [k, v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v)];
  });
}

// `k=v&k2=v2`, with URLSearchParams doing the percent-encoding so a value carrying `&`, `=`, `+` or a
// non-ASCII character survives the round trip. `append` (not the object constructor) because pairs is
// an ordered list: object construction would drop a duplicate name, and a form body may legally repeat one.
function encodeFormBody(obj) {
  const params = new URLSearchParams();
  bodyPairs(obj).forEach(([k, v]) => params.append(k, v));
  return params.toString();
}

// An RFC 7578 multipart document for the samples. CRLF is not cosmetic — a multipart parser splits on
// CRLF-delimited boundary lines, so LF-only output is not multipart at all. `name` is percent-encoded
// for the two characters that would break out of the quoted string (a literal `"` ends it, a CR/LF ends
// the header), which is what browsers do; anything else is left alone so the common case stays readable.
function encodeMultipartBody(obj) {
  const delim = `--${SAMPLE_MULTIPART_BOUNDARY}`;
  const parts = bodyPairs(obj).map(([k, v]) => {
    const name = String(k).replace(/"/g, '%22').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    return `${delim}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${v}\r\n`;
  });
  return `${parts.join('')}${delim}--\r\n`;
}

// Serialize a structured request body for the wire, per the operation's media type.
function serializeRequestBody(value, contentType) {
  const kind = bodySerialization(contentType);
  // A form encoding is defined over a flat set of NAMED fields. A body that isn't a plain object — an
  // array, a bare scalar — has no such set, so there is nothing valid to synthesize: JSON bytes under
  // a form Content-Type do not round-trip as that value. Return no generated body; a reader-entered
  // raw form string still bypasses this helper and is preserved verbatim.
  if (kind === 'json') return JSON.stringify(value, null, 2);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  return kind === 'form' ? encodeFormBody(value) : encodeMultipartBody(value);
}

// Recover the [name, value] pairs from a form body — the standard urlencoded decode, or a narrow
// reader for a multipart document THIS island produced. Both the samples that build a form
// client-side (curl --form-string, requests `files=`, a browser FormData) and the live send need them,
// and deriving them from the wire string keeps them a pure function of the body actually being shown:
// there is no second channel that could disagree with it, and a body the reader hand-typed into the
// raw textarea simply fails to decode and falls through to the verbatim-string path instead of being
// silently rewritten into something they didn't type. The multipart reader is deliberately NOT a
// general parser — it only recognises our own fixed boundary and plain `name="…"` parts.
function decodeFormBody(bodyText, contentType) {
  const kind = bodySerialization(contentType);
  if (kind === 'json' || !bodyText) return null;
  if (kind === 'form') {
    const pairs = Array.from(new URLSearchParams(bodyText));
    return pairs.length ? pairs : null;
  }
  const delim = `--${SAMPLE_MULTIPART_BOUNDARY}`;
  const closing = `${delim}--\r\n`;
  const text = String(bodyText);
  if (!text.startsWith(`${delim}\r\n`) || !text.endsWith(closing)) return null;
  const out = [];
  for (const part of text.slice(0, -closing.length).split(`${delim}\r\n`).slice(1)) {
    const m = /^Content-Disposition: form-data; name="([^"]*)"\r\n\r\n([\s\S]*)\r\n$/.exec(part);
    if (!m) return null; // not a document we wrote — hand the caller nothing rather than a partial read
    out.push([m[1], m[2]]);
  }
  return out.length ? out : null;
}

// Read only the framing delimiter from a COMPLETE raw multipart document. This deliberately does not
// parse or rewrite parts: custom reader-entered bytes stay verbatim. Accept LF as well as CRLF because
// browsers normalize textarea line endings before `onChange`. RFC 2046 bounds a boundary to 70
// `bchars`, with no trailing space; enforcing that also keeps CR/LF and header injection out.
function multipartBoundaryFromBody(bodyText) {
  const text = String(bodyText || '');
  if (!text.startsWith('--')) return null;
  const firstLf = text.indexOf('\n');
  if (firstLf < 3) return null;
  const lineBreak = text[firstLf - 1] === '\r' ? '\r\n' : '\n';
  const boundaryEnd = firstLf - (lineBreak.length - 1);
  const boundary = text.slice(2, boundaryEnd);
  const bchars = /^[0-9A-Za-z'()+_,\-./:=? ]{0,69}[0-9A-Za-z'()+_,\-./:=?]$/;
  if (!bchars.test(boundary)) return null;
  const closing = `${lineBreak}--${boundary}--`;
  if (!text.endsWith(closing) && !text.endsWith(`${closing}${lineBreak}`)) return null;
  return boundary;
}

function multipartBoundaryParameter(boundary) {
  const token = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
  return token.test(boundary) ? boundary : `"${boundary}"`;
}

// The Content-Type header value for a body about to be sent or shown. multipart is the one media type
// whose header is not a constant: a parser finds the part delimiter ONLY through the `boundary`
// parameter, so a bare `multipart/form-data` ships an unparseable request. Generated and complete raw
// documents both name the delimiter their bytes actually use; malformed/incomplete raw text is never
// assigned a guessed boundary.
function bodyContentTypeHeader(contentType, bodyText) {
  if (bodySerialization(contentType) !== 'multipart') return contentType;
  const boundary = multipartBoundaryFromBody(bodyText);
  if (!boundary) return contentType;
  const withoutBoundary = String(contentType)
    .replace(/;\s*boundary\s*=\s*(?:"[^"\r\n]*"|[^;\r\n]*)/gi, '');
  return `${withoutBoundary}; boundary=${multipartBoundaryParameter(boundary)}`;
}

// The label over the raw-body textarea — the Try-it fallback for a body with no tabulatable fields.
// It has to name the media type the operation declares, because whatever the reader types there goes
// out verbatim: "Raw JSON" over a urlencoded endpoint is an instruction to type an unparseable body.
function rawBodyLabel(contentType) {
  const kind = bodySerialization(contentType);
  if (kind === 'form') return 'Raw form body (application/x-www-form-urlencoded)';
  if (kind === 'multipart') return 'Raw body (multipart/form-data)';
  return 'Raw JSON';
}

// Duplicate names are legal in a form body (`a=1&a=2`) but a dict / object literal cannot hold them —
// the second would silently overwrite the first, and the sample would then send a different body than
// the one printed above it. Generators emit the readable map literal only when this holds, and an
// ordered list of pairs otherwise.
function uniqueFormNames(pairs) {
  return !!pairs && new Set(pairs.map(([k]) => k)).size === pairs.length;
}

// The header list minus Content-Type, for a sample that builds the body CLIENT-SIDE. Only the client
// knows the boundary it generated, and all three of curl (--form-string), requests (`files=`) and
// fetch (FormData) skip writing their own Content-Type when the caller already set one — so leaving
// ours in place is the difference between a working sample and a body the server cannot split.
function headersSansContentType(headers) {
  return headers.filter(([k]) => String(k).toLowerCase() !== 'content-type');
}

// What fetch() should be handed for a request body, and the Content-Type to set alongside it (null =
// set none). Extracted from send() so the decision is unit-testable without a live request.
//
// multipart goes out as a FormData rather than our own sample document: the browser generates a fresh
// boundary per request and encodes each value against it, which is the only way a value containing
// CRLF — or the sample boundary itself — can't corrupt the body. That REQUIRES leaving Content-Type
// unset, because the boundary is chosen inside fetch() and a header we wrote could only name a
// different one.
function liveRequestBody(contentType, bodyText) {
  const pairs = bodySerialization(contentType) === 'multipart' ? decodeFormBody(bodyText, contentType) : null;
  // typeof guard, not an environment assumption: this module is also imported by the prerender, and a
  // string body is the honest degradation (bodyContentTypeHeader names the validated boundary those
  // exact bytes use, whether generated here or entered by the reader).
  if (pairs && typeof FormData === 'function') {
    const form = new FormData();
    pairs.forEach(([k, v]) => form.append(k, v));
    return { body: form, contentType: null };
  }
  return { body: bodyText, contentType: bodyContentTypeHeader(contentType, bodyText) };
}

function requestBodyExample(spec, op) {
  const media = requestBodyMedia(spec, op);
  return authoredMediaExamples(spec, media)[0];
}

// Three-state validation for the subset of JSON Schema this renderer understands. `null` means the
// value is still possible, but an unsupported assertion or recursion bound prevents proof. Keeping
// that state distinct is essential for oneOf: an unknown competing branch is not a non-match, so an
// invented example cannot claim exclusivity; authored branch routing may still use known facts to
// find a single possible branch.
function schemaMatchStatus(spec, schema, value, depth = 0, requireShapeSignal = false) {
  if (depth > INTERSECTION_MAX_DEPTH) return null;
  const s = withSynthesisSafety(flattenAllOf(spec, schema));
  if (schemaDefinitelyImpossible(spec, s)) return false;
  let unknown = !!((s.not && typeof s.not === 'object' && Object.keys(s.not).length)
    || s[SYNTHESIS_UNSAFE]);
  const simultaneousUnions = Array.isArray(s.oneOf) && s.oneOf.length
    && Array.isArray(s.anyOf) && s.anyOf.length;
  if (simultaneousUnions) unknown = true;
  const union = schemaVariants(spec, s);
  if (union) {
    const statuses = union.variants.map((variant) => schemaMatchStatus(
      spec, variant.schema, value, depth + 1, requireShapeSignal,
    ));
    const matches = statuses.filter((status) => status === true).length;
    const unknowns = statuses.filter((status) => status === null).length;
    if (union.kind === 'anyOf') {
      if (matches) return true;
      return unknowns ? null : false;
    }
    if (matches > 1) return false;
    if (matches === 1) return unknowns ? null : true;
    return unknowns ? null : false;
  }
  const choices = enumConstraint(s);
  if (choices !== null && !choices.some((item) => canonicalJson(item) === canonicalJson(value))) {
    return false;
  }
  const types = effectiveSchemaTypes(s);
  if (!valueMatchesTypes(value, types)) return false;
  if (valueMatchesKnownFormat(s, value) !== true) unknown = true;
  const constraint = constraintUnion(spec, s);
  if (constraint) {
    if (!requiredConstraintUnionIsExact(spec, s)) {
      unknown = true;
    } else {
      const matchedGroups = constraint.groups.filter((group) => (
        value && typeof value === 'object' && !Array.isArray(value)
        && group.every((name) => Object.prototype.hasOwnProperty.call(value, name))
      )).length;
      if (constraint.kind === 'oneOf' ? matchedGroups !== 1 : matchedGroups < 1) return false;
    }
  } else if (!simultaneousUnions
    && ((Array.isArray(s.oneOf) && s.oneOf.length) || (Array.isArray(s.anyOf) && s.anyOf.length))) {
    // A non-empty authored union whose branches all became unresolvable cannot be proven either way.
    unknown = true;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const required = Array.isArray(s.required) ? s.required : [];
    if (required.some((name) => !Object.prototype.hasOwnProperty.call(value, name))) return false;
    const props = s.properties && typeof s.properties === 'object' ? s.properties : {};
    const hasShapeSignal = Object.keys(value)
      .some((name) => Object.prototype.hasOwnProperty.call(props, name))
      || required.some((name) => Object.prototype.hasOwnProperty.call(value, name));
    if (requireShapeSignal && Object.keys(props).length && !hasShapeSignal) {
      if (hasUnprojectedPropertyAdmission(s)) unknown = true;
      else if (!unknown) return false;
    }
    for (const [name, child] of Object.entries(props)) {
      if (!Object.prototype.hasOwnProperty.call(value, name)) continue;
      const childStatus = schemaMatchStatus(spec, child, value[name], depth + 1, false);
      if (childStatus === false) return false;
      if (childStatus === null) unknown = true;
    }
    const extras = Object.keys(value).filter((name) => !Object.prototype.hasOwnProperty.call(props, name));
    const unknownAdmission = hasUnprojectedPropertyAdmission(s);
    if (extras.length && unknownAdmission) unknown = true;
    else if (s.additionalProperties === false && extras.length) return false;
    else if (s.additionalProperties && typeof s.additionalProperties === 'object') {
      for (const name of extras) {
        const extraStatus = schemaMatchStatus(
          spec, s.additionalProperties, value[name], depth + 1, false,
        );
        if (extraStatus === false) return false;
        if (extraStatus === null) unknown = true;
      }
    }
  } else if (Array.isArray(value) && s.items !== undefined) {
    // In JSON Schema 2020-12, `items` applies only after `prefixItems`; unevaluatedItems can further
    // change which positions it governs. This renderer does not project those tuple semantics, so
    // applying `items` to every authored element would turn unknown into a false rejection.
    if (hasUnprojectedItemEvaluation(s)) return null;
    for (const item of value) {
      const itemStatus = schemaMatchStatus(spec, s.items, item, depth + 1, false);
      if (itemStatus === false) return false;
      if (itemStatus === null) unknown = true;
    }
  }
  return unknown ? null : true;
}

function topLevelValueMatchesSchema(
  spec,
  schema,
  value,
  depth = 0,
  requireShapeSignal = false,
  allowUnknownAssertions = false,
) {
  const status = schemaMatchStatus(spec, schema, value, depth, requireShapeSignal);
  return allowUnknownAssertions ? status !== false : status === true;
}

// An operation-wide media example belongs to a selected union branch only when that attribution is
// unambiguous. This preserves authored scalar/array truth without leaking an object example into a
// different raw branch (or one discriminator variant into another).
function requestBodyExampleForVariant(spec, op, variantIndex = 0) {
  const media = requestBodyMedia(spec, op);
  const examples = authoredMediaExamples(spec, media);
  if (!examples.length) return undefined;
  const union = media && media.schema !== undefined
    ? schemaVariantsThroughArray(spec, media.schema) : null;
  if (!union || union.variants.length <= 1) {
    if (!media || media.schema === undefined) return examples[0];
    return examples.find((example) => schemaMatchStatus(spec, media.schema, example) !== false);
  }
  return examples.find((example) => {
    if (schemaMatchStatus(spec, media.schema, example, 0, false) === false) return false;
    // Item tabs describe shapes that MAY occur in one array body; they are not mutually exclusive
    // whole-body variants. A valid mixed array therefore belongs to every tab whose item shape it
    // contains, while an empty array is shape-neutral and belongs to all tabs. This is the same
    // routing contract response examples use, and keeps authored request bytes intact as arrays.
    if (union.arrayRoot) {
      if (!Array.isArray(example)) return false;
      return arrayExampleRoutesTo(spec, union, example, variantIndex);
    }
    const shapeNeutralObject = example && typeof example === 'object'
      && !Array.isArray(example) && !Object.keys(example).length;
    const matches = union.variants
      .map((variant, index) => {
        if (union.propertyName && variant.hasValue
          && example && typeof example === 'object' && !Array.isArray(example)
          && Object.prototype.hasOwnProperty.call(example, union.propertyName)) {
          if (canonicalJson(example[union.propertyName]) !== canonicalJson(variant.value)) return -1;
        }
        return topLevelValueMatchesSchema(
          spec, variant.schema, example, 0, !shapeNeutralObject, true,
        ) ? index : -1;
      })
      .filter((index) => index >= 0);
    return union.kind === 'oneOf'
      ? matches.length === 1 && matches[0] === variantIndex
      : matches.includes(variantIndex);
  });
}

// The raw textarea's branch-specific seed. A mixed object/scalar/array union cannot share one raw
// string: object branches use bodyValues, while scalar/array branches send this text verbatim. For a
// real choice synthesize from the selected self-contained branch; unsupported form scalars/arrays
// intentionally serialize to '' rather than becoming JSON bytes under a form Content-Type. A normal
// body (and a normalized one-member union) keeps the historical authored-media-example precedence.
function initialRawBody(spec, op, variantIndex = 0) {
  const media = requestBodyMedia(spec, op);
  if (!media) return '';
  if (media.schema === undefined) {
    const authored = requestBodyExample(spec, op);
    return authored === undefined ? '' : serializeRequestBody(authored, requestBodyContentType(spec, op));
  }
  const union = schemaVariantsThroughArray(spec, media.schema);
  if (union && union.variants.length > 1) {
    const picked = union.variants[variantIndex] || union.variants[0];
    const authored = requestBodyExampleForVariant(spec, op, variantIndex);
    if (authored !== undefined) return serializeRequestBody(authored, requestBodyContentType(spec, op));
    const value = synthesizeExample(spec, picked.schema);
    return value === undefined || !topLevelValueMatchesSchema(spec, media.schema, value)
      ? '' : serializeRequestBody(value, requestBodyContentType(spec, op));
  }
  const value = requestBodyExampleForVariant(spec, op, variantIndex);
  if (value !== undefined) return serializeRequestBody(value, requestBodyContentType(spec, op));
  if (union) {
    const picked = union.variants[variantIndex] || union.variants[0];
    const synthesized = synthesizeExample(spec, picked.schema);
    return synthesized === undefined || !topLevelValueMatchesSchema(spec, media.schema, synthesized)
      ? '' : serializeRequestBody(synthesized, requestBodyContentType(spec, op));
  }
  return '';
}

// The request body's variants (or null when it isn't a union). Derived in ONE place because the
// Try-it selector and the request-body doc tabs both need the same labels in the same order —
// deriving them twice would let the tab strip and the selector disagree about which branch index 1 is.
function requestBodyVariants(spec, op) {
  const media = requestBodyMedia(spec, op);
  if (!media || media.schema === undefined) return null;
  const union = schemaVariantsThroughArray(spec, media.schema);
  return union && union.variants.length > 1 ? union : null;
}

// The request body schema flattened into editable fields, or null when the body isn't a simple object
// (then Try-it falls back to a raw-JSON textarea). For a union body, `variantIndex` selects the branch
// and the fields describe THAT branch: its `required` markers, and the discriminator carrying a `pin`
// so the form shows — and always sends — the literal that identifies it.
function bodyFields(spec, op, variantIndex = 0) {
  const media = requestBodyMedia(spec, op);
  if (!media || media.schema === undefined) return null;
  const base = flattenAllOf(spec, media.schema);
  const union = schemaVariantsThroughArray(spec, base);
  // Out-of-range falls back to branch 0 rather than returning null: a stale index (a spec swapped
  // under a live selector) would otherwise drop the whole form to a raw-JSON textarea with no cause.
  const picked = union ? (union.variants[variantIndex] || union.variants[0]) : null;
  const schema = picked ? picked.schema : base;
  if (schemaDefinitelyImpossible(spec, schema)) return [];
  // Non-union bodies keep the historical gate EXACTLY — that's the regression boundary. A variant is
  // held to namesFields instead, because a textbook `oneOf: [{ $ref: A }, …]` branch often omits the
  // redundant `type: 'object'`; a branch that still isn't a plain object returns null so the raw-JSON
  // textarea renders for it, per variant.
  if (union ? !namesFields(schema) : (schema.type !== 'object' || !schema.properties)) return null;
  const required = new Set(schema.required || []);
  const pinName = picked && picked.hasValue ? union.propertyName : null;
  return Object.keys(schema.properties).map((name) => {
    const p = flattenAllOf(spec, schema.properties[name]);
    return {
      name,
      schema: p,
      type: p.type || (p.properties ? 'object' : 'string'),
      enum: Array.isArray(p.enum) ? p.enum : null,
      required: required.has(name),
      // An OBJECT (not a bare value) so a legitimately falsy literal — `false`, `0`, `""` — still reads
      // as pinned. assembleBody and BodyFieldInput both key off its presence.
      ...(name === pinName ? { pin: { value: picked.value } } : null),
      // Mantine's `description` slot wants a string, so we can't render rich html here. When the
      // build wrote an html key, the description went through the {% %}+Markdown pass — use its
      // tag-stripped text (or '' for island-only prose) and NEVER the raw source (which may be
      // `{% … %}`). A plain description (no html key) is shown verbatim.
      description: typeof p['x-aardvark-description-html'] === 'string'
        ? (p['x-aardvark-description-text'] || '')
        : (p.description || ''),
    };
  });
}

// Seed the Try-it body fields from the spec's request example, so the form starts
// with realistic values the reader can edit.
function initialBodyValues(spec, op, variantIndex = 0) {
  const fields = bodyFields(spec, op, variantIndex);
  if (!fields) return {};
  const ex = requestBodyExampleForVariant(spec, op, variantIndex);
  const out = {};
  fields.forEach((f) => {
    let v;
    if (ex && typeof ex === 'object' && ownValue(ex, f.name) !== undefined) v = ownValue(ex, f.name);
    else if (f.schema.example !== undefined) v = f.schema.example;
    if (v === undefined) return;
    const prepared = f.type === 'object' || f.type === 'array' ? JSON.stringify(v, null, 2) : v;
    // Examples are annotations, not permission to seed a value that provably violates the field.
    // Unknown assertions remain usable; only a definite contradiction is omitted.
    if (schemaMatchStatus(spec, f.schema, coercedBodyFieldValue(f, prepared)) === false) return;
    setOwnValue(out, f.name, prepared);
  });
  return out;
}

function coercedBodyFieldValue(field, value) {
  if (field.type === 'integer' || field.type === 'number') {
    const number = Number(value);
    return Number.isNaN(number) ? value : number;
  }
  if (field.type === 'boolean') return value === true || value === 'true';
  if (field.type === 'object' || field.type === 'array') {
    try { return JSON.parse(value); } catch (e) { return value; }
  }
  return value;
}

// Build the structured value once so untouched automatic seeds can be validated against the whole
// request schema before serialization. User edits intentionally remain sendable even when invalid.
function assembledBodyValue(fields, values) {
  if (!fields) return null;
  const obj = {};
  fields.forEach((f) => {
    // A pinned discriminator is the selected variant's identity, not an editable value, so force the
    // literal here rather than trusting the widget. bodyValues deliberately survives a variant swap
    // (shared field names carry over), so a stale literal from the previous branch would otherwise
    // reach the wire — and this is the ONE serialization point, feeding both send() and the code
    // samples, so pinning here fixes both at once.
    if (f.pin) { setOwnValue(obj, f.name, f.pin.value); return; }
    const v = ownValue(values, f.name);
    // null arrives when a clearable Select is cleared — omit the field, don't send null.
    if (v === undefined || v === null || v === '') return;
    setOwnValue(obj, f.name, coercedBodyFieldValue(f, v));
  });
  return obj;
}

// Assemble the request body string from the per-field values, coercing each to its schema type.
// Empty fields are omitted. `contentType` picks the SERIALIZATION (serializeRequestBody); omitted, or
// any JSON media type, means JSON.stringify(value, null, 2).
function assembleBody(fields, values, contentType) {
  const obj = assembledBodyValue(fields, values);
  if (!obj) return '';
  return Object.keys(obj).length ? serializeRequestBody(obj, contentType) : '';
}

// Methods that carry a request body: always post/put/patch, plus delete when the
// operation declares a requestBody (some APIs use DELETE bodies, e.g. batch deletes).
function methodHasBody(method, op) {
  if (['post', 'put', 'patch'].includes(method)) return true;
  return method === 'delete' && !!(op && op.requestBody);
}

// Build the request a sample should show: method, URL (params filled in), the header list (auth
// first), and the body for write verbs — serialized for the operation's media type, not always as
// JSON. `bodyKind`/`formPairs` are what let a generator build the body the way its own client library
// wants (a dict for requests, a FormData for fetch) instead of pasting a wire string; `formPairs` is
// null for JSON and for anything that didn't decode, and every generator falls back to `body` then.
function buildRequest({ spec, path, method, op, values, body, bodyIsAuthoritative = false, scheme, apiKey }) {
  const params = resolvedParams(spec, op).filter((p) => p.in === 'path' || p.in === 'query');
  let url = baseUrl(spec) + path;
  const query = [];
  params.forEach((p) => {
    const { value, placeholder } = sampleParamValue(p, values[p.name]);
    if (value === undefined || value === '') return;
    // Encode real values like the live request does; keep {placeholders} readable.
    const enc = placeholder ? String(value) : encodeURIComponent(value);
    if (p.in === 'path') url = url.replaceAll(`{${p.name}}`, enc);
    else query.push(`${encodeURIComponent(p.name)}=${enc}`);
  });
  const headers = [];
  const isBasic = isBasicScheme(scheme);
  const auth = authApply(scheme, apiKey || (isBasic ? 'username:password' : 'YOUR_API_KEY'));
  if (auth && auth.in === 'query') query.push(`${encodeURIComponent(auth.name)}=${encodeURIComponent(auth.value)}`);
  else if (auth) headers.push([auth.name, auth.value]); // 'header' or 'cookie' — both shown as a header in samples
  if (query.length) url += `?${query.join('&')}`;

  const writeVerb = methodHasBody(method, op);
  const contentType = requestBodyContentType(spec, op) || 'application/json';
  let bodyText = '';
  if (writeVerb) {
    if (body && body.trim()) bodyText = body;
    else if (!bodyIsAuthoritative) {
      // The spec's example is a VALUE, not a wire string — serialize it the same way assembleBody
      // serializes the reader's edits, or a form endpoint with an authored example would fall back to
      // JSON the moment the Try-it form is empty. OperationSection's prepared body is authoritative,
      // including an intentionally empty mixed-union branch; only standalone helper callers take this
      // fallback, or a branch switch could resurrect the operation-wide example from another shape.
      const ex = requestBodyExample(spec, op);
      const media = requestBodyMedia(spec, op);
      if (ex !== undefined
        && (!media || media.schema === undefined
          || schemaMatchStatus(spec, media.schema, ex, 0, false) !== false)) {
        bodyText = serializeRequestBody(ex, contentType);
      }
    }
  }
  if (bodyText) headers.push(['Content-Type', bodyContentTypeHeader(contentType, bodyText)]);

  return {
    method: method.toUpperCase(),
    url,
    headers,
    body: bodyText,
    hasBody: !!bodyText,
    bodyKind: bodySerialization(contentType),
    formPairs: bodyText ? decodeFormBody(bodyText, contentType) : null,
  };
}

// Add `spaces` of indentation to every line after the first — for dropping a
// multi-line JSON body into an already-indented context.
function reindent(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line, i) => (i === 0 || !line ? line : pad + line))
    .join('\n');
}

// Quote a value as a single-quoted shell word, escaping embedded single quotes.
function shQuote(s) {
  return `'${String(s).replace(/'/g, "'\\''")}'`;
}

// Quote a value as a single-quoted PHP string (only ' and \ are special there).
function phpQuote(s) {
  return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

// Render a JSON-decoded value as a pretty Python literal (True/False/None, not
// JSON's true/false/null) so the generated Python is always valid.
function pyLiteral(value, indent) {
  const pad = ' '.repeat(indent);
  const inner = ' '.repeat(indent + 4);
  if (value === null) return 'None';
  if (value === true) return 'True';
  if (value === false) return 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((v) => inner + pyLiteral(v, indent + 4)).join(',\n')},\n${pad}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length) return '{}';
    const rows = keys.map((k) => `${inner}${JSON.stringify(k)}: ${pyLiteral(value[k], indent + 4)}`);
    return `{\n${rows.join(',\n')},\n${pad}}`;
  }
  return 'None';
}

// Whether a sample should build the multipart body with its own client library rather than paste our
// sample document. Only when the pairs actually decoded — a reader's hand-typed raw body doesn't, and
// rewriting it into a FormData would send something other than what they typed.
function buildsMultipart(req) {
  return req.bodyKind === 'multipart' && !!req.formPairs;
}

function genCurl(req) {
  const multipart = buildsMultipart(req);
  const lines = [`curl -X ${req.method} ${shQuote(req.url)}`];
  (multipart ? headersSansContentType(req.headers) : req.headers)
    .forEach(([k, v]) => lines.push(`  -H ${shQuote(`${k}: ${v}`)}`));
  if (multipart) {
    // --form-string, NOT -F: with -F curl reads a value beginning with `@` or `<` as a FILENAME to
    // upload, so a form field whose value happens to start with one would silently send the contents
    // of a local file (or fail) instead of the value printed in the sample. --form-string is the
    // literal-value form and is otherwise identical. Content-Type is dropped above so curl writes its
    // own with the boundary it generates.
    req.formPairs.forEach(([k, v]) => lines.push(`  --form-string ${shQuote(`${k}=${v}`)}`));
  } else if (req.hasBody) {
    // Every other kind pastes the wire body verbatim, which is already correct for urlencoded: -d
    // sends a pre-encoded `k=v&k2=v2` unchanged under the Content-Type buildRequest set.
    lines.push(`  -d ${shQuote(req.body)}`);
  }
  return lines.join(' \\\n');
}

// Form pairs as a Python literal: a dict when the names are unique (what a reader expects to read),
// else an ordered list of 2-tuples. requests accepts both for `data=` and `files=`, and only the list
// can carry a repeated field name without the second silently overwriting the first.
function pyPairLiteral(pairs, renderValue) {
  const rows = pairs.map(([k, v]) => [JSON.stringify(k), renderValue(v)]);
  return uniqueFormNames(pairs)
    ? `{\n${rows.map(([k, v]) => `    ${k}: ${v},`).join('\n')}\n}`
    : `[\n${rows.map(([k, v]) => `    (${k}, ${v}),`).join('\n')}\n]`;
}

function genPython(req) {
  const m = req.method.toLowerCase();
  const multipart = buildsMultipart(req);
  // requests writes the multipart Content-Type (with its generated boundary) only when the caller
  // hasn't already set that header, so a client-built body has to leave it out.
  const headers = multipart ? headersSansContentType(req.headers) : req.headers;
  const L = ['import requests', '', `url = ${JSON.stringify(req.url)}`];
  if (headers.length) {
    L.push('headers = {');
    headers.forEach(([k, v]) => L.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)},`));
    L.push('}');
  }
  const headersArg = headers.length ? ', headers=headers' : '';
  if (multipart) {
    // (None, value): the None FILENAME is how requests writes a plain form-data part. With a filename
    // it emits `filename="…"` and the server sees an uploaded file, not a form field.
    L.push(`files = ${pyPairLiteral(req.formPairs, (v) => `(None, ${JSON.stringify(v)})`)}`, '', `response = requests.${m}(url${headersArg}, files=files)`);
  } else if (req.bodyKind === 'form' && req.formPairs) {
    // `data=<dict>` lets requests do the urlencoding — the same bytes buildRequest already produced,
    // but readable and editable, which a pre-encoded string is not.
    L.push(`payload = ${pyPairLiteral(req.formPairs, (v) => JSON.stringify(v))}`, '', `response = requests.${m}(url${headersArg}, data=payload)`);
  } else if (req.hasBody) {
    let parsed;
    let valid = true;
    try { parsed = JSON.parse(req.body); } catch (e) { valid = false; }
    if (valid) {
      L.push(`payload = ${pyLiteral(parsed, 0)}`, '', `response = requests.${m}(url${headersArg}, json=payload)`);
    } else {
      // Not valid JSON (raw textarea): send the text verbatim as the body like the
      // other generators — JSON.stringify yields a valid Python string literal.
      L.push(`payload = ${JSON.stringify(req.body)}`, '', `response = requests.${m}(url${headersArg}, data=payload)`);
    }
  } else {
    L.push('', `response = requests.${m}(url${headersArg})`);
  }
  L.push('print(response.text)');
  return L.join('\n');
}

// Form pairs as a JS literal, for `new URLSearchParams(…)`. Same unique-name rule as pyPairLiteral:
// the object literal reads better, but only the array-of-pairs form can hold a repeated name. Closing
// brackets sit at 2 spaces because this is emitted inside the fetch init object.
function jsPairLiteral(pairs) {
  const rows = pairs.map(([k, v]) => [JSON.stringify(k), JSON.stringify(v)]);
  return uniqueFormNames(pairs)
    ? `{\n${rows.map(([k, v]) => `    ${k}: ${v},`).join('\n')}\n  }`
    : `[\n${rows.map(([k, v]) => `    [${k}, ${v}],`).join('\n')}\n  ]`;
}

function genJavaScript(req) {
  const multipart = buildsMultipart(req);
  const headers = multipart ? headersSansContentType(req.headers) : req.headers;
  const L = [`const url = ${JSON.stringify(req.url)};`, ''];
  if (multipart) {
    // A FormData built before the call, and NO Content-Type header: fetch generates the boundary and
    // writes the header itself. Setting it by hand is the classic multipart bug — the header would
    // name a boundary the body doesn't use (or none at all), and the server can't split the parts.
    L.push('const form = new FormData();');
    req.formPairs.forEach(([k, v]) => L.push(`form.append(${JSON.stringify(k)}, ${JSON.stringify(v)});`));
    L.push('');
  }
  L.push('const response = await fetch(url, {');
  L.push(`  method: ${JSON.stringify(req.method)},`);
  if (headers.length) {
    L.push('  headers: {');
    headers.forEach(([k, v]) => L.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)},`));
    L.push('  },');
  }
  if (req.hasBody) {
    // Valid JSON embeds as a readable object literal; invalid raw-textarea input
    // falls back to a plain string body (like the other generators) so the snippet
    // is never broken JS.
    let expr;
    if (multipart) {
      expr = 'form';
    } else if (req.bodyKind === 'form' && req.formPairs) {
      // URLSearchParams re-encodes the same bytes buildRequest produced, but keeps the fields
      // editable instead of freezing them into one percent-encoded string.
      expr = `new URLSearchParams(${jsPairLiteral(req.formPairs)})`;
    } else {
      try {
        expr = `JSON.stringify(${reindent(JSON.stringify(JSON.parse(req.body), null, 2), 2)})`;
      } catch (e) {
        expr = JSON.stringify(req.body);
      }
    }
    L.push(`  body: ${expr},`);
  }
  L.push('});', '', 'const data = await response.text();', 'console.log(data);');
  // Wrap in an async IIFE so the top-level await runs in any context, not just ESM.
  const inner = L.join('\n').split('\n').map((l) => (l ? `  ${l}` : l)).join('\n');
  // Escape U+2028/U+2029 anywhere in the snippet (url, headers, or body): JSON.stringify
  // leaves them literal, but pre-ES2019 engines read them as line terminators.
  return `(async () => {\n${inner}\n})();`.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

// Go / PHP / Rust below take `req.body` VERBATIM and set `req.headers` as given, which is already
// media-correct for every kind: buildRequest hands them the wire body (a urlencoded string, or the
// sample multipart document) and a Content-Type that carries the boundary that document actually uses.
// They only lack the idiomatic client-side form builders the three above have — a rewrite that would
// buy correctness in curl/Python/JS and nothing but multipart plumbing here.
function genGo(req) {
  const imports = ['"fmt"', '"io"', '"net/http"'];
  if (req.hasBody) imports.push('"strings"');
  const L = ['package main', '', 'import ('];
  imports.forEach((im) => L.push('\t' + im));
  L.push(')', '', 'func main() {', `\turl := ${JSON.stringify(req.url)}`);
  if (req.hasBody) {
    L.push(`\tpayload := strings.NewReader(${JSON.stringify(req.body)})`, '');
    L.push(`\treq, err := http.NewRequest(${JSON.stringify(req.method)}, url, payload)`, '\tif err != nil {', '\t\tpanic(err)', '\t}');
  } else {
    L.push(`\treq, err := http.NewRequest(${JSON.stringify(req.method)}, url, nil)`, '\tif err != nil {', '\t\tpanic(err)', '\t}');
  }
  req.headers.forEach(([k, v]) => L.push(`\treq.Header.Set(${JSON.stringify(k)}, ${JSON.stringify(v)})`));
  L.push('', '\tres, err := http.DefaultClient.Do(req)', '\tif err != nil {', '\t\tpanic(err)', '\t}', '\tdefer res.Body.Close()', '');
  L.push('\tbody, err := io.ReadAll(res.Body)', '\tif err != nil {', '\t\tpanic(err)', '\t}', '\tfmt.Println(string(body))', '}');
  return L.join('\n');
}

function genPHP(req) {
  const L = ['<?php', '', `$ch = curl_init(${phpQuote(req.url)});`, ''];
  L.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${phpQuote(req.method)});`);
  L.push('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);');
  if (req.headers.length) {
    L.push('curl_setopt($ch, CURLOPT_HTTPHEADER, [');
    req.headers.forEach(([k, v]) => L.push(`    ${phpQuote(`${k}: ${v}`)},`));
    L.push(']);');
  }
  if (req.hasBody) L.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${phpQuote(req.body)});`);
  L.push('', '$response = curl_exec($ch);', 'curl_close($ch);', '', 'echo $response;');
  return L.join('\n');
}

// Render a string as a Rust double-quoted literal. Rust's escape syntax differs
// from JSON's (\u{XX} not \uXXXX, and no \b/\f), so escape control characters
// explicitly; printable text (including non-ASCII) is valid in Rust source as-is.
function rustString(s) {
  let out = '"';
  for (const ch of String(s)) {
    const code = ch.codePointAt(0);
    if (ch === '\\') out += '\\\\';
    else if (ch === '"') out += '\\"';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (code < 0x20) out += `\\u{${code.toString(16)}}`;
    else out += ch;
  }
  return out + '"';
}

function genRust(req) {
  const m = req.method.toLowerCase();
  const L = ['use reqwest::Client;', '', '#[tokio::main]'];
  L.push('async fn main() -> Result<(), reqwest::Error> {', '    let client = Client::new();', '');
  // reqwest::Client only has get/post/put/patch/delete/head; others go via .request().
  const call = ['get', 'post', 'put', 'patch', 'delete', 'head'].includes(m)
    ? `        .${m}(${rustString(req.url)})`
    : `        .request(reqwest::Method::${req.method}, ${rustString(req.url)})`;
  L.push('    let response = client', call);
  req.headers.forEach(([k, v]) => L.push(`        .header(${rustString(k)}, ${rustString(v)})`));
  if (req.hasBody) L.push(`        .body(${rustString(req.body)})`);
  L.push('        .send()', '        .await?;', '');
  L.push('    let body = response.text().await?;', '    println!("{}", body);', '', '    Ok(())', '}');
  return L.join('\n');
}

// Syntax lexer (tokenizeCode/highlightHtml) + LANG_SYNTAX live in @aardvark/islands/highlight, shared
// with the reader assistant's answer code blocks. Imported above; re-exported below for
// tests/back-compat.

// Whether a live or example response body should be highlighted as JSON.
function looksJson(text) {
  const t = (text == null ? '' : String(text)).trim();
  return t.startsWith('{') || t.startsWith('[');
}

const LIVE_JSON_TREE_MAX_CHARS = 200_000;

function parseJsonResponseText(text) {
  const t = (text == null ? '' : String(text)).trim();
  if (t.length > LIVE_JSON_TREE_MAX_CHARS) return null;
  if (!looksJson(t)) return null;
  try {
    const value = JSON.parse(t);
    if (!exampleIsTree(value)) return null;
    return { value, text: JSON.stringify(value, null, 2) };
  } catch (e) {
    return null;
  }
}

const LANGUAGES = [
  { value: 'curl', label: 'cURL', Icon: IconTerminal2, gen: genCurl, lang: 'bash' },
  { value: 'python', label: 'Python', Icon: IconBrandPython, gen: genPython, lang: 'python' },
  { value: 'javascript', label: 'JavaScript', Icon: IconBrandJavascript, gen: genJavaScript, lang: 'javascript' },
  { value: 'go', label: 'Go', Icon: IconBrandGolang, gen: genGo, lang: 'go' },
  { value: 'php', label: 'PHP', Icon: IconBrandPhp, gen: genPHP, lang: 'php' },
  { value: 'rust', label: 'Rust', Icon: IconBrandRust, gen: genRust, lang: 'rust' },
];

// The reader's chosen request-sample language, shared across every operation's rail and
// remembered between visits — pick Python once and all samples switch. Lifted to a context (like
// TableSortContext) so the sticky per-operation rails stay in sync. The storage key is
// deliberately GLOBAL, not per-spec like storageKeyFor's API key: a preferred sample language is a
// reader-level UI preference that should carry across every API reference on the site, whereas the
// API key is a per-API secret that must not. This persistence is deliberate.
const LANG_STORAGE_KEY = 'aardvark-api-lang';
const LangContext = createContext({ lang: 'curl', setLang: () => {} });

// The language dropdown: one compact Select (not a wrapping tab strip)
// that keeps each language's brand icon — in the control and in every option.
function LanguagePicker({ value, onChange }) {
  const current = LANGUAGES.find((l) => l.value === value) || LANGUAGES[0];
  const CurrentIcon = current.Icon;
  return (
    <Select
      size="xs"
      w={148}
      data={LANGUAGES.map((l) => ({ value: l.value, label: l.label }))}
      value={value}
      onChange={(v) => v && onChange(v)}
      allowDeselect={false}
      checkIconPosition="right"
      leftSection={<CurrentIcon size={16} />}
      comboboxProps={{ withinPortal: true }}
      aria-label="Request sample language"
      renderOption={({ option }) => {
        const lang = LANGUAGES.find((l) => l.value === option.value);
        const Icon = lang && lang.Icon;
        return (
          <Group gap={8} wrap="nowrap">
            {Icon ? <Icon size={16} /> : null}
            <span>{option.label}</span>
          </Group>
        );
      }}
    />
  );
}

function CodeSamples({ spec, path, method, op, values, body, bodyIsAuthoritative = false, scheme, apiKey }) {
  const { lang, setLang } = useContext(LangContext);
  const req = useMemo(
    () => buildRequest({ spec, path, method, op, values, body, bodyIsAuthoritative, scheme, apiKey }),
    [spec, path, method, op, values, body, bodyIsAuthoritative, scheme, apiKey],
  );
  const current = LANGUAGES.find((l) => l.value === lang) || LANGUAGES[0];
  return (
    <Stack gap={8} mt="md">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Text size="sm" fw={600}>Request samples</Text>
        <LanguagePicker value={lang} onChange={setLang} />
      </Group>
      <CodeBlock text={current.gen(req)} lang={current.lang} />
    </Stack>
  );
}

// A single request-body field, typed by its schema: a select for enums, a switch
// for booleans, a number input for numerics, a JSON textarea for nested
// object/array values, and a plain text input otherwise.
function BodyFieldInput({ field, value, onChange }) {
  const common = {
    label: field.name,
    description: field.description || undefined,
    withAsterisk: field.required,
  };
  if (field.pin) {
    // The discriminator of the selected variant: shown so the reader can see what identifies this
    // branch, but disabled — editing it here would contradict the variant selector above, and a
    // `clearable` control would let it be emptied, which assembleBody's null-drop would then strip
    // from the payload with no visible cause. assembleBody forces the literal regardless.
    const pinned = String(field.pin.value);
    return <Select {...common} data={[pinned]} value={pinned} disabled />;
  }
  if (field.enum) {
    return (
      <Select
        {...common}
        data={field.enum.map((v) => String(v))}
        value={value === undefined || value === null ? null : String(value)}
        onChange={onChange}
        clearable
        placeholder="Select a value"
      />
    );
  }
  if (field.type === 'boolean') {
    // Switch has no withAsterisk prop (it isn't an Input.Wrapper), so render the
    // required marker in the label to match the other field types.
    const label = field.required
      ? <>{field.name} <Text span c="red" inherit aria-hidden="true">*</Text></>
      : field.name;
    return (
      <Switch
        label={label}
        description={field.description || undefined}
        checked={value === true}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    );
  }
  if (field.type === 'integer' || field.type === 'number') {
    return (
      <NumberInput
        {...common}
        value={value === undefined ? '' : value}
        onChange={onChange}
        allowDecimal={field.type === 'number'}
        placeholder={field.type}
      />
    );
  }
  if (field.type === 'object' || field.type === 'array') {
    return (
      <Textarea
        {...common}
        autosize
        minRows={2}
        value={value || ''}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={`${field.type} as JSON`}
      />
    );
  }
  return (
    <TextInput
      {...common}
      value={value === undefined ? '' : value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={(field.schema && field.schema.type) || 'string'}
    />
  );
}

function TryIt({
  spec, path, method, op,
  values, setValues,
  fields, bodyValues, setBodyValues, rawBody, setRawBody, bodyText,
  bodyVariants, variantKey, onVariantChange,
  scheme, apiKey, onAuthNeeded,
  resp, setResp, loading, setLoading,
}) {
  const params = resolvedParams(spec, op).filter((p) => p.in === 'path' || p.in === 'query');

  const hasBody = methodHasBody(method, op);

  async function send() {
    if (scheme && !apiKey) {
      if (onAuthNeeded) onAuthNeeded(scheme);
      return;
    }
    setLoading(true);
    setResp(null);
    try {
      let url = baseUrl(spec) + path;
      const query = [];
      params.forEach((p) => {
        const v = values[p.name];
        if (v === undefined || v === '') return;
        if (p.in === 'path') url = url.replaceAll(`{${p.name}}`, encodeURIComponent(v));
        else query.push(`${encodeURIComponent(p.name)}=${encodeURIComponent(v)}`);
      });
      const auth = apiKey ? authApply(scheme, apiKey) : null;
      if (auth && auth.in === 'query') query.push(`${encodeURIComponent(auth.name)}=${encodeURIComponent(auth.value)}`);
      if (query.length) url += `?${query.join('&')}`;
      const init = { method: method.toUpperCase(), headers: {} };
      if (hasBody && bodyText && bodyText.trim()) {
        // Media-aware: bodyText is already serialized for the declared media type (assembleBody), and
        // liveRequestBody decides what fetch() can actually carry it as — a FormData for multipart
        // (browser-generated boundary, so no Content-Type of ours), the string otherwise.
        const live = liveRequestBody(requestBodyContentType(spec, op) || 'application/json', bodyText);
        if (live.contentType) init.headers['Content-Type'] = live.contentType;
        init.body = live.body;
      }
      // 'cookie' is intentionally skipped: browsers forbid setting the Cookie header
      // via fetch, so it would be silently dropped (AuthPanel notes this to the reader).
      if (auth && auth.in === 'header') init.headers[auth.name] = auth.value;
      const res = await fetch(url, init);
      const text = await res.text();
      setResp({ status: res.status, statusText: res.statusText, text });
    } catch (e) {
      // A thrown fetch means NO HTTP response reached us — the browser blocked it (CORS, or the API hides
      // cross-origin auth errors) or the network failed. There is no status code to show, so flag the
      // failure and let the UI explain it instead of printing a bogus "0".
      setResp({ failed: true, error: (e && e.message) || String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="xs">
      {params.map((p) => (
        <TextInput
          key={p.name}
          label={`${p.name} (${p.in})`}
          placeholder={p.schema && p.schema.type ? p.schema.type : ''}
          value={values[p.name] || ''}
          onChange={(e) => setValues({ ...values, [p.name]: e.currentTarget.value })}
        />
      ))}
      {hasBody && (
        <>
          <Text size="xs" fw={600} c="dimmed" mt="xs">Request body</Text>
          {/* The variant selector for a oneOf/anyOf body. It swaps the whole editable form to the
              selected branch (its required markers, and its pinned discriminator). The selection is
              owned by OperationSection, so the request-body doc tabs, this form and the code samples
              all agree on which branch is showing. withinPortal because Try-it lives inside an
              Accordion.Panel, whose overflow would otherwise clip the dropdown. The description names
              the discriminator WITHOUT backticks — Mantine's description slot is a plain string, so
              they'd render literally instead of as code. */}
          {bodyVariants && (
            <Select
              // A hidden Accordion.Panel can retain Mantine Select's old display label even though
              // its controlled hidden value advanced from the docs tab. Remount on the shared key so
              // the label the reader sees always names the branch every other request surface uses.
              key={variantKey}
              size="xs"
              label="Variant"
              description={bodyVariants.propertyName
                ? `Which ${bodyVariants.propertyName} branch of the request body to send.`
                : 'Which branch of the request body to send.'}
              data={bodyVariants.variants.map((v) => ({ value: v.key, label: v.label }))}
              value={variantKey}
              onChange={(v) => v && onVariantChange(v)}
              allowDeselect={false}
              checkIconPosition="right"
              comboboxProps={{ withinPortal: true }}
            />
          )}
          {fields
            ? fields.map((f) => (
                <BodyFieldInput
                  key={f.name}
                  field={f}
                  value={ownValue(bodyValues, f.name)}
                  onChange={(v) => setBodyValues({ ...bodyValues, [f.name]: v }, f.name)}
                />
              ))
            : (
              /* The label names the media type the operation actually declares. "Raw JSON" over a
                 urlencoded endpoint would tell the reader to type the one thing the server cannot
                 parse — and this is the path where nothing else corrects them, because the text is
                 sent VERBATIM (there is no field list to re-serialize from). */
              <Textarea
                label={rawBodyLabel(requestBodyContentType(spec, op))}
                minRows={4}
                autosize
                value={rawBody}
                onChange={(e) => setRawBody(e.currentTarget.value)}
              />
            )}
        </>
      )}
      <Group>
        <Button size="xs" onClick={send} loading={loading} color={METHOD_COLORS[method] || 'blue'}>
          Send {method.toUpperCase()}
        </Button>
      </Group>
      {resp && (resp.failed ? (
        <Stack gap={4}>
          <Text size="sm" fw={600} c="red">Request failed</Text>
          <Text size="xs" c="dimmed">
            The browser could not read a response{resp.error ? ` (${resp.error})` : ''}. This is usually a CORS or
            network issue: the API may not permit browser requests from this origin, or — for an authenticated
            endpoint — it hides cross-origin auth errors. Add a key via Authorize, or run a request sample above,
            which is not subject to browser CORS.
          </Text>
        </Stack>
      ) : (
        <Stack gap={4}>
          <Text size="sm" fw={600}>
            Response: {resp.status}{resp.statusText ? ` ${resp.statusText}` : ''}
          </Text>
          <LiveResponseBody text={resp.text} />
        </Stack>
      ))}
    </Stack>
  );
}

function LiveResponseBody({ text }) {
  const parsed = parseJsonResponseText(text);
  const JsonTree = parsed ? jsonTreeComponent() : null;
  if (JsonTree) return <JsonTree data={parsed.value} {...JSON_TREE_PROPS} />;
  const displayText = parsed ? parsed.text : text;
  return <CodeBlock text={displayText} lang={looksJson(displayText) ? 'json' : ''} />;
}

// A stable DOM id for an operation, used both as the section anchor and as the href
// of its site-nav link. Method + a slug of the path keeps it unique even when two
// methods share a path (GET vs POST /pets). The slug keeps the '/' separator distinct
// from other punctuation so distinct routes never collapse to one id (/pets/{id} !=
// /pets/id, /pets/search != /pets-search) — duplicate ids would break getElementById.
// KEEP IN SYNC with op_anchor()/_op_slug() in the build's OpenAPI parser: the build emits
// the matching nav href, so any drift between the two would dead-link every operation.
function slugify(s) {
  const result = String(s)
    .replace(/[^a-zA-Z0-9/]+/g, '_')
    .replace(/\//g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .toLowerCase();
  // "root" fallback for a path that reduces entirely to separators (/, /_, /-), as the
  // build's _op_slug does.
  return result || 'root';
}
function opAnchor(method, path) {
  // method.toLowerCase() mirrors the build's op_anchor (in its OpenAPI parser): every current
  // caller already passes a lowercase method (from METHODS/collectOperations), but a
  // future 'GET' must still match the lowercased build-time sidebar href, not dead-link.
  return `aardvark-op-${method.toLowerCase()}-${slugify(path)}`;
}

function prefixedAnchor(prefix, anchor) {
  return `${prefix || ''}${anchor}`;
}

function stableHash(s) {
  let hash = 2166136261;
  const value = String(s);
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function tagAnchor(tag) {
  if (tag === UNTAGGED_TAG) return UNTAGGED_TAG_ANCHOR;
  const name = String(tag || 'operations');
  return `aardvark-api-tag-${slugify(name)}-${stableHash(name)}`;
}

function tagSectionKey(tag) {
  return tag === UNTAGGED_TAG ? 'untagged' : `tag:${tag}`;
}

// The HTTP method as a small colored pill — reused in the left nav and each
// operation's endpoint bar. A thin wrapper over Mantine's Badge so the method
// palette (METHOD_COLORS) matches the response/status badges.
function MethodChip({ method }) {
  return (
    <Badge color={METHOD_COLORS[method] || 'gray'} variant="light" radius="sm" size="lg" className="aardvark-api-method">
      {method.toUpperCase()}
    </Badge>
  );
}

// The endpoint line at the top of an operation: the full request URL (server base
// dimmed, path emphasized). The HTTP method rides in a badge on the title above this,
// not here — so a long URL never squeezes the method pill into a "G…" ellipsis.
function EndpointBar({ path, base }) {
  return (
    <div className="aardvark-api-endpoint">
      <code className="aardvark-api-endpoint-url">
        {base ? <span className="aardvark-api-endpoint-base">{base}</span> : null}{path}
      </code>
    </div>
  );
}

// Precompute each response once: the resolved response, its schema rows, and the
// example body. Shared by the middle column's ResponsesDocs (status + headers +
// schema) and the right rail's ResponseExamples (the example bodies), so the work
// and the memo identity are done a single time per operation.
function computeResponseItems(spec, op) {
  const responses = op.responses || {};
  return Object.keys(responses).sort().map((code) => {
    const resp = resolveRef(spec, responses[code]);
    const media = jsonContent(resp);
    const schema = media && media.schema !== undefined
      ? schemaToRows(spec, media.schema) : { rows: [], note: null };
    let exampleVariants = null;
    if (media && media.schema !== undefined && schema.variants) {
      // schemaToRows descends through an array wrapper before splitting a union. Recreate that same
      // branch list here, wrapping each selected item schema back in the array, so a response of
      // `array<oneOf<A, B>>` synthesizes `[A]` / `[B]` rather than bare A / B objects.
      const union = schemaVariantsThroughArray(spec, media.schema);
      if (union) {
        exampleVariants = new Map(union.variants.map((variant) => [
          variant.key,
          responseExample(
            spec,
            op,
            code,
            resp,
            variant.schema,
            media.schema,
          ),
        ]));
      }
    }
    // `variants` is carried through rather than dropped here: the per-variant row arrays MUST be
    // computed inside this memoized pass, because SortableTable's memo only holds while `rows` keeps a
    // stable reference — rebuilding them inline in ResponsesDocs' JSX would silently kill the memo for
    // every table on the page.
    return {
      code,
      resp,
      rows: schema.rows,
      note: schema.note,
      variants: schema.variants && schema.variants.map((variant) => ({
        ...variant,
        example: (exampleVariants && exampleVariants.get(variant.key)) || null,
      })),
      variantKind: schema.variantKind,
      example: responseExample(spec, op, code, resp),
    };
  });
}

// The per-variant request-body state machine for one operation: which body variant is selected, the
// structured field values and the raw body text kept per variant, and the serialized `bodyText` that
// the doc tabs, the Try-it form, the code samples and the live send all read.
function useRequestBodyState(spec, op) {
  // The selected request-body variant is owned HERE, not in TryIt or RequestBodyDocs: Mantine's
  // Collapse unmounts the Try-it panel when the accordion closes (which would reset a selection held
  // inside it — the same reason values/bodyValues/rawBody are hoisted), and the doc tabs, the form and
  // the code samples must all agree on which branch is showing. Lifting it any lower desyncs the rail.
  const bodyVariants = useMemo(() => requestBodyVariants(spec, op), [spec, op]);
  const [variantKey, setVariantKey] = useState('0');
  const variantIndex = Number(variantKey) || 0;
  const fields = useMemo(() => bodyFields(spec, op, variantIndex), [spec, op, variantIndex]);
  const [bodyValues, setBodyValuesState] = useState(() => initialBodyValues(spec, op));
  const bodyValuesByVariant = useRef(new Map());
  const editedBodyVariants = useRef(new Set());
  const editedBodyFieldsByVariant = useRef(new Map());
  if (!bodyValuesByVariant.current.has('0')) bodyValuesByVariant.current.set('0', bodyValues);
  // The media type the body is serialized FOR. Derived once here and threaded into assembleBody so
  // the doc tabs, the Try-it form, the code samples and the live send all agree on the wire format.
  const contentType = useMemo(() => requestBodyContentType(spec, op) || 'application/json', [spec, op]);
  const [rawBody, setRawBodyState] = useState(() => initialRawBody(spec, op));
  const rawBodyByVariant = useRef(new Map());
  if (!rawBodyByVariant.current.has('0')) rawBodyByVariant.current.set('0', rawBody);
  const hasAuthoredBody = useMemo(
    () => requestBodyExampleForVariant(spec, op, variantIndex) !== undefined,
    [spec, op, variantIndex],
  );
  const setBodyValues = (next, fieldName) => {
    editedBodyVariants.current.add(variantKey);
    if (fieldName) {
      const editedFields = editedBodyFieldsByVariant.current.get(variantKey) || new Set();
      editedFields.add(fieldName);
      editedBodyFieldsByVariant.current.set(variantKey, editedFields);
    }
    setBodyValuesState((previous) => {
      const value = typeof next === 'function' ? next(previous) : next;
      bodyValuesByVariant.current.set(variantKey, value);
      return value;
    });
  };
  const setRawBody = (next) => {
    setRawBodyState((previous) => {
      const value = typeof next === 'function' ? next(previous) : next;
      rawBodyByVariant.current.set(variantKey, value);
      return value;
    });
  };
  // Swapping variants re-seeds the NEWLY revealed fields from the spec while keeping what the reader
  // already typed. initialBodyValues runs once in a lazy useState initializer, so nothing else would
  // ever populate a field that appears only on another branch. Prior edits win (they're spread last),
  // except for a shared name whose TYPE differs between branches: initialBodyValues stores object/array
  // values as JSON strings and scalars natively, so carrying a string into an object slot (or back)
  // would land the wrong shape in the widget and in assembleBody. Done in the setter, never a
  // useEffect — an effect would re-fire and clobber edits on unrelated re-renders.
  const swapVariant = (next) => {
    const i = Number(next) || 0;
    const nextKey = String(i);
    bodyValuesByVariant.current.set(variantKey, bodyValues);
    rawBodyByVariant.current.set(variantKey, rawBody);
    setVariantKey(nextKey);

    if (rawBodyByVariant.current.has(nextKey)) {
      setRawBodyState(rawBodyByVariant.current.get(nextKey));
    } else {
      const seededRaw = initialRawBody(spec, op, i);
      rawBodyByVariant.current.set(nextKey, seededRaw);
      setRawBodyState(seededRaw);
    }

    if (bodyValuesByVariant.current.has(nextKey)) {
      setBodyValuesState(bodyValuesByVariant.current.get(nextKey));
    } else {
      const previousTypes = new Map((fields || []).map((field) => [field.name, field.type]));
      const previousSchemas = new Map(
        (fields || []).map((field) => [field.name, canonicalJson(flattenAllOf(spec, field.schema))]),
      );
      const editedFields = editedBodyFieldsByVariant.current.get(variantKey) || new Set();
      const kept = {};
      (bodyFields(spec, op, i) || []).forEach((field) => {
        if (!editedFields.has(field.name)) return;
        if (ownValue(bodyValues, field.name) === undefined) return;
        if (previousTypes.has(field.name) && previousTypes.get(field.name) !== field.type) return;
        if (previousSchemas.has(field.name)
          && previousSchemas.get(field.name) !== canonicalJson(flattenAllOf(spec, field.schema))) return;
        if (field.pin || !topLevelValueMatchesSchema(
          spec, field.schema, coercedBodyFieldValue(field, ownValue(bodyValues, field.name)),
          0, false, true,
        )) return;
        setOwnValue(kept, field.name, ownValue(bodyValues, field.name));
      });
      // A compatible value carried from the previous variant is already a reader edit. Mark the new
      // variant edited so its untouched authored raw seed cannot shadow the value visible in the form.
      const keptNames = Object.keys(kept);
      if (keptNames.length) {
        editedBodyVariants.current.add(nextKey);
        editedBodyFieldsByVariant.current.set(nextKey, new Set(keptNames));
      }
      const seeded = { ...initialBodyValues(spec, op, i), ...kept };
      bodyValuesByVariant.current.set(nextKey, seeded);
      setBodyValuesState(seeded);
    }
  };
  const bodyText = useMemo(() => {
    if (!fields) return rawBody;
    // Preserve an exact AUTHORED wire value until the reader edits this structured variant. A merely
    // synthesized raw body must not hide values that are blank in the visible form. After the first
    // edit, the form owns the body completely, so clearing every field stays bodyless instead of
    // resurrecting the original example in samples or live send.
    if (!editedBodyVariants.current.has(variantKey) && hasAuthoredBody && rawBody) return rawBody;
    const assembled = assembleBody(fields, bodyValues, contentType);
    if (!editedBodyVariants.current.has(variantKey) && assembled) {
      const media = requestBodyMedia(spec, op);
      const value = assembledBodyValue(fields, bodyValues);
      // Per-field examples can each be valid while their combination violates oneOf (for example,
      // seeding both sides of an exactly-one required-fields rule). Never auto-publish/send a body
      // the complete root schema definitively rejects; unsupported assertions remain admissible.
      if (media && media.schema !== undefined
        && schemaMatchStatus(spec, media.schema, value) === false) return '';
    }
    return assembled;
  }, [fields, bodyValues, rawBody, contentType, variantKey, hasAuthoredBody, spec, op]);
  return {
    bodyVariants, variantKey, swapVariant, fields, bodyValues, setBodyValues, rawBody, setRawBody,
    bodyText,
  };
}

// One operation, laid out as two columns: a documentation column (endpoint,
// description, parameters, "Try it now", and the response docs) and a sticky right
// rail (the language request samples and the response examples). The parameter
// values, request body, and API key are owned here so both the Try-it form and the
// request samples track the reader's edits.
function OperationSection({ spec, path, method, op, apiKey, base, onAuthNeeded, anchorPrefix = '' }) {
  const scheme = useMemo(() => schemeForOp(spec, op), [spec, op]);
  const tryIt = useMemo(() => tryItAvailability(spec, op), [spec, op]);
  const {
    bodyVariants, variantKey, swapVariant, fields, bodyValues, setBodyValues, rawBody, setRawBody,
    bodyText,
  } = useRequestBodyState(spec, op);
  const [values, setValues] = useState({});
  const items = useMemo(() => computeResponseItems(spec, op), [spec, op]);
  // One response selection per status code. The same controlled value drives the middle-column
  // schema tab and the right-rail synthesized example, so changing one cannot leave the other on a
  // different branch. Invalid/stale keys are clamped by responseVariantKey at render time.
  const [responseVariantKeys, setResponseVariantKeys] = useState({});
  const setResponseVariant = (code, key) => {
    setResponseVariantKeys((current) => ({ ...current, [code]: key }));
  };
  // resp/loading are hoisted here (not local to TryIt) so a sent request's response survives
  // collapsing the Try-it accordion: Mantine's Collapse unmounts the panel when closed, which
  // would otherwise discard them — the same reason values/bodyValues/rawBody are hoisted. TryIt
  // still mounts only when the reader opens it, so this keeps the response without an eager mount.
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const operationLabel = `${method.toUpperCase()} ${path}`;
  const title = op.summary || operationLabel;
  const anchor = prefixedAnchor(anchorPrefix, opAnchor(method, path));
  return (
    <section className="aardvark-api-op">
      <div className="aardvark-api-doc">
        <div className="aardvark-api-op-head">
          <MethodChip method={method} />
          {/* The id lives on the HEADING (not the section) so the op title participates in the site's
              heading-permalink system. theme.scss gives THIS heading the api-specific scroll-margin
              (var(--aardvark-api-sticky)) rather than the global +16px heading offset — so a nav click /
              deep link lands the op just below the sticky header at the SAME offset the scroll-spy band and
              the intro/auth anchors use (keeping "active section == where a click lands" exact). The
              .aardvark-heading-anchor <a> + Tabler link icon below are the SAME affordance the Markdown
              renderer bakes in (_anchorize): the shared theme.scss reveals it on hover, and
              the native href updates the URL on click with no custom JS — identical hover/permalink
              behavior to every other heading on the site. */}
          <h3 className="aardvark-api-op-title" id={anchor}>
            {title}
            <a className="aardvark-heading-anchor" href={`#${anchor}`} aria-label={`Permalink to ${title}`}>
              <IconLink stroke={2} aria-hidden="true" />
            </a>
          </h3>
        </div>
        <EndpointBar path={path} base={base} />
        <Prose html={op['x-aardvark-description-html']} text={op['x-aardvark-description-text'] ?? op.description} size="sm" />
        <ParamsTable spec={spec} op={op} operationLabel={operationLabel} />
        {/* methodHasBody, not just `op.requestBody`, so a GET carrying a stray requestBody key doesn't
            grow a phantom section the request can never actually send. */}
        {methodHasBody(method, op) && (
          <RequestBodyDocs
            spec={spec}
            op={op}
            operationLabel={operationLabel}
            variantKey={variantKey}
            onVariantChange={swapVariant}
          />
        )}
        {/* Try-it is collapsed by default — it's a lot of form, and most readers want the
            docs + samples first. The operation's values/body live in OperationSection, so
            the request samples stay in sync whether this is open or closed. */}
        {tryIt.enabled ? (
          <Accordion
            variant="contained"
            chevronPosition="left"
            className="aardvark-api-tryit"
            onChange={(value) => {
              if (value === 'tryit' && scheme && !apiKey && onAuthNeeded) onAuthNeeded(scheme);
            }}
          >
            <Accordion.Item value="tryit">
              <Accordion.Control>Try it now</Accordion.Control>
              <Accordion.Panel>
                <TryIt
                  spec={spec}
                  path={path}
                  method={method}
                  op={op}
                  values={values}
                  setValues={setValues}
                  fields={fields}
                  bodyValues={bodyValues}
                  setBodyValues={setBodyValues}
                  rawBody={rawBody}
                  setRawBody={setRawBody}
                  bodyText={bodyText}
                  bodyVariants={bodyVariants}
                  variantKey={variantKey}
                  onVariantChange={swapVariant}
                  scheme={scheme}
                  apiKey={apiKey}
                  onAuthNeeded={onAuthNeeded}
                  resp={resp}
                  setResp={setResp}
                  loading={loading}
                  setLoading={setLoading}
                />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ) : (
          <Paper withBorder radius="md" p="md" className="aardvark-api-tryit">
            <Text size="sm" fw={600}>Try it now unavailable</Text>
            <Text size="xs" c="dimmed" mt={4}>{tryIt.reason}</Text>
          </Paper>
        )}
        <ResponsesDocs
          spec={spec}
          items={items}
          operationLabel={operationLabel}
          variantKeys={responseVariantKeys}
          onVariantChange={setResponseVariant}
        />
      </div>
      <div className="aardvark-api-rail">
        <div className="aardvark-api-rail-inner">
          <CodeSamples
            spec={spec}
            path={path}
            method={method}
            op={op}
            values={values}
            body={bodyText}
            bodyIsAuthoritative
            scheme={scheme}
            apiKey={apiKey}
          />
          <ResponseExamples items={items} variantKeys={responseVariantKeys} />
        </div>
      </div>
    </section>
  );
}

// Column sorts numerically only when every non-empty value is a clean number; else
// text. KEEP IN SYNC with asNumber in themes/vark/tables.js — the theme JS is a
// static asset (not bundled here), so the regex is intentionally duplicated.
function asNumber(text) {
  const cleaned = String(text).replace(/[,\s]/g, '').replace(/^[$£€]/, '').replace(/%$/, '');
  if (cleaned === '' || !/^[+-]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  return parseFloat(cleaned);
}

// Whether the API-reference tables sort/filter. Honors the same switches as
// Markdown tables (front-matter `sortableTables` / `filterableTables` or the site
// `tables` block), resolved in Python and passed as ApiReference props. Defaults
// on so the component renders interactively in isolation (tests, Storybook-style
// usage).
const TableSortContext = createContext(true);
const TableFilterContext = createContext(true);

function columnFilterText(col, row) {
  const source = col.filterValue || col.sortValue;
  const v = source(row);
  return v == null ? '' : String(v);
}

function rowFilterText(row, columns) {
  return columns.map((col) => columnFilterText(col, row)).join('');
}

function rowMatchesFilter(row, columns, query) {
  const needle = String(query || '').trim().toLowerCase();
  if (!needle) return true;
  return rowFilterText(row, columns).toLowerCase().includes(needle);
}

// A Mantine Table whose column headers sort the rows on click (asc/desc, numeric or
// text auto-detected, empties last) and whose rows can be filtered by text. Native
// React, so it survives this island's re-renders — the DOM enhancer in tables.js
// can't touch React-owned tables. Reuses the theme's .aardvark-th-button /
// [aria-sort] caret styling and table-search chrome so these match Markdown tables.
// Each column is { label, sortValue(row), render(row), filterValue?(row) }. When
// sorting/filtering is switched off it renders that feature's plain static counterpart.
function SortableTable({ columns, rows, rowKey, searchContext, ...tableProps }) {
  const sortable = useContext(TableSortContext);
  const filterable = useContext(TableFilterContext);
  const [sortIndex, setSortIndex] = useState(-1);
  const [sortDir, setSortDir] = useState(1);
  const [query, setQuery] = useState('');
  const [searchDismissed, setSearchDismissed] = useState(false);

  const canFilter = filterable && rows.length > 1;
  const queryText = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!canFilter || !queryText) return rows;
    return rows.filter((row) => rowMatchesFilter(row, columns, queryText));
  }, [rows, columns, canFilter, queryText]);

  const sorted = useMemo(() => {
    const col = columns[sortIndex];
    if (!col) return filtered;
    const val = (r) => {
      const v = col.sortValue(r);
      return v == null ? '' : String(v).trim();
    };
    const numeric = filtered.some((r) => val(r) !== '') && filtered.every((r) => val(r) === '' || asNumber(val(r)) !== null);
    return filtered.slice().sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      if (numeric) {
        const an = asNumber(av);
        const bn = asNumber(bv);
        if (an === null && bn === null) return 0;
        if (an === null) return 1; // empties last regardless of direction
        if (bn === null) return -1;
        return (an - bn) * sortDir;
      }
      return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }) * sortDir;
    });
  }, [filtered, columns, sortIndex, sortDir]);

  function toggle(i) {
    if (i === sortIndex) setSortDir((d) => -d);
    else {
      setSortIndex(i);
      setSortDir(1);
    }
  }

  function changeSearch(next) {
    setQuery(next);
    if (searchDismissed) setSearchDismissed(false);
  }

  function dismissSearch(input) {
    setQuery('');
    setSearchDismissed(true);
    input.blur();
  }

  // Wrap in the site's own wide-table scroll container (.aardvark-table-scroll, overflow-x:auto —
  // the exact element tables.js grafts onto Markdown tables, which it CAN'T add here because these
  // are React-owned). Without it a deep schema's long monospace Name column (e.g.
  // `engagement.escalation_shown`) blows out the table's min-content and, in the two-column layout,
  // slides under the sticky rail; now it scrolls within the doc column instead. tableProps (borders +
  // mt spacing) stay on the Mantine <Table> — they're Mantine props, not DOM attributes. (Long
  // identifiers also soft-wrap via `overflow-wrap: anywhere` in theme.scss, so this scrollbar is a
  // last resort, not the common case.)
  const displayed = sortable ? sorted : filtered;
  const hasQuery = canFilter && queryText.length > 0;
  const firstHeader = columns[0] ? columns[0].label : '';
  const searchLabel = firstHeader
    ? (searchContext ? `Search ${searchContext} by ${firstHeader}` : `Search by ${firstHeader}`)
    : (searchContext ? `Search ${searchContext}` : 'Search table');
  const tableClassName = ['aardvark-js', tableProps.className].filter(Boolean).join(' ');
  const wasEmpty = useRef(false);
  useEffect(() => {
    if (!canFilter) {
      wasEmpty.current = false;
      return;
    }
    const isEmpty = hasQuery && displayed.length === 0;
    if (isEmpty === wasEmpty.current) return;
    wasEmpty.current = isEmpty;
    if (typeof document === 'undefined') return;
    const live = document.getElementById('aardvark-live');
    if (!live) return;
    live.textContent = '';
    let timer;
    if (isEmpty) {
      timer = setTimeout(() => {
        if (wasEmpty.current) live.textContent = 'No matching rows';
      }, 50);
    }
    return () => clearTimeout(timer);
  }, [canFilter, displayed.length, hasQuery]);
  const wrapClassName = [
    'aardvark-table-wrap',
    hasQuery ? 'aardvark-has-query' : '',
    searchDismissed && !hasQuery ? 'aardvark-search-dismissed' : '',
  ].filter(Boolean).join(' ');
  return (
    <div
      className={wrapClassName}
      onMouseLeave={() => { if (searchDismissed) setSearchDismissed(false); }}
    >
      {canFilter && (
        <div className="aardvark-table-search">
          <input
            type="search"
            className="aardvark-table-search-input"
            placeholder="Search table…"
            aria-label={searchLabel}
            value={query}
            onChange={(e) => changeSearch(e.currentTarget.value)}
            onFocus={() => { if (searchDismissed) setSearchDismissed(false); }}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') return;
              e.preventDefault();
              dismissSearch(e.currentTarget);
            }}
          />
        </div>
      )}
      <div className="aardvark-table-scroll">
        <Table {...tableProps} className={tableClassName}>
          <Table.Thead>
            <Table.Tr>
              {columns.map((c, i) =>
                sortable ? (
                  <Table.Th
                    key={i}
                    className="aardvark-th-sortable"
                    aria-sort={i === sortIndex ? (sortDir === 1 ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" className="aardvark-th-button" onClick={() => toggle(i)}>
                      <span>{c.label}</span>
                      <span className="aardvark-th-caret" aria-hidden="true" />
                    </button>
                  </Table.Th>
                ) : (
                  <Table.Th key={i}>{c.label}</Table.Th>
                ),
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayed.map((row, index) => (
              <Table.Tr key={rowKey(row)} className={index % 2 === 1 ? 'aardvark-alt' : undefined}>
                {columns.map((c, i) => (
                  <Table.Td key={i}>{c.render(row)}</Table.Td>
                ))}
              </Table.Tr>
            ))}
            {hasQuery && displayed.length === 0 && (
              <Table.Tr className="aardvark-table-empty">
                <Table.Td colSpan={columns.length}>No matching rows</Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}

// A field name with a zero-width line-break opportunity (<wbr>) after each dot, so a long dotted path
// (e.g. `account.suspension.self_serviceable`) wraps at the path boundaries — `account.` / `suspension.` /
// `self_serviceable`, readable — instead of mid-token (`account.suspensio` / `n`) when the Name column is
// narrow. The <wbr>s are the PREFERRED break points; the cell's `overflow-wrap: anywhere` (theme.scss)
// stays as the last-resort fallback for a single segment too long to fit. A name with no dots is unchanged.
function DottedName({ name }) {
  const parts = String(name).split('.');
  return parts.map((seg, i) => (
    <React.Fragment key={i}>
      {i > 0 ? '.' : ''}
      {i > 0 ? <wbr /> : null}
      {seg}
    </React.Fragment>
  ));
}

// Column definitions live at module scope so their reference is stable: combined
// with stable `rows`, SortableTable's useMemo then recomputes only when the data or
// the active sort changes — not on every parent re-render (accordion expand/collapse).
const PARAM_COLUMNS = [
  { label: 'Name', sortValue: (p) => p.name, render: (p) => <Code><DottedName name={p.name} /></Code> },
  { label: 'In', sortValue: (p) => p.in, render: (p) => p.in },
  { label: 'Type', sortValue: (p) => (p.schema && p.schema.type) || '', filterValue: (p) => (p.schema && p.schema.type) || '-', render: (p) => (p.schema && p.schema.type ? p.schema.type : '-') },
  { label: 'Required', sortValue: (p) => (p.required ? 1 : 0), filterValue: (p) => (p.required ? 'yes' : 'no'), render: (p) => (p.required ? 'yes' : 'no') },
  { label: 'Description', sortValue: (p) => p['x-aardvark-description-text'] ?? p.description ?? '', render: (p) => <Prose inline size="sm" html={p['x-aardvark-description-html']} text={p['x-aardvark-description-text'] ?? p.description} /> },
];

function ParamsTable({ spec, op, operationLabel }) {
  // Resolve $ref parameters (e.g. { $ref: '#/components/parameters/Limit' }) up front, like
  // schemaToRows/HeadersTable do — otherwise the columns read name/type/description (and the
  // x-aardvark-description-* keys) off the unresolved stub and render a blank row. Memoized so the
  // rows keep a stable reference across re-renders.
  // resolvedParams drops dangling-$ref stubs ({} with no name/in) that would otherwise render a blank
  // row and collide every such row onto the same "undefined-undefined" rowKey (duplicate React keys).
  const params = useMemo(() => resolvedParams(spec, op), [spec, op]);
  if (!params.length) return null;
  return (
    <SortableTable
      columns={PARAM_COLUMNS}
      rows={params}
      rowKey={(p) => `${p.in}-${p.name}`}
      searchContext={`parameters for ${operationLabel}`}
      withTableBorder
      withColumnBorders
      mt="sm"
    />
  );
}

const SCHEMA_COLUMNS = [
  { label: 'Property', sortValue: (r) => r.name, render: (r) => <Code><DottedName name={r.name} /></Code> },
  { label: 'Type', sortValue: (r) => r.type, render: (r) => r.type },
  { label: 'Required', sortValue: (r) => (r.required ? 1 : 0), filterValue: (r) => (r.required ? 'yes' : 'no'), render: (r) => (r.required ? 'yes' : 'no') },
  { label: 'Description', sortValue: (r) => r.descriptionText ?? r.description ?? '', render: (r) => <Prose inline size="sm" html={r.descriptionHtml} text={r.descriptionText ?? r.description} /> },
];

// `rows` is precomputed once by the caller (computeResponseItems / RequestBodyDocs), so its reference
// is stable across re-renders — that plus the module-scope columns makes the memo real. The shape
// `note` is rendered by the caller (SchemaDocs), so it can also surface for the no-rows shapes
// (a scalar body, a map of scalars) where this table renders nothing. `searchContext` arrives
// PREBUILT rather than assembled from a response code here, because the same table now also serves
// request bodies and per-variant tabs, which have no code and need distinct labels (it becomes the
// search input's aria-label — N tabs must not produce N identical ones).
function SchemaTable({ rows, searchContext }) {
  if (!rows.length) return null;
  return (
    <SortableTable
      columns={SCHEMA_COLUMNS}
      rows={rows}
      rowKey={(r) => r.name}
      searchContext={searchContext}
      withTableBorder
      withColumnBorders
      mt={4}
    />
  );
}

// One documented body — a response's or a request's. Renders the heading, the shape `note`, and
// either a single field table or, for a oneOf/anyOf union, ONE TAB PER VARIANT each with its own
// table. Shared by ResponsesDocs and RequestBodyDocs so the two surfaces can't drift apart.
//
// Tabs rather than one merged table with a "variant" column: sibling branches of a discriminated
// union routinely share a field name (`type`, `id`), and merged those collide on SchemaTable's
// `rowKey={(r) => r.name}` — duplicate React keys — while a single `required` column could no longer
// tell you that `client_id` is required for oidc but not for saml.
//
// `value`/`onChange` make the tab strip optionally CONTROLLED. OperationSection owns request and
// response selections so each documentation tab moves together with its corresponding form/example.
function SchemaDocs({ heading, rows, note, variants, variantKind, searchContext, value, onChange }) {
  const [localActive, setLocalActive] = useState('0');
  // Initial state is derived purely from props (never from storage/window), so the SSR render and the
  // first client render agree — the islands runtime hydrates the baked markup in place, so they
  // must match.
  const controlled = typeof value === 'string';
  const active = controlled ? value : localActive;
  const setActive = controlled ? onChange : setLocalActive;
  const hasVariants = !!(variants && variants.length);
  if (!rows.length && !note && !hasVariants) return null;
  return (
    <>
      <Text size="xs" fw={600} c="dimmed" mt="xs">{heading}</Text>
      {note && <Text size="xs" c="dimmed" mt={4}>{note}</Text>}
      <SchemaTable rows={rows} searchContext={searchContext} />
      {hasVariants && (
        <>
          {/* oneOf and anyOf mean different things to a reader — "pick exactly one of these" vs "any
              combination" — so don't render them with the same caption. */}
          <Text size="xs" c="dimmed" mt={4}>
            {variantKind === 'anyOf' ? 'Any of these shapes:' : 'Exactly one of these shapes:'}
          </Text>
          {/* keepMountedMode="display-none" is REQUIRED, not cosmetic. Mantine 9 defaults
              keepMountedMode to "activity", which wraps a hidden panel in React's <Activity
              mode="hidden"> — and Activity renders NOTHING to the server string. The build prerenders
              this island, and the .md mirror, the whole-site PDF and the search index all read that
              baked markup, so the default would document only the selected variant everywhere JS
              doesn't run. "display-none" is the classic behavior: every panel is rendered, inactive
              ones hidden with CSS. Every valid branch stays in the baked artifact so the web
              reference, Markdown mirror, search index and PDF all document the same complete union. */}
          <Tabs value={active} onChange={(v) => v && setActive(v)} keepMountedMode="display-none" mt={4}>
            <Tabs.List>
              {variants.map((v) => <Tabs.Tab key={v.key} value={v.key}>{v.label}</Tabs.Tab>)}
            </Tabs.List>
            {variants.map((v) => (
              <Tabs.Panel key={v.key} value={v.key} pt="xs">
                {v.note && <Text size="xs" c="dimmed" mt={4}>{v.note}</Text>}
                <SchemaTable rows={v.rows} searchContext={`${searchContext} (${v.label})`} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </>
      )}
    </>
  );
}

// The request body's schema documentation, so a reader who never opens Try-it still gets field docs
// (not only form inputs and example JSON). Mirrors the response Body section (same SchemaDocs), and
// for a union body the tab strip is CONTROLLED by OperationSection so it tracks the Try-it variant
// selector.
function RequestBodyDocs({ spec, op, operationLabel, variantKey, onVariantChange }) {
  const media = requestBodyMedia(spec, op);
  const schema = media ? media.schema : undefined;
  // Memoized so `rows` keeps a stable reference and SortableTable's memo stays real across the
  // parent's re-renders (every keystroke in the Try-it form re-renders OperationSection).
  const body = useMemo(
    () => (schema !== undefined ? schemaToRows(spec, schema) : null),
    [spec, schema],
  );
  if (!body) return null;
  return (
    <SchemaDocs
      heading="Request body"
      rows={body.rows}
      note={body.note}
      variants={body.variants}
      variantKind={body.variantKind}
      searchContext={`request body for ${operationLabel}`}
      value={body.variants ? variantKey : undefined}
      onChange={onVariantChange}
    />
  );
}

const HEADER_COLUMNS = [
  { label: 'Header', sortValue: (r) => r.name, render: (r) => <Code><DottedName name={r.name} /></Code> },
  { label: 'Type', sortValue: (r) => r.type, render: (r) => r.type },
  { label: 'Description', sortValue: (r) => r.descriptionText ?? r.description ?? '', render: (r) => <Prose inline size="sm" html={r.descriptionHtml} text={r.descriptionText ?? r.description} /> },
];

function HeadersTable({ spec, headers, operationLabel, code }) {
  // Resolve types once and memoize, so `rows` keeps a stable reference (and the
  // type column becomes a plain string, letting HEADER_COLUMNS stay at module scope).
  const rows = useMemo(
    () => Object.keys(headers || {}).map((name) => {
      const h = resolveRef(spec, headers[name]);
      return { name, type: h.schema ? typeLabel(spec, h.schema) : '-', description: h.description || '', descriptionHtml: h['x-aardvark-description-html'], descriptionText: h['x-aardvark-description-text'] };
    }),
    [spec, headers],
  );
  if (!rows.length) return null;
  return (
    <>
      <Text size="xs" fw={600} c="dimmed" mt="xs">Headers</Text>
      <SortableTable
        columns={HEADER_COLUMNS}
        rows={rows}
        rowKey={(r) => r.name}
        searchContext={`response ${code} headers for ${operationLabel}`}
        withTableBorder
        withColumnBorders
        mt={4}
      />
    </>
  );
}

// A syntax-highlighted code block: a real <pre><code> carrying Pygments token
// classes (see tokenizeCode), so the theme's syntax palette colors it like the
// site's Markdown code blocks. Rendered as <pre><code> rather than Mantine's
// <Code block> so it sits inside the .aardvark-content pre/code styling and the
// build-time palette scope. code-blocks.js leaves it alone (island-owned DOM),
// so the Copy button here is the only one.

function Highlighted({ text, lang }) {
  const html = useMemo(() => highlightHtml(text, lang), [text, lang]);
  return (
    <pre>
      <code
        className={lang ? `language-${lang}` : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}

// The .aardvark-code-block wrapper + shared CodeActions render the Copy/Download buttons
// exactly like the on-page code blocks and the tree-file modal — themed by theme.css, no
// inline styling here. code-blocks.js leaves this island-owned DOM alone, so these are the
// only actions. There's no source filename for a generated sample, so the download is
// named snippet.<ext> (same convention as code-blocks.js).
function CodeBlock({ text, lang }) {
  return (
    <div className="aardvark-code-block">
      <CodeActions text={text} filename={`snippet.${extForLang(lang)}`} />
      <Highlighted text={text} lang={lang} />
    </div>
  );
}

// The response documentation for the middle column: one accordion item per status
// code (first 2xx open), each showing the response headers and the body schema.
// The example bodies live in the right rail (ResponseExamples) so the docs and the
// copyable JSON sit in their respective columns. Takes the precomputed `items` from
// OperationSection (see computeResponseItems).
function responseVariantKey(item, variantKeys) {
  if (!item.variants || !item.variants.length) return null;
  const wanted = variantKeys?.[item.code] || '0';
  return item.variants.some((variant) => variant.key === wanted) ? wanted : item.variants[0].key;
}

function selectedResponseExample(item, variantKeys) {
  const key = responseVariantKey(item, variantKeys);
  if (key === null) return item.example;
  return item.variants.find((variant) => variant.key === key)?.example || null;
}

// The response a reader is shown first: the first 2xx, else the first item (undefined for an empty
// list). One definition so the docs column and the examples rail can never disagree on the pick.
function firstSuccessItem(items) {
  return items.find((it) => statusColor(it.code) === 'green') || items[0];
}

function ResponsesDocs({ spec, items, operationLabel, variantKeys, onVariantChange }) {
  if (!items.length) return null;
  const firstSuccess = firstSuccessItem(items).code;
  return (
    <Stack gap={4} mt="md">
      <Text size="sm" fw={600}>Responses</Text>
      <Accordion variant="contained" multiple defaultValue={[firstSuccess]} chevronPosition="left">
        {items.map((item) => {
          const descHtml = item.resp['x-aardvark-description-html'];
          const descText = item.resp['x-aardvark-description-text'] ?? item.resp.description;
          // A block description ({% callout %}, raw <table>, …) renders a <div>, which is invalid
          // inside Accordion.Control (a <button>) — the browser ejects it and breaks the click
          // target. Keep the inline label beside the badge; move block prose into the Panel (a <div>).
          const descIsBlock = typeof descHtml === 'string' && PROSE_BLOCK_RE.test(descHtml);
          return (
            <Accordion.Item key={item.code} value={item.code}>
              <Accordion.Control>
                <Group gap="sm">
                  <Badge color={statusColor(item.code)} variant="light" radius="sm">{item.code}</Badge>
                  {!descIsBlock && <Prose inline size="sm" c="dimmed" html={descHtml} text={descText} />}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {descIsBlock && <Prose size="sm" c="dimmed" html={descHtml} text={descText} mb="xs" />}
                <HeadersTable spec={spec} headers={item.resp.headers} operationLabel={operationLabel} code={item.code} />
                <SchemaDocs
                  heading="Body"
                  rows={item.rows}
                  note={item.note}
                  variants={item.variants}
                  variantKind={item.variantKind}
                  searchContext={`response ${item.code} body for ${operationLabel}`}
                  value={responseVariantKey(item, variantKeys) || undefined}
                  onChange={(key) => onVariantChange(item.code, key)}
                />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Stack>
  );
}

// The colored status dot (2xx green, 4xx red, …), keyed to the status class. Shared by
// the response-example picker's control and its options.
function StatusDot({ code }) {
  return <span className="aardvark-api-status-dot" data-status={statusColor(code)} aria-hidden="true" />;
}

// The dropdown that picks which response example to show — same treatment as the
// request-sample language picker, but the icon is the status dot instead of a brand glyph.
function StatusPicker({ codes, value, onChange }) {
  return (
    <Select
      size="xs"
      w={104}
      data={codes}
      value={value}
      onChange={(v) => v && onChange(v)}
      allowDeselect={false}
      checkIconPosition="right"
      leftSection={<StatusDot code={value} />}
      comboboxProps={{ withinPortal: true }}
      aria-label="Response example status"
      renderOption={({ option }) => (
        <Group gap={8} wrap="nowrap">
          <StatusDot code={option.value} />
          <span>{option.value}</span>
        </Group>
      )}
    />
  );
}

// The interactive JSON-tree component (the @gfazioli/mantine-json-tree community island),
// looked up from the island registry at RUNTIME rather than imported — so the API reference
// never hard-depends on that community package. It rides the bundle only when the project has
// it installed: the bundler then pulls the JsonTree island in alongside ApiReference
// so it lands in the registry and its stylesheet ships. Absent the
// package, this returns null and API responses stay the flat highlighted code block. Null during
// the SSR prerender too — the bundler drops marked community islands from the SSR entry,
// so JsonTree isn't in the SSR registry — which is why ResponseExamples consults it only after
// mount (keeping baked markup as the code block), and LiveResponseBody only renders after a
// user-triggered Try-it response, which is also post-mount.
function jsonTreeComponent() {
  const get = typeof globalThis !== 'undefined' && globalThis.__aardvarkComponent;
  return typeof get === 'function' ? (get('JsonTree') || null) : null;
}

// Props for API response JsonTrees. maxDepth: 2 auto-expands the first couple of levels
// (the upstream default, set explicitly) so the example's shape reads at a glance while deeper
// nodes start collapsed — the toolbar's expand/collapse-all (withExpandAll) opens the rest, and
// maxHeight caps the height so a large body scrolls inside the sticky rail instead of pushing it
// off-screen. defaultExpanded must be on for ANY auto-expansion to happen (it gates the depth
// walk). The tree's withCopyAll/withCopyToClipboard replace the code block's Copy button;
// download (the code block's other action) is intentionally not carried over — copy-all covers
// the JSON, and a download button would clutter the viewer's own toolbar.
//
// styles.header: give the header a real toolbar look — a neutral code-surface background
// (--aardvark-code-bg, the same grey as a fenced code block, since the tree stands in for one) +
// a bottom divider, compact padding — so it reads as a control strip with the buttons docked right
// and the `response` tree starting immediately beneath it. (The toolbar's single-row layout is
// handled globally in the JsonTree wrapper, so every {% jsontree %} gets it too.)
const JSON_TREE_PROPS = {
  defaultExpanded: true,
  maxDepth: 2,
  withExpandAll: true,
  withCopyAll: true,
  withCopyToClipboard: true,
  showIndentGuides: true,
  showItemsCount: true,
  withBorder: true,
  size: 'sm',
  maxHeight: 480,
  rootName: 'response',
  styles: {
    header: {
      background: 'var(--aardvark-code-bg)',
      borderBottom: '1px solid var(--aardvark-border)',
      padding: '6px 10px',
    },
  },
};

// The right-rail "Response examples": the example body for the selected status. Sits
// beneath the request samples so the rail mirrors the request/response pair; the status is
// chosen from a dropdown (status-dot icons) rather than a wrapping tab strip. Per operation
// — the codes vary — so the picker only shows when more than one example exists.
//
// A JSON object/array example renders through the interactive JsonTree (collapsible, copyable —
// easy to explore); a scalar / non-JSON / unparseable example, or any project without the
// JsonTree community package, falls back to the flat highlighted code block. The upgrade happens
// only AFTER mount: the server-rendered (and first client) markup is always the code block — so
// hydration matches even though the community JsonTree island isn't in the SSR registry — then
// the tree wires up on the client.
//
// Trade-off: because the tree can't be SSR-prerendered here, this swaps the code block for the
// tree once, post-hydration — a one-time reflow of this rail panel on load (the two have similar
// but not identical heights). We accept it: it's the only mismatch-free option (rendering the
// tree on the first client render would diverge from the code-block SSR markup), it fires once,
// and it's confined to the rail panel, not the document flow.
function ResponseExamples({ items, variantKeys }) {
  const hasExample = (item) => item.example || (item.variants && item.variants.some((variant) => variant.example));
  const withEx = items.filter(hasExample);
  // Default to the response the docs column opens (ResponsesDocs' firstSuccess — the first 2xx,
  // else the first item) when it has an example, else the first 2xx with an example, else the
  // first example — so the rail and the left column never show different status codes on first
  // render.
  const defaultCode = () => {
    const firstSuccess = firstSuccessItem(items);
    const pick = (firstSuccess && hasExample(firstSuccess)) ? firstSuccess
      : firstSuccessItem(withEx);
    return pick ? pick.code : null;
  };
  const [code, setCode] = useState(defaultCode);
  // Re-validate the selection if items change (e.g. a vark-dev hot-reload swaps the spec under
  // the same op key): drop a code that no longer exists, falling back to the same default.
  const codeKey = withEx.map((it) => it.code).join('|');
  useEffect(() => {
    setCode((cur) => (withEx.some((it) => it.code === cur) ? cur : defaultCode()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeKey]);
  // Client-only upgrade to the tree: false on the server and the first client render (so both
  // emit the code block and hydration matches), flipped on after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!withEx.length) return null;
  const current = withEx.find((it) => it.code === code) || withEx[0];
  const ex = selectedResponseExample(current, variantKeys);
  const JsonTree = mounted ? jsonTreeComponent() : null;
  return (
    <div className="aardvark-api-rail-panel">
      <Group justify="space-between" align="center" wrap="nowrap" mb={6}>
        <Text size="sm" fw={600}>Response examples</Text>
        {withEx.length > 1 && (
          <StatusPicker codes={withEx.map((it) => it.code)} value={current.code} onChange={setCode} />
        )}
      </Group>
      {ex
        ? (JsonTree && exampleIsTree(ex.value)
          ? <JsonTree data={ex.value} {...JSON_TREE_PROPS} />
          : <CodeBlock text={ex.text} lang={looksJson(ex.text) ? 'json' : ''} />)
        : <Text size="xs" c="dimmed">No example for this variant.</Text>}
    </div>
  );
}

// A reader pastes their key once; it feeds every operation's samples and Try-it.
// Kept in memory for the session, or saved to sessionStorage (cleared when the tab
// closes) when "remember" is on.
function AuthPanel({ scheme, apiKey, onKeyChange, remember, onRememberChange, savedExists, autoFocus = false }) {
  // Render only when an operation actually requires auth. `scheme` is the one
  // schemeForOp resolves (respecting `security` order), or null when nothing applies
  // (e.g. a top-level `security: []`), in which case a typed key would never be sent.
  if (!scheme) return null;
  // Known limitation: with multiple schemes we render a single key field, for this
  // resolved scheme; schemeForOp/authApply still apply the right scheme per operation,
  // but there's no second field for a different non-primary scheme.
  const isBasic = isBasicScheme(scheme);
  const fallbackDesc = isBasic
    ? 'Sent as a Basic auth credential with each request.'
    : (scheme.type || '').toLowerCase() === 'apikey'
      ? `Sent as an API key ${scheme.in === 'query' ? 'query parameter' : scheme.in === 'cookie' ? 'cookie' : 'header'} with each request.`
      : 'Sent as a bearer token with each request.';
  const isCookie = isCookieScheme(scheme);
  // The description renders inline in a sentence-flow note (mixed with generated context), so like the
  // Try-it form fields this slot is a plain string: when the build wrote an html key the description
  // went through the {% %}+Markdown pass — use its tag-stripped text (never the raw `{% … %}` source);
  // a plain description (no html key) is shown verbatim; nothing falls back to the generic note.
  const schemeDesc = typeof scheme['x-aardvark-description-html'] === 'string'
    ? (scheme['x-aardvark-description-text'] || '')
    : (scheme.description || '');
  return (
    <Paper withBorder radius="md" p="md">
      <Text fw={600} size="sm" mb={6}>Authorization</Text>
      <PasswordInput
        label={isBasic ? 'Credentials' : 'API key'}
        placeholder={isBasic ? 'username:password' : 'Paste your API key'}
        value={apiKey}
        onChange={(e) => onKeyChange(e.currentTarget.value)}
        autoFocus={autoFocus}
      />
      <Checkbox
        mt="sm"
        size="sm"
        label="Remember this key for this session"
        checked={remember}
        onChange={(e) => onRememberChange(e.currentTarget.checked)}
      />
      <Text size="xs" c="dimmed" mt={6}>
        {schemeDesc || fallbackDesc}{' '}
        Used in the request samples and Try it now below.{' '}
        {remember
          ? 'Remembered for this browser session — cleared when you close the tab.'
          : 'Held in memory for this session only.'}
      </Text>
      {savedExists && !apiKey && (
        <Text size="xs" c="dimmed" mt={4}>
          A key is remembered for this session — uncheck the box above to remove it.
        </Text>
      )}
      {isCookie && (
        <Text size="xs" c="dimmed" mt={4}>
          Try it now can't set cookies from the browser — use the generated request samples instead.
        </Text>
      )}
    </Paper>
  );
}

// Scroll-spy: track which operation section is in view so the left nav can
// highlight it. Client-only — IntersectionObserver doesn't run during the SSR
// prerender, and the first render just returns the first id, matching the server.
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] || null);
  const key = ids.join('|');
  // Drop a stale active id when the id list itself changes (e.g. the nav is rebuilt on a
  // vark-dev hot-reload) so the highlight can't point at a section that no longer exists
  // until the observer's first frame.
  useEffect(() => {
    setActive((cur) => (ids.includes(cur) ? cur : ids[0] || null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  // IntersectionObserver bakes rootMargin at construction — it can't be updated live. The sticky
  // inset can change after a responsive breakpoint (e.g. the tab bar hides) or via a themed
  // --aardvark-header-h, which would drift the activation band from where scrollToAnchor lands.
  // Track it in state (synced on resize) so the observer effect below rebuilds when it changes.
  const [inset, setInset] = useState(() => (typeof window === 'undefined' ? 8 : stickyOffset(8)));
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const sync = () => setInset((cur) => { const next = stickyOffset(8); return next === cur ? cur : next; });
    sync();
    window.addEventListener('resize', sync, { passive: true });
    return () => window.removeEventListener('resize', sync);
  }, []);
  // IntersectionObserver only reports entries whose intersection CHANGED this frame, so
  // the batch alone can't tell us the topmost visible section — an already-visible one
  // above a newly-entering one won't be in it. Keep the full set of currently-visible
  // ids and always activate the topmost (els are in document order).
  const visibleRef = useRef([]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    visibleRef.current = [];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = visibleRef.current.indexOf(e.target.id);
          if (e.isIntersecting && i === -1) visibleRef.current.push(e.target.id);
          else if (!e.isIntersecting && i !== -1) visibleRef.current.splice(i, 1);
        });
        const topmost = els.find((el) => visibleRef.current.includes(el.id));
        if (topmost) setActive(topmost.id);
      },
      // Top inset tracks the themed sticky header (like scrollToAnchor), not a fixed 120px,
      // so the active section matches where a click lands. Bottom -60% keeps the band near
      // the top of the viewport. `inset` is recomputed on resize, rebuilding the observer.
      { rootMargin: `-${inset}px 0px -60% 0px`, threshold: 0 },
    );
    // Note: the op sections use content-visibility: auto, so a section the reader hasn't scrolled
    // near yet reports its contain-intrinsic-size estimate (not its real height) to the observer.
    // On a fast FIRST scroll through a very long spec the active highlight can lag/lead by one
    // until each section renders and the browser caches its real size (`auto`) — transient and
    // self-correcting; first place to look if scroll-spy is ever reported flaky on long specs.
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, inset]);
  return active;
}

// The sticky-header offset (header + tab bar), read live so it tracks themed heights.
// Number.isNaN guard, not `|| fallback`, so an explicit 0 (a theme with no sticky header,
// --aardvark-header-h: 0) stays 0. Used by useScrollSpy's observer rootMargin so the activation
// threshold sits just below the sticky chrome; `gap` is the breathing room below the bar.
function stickyOffset(gap) {
  const cs = getComputedStyle(document.documentElement);
  const px = (name, fallback) => {
    const v = parseInt(cs.getPropertyValue(name), 10);
    return Number.isNaN(v) ? fallback : v;
  };
  return px('--aardvark-header-h', 56) + px('--aardvark-tabbar-h', 0) + gap;
}

// Operation sections use content-visibility:auto so large API references don't eagerly layout every
// operation. Before programmatic anchor scrolling, reveal the skipped operation blocks up to the target:
// otherwise the browser may compute the target's position from contain-intrinsic-size estimates, land a
// little short, then fix itself only after a second click once those sections have been laid out.
function prepareAnchorScrollTarget(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const root = el.closest('.aardvark-api-main') || el.closest('.aardvark-api') || document;
  const targetOp = el.closest('.aardvark-api-op');
  const ops = Array.from(root.querySelectorAll('.aardvark-api-op'));
  const lastOp = ops.length ? ops[ops.length - 1] : null;
  if (!targetOp && lastOp && (lastOp.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) {
    return el;
  }
  const revealed = [];
  for (const op of ops) {
    const position = op.compareDocumentPosition(el);
    if (op !== targetOp && !(position & Node.DOCUMENT_POSITION_FOLLOWING)) break;
    revealed.push([op, op.style.contentVisibility]);
    op.style.contentVisibility = 'visible';
    if (op === targetOp) break;
  }
  if (revealed.length) {
    try {
      // Force layout once, before scrollIntoView asks for the target's final position.
      el.getBoundingClientRect();
    } finally {
      revealed.forEach(([op, previous]) => {
        op.style.contentVisibility = previous;
      });
    }
  }
  return el;
}

// Smooth-scroll an anchor target into view. Each target — the op-title heading (.aardvark-api-op-title,
// which carries the id) plus the intro/auth anchors — has scroll-margin-top: var(--aardvark-api-sticky),
// so scrollIntoView lands it just below the sticky header natively. The op sections scroll with the
// document (the sidebar is a separate scroller, not an ancestor), so scrollIntoView moves the page, not a
// nested container.
function scrollToAnchor(id) {
  const el = prepareAnchorScrollTarget(id);
  if (!el) return false;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  return true;
}

function scrollToAnchorWhenReady(id, scrollScope) {
  const scope = scrollScope || { current: 0 };
  const generation = ++scope.current;
  const maxRetries = 12;
  const retryDelay = 50;
  const run = (attempt) => {
    if (generation !== scope.current) return;
    if (scrollToAnchor(id)) return;
    if (attempt >= maxRetries) {
      // Hashes can be stale or renamed. Keep this observable for debugging without making
      // ordinary readers act on a warning they cannot fix.
      console.debug(`Aardvark: anchor #${id} was not mounted; scroll skipped`);
      return;
    }
    const schedule = attempt === 0 && typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb) => window.setTimeout(cb, retryDelay);
    schedule(() => run(attempt + 1));
  };
  run(0);
}

// The operation navigation lives in the site's own left sidebar, not in this island:
// the {% openapi %} build step emits one nav link per operation (grouped by tag) under
// the page's title, each tagged data-aardvark-op="<anchor>" (the build's OpenAPI parser
// and its sidebar renderer). useSidebarSpy (below) keeps the in-view operation highlighted there
// and upgrades clicks on those links to a header-offset smooth scroll.
function useSidebarSpy(activeId, scrollScope, enabled = true) {
  // Highlight the in-view operation's sidebar link as the reader scrolls. Once a specific
  // operation is active, suppress the parent page link's own highlight so only the
  // more-specific node is lit — the page link stays bold via its active-trail, reading as a
  // section header rather than a second selection. Restore it when no op is active (reader's
  // at the page top). The cleanup only clears the op-link classes (so an in-page unmount
  // leaves no stale op highlight); it deliberately does NOT re-add pageLink — the effect
  // body's toggle already left it correct on the last run, and re-adding it here would flash
  // the parent active for a frame, since cleanup runs before EVERY re-run (concurrent React
  // can paint between cleanup and the next effect), not only on unmount.
  useEffect(() => {
    if (!enabled) return undefined;
    const links = document.querySelectorAll('.aardvark-sidebar a[data-aardvark-op]');
    const li = (a) => a.closest('.aardvark-nav-item');
    let opActive = false;
    links.forEach((a) => {
      const on = a.getAttribute('data-aardvark-op') === activeId;
      if (on) opActive = true;
      const el = li(a);
      if (el) el.classList.toggle('aardvark-active', on);
      // aria-current carries the in-view operation to assistive tech (the class is visual-only):
      // accessibility.md says this state is announced, not just shown with color. "location" = the
      // reader's current position within the page.
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    // Every op-link in the sidebar belongs to the API page's own branch — the build's sidebar
    // renderer grafts the operation anchors only onto the active page's node, so they never
    // span branches. Prefer the active op's link, falling back to the first, so the page link is
    // still located (and lit, below) at the page top where no specific op is active.
    const refLink = (activeId && Array.from(links).find((a) => a.getAttribute('data-aardvark-op') === activeId)) || (links.length ? links[0] : null);
    const branch = refLink && refLink.closest('.aardvark-nav-branch');
    const pageLink = branch && branch.querySelector(':scope > .aardvark-nav-branch-row > .aardvark-nav-branch-link');
    if (pageLink) pageLink.classList.toggle('aardvark-active', !opActive);
    return () => {
      links.forEach((a) => {
        const el = li(a);
        if (el) el.classList.remove('aardvark-active');
        a.removeAttribute('aria-current');
      });
    };
  }, [activeId, enabled]);

  // Smooth-scroll (with the sticky-header offset) when a sidebar operation link is clicked,
  // instead of the browser's instant jump. Delegated on `document` (not the .aardvark-sidebar
  // node) so it survives the sidebar being re-rendered after hydration, and it's a single
  // listener rather than one per element. nav.js never intercepts link clicks, so this is the
  // only handler on them.
  useEffect(() => {
    if (!enabled) return undefined;
    const onClick = (e) => handleSidebarOpClick(e, scrollScope);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [scrollScope, enabled]);

  // Deep links + history navigation. This island renders client-side, so the browser's native
  // scroll-to-hash on load fires before the target section exists, and an entry restored via Back/Forward
  // doesn't re-run the click handler. Scroll to the hash's operation on mount (so a shared `/api/#op-…` link
  // lands on it) and on popstate (so Back/Forward return there). popstate — NOT hashchange — fires only on
  // history navigation, never on a fresh click, so a native heading-permalink click isn't double-scrolled.
  useEffect(() => {
    if (!enabled) return undefined;
    const toHash = () => {
      const raw = (window.location.hash || '').slice(1);
      // decodeURIComponent throws on a malformed percent-escape (a hand-pasted/garbled URL). This runs on
      // mount, so an unguarded throw would break the island — fall back to the raw hash (our ids are
      // alphanumeric/`-`, so they don't need decoding anyway; decode only helps an oddly-encoded one).
      let id;
      try { id = decodeURIComponent(raw); } catch { id = raw; }
      if (id) scrollToAnchorWhenReady(id, scrollScope);
    };
    toHash();
    window.addEventListener('popstate', toHash);
    return () => window.removeEventListener('popstate', toHash);
  }, [scrollScope, enabled]);
}

function handleSidebarOpClick(e, scrollScope) {
  // A click target is normally the Element clicked, but in rare cases (some synthetic dispatches, or a
  // selection-driven event) it can be a Text node, which has no .closest(). Guard so a stray click
  // ANYWHERE on the page can't throw here — an uncaught throw in this document-level listener would
  // kill operation-link navigation for the rest of the session.
  if (!(e.target instanceof Element)) return;
  const a = e.target.closest('a[data-aardvark-op]');
  if (!a || !a.closest('.aardvark-sidebar')) return;
  const id = a.getAttribute('data-aardvark-op');
  if (!id) return;
  e.preventDefault();
  scrollToAnchorWhenReady(id, scrollScope);
  // preventDefault() suppressed the browser's native hash navigation, which would also have updated
  // the address bar — so do it ourselves. pushState (not a re-navigation) updates the URL + adds a
  // history entry, exactly like a native `#anchor` click, WITHOUT a second instant jump that would
  // fight the smooth scroll above. (A bare `location.hash = id` WOULD re-jump; pushState doesn't.)
  history.pushState(null, '', '#' + id);
}

function ApiTagSection({ group, children, anchorPrefix = '' }) {
  const anchor = prefixedAnchor(anchorPrefix, tagAnchor(group.tag));
  return (
    <section className="aardvark-api-tag-section" aria-labelledby={anchor}>
      <h2 className="aardvark-api-tag-title" id={anchor}>
        {group.label}
        <a className="aardvark-heading-anchor" href={`#${anchor}`} aria-label={`Permalink to ${group.label}`}>
          <IconLink stroke={2} aria-hidden="true" />
        </a>
      </h2>
      {children}
    </section>
  );
}

// The request-sample language, shared by every operation's rail and remembered.
// Restored in an effect (client-only) so the SSR/first render stays 'curl' and
// hydration matches — same pattern as the saved API key in ApiReference.
function useSampleLanguage() {
  const [lang, setLang] = useState('curl');
  useEffect(() => {
    let saved = null;
    try { saved = window.localStorage.getItem(LANG_STORAGE_KEY); } catch (e) { /* unavailable */ }
    if (saved && LANGUAGES.some((l) => l.value === saved)) setLang(saved);
  }, []);
  const changeLang = useCallback((next) => {
    setLang(next);
    try { window.localStorage.setItem(LANG_STORAGE_KEY, next); } catch (e) { /* unavailable */ }
  }, []);
  // Memo the context value, not just changeLang: a bare `{ lang, setLang }` literal is a
  // fresh reference every render, so consumers (CodeSamples) would re-render regardless.
  const langValue = useMemo(() => ({ lang, setLang: changeLang }), [lang, changeLang]);
  return langValue;
}

export default function ApiReference({
  spec,
  sortable = true,
  filterable = true,
  anchorPrefix = '',
  sidebarNav = true,
}) {
  const groups = useMemo(() => operationGroups(spec || {}), [spec]);
  const ops = useMemo(() => groups.flatMap((group) => group.ops), [groups]);
  const info = (spec && spec.info) || {};
  // The scheme actually applied to the operations — resolved via schemeForOp, so it
  // respects each operation's `security` (and the requirement order within it), and
  // is null when nothing applies (e.g. a top-level `security: []`). Drives the
  // panel's label/description and whether it shows.
  const primaryScheme = useMemo(() => {
    let fallback = null;
    for (const { op } of ops) {
      const s = schemeForOp(spec, op);
      if (!s) continue;
      if (!fallback) fallback = s;
      if (!isCookieScheme(s)) return s;
    }
    return fallback;
  }, [ops, spec]);
  const storageKey = storageKeyFor(spec);
  const [apiKey, setApiKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [authPromptScheme, setAuthPromptScheme] = useState(null);
  // Whether a key currently sits in storage — lets AuthPanel hint that a saved key
  // persists even when the field is blank (cleared mid-session).
  const [savedExists, setSavedExists] = useState(false);
  const scrollScope = useRef(0);

  // Restore a key the reader chose to save. Client-only: effects don't run during
  // the SSR prerender, so the first render still matches the server (no key) and
  // hydration stays clean.
  useEffect(() => {
    let saved = null;
    try { saved = window.sessionStorage.getItem(storageKey); } catch (e) { /* unavailable */ }
    if (!saved) {
      // One-time migration for readers who saved a key under the old localStorage code: adopt it
      // for this session, then scrub it from localStorage so the clear-text exposure the
      // sessionStorage switch removed doesn't linger for existing users (and they don't silently
      // lose their saved key on the first visit after the change).
      try {
        const legacy = window.localStorage.getItem(storageKey);
        if (legacy) {
          // Carry the key into sessionStorage (best-effort) so it survives reloads this session,
          // then scrub the localStorage copy. This one-time migration write is the deliberate
          // exception to the "never persist from the restore effect" rule below: sessionStorage is
          // empty here, so there's no saved value to race with. Only scrub localStorage once the
          // key is safely in sessionStorage — if that write throws (storage blocked), keep the
          // localStorage copy rather than destroying the reader's saved key.
          let migrated = false;
          try { window.sessionStorage.setItem(storageKey, legacy); migrated = true; } catch (e) { /* unavailable */ }
          if (migrated) window.localStorage.removeItem(storageKey);
          saved = legacy;
        }
      } catch (e) { /* localStorage unavailable */ }
    }
    if (saved) {
      setApiKey(saved);
      setRemember(true);
      setSavedExists(true);
    }
  }, [storageKey]);

  // Persist only on user action (typing the key, toggling the box) — never from the
  // restore above — so there's no effect-ordering race that could wipe the saved key.
  function store(key, keep) {
    try {
      const action = storageAction(key, keep);
      if (action === 'set') { window.sessionStorage.setItem(storageKey, key); setSavedExists(true); }
      else if (action === 'remove') { window.sessionStorage.removeItem(storageKey); setSavedExists(false); }
      // action === 'none' (field cleared, remember still on): leave storage as-is.
    } catch (e) { /* sessionStorage unavailable */ }
  }
  function changeKey(next) {
    setApiKey(next);
    store(next, remember);
  }
  function changeRemember(next) {
    setRemember(next);
    store(apiKey, next);
  }
  const openAuthPrompt = useCallback((scheme) => {
    if (scheme) setAuthPromptScheme(scheme);
  }, []);

  const langValue = useSampleLanguage();

  const base = baseUrl(spec);
  // The anchor ids the left nav links to and the scroll-spy watches: Overview,
  // Authorization (only when an operation needs it), then one per operation.
  const navIds = useMemo(() => {
    const ids = [prefixedAnchor(anchorPrefix, 'aardvark-api-overview')];
    if (primaryScheme) ids.push(prefixedAnchor(anchorPrefix, 'aardvark-api-auth'));
    ops.forEach(({ method, path }) => ids.push(prefixedAnchor(anchorPrefix, opAnchor(method, path))));
    return ids;
  }, [anchorPrefix, ops, primaryScheme]);
  // Hooks remain unconditional (SSR/hydration order stays stable), but an agent-only hidden copy
  // passes sidebarNav=false so it neither observes canonical sidebar ids nor installs document-level
  // click/history behavior. Its own DOM ids still use navIds for internal consistency.
  const activeId = useScrollSpy(sidebarNav ? navIds : []);
  useSidebarSpy(activeId, scrollScope, sidebarNav);

  return (
    <TableSortContext.Provider value={sortable}>
      <TableFilterContext.Provider value={filterable}>
        <div className="aardvark-api">
          <div className="aardvark-api-main">
            <header
              className="aardvark-api-intro"
              id={prefixedAnchor(anchorPrefix, 'aardvark-api-overview')}
            >
              <div className="aardvark-api-titlerow">
                <Title order={1}>{info.title || 'API Reference'}</Title>
                {info.version && <Badge variant="light" size="lg">v{info.version}</Badge>}
              </div>
              <Prose html={info['x-aardvark-description-html']} text={info['x-aardvark-description-text'] ?? info.description} c="dimmed" mt="xs" />
              {base && (
                <div className="aardvark-api-endpoint aardvark-api-endpoint-baseline">
                  <span className="aardvark-api-baselabel">Base URL</span>
                  <code className="aardvark-api-endpoint-url">{base}</code>
                </div>
              )}
            </header>
            {primaryScheme && (
              <div id={prefixedAnchor(anchorPrefix, 'aardvark-api-auth')}>
                <AuthPanel
                  scheme={primaryScheme}
                  apiKey={apiKey}
                  onKeyChange={changeKey}
                  remember={remember}
                  onRememberChange={changeRemember}
                  savedExists={savedExists}
                />
              </div>
            )}
            <Modal
              opened={!!authPromptScheme}
              onClose={() => setAuthPromptScheme(null)}
              centered
              size="md"
              title={<VisuallyHidden>Authorization</VisuallyHidden>}
              withCloseButton
              closeButtonProps={{ 'aria-label': 'Close authorization modal' }}
            >
              <AuthPanel
                scheme={authPromptScheme}
                apiKey={apiKey}
                onKeyChange={changeKey}
                remember={remember}
                onRememberChange={changeRemember}
                savedExists={savedExists}
                autoFocus
              />
            </Modal>
            <LangContext.Provider value={langValue}>
              {groups.map((group) => {
                const sections = group.ops.map(({ path, method, op }) => (
                  <OperationSection
                    key={`${method}-${path}`}
                    spec={spec}
                    path={path}
                    method={method}
                    op={op}
                    apiKey={apiKey}
                    base={base}
                    onAuthNeeded={openAuthPrompt}
                    anchorPrefix={anchorPrefix}
                  />
                ));
                return (
                  <ApiTagSection
                    key={tagSectionKey(group.tag)}
                    group={group}
                    anchorPrefix={anchorPrefix}
                  >
                    {sections}
                  </ApiTagSection>
                );
              })}
            </LangContext.Provider>
          </div>
        </div>
      </TableFilterContext.Provider>
    </TableSortContext.Provider>
  );
}

// Named exports of the pure, dependency-free helpers, for unit testing.
// The islands build imports only the default export above, so esbuild tree-shakes
// these out of the bundle — they don't affect shipped output.
export {
  slugify,
  opAnchor,
  tagAnchor,
  tagSectionKey,
  prepareAnchorScrollTarget,
  handleSidebarOpClick,
  scrollToAnchorWhenReady,
  tagDisplayLabel,
  rowMatchesFilter,
  operationGroups,
  collectOperations,
  storageAction,
  storageKeyFor,
  securitySchemes,
  isCookieScheme,
  schemeForOp,
  tryItAvailability,
  authApply,
  resolvedParams,
  sampleParamValue,
  schemaToRows,
  flattenAllOf,
  boundedIntersectionSummary,
  schemaVariants,
  constraintUnion,
  constraintUnionNote,
  requestBodyVariants,
  responseExample,
  exampleIsTree,
  DottedName,
  requestBodyExample,
  initialRawBody,
  bodyFields,
  initialBodyValues,
  assembleBody,
  bodySerialization,
  serializeRequestBody,
  decodeFormBody,
  bodyContentTypeHeader,
  liveRequestBody,
  rawBodyLabel,
  SAMPLE_MULTIPART_BOUNDARY,
  methodHasBody,
  buildRequest,
  reindent,
  shQuote,
  phpQuote,
  pyLiteral,
  rustString,
  genCurl,
  genPython,
  genJavaScript,
  genGo,
  genPHP,
  genRust,
  tokenizeCode,
  highlightHtml,
  looksJson,
  parseJsonResponseText,
  extForLang,
};
