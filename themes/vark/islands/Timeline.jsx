import { forwardRef } from 'react';
import { Timeline as MantineTimeline } from '@mantine/core';
import { bulletNode } from '@aardvark/islands/tabler-icons';
import './Timeline.css';

// The island behind the built-in {% timeline %} tag (timeline.md). Mantine's Timeline is a
// compound component (Timeline + MantineTimeline.Item), and a MantineTimeline.Item's
// `bullet`/`title`/body are React nodes — none of which can ride the JSON props channel of
// component('Timeline', ...). So the macro hands us a plain `items` array (each {title,
// content, bullet, color, lineVariant}) parsed from a JSON string param, and this wrapper
// builds the real MantineTimeline.Item tree.
//
// Every Timeline-level prop (active, bulletSize, lineWidth, color, align, radius,
// reverseActive, autoContrast, …) flows straight through via {...rest}, so the full
// Mantine Timeline API stays available from the tag.
//
// `bullet` is best-effort: a bare lowercase token that looks like a Tabler icon name
// renders the lazily-fetched Tabler glyph (LazyTablerIcon, the same source the {% icon %}
// and {% card %} tags use); anything else (a number, an emoji, short text) renders as-is,
// and an empty bullet falls back to Mantine's default dot.
//
// SSR note: Timeline is a pure render; the only client-only piece is a Tabler bullet's
// lazily-fetched glyph (LazyTablerIcon bakes a reserved empty box that the client fills on
// mount), so the build-time prerenderer (renderToString) bakes everything else
// verbatim — no flash, nothing to measure — and the client hydrateRoots that markup (falling back
// to createRoot only when the island wasn't prerendered).

// The bullet-spec -> node mapping is shared with {% update %} via `bulletNode` in
// @aardvark/islands/tabler-icons (a bare Tabler-style token becomes a lazily-loaded glyph; an emoji / number /
// short label renders verbatim; empty falls back to Mantine's default dot). We pass our own
// glyph className so the two islands aren't coupled to one another's CSS.

// forwardRef so `attr={...}` reaches the rendered Timeline root (Mantine forwards the ref
// to its own root). Mirrors the snippets/*.jsx convention.
const Timeline = forwardRef(function Timeline({ items = [], iconCdn, ...rest }, ref) {
  const list = Array.isArray(items) ? items : [];
  return (
    <MantineTimeline ref={ref} data-aardvark-timeline="" {...rest}>
      {list.map((it, i) => (
        <MantineTimeline.Item
          key={i}
          title={it.title || undefined}
          bullet={bulletNode(it.bullet, iconCdn, 'aardvark-timeline-glyph')}
          color={it.color || undefined}
          lineVariant={it.lineVariant || undefined}
        >
          {it.content}
        </MantineTimeline.Item>
      ))}
    </MantineTimeline>
  );
});

export default Timeline;
