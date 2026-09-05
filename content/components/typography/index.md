---
parent: components
title: Typography
icon: typography
weight: 120
---

# Typography

Tags for **text and document structure** — headings, styled runs of text, quotes, code,
lists, tables, and rules. All but one are built in, each a single Markdown tag with no setup;
CodeBlock is a project snippet this site ships, so using it in your own site means copying its
source first. Plain Markdown
still handles ordinary prose; reach for these when you want explicit control over styling,
color, icons, or layout.

- [Text](/components/typography/text/) — style any run of text: weight, size, color, alignment, transform, gradient, and truncation.
- [Title](/components/typography/title/) — a heading (`<h1>`–`<h6>`) with an explicit level, visual size, and the full typography surface.
- [Blockquote](/components/typography/blockquote/) — a styled pull-quote with a citation, accent color, radius, and an optional icon.
- [Code](/components/typography/code/) — inline or block code, shown verbatim, with an optional background tint.
- [CodeBlock](/components/typography/codehighlight/) — a code block that is syntax-highlighted in the browser at read time, with a copy button; a project snippet, not a built-in tag.
- [Mark](/components/typography/mark/) — a tinted `<mark>` run for drawing the eye to a phrase mid-sentence.
- [Highlight](/components/typography/highlight/) — highlight every match of one or more substrings inside a longer run of text.
- [List](/components/typography/list/) — an ordered or unordered list with sizing, spacing, and an optional icon bullet.
- [Table](/components/typography/table/) — a data table with borders, striping, hover, a caption, and a sticky header.
- [Typography](/components/typography/typography/) — a prose-styling wrapper that gives a block of raw HTML Mantine's article styles.
- [Divider](/components/typography/divider/) — a labelled or plain horizontal / vertical rule.
- [VisuallyHidden](/components/typography/visuallyhidden/) — hide content visually while keeping it available to screen readers.

Each tag accepts the options listed on its own page. The two ways of getting one wrong behave
differently: an option **name** the tag doesn't have stops the build with an error naming the
tag, so a misspelled option can never quietly do nothing — but an unrecognized **value** for a
real option is not checked when the site is built. It is passed to the component, which
ignores it or falls back to its own default, the way `order=9` on a title just renders the
default heading. Every tag can also be called from Python, which is how you build a list or a
table from data in a loop; each page shows both forms side by side.
