---
title: Plans & pricing
navtitle: Plans
description: >-
  aardvark is free and open. Paid plans add managed hosting, seats, support,
  and a monthly included-AI allowance metered in real dollars — never opaque credits.
icon: fa-solid fa-tags
menu: pricing
weight: 1
mode: full
---

<style>
/* Plan-card polish, scoped to this page's grid. Literal values only — a var()/color-mix here
   would break the whole-site PDF (see the homepage's identical warning). */
.plan-grid [data-aardvark-card] .aardvark-card-title,
.aardvark-content .plan-grid [data-aardvark-card] a.aardvark-card-link.aardvark-card-title {
  font-size: 1.5rem;
}
.plan-grid [data-aardvark-card] ul {
  padding-left: 1.05em;
  margin: 0.5em 0;
}
</style>

aardvark is **free and open**: author, build, and self-host your docs at no cost, forever.
Paid plans are for teams that want a **predictable monthly bill** — managed hosting, more
seats, real support, and a monthly **included-AI allowance in dollars**, keeping pricing
simple and dollar-based. Your aardvark key also grants you access to hundreds of AI models
you can use strategically to control costs as you go.

<div class="plan-grid" markdown="1">

{% cardGrid cols=4 %}
{% card title="Free" icon="sparkles" accent="gray" href="https://gateway.aardvarkdocs.com/dashboard" cta="Start free" %}
**$0** — pay as you go

Bring your own hosting, pay only for the AI you use.

- Self-host anywhere, full feature set
- All components, themes, agent discovery
- Metered AI at [published per-model prices](/pricing/models/)
- Prepaid balance + auto top-up
- 1 seat · community support
{% endCard %}
{% card title="Pro" icon="rocket" accent="grape" href="https://gateway.aardvarkdocs.com/dashboard" cta="Subscribe" %}
**$99** per month
_$87.20/mo billed annually_

We host and run your docs.

- **Managed hosting** — custom domain, SSL, previews
- **$40/mo of AI included**, at a ≈7% member discount
- 5 seats included, add more at $10/seat
- Insights analytics
- Community support
{% endCard %}
{% card title="Business" icon="building" accent="violet" href="https://gateway.aardvarkdocs.com/dashboard" cta="Subscribe" %}
**$349** per month
_$303.20/mo billed annually_

Robust and self-serve — no sales call.

- Everything in Pro, plus:
- **$120/mo of AI included** — 3× Pro — at a ≈13% discount
- 12 seats included, add more at $15/seat
- SSO, RBAC, audit-log export
- **Priority email support**, next-business-day target
{% endCard %}
{% card title="Enterprise" icon="shield-lock" accent="indigo" href="https://gateway.aardvarkdocs.com/dashboard" cta="Subscribe" %}
**$2,750** per month

Everything in Business, plus:

- **$750/mo of AI included** — 18.75× Pro — at a 20% discount
- **Unlimited customization requests** — our engineering team on call to build any feature you need
- SSO + SCIM provisioning
- Unlimited seats
- Shared Slack access for realtime support and requests, 7 days a week
{% endCard %}
{% endCardGrid %}

</div>

Every model's real cost per answer, on every plan: **[the pricing table](/pricing/models/)**.

## Compare plans

| | Free | Pro | Business | Enterprise |
|---|---|---|---|---|
| **Price** | $0 | $99/mo | $349/mo | $2,750/mo |
| **Billed annually** | — | $1,046.40/yr (≈$87.20/mo) | $3,638.40/yr (≈$303.20/mo) | $28,200/yr (≈$2,350/mo) |
| **Included AI** every month (member discount) | — | $40 at ≈7% off | $120 at ≈13% off (3× Pro) | $750 at 20% off (18.75× Pro) |
| **Seats** | 1 | 5 | 12 | Unlimited |
| **Hosting** | Self-host only | Managed or self-hosted | Managed or self-hosted | Managed or self-hosted |
| **Analytics** | Basic | Insights | Insights + export | Insights + export |
| **SSO / RBAC / audit export** | — | — | Included | + SCIM |
| **Customization** | — | — | — | Unlimited requests |
| **Support** | Community | Community | Priority email | Realtime shared Slack |
| **Self-hosting, agent discovery, PDF, all components** | Included | Included | Included | Included |

Nothing core is paywalled: self-hosting, Markdown-for-Agents, `llms.txt`, the agent-skills
index, whole-site PDF, and every component and theme ship on **Free**. Paid plans add
hosting, seats, support, controls — and cheaper AI.

## The honest AI meter

Every competitor meters AI in credits you can't reason about. aardvark bills AI in
**dollars**: [the pricing table](/pricing/models/) publishes what every model costs per
answer on every plan — real figures, no conversion math. Subscribers pay less per metered
dollar the more they commit (≈7% off on Pro, ≈13% on Business, 20% on Enterprise), on top
of the allowance their plan includes. All of it runs on **aardvark's managed keys** — you
never create, rotate, or secure a model-provider key on any plan.

Your included allowance is denominated in those same billed dollars:

- The dashboard shows **dollars included, dollars used**, your own trailing burn rate, and
  an estimated depletion date — no "≈N answers" marketing math.
- Unused allowance **rolls over one month**, up to 2× your monthly amount.
- Answers served by `:free` models never bill and never touch your allowance.

## When the included AI runs out

**Cap-and-hold is the default.** Paid AI pauses at your cap and you're notified, so it
cannot add further overflow charges. Your "max possible bill" is the subscription price
plus any fixed add-on-seat charges and any overflow already incurred this month.
(Usage-based GitHub Automations compute, if you use it, draws your prepaid balance
separately and isn't included in that figure.) Prefer to stay unstuck? Two self-serve
options, both under your control:

1. **Fall back to your balance** — flip overflow to draw from your prepaid balance at your
   plan's discounted member pricing, with a cap you set (raising it past 2× your allowance
   asks for an explicit acknowledgment).
2. **Auto top-up** — keep the balance funded automatically with your chosen amount and
   threshold, so overflow never stalls.

## Annual billing

Annual plans take **20% off the platform fee** — the included-AI allowance is funded
monthly at full value either way (it's real usage, not a discountable line item), so the
effective saving is about 12–13% off the yearly total — ~12% on Pro, ~13% on Business
(the bigger a plan's fee is relative to its bundled allowance, the more of the bill the
discount reaches). Pro: $1,046.40/yr (vs. $1,188 at par, ~12% off). Business: $3,638.40/yr
(vs. $4,188, ~13% off). The allowance still resets every month on annual plans.

## FAQ

Billing is designed to be predictable and never to surprise you. Here's exactly what happens
in the situations people ask about most.

Every question — and its exact answer — now lives in the searchable support
knowledge base, organized by category with the most-asked questions up top.

{% card title="Browse the support knowledge base" icon="lifebuoy" href="/support/" cta="Visit support" %}
Included AI, overflow, plan changes, payments and safety limits, seats and hosting —
every billing question answered, straight from the team.
{% endCard %}
