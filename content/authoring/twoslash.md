---
description: Opt a TypeScript or JavaScript code block into Twoslash to add interactive
  type hovers, inline compiler errors, and `// ^?` type queries — powered by the real
  TypeScript language service at build time.
icon: fa-solid fa-wand-magic-sparkles
menu: docs
title: Twoslash
weight: 20.7
---

# Twoslash

**Twoslash** runs the real TypeScript language service over a code block at build time and
bakes the results into the page: hover any identifier to see its resolved type, surface
expected compiler errors inline, and pin a type with a `// ^?` query. It's the same tooling
the TypeScript handbook, VitePress, and Astro Starlight use — rendered with
[Shiki](https://shiki.style) + [`@shikijs/twoslash`](https://shiki.style/packages/twoslash).

It's **opt-in per block**: add `twoslash` after the language on a `ts`, `tsx`, `js`, or `jsx`
fence. Every other code block is untouched.

````markdown
```ts twoslash
const greeting = "Hello, aardvark"
const loud = greeting.toUpperCase()
```
````

renders, live (hover `greeting` or `loud`):

```ts twoslash
const greeting = "Hello, aardvark"
const loud = greeting.toUpperCase()
```

## Type queries

A `// ^?` comment, with the `^` under the token you want, pins that token's type below the
line — handy for showing what an expression infers to:

```ts twoslash
const point = { x: 10, y: 20 }
//    ^?
```

## Showing errors

By default Twoslash treats a compiler error as a build problem. To *show* an error on
purpose, declare its code with `// @errors:` — the block then renders with the squiggle and
the message inline instead of failing the build:

```ts twoslash
// @errors: 2322
const count: number = "not a number"
```

## Trimming setup with `// ---cut---`

Real examples often need setup that distracts from the point. Everything above a
`// ---cut---` line is compiled (so types still resolve) but hidden from the rendered block:

```ts twoslash
// @noErrors
const db = { find: (id: string) => ({ id, name: "Ada" }) }
// ---cut---
const user = db.find("u_1")
//    ^?
```

## Multiple files

Use `// @filename:` to split a block into several modules — imports resolve across them, so
you can demonstrate a small project:

```ts twoslash
// @filename: shapes.ts
export interface Circle { kind: "circle"; radius: number }
// @filename: area.ts
import type { Circle } from "./shapes"
export const area = (c: Circle) => Math.PI * c.radius ** 2
```

## Configuration

Twoslash is on by default. Turn it off site-wide, or pick a different
[Shiki theme](https://shiki.style/themes) for the rendered blocks, in `aardvark.config.yaml`:

```yaml
twoslash:
  theme: github-light       # Shiki light theme (default: github-light)
  themeDark: github-dark    # Shiki dark theme (default: github-dark)
  timeout: 120              # seconds to allow the render before falling back (default: 120)
```

Set `twoslash: false` to disable the feature everywhere, or add `twoslash: false` to a single
page's front matter to disable it just there — useful for a page of deliberately incomplete
snippets. Either way, a `twoslash`-tagged fence falls back to a normal highlighted code block.

## Requirements

Twoslash needs Node and three build-time packages — `shiki`, `@shikijs/twoslash`, and
`typescript` — which ship in the scaffolded `package.json`, so `npm install` once and
`vark build` renders your twoslash blocks. If Node or the packages aren't available (or you
build with `--no-bundle`), tagged blocks degrade gracefully to plain highlighted code and the
build prints a one-line notice — it never fails the build over a missing toolchain.

**Keep twoslash snippets short.** So the hover and `// ^?` popovers can escape the block, a
`twoslash` block isn't horizontally scrollable the way a plain code block is — a very long line
extends the page width instead of scrolling. Favor short, focused lines in twoslash blocks.
