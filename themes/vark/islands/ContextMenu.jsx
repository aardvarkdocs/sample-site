import { forwardRef } from 'react';
import { Paper, Text } from '@mantine/core';
import { ContextMenuProvider, useContextMenu } from 'mantine-contextmenu';
import './ContextMenu.css';
import { tablerGlyph } from '@aardvark/islands/tabler-icons';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// The island behind the {% contextmenu %} community tag
// (contextmenu.md). It wraps mantine-contextmenu
// (https://icflorescu.github.io/mantine-contextmenu/ — MIT, by Ionut-Cristian
// Florescu), which exposes a right-click menu via a ContextMenuProvider + the
// useContextMenu() hook.
//
// Each Aardvark island is its own React root, so this island carries its OWN
// ContextMenuProvider (the library requires one inside the MantineProvider — the
// shared client/SSR entry already supplies the MantineProvider). `useContextMenu`
// must run *inside* that provider, so the right-click target lives in a small inner
// component (Target) that the provider wraps.
//
// `items` is an array of plain objects parsed in the macro from the `items` JSON
// param. Each entry is one of:
//   { divider: true }                                  -> a separator
//   { key, title, href?, color?, icon? }               -> a menu action
// On a static docs page there are no arbitrary onClick handlers, so an action with
// an `href` navigates there (the only meaningful side effect a baked page can take);
// hrefs are sanitized (the same sanitizeHref the Menu/NavLink islands use) so a
// malicious item href can't execute. `icon` accepts a Tabler icon name, resolved to
// a node the same way the {% blockquote %} / {% card %} builtins do.
//
// Every other prop ({...rest}: the library's submenu/styling options, plus the
// optional attr={…} HTML-attribute channel via the forwarded ref) flows straight to
// the rendered target. `label` is the visible right-click target text.
//
// SSR note: useContextMenu reads browser-only context, but the provider renders a
// safe, closed target server-side (the menu only opens on a real right-click), so the
// baked HTML is just the labelled target box. Aardvark hydrates that markup in place and
// attaches the client-only menu interaction without replacing the server output.

function buildItems(items, iconCdn) {
  return items.map((item, i) => {
    if (item && item.divider) return { key: `divider-${i}`, divider: true };
    const key = (item && item.key) || `item-${i}`;
    const safeHref = item && item.href ? sanitizeHref(item.href) : undefined;
    const iconNode = tablerGlyph(item && item.icon, iconCdn, 'aardvark-contextmenu-glyph');
    return {
      key,
      title: (item && item.title) || key,
      icon: iconNode,
      color: (item && item.color) || undefined,
      onClick: safeHref
        ? () => {
            if (typeof window !== 'undefined') window.location.assign(safeHref);
          }
        : () => {},
    };
  });
}

const Target = forwardRef(function Target({ label, items, iconCdn, ...rest }, ref) {
  const { showContextMenu } = useContextMenu();
  return (
    <Paper
      ref={ref}
      withBorder
      p="md"
      radius="md"
      className="aardvark-contextmenu-target"
      onContextMenu={showContextMenu(buildItems(items, iconCdn))}
      {...rest}
    >
      <Text size="sm" c="dimmed">
        {label}
      </Text>
    </Paper>
  );
});

const ContextMenu = forwardRef(function ContextMenu(
  { label = 'Right-click here', items = [], iconCdn, ...rest },
  ref,
) {
  return (
    <ContextMenuProvider>
      <Target ref={ref} label={label} items={items} iconCdn={iconCdn} {...rest} />
    </ContextMenuProvider>
  );
});

export default ContextMenu;
