# aardvark sample site

This is the example site for aardvark, a Mantine-powered static site generator:
author in Markdown, build to static HTML with interactive React islands. It
doubles as a starter template for new documentation sites and as the project's
own documentation.

> This repository is the public contribution mirror of the sample site in
> aardvark's private source repository. “Two-way” describes the contribution
> loop, not shared write access: public changes travel inward for review and
> accepted snapshots travel outward. Issues and pull requests are welcome. See
> [CONTRIBUTING](CONTRIBUTING.md) for how they are reviewed and synced.

## Contributing to this sample

For a new eligible change, the normal lifecycle is:

1. Open a pull request here against `main`. It stays open and is not merged in
   this repository.
2. The existing GitHub App sends a signed event that immediately enqueues the
   private sync for this exact pull request. A bot validates and replays eligible
   file changes into a ready-for-review PR in the private aardvark source repository.
   Reopening the PR or pushing follow-up commits immediately redispatches that
   same exact PR; there is no scheduled poll, public sync workflow, or public secret.
3. Maintainers review the complete private diff, run isolated CI, resolve any
   conflicts there, and merge only the private mirror PR. You do not need to
   rebase merely to solve a private-source conflict.
4. Merging the private mirror pushes private `main`, which triggers the normal
   publisher to append a bot-authored sync commit here. After that push succeeds,
   a reconciliation job in that same publisher workflow verifies that the
   accepted private revision is present, then comments on and closes this
   still-unmerged public pull request.

The bot may temporarily apply `sample-site-sync: publish-needed` while accepted
work waits for that snapshot. It is automation-owned recovery state; please do
not edit or remove it.

While the private branch still contains the bot-authored mirrored revision,
reopening the PR or pushing another commit enqueues its refresh. Once maintainers
adopt a conflict resolution, merge the mirror, or the public status says the
accepted revision is waiting to be published, open a new public pull request for
further changes. Those later commits are not part of the accepted revision.

The private repository remains the source of truth. Public pull requests are
never merged into public `main`; that branch accepts only bot-authored outbound
sync commits from the aardvark repository. Normal publishing is append-only, so
open pull requests and forks retain their merge bases.

## Use it for a new project

Click **Use this template** at the top of this page to create your own repository
seeded with this structure, then edit the content under `content/` and the
configuration in `aardvark.config.yaml`.

## Building

Building this site requires the aardvark CLI, `vark`. Install it with Homebrew
on macOS (`brew tap aardvarkdocs/tap && brew install aardvark`) or download a
prebuilt binary for macOS, Linux, or Windows; see
[Installation](https://aardvarkdocs.com/getting-started/installation/) for every
option. Node.js must be installed too: the build uses it to bundle the
interactive components. Use a version that satisfies the `engines` field in this
site's `package.json`, which can ask for a newer Node than the general minimum
on the Installation page. There's no separate `npm install` step: the first
build sets up the JavaScript packages itself. When the packages the CLI carries
don't match this site's `package.json`, it runs npm for you, which needs network
access.

The site's password-protection demo, `/secretpage/`, is encrypted at build time
with the password in the `SECRET_PAGE_PW` environment variable. If it's unset or
empty, the build stops rather than publish that page unencrypted. Any password
works for a local build; it's the one you type to open that page. On any system,
the simplest place to set it is a `.env` file in this directory, which `vark`
loads before every command and `.gitignore` keeps out of commits:

```ini
SECRET_PAGE_PW=choose-a-password
```

Then build the site, or preview it while you edit:

```bash
vark build   # renders content/ to ./build
vark dev     # live preview in your browser, rebuilt on every change
```

## What's inside

- `aardvark.config.yaml` — site metadata, navigation, theme, integrations
- `content/` — Markdown pages (`content-fr/` holds the French translation)
- `data/` — JSON/YAML/CSV data available to pages
- `generators/` — Python hooks that create pages and other build outputs
- `snippets/` — custom React components
- `components/` — custom Markdown macro components
- `templates/` — HTML theme overrides and extra page layouts
- `themes/vark/` — the default theme's templates, styles and scripts, published from the
  aardvark package this site is built with (third-party notices in
  `themes/vark/THIRD_PARTY_NOTICES`)
- `static/` — assets copied as-is
- `openapi/` — OpenAPI specs rendered as reference pages
- `i18n/` — UI strings for translations

## License

MIT — see [LICENSE](LICENSE).
