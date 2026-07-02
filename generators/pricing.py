"""Generate the Pricing page from OpenRouter's live model catalog.

aardvark itself is free; only its optional built-in AI features — the reader-facing
Ask AI assistant and the author-assisting tools — cost anything, billed per token
through aardvark's metered gateway. aardvark is a pass-through: any OpenRouter model
works for `ai.model` / `ai.assistant.model`, so this script lists the whole chat-model
catalog (with context window + modality) at aardvark's published per-token rates.

It runs on every build; output is reconciled idempotently, so an unchanged catalog
rewrites nothing (and `vark dev` never loops on it). The fetch is cached briefly and
falls back to the last good snapshot — then to a notice — so a build never breaks when
OpenRouter is unreachable. Output is sorted, so it's deterministic across builds.
"""

import json
import os
import re
import time
import urllib.request

MODELS_URL = "https://openrouter.ai/api/v1/models"
# aardvark's published per-token rate over the upstream list price.
RATE = 1.5
CACHE_TTL_SECONDS = 3600
# Defensive cap on a fetched response body (both catalogs are well under 1 MB today);
# a truncated read just fails json.loads and falls back to the cache/empty path.
MAX_RESPONSE_BYTES = 16 * 1024 * 1024

# Artificial Analysis "Intelligence Index" — an independent model-quality score. Their API
# is free but keyed: set ARTIFICIAL_ANALYSIS_API_KEY to add a Quality column. Without a key
# the column is simply omitted. Build-time + cached use fits their "cache responses, don't
# put keys in client code" terms. See https://artificialanalysis.ai/documentation.
AA_MODELS_URL = "https://artificialanalysis.ai/api/v2/data/llms/models"
AA_KEY_ENV = "ARTIFICIAL_ANALYSIS_API_KEY"


def _fetch_models(cache_path):
    """OpenRouter's model list, via a short-lived cache, falling back to the last good
    snapshot when the network is unavailable. Returns [] if nothing is available."""
    now = time.time()
    if cache_path.exists() and now - cache_path.stat().st_mtime < CACHE_TTL_SECONDS:
        try:
            return json.loads(cache_path.read_text(encoding="utf-8"))["data"]
        except Exception:
            pass
    try:
        req = urllib.request.Request(MODELS_URL, headers={"User-Agent": "aardvark-docs"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            payload = json.loads(resp.read(MAX_RESPONSE_BYTES).decode("utf-8"))
        data = payload["data"]  # validate BEFORE caching, so a bad payload can't clobber a good snapshot
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(payload), encoding="utf-8")
        return data
    except Exception:
        if cache_path.exists():  # a stale snapshot beats a broken page
            try:
                return json.loads(cache_path.read_text(encoding="utf-8"))["data"]
            except Exception:
                return []
        return []


# --- Artificial Analysis Intelligence Index (optional quality column) -------------------

# AA tags an OpenRouter model wouldn't carry — reasoning effort, format, freshness — so
# stripping them lets 'qwen3-32b' match AA's 'Qwen3 32B (Non-reasoning)', etc. Model TIER
# words (mini/pro/flash/nano/lite/large/coder/vl) are NOT noise and are kept.
_NOISE = {
    "reasoning", "thinking", "non", "nonreasoning", "instruct", "chat", "preview", "latest",
    "fast", "free", "beta", "experimental", "exp", "adaptive", "effort", "high", "low",
    "medium", "minimal", "online", "turbo", "oct", "jun", "june",
}


def _toks(s):
    return [t for t in re.split(r"[^a-z0-9]+", str(s).lower()) if t]


def _key_toks(s):
    """Tokens minus AA noise and date tags (4+ pure digits like 2507 / 20260420)."""
    return [t for t in _toks(s) if t not in _NOISE and not (t.isdigit() and len(t) >= 4)]


def _keys(s):
    """Four lookup keys for a string: strict-joined, strict-sorted, denoised-joined,
    denoised-sorted — namespaced so two variants can't collide across models."""
    t, kt = _toks(s), _key_toks(s)
    return [
        "n:" + "".join(t),
        "s:" + " ".join(sorted(t)),
        "ns:" + "".join(kt),
        "ss:" + " ".join(sorted(kt)),
    ]


def _fetch_intelligence(cache_path, api_key):
    """Return (idx, families): ``idx`` maps namespaced model keys -> the BEST Artificial
    Analysis Intelligence Index seen for that key (so reasoning/non-reasoning variants
    that collapse to one key report the higher score); ``families`` is a list of
    (creator, token-set, score) used to resolve version-less '-latest' aliases. Both empty
    when no key is set or the API is unreachable, in which case the column is omitted."""
    if not api_key:
        return {}, []
    payload = None
    now = time.time()
    if cache_path.exists() and now - cache_path.stat().st_mtime < CACHE_TTL_SECONDS:
        try:
            payload = json.loads(cache_path.read_text(encoding="utf-8"))
        except Exception:
            payload = None
    if payload is None:
        try:
            req = urllib.request.Request(
                AA_MODELS_URL, headers={"x-api-key": api_key, "User-Agent": "aardvark-docs"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                payload = json.loads(resp.read(MAX_RESPONSE_BYTES).decode("utf-8"))
            # Validate BEFORE caching (mirrors _fetch_models), so a structurally bad payload
            # can't clobber a good snapshot; on failure we fall back to the existing cache.
            if (payload.get("data") if isinstance(payload, dict) else payload) is None:
                raise ValueError("Artificial Analysis response had no model data")
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(json.dumps(payload), encoding="utf-8")
        except Exception:
            if cache_path.exists():
                try:
                    payload = json.loads(cache_path.read_text(encoding="utf-8"))
                except Exception:
                    return {}, []
            else:
                return {}, []

    models = payload.get("data") if isinstance(payload, dict) else payload
    idx, families = {}, []
    for m in models or []:
        score = (m.get("evaluations") or {}).get("artificial_analysis_intelligence_index")
        if not isinstance(score, (int, float)):
            continue
        name = m.get("name") or ""
        slug = m.get("slug") or ""
        creator = (m.get("model_creator") or {}).get("slug") or ""
        for raw in (name, slug):
            for k in _keys(raw):
                if k != "n:" and k != "s:" and k != "ns:" and k != "ss:":  # skip empty
                    if score > idx.get(k, float("-inf")):
                        idx[k] = score
        fam = frozenset(_key_toks(slug) or _key_toks(name))
        if creator and fam:
            families.append(("".join(_toks(creator)), fam, score))
    return idx, families


def _or_candidates(model):
    """Strings to try matching an OpenRouter model against AA: its name (minus the
    'Provider: ' prefix) and its slug's last segment (minus any ':free' tag)."""
    mid = model.get("id", "").lstrip("~")
    name = model.get("name", "")
    short = name.split(": ", 1)[1] if ": " in name else name
    last = mid.split("/")[-1].split(":")[0]
    return [short, last]


def _intelligence(model, idx, families):
    """The AA Intelligence Index for an OpenRouter model, or '—' if unmatched. Tries the
    most precise key first (strict) before the denoised/sorted fallbacks; a version-less
    '-latest' alias falls back to the best score among the models whose tokens it's a
    subset of (e.g. claude-sonnet-latest -> the highest-scoring claude+sonnet)."""
    cands = _or_candidates(model)
    for kind in ("n:", "s:", "ns:", "ss:"):
        for c in cands:
            for k in _keys(c):
                if k.startswith(kind) and k in idx:
                    return f"{idx[k]:.1f}"
    mid = model.get("id", "")
    if mid.endswith("latest"):
        # The alias's family+tier tokens (e.g. {claude, sonnet}, {kimi}) are vendor-distinct,
        # so we don't gate on creator — OpenRouter's creator slug ('moonshotai') and AA's
        # ('kimi') don't share a vocabulary, which would otherwise drop matches like kimi-latest.
        want = set(_key_toks(cands[1]))  # last segment, e.g. {claude, sonnet} / {kimi}
        best = None
        for _fcreator, ftoks, score in families:
            if want and want <= ftoks:
                best = score if best is None else max(best, score)
        if best is not None:
            return f"{best:.1f}"
    return "—"


def _cell(value):
    """Make a vendor-supplied value safe for a Markdown table cell, the template engine,
    AND the HTML renderer (markdown runs with html=True). Flatten newlines; escape the pipe
    separator; drop backticks (a backtick can't be escaped inside a `…` code span, so a
    slug containing one would break out — vanishingly rare, so just remove it); neutralize
    ``{`` so a name can't form a ``{% %}`` / ``{{ }}`` directive; and HTML-escape ``<``/``>``
    so a name like ``<script>`` can't inject raw markup."""
    return (
        str(value)
        .replace("\n", " ")
        .replace("\r", " ")
        .replace("|", "\\|")
        .replace("`", "'")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("{", "&#123;")
        .strip()
    )


def _price(per_token):
    """aardvark's price per one million tokens, from an upstream per-token rate string.
    A negative rate is OpenRouter's "variable" sentinel (dynamic routers) — never a
    real price — so it renders as a dash rather than a bogus negative dollar amount."""
    try:
        rate = float(per_token)
    except (TypeError, ValueError):
        return "—"
    if rate < 0:
        return "—"
    return f"${rate * 1_000_000 * RATE:,.2f}"


def _priced(model):
    """Whether a model has a published (stated) per-token price. Excludes OpenRouter's dynamic
    routers (e.g. ``openrouter/auto``, ``fusion``), whose ``prompt``/``completion`` are
    the ``-1`` "price depends on routing" sentinel — meaningless on a pricing table."""
    pricing = model.get("pricing") or {}
    for key in ("prompt", "completion"):
        try:
            if float(pricing.get(key)) < 0:
                return False
        except (TypeError, ValueError):
            return False
    return True


def _context(length):
    """A compact context-window label: 1000000 -> 1M, 131072 -> 131K."""
    try:
        n = int(length)
    except (TypeError, ValueError):
        return "—"
    if n <= 0:
        return "—"
    if n >= 1_000_000:
        v = n / 1_000_000
        return f"{v:.0f}M" if v == int(v) else f"{v:.1f}M"
    if n >= 1000:
        return f"{n // 1000}K"
    return str(n)


# A representative AI Assistant turn (one question -> one answer): the docs context the
# assistant inlines (and replays on every turn) plus a typical reply. Input dominates, so
# a single turn costs far less than the per-million output rate suggests. ~68K in / ~600
# out reproduces a real measured Sonnet turn (~$0.32) for this site's corpus.
TURN_INPUT_TOKENS = 68_000
TURN_OUTPUT_TOKENS = 600


def _per_turn(pricing, context_length):
    """Estimated cost of one assistant turn at aardvark's rates. Caps the inlined input at
    the model's context window — a small-context model can't inline the whole corpus."""
    try:
        prompt_rate = float(pricing.get("prompt"))
        completion_rate = float(pricing.get("completion"))
    except (TypeError, ValueError):
        return "—"
    if prompt_rate < 0 or completion_rate < 0:
        return "—"
    try:
        ctx = int(context_length)
    except (TypeError, ValueError):
        ctx = TURN_INPUT_TOKENS + TURN_OUTPUT_TOKENS
    in_tokens = min(TURN_INPUT_TOKENS, max(0, ctx - TURN_OUTPUT_TOKENS))
    cost = (in_tokens * prompt_rate + TURN_OUTPUT_TOKENS * completion_rate) * RATE
    return f"${cost:,.2f}"


def _type(architecture):
    """A short modality label: 'Text', 'Text + image', 'Multimodal out', …."""
    arch = architecture or {}
    inputs = set(arch.get("input_modalities") or [])
    outputs = set(arch.get("output_modalities") or [])
    if outputs - {"text"}:
        return "Multimodal out"
    extra = sorted(inputs - {"text"})
    return "Text + " + "/".join(extra) if extra else "Text"


def _is_floating(model_id):
    """The auto-updating router aliases (e.g. ``~anthropic/claude-sonnet-latest``)."""
    return model_id.endswith("latest")


def _row(model, intel=None):
    """One table row. ``intel`` is (exact, sorted_) AA maps, or None to omit the column."""
    pricing = model.get("pricing") or {}
    ctx = model.get("context_length")
    cells = [
        _cell(model.get("name", model.get("id", ""))),
        f"`{_cell(model.get('id', ''))}`",
        _cell(_type(model.get("architecture"))),
        _context(ctx),
    ]
    if intel is not None:
        cells.append(_intelligence(model, *intel))
    cells += [
        _price(pricing.get("prompt")),
        _price(pricing.get("completion")),
        _per_turn(pricing, ctx),
    ]
    return "| " + " | ".join(cells) + " |"


def _header(has_intel):
    cols = ["Model", "Slug", "Type", "Context"]
    align = ["---", "---", "---", "--:"]
    if has_intel:
        cols.append("Quality")
        align.append("--:")
    cols += ["Input", "Output", "Est./answer"]
    align += ["--:", "--:", "--:"]
    return "| " + " | ".join(cols) + " |\n| " + " | ".join(align) + " |"

# A prominent warning about $0.00 (free-pool) models. Plain string (NOT an f-string)
# so its `{% %}` directive and `{ }` aren't treated as fields/template by Python.
_FREE_WARNING = (
    "{% callout severity='warning' title='Free ($0.00) models come with hard limits' %}\n"
    "A model priced **$0.00** runs on OpenRouter's shared **free pool** — handy for trying "
    "things out, but with real trade-offs you should plan around:\n\n"
    "- **Slow and queue-bound.** Free requests are low priority and share a queue, so "
    "responses are slower and degrade further under load.\n"
    "- **Capped per day and per minute.** Free usage is limited to roughly a few dozen "
    "requests per day (more once you keep credit on file) plus a low per-minute rate; once "
    "you hit the cap, requests are refused until the window resets. See "
    "[OpenRouter's rate limits](https://openrouter.ai/docs/api-reference/limits) for the "
    "current numbers.\n"
    "- **Best-effort availability.** Free endpoints can be throttled, deprecated, or "
    "briefly unavailable with no notice.\n"
    "- **Your inputs may train models.** Some free providers may use prompts for training, "
    "so don't send anything sensitive through a free model.\n\n"
    "For a public **Ask AI assistant** under real traffic, choose a paid model — the limits "
    "above will otherwise rate-limit or stall your readers.\n"
    "{% endCallout %}\n\n"
)


def _build():
    # `config` and `generate` are injected into every generation script (along with `data`
    # and `site`) — the same ambient names a page's {% %} blocks see, plus the page writer.
    cache_dir = config.root / ".aardvark-cache"
    cache = cache_dir / "openrouter-models.json"
    # Chat-capable models we can price = emits text AND has a real (non-sentinel) rate.
    # Sorted by slug so the catalog groups by provider and is deterministic build-to-build.
    chat = [
        m
        for m in _fetch_models(cache)
        if "text" in ((m.get("architecture") or {}).get("output_modalities") or [])
        and _priced(m)
    ]
    chat.sort(key=lambda m: m.get("id", ""))

    # Optional quality column from Artificial Analysis (only when a key is configured).
    idx, families = _fetch_intelligence(
        cache_dir / "aa-intelligence.json", os.environ.get(AA_KEY_ENV, "").strip()
    )
    intel = (idx, families) if idx else None

    if not chat:
        body = (
            "aardvark is **free and open**; only its optional built-in AI features are "
            "billed. Live model prices couldn't be fetched for this build.\n\n"
            "{% callout severity='info' %}\n"
            "See [openrouter.ai/models](https://openrouter.ai/models) for current rates.\n"
            "{% endCallout %}\n"
        )
        generate("pricing.md", _front(), body)
        return

    recommended = [m for m in chat if _is_floating(m.get("id", ""))]
    rec_table = ""
    if recommended:
        rec_table = (
            "## Recommended (auto-updating)\n\n"
            "These floating aliases always route to the provider's newest model, so you "
            "never pin a version. aardvark's default config uses "
            "`~anthropic/claude-sonnet-latest`.\n\n"
            f"{_header(intel is not None)}\n"
            + "\n".join(_row(m, intel) for m in recommended)
            + "\n\n"
        )

    # A single column legend up top, so the meaning of every table column is
    # explained before either table. Input/Output and Est./answer are always
    # present; the Quality line is added only when the Artificial Analysis index
    # powers that column. (Renders as a Markdown list inside the callout.)
    legend = (
        "{% callout severity='info' title='Reading the columns' %}\n"
        "- **Input** / **Output** are priced per **one million tokens**.\n"
        "- **Est./answer** estimates one assistant turn — roughly "
        f"{TURN_INPUT_TOKENS // 1000}K tokens of inlined docs context plus a "
        f"~{TURN_OUTPUT_TOKENS}-token reply (capped at each model's context window). "
        "Input dominates, so a single answer costs far less than the per-million "
        "output rate suggests; your real numbers vary with your docs size and "
        "answer length.\n"
        + (
            "- **Quality** is the independent [Artificial Analysis Intelligence "
            "Index](https://artificialanalysis.ai/) (higher is better); it's blank "
            "for models Artificial Analysis doesn't cover.\n"
            if intel is not None
            else ""
        )
        + "{% endCallout %}\n\n"
    )

    body = (
        "aardvark is **free and open**: author your docs, build the static site, and "
        "self-host it as much as you like at no cost.\n\n"
        "The only paid parts are the optional **built-in AI features**:\n\n"
        "- the reader-facing **Ask AI assistant** ([see it in action](/ai-assistant/));\n"
        "- the **author-assisting** tools — `vark author` and build-time enrichment.\n\n"
        "These stream through aardvark's metered gateway and are billed per token. aardvark "
        "is a pass-through to OpenRouter, so you can point `ai.model` / `ai.assistant.model` "
        "at **any** model below — you pay only for the AI you actually use.\n\n"
        + legend
        + f"{rec_table}"
        + "## All models\n\n"
        + _FREE_WARNING
        + "Click a column header to sort. "
        f"{len(chat)} models with published per-token pricing are available.\n\n"
        + f"{_header(intel is not None)}\n"
        + "\n".join(_row(m, intel) for m in chat)
        + "\n\n_Rates are pulled at build time and can change._\n"
    )
    generate("pricing.md", _front(), body)


def _front():
    return {
        "title": "Pricing",
        "description": (
            "aardvark is free; only its built-in AI features are billed, "
            "per token, at these rates."
        ),
        "menu": "pricing",
        "mode": "wide",  # a big table — widen the content column, drop the right TOC
    }


# Run it. A generation script is plain build-time Python with no entry function; this one
# keeps its logic in _build() and calls it here.
_build()
