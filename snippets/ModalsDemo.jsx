import { forwardRef } from 'react';
import { Button } from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';

// @mantine/modals is an imperative *modal manager*: you don't place a modal in the
// markup, you call modals.openConfirmModal()/open()/openContextModal() from an event
// handler and the provider mounts, stacks, and tears down the dialog for you. Because
// that surface lives entirely at runtime (a function you call, not a static component),
// it can't be addressed straight from Markdown like a plain Mantine component — so this
// snippet wires a minimal, self-contained demo: a Button that, on click, opens a confirm
// dialog through the manager.
//
// <ModalsProvider> is the manager's host — it owns the open-modal state and renders the
// dialog into a portal. modals.openConfirmModal() pushes a confirm dialog (a title, body,
// and the two labelled action buttons) onto it; nothing renders until the click fires, so
// the page never loads with a panel covering the content. During the build-time prerender
// no click happens, so the provider renders only its children (the Button) and the real
// manager activates on hydration.
//
// forwardRef so an author's attr={...} reaches the trigger Button's DOM node — see the
// "Injecting Attributes" section of the doc page.
const ModalsDemo = forwardRef(function ModalsDemo(props, ref) {
  return (
    <ModalsProvider>
      <Button
        ref={ref}
        {...props}
        onClick={() =>
          modals.openConfirmModal({
            title: 'Confirm',
            children: 'Proceed?',
            labels: { confirm: 'OK', cancel: 'Cancel' },
          })
        }
      >
        Open confirm dialog
      </Button>
    </ModalsProvider>
  );
});

export default ModalsDemo;
