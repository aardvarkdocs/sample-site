/* @aardvark-island {"urlProps": ["icon"], "iconImageProps": ["icon"]} */
import { forwardRef } from 'react';
import { CloseButton as MantineCloseButton } from '@mantine/core';
import { iconGlyph } from './_iconGlyph';
import './ActionIcon.css';

// The island behind the built-in {% closebutton %} tag (closebutton.md).
// Mantine's CloseButton renders an X by default; an optional `icon` overrides it with a custom glyph,
// which must be a React node — so the icon-spec -> node resolution lives here (shared with ActionIcon
// via _iconGlyph.jsx). size / radius / variant / disabled — and any other scalar prop (e.g.
// iconSize) — pass straight through to Mantine via ...rest.
//
// forwardRef so `attr={...}` reaches the rendered root DOM node (Mantine forwards the ref to its
// <button> root). Mirrors the snippets/*.jsx convention.
const CloseButton = forwardRef(function CloseButton({ icon, iconCdn, filled, label, ...rest }, ref) {
  // Only override the default X when an icon spec is given AND it resolves.
  const glyph = icon ? iconGlyph(icon, { iconCdn, filled, where: 'closebutton' }) : null;
  // Mantine's CloseButton sets NO aria-label, and a ✕ glyph is not text — so without one the
  // button reaches a screen reader unnamed. The macro defaults `label` to "Close" for the
  // {% closebutton %} tag, but a direct component('CloseButton', …) call bypasses the macro and
  // arrives with none, so the default belongs HERE too: this is the boundary both entry points
  // cross. An empty label is treated as an omitted one rather than as an opt-out: the glyph
  // supplies no text, so label="" would ship a focusable button announced with no name at all,
  // which is the very thing this default exists to prevent. BLANK counts as empty: "   " is
  // truthy in JS, but its computed accessible name is still empty, so it would slip that guard.
  // `a11y` is spread LAST so nothing can strip the name back off — which also means it would
  // overwrite an aria-label a direct caller passed through `rest`. Fall back to that before the
  // generic default, so <CloseButton aria-label="Remove item" /> keeps its own name; an explicit
  // `label` still wins, since that is the documented prop.
  //
  // `aria-labelledby` needs no such handling, and the default is deliberately NOT skipped when a
  // caller passes one — the default does not override it. Accname computes step 2B
  // (aria-labelledby, when it has at least one valid IDREF) BEFORE step 2C (aria-label), and 2C is
  // reached only "otherwise", so a valid labelledby always wins and the aria-label beside it is
  // inert. Skipping the default would instead REGRESS the case 2B rejects: a mistyped id, or a
  // target removed by a later render, drops through to 2C — and for a button whose only content is
  // a glyph there is nothing at 2F/2I to fall back on, so it would be announced as bare "button".
  // The redundant attribute is the cheap half of that trade. Pinned in islandInvariantsMount.
  const trimmed = (v) => (typeof v === 'string' ? v.trim() : v);
  const named = trimmed(label) || trimmed(rest['aria-label']);
  const a11y = { 'aria-label': named || 'Close' };
  return <MantineCloseButton ref={ref} {...rest} {...(glyph ? { icon: glyph } : {})} {...a11y} />;
});

export default CloseButton;
