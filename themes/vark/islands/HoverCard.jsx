import { forwardRef } from 'react';
import { HoverCard as MantineHoverCard, Anchor } from '@mantine/core';

// The island behind the built-in {% hovercard %} tag (hovercard.md). Mantine's HoverCard is
// compound (MantineHoverCard.Target + MantineHoverCard.Dropdown) and opens on hover (with
// openDelay/closeDelay), unlike Popover's click toggle. This wrapper assembles both from the
// tag's inputs:
//
//   * `target` — the trigger label (string). Rendered as a Mantine Anchor so it is a
//     single inline element MantineHoverCard.Target can attach hover listeners to and reads
//     as an interactive in-text affordance.
//   * children — the already-rendered Markdown body, shown inside MantineHoverCard.Dropdown.
//
// Every other prop ({...rest}: position, width, shadow, withArrow, offset, radius,
// openDelay, closeDelay, …) flows straight to Mantine <MantineHoverCard>, so the full
// HoverCard API is exposed.
//
// SSR note: under renderToString the dropdown is closed (no portal), so the
// baked HTML is just the trigger anchor. The dropdown opens on the client (on hover)
// after the island re-renders.
const HoverCard = forwardRef(function HoverCard(
  { children, target, ...rest },
  ref,
) {
  // Mantine's <MantineHoverCard> is a context provider (a plain function component), so it takes
  // no ref — the forwarded ref (carrying an optional attr={...}) goes on the Dropdown, so author
  // attributes land on the hovercard itself. The dropdown is unmounted while closed, so the
  // callback ref applies them when it opens.
  return (
    <MantineHoverCard {...rest}>
      <MantineHoverCard.Target>
        <Anchor component="button" type="button">
          {target}
        </Anchor>
      </MantineHoverCard.Target>
      <MantineHoverCard.Dropdown ref={ref}>{children}</MantineHoverCard.Dropdown>
    </MantineHoverCard>
  );
});

export default HoverCard;
