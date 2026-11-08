/* @aardvark-island {"urlProps": ["items[].href"]} */
import { forwardRef } from 'react';
import { Menu as MantineMenu, Button } from '@mantine/core';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// The island behind the built-in {% menu %} tag (menu.md). Mantine's Menu is compound
// (MantineMenu.Target + MantineMenu.Dropdown holding MantineMenu.Item / MantineMenu.Label /
// MantineMenu.Divider); this wrapper assembles all of it from the tag's inputs:
//
//   * `label` — the trigger button text (string), rendered as a Mantine Button that
//     MantineMenu.Target toggles on click.
//   * `items` — an array of plain objects parsed in the macro from the `items` param
//     (a JSON string). Each entry is one of:
//       { divider: true }                       -> MantineMenu.Divider
//       { section: "Label" }                    -> MantineMenu.Label (a section heading)
//       { label, href?, color?, disabled? }     -> MantineMenu.Item (a link when href set)
//
// Every other prop ({...rest}: position, width, shadow, trigger, withArrow, offset,
// radius, closeOnItemClick, …) flows straight to Mantine <MantineMenu>, so the full Menu
// API is exposed. `targetVariant` styles the trigger button.
//
// SSR note: under renderToString the dropdown is closed (no portal), so the
// baked HTML is just the trigger button; the menu opens on the client.
const Menu = forwardRef(function Menu(
  { label, items = [], targetVariant = 'default', ...rest },
  ref,
) {
  // Mantine's <MantineMenu> is a context provider (a plain function component), so it takes
  // no ref — the forwarded ref (carrying an optional attr={...}) goes on the Dropdown, so author
  // attributes land on the menu itself. The dropdown is unmounted while closed, so the callback
  // ref applies them when it opens.
  return (
    <MantineMenu {...rest}>
      <MantineMenu.Target>
        <Button variant={targetVariant}>
          {label}
        </Button>
      </MantineMenu.Target>
      <MantineMenu.Dropdown ref={ref}>
        {items.map((item, i) => {
          if (item.divider) return <MantineMenu.Divider key={i} />;
          if (item.section) return <MantineMenu.Label key={i}>{item.section}</MantineMenu.Label>;
          // Sanitize the author-supplied href like every other island that renders one
          // (NavLink / Breadcrumbs) — sanitizeHref rejects javascript:/data:/…
          // so a malicious item href can't execute on a multi-author site.
          const safeHref = item.href ? sanitizeHref(item.href) : undefined;
          const linkProps = safeHref
            ? { component: 'a', href: safeHref }
            : {};
          return (
            <MantineMenu.Item
              key={i}
              color={item.color || undefined}
              disabled={item.disabled || undefined}
              {...linkProps}
            >
              {item.label}
            </MantineMenu.Item>
          );
        })}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
});

export default Menu;
