---
name: RunnerMinutePrice
description: >-
  The billed price, in USD, of one started Docs Quality Checks runner minute: the
  `compute_per_minute_usd` basis in data/pricing.yaml times its `rate`, rounded to the
  micro-dollar the gateway's ledger bills in. The Pricing and Docs Quality Checks pages both
  quote it through this tag, so the formula has one copy.
---
{% round(data.pricing.compute_per_minute_usd * data.pricing.rate, 6) %}
