import { forwardRef } from 'react';
import { Blockquote as MantineBlockquote } from '@mantine/core';
import { tablerGlyph } from '@aardvark/islands/tabler-icons';

// The island behind the built-in {% blockquote %} tag
// (blockquote.md). Mantine's Blockquote takes an `icon` *React node*, which can't ride
// the JSON props channel of component('Blockquote', …), so the optional `icon` name ->
// node resolution lives here (mirroring how Callout.jsx owns its severity -> icon
// mapping).
//
// `icon` accepts a Tabler icon name (e.g. "quote", "info-circle"); it's fetched lazily
// at mount from the same CDN + cache the {% card %} / {% icon %} builtins use
// (@aardvark/islands/tabler-icons). An empty/absent icon renders Mantine's default (no icon). Every
// other prop (cite, color, radius, iconSize, the Mantine style system, …) flows straight
// through via {...rest}, so the full Blockquote API stays available.
//
// SSR note: LazyTablerIcon reserves a fixed box server-side and fills the glyph on the
// client after hydration (effects do not run under renderToString). The first client render
// must retain that empty box so it matches the baked markup.

const Blockquote = forwardRef(function Blockquote(
  { icon, iconCdn, children, ...rest },
  ref,
) {
  const iconNode = tablerGlyph(icon, iconCdn, 'aardvark-blockquote-glyph');
  return (
    <MantineBlockquote ref={ref} icon={iconNode} {...rest}>
      {children}
    </MantineBlockquote>
  );
});

export default Blockquote;
