---
description: Host the static build/ output anywhere, and optionally ship aardvark itself
  as a single compiled binary.
icon: fa-solid fa-rocket
menu: docs
title: Deployment
weight: 61
---

# Deployment

## Hosting the site

`vark build` produces a fully static `build/` directory — HTML, one JS/CSS island
bundle, your assets, and the [generated files](/llms-and-sitemap/). Deploy it to
any static host:

- **Netlify / Vercel / Cloudflare Pages** — build command `vark build`, publish
  directory `build`. Node must be available in the build image (it is on all
  three) to bundle islands.
- **GitHub Pages / S3 / nginx** — build in CI, then upload `build/`.
- **Run it yourself** — [`vark serve`](/self-hosting/) serves the build (and an optional
  live MCP server) from one hardened process, ready to package as a Docker image behind a CDN.

Set `baseUrl` in `aardvark.config.yaml` to your production URL so `sitemap.xml` and
`llms.txt` use absolute links.

### Caching

Cache fingerprinted assets for a long time. Root CSS/JS, files copied from
`static/` or `public/`, theme/runtime assets under `/_aardvark/`, islands
bundles, generated PWA icons/manifests, OG images, and controlled downloads are
emitted with per-build filenames such as `/img/logo-<sha>.png`.

Keep route and discovery files revalidatable instead: page HTML, `_headers`,
`_redirects`, `robots.txt`, `sitemap.xml`, `.well-known/**`, `auth.md`,
`llms*.txt`, `metadata.json`, `search-index.json`, page `.md` siblings, and
encrypted `.enc` payloads stay at stable paths by design.

The fingerprint token is your git `HEAD` SHA. If you build where `.git` isn't
present (a container image, or a CI job with a shallow/absent checkout), set the
`AARDVARK_BUILD_SHA` environment variable to the commit being deployed so every
build still gets a stable, unique token. Without it, aardvark falls back to a
content hash of your project sources — correct, but it rotates every asset URL
whenever any source file changes.

### Redirects

Page `aliases:` and config `redirects:` (see [Generated files](/llms-and-sitemap/))
make `vark build` write a `_redirects` file. **Cloudflare Pages, Netlify, and
Vercel** read it and serve true `301`s; other hosts ignore it, but per-page aliases
still work everywhere through their HTML stub pages. On Cloudflare/Netlify a static
file takes precedence over a `_redirects` rule for the same path (Netlify can force
it with a trailing `!`, Cloudflare can't), so an alias's stub wins there unless you
disable stubs with `aliases: { htmlStubs: false }`.

## Custom 404 page

Create `404.md` at the root of your `content/` directory and aardvark renders it to
`404.html` at the site root — wrapped in your theme, with the header, footer and
search box, just like any other page:

```markdown
---
title: Page not found
description: We couldn't find that page.
---

# Page not found

The page you're looking for doesn't exist. Head back to the [home page](/).
```

It's authored like a normal page (Markdown, `{% %}` tags and components all work),
but it's treated specially: it's served at the literal `404.html` instead of a
pretty `/404/` URL, marked `noindex`, and kept out of the nav, sitemap, search
index and `llms.txt`. Only a `404.md` at the content **root** is special — a
nested `guide/404.md` stays an ordinary `/guide/404/` page.

Most static hosts serve `/404.html` automatically for unmatched URLs (GitHub
Pages, Netlify and Cloudflare Pages do out of the box; on S3 set the error
document to `404.html`; on Cloudflare Workers static assets set
`assets.not_found_handling` to `"404-page"`). `vark dev` serves it too, so you
can preview your error page by visiting any URL that doesn't exist.

**Multilingual sites:** put your `404.md` at the **base-language** content root —
that's the `/404.html` every host serves for unmatched URLs, so it's what visitors
see regardless of the URL they tried. A `404.md` in a translated source dir (e.g.
`content-fr/404.md`) is still built, to `/fr/404.html`, but most hosts ignore it
and fall back to the root page. The exception is Cloudflare Workers'
`"404-page"` mode, which serves the *nearest* `404.html` up the path — so there a
miss under `/fr/` returns `/fr/404.html` when it exists. Unless your host does that
nearest-match lookup, a single base-language `404.md` is all you need.

## Shipping aardvark as a binary

Compile the tool itself to a single executable with Nuitka:

```bash
scripts/build-release.sh    # -> dist/vark (single file)
```

The output lands in `dist/` by default; set `BUILD_OUT_DIR` to write it elsewhere.

(For local iteration, `scripts/build-binary.sh` is a faster non-`--onefile`
build that outputs a folder instead of a single file.)

The binary bundles the default theme and the islands runtime, so it works with
no Python environment. **Node remains a runtime prerequisite** on whatever
machine runs `vark build`, because islands are bundled with esbuild at build
time. Use `vark build --no-bundle` if you need to build without Node (components
become inert placeholders).
