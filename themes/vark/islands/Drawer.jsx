import { Drawer as MantineDrawer } from '@mantine/core';
import { createTriggeredOverlay } from './_triggeredOverlay';

// The island behind the built-in {% drawer %} tag (drawer.md). Like Modal, a bare
// Mantine <MantineDrawer> needs external `opened` state plus a trigger to be
// useful on a static page, so this wraps it in a `useDisclosure` toggle with an
// opener Button. The macro can start it open (`opened=true`) for a doc demo.
//
// Every Mantine Drawer prop the macro forwards (title, size, position
// (left/right/top/bottom), offset, radius, padding, overlayProps, withCloseButton,
// closeOnClickOutside, closeOnEscape, transitionProps, …) rides the JSON props
// channel as `drawerProps` and is spread straight onto <MantineDrawer>, so the full API is
// exposed. `triggerLabel` is the opener button's text; `children` is the
// Markdown-rendered body.
//
// SSR/hydration: identical to Modal — useDisclosure starts from the same `opened` prop
// on the server and first client render. aardvark hydrates the baked tree; the overlay
// library defers browser-only portal work until mount.
export default createTriggeredOverlay(MantineDrawer, {
  propsKey: 'drawerProps',
  defaultLabel: 'Open drawer',
  displayName: 'Drawer',
});
