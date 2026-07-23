---
title: Docs Quality Checks
navtitle: Docs Quality Checks
description: Connect a GitHub repo and run aardvark's AI-powered docs quality workflows automatically —
  on a schedule or on every commit — opening pull requests, all from the cloud-gateway dashboard.
icon: fa-brands fa-github
menu: ai
weight: 40
---

# Docs Quality Checks

**Docs Quality Checks** connect your GitHub repository to the **aardvark cloud gateway** and run
aardvark's built-in **AI-powered docs workflows** for you — on a **schedule**, on **every commit**,
or on demand — then opens a **pull request** with the changes for you to review and merge.

You set it up entirely from the gateway **dashboard**: connect a repo, tick the capabilities you
want, choose when they run, and watch the run history. There's nothing to install in your repo and
no workflow YAML to write — the runs happen on aardvark's own runners.

> Docs Quality Checks run the **same** capabilities as [Build-time AI](/ai-features/) and the
> `vark author` command, just unattended in CI. It's the hands-off way to keep metadata, skills,
> translations, and prose fresh as your docs change.

## How it works

Everything runs on **aardvark's side** — your repository carries no workflow files and no secrets:

1. You connect a repo and pick capabilities in the dashboard.
2. The gateway stores your choices and schedule. **Nothing is written to your repo.**
3. When an automation is due (schedule, a push to the chosen branch, or *Run now*), the gateway runs
   it on **aardvark's own runners**: it checks out your repo with a short-lived, repo-scoped token,
   runs the `vark` capability against your docs, and opens or updates a pull request on an
   `aardvark/<capability>` branch.
4. The run's status — and its metered cost — flow back to the dashboard as **per-capability run
   history**.

Because the real `vark` CLI does the work, nothing about how a capability works — its prompts, its
logic — ever leaves the binary. The gateway schedules the runs, opens the PRs, and meters the spend.

## Connect a repository

1. Open the gateway **dashboard** (`/dashboard`) and go to **Docs Quality Checks**.
2. Click **Connect GitHub**. You'll be sent to GitHub to install the aardvark app and **choose which
   repositories** to grant it — pick only the repos you want automated.
3. Back in the dashboard, each connected repo appears with the capabilities you can enable.

> You stay in control of access on GitHub: the app sees only the repositories you select, and you
> can change or revoke that at any time from your GitHub settings.

## Choose checks and a schedule

For each repo, turn on the checks you want and pick when each one runs:

- **Run on every commit** — the check runs on each push to the branch.
- **On a schedule** — enter a 5-field cron expression (e.g. `0 9 * * 1` for Mondays at 09:00 UTC).
- **Run now** — trigger a one-off run any time from the dashboard.

A check can use either trigger, both, or neither (manual-only). Click **Save** — this only updates
your automation config in the gateway; nothing is committed to your repo.

## The checks

Every check runs the **same `vark` capability** two ways: unattended from the **dashboard**, where it
opens a pull request, or locally from the **command line**, where it edits your working tree directly.
Use the dashboard for hands-off, reviewed automation; use the CLI to run a check on demand or wire it
into your own pipeline.

The CLI checks need your gateway **secret key** (the same account that powers the dashboard):

```bash
export AARDVARK_SECRET_KEY=aardvark_secret_...
```

The `vark author` checks **preview a diff by default** — add `--yes` to write the changes. Use `--all`
for every page or `--page <path>` for one, and `--model <slug>` to override the configured model. The
summary table:

| Check | Dashboard label | CLI |
| --- | --- | --- |
| [Apply style guide](#apply-style-guide) | *Apply style guide* | `vark author --action styleguide --all --yes --rulesets <id,id,…>` |
| [Enrich metadata & skills](#enrich-metadata-skills) | *Enrich metadata & skills* | `vark ai-enrich` |
| [Regenerate keywords](#regenerate-keywords) | *Regenerate keywords* | `vark author --action keywords --all --yes` |
| [Refresh descriptions](#refresh-descriptions) | *Refresh descriptions* | `vark author --action description --all --yes` |
| [Translate documentation](#translate-documentation) | *Translate documentation* | `vark build --translate` |

### Apply style guide

Rewrites each page's **prose** to follow one or more **style rulesets**, in **precedence order** —
without changing meaning, code, commands, front matter, link targets, or `{% raw %}{% %}{% endraw %}` template blocks.
aardvark ships six rulesets, condensed from each guide's own source of truth:

| Ruleset | id | Focus |
| --- | --- | --- |
| Microsoft Style Guide | `microsoft` | Microsoft's technical-writing conventions — warm, clear, concise. |
| Google Style Guide | `google` | Google developer-docs style — second person, active voice, sentence case. |
| Alex (considerate writing) | `alex` | Inclusive, considerate language — flags insensitive or exclusionary wording. |
| Writegood | `writegood` | Common prose weaknesses — passive voice, weasel words, wordiness. |
| Proselint | `proselint` | A broad prose linter — clichés, redundancies, jargon, malformed dates. |
| Readability | `readability` | Plain language — shorter sentences, simpler words, tighter paragraphs. |

**Precedence matters.** The order is meaningful: a ruleset **higher in the list wins** when two give
conflicting guidance; otherwise every selected ruleset applies with equal force. You must pick **at
least one** — there is no implicit default, so an unconfigured style-guide check never runs (it would
otherwise silently restyle against a guide you never chose).

**In the dashboard:** enable *Apply style guide*, then use the **ruleset multi-select** to add rulesets
and the **↑ / ↓ arrows** to order them by precedence (slot 1, the violet badge, wins conflicts). Save
stays disabled until at least one ruleset is picked. Then schedule the check or hit **Run now**.

**From the CLI:** pass the ids comma-separated, **highest precedence first**:

```bash
# Preview the changes (Microsoft wins conflicts, then Google)
vark author --action styleguide --all --rulesets microsoft,google

# Apply them
vark author --action styleguide --all --yes --rulesets microsoft,google

# Style a single page against all six
vark author --action styleguide --page docs/intro.md --yes \
  --rulesets microsoft,google,alex,writegood,proselint,readability
```

Omitting `--rulesets` (or passing an unknown id) fails fast and prints the six valid ids — the same
selection the dashboard enforces. Combining many rulesets makes a large prompt (~26K tokens for all
six); the run warns when the combined prompt is large, and a smaller model may not fit it — prefer the
fewest rulesets that cover your needs.

### Enrich metadata & skills

Fills in any missing page `description`/`keywords` front matter and, when
[skills](/ai-features/#what-each-does) are enabled, (re)generates the `SKILL.md` files for your planned
agent skills.

**In the dashboard:** enable *Enrich metadata & skills*, then schedule it or **Run now**.

**From the CLI** (driven by the `ai:` block in `aardvark.config.yaml` — see [Build-time AI](/ai-features/)):

```bash
vark ai-enrich
```

### Regenerate keywords

Refreshes the SEO `keywords` front matter on every page from its current content.

**In the dashboard:** enable *Regenerate keywords*, then schedule it or **Run now**.

**From the CLI:**

```bash
vark author --action keywords --all --yes      # drop --yes to preview
```

### Refresh descriptions

Rewrites each page's one-sentence `description` — the text used in search results and social cards.

**In the dashboard:** enable *Refresh descriptions*, then schedule it or **Run now**.

**From the CLI:**

```bash
vark author --action description --all --yes    # drop --yes to preview
```

### Translate documentation

Translates pages that are new or changed since the last run into each configured target language.

**In the dashboard:** enable *Translate documentation*, then schedule it or **Run now**.

**From the CLI** (needs `i18n` target languages configured — see [Build-time AI](/ai-features/)):

```bash
vark build --translate
```

> `vark author --list-actions` prints the checks runnable headless. These are the same capabilities
> documented under [Build-time AI](/ai-features/) — the dashboard just runs them unattended in CI.

## Review the results

Every run opens a pull request on an `aardvark/<capability>` branch (re-runs update the same PR), so
**nothing lands on your default branch without your review**. Merge it if the changes look good, or
close it. The dashboard's **run history** links straight to each run and its PR.

## Cost

Each run **spends from your gateway balance** on two things, both shown per run in the dashboard:

- **AI** — the capability's model calls, metered exactly as a local `vark build` / `vark ai-enrich`
  would be.
- **Compute** — because the run executes on aardvark's runners (not your own GitHub Actions), the
  runner minutes are metered too and billed to your balance.

Schedule the heavier capabilities (translation, or a style-guide pass over a large site) accordingly,
and keep an eye on your balance from the [cloud gateway](/ai-gateway/) dashboard. A run is skipped
(and shown as such) if your balance can't cover it — top up to resume.

## For operators

Docs Quality Checks are part of the cloud gateway. Offering them to your customers means installing
a GitHub App with the right permissions and webhook and setting a few Worker secrets; the full setup —
permissions, subscribed events, and the recommended OAuth identity check — is in
`gateway/GITHUB_INTEGRATION.md` in the gateway source. With the app unconfigured, the dashboard
simply shows that Docs Quality Checks aren't available, and the gateway runs exactly as before.

## Related

- [Build-time AI](/ai-features/) — the same capabilities, run during a local build.
- [aardvark cloud gateway](/ai-gateway/) — the metered account that powers and bills these runs.
- [Agent readiness](/agent-readiness/) — what fresh metadata, skills, and clean prose buy you.
