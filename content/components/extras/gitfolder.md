---
title: "Gitfolder"
description: "The built-in gitfolder tag — an embedded browser for a public GitHub or GitLab repo folder (or the whole repo): a file tree, syntax-highlighted source, inline images, a Markdown/SVG source-vs-preview toggle, per-file copy/download and source links, and a Download ZIP button. Files are fetched once at build time and cached. Usage, caching, options, and a live example."
---

# Gitfolder

A **built-in** tag that embeds a small IDE-style browser for a folder in a **public** GitHub
(or [GitLab](#gitlab-repos))
repo: a file tree on the left, the selected file on the right — **syntax-highlighted** source
for code, **inline display** for images, and a **Source&nbsp;⟷&nbsp;Preview** toggle for
Markdown and SVG — plus per-file **copy** / **download**, a link to each file's **source** on
its host, and a **Download&nbsp;ZIP** of the **whole repository**. The repo's **license file**
is linked at the bottom, so readers know the terms before reusing the code. It's
perfect for showing an example project inline without copy-pasting every file into the page.

The files are fetched **at build time** — one archive download of the repo, from which only
the requested subfolder is kept; never a `git clone` — and then **cached**, so a rebuild never
re-downloads a folder it already has. **Browsing** loads nothing from the repo host: the file
tree, the source and its highlighting, the rendered previews, and any displayed images are all
baked into the page or served from your own site, so the widget works offline and stays fast.
The one exception is the **Download ZIP** button, which links to the host's own archive URL
for the repo — clicking it does reach github.com (or gitlab.com), and it gives the reader the
whole repository rather than just the folder shown.

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

## GitLab repos

The widget browses public **gitlab.com** projects too. Name one with a full URL in the same
`github` attribute — the host picks the provider, so a bare `owner/repo` shorthand always
means GitHub:

{% raw %}
```aardvark wrap
{% gitfolder github="https://gitlab.com/inkscape/inkscape" folder="share/branding" %}{% endGitfolder %}
```
{% endraw %}

Everything works the same way — one anonymous archive download, no API call, no credential,
the same cache, and the same locally-detected license footer — with the widget's source links
pointing at gitlab.com. **Nested groups** work: in
`github="https://gitlab.com/group/subgroup/project"` the whole namespace before the project
name is the owner. Only gitlab.com is supported — a self-managed GitLab host would be an
arbitrary page-supplied download host, which the build's host allowlist deliberately refuses.

## Downloads & licensing

The **Download&nbsp;ZIP** button **always** fetches the **whole repository** from the repo
host's own archive — even when you're browsing a single subfolder. That's deliberate: a zip of just part
of a repo could leave out the `LICENSE`, and someone might reuse the code without realizing the
terms. For the same reason the widget's footer points at the repo's license file, so the terms
are one click from the code they govern.

**The footer quotes your license file; it does not classify it.** Aardvark reads the
root-level license file out of the same downloaded archive that provides the file previews,
takes the **title line the file gives itself**, and shows that, linked — no GitHub or GitLab
API, so nothing to authenticate and nothing to be rate-limited. It never decides *which* license you
are under, so it can never name the wrong one and there is no list of known licenses to fall
off: a brand-new SPDX id or your own bespoke terms appear exactly as your file words them.

The footer has three things it can say:

- **the title, linked** — `MIT License`, `GNU AFFERO GENERAL PUBLIC LICENSE`, `The Acme Public
  License v3`, whatever your first line says (Markdown heading marks and underlines come off;
  the words don't).
- **`License`, linked** — the file is there but doesn't name itself: it opens with a copyright
  notice (BSD, ISC and many MIT copies do), or it's a symlink, a binary, or too large to read.
  You still get the link, which is the part that matters.
- **no license detected — assume all rights reserved** — the repo root has no license file.
  This is only ever said about a repo that was actually read: a fetch that failed has no files
  either, so that widget shows its usual "couldn't fetch this" fallback instead of a footer.
- **no footer at all** — nothing read this repo's root, so there is nothing honest to say. You
  see this in one narrow case: you upgraded Aardvark, the cached copy of the repo was written
  by the older version, and this build couldn't reach GitHub to re-read the license. The files
  are still shown (they are exactly what the previous build stored) and the build warns; the
  next build that reaches GitHub settles the license and the footer comes back.

Only the best-named root file is read — `LICENSE`, then `LICENCE`, `COPYING`, `UNLICENSE`, then
any name that carries one of those words (`LICENSE-MIT`, `MIT-LICENSE`, `COPYING-LGPL` — the
generic word decides, never the qualifier). A repo carrying several is quoting itself, not
disagreeing with itself, so the link goes to the best-ranked one. A bare `COPYRIGHT` is **not**
one of them: it states who owns the code, not what you may do with it, so a repo whose root
holds only that gets the all-rights-reserved footer rather than a link labelled `License`.

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

**A warm cache doesn't hide files being too large.** If files were skipped for size, or the
folder was cut by `maxFiles`, *every* build says so — not just the one that downloaded. You never
have to clear the cache to find out what the widget isn't previewing.

One question a warm build can't always answer: if you *lower* `maxFileBytes` on a folder that was
itself cut by `maxFiles`, the files past that cut aren't on disk to re-check. The build says which
figures it can't give you rather than quoting one it can't stand behind — delete the cache for
exact numbers.

**Two notices only a downloading build can give**, because they describe archive entries that
were never written to the cache: a file skipped for an unsafe path, and one skipped as corrupt
or over-large when unpacked. A warm build renders exactly what a cold one would, but stays
silent about both. If you're chasing either, delete `.aardvark-cache/gitfolder` and rebuild.

**A warm build shows the same files a fresh download would** — including after you *lower*
`maxFiles`. One shape of cache can't promise that, and says so instead of guessing: the message
tells you the list may differ and leaves the call to you. One re-download retires it for good.

**Upgrading Aardvark re-downloads once, and only for the license.** A cache written before
Aardvark read licenses out of the archive carries an answer from GitHub's old API — including
"no license", which that API also recorded when it simply couldn't reach GitHub. This version
repeats neither: the first build after the upgrade fetches that repo once, reads the license
out of the archive, and stays warm from then on. If that one build can't reach GitHub, your
cached files still render — the failure costs you the footer, not the widget: Aardvark warns,
shows the files it already has, and renders no license line at all, because it has no honest
answer to put there. The next successful build settles it.

Nothing else re-downloads on an upgrade: a folder cached by an older version may not be able to
answer the questions above, and the build says so and leaves your cached files alone rather than
silently replacing them with whatever the branch points at today. Delete
`.aardvark-cache/gitfolder` to refresh it.

Besides that one-time license migration, what re-downloads is **changing a limit**, and not
every change:

- **Raising `maxFiles` or `maxFileBytes` re-downloads.** You've asked for more than the snapshot
  holds. (A cache old enough not to record the limits it was fetched under can't hear the ask and
  stays warm; delete it once, and every build after that answers normally.)
- **Lowering `maxFileBytes` re-downloads only when the lower cap leaves the snapshot short.** If
  enough cached files still fit under it, the stored copy already *is* what a fresh download
  would show, and nothing is fetched. Those builds do re-check the whole cached folder, though,
  to work out which files the lower cap now hides — a cost a big folder keeps paying on every
  build until something re-fetches it.
- **Lowering `maxFiles` alone never re-downloads.** It shows fewer of the files already cached.

A re-download on an unpinned `ref` brings today's contents. Pin a `ref=` if that matters, or
delete the cache first so the refresh is one you chose.

**A half-written cache is re-downloaded, not served.** If a build was killed mid-save, or the
cache was half-deleted by hand, there's no telling how much of the folder is missing — so the
build fetches it again rather than quietly rendering whatever happens to be on disk. (A build
that is *currently* saving that folder is recognized and passes without complaint.)

**Two builds can share a project safely.** A `vark dev` running beside a `vark build` — or two
dev servers, or CI beside a shell — can't corrupt each other's cached folders: the one that gets
there first saves the folder and the other leaves it alone, mentioning that it did. Nothing
waits, so an overlap costs one extra download rather than a stalled page.

The one case worth knowing about: a build **killed while saving** leaves a lock file behind at
`.aardvark-cache/gitfolder/<key>.json.lock`, and nothing ever removes a lock it doesn't own.
Nothing new can be cached for that folder until the file goes. Whether that means re-downloading
depends on what the interrupted build had already done: a snapshot it had finished publishing
keeps being served, but one cut off mid-save took its sidecar with it, and that folder does
re-download on every build. After a few minutes the build warns and names the exact path. Check
that no `vark` process is still running, then delete it — with nothing running that's safe, and
the next build caches normally.

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
| `github="owner/repo"` | The **public** repo (required). A full `https://github.com/owner/repo` URL or a trailing `.git` is tolerated. A full `https://gitlab.com/…` URL browses a [GitLab project](#gitlab-repos) instead. |
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
- **No API rate limit to worry about — at all.** Everything the widget shows comes from one
  archive download, which has no REST quota: the file content *and* the footer's license,
  which is [detected locally](#downloads-licensing) from the archive's own license file. The
  widget makes **no GitHub API call**, so no `GITHUB_TOKEN` is needed on any host — including
  shared-IP CI (Cloudflare Pages, Netlify, GitHub Actions), where the anonymous 60/hour API
  ceiling is shared across every project on the runner and used to cost the footer its license
  line. There is no credential to configure and nothing for someone else's builds to exhaust.
  (The old `gitfolder.token` config key is retired; a leftover one warns so you remember to
  remove it.)
- **Resilient by design.** If a repo or folder can't be fetched (offline build, a typo, a
  private or deleted repo, a network failure), the build prints a warning and the widget renders
  nothing — it never fails the whole build.
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
