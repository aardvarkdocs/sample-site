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

The files are fetched **at build time** — one archive download of the repo, from which only
the requested subfolder is kept; never a `git clone` — and then **cached**, so a rebuild never
re-downloads a folder it already has. **Browsing** loads nothing from GitHub: the file tree,
the source and its highlighting, the rendered previews, and any displayed images are all baked
into the page or served from your own site, so the widget works offline and stays fast. The
one exception is the **Download ZIP** button, which links to GitHub's own archive URL for the
repo — clicking it does reach GitHub, and it gives the reader the whole repository rather than
just the folder shown.

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

Both forms fetch the same thing — **one archive download** of the repo — so the choice is
about the *page*, not the network. With no `folder`, every file in the repo is embedded (up to
`maxFiles`, default 300), which makes a very large repo a heavy page. Scope to a `folder`
(below) to embed just that subtree: a lighter page, and the `maxFiles` cap applies to the
subtree rather than the whole repo.

## Scope to a folder

Add a `folder` (a path within the repo) to show just that subtree:

{% raw %}
```aardvark wrap
{% gitfolder github="aardvarkdocs/sample-site" folder="content/getting-started" %}{% endGitfolder %}
```
{% endraw %}

**Folder mode downloads the same archive.** A `folder=` browse fetches the repo's single zip
archive and keeps only that subtree — the same one request the whole-repo form makes, to a host
with no REST quota. **No `GITHUB_TOKEN` is needed** for either form, on CI or anywhere else.
What `folder=` changes is the *page*: only that subtree's files are embedded, and the `maxFiles`
cap applies to the subtree. The whole repo is still transferred to your build machine either
way, so a `folder=` on a very large repo is a lighter page but not a lighter download.

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

With `cache="false"`, the build prints a note each time (`Aardvark: note: …`) saying that it's
re-fetching and **how long** the download took, so a slow build is never a mystery. It's a
status line, not a warning — re-fetching is what you asked for — so it isn't counted in the
build summary's warning total.

## Options

| Attribute | Effect |
| --- | --- |
| `github="owner/repo"` | The **public** repo (required). A full `https://github.com/owner/repo` URL or a trailing `.git` is tolerated. |
| `folder="path/in/repo"` | The folder to show, relative to the repo root. **Optional** — omit it to browse the whole repo root. A leading `/` is fine. |
| `cache="false"` | Re-download every build (ephemeral, always latest), with a timed note in the build output. Default `true`: download once, then reuse the local cache. |
| `ref="…"` / `branch="…"` | Pin a branch, tag, or commit SHA. Default: the repo's **default branch**. |
| `label="…"` | Accessible name for the widget (sets `aria-label`); useful when a page has more than one. |
| `height="480"` | Override the panel height (pixels, or any CSS length). |

## Notes

- **Public repos only.** Private repos aren't supported (and would need credentials the build
  doesn't have).
- **The widget is wide.** It works at the default content width, but a file browser has more
  room to breathe on a `mode: wide` (or `mode: full`) page — set that in the page's
  front-matter.
- **No API rate limit to worry about.** File content comes from one archive download, which
  has no REST quota — so neither form needs a `GITHUB_TOKEN`, including on shared-IP CI
  (Cloudflare Pages, Netlify, GitHub Actions), where an anonymous 60/hour API ceiling is shared
  across every project on the runner. The only REST call left is a single memoized `/license`
  lookup per repo, used for the footer; if that one gets rate-limited the files still render and
  only the license line is missing. To get that line back on a shared-IP build, set
  `GITHUB_TOKEN` (or `gitfolder.token`) **and** list the repo's owner under
  `github.allowedOwners` — Aardvark only ever sends a credential to an approved owner, and an
  absent `allowedOwners` approves nobody, so the token on its own changes nothing. The gate is
  deliberate: `owner/repo` comes from page content, so an unapproved owner gets an anonymous
  fetch instead of your credential.
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
