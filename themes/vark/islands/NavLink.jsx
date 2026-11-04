import { forwardRef } from 'react';
import { NavLink as MantineNavLink } from '@mantine/core';
import { classifyIcon, sanitizeSvg, LazyTablerIcon } from '@aardvark/islands/tabler-icons';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// The island behind the built-in {% navlink %} tag (navlink.md). It needs to be an
// island (not a pure macro) for two reasons Mantine's props channel can't carry from
// build-time Python:
//   1. leftSection / rightSection are React nodes — an icon spec (Tabler name, FA
//      class, image path, emoji, inline <svg>) has to be resolved to a glyph element
//      here, exactly as Icon does.
//   2. NavLink nests: a parent NavLink renders child NavLinks as its children. The
//      macro passes a plain `items` array of {label, href, ...} descriptors (one level
//      of nesting), which we map to nested <MantineNavLink> here. We can't reuse the React
//      `children` slot for that — snippet()/component() consume `children=` as the
//      block-body string, so the nested data rides its own `items` prop.
//
// Every documentable prop (label, description, active, variant, color, childrenOffset,
// disabled, defaultOpened, href, noWrap, autoContrast) flows straight through. Only the
// uncontrolled `defaultOpened` is supported (not the controlled `opened`) — the macro
// can't supply the onChange a controlled NavLink needs.

// Resolve an icon spec string to a glyph node (no wrapper), mirroring Icon's
// glyphFor — a bare Tabler name, a Font Awesome class, an image path/URL, an emoji, or
// inline <svg>. `iconCdn` is the Tabler CDN base the macro injects (see navlink.md), with
// LazyTablerIcon's pinned default as a safety fallback. Returns null for an
// empty/unrecognized/blocked spec.
function glyphFor(icon, iconCdn) {
  const value = typeof icon === 'string' ? icon.trim() : '';
  switch (classifyIcon(value)) {
    case 'svg': {
      const safe = sanitizeSvg(value);
      return safe ? <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: safe }} /> : null;
    }
    case 'image': {
      const src = sanitizeHref(value);
      return src ? <img src={src} alt="" width={20} height={20} /> : null;
    }
    case 'emoji':
      return <span aria-hidden="true">{value}</span>;
    case 'fa':
      return <i className={value} aria-hidden="true" />;
    case 'tabler':
      return <LazyTablerIcon name={value} iconCdn={iconCdn} style="outline" />;
    default:
      return null;
  }
}

// Build a single <MantineNavLink> from a plain descriptor, recursing into its `items` array
// (the nested sub-links) one level. Shared by the top-level island and every nested
// entry, so the full prop surface stays available at any depth. `ref` is only passed for
// the top-level call (Mantine forwards it to the root <a>/<button> so attr={...} lands).
function renderNavLink(it, key, iconCdn, ref) {
  const {
    label,
    description,
    href,
    leftSection,
    rightSection,
    active,
    variant,
    color,
    childrenOffset,
    disabled,
    defaultOpened,
    noWrap,
    autoContrast,
    items,
  } = it || {};
  // Author hrefs are sanitized (whitelist: http(s) + relative paths) just like every
  // other island that renders an author href — sanitizeHref rejects javascript:/data:/…,
  // which React would otherwise pass through verbatim (a stored-XSS surface).
  const safeHref = href ? sanitizeHref(href) : undefined;
  const left = leftSection ? glyphFor(leftSection, iconCdn) : undefined;
  const right = rightSection ? glyphFor(rightSection, iconCdn) : undefined;
  return (
    <MantineNavLink
      key={key}
      ref={ref}
      label={label}
      description={description || undefined}
      href={safeHref || undefined}
      component={safeHref ? 'a' : undefined}
      leftSection={left || undefined}
      rightSection={right || undefined}
      active={active || undefined}
      variant={variant || undefined}
      color={color || undefined}
      childrenOffset={childrenOffset != null ? childrenOffset : undefined}
      disabled={disabled || undefined}
      defaultOpened={defaultOpened || undefined}
      noWrap={noWrap || undefined}
      autoContrast={autoContrast || undefined}
    >
      {Array.isArray(items) && items.length > 0
        ? items.map((child, i) => renderNavLink(child, i, iconCdn))
        : undefined}
    </MantineNavLink>
  );
}

const NavLink = forwardRef(function NavLink({ iconCdn, ...descriptor }, ref) {
  return renderNavLink(descriptor, undefined, iconCdn, ref);
});

export default NavLink;
