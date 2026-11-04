import { forwardRef } from 'react';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Shared factory for the three trigger-plus-overlay builtins (Modal, Drawer, Dialog). Each is a
// bare Mantine overlay that needs external `opened` state plus an opener to be useful on a static
// page, so this wires a `useDisclosure` toggle behind a trigger Button. `propsKey` is the island's
// JSON props-bag name (modalProps/drawerProps/dialogProps), spread straight onto the overlay so
// the full Mantine API stays exposed; `defaultLabel` is the opener button's fallback text.
//
// Underscore prefix = shared helper module, not a mountable island (aardvark skips
// `_*.jsx` when registering islands; it still stages the file so sibling imports
// resolve).
export function createTriggeredOverlay(Overlay, { propsKey, defaultLabel, displayName }) {
  const TriggeredOverlay = forwardRef(function TriggeredOverlay(
    { triggerLabel = defaultLabel, opened: openedProp = false, [propsKey]: overlayProps = {}, children },
    ref,
  ) {
    const [opened, { open, close }] = useDisclosure(openedProp);
    return (
      <>
        {/* attr= ref forwards to the portaled overlay content (Mantine Modal/Drawer/Dialog each
            forward their ref to the root <div>), so author attributes land on the overlay itself,
            not the trigger. The overlay is unmounted while closed, so the callback ref applies
            them when it opens. */}
        <Button onClick={open}>{triggerLabel}</Button>
        <Overlay ref={ref} opened={opened} onClose={close} {...overlayProps}>
          {children}
        </Overlay>
      </>
    );
  });

  TriggeredOverlay.displayName = displayName;
  return TriggeredOverlay;
}
