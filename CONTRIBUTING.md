# Contributing

Thanks for your interest.

## Issues are welcome

If you find a bug in this example, have a suggestion, or something is unclear,
please [open an issue](../../issues/new). We read them.

## Pull requests are welcome

This repository accepts contributions through public pull requests, but its
`main` branch has a single writer: the outbound publisher in the private aardvark
repository. “Two-way” means contributions travel inward for review and accepted
snapshots travel outward; it does not mean public pull requests are merged here.

For a new eligible change, the normal lifecycle is:

1. Open a pull request against public `main` and keep it open.
2. The existing GitHub App sends a signed event that immediately enqueues the
   private sync for this exact pull request. A bot validates and replays the
   eligible file changes into a ready-for-review `sample-site-sync/pr-<number>` PR in the
   private aardvark source repository. There is no scheduled poll, public sync
   workflow, or public secret.
3. Maintainers review the complete private diff, run isolated CI, resolve any
   replay conflicts in aardvark, and merge only the private mirror PR. You do not
   need to rebase merely to account for private-source changes.
4. Merging the private mirror pushes private `main`, which triggers the normal
   publisher to append a bot-authored sync commit containing the accepted
   private snapshot to public `main`. That commit links your pull request and may
   credit you, by GitHub username, as a co-author.
5. A reconciliation job in that same publisher workflow verifies publication,
   then comments on and closes the original, still-unmerged public pull request.

The bot may temporarily apply `sample-site-sync: publish-needed` while accepted
work waits for publication. It is automation-owned recovery state; please do
not edit or remove it.

While the private branch still contains the bot-authored mirrored revision,
reopening the PR or pushing another commit on the same public branch immediately
redispatches it and enqueues a refresh. Once maintainers adopt a conflict
resolution, merge the mirror, or the public status says the accepted revision is
waiting to be published, open a new public pull request for further changes.
A conflicted mirror may wait for a maintainer resolution or explicit
acknowledgement commit before isolated CI starts.

### What can be changed

Ordinary sample-site files and top-level files already owned by the private
overlay—currently `README.md` and `CONTRIBUTING.md`—can be proposed
through this flow. Agent instruction files are the exception — `AGENTS.md`,
`AGENTS.override.md`, `CLAUDE.md`, and `CLAUDE.local.md`. Coding agents load them
wherever they sit, so they publish outbound from the source repository only and
the sync refuses an inbound change to one at any depth. The same goes for the
agent toolchains' own config directories — `.claude/`, `.codex/` and `.cursor/`,
plus the legacy `.cursorrules` — which those tools discover by walking the tree.
Only the maintainers change the `LICENSE` at the repository root, so the sync
refuses a change to it. The files under `themes/vark/` are published from the
aardvark package itself, so the sync refuses changes to them too; open an issue
to suggest one. For safety, it also
refuses changes at the repository root under `.github/` and `worker/`, as well as any path component
named `.git`, symlinks, submodules, unsafe paths, and changes that exceed its
size limits. A refused pull request receives a generic explanation; open an issue if a
maintainer needs to make that change in the source repository.

Public pull requests are never merged into public `main`; that branch accepts
only bot-authored outbound sync commits from the aardvark repository. Normal
publishing is append-only, preserving the public branch and fork history needed
for ongoing contributions.

## Docs pages

This site is aardvark's documentation, and every built-in component has its own
reference page under **Built-in Components**. When you add or change one of
those pages, follow this recipe:

1. The page lives at `content/components/<category>/<slug>.md`, in the category
   that matches what the component does: `buttons/`, `feedback/`, `layout/`,
   `community/`, and so on, with `extras/` for the components aardvark adds for
   documentation sites.
2. The page contains:
   - one line on what the component is and does (see [Docs style](#docs-style));
   - its syntax, in a code fence wrapped in `{% raw %}` … `{% endraw %}`;
   - a live example with its source: the rendered component, plus the same
     Markdown in a `{% raw %}`-wrapped fence;
   - a table of every attribute the component accepts.

   `content/components/data-display/badge.md` is the model to copy.
   `content/components/data-display/accordion.md` shows a component with a
   Markdown body, and `content/components/inputs/rating.md` shows an
   `attr={…}` event handler.
3. The page needs no navigation config. It joins its category's `index.md`,
   which sits under **Built-in Components** in the Docs menu
   (`content/components/index.md` declares `menu: docs`, and each category's
   `index.md` points `parent: components` at it). The page is placed in the
   sidebar alphabetically by title; add a `weight:` only to override that order.

Template tags run before Markdown, even inside code fences, so a tag you want to
show rather than run must sit inside `{% raw %}` … `{% endraw %}`.

Before you open the pull request, build the site (see
[Building](README.md#building)) and open the page to check that each live example
renders.

## Docs style

Every page on this site follows these two rules:

- **Write "aardvark" in lowercase** when it names the static site generator, even
  at the start of a sentence: "aardvark builds the site", the `aardvark` command,
  `aardvark.config.yaml`. "Aardvark" with a capital A names the company.
- **Write "open source" as a noun or after a verb, and "open-source" before a
  noun:** "an open-source package", but "the package is open source".

The rest apply wherever a page describes a built-in component, on its reference
page or anywhere else:

- **Describe what a component does, not what it is built on.** Write "a badge for
  labels, statuses, and counts", not "a wrapper over Mantine's Badge". Don't let
  "a (thin) wrapper over Mantine" or "a wrapper over the X island" stand in for
  what the component does.
- **Credit the project behind a community component.** Its page names the
  third-party project it bundles and that project's author, after saying what the
  component does. That credit is required, and it is not the wrapper framing
  above.
- **Keep implementation detail out of page copy.** Avoid phrases such as "props
  pass straight through to Mantine", "build-time macro", or "the underlying
  island". Readers need to know what a component does and how to use it, not how
  it is wired. A page's **CSS Selectors** section is the exception: it names the
  elements and attributes your styles target.
- **Keep a component's page about using it.** Don't send readers from it to the
  guides for building your own components under `/authoring/`, which serve a
  different reader. A factual link to the matching page of Mantine's documentation
  is fine.
- **Don't add a contribute link to a component's own page.** How to contribute is
  documented here; a reference page stays about using the component.

Those guides under `/authoring/` teach how components are built, so the
implementation terms above are their subject, including when they explain how
the built-in components work.

## Starting your own project

Use the **Use this template** button at the top of the repository to create your
own copy. Your repository is independent of this one; edit it however you like.
