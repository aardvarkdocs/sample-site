import { forwardRef, useRef, useState } from 'react';
import { FloatingIndicator as MantineFloatingIndicator, UnstyledButton } from '@mantine/core';
import './FloatingIndicator.css';

// The island behind the built-in {% floatingindicator %} tag
// (floatingindicator.md). FloatingIndicator is a LOW-LEVEL positioning
// primitive: it animates a single highlight box from one target element to
// another, given a root ref + a target ref. It has no behavior of its own — it
// is the engine Mantine's SegmentedControl, Tabs, and Stepper use internally to
// slide their active highlight.
//
// A build-time macro can't hand FloatingIndicator the live DOM refs it needs, so
// this island is a small, self-contained DEMO that wires the primitive correctly:
// a row of buttons whose `label`s arrive via the `labels` param (parsed from a JSON
// string in the macro). Clicking a button moves the floating highlight to it, so the
// doc page shows the primitive actually doing its job. `target`/`parent` style props
// and the demo labels are the only inputs; everything else about FloatingIndicator
// is positioning it does for you.
const FloatingIndicator = forwardRef(function FloatingIndicator(
  { labels = [] },
  ref,
) {
  const [rootRef, setRootRef] = useState(null);
  const [controlsRefs, setControlsRefs] = useState({});
  const [active, setActive] = useState(0);

  // Cache one stable ref callback per index. A fresh `ref={fn}` on every render makes React
  // detach (call the old callback with null) then reattach (call the new one with the node) —
  // two extra state updates per button per render. Reusing the same callback per index avoids
  // that, and the functional update bails out (returns the same object) when the node is
  // unchanged, so state only changes when a node actually arrives or leaves.
  const refCallbacks = useRef({});
  const getControlRef = (index) => {
    if (!refCallbacks.current[index]) {
      refCallbacks.current[index] = (node) => {
        setControlsRefs((refs) => (refs[index] === node ? refs : { ...refs, [index]: node }));
      };
    }
    return refCallbacks.current[index];
  };

  return (
    <div className="aardvark-floating-indicator-root" ref={ref}>
      <div className="aardvark-floating-indicator-track" ref={setRootRef}>
        <MantineFloatingIndicator
          target={controlsRefs[active]}
          parent={rootRef}
          className="aardvark-floating-indicator-bar"
        />
        {labels.map((label, index) => (
          <UnstyledButton
            key={index}
            className="aardvark-floating-indicator-control"
            data-active={index === active || undefined}
            ref={getControlRef(index)}
            onClick={() => setActive(index)}
          >
            {label}
          </UnstyledButton>
        ))}
      </div>
    </div>
  );
});

export default FloatingIndicator;
