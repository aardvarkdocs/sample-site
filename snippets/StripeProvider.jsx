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
