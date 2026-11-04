import { forwardRef } from 'react';
import { Button, Transition as MantineTransition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// The island behind the built-in {% transition %} tag (transition.md). Mantine's
// <MantineTransition> uses a function-as-children render prop (styles => <div
// style={styles}>…</div>) to apply the animated inline styles — a function can't ride
// the JSON props channel of component('Transition', ...), so the render prop lives here
// and the macro forwards the plain props (mounted, transition, duration, …) plus the
// already-rendered child markup as `children`.
//
// A bare <MantineTransition> with a fixed `mounted` never animates on a static page — it just
// shows or hides. So, like {% modal %}/{% drawer %}/{% dialog %}, this wires a trigger
// Button that TOGGLES `mounted`, so clicking it plays the enter/leave animation. `mounted`
// is the INITIAL state (default true, so the content is present for SSR / crawlers); the
// button hides and re-shows it. keepMounted leaves the node in the DOM (display managed) so
// its content is always present even while hidden.
//
// SSR note: useDisclosure's initial value is honored under renderToString. aardvark
// hydrates the same initial state; the trigger changes it only after mount.
const Transition = forwardRef(function Transition(
  {
    mounted = true,
    transition = 'fade',
    duration = 250,
    timingFunction,
    keepMounted,
    triggerLabel = 'Toggle',
    children,
  },
  ref,
) {
  const [shown, { toggle }] = useDisclosure(mounted);
  return (
    <>
      <Button variant="light" size="xs" mb="sm" onClick={toggle}>
        {triggerLabel}
      </Button>
      <MantineTransition
        mounted={shown}
        transition={transition}
        duration={duration}
        timingFunction={timingFunction}
        keepMounted={keepMounted}
      >
        {(styles) => (
          <div ref={ref} style={styles}>
            {children}
          </div>
        )}
      </MantineTransition>
    </>
  );
});

export default Transition;
