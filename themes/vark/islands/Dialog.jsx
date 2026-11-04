import { Dialog as MantineDialog } from '@mantine/core';
import { createTriggeredOverlay } from './_triggeredOverlay';

// The island behind the built-in {% dialog %} tag (dialog.md). Mantine's
// <MantineDialog> is a fixed, corner-anchored panel that needs external `opened`
// state; this wraps it in a `useDisclosure` toggle with an opener Button so it works
// on a static page. Unlike Modal/Drawer there's no backdrop, so the Dialog's own
// close button (withCloseButton) is the way to dismiss it. The macro can start it
// open (`opened=true`) for a doc demo.
//
// Every Mantine Dialog prop the macro forwards (position, size, radius, withBorder,
// withCloseButton, transitionProps, …) rides the JSON props channel as `dialogProps`
// and is spread straight onto <MantineDialog>, so the full API is exposed. `triggerLabel`
// is the opener button's text; `children` is the Markdown-rendered body.
//
// SSR/hydration: identical to Modal — useDisclosure starts from the same `opened` prop
// on the server and first client render. aardvark hydrates the baked tree; the overlay
// library defers browser-only portal work until mount.
export default createTriggeredOverlay(MantineDialog, {
  propsKey: 'dialogProps',
  defaultLabel: 'Open dialog',
  displayName: 'Dialog',
});
