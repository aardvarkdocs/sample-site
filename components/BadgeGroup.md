---
name: BadgeGroup
description: A horizontal Group of Badges — the nested component() chain, named once and reused.
params:
  gap:
    type: string
    default: xs
---
{% component('Group', gap=gap, children=children) %}
