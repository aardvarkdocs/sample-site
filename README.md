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
2. A bot validates and replays the eligible file changes into a draft PR in the
   private aardvark source repository. While an ordinary mirror remains a draft
   and maintainers have not frozen a conflict resolution, follow-up commits on
   the same public branch refresh it automatically.
3. Maintainers review the complete private diff, run isolated CI, resolve any
   conflicts there, and merge only the private mirror PR. You do not need to
   rebase merely to solve a private-source conflict.
4. The next normal publish appends a bot-authored sync commit to public `main`.
   After the bot verifies that the accepted private revision is present, it
   comments on and closes this still-unmerged public pull request.

Once maintainers mark the private mirror ready for final review, freeze a conflict
resolution, or the public status says the accepted revision is waiting to be
published, open a new public pull request for any further changes instead. Those
later commits are not part of the reviewed mirror.

The private repository remains the source of truth. Public pull requests are
never merged into public `main`; that branch accepts only bot-authored outbound
sync commits from the aardvark repository. Normal publishing is append-only, so
open pull requests and forks retain their merge bases.

## Use it for a new project

Click **Use this template** at the top of this page to create your own repository
seeded with this structure, then edit the content under `content/` and the
configuration in `aardvark.config.yaml`.

## Building

> Note: building requires the `aardvark` CLI, which is not yet publicly
> distributed. Until it is, this repository is most useful as a reference for how
> an aardvark site is structured, for proposing sample-site changes, and for
> filing issues. The steps below are what a build looks like once the CLI is
> available.

```bash
npm install            # React, Mantine, esbuild (bundles the interactive islands)
aardvark build         # renders content/ to ./build
python3 -m http.server 8000 --directory build
# open http://127.0.0.1:8000
```

## What's inside

- `aardvark.config.yaml` — site metadata, navigation, theme, integrations
- `content/` — Markdown pages (`content-fr/` holds the French translation)
- `data/` — JSON/YAML/CSV data available to pages
- `snippets/` — custom React components
- `components/` — custom Markdown block components
- `templates/` — HTML theme overrides
- `static/` — assets copied as-is
- `openapi/` — OpenAPI specs rendered as reference pages
- `i18n/` — UI strings for translations

## License

MIT — see [LICENSE](LICENSE).
