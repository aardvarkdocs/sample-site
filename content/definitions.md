---
description: definitions.yaml is aardvark's translation memory and reader-facing glossary in one file — consistent terminology for vark build --translate, and hover-card definitions for readers.
icon: fa-solid fa-book
menu: docs
title: Definitions & glossary
weight: 54
---

# Definitions & glossary

`definitions.yaml` is aardvark's **translation memory** — the single source of truth for how terms, acronyms, and product names are handled across languages. Every entry is injected as a grounding instruction whenever `vark build --translate` runs, so the model never guesses how to render your vocabulary.

Entries marked `public: true` do double duty: they also power a **reader-facing glossary**, adding a dotted-underline hover card to the first mention of each term on every page, and optionally generating a standalone glossary page.

## Setup

Point `aardvark.config.yaml` at your file:

```yaml
definitions: definitions.yaml
```

The path is relative to your project root. The file is optional — if it's absent, both features are silently skipped.

## File format

```yaml
terms:
  - term: island
    definition: A self-contained interactive React component rendered in the browser.
    public: true

  - term: Static Site Generator
    acronym: SSG
    definition: A tool that turns source files into static HTML pages.
    public: true

  - term: build
    definition: The process that turns Markdown sources into static HTML output.
```

Each entry supports:

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `term` | yes | — | The canonical term (case-preserved). |
| `definition` | no | `""` | Plain-text definition. For public terms: shown in the hover card and on the glossary page (a public term with no definition emits a build warning). For all terms: serves as a context note in the translation prompt when no exact translation is provided. |
| `acronym` | no | — | Optional acronym. The hover card title becomes "Term (ACRONYM)". |
| `public` | no | `false` | Show a hover card on first mention + list on the optional glossary page. |
| `translate` | no | `true` | Set `false` to keep the term verbatim in every language (product names, trademarks). |
| `translations` | no | — | Per-language overrides (see below). |

## Per-language overrides

Use `translations:` to supply translated terms, acronyms, or definitions for specific languages:

```yaml
terms:
  - term: Static Site Generator
    acronym: SSG
    definition: A tool that turns source files into static HTML pages.
    public: true
    translations:
      fr:
        term: générateur de site statique
        acronym: GSS
        definition: Un outil qui transforme des fichiers source en pages HTML statiques.

  - term: Markdown
    definition: The lightweight markup language these docs are authored in.
    public: true
    translate: false          # keep "Markdown" verbatim in every language

  - term: build
    definition: The process that turns Markdown sources into static HTML output.
    translations:
      fr: compilation         # string shorthand — equivalent to {term: compilation}
```

A `translations.<code>` value can be:

- **A string** — shorthand for `{term: <string>}`. Useful for simple term substitutions.
- **A mapping** — any of `term`, `acronym`, `definition`. Omitted keys fall back to the base values.
- **`false`** — keep the base term and acronym verbatim for that language (same as `translate: false` but per-language). Also accepted as `{do_not_translate: true}`.

## Reader-facing hover cards

For every entry with `public: true`, aardvark wraps the **first mention** of the term on each page in a dotted-underline span. Hovering (or tabbing to) the term shows a card with the title and definition.

A few rules govern which text is decorated:

- **First occurrence only** — both the term form and the acronym form each get decorated once per page independently, so "SSG" gets a card and "Static Site Generator" gets a card.
- **Headings are skipped** — a dotted underline in an `<h2>` is visual noise.
- **Link text is skipped** — the term's underline would conflict with the link's underline.
- **Code is never touched** — inline code and fenced code blocks are their own token type and are never scanned.
- **Matching** — terms match case-insensitively; acronyms match case-sensitively (so `SSG` matches but `ssg` does not). Longer surfaces win over shorter ones they contain. Word boundaries are enforced ("`island`" never matches inside "`islander`").

The card title is "Term (ACRONYM)" when an acronym is present, otherwise just "Term". On non-English pages, the localized term, acronym, and definition are used — a French page shows the French card.

### Keyboard access

Tab to a glossary term to reveal the card immediately. Press Escape to close it without moving focus. This satisfies WCAG 1.4.13 (content on hover or focus).

## Optional standalone glossary page

To generate a standalone glossary page, add a `page:` block to `definitions.yaml`:

```yaml
page:
  enabled: true
  url: /definitions/glossary/
  frontmatter:
    title: Glossary
    menu: docs
    weight: 57
```

The page is generated for each content language your site has. A French site also gets `/fr/definitions/glossary/` with the French terms. The page body lists all public terms alphabetically as `## Term (ACRONYM)` headings followed by their definitions — so each term gets an anchor and a TOC entry.

The `frontmatter:` block accepts the same front matter any content page uses: `title`, `menu`, `parent`, `weight`, `description`, `icon`, and so on. Set `menu` + `parent` to slot the page into your navigation.

A few safety checks apply:

- `url` must be a non-root path (not `/`) — the homepage can never be overwritten.
- `url` must contain no `.` or `..` segments.
- If a content page already occupies the URL, the generated page is skipped with a warning.
- The glossary page itself is never self-decorated — its term list doesn't get hover cards.

## Translation memory

`definitions.yaml` is aardvark's translation memory. Every entry — not just public ones — is compiled into a set of grounding instructions that prefix the model's prompt for each page translation. This is what keeps your domain vocabulary consistent: the model follows explicit rules rather than re-deriving terminology page by page.

The prompt lines aardvark generates depend on what each entry has:

| Entry has | Prompt instruction |
| --- | --- |
| `translations.fr.term` (exact translation) | `"Static Site Generator" must be translated as "générateur de site statique" (A tool that turns source files into static HTML pages.)` |
| `translations.fr.acronym` (different acronym) | `render the acronym "SSG" as "GSS"` |
| No translation, but a `definition` | `"island": A self-contained interactive React component rendered in the browser.` |
| `translate: false` (no acronym) | `"Markdown" must NOT be translated; keep it verbatim (The lightweight markup language...)` |
| `translate: false` + `acronym` | Two lines: the verbatim-keep instruction above, plus `keep the acronym "ADV" verbatim` |
| Per-language `false` or `do_not_translate: true` | Same verbatim-keep instruction(s), for that language only |

**What to put in the file:**

- Terms with exact target-language translations: supply `translations.<code>.term` (and `acronym` if it differs). The model is told exactly what to write.
- Terms without translations but with a `definition`: the definition serves as a context note. The model can freely translate the term but understands what it means — useful for common domain vocabulary.
- Product names, brand names, and trademarks: set `translate: false` (all languages) or `translations.<code>: false` (one language). The model keeps them verbatim.
- Acronyms that expand differently in each language: use `translations.<code>.acronym`.

Non-public entries ground translation just as well as public ones. The `public` flag only controls the reader-facing hover card and glossary page — it has no effect on translation.

```bash
# Translate missing/changed pages (needs OPENROUTER_API_KEY):
vark build --translate

# Re-translate everything, overwriting existing translations:
vark build --retranslate-all
```

The multi-language setup (source directories, language codes) is configured under `languages:` in `aardvark.config.yaml`. `definitions.yaml` is the terminology layer on top of that — it says *how* to handle specific words, not *what languages* the site has.

## Migrating from `languages.translationMemory`

The old `languages.translationMemory` key is no longer read. If you have it in your config, move it to a top-level `definitions:` key. The file format has also changed: instead of a plain term→translation map, entries are now full objects with optional acronym, definition, and `public` flag.

```yaml
# Before (no longer works):
languages:
  translationMemory: translation-memory.yaml

# After:
definitions: definitions.yaml
```

A build warning is emitted while the old key is still present so you don't silently lose translation grounding.
