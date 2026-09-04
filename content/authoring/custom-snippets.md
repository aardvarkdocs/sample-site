---
description: A custom snippet is a real React component in snippets/*.jsx — for behavior
  composition can't express. Usable as both component('Name', …) and a {% Name %} tag.
  This page explains how a snippet becomes a tag and when to reach for one over a custom component.
icon: fa-solid fa-code
menu: docs
title: Custom snippets
weight: 21.7
---

# Custom snippets

A **custom snippet** is a real React component you drop in `snippets/*.jsx`. Reach for
one when you need *actual React* — state, effects, hooks, a third-party React library,
or a browser API — that you can't express by composing existing components. Unlike a
[custom component](/authoring/custom-components/), which is a build-time macro that
ships **no** JavaScript, a snippet **is** JavaScript: it's bundled and mounts as an
[island](/authoring/components-and-snippets/) in the browser.

## Write one

A snippet is a `.jsx` (or `.tsx`) file under `snippets/` that default-exports a React
component. Its props arrive as the component's props, and anything you wrap becomes
`children`:

```jsx
// snippets/Stepper.jsx
import { forwardRef, useState } from 'react';
import { Button } from '@mantine/core';

const Stepper = forwardRef(function Stepper({ label = 'Clicks', start = 0 }, ref) {
  const [n, setN] = useState(start);
  return <Button ref={ref} onClick={() => setN((c) => c + 1)}>{label}: {n}</Button>;
});

export default Stepper;
```

That `useState` is the tell — it holds live client state, which a `.md` macro can't.
The file name (`Stepper`) is the component name. It's bundled into the site's single
islands bundle alongside everything else, and a stylesheet it imports
(`import './Stepper.css'`) rides along with it — this site's `snippets/CodeBlock.jsx`
does exactly that.

{% callout title="Good to know" severity="info" %}

- **Forward the ref** (`forwardRef`, with the ref placed on a real DOM element, as above).
  That's what lets `attr={% raw %}{…}{% endraw %}` reach your snippet's root; a snippet that
  swallows the ref silently drops every `attr` pair — no error, the attributes just never land.
- **Touch the browser only in effects and handlers.** By default islands are prerendered to
  HTML at build time (see [How islands render](/authoring/components-and-snippets/)), where
  there is no `window`, `document` or `localStorage`. Read them inside `useEffect` or an event
  handler, and gate anything that must differ between server and browser (a portal, a
  measured size) behind a `mounted` flag set in an effect. Otherwise the prerender of that
  page fails (it then mounts client-side only), or the baked markup disagrees with what the
  browser renders and React replaces it on load — the reflow prerendering exists to avoid.
- **A snippet's name wins.** `snippets/Button.jsx` replaces Mantine's `Button` everywhere
  `component('Button')` is called — the built-in `{% raw %}{% button %}{% endraw %}` tag
  included — see
  [Overriding a built-in](/authoring/components-and-snippets/#overriding-a-built-in).

{% endCallout %}

## Two ways to use it

A snippet is reachable both as a **call** and as a **tag**; both mount the same island,
so use whichever reads better. This site ships `snippets/ProductCard.jsx`. The call form:

{% raw %}
```aardvark
{% component('ProductCard', product='Aardvark Pro', badge='New') %}
```
{% endraw %}

and the tag form:

{% raw %}
```aardvark
{% ProductCard product="Aardvark Pro" badge="New" %}
```
{% endraw %}

both render the same island, live:

{% ProductCard product="Aardvark Pro" tagline="Docs that build themselves" badge="New" %}

- **Tag form** — `{% raw %}{% ProductCard … %}{% endraw %}`. Defining the snippet
  *gives* you the tag, the same way a custom component does. Scalar attributes become
  props; a wrapped body (closed with `{% raw %}{% endProductCard %}{% endraw %}`, first
  letter capitalized) becomes `children`. The `attr={% raw %}{…}{% endraw %}` escape
  hatch from [Components & snippets](/authoring/components-and-snippets/) works here too.
- **Call form** — `{% raw %}{% component('ProductCard', …) %}{% endraw %}`. Needed for
  the two things a tag can't do: pass a **non-scalar prop** (a list or dict — tag
  attributes are scalar, like every directive), and emit from inside a **`for` loop** (a
  `{% raw %}{% Name %}{% endraw %}` tag is expanded when the page is *scanned*, before any
  loop runs, so loops use the call form — see the
  [storefront example](/components/extras/component-libraries/)).

## Snippet or custom component?

Both let you define your own building block and call it as a `{% raw %}{% Tag %}{% endraw %}`.
The difference is **what's behind the tag**:

| | [Custom component](/authoring/custom-components/) (`.md`) | Custom snippet (`.jsx` / `.tsx`) |
|---|---|---|
| What it is | A build-time **macro** | A real **React component** |
| Ships JavaScript? | No — expands into `component()` calls at build | Yes — bundled, mounts as an island |
| Body written in | A `{% raw %}{% %}{% endraw %}` template | JSX |
| Reach for it when | **Composing existing** components into a named, parameterized tag | You need **new React**: state, effects, hooks, a third-party React lib, browser APIs |
| Tag form | `{% raw %}{% Name %}{% endraw %}` | `{% raw %}{% Name %}{% endraw %}` |
| Call form | — | `{% raw %}{% component('Name', …) %}{% endraw %}` |

**Rule of thumb:** composing what already exists → custom component; writing new React →
snippet. Both earn a `{% raw %}{% Name %}{% endraw %}` tag, so the *call site* reads the
same — the choice is only about whether you're wiring existing pieces together or writing
genuine React.

## A case that has to be a snippet

The Stripe provider on the [Component libraries](/components/extras/component-libraries/) page is
the canonical "must be a snippet." Mounting Stripe's card fields needs `loadStripe('pk_…')`
— which returns a Promise and injects Stripe.js — wrapped in Stripe's `<Elements>` React
context provider. None of that is expressible as a build-time macro (there's no JavaScript
to run, no React context to hold), so `StripeProvider` is a `snippets/*.jsx` file. Because
it's a snippet, you still get the natural `{% raw %}{% StripeProvider %}{% endraw %}` tag —
that's exactly this behavior at work.
