import { Modal as MantineModal } from '@mantine/core';
import { createTriggeredOverlay } from './_triggeredOverlay';

// The island behind the built-in {% modal %} tag (modal.md). A bare Mantine
// <MantineModal> needs external `opened` state plus a trigger to be useful on a static
// page, so this wrapper wires a `useDisclosure` toggle: a trigger Button opens it, and
// the close button / overlay click / Escape close it. The macro can start it open
// (`opened=true`) for a doc demo.
//
// Every Mantine Modal prop the macro forwards (title, size, centered, fullScreen,
// radius, padding, overlayProps, withCloseButton, closeOnClickOutside,
// closeOnEscape, transitionProps, …) rides the JSON props channel as `modalProps`
// and is spread straight onto <MantineModal>, so the full API is exposed. `triggerLabel`
// is the opener button's text; `children` is the Markdown-rendered body.
//
// SSR note: useDisclosure starts from the same `opened` prop on the server and first
// client render. aardvark hydrates the baked tree; Mantine defers browser-only portal
// work until mount. Do not assume opened portal content is present in no-JS HTML.
export default createTriggeredOverlay(MantineModal, {
  propsKey: 'modalProps',
  defaultLabel: 'Open modal',
  displayName: 'Modal',
});
