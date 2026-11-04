import { forwardRef } from 'react';
import { Clock as MantineClock } from '@gfazioli/mantine-clock';
import './Clock.css';

export const communityPackage = '@gfazioli/mantine-clock';
export const communityComponent = MantineClock;

// The island behind the built-in {% clock %} tag (clock.md).
// A Community Component: it wraps @gfazioli/mantine-clock's `Clock`, an analog clock that
// ticks live time by default (or shows a fixed `value` when `running=false`), with arc
// toggles, a shape, and a second-hand behaviour.
//
// Every prop the macro sets (size, value, running, timezone, secondHandBehavior, shape,
// withSecondsArc/withMinutesArc/withHoursArc, animateOnMount, …) flows straight through via
// {...rest}, so the full Clock API stays available from the tag.
//
// forwardRef so `attr={...}` reaches the rendered root. Forwarding `ref` is safe here, unlike
// DataTable's wrapper: the package destructures `ref` out of its props before it spreads the
// rest (dist/esm/Clock.mjs `const { ref, ...restProps } = _props`, then
// `useMergedRef(ref, containerRef)`), so ours cannot overwrite its own.
//
// The live clock needs the browser clock + a tick interval, so it is client-only, and the
// marker above also keeps it out of the build's SSR bundle. The build
// bakes an empty <div>: the prerender never runs this component, so the whole face — not just
// the hands — is drawn when Aardvark renders the island client-side with createRoot.
const Clock = forwardRef(function Clock(props, ref) {
  return <MantineClock ref={ref} {...props} />;
});

export default Clock;
