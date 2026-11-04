import { forwardRef } from 'react';
import { Tooltip as MantineTooltip } from '@mantine/core';

// The island behind the built-in {% tooltip %} tag (tooltip.md). Mantine's Tooltip
// wraps a single target element and shows a floating label on hover/focus. The
// target is the block body (children); the label and all positioning/appearance
// props ride the JSON props channel.
//
// The target must be a single React element that can take a ref (Mantine attaches
// listeners + the floating ref to it). Markdown bodies render as block-level HTML
// (often a <p> or a run of inline nodes), so we wrap the children in a <span> that
// Mantine can target — `display:inline-block` so the span hugs its content and the
// tooltip points at the visible text rather than a full-width line box.
//
// SSR note: under renderToString the tooltip is closed (no portal), so the
// baked HTML is just the target span — no flash. The tooltip opens on the client
// after the island re-renders. `opened` force-shows it (useful for docs/screenshots).
const Tooltip = forwardRef(function Tooltip(
  { children, label, ...rest },
  ref,
) {
  return (
    <MantineTooltip label={label} {...rest}>
      {/* ref lives on the span — the visible trigger DOM node — so attr={...} lands on the target.
          Tooltip is the one floating island that keeps its ref on the trigger: the sibling overlays
          (Modal/Drawer/Dialog/Popover/Menu/HoverCard) now forward attr to the overlay itself, but
          Mantine merges a Tooltip ref onto the target child rather than exposing the floating bubble,
          so there's no bubble DOM node to attach to. Mantine 7 would also merge a ref passed to
          <MantineTooltip> onto this same target child (tooltip.reference + the child's own ref + its
          own ref), so keeping it explicitly on the span is the upgrade-robust form.
          tabIndex={0} makes the wrapper keyboard-focusable so the tooltip reveals on focus, not
          only hover: Mantine fires its focus listeners and sets aria-describedby on the target, so
          keyboard and screen-reader users reach the label too (a bare span is not in the tab order). */}
      <span ref={ref} tabIndex={0} style={{ display: 'inline-block' }}>{children}</span>
    </MantineTooltip>
  );
});

export default Tooltip;
