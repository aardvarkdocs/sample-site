---
title: Managed hosting
navtitle: Managed hosting
description: Let Aardvark cloud host your docs — push-to-deploy from your GitHub repo,
  public branch previews, and your own custom domain with automatic SSL.
icon: fa-solid fa-cloud-arrow-up
menu: docs
weight: 61.5
---

# Managed hosting

Prefer not to run your own host? **Aardvark cloud** can build and serve your docs for you:
connect the GitHub repository that holds your site, and every push to your production branch
is built and published automatically. Other branches get their own **preview URLs**, and you
can serve the site on your **own domain** with SSL handled for you.

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
  in sees the Hosting page refused.
- A **GitHub repository** containing your Aardvark site (the directory with
  `aardvark.config.yaml` and `content/`).

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
a **slug** (the short name your preview URLs are built from), and confirm the **production
branch** (your repo's default branch unless you say otherwise). In a **monorepo**, also set
the **project directory** — the folder holding your Aardvark project (e.g. `docs`); leave it
blank to build from the repo root. An account hosts one site.

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

> **Password-protected directories can't deploy on managed hosting yet.** A
> [`protected:` section](/protected-pages/) needs its password in an environment variable
> at build time, and the build **stops** rather than publish those pages unencrypted when
> the variable is missing. Hosted builds run with no way to configure your own secret
> environment variables, so a site with `protected:` entries currently needs a
> [self-hosted build](/deployment/) — and **don't** work around it by committing the
> password to the repository, which would defeat the protection for anyone with repo
> access and leave it in your git history.

## Branch previews

Pushes to branches other than the production branch deploy too — each branch serves at its
own stable preview URL, derived from the branch name and your slug (the exact URL for every
deploy is shown on the Hosting page). Push a docs PR branch, and reviewers can read the
built site instead of the diff.

One naming constraint: a deployable branch name uses only letters, digits, and `. _ / -`
(so `docs+api` is rejected as `bad_branch`, while `docs-api` deploys fine), must be a form
git itself accepts, and can't sit in the `aardvark/` namespace — that prefix is reserved
for the branches Aardvark's own automations open. A push to a branch outside those rules
shows up on the Hosting page as a failed deploy rather than a preview.

> **Previews are public by default.** Anyone who has a preview URL can open it — there's no
> login in front. Don't push drafts you aren't comfortable being read to a hosted branch.
> (And `protected:` sections aren't the answer here: they can't build on managed hosting —
> see above.)
>
> If you turn on **reader authentication** for the site, it covers previews and any attached
> custom domain too, not just the production URL — every hostname the site serves then asks
> for a team sign-in. It is a per-site switch, so there's no way to gate previews while
> leaving production open.
>
> Turning it on is **not instantaneous**. Aardvark's servers cache which deploy a hostname
> points at, and that cache can't be cleared on demand, so a location that already looked the
> site up can keep serving it publicly for a short window after the switch — the API tells you
> the exact bound (`propagation_seconds`). Treat the site as public until that window has
> passed. If something must never be published even briefly, don't push it and then gate it;
> gate the site first, or don't deploy it at all.

## Attach a custom domain

Your production site can serve on your own hostname, say `docs.example.com`, with the
certificate issued and renewed for you:

1. **Prove you own the domain.** The dashboard gives you a **TXT record** to publish — a
   name like `_aardvark-verify.docs.example.com` with an `aardvark-site-verification=…`
   value. Add it at your DNS provider, then click **Check again** in the dashboard — the
   check runs when you ask, not in the background. DNS can take a few minutes to
   propagate, so "not verified yet" right after publishing is normal; check again shortly.
2. **Attach the domain** on the Hosting page.
3. **Point DNS at Aardvark.** After the attach, the dashboard shows the **CNAME** target
   to point your hostname at — and, if certificate validation needs them, one or two more
   records to publish. Add them at your DNS provider; the dashboard then tracks validation
   and certificate status until the domain is live.

A site has one custom domain at a time; **detach** it from the Hosting page to move to a
different hostname. Ownership proof is per hostname, so a new domain repeats step 1.

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
could be steered to an arbitrary host — is refused.

If a deploy ships a `_headers` or `_redirects` file that can't be applied (for example,
one over the 64 KiB per-file limit), the deploy still goes live — with the platform baseline, minus
your custom rules — and the Hosting page shows a warning saying so.

## The API, if you'd rather script it

Everything above is also available under `/v1/sites` on the gateway API, authenticated
with your account **secret key** (the same `aardvark_secret_…` key the
[CLI and gateway](/ai-gateway/) use): create the site, trigger a deploy for a branch,
and verify, attach, poll, or detach a custom domain. The dashboard is the same API with
buttons on it.
