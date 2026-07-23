---
title: "Gitfolder"
description: "The built-in gitfolder tag — an embedded browser for a public GitHub repo folder (or the whole repo): a file tree, syntax-highlighted source, inline images, a Markdown/SVG source-vs-preview toggle, per-file copy/download and GitHub links, and a Download ZIP button. Files are fetched once at build time and cached. Usage, caching, options, and a live example."
---

# Gitfolder

A **built-in** tag that embeds a small IDE-style browser for a folder in a **public** GitHub
repo: a file tree on the left, the selected file on the right — **syntax-highlighted** source
for code, **inline display** for images, and a **Source&nbsp;⟷&nbsp;Preview** toggle for
Markdown and SVG — plus per-file **copy** / **download**, a link to each file's **source on
GitHub**, and a **Download&nbsp;ZIP** of the **whole repository**. The repo's detected
**license** is shown at the bottom, so readers know the terms before reusing the code. It's
perfect for showing an example project inline without copy-pasting every file into the page.

The folder is fetched **at build time** — only the requested subfolder, over the GitHub API,
never a `git clone` — and then **cached**, so a rebuild never re-downloads a folder it already
has. The reader's browser loads nothing from GitHub: the files, their highlighting, the
rendered previews, and any displayed images are all baked into the page or served from your
own site; the zip is a static file too.

## Usage

Use a self-contained `{% raw %}{% gitfolder … %}{% endGitfolder %}{% endraw %}` with a `github`
(`owner/repo`):

{% raw %}
```aardvark wrap
{% gitfolder github="aardvarkdocs/sample-site" %}{% endGitfolder %}
```
{% endraw %}

renders, live:

{% gitfolder github="aardvarkdocs/sample-site" %}{% endGitfolder %}

Click a file in the tree to view it on the right; folders collapse. Code is syntax-highlighted,
images show inline, and Markdown / SVG get a **Source ⟷ Preview** toggle — all with per-file
copy / download and a link to the **source on GitHub**.

With no `folder`, the whole repo is grabbed as a **single archive download** — fast, and it
never touches GitHub's API rate limit. Only the file *contents* are embedded in the page (up to
`maxFiles`, default 300), so a very large repo makes a heavy page; scope to a `folder` (below)
when you only need part of a big repo.

## Scope to a folder

Add a `folder` (a path within the repo) to show just that subtree:

{% raw %}
```aardvark wrap
{% gitfolder github="aardvarkdocs/sample-site" folder="content/getting-started" %}{% endGitfolder %}
```
{% endraw %}

**Folder mode uses the GitHub API.** Listing a folder goes through GitHub's contents API, which
is **rate-limited to 60 requests/hour per IP** for anonymous builds. On a **shared-IP CI build**
(Cloudflare Pages, Netlify, GitHub Actions, …) that ceiling is shared across every project on the
runner, so even one `folder` fetch can hit it — the widget then shows a "load failed — view on
GitHub" fallback instead of the browser. Set a **`GITHUB_TOKEN`** (or `GH_TOKEN`) in your build
environment to raise it to 5,000/hour (more under the **Rate limits** note below); the whole-repo
form above uses the archive download and is never rate-limited. (This page renders the whole-repo
form above for exactly that reason — so it works on CI without a token.)

## Downloads & licensing

The **Download&nbsp;ZIP** button **always** fetches the **whole repository** from GitHub's own
archive — even when you're browsing a single subfolder. That's deliberate: a zip of just part
of a repo could leave out the `LICENSE`, and someone might reuse the code without realizing the
terms. For the same reason, the repo's **detected license** (e.g. *MIT License*) is shown in
the widget's footer, linked to the license file on GitHub — or, if no license is found, a
reminder that the code is *all rights reserved* by default.

**The license you see is a cached snapshot.** The footer's license — like the file previews —
comes from the fetch that filled the [cache](#caching), so it describes the code you actually
downloaded. The **Download&nbsp;ZIP** button is different: it's a live link to GitHub's archive,
so it always delivers the repo's *current* contents (or your pinned `ref=`). On a fresh build
the two agree; on a stale local cache the shown license can lag what the ZIP now contains, until
you refresh the cache or set `cache="false"`. In practice your **published** site is always
current (every deploy re-fetches — see [Caching](#caching)), so this is only ever a local-preview
nuance. To lock the whole widget — previews, license, and ZIP — to one immutable version, pin a
`ref=` (a tag or commit); the license is then resolved for that exact ref.

## How each file is shown

- **Code & text** — syntax-highlighted exactly like a fenced code block, with the same copy /
  download actions.
- **Images** (`png`, `jpg`, `gif`, `webp`, `svg`, …) — displayed inline. The image is served
  from your own site (baked in at build time), so the page stays self-contained.
- **Markdown & SVG** — get a **Source ⟷ Preview** segmented control: Markdown toggles between
  its highlighted source and the rendered document; SVG toggles between its markup and the
  rendered image. (In a Markdown preview, relative image and link paths are rewritten so they
  resolve — to your served copy when the image is in the folder, otherwise to GitHub.)
- **Other binaries & very large files** — not previewed inline; grab them from the
  **Download ZIP** button, which always contains the **complete repository** (see below).

## Caching

By default (`cache="true"`) the folder is downloaded **once** and stored under
`.aardvark-cache/` (which is git-ignored). Every later build reuses those files and touches
the network only if the cache is missing — so builds stay fast and work offline once primed.
**Delete the cache** (or that folder within it) to pull a fresh copy.

**Caching is mostly a local convenience.** Because `.aardvark-cache/` is git-ignored it's never
committed, so a deploy host that builds from a fresh checkout starts with an *empty* cache and
re-downloads on every deploy — which means your **published** site always reflects the latest
fetch, and `cache="true"` vs `cache="false"` makes little practical difference there. Locally,
the cache is what keeps repeat builds fast and offline-friendly. (If your CI persists build
directories between runs, the cache can carry over there too — clear it to force a refresh.)

Set `cache="false"` to re-download on **every** build — you always get the latest, at the cost
of a network round-trip (and longer builds) each time:

{% raw %}
```aardvark wrap
{% gitfolder github="aardvarkdocs/sample-site" folder="content/getting-started" cache="false" %}{% endGitfolder %}
```
{% endraw %}

With `cache="false"`, the build prints a warning each time noting that it's re-fetching and
**how long** the download took, so a slow build is never a mystery.

## Options

| Attribute | Effect |
| --- | --- |
| `github="owner/repo"` | The **public** repo (required). A full `https://github.com/owner/repo` URL or a trailing `.git` is tolerated. |
| `folder="path/in/repo"` | The folder to show, relative to the repo root. **Optional** — omit it to browse the whole repo root (the zip then links to GitHub's archive). A leading `/` is fine. |
| `cache="false"` | Re-download every build (ephemeral, always latest) with a timed warning. Default `true`: download once, then reuse the local cache. |
| `ref="…"` / `branch="…"` | Pin a branch, tag, or commit SHA. Default: the repo's **default branch**. |
| `label="…"` | Accessible name for the widget (sets `aria-label`); useful when a page has more than one. |
| `height="480"` | Override the panel height (pixels, or any CSS length). |

## Notes

- **Public repos only.** Private repos aren't supported (and would need credentials the build
  doesn't have).
- **The widget is wide.** It works at the default content width, but a file browser has more
  room to breathe on a `mode: wide` (or `mode: full`) page — set that in the page's
  front-matter.
- **Rate limits (folder mode).** Listing a specific `folder` uses GitHub's API: **60 requests/hour
  per IP** for anonymous builds (downloading the file *contents* doesn't count, and whole-repo
  mode uses a single archive download that never touches the API). The catch is **shared-IP CI** —
  on Cloudflare Pages, Netlify, GitHub Actions and the like, that 60/hour is shared across every
  project on the runner, so even one `folder` fetch can come back **HTTP 403** and the widget
  falls back to its "view on GitHub" note. Set a **`GITHUB_TOKEN`** (or `GH_TOKEN`) environment
  variable — or `gitfolder.token` in config — to authenticate and raise the ceiling to
  **5,000/hour** (a public repo needs no token scopes). Whole-repo mode, and a primed local
  cache, never hit this.
- **Resilient by design.** If a repo or folder can't be fetched (offline build, a typo, a
  rate-limit), the build prints a warning and the widget renders nothing — it never fails the
  whole build.
- **Turn it off site-wide** with `gitfolder: false` in `aardvark.config.yaml`.

## CSS Selectors

The browser mounts inside an island wrapper carrying `data-aardvark-island="GitFolder"` and renders its own class names — target the panel, the header, the file tree, and each row.

{% raw %}
```css
[data-aardvark-island="GitFolder"]  /* the island wrapper */
.aardvark-gitfolder                 /* the panel */
.aardvark-gitfolder-header          /* the title / toolbar row */
.aardvark-gitfolder-tree            /* the file list */
.aardvark-gitfolder-row             /* a single file/folder row */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered file-browser root. (Style it through the CSS parts above, and configure it with the
documented attributes: `github`, `folder`, `ref`, `cache`, `label`, `height`.)

{% gitfolder github="aardvarkdocs/sample-site" folder="content/getting-started" attr={'data-analytics': 'repo-tree', 'aria-label': 'Repository files'} %}{% endGitfolder %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% gitfolder github="aardvarkdocs/sample-site" folder="content/getting-started" attr={'data-analytics': 'repo-tree', 'aria-label': 'Repository files'} %}{% endGitfolder %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'gitfolder', github='aardvarkdocs/sample-site',
          folder='content/getting-started',
          attr={'data-analytics': 'repo-tree', 'aria-label': 'Repository files'})
```
{% endAccordionSection %}
{% endAccordion %}
