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

## Choose capabilities and a schedule

For each repo, turn on the capabilities you want and pick when each one runs:

- **Run on every commit** — the capability runs on each push to the branch.
- **On a schedule** — enter a 5-field cron expression (e.g. `0 9 * * 1` for Mondays at 09:00 UTC).
- **Run now** — trigger a one-off run any time from the dashboard.

A capability can use either trigger, both, or neither (manual-only). Click **Save** — this only
updates your automation config in the gateway; nothing is committed to your repo.

### Available capabilities

| Capability | Runs | What it does |
| --- | --- | --- |
| **Enrich metadata & skills** | `vark ai-enrich` | Fills in missing page `description`/`keywords` and regenerates the `skills/` files. |
| **Translate documentation** | `vark build --translate` | Translates new or changed pages into each configured target language. |
| **Apply style guide** | `vark author --action styleguide --all --yes` | Rewrites prose to follow the Google developer-docs style guide. |
| **Regenerate keywords** | `vark author --action keywords --all --yes` | Refreshes the SEO keywords on every page. |
| **Refresh descriptions** | `vark author --action description --all --yes` | Rewrites each page's one-sentence description. |

These are exactly the capabilities documented under [Build-time AI](/ai-features/) and the
`vark author` command — see those pages for what each one changes.

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
