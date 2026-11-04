import { forwardRef } from 'react';
import { Popover as MantinePopover, Button } from '@mantine/core';

// The island behind the built-in {% popover %} tag (popover.md). Mantine's Popover is compound
// (MantinePopover.Target + MantinePopover.Dropdown); this wrapper assembles both from the tag's
// inputs:
//
//   * `target` — the trigger label (string). Rendered as a Mantine Button so it is
//     a single focusable element MantinePopover.Target can attach to and toggle on click.
//   * children — the already-rendered Markdown body, shown inside MantinePopover.Dropdown.
//
// Every other prop ({...rest}: position, width, shadow, withArrow, offset, radius,
// trapFocus, closeOnClickOutside, opened, …) flows straight to Mantine <MantinePopover>,
// so the full Popover API is exposed. `targetVariant` styles the trigger button.
//
// SSR note: under renderToString the dropdown is closed (no portal), so the
// baked HTML is just the trigger button. The dropdown opens on the client after the
// island re-renders. `opened` force-shows it (useful for docs/screenshots).
const Popover = forwardRef(function Popover(
  { children, target, targetVariant = 'default', ...rest },
  ref,
) {
  // Mantine's <MantinePopover> is a context provider (a plain function component), so it takes
  // no ref — the forwarded ref (carrying an optional attr={...}) goes on the Dropdown, so author
  // attributes land on the popover itself. The dropdown is unmounted while closed, so the callback
  // ref applies them when it opens.
  return (
    <MantinePopover {...rest}>
      <MantinePopover.Target>
        <Button variant={targetVariant}>
          {target}
        </Button>
      </MantinePopover.Target>
      <MantinePopover.Dropdown ref={ref}>{children}</MantinePopover.Dropdown>
    </MantinePopover>
  );
});

export default Popover;
