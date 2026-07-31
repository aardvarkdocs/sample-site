# Agent guide: Aardvark sample site (contribution mirror)

This repository is the public contribution mirror of the sample site in
Aardvark's private source repository. Read [README.md](README.md) for what the
site is and how it is structured, and [CONTRIBUTING.md](CONTRIBUTING.md) for the
full contribution lifecycle, before making changes here.

Rules that keep automated work safe in this repository:

- Never merge a pull request or push to `main` here. Public pull requests are
  never merged into public `main`; that branch accepts only bot-authored
  outbound sync commits from the Aardvark repository, and normal publishing is
  append-only, so open pull requests and forks retain their merge bases.
- To propose a change, open a pull request against `main` and leave it open. A
  bot validates and replays the eligible file changes into a private mirror
  pull request; maintainers review and merge only that private mirror, and the
  publisher then appends the accepted snapshot here and closes the public pull
  request. There is no scheduled poll, public sync workflow, or public secret.
- While the private branch still contains the bot-authored mirrored revision,
  reopening the pull request or pushing another commit enqueues a refresh. Once
  maintainers adopt a conflict resolution, merge the mirror, or the public
  status says the accepted revision is waiting to be published, open a new
  public pull request for further changes.
- Labels such as `sample-site-sync: publish-needed` are automation-owned
  recovery state; never add, edit, or remove them.
- The sync refuses agent instruction files at any depth — `AGENTS.md` (including
  this one), `AGENTS.override.md`, `CLAUDE.md`, and `CLAUDE.local.md`. Coding
  agents load them wherever they sit, so they publish outbound from the source
  repository only and cannot be changed through a public pull request. A
  `.claude/`, `.codex/` or `.cursor/` directory (and the legacy `.cursorrules`) is
  refused at any depth for the same reason — those configure the tools that read
  the guides. The sync also refuses the
  top-level `.github/` and `worker/` directories, any `.git` path component,
  symlinks, submodules, unsafe paths, and oversized payloads. Keep proposals to
  ordinary sample-site files and the top-level files
  [CONTRIBUTING.md](CONTRIBUTING.md) lists as proposable.
