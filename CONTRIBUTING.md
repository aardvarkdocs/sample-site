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
2. A bot validates and replays the eligible file changes into a draft
   `sample-site-sync/pr-<number>` PR in the private aardvark source repository.
3. Maintainers review the complete private diff, run isolated CI, resolve any
   replay conflicts in aardvark, and merge only the private mirror PR. You do not
   need to rebase merely to account for private-source changes.
4. The next normal publish appends a bot-authored sync commit containing the
   accepted private snapshot to public `main`.
5. Only after the bot verifies that publication does it comment on and close the
   original, still-unmerged public pull request.

While an ordinary private mirror remains a draft and maintainers have not frozen
a conflict resolution, another commit on the same public branch refreshes it
automatically. Once maintainers mark that mirror ready for final review, freeze a
conflict resolution, or the public status says the accepted revision is waiting
to be published, open a new public pull request for further changes—the reviewed
mirror cannot include later commits. A conflicted draft may wait for a maintainer
resolution or explicit acknowledgement commit before isolated CI starts.

### What can be changed

Ordinary sample-site files and top-level files already owned by the private
overlay—currently `README.md`, `CONTRIBUTING.md`, and `LICENSE`—can be proposed
through this flow. For safety, the sync refuses changes at the repository root
under `.github/`, `.claude/`, and `worker/`, as well as any path component named
`.git`, symlinks, submodules, unsafe paths, and changes that exceed its size
limits. A refused pull request receives a generic explanation; open an issue if a
maintainer needs to make that change in the source repository.

Public pull requests are never merged into public `main`; that branch accepts
only bot-authored outbound sync commits from the aardvark repository. Normal
publishing is append-only, preserving the public branch and fork history needed
for ongoing contributions.

## Starting your own project

Use the **Use this template** button at the top of the repository to create your
own copy. Your repository is independent of this one; edit it however you like.
