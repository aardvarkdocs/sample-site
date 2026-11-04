import { forwardRef } from 'react';
import { Badge, Group, Text, Timeline } from '@mantine/core';
import { bulletNode } from '@aardvark/islands/tabler-icons';
import './Update.css';

// The island behind the built-in {% update %} block: one inline
// release-note / changelog entry rendered as a single timeline-rail row — a version/date label
// (with an optional dimmed sub-label and a badge cloud) on the left rail, the entry's Markdown
// body beside it (Mintlify's "Update").
//
// It's a Mantine Timeline with exactly ONE Item so the entry gets the bullet + connecting-line
// rail for free. Several {% update %}s in a row read as one continuous rail: each is its own
// island, but Update.css bridges the visual gap between adjacent entries so the line looks
// unbroken (a run of hand-authored release notes). This is DELIBERATELY decoupled from the
// {% changelog %} data path — it shares only the Timeline styling (the --tl-color accent), not
// the YAML/RSS/tag-filter machinery.
//
// Props (all from the {% update %} tag, via component('Update', ...)):
//   label       — the rail heading: a version or date (e.g. "v1.2.0", "2026-07-03"). Optional
//                 (an unlabelled entry just omits the heading).
//   description — an optional dimmed sub-label under the label (a date beneath a version, say).
//   tags        — an optional list of short labels rendered as a small badge cloud under the
//                 label. The Python side splits a comma-separated `tags=` string (or accepts a
//                 pre-split list) and dedupes, so this arrives as a clean array.
//   bullet      — an optional bullet glyph: a bare Tabler icon name renders the lazily-fetched
//                 glyph (the same source {% timeline %}/{% card %} use); anything else (emoji,
//                 short text) renders verbatim; unset falls back to Mantine's default dot.
//   iconCdn     — the Tabler-icons CDN base a bullet glyph is fetched from (injected only when a
//                 Tabler-style `bullet` is present, mirroring the card/timeline islands).
//   color       — an optional accent override for this entry's bullet + line (a Mantine color).
//   The Markdown body arrives as `children` (already rendered to HTML by the page's Markdown
//   pass and reparsed into React nodes by the islands runtime).
//
// SSR note: pure render; the only client-only piece is a lazily-fetched Tabler bullet glyph
// (LazyTablerIcon bakes a reserved empty box the client fills on mount), so the build-time
// prerenderer (renderToString) bakes everything else verbatim and the client
// hydrateRoots that markup (falling back to createRoot only when the island wasn't prerendered).

// The bullet-spec -> node mapping is shared with {% timeline %} via `bulletNode` in
// @aardvark/islands/tabler-icons (a bare Tabler-style token becomes a lazily-loaded glyph; an emoji / short
// label renders verbatim; empty/whitespace/bare-flag falls back to Mantine's default dot). We
// pass our own glyph className so the two islands aren't coupled to one another's CSS.

// forwardRef so `attr={...}` reaches the rendered island root — the ref rides to the wrapping
// <div> (Mantine's Timeline doesn't forward a ref to a plain DOM node, so we own the root here,
// matching Changelog.jsx). Mirrors the snippets/*.jsx convention.
const Update = forwardRef(function Update(
  { label, description, tags = [], bullet, iconCdn, color, children, ...rest },
  ref,
) {
  const tagList = Array.isArray(tags) ? tags : [];
  // The left-rail label column: the version/date heading, an optional dimmed sub-label, and an
  // optional badge cloud. Rendered as the Timeline.Item's `title` so it sits beside the bullet.
  const railLabel = (label || description || tagList.length > 0) && (
    <div className="aardvark-update-label">
      {label && (
        <Text component="span" fw={700} className="aardvark-update-version">
          {label}
        </Text>
      )}
      {description && (
        <Text size="sm" c="dimmed" className="aardvark-update-desc">
          {description}
        </Text>
      )}
      {tagList.length > 0 && (
        <Group gap={6} mt={4} className="aardvark-update-tags">
          {tagList.map((tag, i) => (
            // Key by index (not the tag value): tags may repeat, and duplicate React keys warn +
            // misreconcile. The Python side already dedupes, so this is belt-and-suspenders — and
            // matches how {% card %}'s badge cloud keys (Card.jsx).
            <Badge key={i} size="xs" radius="sm" variant="light">
              {tag}
            </Badge>
          ))}
        </Group>
      )}
    </div>
  );

  return (
    // `active={0}` fills this single bullet with the accent color (Mantine draws the connecting
    // line and an active bullet from --tl-color), so a standalone entry — and each entry in a
    // run — reads as a lit rail point rather than a hollow dot. Spread author props FIRST so a stray
    // attr can't clobber `data-aardvark-update`, which scopes Update.css (the label column layout +
    // the between-entry line bridge) — matching ApiField.jsx / Panel.jsx.
    <div ref={ref} {...rest} data-aardvark-update="">
      <Timeline active={0} bulletSize={18} lineWidth={2}>
        <Timeline.Item
          title={railLabel || undefined}
          bullet={bulletNode(bullet, iconCdn, 'aardvark-update-glyph')}
          color={color || undefined}
          className="aardvark-update-item"
        >
          <div className="aardvark-update-body">{children}</div>
        </Timeline.Item>
      </Timeline>
    </div>
  );
});

export default Update;
