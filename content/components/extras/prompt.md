---
title: "Prompt"
description: "The built-in prompt tag — a copyable AI-prompt block: the prompt text with a copy button plus 'Open in ChatGPT / Claude / Cursor' deep-link buttons that pre-fill the prompt in that tool. Usage, actions, and a live example."
---

# Prompt

A **built-in** tag that renders a copyable **AI-prompt block**: your prompt text in a tidy
code surface with a **copy** button and one-click **"Open in …"** deep links that launch
ChatGPT, Claude, or Cursor with the prompt already filled in. It's ideal for docs that hand the
reader a ready-to-run prompt — a "fix this with AI", a scaffolding request, a review checklist —
so they can send it to their assistant without copy-pasting by hand.

The body is the **literal prompt text**: it's kept **verbatim** — never run through Markdown — so
line breaks, blank lines, and any code or angle brackets survive exactly as written (that's the
text that gets copied and encoded into each deep link). The `title` is an optional heading, and
`actions` chooses which buttons appear. Close it with `{% raw %}{% endPrompt %}{% endraw %}`.

Use it as `{% raw %}{% prompt %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'prompt', …)`.

## Usage

Put the prompt between `{% raw %}{% prompt %}{% endraw %}` and
`{% raw %}{% endPrompt %}{% endraw %}`:

{% prompt title="Review this pull request" %}
You are a senior engineer reviewing a pull request. For each file in the diff:

1. Summarize what changed in one sentence.
2. Flag any correctness bugs, with the line and a suggested fix.
3. Note missing tests or docs.

Be concise and specific. Do not restate the diff.
{% endPrompt %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% prompt title="Review this pull request" %}
You are a senior engineer reviewing a pull request. For each file in the diff:

1. Summarize what changed in one sentence.
2. Flag any correctness bugs, with the line and a suggested fix.
3. Note missing tests or docs.

Be concise and specific. Do not restate the diff.
{% endPrompt %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'prompt', title='Review this pull request',
          children=(
              'You are a senior engineer reviewing a pull request. '
              'For each file in the diff:\n\n'
              '1. Summarize what changed in one sentence.\n'
              '2. Flag any correctness bugs, with the line and a suggested fix.\n'
              '3. Note missing tests or docs.\n\n'
              'Be concise and specific. Do not restate the diff.'))
```
{% endAccordionSection %}
{% endAccordion %}

The **Copy** button copies the whole prompt to the clipboard; each **Open in …** button URL-encodes
the prompt into that tool's "new chat" link — `https://chatgpt.com/?q=…`,
`https://claude.ai/new?q=…`, and Cursor's `cursor://…?text=…` app deep link.

## Choosing the buttons

`actions` is a comma-separated list of the buttons to show, in order. Valid values are `copy`,
`chatgpt`, `claude`, and `cursor`; the default is all four (`copy, chatgpt, claude, cursor`). Pass a
shorter list to trim or reorder them — here, just **Copy** and **Claude**:

{% prompt title="Scaffold a REST endpoint" actions="copy, claude" %}
Add a new REST endpoint POST /widgets to this codebase.

- Validate the request body against the existing schema conventions.
- Persist with the current ORM/data layer.
- Return 201 with the created resource, 400 on validation errors.
- Include a unit test that covers the happy path and one validation failure.
{% endPrompt %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% prompt title="Scaffold a REST endpoint" actions="copy, claude" %}
Add a new REST endpoint POST /widgets to this codebase.

- Validate the request body against the existing schema conventions.
- Persist with the current ORM/data layer.
- Return 201 with the created resource, 400 on validation errors.
- Include a unit test that covers the happy path and one validation failure.
{% endPrompt %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'prompt', title='Scaffold a REST endpoint',
          actions=['copy', 'claude'],
          children=(
              'Add a new REST endpoint POST /widgets to this codebase.\n\n'
              '- Validate the request body against the existing schema conventions.\n'
              '- Persist with the current ORM/data layer.\n'
              '- Return 201 with the created resource, 400 on validation errors.\n'
              '- Include a unit test that covers the happy path and one validation failure.'))
```
{% endAccordionSection %}
{% endAccordion %}

## Without a title

`title` is optional — omit it and the block shows a plain **Prompt** label above the text:

{% prompt %}
Summarize the following text in three bullet points, then give it a one-line title.
{% endPrompt %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% prompt %}
Summarize the following text in three bullet points, then give it a one-line title.
{% endPrompt %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'prompt',
          children='Summarize the following text in three bullet points, then give it a one-line title.')
```
{% endAccordionSection %}
{% endAccordion %}

## Verbatim body

The body is **not** Markdown — it's copied exactly as written, so `**stars**`, `# hashes`,
`<angle brackets>`, and fenced code all stay literal. If your prompt contains aardvark template
syntax (a literal `{% raw %}{% … %}{% endraw %}` or `{% raw %}{{ … }}{% endraw %}`), wrap that
part in a **raw block** so the template engine leaves it alone — the same
`{% raw %}{% raw %}{% endraw %}` … raw-guard convention used everywhere else in these docs.

## Options

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | Any string | Optional heading shown above the prompt. Omit it for a plain **Prompt** label. |
| `actions` | Comma-separated list of `copy`, `chatgpt`, `claude`, `cursor` | Which buttons to show, in order. Default `copy, chatgpt, claude, cursor` (all four). Unknown values are ignored; an empty/all-unknown list falls back to just **Copy**. |
| `attr` | `{…}` | Raw HTML attributes forwarded onto the rendered block root (see below). |
| *(body)* | Verbatim text | The prompt itself, written between `{% raw %}{% prompt %}{% endraw %}` and `{% raw %}{% endPrompt %}{% endraw %}` (`children=` from Python). Kept exactly as written — never Markdown-rendered. |

## CSS Selectors

Each prompt carries `data-aardvark-island="Prompt"` on its wrapper and renders its own class
names — target the block, the header, the buttons, or the prompt text.

{% raw %}
```css
[data-aardvark-island="Prompt"]              /* the island wrapper */
[data-aardvark-island="Prompt"] .aardvark-prompt        /* the bordered block */
[data-aardvark-island="Prompt"] .aardvark-prompt-head   /* the title / buttons row */
[data-aardvark-island="Prompt"] .aardvark-prompt-action /* a copy / open-in button */
[data-aardvark-island="Prompt"] .aardvark-prompt-text   /* the verbatim prompt <pre> */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered block root.

{% prompt title="Explain this error" attr={'data-analytics': 'ai-prompt', 'aria-label': 'AI prompt: explain error'} %}
Explain the following error message in plain language, then list the two most likely causes and how to check each.
{% endPrompt %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% prompt title="Explain this error" attr={'data-analytics': 'ai-prompt', 'aria-label': 'AI prompt: explain error'} %}
Explain the following error message in plain language, then list the two most likely causes and how to check each.
{% endPrompt %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'prompt', title='Explain this error',
          children='Explain the following error message in plain language, then list the two most likely causes and how to check each.',
          attr={'data-analytics': 'ai-prompt', 'aria-label': 'AI prompt: explain error'})
```
{% endAccordionSection %}
{% endAccordion %}
