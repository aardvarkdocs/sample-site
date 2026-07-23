---
title: aardvark cloud gateway
navtitle: Cloud gateway
description: The managed metering proxy behind the built-in Ask AI assistant — a prepaid
  balance with customer self-funding via Stripe card-on-file and auto-top-up.
icon: fa-solid fa-cloud
menu: ai
weight: 20
---

# aardvark cloud gateway

The **aardvark cloud gateway** is the managed metering proxy that sits behind the built-in
**"Ask AI"** assistant. The assistant in a reader's browser never talks to a model directly — it
calls the gateway, which proxies the request to the model behind aardvark's managed keys,
**meters** the spend at aardvark's published [per-model rates](/pricing/models/)
(subscription plans meter at a member discount), and **cuts off** an account that has run out
of credit.

This page is conceptual and how-to, for both **customers** (whose docs site uses the gateway) and
**operators** (who run a gateway). For end-to-end deployment and Stripe setup, see
`gateway/DEPLOYMENT.md` in the gateway source.

> The gateway is **optional**. A site can point the assistant at your own OpenRouter key, or skip
> the assistant entirely. The gateway is what you reach for when you want **metering, per-customer
> balances, and billing** in front of the model.

## The prepaid model

Every account holds a **prepaid balance**. On the **Free / pay-as-you-go** tier, each metered chat
request **debits** the balance at the published per-model rate; when the balance is exhausted, the
gateway stops serving that account's **paid** chat requests until it is funded again — so spend can
never run away past what the account holds. (A `:free` model always answers at $0 and never touches
the balance.)

**Subscribers** add a monthly **included-AI grant** on top of this. A metered request drains the
grant first (any rollover, then the current period's grant) and only then — per the account's
**overflow policy** — the prepaid balance:

- **Cap-and-hold** (the default): when the grant is spent, paid AI **pauses** and readers fall back
  to `:free` answers **even while the prepaid balance is still funded** — so the bill stays
  predictable. Adding funds does **not** resume paid AI here; the next period's grant (or a plan
  change) does.
- **Fall back to your balance** (opt-in): overflow draws the prepaid balance at the subscriber's
  member rate, up to a customer-set **cap**, then pauses like cap-and-hold.

So for a subscriber, "out of funds" and "included AI used up" are **distinct** states with different
recovery actions — the dashboard says which one an account is in.

An account is funded in one of two ways:

- **Operator top-up** — the operator adds credit directly (an admin action). Always available, and
  the only option when Stripe is not configured.
- **Customer self-funding** — the customer stores a card and funds their own balance, described
  next.

## Customer self-funding (card-on-file + auto-top-up)

When the operator has enabled Stripe, a customer manages their own funding from the **Billing &
Auto Top-Up** section of the gateway **dashboard** (open `/dashboard` on the gateway and sign in via
the magic link emailed to the account owner — the dashboard is email-login only).

**Dashboard roles.** Team accounts have three roles: **owner**, **admin**, and **member**. Owners and
admins see the **Billing** tab; plain members do not, and direct Billing links fall back to the
dashboard overview. Billing reads and mutations — saved card, auto-top-up, manual top-ups, and the
self-serve lift for a billing-driven pause — are enforced server-side for owners and admins only.

**Store a card.** Adding a card sends the customer to **hosted Stripe Checkout** — a full-page
redirect to Stripe's own form. Card details are entered on Stripe, never on the dashboard; the
gateway stores only a token for the saved card plus the display brand / last-4 / expiry. There is no
card form embedded in the page.

**Enable auto-top-up.** With a card on file, the customer turns on auto-top-up by choosing two
numbers:

- an **amount** to charge per top-up, and
- a **trigger threshold** — the balance level that fires a top-up.

The threshold must be **below** the amount, so each top-up lifts the balance back above the line.
When the balance crosses the threshold, the gateway charges the saved card the chosen amount and
credits the balance — off-session, with no reader interaction.

**Top up now.** The same section has a manual **Top up now** button for a one-off charge of the
saved card.

### Safety properties

Auto-top-up is built to be safe to leave on:

- **Charged at most once per low-balance episode.** Overlapping triggers — or a manual *Top up now*
  firing at the same moment — cannot double-charge the card.
- **Self-disables after repeated declines.** A consistently failing card stops being retried on
  every crossing, and the customer is alerted to fix it.
- **Whole-cent amounts, with a minimum** (a **$10** floor by default).
- **Durable crediting.** A captured charge credits the balance exactly once, even if something
  fails between the charge and the credit.

Removing the card (also from the Billing section) disables auto-top-up.

## For operators: enabling Stripe

The gateway runs as a prepaid-only metering proxy out of the box. Customer self-funding is **off
until you configure Stripe**, and turning it on is, in short:

1. Set two Worker secrets — `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
2. Create a Stripe **webhook** pointing at `…/v1/stripe/webhook`, subscribed to all seven events the
   gateway handles — the two PaymentIntent ones that back top-ups, plus the five subscription-lifecycle
   events that back the monthly plans:

   ```text
   payment_intent.succeeded          payment_intent.payment_failed
   customer.subscription.created     customer.subscription.updated     customer.subscription.deleted
   invoice.paid                      invoice.payment_failed
   ```

   The webhook is the durable credit backstop. If you already had an endpoint from before the
   subscription work, **edit it to add the five subscription events** — without them plan invoices
   never flip an account to `past_due` or recover it, and a Stripe-side cancel won't downgrade the
   account until the grace sweep catches up.
3. Apply the gateway's payment **database migrations** before deploying the updated Worker.

With Stripe left unconfigured the gateway behaves exactly as before — operator top-ups only. Full
steps, optional tuning, and a test-mode walkthrough are in `gateway/DEPLOYMENT.md`.

## Reader attachments

Readers can attach **files** to a question — images, PDFs, and text/code/markdown — from the
assistant's composer (a paperclip button, drag-and-drop onto the panel, or paste). This is
controlled by `ai.assistant.attachments` and is **on by default**.

```yaml
ai:
  assistant:
    enabled: true
    model: "~anthropic/claude-sonnet-latest"   # must be vision/file-capable (see below)
    attachments:
      enabled: true        # master switch — `attachments: false` is the shorthand to turn it off
      maxFiles: 4          # per-message file cap (default 4)
      maxFileSizeMb: 10    # per-file size cap in MB (default 10)
      pdfEngine: pdf-text  # PDF parsing: pdf-text (default) | mistral-ocr (scanned) | native
```

Beyond the per-file cap, the picker also enforces a **combined** image/PDF budget (base64-encoded)
that matches the gateway's hard per-request limit, so it rejects a set that would always be refused
upstream rather than failing mid-send. (Text attachments are inlined as text and don't count toward
that budget.)

How each kind is sent to the model:

- **Images** are sent as image content (base64) for the model to view.
- **PDFs** are sent as a file part with a parsing plugin; `pdfEngine: pdf-text` extracts the text
  cheaply, while `mistral-ocr` is for **scanned** PDFs (image-only pages) and costs more.
- **Text / code / markdown / CSV / JSON** are read in the browser and inlined as text — the cheapest
  path, and it needs no special model support.

### Model capability

The assistant uses one **build-time** model (`ai.assistant.model`). Attachments only work if that
model can accept them — point it at a **vision/file-capable** model (most current Claude and GPT
models qualify). A model that can't will **error or ignore** the attachment, so choose the model
deliberately when you leave attachments on.

### Cost

Attachments **spend more**. Images and PDFs cost far more tokens than the equivalent text, and a
large file can dominate a turn's cost. Because attachments are on by default, budget for the extra
spend — or lower the caps, narrow `accept`, or set `attachments: false`. The gateway's spend cap
remains the hard ceiling: an attachment-aware reserve holds a larger amount up front for a turn that
carries files, and the true cost is settled when the turn completes.

> To keep follow-up turns cheap, an attachment's data is sent **only on the turn it's added** — the
> file isn't replayed on later questions in the same conversation. The model can't re-inspect a file
> on a follow-up; re-attach it if you need it again. (Rehydrated history after a page navigation keeps
> the file's name only, not its contents.)

### Security & privacy

- **Untrusted content / prompt injection.** A file's contents (including extracted PDF text or OCR)
  enter the model's context and can carry injected instructions. This is inherent to letting readers
  supply content; treat assistant answers accordingly.
- **Privacy.** Attachments are sent to the model provider (via the gateway to OpenRouter) to answer
  the question. Stored chat transcripts keep the **question text only**, not attachment bytes.
- **Payload limits.** The client caps file count and size; the gateway also enforces per-request
  count and byte limits, so an oversized upload is rejected rather than billed.

## Related

- [AI assistant & analytics](/ai-assistant/) — enabling the built-in Ask AI panel for readers, and
  the operator analytics dashboard (Insights, Conversations, digests) it feeds.
- [Build-time AI](/ai-features/) — opt-in features that run during the build, also via OpenRouter.
- [Self-hosting & MCP](/self-hosting/) — running a built site (and its MCP server) yourself.
