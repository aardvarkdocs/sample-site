---
title: Managed hosting
navtitle: Managed hosting
description: Let Aardvark cloud host your docs — push-to-deploy from your GitHub repo or
  `vark deploy` from your machine, public branch previews, and your own custom domain
  with automatic SSL.
icon: fa-solid fa-cloud-arrow-up
menu: docs
weight: 61.5
---

# Managed hosting

Prefer not to run your own host? **Aardvark cloud** can serve your docs for you, two ways.
Connect the GitHub repository that holds your site, and every push to your production branch
is built and published automatically, with other branches getting their own **preview
URLs** — or run [`vark deploy`](#deploy-from-your-machine-with-vark-deploy) to build on your
own machine and upload the result. Either way, production serves on your **own domain** with
SSL handled for you.

Managed hosting is included on the **Pro, Business, and Enterprise** plans — see
[Plans & pricing](/pricing/). If your plan later lapses, your site doesn't vanish: the
last live deploy **keeps serving**, and you can still view the site, detach its custom
domain, or delete it entirely — only new deploys and domain verification/attach pause
until the plan is back. On Free, everything on this page is the one thing you bring
yourself: the [static `build/` output](/deployment/) deploys to any host.

## What you need

- An Aardvark cloud account on a **Pro or higher** plan — sign in at the gateway
  **dashboard** and upgrade on the **Billing** tab if you're on Free.
- The **owner or admin** role on that account. Hosting changes what the account serves
  publicly and meters compute, so like Billing it's owner/admin-only — a member signing
  in sees the Hosting page refused. (`vark deploy` and the API authenticate with the
  account **secret key**, which carries owner authority — treat it like a password.)
- For push-to-deploy, a **GitHub repository** containing your Aardvark site (the directory
  with `aardvark.config.yaml` and `content/`); for `vark deploy`, just the CLI on the
  machine you build from.
- A **domain you control** to serve production on — see
  [Production serves on your custom domain](#production-serves-on-your-custom-domain).

## Connect your repository

Hosting uses the same GitHub connection as [Docs Quality Checks](/github-automation/):

1. Open the dashboard and click **Connect GitHub**.
2. You're sent to GitHub to install the Aardvark app — **choose which repositories** to
   grant it. Pick the repo that holds your docs.
3. Back in the dashboard, the connected repo is ready to host from.

You stay in control on GitHub: the app sees only the repositories you select, and you can
change or revoke that at any time from your GitHub settings.

## Create the site

On the dashboard's **Hosting** page, create the site: pick the connected repository, choose
a **slug**, and confirm the **production branch** (your repo's default branch unless you say
otherwise). In a **monorepo**, also set the **project directory** — the folder holding your
Aardvark project (e.g. `docs`); leave it blank to build from the repo root.

The slug names your preview URLs, so it follows hostname rules: 3–40 characters of
lowercase letters, digits, and single hyphens, starting and ending with a letter or digit.
It can't contain `--` (that's what separates a branch from the slug in a preview hostname),
and a handful of operational names — `www`, `docs`, `api`, `app`, `blog`, `help`, `status`,
and the like — are reserved.

An account hosts **one site**. A repo-built site and a `vark deploy` site can't coexist:
delete one before creating the other, and let that deletion finish (the Hosting page shows
its progress) before the new site can be created.

That's the whole setup. From here on, deploys are driven by your repo.

## Deploys: on push, or on demand

- **Push to deploy.** A push to the production branch builds your site on Aardvark's
  runners and publishes the result. Nothing is written to your repository — no workflow
  YAML, no secrets. Hosted builds are metered compute like [Docs Quality Checks](/github-automation/)
  runs, so they need a balance that can cover them: if yours can't, the push is recorded
  as a failed deploy (`insufficient_balance`) and deploys resume once you top up.
- **Deploy now.** The Hosting page also has a **Deploy now** button that rebuilds and
  redeploys the **production branch** — useful for re-running a failed build without
  pushing a new commit. (Deploying a specific branch by hand is an [API call](#the-api-if-youd-rather-script-it);
  pushing to the branch does the same thing.) If a deploy for the branch is already in
  progress, wait for it to finish.

The Hosting page shows each deploy's status, branch, and commit, and the URLs the site
serves on. A failed build reports why, and the previous deploy keeps serving until a new
one succeeds — a broken push never takes your live docs down.

A hosted build is the full `vark build` — your generators, the islands bundle, and the
whole-site PDF when your config asks for one — and it runs in a job that holds **no
credentials**: no gateway key, no repository token, and no environment variables of yours.
It has to finish within **30 minutes**. A site whose build takes longer (a large site with
`pdf: true` is the usual cause) deploys with
[`vark deploy`](#deploy-from-your-machine-with-vark-deploy) instead.

> **Password-protected directories can't build on a push-to-deploy site.** A
> [`protected:` section](/protected-pages/) needs its password in an environment variable
> at build time, and the build **stops** rather than publish those pages unencrypted when
> the variable is missing. A hosted build has nowhere to hold a secret of yours — that
> credential-less build job is deliberate — so a site with `protected:` entries deploys with
> [`vark deploy`](#deploy-from-your-machine-with-vark-deploy): the build runs on your machine
> with the variable set, and only the encrypted pages are uploaded. (A
> [self-hosted build](/deployment/) works the same way.) **Don't** work around it by
> committing the password to the repository, which would defeat the protection for anyone
> with repo access and leave it in your git history.

## Production serves on your custom domain

On Aardvark cloud, a site's **production** deploy is reachable only on a custom domain you
attach — there is no `<slug>.aardvarkdocs.site` production address. Until a domain is
attached, production builds still succeed and are held ready (the Hosting page says *Attach
a custom domain below to go live*), and once one is live your production deploy serves
there. Branch previews are different: they serve on `aardvarkdocs.site` right away, no
domain needed.

So a first launch goes: create the site, push (or `vark deploy`) so a production deploy
exists, then [attach a custom domain](#attach-a-custom-domain). The site is live when the
certificate is issued, and the dashboard shows which of those steps is still outstanding.

## Deploy from your machine with `vark deploy`

`vark deploy` runs the same production build as `vark build` on your own machine and
uploads the output to Aardvark cloud — no repository connection, no hosted build. It's the
path for sites that can't build on the runner (password-protected sections, a build that
needs your environment or more than 30 minutes) and for anyone who'd rather not connect
GitHub at all:

```bash
export AARDVARK_SECRET_KEY=aardvark_secret_...   # or put it in the project's .env
vark deploy                     # build, then upload ./build and make it live
vark deploy --no-build          # upload an existing ./build as-is
vark deploy --slug my-docs      # deploy to (or create) the site my-docs
```

- **The first run creates the site.** An account with no site gets one created for it —
  with the slug you pass, or a generated one. After that, `vark deploy` always targets the
  account's CLI site. A site connected to a GitHub repository keeps deploying from that
  repository; `vark deploy` refuses it before spending a build.
- **It deploys production only.** Every upload goes to the site's production branch — a
  CLI site has no branch previews, and **Deploy now** doesn't apply to it (there is no
  repository to build from).
- **Interrupted uploads resume.** Files upload in parallel with retries; if a run is cut
  off, the next `vark deploy` picks the in-flight deploy back up, and re-uploading an
  unchanged file is always safe. The site switches to the new deploy only once every file
  is in.
- **Limits:** 25 MB per file, and 10,000 files or 500 MB per deploy — checked locally
  before anything is sent. Symlinks in the build output are refused.
- **What it prints.** The URL the deploy serves on — for production, your attached custom
  domain. Until you've attached one, it says so and points you to the Hosting page.

`vark deploy` doesn't spend metered compute — your own machine did the build — and the
secret key is read from `AARDVARK_SECRET_KEY` in the environment or your project's `.env`.

## Branch previews

Pushes to branches other than the production branch deploy too — each branch serves at its
own stable preview URL on `aardvarkdocs.site`, built from a DNS-safe form of the branch
name, a short stable hash, and your slug: `<branch>-<hash>--<slug>.aardvarkdocs.site` (the
exact URL for every deploy is shown on the Hosting page). Push a docs PR branch, and
reviewers can read the built site instead of the diff.

One naming constraint: a deployable branch name uses only letters, digits, and `. _ / -`
(so `docs+api` is rejected as `bad_branch`, while `docs-api` deploys fine), must be a form
git itself accepts, and can't sit in the `aardvark/` namespace — that prefix is reserved
for the branches Aardvark's own automations open. A push to a branch outside those rules
shows up on the Hosting page as a failed deploy rather than a preview.

> **Previews are public by default.** Anyone who has a preview URL can open it — there's no
> login in front. Don't push drafts you aren't comfortable being read to a hosted branch.
> (And `protected:` sections aren't the answer here: they can't build on a push-to-deploy
> site — see above.)
>
> **Reader authentication** closes that. With it on, every hostname the site serves —
> production, previews, and an attached custom domain alike — asks for a sign-in first, and
> only members of the dashboard team that owns the account get through (with the team's SSO
> enforcement applied, if you use it). It is a per-site switch, so there's no way to gate
> previews while leaving production open. Turning it **on** needs a **Business or
> Enterprise** plan (turning it off never does), and it's set through the API rather than a
> dashboard control — `site_id` is the `id` that `GET /v1/sites` returns:
>
> ```bash
> curl -X PUT https://gateway.aardvarkdocs.com/v1/sites/<site_id>/reader-auth \
>   -H "Authorization: Bearer $AARDVARK_SECRET_KEY" \
>   -H "Content-Type: application/json" -d '{"enabled": true}'
> ```
>
> Two things to know before you rely on it. Turning it on is **not instantaneous**:
> Aardvark's servers cache which deploy a hostname points at, and that cache can't be
> cleared on demand, so a location that already looked the site up can keep serving it
> publicly for a short window after the switch — the API's reply gives the exact bound
> (`propagation_seconds`). Treat the site as public until that window has passed; if
> something must never be published even briefly, gate the site first, or don't deploy it
> at all. And a reader's sign-in lasts **12 hours**: removing someone from the team stops
> new sign-ins, but a session they already hold keeps reading until it expires. The hosted
> `/mcp` endpoint is refused outright on a gated site, since it has no way to ask for a
> sign-in.

## Attach a custom domain

Your production site serves on your own hostname, say `docs.example.com`, with the
certificate issued and renewed for you:

1. **Prove you own the domain.** Enter the hostname on the Hosting page and click **Verify
   domain**: the dashboard gives you a **TXT record** to publish — the name
   `_aardvark-verify.docs.example.com` with an `aardvark-site-verification=…` value. Add it
   at your DNS provider, then click **Check again** — the check runs when you ask, not in
   the background. DNS can take a few minutes to propagate, so "not verified yet" right
   after publishing is normal; check again shortly. The record has to sit at the exact
   hostname you're attaching (not a parent domain), and the hostname can't be under
   `aardvarkdocs.site`.
2. **Attach the domain** on the Hosting page.
3. **Point DNS at Aardvark.** After the attach, the dashboard shows the **CNAME** target
   (`<slug>.aardvarkdocs.site`) to point your hostname at — and, if certificate validation
   needs them, one or two more records to publish. Add them at your DNS provider; the
   dashboard then tracks validation and certificate status until the domain is live.

A site has one custom domain at a time; **detach** it from the Hosting page to move to a
different hostname — which takes production offline until the next domain is live.
Ownership proof is per hostname, and it is used up when a hostname is released (a detach,
or deleting the site), so attaching a new domain *or* re-attaching one you detached repeats
step 1. An unused proof also expires after 90 days.

## Your `_headers` and `_redirects` are honored

`vark build` [writes `_redirects` and `_headers` files](/llms-and-sitemap/) from your
aliases, redirects, and static overrides — and managed hosting reads both from each deploy,
in the same file formats Cloudflare Pages and Netlify use. One resolution-order difference
from those hosts: managed hosting matches `_redirects` rules **before** looking for a
static file, so a redirect wins even when a file exists at the same path (on Cloudflare
and Netlify it's [the other way around](/deployment/#redirects)). Two guardrails keep the
platform's security baseline intact:

- **Pinned headers.** A baseline `X-Content-Type-Options: nosniff` and a base
  Content-Security-Policy are always served. Your own CSP rules are applied *in addition*
  to the base policy, so they can tighten it but not loosen it.
- **Reserved headers.** A few headers are never settable from `_headers` —
  `Set-Cookie`, `Strict-Transport-Security`, `Clear-Site-Data`, `Refresh`, and
  `Location` among them. Rules for them are ignored.

`_redirects` rules are matched first, before static files. Redirects to your own pages and
to explicit `http(s)://` hosts work; anything else — other URL schemes, or patterns that
could be steered to an arbitrary host — is refused. Only real redirects (3xx statuses) are
applied: a `200` rewrite line is ignored and the path is served statically. Two paths belong
to the platform and can't be redirected or restyled by either file: the site's `/mcp`
endpoint (served when your build publishes an MCP server card) and `/__reader_auth/`.

The files follow Cloudflare Pages' limits — 100 header rules, 2,000 characters per header
value, and 64 KiB per file. If a deploy ships a `_headers` or `_redirects` file that can't be
applied (over a limit, or unreadable), the deploy still goes live — with the platform
baseline, minus your custom rules — and the Hosting page shows a warning saying so.

## The API, if you'd rather script it

Everything above is also available under `/v1/sites` on the gateway API, authenticated
with your account **secret key** (the same `aardvark_secret_…` key the
[CLI and gateway](/ai-gateway/) use): create the site (`{"source": "cli"}` for one that
`vark deploy` publishes to, or a connected `repo_id` for push-to-deploy), trigger a deploy
for a branch, verify, attach, poll, or detach a custom domain, and switch reader
authentication. The dashboard is the same API with buttons on it, and `vark deploy` is the
same API with a build in front of it.
