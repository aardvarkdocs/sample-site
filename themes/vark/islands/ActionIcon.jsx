/* @aardvark-island {"urlProps": ["href", "icon"], "iconImageProps": ["icon"]} */
import { forwardRef } from 'react';
import { ActionIcon as MantineActionIcon } from '@mantine/core';
import { iconGlyph } from './_iconGlyph';
import './ActionIcon.css';

// The island behind the built-in {% actionicon %} tag (actionicon.md).
// Mantine's ActionIcon needs an icon child that is a React node, which can't ride the JSON props
// channel of component('ActionIcon', ...) — so the icon-spec -> node resolution lives here (shared
// with CloseButton via _iconGlyph.jsx). Every other prop (variant / color / size / radius / loading
// / disabled / gradient / autoContrast) passes straight through to Mantine.
//
// forwardRef so `attr={...}` reaches the rendered root DOM node — Mantine's ActionIcon forwards the
// ref to its own <button>/<a> root. Mirrors the snippets/*.jsx convention.
const ActionIcon = forwardRef(function ActionIcon(
  { icon, iconCdn, filled, label, gradient, children, ...rest },
  ref,
) {
  const glyph = iconGlyph(icon, { iconCdn, filled, where: 'actionicon' });
  // A label is the accessible name (an icon-only button is otherwise unnamed for screen readers).
  const a11y = label ? { 'aria-label': label } : {};
  return (
    <MantineActionIcon
      ref={ref}
      {...rest}
      {...(gradient ? { gradient } : {})}
      {...a11y}
    >
      {glyph ?? children}
    </MantineActionIcon>
  );
});

export default ActionIcon;
