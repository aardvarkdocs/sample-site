---
description: A demo of mode toc-only — the left nav is hidden so you can focus on
  one document, while the right-hand TOC stays for quick jumps.
icon: fa-solid fa-list-ol
menu: docs
mode: toc-only
title: TOC-only mode
weight: 33
---

# TOC-only mode

[↑ All layout modes](/modes/)

> **This page uses `mode: toc-only`.** The left nav is hidden so this single
> document owns the screen — but the right-hand "On this page" list stays. With
> the nav gone, the content column widens to fill the freed space. Scroll down and
> watch the TOC highlight the section you're in; click any entry to jump.

`toc-only` fits a long, standalone reference — a configuration spec, an FAQ, a
glossary, a policy — where the global nav is a distraction but moving *within* the
page is essential. The headings below give the TOC plenty to work with.

## Installation

Install the package, point it at a content directory, and run a build. The output
is a folder of static HTML you can host anywhere.

## Configuration

Every project has one config file at its root. It defines the site metadata, the
navigation tree, the theme, and any integrations.

### Site metadata

Name, description, and summary feed the page title, meta tags, and the generated
`llms.txt`.

### Navigation

The nav is a list of groups, each with a label and a list of links. It renders as
the left sidebar — except, of course, on a page like this one.

### Theme

Colors, fonts, and logos. Colors seed both the CSS variables and the Mantine
island theme, so the chrome and the components stay in sync.

## Content authoring

Pages are Markdown with optional front matter. Logic, when you need it, is real
Python inside template tags.

### Front matter

Title, description, keywords — and `mode`, which is how this page hid its nav.

### Data files

Drop JSON, YAML, or CSV into the data directory and reference it by name from any
page.

## Components

Embed any Mantine component as an interactive island. Author once in Markdown; it
mounts as React in the browser.

## Internationalization

Author a base language at the root and translations under their own directories.
A language picker appears automatically.

## Search

Built in — a ⌘K search box scores a full-text index generated at build time, with
no external service to configure.

## Deployment

Build in CI and upload the output folder to any static host. Set the base URL so
the sitemap and `llms.txt` use absolute links.

## Wrapping up

That's nine headings and several subsections — enough that jumping around with the
TOC genuinely beats scrolling. On a screen narrower than 1100px the TOC hides
site-wide, so this page falls back to a plain single column.
