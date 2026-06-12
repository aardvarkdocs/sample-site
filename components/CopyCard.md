---
name: CopyCard
description: A copy-to-clipboard button — proof a definition can blend Python, a Mantine
  component, CSS, an attr handler, and a top-level script in one place.
params:
  label:
    type: string
    required: true
  text:
    type: string
    required: true
  tone:
    type: string
    default: blue
---
<style>.copycard-note { font-size: 0.8rem; opacity: 0.65; margin-left: 0.5rem; }</style>
{% component('Button', children=label, color=tone, attr={'data-copy': text, 'onclick': "navigator.clipboard.writeText(this.dataset.copy); this.textContent = 'Copied!'"}) %}
<span class="copycard-note">{% len(text) %} characters · click to copy</span>
<script>console.log('CopyCard ready');</script>
