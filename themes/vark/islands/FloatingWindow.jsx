import { forwardRef, useRef } from 'react';
import { FloatingWindow as MantineFloatingWindow, ActionIcon, Button, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';

// The island behind the built-in {% floatingwindow %} tag (floatingwindow.md). Registered under the
// native name FloatingWindow — intentionally shadowing the raw Mantine export the way Splitter.jsx
// / OverflowList.jsx do — so component('FloatingWindow') is this trigger-opened, titled form.
//
// Mantine 9's FloatingWindow floats over the VIEWPORT via a Portal (not in document flow) and is a
// bare draggable Paper — it has no title bar, close button, or open/close of its own ("close via
// conditional render"). So this thin wrapper adds the docs chrome around it: a trigger Button opens
// the window, a header bar acts as the drag
// handle (Mantine's dragHandleSelector), and a close button unmounts it (useDisclosure). The
// PaperBaseProps (shadow/radius/withBorder) and width ride straight to the native component, which
// owns the drag + viewport-constrain.
//
// SSR note: closed by default, so renderToString bakes only the trigger button; the first
// client render hydrates that same closed state. The window and its portal mount when opened.
// Keep any browser-only work out of render so the prerender and hydration paths agree.
const FloatingWindow = forwardRef(function FloatingWindow(
  {
    triggerLabel = 'Open window',
    title,
    width = 320,
    shadow = 'xl',
    radius = 'md',
    withCloseButton: withCloseButtonProp = true,
    withBorder = true,
    opened: openedProp = false,
    children,
  },
  ref,
) {
  // The close button is this window's ONLY dismissal: there is no backdrop and no Escape
  // handler, so turning it off leaves an opened window that can never be closed. The macro warns
  // and restores it, but a direct component('FloatingWindow', …) call bypasses the macro entirely,
  // so the invariant has to hold HERE too — this is the boundary both entry points cross.
  //
  // And it says so, in the macro's own words. Restoring the value silently would leave the two
  // entry points disagreeing about the identical misconfiguration, and would break the repo rule
  // that a degraded path announces itself: an author who passed withCloseButton=False deserves to
  // learn their value was overridden, not discover a window that still has its X. Warned once per
  // instance during render, so the SSR bake surfaces it in the build output too rather than only
  // in the reader's console (console exists in both — see Icon.jsx).
  const withCloseButton = true;
  const warnedRef = useRef(false);
  if (!withCloseButtonProp && !warnedRef.current) {
    warnedRef.current = true;
    console.warn(
      "Aardvark: {% floatingwindow %} withCloseButton is off, but it's the window's only way to " +
        'close on a static page — re-enabling the close button so it stays dismissible',
    );
  }
  const [opened, { open, close }] = useDisclosure(openedProp);
  return (
    <>
      <Button onClick={open}>{triggerLabel}</Button>
      {opened && (
        <MantineFloatingWindow
          ref={ref}
          w={width}
          p={0}
          shadow={shadow}
          radius={radius}
          withBorder={withBorder}
          initialPosition={{ top: 120, left: 120 }}
          constrainToViewport
          dragHandleSelector=".aardvark-fw-bar"
          excludeDragHandleSelector=".aardvark-fw-close"
        >
          <Group
            justify="space-between"
            wrap="nowrap"
            className="aardvark-fw-bar"
            style={{ cursor: 'move', padding: 'var(--mantine-spacing-sm) var(--mantine-spacing-md)' }}
          >
            <Text fw={600} size="sm" lineClamp={1}>
              {title}
            </Text>
            {withCloseButton && (
              <ActionIcon
                className="aardvark-fw-close"
                variant="subtle"
                color="gray"
                size="sm"
                aria-label="Close window"
                onClick={close}
              >
                <IconX size={16} />
              </ActionIcon>
            )}
          </Group>
          <div style={{ padding: '0 var(--mantine-spacing-md) var(--mantine-spacing-md)' }}>{children}</div>
        </MantineFloatingWindow>
      )}
    </>
  );
});

export default FloatingWindow;
