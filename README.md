# aardvark sample site

This is the example site for aardvark, a Mantine-powered static site generator:
author in Markdown, build to static HTML with interactive React islands. It
doubles as a starter template for new documentation sites and as the project's
own documentation.

> This repository is a read-only, automatically published mirror of an upstream
> source. Issues are welcome, but pull requests are not accepted and are closed
> automatically. See [CONTRIBUTING](CONTRIBUTING.md).

## Use it for a new project

Click **Use this template** at the top of this page to create your own repository
seeded with this structure, then edit the content under `content/` and the
configuration in `aardvark.config.yaml`.

## Building

> Note: building requires the `aardvark` CLI, which is not yet publicly
> distributed. Until it is, this repository is most useful as a reference for how
> an aardvark site is structured, and for filing issues. The steps below are what
> a build looks like once the CLI is available.

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
