# Contributing

Thanks for your interest.

## Issues are welcome

If you find a bug in this example, have a suggestion, or something is unclear,
please [open an issue](../../issues/new). We read them.

## Pull requests are welcome

This repository accepts contributions through public pull requests, but its
`main` branch has a single writer: the outbound publisher in the private Aardvark
repository. “Two-way” means contributions travel inward for review and accepted
snapshots travel outward; it does not mean public pull requests are merged here.

For a new eligible change, the normal lifecycle is:

1. Open a pull request against public `main` and keep it open.
2. The existing GitHub App sends a signed event that immediately enqueues the
   private sync for this exact pull request. A bot validates and replays the
   eligible file changes into a ready-for-review `sample-site-sync/pr-<number>` PR in the
   private Aardvark source repository. There is no scheduled poll, public sync
   workflow, or public secret.
3. Maintainers review the complete private diff, run isolated CI, resolve any
   replay conflicts in Aardvark, and merge only the private mirror PR. You do not
   need to rebase merely to account for private-source changes.
4. Merging the private mirror pushes private `main`, which triggers the normal
   publisher to append a bot-authored sync commit containing the accepted
   private snapshot to public `main`.
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
overlay—currently `README.md`, `CONTRIBUTING.md`, and `LICENSE`—can be proposed
through this flow. Agent instruction files are the exception — `AGENTS.md`,
`AGENTS.override.md`, `CLAUDE.md`, and `CLAUDE.local.md`. Coding agents load them
wherever they sit, so they publish outbound from the source repository only and
the sync refuses an inbound change to one at any depth. The same goes for the
agent toolchains' own config directories — `.claude/`, `.codex/` and `.cursor/`,
plus the legacy `.cursorrules` — which those tools discover by walking the tree. For safety, it also refuses changes at the
repository root under `.github/` and `worker/`, as well as any path component
named `.git`, symlinks, submodules, unsafe paths, and changes that exceed its
size limits. A refused pull request receives a generic explanation; open an issue if a
maintainer needs to make that change in the source repository.

Public pull requests are never merged into public `main`; that branch accepts
only bot-authored outbound sync commits from the Aardvark repository. Normal
publishing is append-only, preserving the public branch and fork history needed
for ongoing contributions.

## Starting your own project

Use the **Use this template** button at the top of the repository to create your
own copy. Your repository is independent of this one; edit it however you like.
