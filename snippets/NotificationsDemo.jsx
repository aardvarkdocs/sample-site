import { forwardRef, useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
// @mantine/notifications styles ride in via this LOCAL stylesheet (it @imports the package
// CSS), never a JS `import '@mantine/notifications/styles.css'` — a local sheet is extracted
// to the client bundle but a package .css would survive --packages=external and crash the
// Node SSR prerender on ".css". See snippets/NotificationsDemo.css.
import './NotificationsDemo.css';

// A notification (toast) system you trigger from JavaScript. You mount <Notifications /> once,
// anywhere on the page; from then on any code can call `notifications.show({...})` to pop a toast
// into its viewport corner — no component to render at the call site, no state to thread through.
//
// This snippet bundles both halves into one live demo: the always-mounted <Notifications /> portal
// plus a Button whose onClick fires a toast. The store and its portal are browser-only, so during
// the build-time SSR prerender (where there is no document) we render just the Button placeholder
// and let the real demo mount on hydration — that keeps the prerender from crashing.
//
// forwardRef so `attr={...}` reaches the trigger Button's DOM node (see ProductCard.jsx / Callout.jsx),
// landing author-supplied raw attributes (incl. event handlers) on the element a reader clicks.
const NotificationsDemo = forwardRef(function NotificationsDemo(_props, ref) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const trigger = (
    <Button
      ref={ref}
      onClick={() =>
        notifications.show({
          title: 'Saved',
          message: 'Your changes were saved',
          color: 'teal',
        })
      }
    >
      Show notification
    </Button>
  );

  // Keep the trigger at a stable position and gate ONLY the portal: rendering it conditionally
  // beside a same-shape tree means the button is never reconciled to a different type, so it (and
  // the author's attr ref on it) is never unmounted/remounted when the mount effect flips.
  return (
    <>
      {mounted && <Notifications />}
      {trigger}
    </>
  );
});

export default NotificationsDemo;
