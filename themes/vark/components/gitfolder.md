---
name: gitfolder
description: An embedded file browser for a folder of a public GitHub or GitLab repository —
  fetched once at build time and cached — with highlighted code, inline images, a Markdown/SVG
  preview toggle, per-file copy and download, source links and a whole-repo zip download.
  `github` names the repository; `folder` (default the root), `ref` or `branch`, `cache`,
  `label` and `height` are optional. The body is ignored.
body: python
close: required
childScope: true
passthrough: true
---
```python
# Renders the GitFolder island (GitFolder.jsx): a file browser on the left, contents on the right
# (highlighted code / inline images / a Markdown+SVG source-and-preview toggle), per-file
# copy/download + source links, and a "Download .zip" button. The build-time fetch, cache and
# served zip live in the build's shared repo fetcher (one per build, like the map's geocoder); this
# definition just reads the attributes, fetches through av.fetch_repo_folder and emits the island.
#
# The body between the tags is ignored (the tag is always paired). `github` is required. `folder` is
# optional: omit it to browse the repo root. The "Download .zip" button always links to the host's
# WHOLE-repo archive (even when browsing a subfolder) so the LICENSE always comes along; the repo's
# detected license is shown in the widget footer. `cache` (default true) reuses already-downloaded
# files; cache="false" re-fetches every build (ephemeral) with a timed warning. `ref` / `branch`
# pins a branch/tag/SHA (default: the repo's default branch). `label` / `height` ride through to
# the island.
#
# `gitfolder: false` switches the widget off site-wide. A render with no fetcher (vark link-check)
# renders nothing: the widget has no in-content links to validate. A recoverable fetch failure
# (network / 404 / rate-limit / empty folder) is warned by the fetcher and renders a visible note
# instead, so one bad repo never fails the build.
import html
import aardvark.components as av


def _fallback(github, folder, ref):
    # A visible inline note (with a source link) for when the build-time fetch fails — so a reader
    # sees *what* and *where* instead of a confusing empty gap. Non-fatal, like the warning the
    # fetcher already emitted. Plain static HTML with theme-agnostic inline styles (no island, so it
    # shows even if the fetch failure left the page with no islands bundle).
    links = av.repo_links(github, folder, ref)
    if links is None:
        return ""
    style = (
        "margin:var(--mantine-spacing-md,1rem) 0;padding:.6rem .85rem;border:1px solid "
        "var(--aardvark-border,#80808055);border-radius:var(--mantine-radius-md,8px);font-size:.9em"
    )
    return (
        f'<div class="aardvark-gitfolder-fallback" style="{style}">'
        f"This example loads <code>{html.escape(links.label)}</code> from {links.provider_display} at "
        f'build time, which failed here — <a href="{html.escape(links.url, quote=True)}" '
        'target="_blank" rel="noopener noreferrer">view it on '
        f"{links.provider_display}</a>.</div>"
    )


def _gitfolder():
    if not av.gitfolder_enabled(globals()):
        return ""  # `gitfolder: false` — the widget is switched off site-wide

    github = str(attrs.get("github", "")).strip()
    folder = str(attrs.get("folder", "")).strip().strip("/")  # optional — "" browses the repo root
    if not github:
        # A ComponentError is reported bare, so the message names the page itself.
        raise av.ComponentError(
            '{% gitfolder %} requires a `github` attribute (e.g. "owner/repo") '
            f"(in {av.call_source(globals())})"
        )

    ref = str(attrs.get("ref") or attrs.get("branch") or "").strip() or None

    if not av.repo_fetch_available(globals()):
        return ""  # link-check / no-network render path (like the map with no geocoder)
    data = av.fetch_repo_folder(globals(), github, folder, ref, attrs.get("cache"))
    if data is None:
        # Recoverable failure (network / 404 / rate-limit — the fetcher already warned). Show a
        # visible note with a link to the repo rather than a confusing empty gap.
        return _fallback(github, folder, ref)

    props = {
        "repo": f"{data.owner}/{data.repo}",
        # `data.folder`, NOT the author's spelling: the fetcher normalizes it, and only that form
        # both matches the archive and builds working source links.
        "folder": data.folder,
        "zipUrl": data.zip_url,  # always the whole-repo archive (so the LICENSE rides along)
        "files": data.files,
    }
    if data.ref:
        props["gitRef"] = data.ref  # NOT `ref` — React reserves that prop name
    if data.default_path:
        props["defaultPath"] = data.default_path
    # Three states, not two. The key is OMITTED when nothing read this repo's root, so the island
    # can tell "no license file" (null → all rights reserved) from "unread" (absent → no footer).
    # Sending null for the latter would put a claim about someone's terms under a repo this build
    # never looked at.
    if data.license_known:
        props["license"] = data.license  # {title, url}, or None for "read it; there is none"
    for key in ("label", "height"):
        if attrs.get(key) is not None:
            props[key] = attrs[key]
    return component("GitFolder", attr=attr, **props)


print(_gitfolder())
```
