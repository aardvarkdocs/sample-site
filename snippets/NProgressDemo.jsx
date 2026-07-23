import { forwardRef } from 'react';
import { Button, Group } from '@mantine/core';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
// The package stylesheet rides in via a CSS @import inside this co-located file (never a JS
// import of the package .css, which would crash the SSR prerender — see NProgressDemo.css).
import './NProgressDemo.css';

// A self-contained demo of @mantine/nprogress: a thin progress bar pinned to the very top of the
// page that you drive from JavaScript. There's no static "component" to drop in — the bar is a
// single <NavigationProgress /> mounted once, and you move it with the imperative nprogress.*
// helpers (start / complete / set / increment / reset). So this snippet wires up the bar plus a
// row of buttons that call those helpers, giving the docs a live thing to click.
//
// "Run" kicks off the trickle (nprogress.start, which animates toward the top edge) and then
// finishes it after a beat (nprogress.complete, which fills to 100% and fades out) — mimicking a
// page navigation. "Start" and "Finish" expose the two ends on their own so the API is obvious.
//
// forwardRef so `attr={...}` reaches the primary trigger button's DOM node — the island runtime
// applies the author's raw attributes via a callback ref to this component's root, so we point that
// ref at the "Run" button (matching the other gallery snippets, see DemoCard.jsx / Callout.jsx).
const NProgressDemo = forwardRef(function NProgressDemo(_props, ref) {
  return (
    <>
      <NavigationProgress />
      <Group>
        <Button
          ref={ref}
          onClick={() => {
            nprogress.start();
            setTimeout(() => nprogress.complete(), 1200);
          }}
        >
          Run
        </Button>
        <Button variant="default" onClick={() => nprogress.start()}>
          Start
        </Button>
        <Button variant="default" onClick={() => nprogress.complete()}>
          Finish
        </Button>
      </Group>
    </>
  );
});

export default NProgressDemo;
