---
description: How aardvark sites meet WCAG 2.1 AA — landmarks, keyboard navigation, and a build-time contrast check.
icon: fa-solid fa-universal-access
menu: docs
title: Accessibility
weight: 55
---

# Accessibility

Every site aardvark generates targets **WCAG 2.1 Level AA** out of the box. The chrome
ships with semantic landmarks, a skip link, visible keyboard focus, screen-reader
announcements, and reduced-motion support — and the build flags color-contrast problems
in your theme before they reach readers.

## Standards we follow

- **WCAG 2.1 Level AA** — the contrast, keyboard, and name/role/value success criteria.
- **Keyboard-first** — every interactive control is reachable and operable without a mouse.
- **Screen-reader friendly** — landmarks, current-state cues, and a live region for dynamic updates.
- **Respects user preferences** — `prefers-reduced-motion` and `prefers-color-scheme`.

## Built-in accessibility features

- **Skip to content** — the first <kbd>Tab</kbd> stop on every page jumps past the header
  and navigation straight to the main content.
- **Landmark regions** — the banner, the section tabs, the documentation sidebar, the
  breadcrumb trail, the main content, and the "On this page" list are each exposed as a
  labelled region, so screen-reader users can jump between them.
- **Visible focus** — every link, button, and control shows a clear focus ring when you
  navigate with the keyboard.
- **State cues** — the current page (sidebar), the current section (on-this-page), the in-view
  API operation (sidebar), expanded/collapsed sections, and sorted table columns are announced,
  not just shown with color.
- **Live announcements** — filtering a table announces its result ("No matching rows") to
  assistive technology.
- **API response examples** — the API reference shows a response's example body as a collapsible
  JSON tree; its expand/collapse-all and copy controls are standard focusable buttons, so a
  keyboard user can expand and copy the whole body without a mouse. No new keyboard shortcut is
  introduced, and without the optional viewer it falls back to a plain code block.
- **Links beyond color** — body links are underlined, so they're distinguishable without
  relying on color.
- **Reduced motion** — scroll-spy, tab, and reveal animations are disabled when your system
  asks to reduce motion.
- **Password unlock form** — a [password-protected](/protected-pages/) page's unlock prompt is
  a real labelled `<form>`: it's fully keyboard-operable (the field autofocuses, <kbd>Enter</kbd>
  submits), shows a visible focus ring, and announces a wrong-password message through an
  `aria-live` region. No new keyboard shortcut is introduced.

## Keyboard shortcuts

The chrome and the interactive components are fully keyboard-operable:

| Where | Keys | Action |
|-------|------|--------|
| Anywhere (on load) | <kbd>Tab</kbd> | Focus **Skip to main content**; <kbd>Enter</kbd> jumps to the article |
| Sidebar navigation | <kbd>→</kbd> / <kbd>←</kbd> | Expand / collapse the focused section |
| Sidebar section toggle | <kbd>Enter</kbd> / <kbd>Space</kbd> | Open or close the section |
| Section tab menu (header) | <kbd>Esc</kbd> | Close the dropdown and return focus to its button |
| Search dialog | type · <kbd>↑</kbd> / <kbd>↓</kbd> · <kbd>Enter</kbd> · <kbd>Esc</kbd> | Search the index, move through visible results, open the focused result, or close the dialog |
| Search path filter | <kbd>Tab</kbd> · type · <kbd>Enter</kbd> / <kbd>Space</kbd> · <kbd>Backspace</kbd> · <kbd>Esc</kbd> | Reach the path filter, search path options, select or deselect paths, remove a selected path, or close the dropdown |
| Table column header | <kbd>Enter</kbd> / <kbd>Space</kbd> | Sort by that column |
| Table filter box | type to filter | Show only matching rows (live) |
| Tabbed content | <kbd>←</kbd> <kbd>→</kbd> <kbd>Home</kbd> <kbd>End</kbd> | Move between / jump to first or last tab |
| Accordion / API sections | <kbd>Enter</kbd> / <kbd>Space</kbd> | Expand or collapse |
| File tree | <kbd>↑</kbd> <kbd>↓</kbd> <kbd>→</kbd> <kbd>←</kbd> <kbd>Home</kbd> <kbd>End</kbd> | Move focus; expand/collapse a folder or step in/out; jump to first/last row |
| File tree — activate row | <kbd>Enter</kbd> / <kbd>Space</kbd> · <kbd>Esc</kbd> | Toggle a folder, open a file's code in a modal, or follow a linked file · close the modal |
| Copy-code button | <kbd>Enter</kbd> / <kbd>Space</kbd> | Copy the snippet |
| Zoomable image | <kbd>Enter</kbd> / <kbd>Space</kbd> · <kbd>Esc</kbd> | Open the lightbox · close it |
| Glossary term (dotted underline) | <kbd>Tab</kbd> · <kbd>Esc</kbd> | Focus the term to show its definition card · close the card |
| Twoslash token (typed code) | <kbd>Tab</kbd> | Focus a token in a [Twoslash](/authoring/twoslash/) code block to reveal its inferred type; <kbd>Tab</kbd> away to hide |
| "Was this page helpful?" stars | <kbd>←</kbd> / <kbd>→</kbd> | Change the rating |
| Reader survey card (if enabled) | <kbd>Tab</kbd> · arrows · <kbd>Enter</kbd> / <kbd>Space</kbd> | Tab between the answers and **Submit**; arrows move within a choice group or the rating; <kbd>Enter</kbd> / <kbd>Space</kbd> selects or submits |
| "Ask AI" — open the panel (if enabled) | <kbd>Enter</kbd> / <kbd>Space</kbd> · <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>I</kbd> · <kbd>Esc</kbd> | Open the chat from the header trigger, the bottom ask bar, or a page's **Ask a question** action; <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>I</kbd> toggles it · <kbd>Esc</kbd> closes |
| "Ask AI" — bottom ask bar | type, then <kbd>Enter</kbd> | Ask from the bar pinned to the bottom of every page; it opens the panel and sends (shown only while the panel is closed) |
| "Ask AI" — from search results | <kbd>↑</kbd> to the top row · <kbd>Enter</kbd> | The **Ask AI** option above the search matches opens the panel and asks your typed query |
| "Ask AI" — new chat | <kbd>Enter</kbd> / <kbd>Space</kbd> | The refresh button confirms before clearing the conversation |
| "Ask AI" answer feedback | <kbd>Enter</kbd> / <kbd>Space</kbd> | Rate an answer with the thumbs-up / thumbs-down buttons |
| Language selector · theme toggle | the control's native keys | Switch language · light/dark |

> **Search shortcuts:** the default theme doesn't add a global search hotkey. If you enable
> [Algolia DocSearch](/search/), it brings its own — <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd>
> and <kbd>/</kbd> — to open search from anywhere.

> **Ask AI assistant:** when the AI assistant is enabled, the chat panel is a *non-modal* dialog
> (`role="dialog"`, `aria-modal="false"`, an accessible name) — it deliberately does **not** trap
> focus, so the rest of the page stays operable behind it. <kbd>Esc</kbd> closes it; the thumbs-up/down
> feedback controls are labelled buttons. You can open it from the header trigger, the
> <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>I</kbd> shortcut, a labelled **ask bar** fixed to the bottom of
> every page (a standard text field with a visible focus ring, shown only while the panel is closed so
> the two never overlap), or a page's **Ask a question** action — and the **Ask AI** row at the top of
> the search results opens the panel and asks your typed query. The conversation persists per browser
> tab as you move between pages, and the panel's **New chat** button asks to confirm before clearing it.

> **Reader survey:** when a [survey](/survey/) is enabled, the prompt is an inline card at the end of the
> page — not a modal, so it never traps focus. Every control is a standard, labelled Mantine input (radios,
> checkboxes, a star rating, or a text box) plus a **Submit** button. As a multi-question survey advances, the new question is announced via an
> `aria-live="polite"` region, and the completion thank-you is announced the same way.

> **API reference:** the operation list lives in the documentation sidebar as standard links
> (<kbd>Tab</kbd> to reach, <kbd>Enter</kbd> to jump); the in-view operation is highlighted there as
> you scroll, and clicking one smooth-scrolls to it with a sticky-header offset — an instant jump when
> reduced motion is requested. Each request-sample **language** and response-example **status** picker
> is a labelled, keyboard-native Mantine select.

## Build-time contrast check

The build reads your theme's palette from [`theme.scss`](/theming/#colors), checks it against
WCAG AA, and prints a non-fatal warning for any text/background pair that falls short — in both
light and dark:

```text
aardvark: warning — color contrast below WCAG AA:
  light — links: #8a7fff on #ffffff = 3.41:1 (needs 4.5:1)
  Adjust the colors in your theme's theme.scss so each pair meets the ratio
  (a darker/lighter shade per scheme), or set a11y.contrast: false to silence this.
```

It checks body text, secondary text, links, the active navigation item, text on the
code/table surface, and the table header. Because each scheme has its own background, pick a
`$primary` (and the other variables) that reads well on **both** — that's why this site uses a
lighter primary in dark mode than in light. Tune the check in `aardvark.config.yaml`:

```yaml
a11y:
  contrast: true        # run the audit (default: true; non-fatal warnings only)
  contrastLevel: AA     # AA (default) or AAA
# a11y: false           # shorthand to turn the audit off entirely
```

The audit runs against your theme's actual palette every build. The shipped default palette is
already AA-clean, so a stock site stays quiet; a custom `theme.scss` that dips below the ratio
gets a warning.

## Writing accessible content

The theme handles the chrome; a few habits keep your pages accessible too:

- **Describe images** — always give Markdown images alt text: `![A labelled architecture diagram](/img.png)`. Use empty alt (`![]`) only for purely decorative images.
- **Keep headings in order** — one `#` per page, then `##`, then `###`; don't skip levels for size. The on-this-page list and screen-reader outline are built from them.
- **Write meaningful link text** — "[read the deployment guide](/deployment/)", not "click here".
- **Don't rely on color alone** — pair it with text or an icon when it carries meaning.
- **Label custom widgets** — any interactive snippet you add should be keyboard-operable and
  carry an accessible name (an `aria-label` or visible text) and a visible focus style.

> **Note:** Mantine components used in content (buttons, tabs, accordions, the rating widget)
> bring their own keyboard support and ARIA roles. Default filled buttons use Mantine's brand
> color; if you set a custom `$primary` in `theme.scss`, the contrast check above covers its
> use as link and active-state text.

## Roadmap

- Live assistive-technology smoke tests (NVDA / VoiceOver) as part of releases.
- An automated `axe`/`pa11y` pass over the built sample site.
