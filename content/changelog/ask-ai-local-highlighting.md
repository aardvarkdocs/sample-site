---
title: Ask AI highlights code without calling out
date: 2026-08-22
version: "0.3.3"
taxonomy:
  - name: changes
    tags: [ai, ui]
nav: false
noindex: true
---

# Ask AI highlights code without calling out

Opening the Ask AI panel used to fetch highlight.js from a CDN the first time a reader
asked a question. It doesn't any more: answers are highlighted by the lexer Aardvark
already uses for your pages, so the assistant makes no third-party request, needs no extra
Content-Security-Policy origin, and still works where that CDN is unreachable.

The colors are unchanged: answers were already painted from your theme's syntax palette and
still are. What has gone is the extra stylesheet that remapped highlight.js's class names
onto that palette, because the built-in lexer emits the same classes your own code blocks
use. An answer still stays plain while it streams and is colored in one pass once it
finishes — what no longer happens is the repaint when the CDN script arrived late and
recolored an answer already on screen.

The trade is breadth. The built-in lexer covers 20 languages — JSON, Bash, Python,
JavaScript, TypeScript, Go, PHP, Rust, Ruby, Java, C, C++, SQL, YAML, INI/TOML, CSS, SCSS,
XML/HTML, Markdown and Aardvark's own template syntax, plus the usual aliases. Anything
outside that list renders as readable plain text where the CDN's grammar set would have
colored it.

Released in 0.3.3. See [Ask AI](/ai-assistant/).
