"""Generate the Pricing page from OpenRouter's live model catalog.

Aardvark itself is free to use and self-host; its optional built-in AI features — the
reader-facing Ask AI assistant and the author-assisting tools — are billed per token
through Aardvark's metered gateway (paid plans add managed hosting, seats, and support). Aardvark is a pass-through: any OpenRouter model
works for `ai.model` / `ai.assistant.model`, so this script lists the whole chat-model
catalog (with context window + modality) at Aardvark's published per-token rates.

It runs on every build; output is reconciled idempotently, so an unchanged catalog
rewrites nothing (and `vark dev` never loops on it). Output is sorted, so it's
deterministic across builds.

The degradation contract
------------------------
Network-optional: this generator never fails the build, and always reports what it fell back
to. Four rules; `tests/test_pricing_generator_degradation.py` enforces them, and the
per-function docs below do not restate them.

1. **Every failure is named**, with an accepted :data:`_KINDS` label — or the internal-defect
   sentinel ``unknown`` — that distinguishes it and says what the page will show as a result.

2. **The channel follows the PAGE.** A complete table served from a stale snapshot is an
   `info` note — unless the failure carries the internal-defect sentinel ``unknown``, which
   remains a `warn`. Missing or unusable data — an empty table, a dropped Quality column, a
   corrupt snapshot, a schema that moved — is also a `warn`. This keeps
   `scripts/check-sample-site-warnings.py` honest: ordinary upstream failures follow the page,
   while a programming error remains actionable even when cached data keeps the page complete.

3. **Nothing is cached until it is known to be usable**, and a cache write is atomic. A
   payload is validated all the way to the rows it will render before it is written, and it
   is written via a temp file and `os.replace`, so neither bad data nor a failed write can
   destroy the snapshot the next outage depends on.

4. **A healthy build is silent.** A CLEAN fetch, a cache hit inside the TTL, and an absent
   Artificial Analysis key all say nothing. (A fetch that succeeds but carries entries we
   cannot read is not a clean one: it reports the drift, once, on the fetch that found it.)
"""

import collections
import http.client
import json
import math
import os
import re
import time
import urllib.error

from aardvark.ai.model_context import ASSISTANT_LOCAL_CONTEXT_MAX_TOKENS
from aardvark.http_fetch import (
    InsecureRedirect,
    OversizeResponse,
    RedirectLoopError,
    http_get_bytes,
)
from aardvark.report import info, warn

MODELS_URL = "https://openrouter.ai/api/v1/models"
#: The ONLY host the catalog fetch may contact, redirects included. Not a formality: the
#: Artificial Analysis request below carries `x-api-key`, and urllib re-sends headers across a
#: redirect, so an upstream that answers 302 to somewhere else would hand a reader's API key to
#: whoever is there (in clear, on an HTTPS->HTTP hop). `http_get_bytes` refuses every hop that
#: is not on this list BEFORE contacting it, which is what makes that unreachable rather than
#: merely unlikely. Redirect-following is not hand-rolled here for the same reason.
OPENROUTER_HOSTS = frozenset({"openrouter.ai"})
# Aardvark's published per-token rate over the upstream list price — the Free / pay-as-you-go
# meter. Subscribers meter the same tokens at their plan's lower member rate (the seeded plan
# catalog in gateway/migrations/0044: Pro 1.4 / Business 1.3 / Enterprise 1.2), shown on the
# table as per-plan Est./answer columns rather than as multipliers — the customer-facing copy
# talks in included dollars and member discounts, never in markup math or upstream branding.
RATE = 1.5
PLAN_RATES = [("Free", 1.5), ("Pro", 1.4), ("Business", 1.3), ("Enterprise", 1.2)]
CACHE_TTL_SECONDS = 3600
# Defensive cap on a fetched response body (both catalogs are well under 1 MB today). An
# oversize body is rejected BEFORE parsing on both transport legs — the curl leg raises
# OversizeResponse, and the urllib leg's one-past-cap sentinel byte is checked in _fetch_json —
# and either way it becomes a `schema` CatalogError, degrading via the cache/empty path.
MAX_RESPONSE_BYTES = 16 * 1024 * 1024

# Artificial Analysis "Intelligence Index" — an independent model-quality score. Their API
# is free but keyed: set ARTIFICIAL_ANALYSIS_API_KEY to add a Quality column. Without a key
# the column is simply omitted. Build-time + cached use fits their "cache responses, don't
# put keys in client code" terms. See https://artificialanalysis.ai/documentation.
AA_MODELS_URL = "https://artificialanalysis.ai/api/v2/data/llms/models"
#: As above, and this is the request the allowlist exists for — it is the one with the key.
ARTIFICIAL_ANALYSIS_HOSTS = frozenset({"artificialanalysis.ai"})
AA_KEY_ENV = "ARTIFICIAL_ANALYSIS_API_KEY"


#: The accepted failure taxonomy. Undeclared internal labels normalize to ``unknown`` so an
#: already-degraded path remains nonfatal while the resulting warning stays actionable.
_KINDS = (
    "network",  # transport never produced a response (DNS, refused, TLS, timeout, reset)
    "http",     # a response arrived carrying an error status
    "json",     # a body or snapshot that is not parseable JSON
    "schema",   # parseable, but not a catalog this page can render
    "cache",    # a snapshot on disk that could not be read, or could not be replaced
    "redirect", # upstream pointed us off the allowlist or off HTTPS; refused before contact
)


class CatalogError(Exception):
    """A fetch, parse or validation failure, tagged with its :data:`_KINDS` ``kind``.

    An undeclared label becomes ``unknown`` rather than raising: this class is constructed only
    on paths that are already degrading, so a typo must not turn a degraded page into a failed
    build. The original label remains in the detail for diagnosis, while the warning gate treats
    ``unknown`` as actionable instead of allowing it as a transient upstream failure.
    """

    def __init__(self, kind, detail):
        if kind not in _KINDS:
            detail = f"{detail}; internal failure kind {kind!r} is not declared"
            kind = "unknown"
        super().__init__(detail)
        self.kind = kind


class MissingSnapshot(CatalogError):
    """No cached snapshot — the healthy cold-cache state, distinct from a read failure."""

    def __init__(self, detail="no cached snapshot exists"):
        super().__init__("cache", detail)


#: Human names for the two upstreams, used in every message so a reader knows which one broke.
OPENROUTER = "OpenRouter"
ARTIFICIAL_ANALYSIS = "Artificial Analysis"


def _fetch_json(url, headers, allowed_hosts):
    """GET ``url`` and parse the body as JSON, or raise :class:`CatalogError`.

    Goes through :func:`aardvark.http_fetch.http_get_bytes`, which owns this repository's
    HTTPS policy — scheme, host allowlist and byte ceiling applied before the initial request
    AND before every redirect hop, rather than after a credential has already been sent.
    """
    try:
        raw, _final_url = http_get_bytes(
            url, timeout=15, headers=headers, max_bytes=MAX_RESPONSE_BYTES,
            allowed_hosts=allowed_hosts,
        )
    except InsecureRedirect as exc:
        # A redirect off the allowlist or off HTTPS, refused before it was followed. Its own
        # kind because it is neither a transport failure nor a status: upstream is telling us
        # its endpoint has moved somewhere this build will not follow, which is a permanent
        # contract change that a human has to look at — and so must not be tolerated by the
        # transient-outage allowance in scripts/check-sample-site-warnings.py.
        raise CatalogError("redirect", f"the request was redirected somewhere unsafe ({exc})") from exc
    except urllib.error.HTTPError as exc:
        # Before URLError: HTTPError subclasses it, and a served error page is not an outage.
        if 300 <= exc.code < 400:
            # The urllib leg's redirect-loop cap: HTTPRedirectHandler gives up by raising an
            # HTTPError carrying the LAST 3xx status, and http_get_bytes re-raises HTTPError
            # without trying curl — so the loop never reaches the curl leg's RedirectLoopError
            # below. A 3xx on this error path is upstream bouncing us in a circle (or a
            # redirect urllib could not follow), the same contract change as a refused hop —
            # not a served error page — so it takes the `redirect` kind and stays outside the
            # transient-outage allowance in scripts/check-sample-site-warnings.py.
            # `reason` flattened onto one line: HTTPRedirectHandler's loop message is
            # multi-line, and a warning must stay one line for the warning gate's classifier.
            raise CatalogError(
                "redirect",
                "the request was redirected in a loop "
                f"(HTTP {exc.code} {' '.join(str(exc.reason).split())})",
            ) from exc
        raise CatalogError("http", f"the server answered HTTP {exc.code} {exc.reason}") from exc
    except OversizeResponse as exc:
        raise CatalogError(
            "schema", f"the response is larger than the {MAX_RESPONSE_BYTES}-byte ceiling ({exc})"
        ) from exc
    except urllib.error.URLError as exc:
        raise CatalogError("network", f"the request never completed ({exc.reason})") from exc
    except (TimeoutError, OSError, http.client.HTTPException) as exc:
        # A bare timeout/OSError can escape unwrapped, and a connection dropped mid-body
        # raises http.client.IncompleteRead, which is neither.
        raise CatalogError("network", f"the request never completed ({exc!r})") from exc
    except RedirectLoopError as exc:
        # Before RuntimeError, which it subclasses. The curl leg's redirect-loop cap: upstream
        # is bouncing us in a circle — a contract change like the refused-hop case (and the
        # urllib leg's 3xx HTTPError above), so it takes the `redirect` kind and stays outside
        # the transient-outage allowance.
        raise CatalogError("redirect", f"the request was redirected in a loop ({exc})") from exc
    except RuntimeError as exc:
        # http_get_bytes falls back to system curl on a urllib transport failure, and curl's
        # own failures — a timeout, a non-zero exit — are normalized to RuntimeError
        # (http_fetch._curl_fetch_once). Left uncaught, an ordinary outage whose urllib leg
        # failed first would abort the build from the FALLBACK leg.
        raise CatalogError("network", f"the request never completed ({exc})") from exc
    if len(raw) > MAX_RESPONSE_BYTES:
        # http_get_bytes returns up to max_bytes + 1: the extra byte is an oversize SENTINEL
        # the caller must act on, not part of the accepted limit. Without this check the
        # stated cap would not actually be enforced on the urllib leg (the curl leg raises
        # OversizeResponse itself, handled above).
        raise CatalogError(
            "schema",
            f"the response is larger than the {MAX_RESPONSE_BYTES}-byte ceiling",
        )
    return _loads(raw, f"the response body ({len(raw)} bytes)")


def _loads(data, what):
    """``json.loads``, with every way it can fail reported as ``json``."""
    try:
        # Decoding INSIDE the guard: undecodable bytes must not escape as UnicodeDecodeError.
        # RecursionError is in the tuple because the size cap bounds volume, not depth.
        return json.loads(data)
    except (ValueError, RecursionError) as exc:
        # ValueError, not the two specific subclasses (JSONDecodeError, UnicodeDecodeError):
        # on Python 3.12+ an over-long integer in the document makes json.loads raise a PLAIN
        # ValueError from the int conversion limit, which the narrower pair lets escape to
        # abort the build. Any ValueError out of json.loads means the same thing here.
        raise CatalogError("json", f"{what} is not valid JSON ({exc!r})") from exc


def _entries(payload, source, *, key_required=True):
    """``(objects, total, unreadable)`` for a catalog payload, or raise a ``schema``
    :class:`CatalogError`.

    ``key_required=False`` also accepts a bare list, one of the two shapes Artificial Analysis
    answers with. Non-object entries are returned as :class:`_Unreadable` rather than warned
    about here: whether they are worth reporting depends on whether this payload is the one
    the page ends up using, which only the caller knows.
    """
    if isinstance(payload, list):
        if key_required:
            raise CatalogError(
                "schema", f'the {source} response was a bare list, not a {{"data": …}} object'
            )
        data = payload
    elif not isinstance(payload, dict):
        raise CatalogError(
            "schema", f"the {source} response was a JSON {type(payload).__name__}, not an object"
        )
    elif "data" not in payload:
        raise CatalogError(
            "schema",
            f'the {source} response object has no "data" key '
            "(upstream changed its shape?)",
        )
    else:
        data = payload["data"]
        if not isinstance(data, list):
            raise CatalogError(
                "schema",
                f'the {source} response "data" held a JSON '
                f"{type(data).__name__}, not a list of models",
            )
    objects = [m for m in data if isinstance(m, dict)]
    # Every reader downstream calls .get on a model, so a non-object entry would crash the
    # build rather than degrade it.
    # "<raw entry N>" (N indexed over the RAW list) so these can never collide with the
    # "<model N>" placeholders callers mint over the object-only list — a collision would
    # collapse two distinct unreadable entries into one in the reported count.
    unreadable = [
        _Unreadable(f"<raw entry {i}>", "not a JSON object at all", dropped=True)
        for i, m in enumerate(data)
        if not isinstance(m, dict)
    ]
    return objects, len(data), unreadable


def _obj(value):
    """``value`` when it is a JSON object, else an empty one — the LENIENT reader, for the
    render sites, whose rows `_renderable` has already validated. Validation itself uses
    `_mapping`, which tells an absent field apart from a retyped one."""
    return value if isinstance(value, dict) else {}


def _mapping(value, field):
    """``(object, problem)`` for a field that should be a JSON object."""
    if value is None:
        return {}, None
    if isinstance(value, dict):
        return value, None
    return {}, f"{field} given as a JSON {type(value).__name__}"


def _encodable(value):
    """Whether a string survives UTF-8 encoding.

    ``json.loads`` accepts a lone UTF-16 surrogate escape (``"\\ud800"``) and hands back a
    Python str carrying it — a str that no downstream UTF-8 write can encode. Rendered, it
    would abort the build inside ``generate()``'s page write with a ``UnicodeEncodeError``
    that escapes the :class:`CatalogError` taxonomy entirely; cached (``json.dumps``
    round-trips the surrogate as the same escape), it would abort every warm build after it
    too. So encodability is part of row validation: a value that cannot be written is a value
    this page cannot render.
    """
    try:
        value.encode("utf-8")
    except UnicodeEncodeError:
        return False
    return True


def _text(value, field):
    """``(string, problem)`` for a field that should be a string."""
    if value is None:
        return "", None
    if isinstance(value, str):
        if not _encodable(value):
            return "", f"{field} carrying text UTF-8 cannot encode (a lone surrogate)"
        return value, None
    # Not coerced with str(): that is what turns {'a': 1} into a plausible-looking value.
    return "", f"{field} given as a JSON {type(value).__name__}"


def _number(value, field):
    """``(float, problem)`` for a field that should be a finite number.

    ``bool`` is rejected before anything else even though it is an ``int`` subclass, so
    ``float(True) == 1.0`` cannot turn a retyped flag into a plausible price or score.
    ``float()`` likewise accepts "NaN"/"Infinity", which compare False against every bound —
    including the ``< 0`` sentinel test — so finiteness is checked here rather than trusted.
    """
    if value is None:
        return None, None
    if isinstance(value, bool):
        return None, f"{field} given as the boolean {value!r}"
    if isinstance(value, (int, float, str)):
        try:
            number = float(value)
        except ValueError:
            return None, f"{field} given as {value!r}, which is not a number"
        except OverflowError:
            # An int too large for a float — JSON has no size limit, `float()` does. Neither
            # `float()` nor `math.isfinite()` can take it, so it has to be caught here or it
            # escapes as the one thing this generator promises never to do: fail the build.
            return None, f"{field} given as an integer too large to represent"
    else:
        return None, f"{field} given as a JSON {type(value).__name__}"
    if not math.isfinite(number):
        return None, f"{field} given as {value!r}, which is not finite"
    return number, None


def _price_fits(rate):
    """Whether a per-token rate survives being turned into what the table SHOWS.

    A finite input is not enough: ``1e300`` is a perfectly good float that overflows to ``inf``
    once multiplied out to a per-million price, and would render ``$inf``. The rendered figure
    is the thing readers see, so the rendered figure is what has to be checked.
    """
    return math.isfinite(rate * 1_000_000 * RATE)


def _modality_names(value):
    """``(names, problem)`` for a field that should be a list of modality strings.

    Names render in the Type column, so a name UTF-8 cannot encode (see :func:`_encodable`)
    is as unusable as a non-string and is filtered and reported the same way.
    """
    if value is None:
        return set(), None
    if isinstance(value, str):
        if not _encodable(value):
            return set(), "a modality name UTF-8 cannot encode (a lone surrogate)"
        return {value}, None  # unambiguous; cheap to be liberal about
    if not isinstance(value, (list, tuple)):
        return set(), f"a JSON {type(value).__name__} where a list of modalities belongs"
    names = {v for v in value if isinstance(v, str) and _encodable(v)}
    non_str = sum(1 for v in value if not isinstance(v, str))
    unencodable = sum(1 for v in value if isinstance(v, str) and not _encodable(v))
    problems = []
    if non_str:
        # Also what would make set(value) raise on an unhashable entry.
        problems.append(f"{non_str} non-string entr{'y' if non_str == 1 else 'ies'}")
    if unencodable:
        problems.append(
            f"{unencodable} entr{'y' if unencodable == 1 else 'ies'} UTF-8 cannot encode"
        )
    if problems:
        return names, f"a modality list carrying {' and '.join(problems)}"
    return names, None


def _renderable(model):
    """``(row, problems)`` for one entry.

    Three outcomes: ``(model, [])`` renders cleanly, ``(None, [])`` is legitimately not for
    this table (an absent field, a sentinel price), and a non-empty ``problems`` list is what
    we could not read. Problems can come WITH a row: a field that only decides how a row is
    LABELLED is reported without costing the row, while one that decides whether the row is
    correct at all drops it. Nothing is skipped silently on a type it did not expect.
    """
    architecture, problem = _mapping(model.get("architecture"), "an architecture")
    if problem:
        return None, [problem]
    outputs, problem = _modality_names(architecture.get("output_modalities"))
    if problem:
        return None, [f"output modalities given as {problem}"]
    if "text" not in outputs:
        return None, []  # an image-only model, or one whose architecture says nothing

    pricing, problem = _mapping(model.get("pricing"), "a pricing block")
    if problem:
        return None, [problem]
    for key in ("prompt", "completion"):
        rate, problem = _number(pricing.get(key), f"a {key} price")
        if problem:
            return None, [problem]
        if rate is not None and not _price_fits(rate):
            return None, [
                f"a {key} price of {pricing.get(key)!r}, which overflows the display rate"
            ]
        if rate is None or rate < 0:
            # Unpriced, or one of OpenRouter's dynamic routers, whose rates are the -1
            # "depends on routing" sentinel. Nothing to show; no defect.
            return None, []

    mid = model.get("id")
    if not isinstance(mid, str):
        # Not `str(mid or "")`: coercion is what lets a list or an object become a
        # plausible-looking slug that renders and that nobody can point `ai.model` at.
        return None, ["an id given as a JSON " + type(mid).__name__ if mid is not None
                      else "no id at all"]
    if not mid.strip():
        return None, ["a blank id"]
    if not _encodable(mid):
        return None, ["an id UTF-8 cannot encode (a lone surrogate)"]

    name = model.get("name")
    if isinstance(name, str) and not _encodable(name):
        # Unlike every other name problem — which only costs the label, below — this one
        # costs the ROW: `_row` renders the raw name, and a string UTF-8 cannot encode aborts
        # the page write with an error outside the taxonomy (see `_encodable`). There is no
        # "render it with incomplete detail" for a value that cannot be written at all.
        return None, ["a name UTF-8 cannot encode (a lone surrogate)"]

    # Fields below decide only how the row READS — its Type label, its display name, its
    # context column, its per-answer estimate — so an unreadable one is reported but does not
    # cost a priceable model its row.
    problems = []
    _inputs, problem = _modality_names(architecture.get("input_modalities"))
    if problem:
        problems.append(f"input modalities given as {problem}")
    for value, field in (
        (model.get("name"), "a name"),
        (model.get("context_length"), "a context length"),
        (pricing.get("request"), "a per-request price"),
    ):
        reader = _text if field == "a name" else _number
        _value, problem = reader(value, field)
        if problem:
            problems.append(problem)
    return model, problems


#: One thing we could not read: which model, why, and whether it cost us the row/value.
_Unreadable = collections.namedtuple("_Unreadable", "mid problem dropped")

#: What a parse produced: the usable ``result``, what it could not read, and the RAW entry
#: count it read them out of — raw because ``unreadable`` includes non-object entries, so a
#: models-only denominator would let "3 of 2" happen.
#: Parsing does not WARN — a payload that is parsed and then discarded (a live
#: response that turns out to be unusable, superseded by a snapshot) must not leave warnings
#: behind about a page the reader never sees. Only the caller knows which payload it kept, so
#: only the caller reports (see :func:`_load`).
_Parsed = collections.namedtuple("_Parsed", "result unreadable total")


def _reasons(unreadable):
    """The distinct problems in an ``unreadable`` list, as one semicolon-joined phrase."""
    return "; ".join(sorted({u.problem for u in unreadable}))


def _report_unreadable(parsed, source, missing_from):
    """One aggregated ``[schema]`` warning for what the page it describes could not show.

    Called only for the payload actually rendered, so the consequence it states — models
    missing from the table, or values missing from the Quality column — is one that really
    happened. Aggregated because an upstream that retypes a field retypes it for every model,
    and a line per row would bury the log.
    """
    if not parsed.unreadable:
        return
    affected = {u.mid for u in parsed.unreadable}
    dropped = {u.mid for u in parsed.unreadable if u.dropped}
    examples = ", ".join(f"{u.mid} ({u.problem})" for u in parsed.unreadable[:2])
    effect = (
        f"{len(dropped)} of them are missing from {missing_from}"
        if dropped
        else "all of them still render, with incomplete detail"
    )
    warn(
        f"Aardvark: pricing generator: {len(affected)} of {parsed.total} {source} entries could "
        f"not be fully read [schema] — {_reasons(parsed.unreadable)}. {effect}. For example: "
        f"{examples}. This is what a partial change to upstream's response shape looks like."
    )


def _catalog(payload, source):
    """``_Parsed`` holding the models the page can render, or raise :class:`CatalogError`.

    Validating this far is what gates the cache write (rule 3): a response whose modality or
    pricing fields were renamed is structurally perfect and renders nothing, so structural
    checks alone would cache an empty page over a working snapshot. Nothing is REPORTED here —
    see :class:`_Parsed`.
    """
    models, entries, unreadable = _entries(payload, source)
    rows = []
    for position, m in enumerate(models):
        row, problems = _renderable(m)
        if row is not None:
            rows.append(row)
        # A positional placeholder rather than a shared "<no id>": the count reported later is
        # of distinct models, so two unidentifiable entries must not collapse into one.
        mid = m.get("id") if isinstance(m.get("id"), str) and m.get("id") else f"<model {position}>"
        if not _encodable(mid):
            # The id is quoted in the warning's examples, and the report about unwritable
            # data must itself stay writable — escape the surrogate rather than forward it.
            mid = mid.encode("utf-8", "backslashreplace").decode("utf-8")
        unreadable += [_Unreadable(mid, problem, dropped=row is None) for problem in problems]
    if not rows:
        # `entries` is the RAW count, before non-objects were filtered out: a response full of
        # entries we could not read is schema drift, and saying "listed no models at all"
        # would misdiagnose it as an upstream that simply has nothing to offer. The per-entry
        # reasons are folded in here because there is no surviving page to report them against.
        raise CatalogError(
            "schema",
            "the response listed no models at all"
            if not entries
            else f"none of the {entries} entries it listed are JSON objects"
            if not models
            else (
                f"none of the {len(models)} models it listed are priceable chat models "
                f"({_reasons(unreadable) or 'the modality or pricing fields this page reads '
                                            'have changed'})"
            ),
        )
    # Sorted by slug so the catalog groups by provider and is deterministic build-to-build.
    # `or ""` rather than a get() default: a JSON null is a STORED value, so get("id", "")
    # hands back None and the comparison blows up mid-sort.
    rows.sort(key=lambda m: str(m.get("id") or ""))
    return _Parsed(rows, unreadable, entries)


def _read_snapshot(cache_path, source, parse):
    """The usable result of a cached snapshot, or raise :class:`CatalogError` saying why not.

    ``parse`` is the same validation, reporting included, that a live payload goes through.
    A soft drop is IN THE PAGE on every build that renders this snapshot, so reporting it only
    on the fetch that first saw it is what would make the warning cache-dependent — the page
    is missing the same models either way. A snapshot is never trusted further than a fresh
    response, and never described more kindly than one.
    """
    try:
        raw = cache_path.read_text(encoding="utf-8")
    except FileNotFoundError as exc:
        raise MissingSnapshot() from exc
    except OSError as exc:
        raise CatalogError("cache", f"the snapshot could not be read ({exc})") from exc
    except UnicodeDecodeError as exc:
        # Not an OSError: the bytes are there but they aren't text.
        raise CatalogError("cache", f"the snapshot is not valid UTF-8 ({exc})") from exc
    return parse(_loads(raw, f"the snapshot ({len(raw)} chars)"), source)


def _snapshot_age(cache_path, source, *, report=True):
    """Seconds since the snapshot was written, or ``None`` when there is no usable one.

    Absence is the healthy cold-cache state and says nothing; any other stat failure is a real
    fault that would otherwise masquerade as a miss. ``report=False`` for a second call on a
    path that has already spoken, so asking twice cannot warn twice.
    """
    try:
        return max(0.0, time.time() - cache_path.stat().st_mtime)
    except FileNotFoundError:
        return None
    except OSError as exc:
        if report:
            warn(
                f"Aardvark: pricing generator: the cached {source} snapshot could not be "
                f"examined [cache] — {exc}; this build re-fetches as if it had expired, and "
                f"will still try to read it should that fetch fail."
            )
        return None


def _age_label(seconds):
    """How stale a snapshot is, as prose ("41 minutes old")."""
    if seconds is None:
        return "of unknown age"
    for unit, size in (("day", 86400), ("hour", 3600), ("minute", 60)):
        if seconds >= size:
            n = int(seconds // size)
            return f"{n} {unit}{'s' if n != 1 else ''} old"
    return "less than a minute old"


def _write_snapshot(cache_path, payload, source):
    """Replace the cached snapshot atomically, or report why it could not be replaced.

    Written to an adjacent temp file and moved into place with :func:`os.replace`, which is
    atomic within a filesystem. A direct write truncates on open, so a full disk or an
    interrupted build would leave a half-written file WHERE THE GOOD SNAPSHOT USED TO BE — the
    page of this build would be fine and the next outage would have nothing to fall back to,
    which is rule 3 broken by the write rather than by the data.
    """
    tmp = cache_path.with_name(f"{cache_path.name}.{os.getpid()}.tmp")
    try:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        tmp.write_text(json.dumps(payload), encoding="utf-8")
        os.replace(tmp, cache_path)
    except (OSError, RecursionError) as exc:
        warn(
            f"Aardvark: pricing generator: fetched the {source} data but could not cache it "
            f"to {cache_path} [cache] — {exc!r}; the previous snapshot (if any) is untouched "
            f"and the next build will re-fetch."
        )
        try:
            tmp.unlink(missing_ok=True)
        except OSError:
            # Cleanup must never replace the diagnosis above with a second, less useful one.
            # The temp name carries this build's pid, so a later run will not reuse it: the
            # cost is one stray file inside .aardvark-cache/, which is disposable by design.
            pass


def _load(cache_path, url, headers, allowed_hosts, *, source, parse, subject, consequence,
          stale_note, missing_from, empty):
    """Fetch-with-cache for one upstream, returning ``(result, failure)``.

    ``failure`` is the accepted :data:`_KINDS` name of what degraded this run (or the ``unknown``
    sentinel for an internal labelling defect), and is ``None`` when nothing did — a clean fetch
    or a cache hit inside the TTL. ``parse`` turns a payload into that upstream's usable result
    and raises when there isn't one; ``empty`` is what "nothing usable" looks like to the caller.
    Shared by both upstreams so the rules cannot hold for one and drift for the other.
    """
    age = _snapshot_age(cache_path, source)
    if age is not None and age < CACHE_TTL_SECONDS:
        try:
            parsed = _read_snapshot(cache_path, source, parse)
        except MissingSnapshot:
            pass  # it vanished between the stat and the read; the fetch below covers it
        except CatalogError as exc:
            warn(
                f"Aardvark: pricing generator: the cached {source} snapshot "
                f"({cache_path.name}) is unusable [{exc.kind}] — {exc}; re-fetching it live."
            )
        else:
            # This snapshot IS the page, so now its gaps are worth reporting.
            _report_unreadable(parsed, source, missing_from)
            return parsed.result, None
    try:
        payload = _fetch_json(url, headers, allowed_hosts)
        parsed = parse(payload, source)
    except CatalogError as exc:
        return _stale_fallback(
            cache_path,
            exc,
            source=source,
            parse=parse,
            subject=subject,
            consequence=consequence,
            stale_note=stale_note,
            missing_from=missing_from,
            empty=empty,
        ), exc.kind
    _report_unreadable(parsed, source, missing_from)
    _write_snapshot(cache_path, payload, source)
    return parsed.result, None


def _stale_fallback(cache_path, exc, *, source, parse, subject, consequence, stale_note,
                    missing_from, empty):
    """Serve the last snapshot when the live data is unusable, or give up and say so."""
    lead = f"Aardvark: pricing generator: could not load {subject} [{exc.kind}] — {exc};"
    try:
        parsed = _read_snapshot(cache_path, source, parse)
    except MissingSnapshot:
        warn(f"{lead} no cached snapshot exists, so {consequence}.")
        return empty
    except CatalogError as cache_exc:
        warn(
            f"{lead} the cached snapshot ({cache_path.name}) is also unusable "
            f"[{cache_exc.kind}] — {cache_exc}, so {consequence}."
        )
        return empty
    # A complete page normally takes the note channel (rule 2). The `unknown` sentinel means
    # our own taxonomy is broken, so cached data must not hide it from the warning gate.
    emit = warn if exc.kind == "unknown" else info
    emit(
        f"{lead} falling back to the cached snapshot ({cache_path.name}, "
        f"{_age_label(_snapshot_age(cache_path, source, report=False))}), so {stale_note}."
    )
    # The snapshot is the page now, so ITS gaps are the ones worth naming.
    _report_unreadable(parsed, source, missing_from)
    return parsed.result


def _fetch_models(cache_path):
    """The models the page will render, as ``(rows, failure)`` — see :func:`_load`."""
    return _load(
        cache_path,
        MODELS_URL,
        {"User-Agent": "aardvark-docs"},
        OPENROUTER_HOSTS,
        source=OPENROUTER,
        parse=_catalog,
        subject="the OpenRouter model catalog",
        consequence=(
            "the Model rates page ships a 'prices unavailable' notice instead of the table"
        ),
        stale_note="the rates below may be out of date",
        missing_from="the table",
        empty=[],
    )


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


def _index(payload, source):
    """``(idx, families)`` for the Quality column, or raise :class:`CatalogError`.

    ``idx`` maps namespaced model keys -> the BEST index seen for that key (so
    reasoning/non-reasoning variants that collapse to one key report the higher score);
    ``families`` is (creator, token-set, score) triples used to resolve version-less '-latest'
    aliases. Like :func:`_catalog`, it validates as far as the finished index, because a
    payload whose score field was renamed parses perfectly and yields nothing.
    """
    models, entries, unreadable = _entries(payload, source, key_required=False)
    idx, families = {}, []
    for position, m in enumerate(models):
        name, name_problem = _text(m.get("name"), "a name")
        slug, slug_problem = _text(m.get("slug"), "a slug")
        mid = slug or name or f"<model {position}>"
        problems = [p for p in (name_problem, slug_problem) if p]

        evaluations, problem = _mapping(m.get("evaluations"), "an evaluations block")
        if problem:
            problems.append(problem)
        score, problem = _number(
            evaluations.get("artificial_analysis_intelligence_index"), "an Intelligence Index"
        )
        if problem:
            problems.append(problem)
        if score is None:
            # Absent: Artificial Analysis simply does not cover this model, which is normal.
            # Unreadable: already recorded above. Either way there is nothing to index.
            unreadable += [_Unreadable(mid, p, dropped=True) for p in problems]
            continue
        if not name and not slug:
            # Scored but unidentifiable: with nothing to key the score under, the loop below
            # would add nothing and the score would vanish without a trace — schema data
            # dropped silently, whether the fields were retyped (recorded above) or absent.
            problems.append("a score but no usable name or slug to index it under")
            unreadable += [_Unreadable(mid, p, dropped=True) for p in problems]
            continue

        for raw in (name, slug):
            for k in _keys(raw):
                if k not in ("n:", "s:", "ns:", "ss:"):  # skip empty
                    if score > idx.get(k, float("-inf")):
                        idx[k] = score
        creator_block, problem = _mapping(m.get("model_creator"), "a model_creator block")
        if problem:
            # The exact name/slug keys above still work; only the FAMILY entry is lost, which
            # is what resolves a versionless '-latest' alias — so this is reported rather than
            # quietly dropping those aliases' Quality values.
            problems.append(problem)
        creator, problem = _text(creator_block.get("slug"), "a model_creator slug")
        if problem:
            problems.append(problem)
        fam = frozenset(_key_toks(slug) or _key_toks(name))
        if creator and fam:
            families.append(("".join(_toks(creator)), fam, score))
        # dropped=False: this model's own score IS in the index; only detail was lost.
        unreadable += [_Unreadable(mid, p, dropped=False) for p in problems]
    if not idx:
        # Mirrors _catalog's three-way diagnosis, including the all-non-objects middle case:
        # "none of the 0 models carry a score" would be a self-contradicting sentence for a
        # payload that was all non-objects.
        raise CatalogError(
            "schema",
            "the response listed no models at all"
            if not entries
            else f"none of the {entries} entries it listed are JSON objects"
            if not models
            else (
                f"none of the {len(models)} models it listed carry a numeric Intelligence "
                f"Index ({_reasons(unreadable) or 'the score field this page reads has changed'})"
            ),
        )
    return _Parsed((idx, families), unreadable, entries)


def _fetch_intelligence(cache_path, api_key):
    """The Quality column's ``(idx, families)``, empty when it is unavailable.

    Empty and silent when no key is configured — the ordinary case, in which the column is
    simply omitted. Every other way of losing it is reported: dropping a whole column quietly
    is the same bug as an empty table.
    """
    if not api_key:
        return {}, []
    result, _failure = _load(
        cache_path,
        AA_MODELS_URL,
        {"x-api-key": api_key, "User-Agent": "aardvark-docs"},
        ARTIFICIAL_ANALYSIS_HOSTS,
        source=ARTIFICIAL_ANALYSIS,
        parse=_index,
        subject="the Artificial Analysis index",
        consequence="the model table ships without its Quality column",
        stale_note="the Quality column may be out of date",
        missing_from="the Quality column",
        empty=({}, []),
    )
    return result


def _or_candidates(model):
    """Strings to try matching an OpenRouter model against AA: its name (minus the
    'Provider: ' prefix) and its slug's last segment (minus any ':free' tag)."""
    mid = str(model.get("id") or "").lstrip("~")
    name = str(model.get("name") or "")
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
    mid = str(model.get("id") or "")
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
    """Aardvark's price per one million tokens, from an upstream per-token rate string.
    A negative rate is OpenRouter's "variable" sentinel (dynamic routers) — never a real
    price — so it renders as a dash rather than a bogus negative dollar amount. Unreadable
    and non-finite rates cannot reach a rendered row (`_renderable` rejects them), so the
    guards here are a belt for a hand-called or future caller, not the enforcement."""
    try:
        rate = float(per_token)
    except (TypeError, ValueError, OverflowError):
        # OverflowError: a JSON integer literal has no size limit, so `float()` of an
        # astronomically large rate overflows before isfinite() can see it.
        return "—"
    if not math.isfinite(rate) or rate < 0:
        return "—"
    return f"${rate * 1_000_000 * RATE:,.2f}"


def _context(length):
    """A compact context-window label: 1000000 -> 1M, 131072 -> 131K."""
    try:
        n = int(length)
    except (TypeError, ValueError):
        return "—"
    except OverflowError:
        # JSON's `1e999` parses to float('inf'), which int() refuses. Like the price fields,
        # a context window we cannot read is shown as a dash rather than raised: a model is
        # renderable without one, so this must not be the thing that fails a build.
        return "—"
    if n <= 0:
        return "—"
    if n >= 1_000_000:
        try:
            v = n / 1_000_000
        except OverflowError:
            # JSON ints are arbitrary-precision, so `int(length)` above can succeed on a
            # window too large for the float this division produces. As unreadable as an
            # infinite one — dash, never a build failure.
            return "—"
        return f"{v:.0f}M" if v == int(v) else f"{v:.1f}M"
    if n >= 1000:
        return f"{n // 1000}K"
    return str(n)


# A conservative common-path AI Assistant turn (one question -> one answer): the hard maximum
# locally selected page context plus a typical reply. Most confident turns select less; a long
# conversation or broad agentic fallback can use more, so this remains an estimate rather than a cap.
TURN_OUTPUT_TOKENS = 600


def _per_turn(pricing, context_length, rate=RATE):
    """Estimated common-path turn cost, capped when the model cannot fit the selected context."""
    try:
        prompt_rate = float(pricing.get("prompt"))
        completion_rate = float(pricing.get("completion"))
    except (TypeError, ValueError, OverflowError):
        # OverflowError: an arbitrary-precision JSON integer rate too large for float().
        return "—"
    if not (math.isfinite(prompt_rate) and math.isfinite(completion_rate)):
        return "—"
    if prompt_rate < 0 or completion_rate < 0:
        return "—"
    # OpenRouter's optional flat per-request price is part of the gateway's list-cost formula too.
    # Missing, malformed, or negative request pricing clamps to zero there, so mirror that here.
    try:
        request_rate = max(0.0, float(pricing.get("request") or 0))
    except (TypeError, ValueError, OverflowError):
        # OverflowError clamps like the other unreadable shapes: an absurd flat price
        # must not be the thing that fails a build.
        request_rate = 0.0
    if not math.isfinite(request_rate):
        # Unlike prompt/completion this field is not part of `_renderable`'s validation (a
        # model is renderable without it), so a non-finite value has to be clamped here or the
        # whole estimate renders as $nan.
        request_rate = 0.0
    try:
        ctx = int(context_length)
    except (TypeError, ValueError, OverflowError):
        # OverflowError: an infinite context window (JSON `1e999`). Unreadable either way, so
        # the estimate falls back to assuming the whole turn fits, as it does for a missing one.
        ctx = ASSISTANT_LOCAL_CONTEXT_MAX_TOKENS + TURN_OUTPUT_TOKENS
    in_tokens = min(
        ASSISTANT_LOCAL_CONTEXT_MAX_TOKENS, max(0, ctx - TURN_OUTPUT_TOKENS)
    )
    cost = (in_tokens * prompt_rate + TURN_OUTPUT_TOKENS * completion_rate + request_rate) * rate
    if not math.isfinite(cost):
        # `request` is not part of `_renderable`'s validation (a model renders without one),
        # so it can still be large enough to overflow the sum even when both token rates fit.
        return "—"
    return f"${cost:,.2f}"


def _type(architecture):
    """A short modality label: 'Text', 'Text + image', 'Multimodal out', ….

    Both modality fields are read leniently HERE because this is the render site and the row
    has already been validated: `_renderable` reports an unreadable input list (without
    dropping the row — the label is cosmetic) and rejects an unreadable output one.
    """
    arch = _obj(architecture)
    inputs, _ = _modality_names(arch.get("input_modalities"))
    outputs, _ = _modality_names(arch.get("output_modalities"))
    if outputs - {"text"}:
        return "Multimodal out"
    extra = sorted(inputs - {"text"})
    return "Text + " + "/".join(extra) if extra else "Text"


def _is_floating(model_id):
    """The auto-updating router aliases (e.g. ``~anthropic/claude-sonnet-latest``)."""
    return model_id.endswith("latest")


def _row(model, intel=None):
    """One table row. ``intel`` is the ``(idx, families)`` pair `_fetch_intelligence` returns,
    or None to omit the Quality column."""
    pricing = _obj(model.get("pricing"))
    ctx = model.get("context_length")
    cells = [
        _cell(model.get("name") or model.get("id") or ""),
        f"`{_cell(model.get('id') or '')}`",
        _cell(_type(model.get("architecture"))),
        _context(ctx),
    ]
    if intel is not None:
        cells.append(_intelligence(model, *intel))
    cells += [
        _price(pricing.get("prompt")),
        _price(pricing.get("completion")),
    ]
    # One Est./answer column PER PLAN — the table shows what an answer actually costs on each
    # tier, so plan pricing is concrete dollars here rather than multiplier math anywhere.
    cells += [_per_turn(pricing, ctx, rate) for _, rate in PLAN_RATES]
    return "| " + " | ".join(cells) + " |"


def _header(has_intel):
    cols = ["Model", "Slug", "Type", "Context"]
    align = ["---", "---", "---", "--:"]
    if has_intel:
        cols.append("Quality")
        align.append("--:")
    cols += ["Input", "Output"]
    align += ["--:", "--:"]
    cols += [f"{name} est./answer" for name, _ in PLAN_RATES]
    align += ["--:"] * len(PLAN_RATES)
    return "| " + " | ".join(cols) + " |\n| " + " | ".join(align) + " |"

# A prominent warning about $0.00 (free-pool) models. Plain string (NOT an f-string)
# so its `{% %}` directive and `{ }` aren't treated as fields/template by Python.
_FREE_WARNING = (
    "{% callout severity='warning' title='Free ($0.00) models come with hard limits' %}\n"
    "A model priced **$0.00** runs on a shared upstream **free pool** — handy for trying "
    "things out, but with real trade-offs you should plan around:\n\n"
    "- **Slow and queue-bound.** Free requests are low priority and share a queue, so "
    "responses are slower and degrade further under load.\n"
    "- **Capped per day and per minute.** Free usage is limited to roughly a few dozen "
    "requests per day plus a low per-minute rate; once you hit the cap, requests are "
    "refused until the window resets.\n"
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
    # Already filtered to priceable chat models and sorted by slug: selecting the renderable
    # rows is part of validating the payload (see `_catalog`), because a catalog that yields
    # no rows must be treated as a schema failure rather than cached over the last good one.
    chat, _failure = _fetch_models(cache)

    # Optional quality column from Artificial Analysis (only when a key is configured).
    idx, families = _fetch_intelligence(
        cache_dir / "aa-intelligence.json", os.environ.get(AA_KEY_ENV, "").strip()
    )
    intel = (idx, families) if idx else None

    if not chat:
        # No second warning here: the load path above has already reported the cause AND this
        # consequence in one sentence, and an empty result can only reach this branch through
        # one of those reporting paths.
        body = (
            "Aardvark is **free to use and self-host**; AI usage is billed per token, and "
            "paid plans add managed hosting, seats, and support. Live model prices couldn't "
            "be fetched for this build.\n\n"
            "{% callout severity='info' %}\n"
            "Current per-model rates will reappear here on the next build; see "
            "[Plans & pricing](/pricing/) for what each plan includes.\n"
            "{% endCallout %}\n"
        )
        generate("pricing/models.md", _front(), body)
        return

    recommended = [m for m in chat if _is_floating(str(m.get("id") or ""))]
    rec_table = ""
    if recommended:
        rec_table = (
            "## Recommended (auto-updating)\n\n"
            "These floating aliases always route to the provider's newest model, so you "
            "never pin a version. Aardvark's default config uses "
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
        "- **Input** / **Output** are the pay-as-you-go prices per **one million tokens**.\n"
        "- The **est./answer** columns estimate a conservative common-path assistant turn on each plan — "
        f"up to {ASSISTANT_LOCAL_CONTEXT_MAX_TOKENS // 1000}K tokens of locally selected docs context plus a "
        f"~{TURN_OUTPUT_TOKENS}-token reply (capped at each model's context window). "
        "Input dominates, so a single answer costs far less than the per-million "
        "output rate suggests; your real numbers vary with selected pages, conversation history, "
        "fallback navigation, and answer length. On a paid plan, answers drain the plan's included monthly "
        "allowance before anything is billed.\n"
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
        "Per-token rates for every model Aardvark's metered gateway can serve — point "
        "`ai.model` / `ai.assistant.model` at **any** model below and pay only for the AI you "
        "actually use. Looking for the platform tiers (hosting, seats, support, included AI)? "
        "See **[Plans & pricing](/pricing/)**.\n\n"
        "**Input**/**Output** are the pay-as-you-go per-token prices; the per-plan columns show "
        "what one assistant answer actually costs on each tier. Subscribers get a member "
        "discount on every metered dollar — about **7% off on Pro**, **13% off on Business**, "
        "and **20% off on Enterprise** — on top of their plan's included monthly AI allowance.\n\n"
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
    generate("pricing/models.md", _front(), body)


def _front():
    return {
        "title": "AI model rates",
        "navtitle": "Model rates",
        "description": (
            "Per-token rates for every model Aardvark's gateway can serve, "
            "at the pay-as-you-go meter; subscribers pay their plan's member rate."
        ),
        "menu": "pricing",
        "weight": 2,  # under the hand-authored Plans page (weight 1) in the pricing menu
        "mode": "full",  # a big table — use the full page width, no nav or right TOC
    }


# Run it. A generation script is plain build-time Python with no entry function, and Aardvark
# runs it with ``__name__ == "__main__"`` (generators.py injects that deliberately), so this
# guard fires on every build — and lets the test suite load the module to exercise the
# degradation paths without performing a live fetch.
if __name__ == "__main__":
    _build()
