---
title: "Component libraries"
description: "Pull additional React component libraries into your theme and address them from Markdown with {% component('library', 'Name') %} — the library name disambiguates, so two libraries that both export the same component never collide. Mantine is built in; everything else a theme declares in its theme.yaml."
---

# Component libraries

Every Mantine component is available out of the box, addressed with the library name first —
`{% raw %}{% component('mantine', 'Button') %}{% endraw %}`. And a **theme isn't limited to
Mantine:** it can pull in *any* React component library — Stripe Elements, a charting kit, an icon
set — and expose it through the same `{% raw %}{% component() %}{% endraw %}` tag.

The library name is what keeps two libraries that both export, say, `Tooltip` from colliding — a
charting kit's `Tooltip` and Mantine's stay distinct because each is reached through its own key:

{% raw %}
```aardvark
{% component('mantine', 'Button', color='blue') %}      {# Mantine — the built-in library #}
{% component('stripe', 'PaymentElement') %}             {# a library this theme declared #}
```
{% endraw %}

For the built-in sources — Mantine, the native components, and your project snippets — you can drop
the prefix: `{% raw %}{% component('Button') %}{% endraw %}` is shorthand for
`{% raw %}{% component('mantine', 'Button') %}{% endraw %}`. That shorthand is **always**
unambiguous — a theme library is only ever reachable through its name, so a library's `Button` can
never capture the bare one.

## Declaring a library

A theme declares its extra libraries in a **`theme.yaml`** beside its templates
(`themes/<name>/theme.yaml`). This site pulls in [Stripe's React
SDK](https://github.com/stripe/react-stripe-js):

{% raw %}
```yaml
# themes/vark/theme.yaml
componentLibraries:
  stripe:
    package: "@stripe/react-stripe-js"   # the npm import specifier (must be `npm install`ed)
    components: [CardElement, PaymentElement, LinkAuthenticationElement]   # omit to auto-discover
```
{% endraw %}

The **key** (`stripe`) is the first argument you pass to `{% raw %}{% component() %}{% endraw %}`; the
**`package`** is what gets imported and bundled. Because the two are separate, the key is just a
friendly handle. Keys are lowercase-kebab and may not be `mantine`, `aardvark`, or `snippet` (those
name the built-in sources).

## The one piece a library can't hand you

Stripe's Element components — `PaymentElement`, `CardElement` — render real, PCI-compliant card
fields inside a cross-origin iframe. But they only work inside Stripe's `<Elements>` provider, which
needs a live Stripe instance from `loadStripe('pk_…')` — a call that returns a Promise and injects
Stripe.js. That's runtime JavaScript, not a value you can pass as a Markdown prop. So the
**provider** is one small [snippet](/authoring/components-and-snippets/); everything *inside* it is
addressed from the library.

The provider is also where you set Stripe's **Appearance** — here it follows the page's light/dark
toggle so the Payment Element keeps its contrast (`useColorScheme()` reads
`<html data-mantine-color-scheme>`). This is the real file in full — it's SSR-safe (`loadStripe` only
runs in the browser; `options` is memoized) and `deferred` is what the storefront below flips to swap
the Payment Element for a card field:

{% raw %}
```jsx
// snippets/StripeProvider.jsx
import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Aardvark keeps the resolved light/dark scheme in <html data-mantine-color-scheme> (see the
// theme's color-scheme.js), updating it live when the reader toggles. Mirror it into React so the
// Stripe Appearance below re-themes with the page.
function useColorScheme() {
  const read = () =>
    (typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-mantine-color-scheme')) ||
    'light';
  const [scheme, setScheme] = useState(read);
  useEffect(() => {
    const sync = () => setScheme(read());
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mantine-color-scheme'],
    });
    sync();
    return () => obs.disconnect();
  }, []);
  return scheme;
}

// The one thing a component library can't hand you from Markdown is the runtime Stripe instance:
// loadStripe() returns a Promise (and injects Stripe.js), not a JSON-serialisable prop. So this
// thin snippet owns the <Elements> provider; everything *inside* it — a Payment Element, a Card
// Element — is rendered straight from the theme-declared `stripe` library via
// {% component('stripe', 'PaymentElement') %} etc., nested as this provider's children.
//
// loadStripe only runs in the browser, so it's resolved client-side; during the build-time
// prerender `stripe` is null and <Elements> just renders the children, then the real instance
// mounts on hydration. The provider also carries the Appearance, switched with the page's
// light/dark scheme (the Payment Element honors Stripe's Appearance API), so it stays readable.
//
// `deferred` (default true) drives the Payment Element's deferred intent (mode/amount/currency).
// Pass `deferred={false}` for a plain card-input group (a CardElement, which can't live in a
// deferred-mode Elements) — as the data-driven shop grid does, one provider per product.
export default function StripeProvider({
  publishableKey,
  amount = 2000,
  currency = 'usd',
  deferred = true,
  children,
}) {
  const stripe = useMemo(
    () => (publishableKey && typeof window !== 'undefined' ? loadStripe(publishableKey) : null),
    [publishableKey],
  );
  const scheme = useColorScheme();
  const options = useMemo(() => {
    // Keep the init-only intent fields (deferred mode/amount/currency) separate from the dynamic
    // appearance, so it reads clearly that only `appearance` changes on a theme toggle. (Functionally
    // the same either way: react-stripe-js diffs the options and forwards only the changed keys to
    // elements.update() — on a toggle that's just { appearance }.)
    const base = deferred ? { mode: 'payment', amount, currency } : {};
    return { ...base, appearance: { theme: scheme === 'dark' ? 'night' : 'stripe' } };
  }, [amount, currency, scheme, deferred]);
  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
}
```
{% endraw %}

## Composing it: a snippet *is* a tag

Defining a [snippet](/authoring/custom-snippets/) gives you a
`{% raw %}{% StripeProvider %}{% endraw %}` tag, the same way a
[custom component](/authoring/custom-components/) does — so you compose it like any other
directive, no `component()` call in sight. (`StripeProvider` *has* to be a snippet, not an
`.md` component — it needs real React; see [snippet vs. custom
component](/authoring/custom-snippets/).) The body of the tag becomes the provider's `children`;
nest the built-in `{% raw %}{% card %}{% endraw %}` and Stripe's `PaymentElement` (from the theme's
`stripe` library) right inside it:

{% raw %}
```aardvark
{% StripeProvider publishableKey="pk_test_…" %}
  {% card variant="plain" maw=480 cta="Pay $20.00" %}
    {% component('stripe', 'PaymentElement') %}
  {% endCard %}
{% endStripeProvider %}
```
{% endraw %}

Three sources, composed by nesting: your **`StripeProvider`** snippet owns the `<Elements>` context,
the built-in **`{% raw %}{% card %}{% endraw %}`** gives the frame and its `cta` button, and Stripe's
**`PaymentElement`** — addressed through the theme's **`stripe`** library, since a theme library is
always reached by its key — is the card's content. A snippet stays callable as
`{% raw %}{% component('StripeProvider', …) %}{% endraw %}` too; you need that form inside a loop, as
the storefront does below. Renders, live (test mode — swap in your own `pk_test_…`):

<div style="margin: 1.5rem 0;">
{% StripeProvider publishableKey="pk_test_TYooMQauvdEDq54NiTphI7jx" %}
{% card variant="plain" maw=480 cta="Pay $20.00" %}
{% component('stripe', 'PaymentElement') %}
{% endCard %}
{% endStripeProvider %}
</div>

The Payment Element is a genuine Stripe iframe, themed to match the page — try toggling dark mode, or
type the test card `4242 4242 4242 4242`. Nothing is charged: it's a publishable **test** key and
there's no backend wired up here.

## A storefront from a data file

Here's the payoff. Aardvark pages run [real Python](/authoring/templating/), and `data/` files are in
scope as `data.<file>`. Point a loop at one and the library becomes a UI generator. This site ships
`data/products.yaml`:

{% raw %}
```yaml
# data/products.yaml
items:
  - { name: Sticker Pack, price: 8,  icon: sticker-2, color: "#e8590c", blurb: "A dozen die-cut vinyl aardvarks." }
  - { name: Enamel Mug,   price: 18, icon: mug,       color: "#1971c2", blurb: "12oz, dishwasher-safe." }
  - { name: Zip Hoodie,   price: 55, icon: shirt,     color: "#7048e8", blurb: "Heavyweight fleece." }
```
{% endraw %}

A `{% raw %}{% card %}{% endraw %}` tag is expanded as the page is *scanned*, so it can't be written
inside a `for` loop. The same built-in is reachable as
`{% raw %}{% component('aardvark', 'card', …) %}{% endraw %}` — the call form works anywhere, the loop
included — and so is your snippet, as `{% raw %}{% component('StripeProvider', …) %}{% endraw %}`. Loop
over `data.products.items`, drop a real Stripe `CardElement` straight into each card body (one provider
per card, since two `CardElement`s can't share an `<Elements>`), and lay them out in a
`{% raw %}{% component('aardvark', 'cardGrid', …) %}{% endraw %}`:

{% raw %}
```aardvark
{%
cards = ''
for p in data.products.items:
    field = component('StripeProvider', publishableKey='pk_test_…', deferred=False,
        children=component('stripe', 'CardElement'))
    cards += component('aardvark', 'card', variant='plain', icon=p.icon, iconColor=p.color,
        title=p.name, subtitle=p.blurb, badge='$' + str(p.price), cta='Buy now', children=field)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 2, 'lg': 3}, children=cards))
%}
```
{% endraw %}

renders, live:

<div style="margin: 1.5rem 0;">
{%
shop_cards = ''
for p in data.products.items:
    field = component('StripeProvider', publishableKey='pk_test_TYooMQauvdEDq54NiTphI7jx', deferred=False,
        children=component('stripe', 'CardElement'))
    shop_cards += component('aardvark', 'card', variant='plain', icon=p.icon, iconColor=p.color,
        title=p.name, subtitle=p.blurb, badge='$' + str(p.price), cta='Buy now', children=field)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 2, 'lg': 3}, children=shop_cards))
%}
</div>

A data file, the built-in card, and Stripe — composed in a short loop. Add a row to the YAML and a
fourth card appears. That's the point of opening `{% raw %}{% component() %}{% endraw %}` to any React
library: your content and your data drive a real, interactive UI.

## Options

Each library entry accepts a few extras beyond `package` and `components`:

- **`import`** — how the package exposes its components: `named` (the default — `import { X }`),
  `default` (a single default export; name it with `defaultExport`), or `namespace`
  (`import * as Lib`, which pulls the whole package in, so reach for it only when you must).
- **`css`** — a list of stylesheet imports the library needs (e.g. a design system's base CSS). They
  load with the rest of the island styles, on the client.
- **`ssr: false`** — skip this library during the build-time prerender. Use it for a browser-only
  library (one that touches `window` at import time); its islands then render on the client only.

If a declared package isn't installed, the build prints a warning and that library's components
render as a harmless comment rather than failing the whole build — run the matching `npm install`.

## CSS Selectors

A library component mounts inside an island wrapper that carries **both** the library key, in `data-aardvark-island`, so you can target one library's component without colliding with a same-named one elsewhere. The component itself renders its own markup (Stripe's Elements, for instance, mount a cross-origin iframe rather than Mantine-classed nodes).

{% raw %}
```css
[data-aardvark-island="PaymentElement"]                         /* every PaymentElement */
[data-aardvark-lib="stripe"][data-aardvark-island="PaymentElement"]  /* only the stripe library's */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) onto the rendered element —
pass it in the `component()` call form. (No standalone preview here: a `PaymentElement` only
renders inside a Stripe `Elements` provider.)

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% component('stripe', 'PaymentElement', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''}) %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('stripe', 'PaymentElement', attr={'onclick': '''
const value = this.tagName;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}
