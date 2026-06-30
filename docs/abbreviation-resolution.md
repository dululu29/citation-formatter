# Abbreviation Resolution

## Purpose

The abbreviation resolver is the local, deterministic layer that decides how IEEE and MDPI publication titles are shortened before citation text is formatted.

This MVP is intentionally self-contained:

* No Crossref
* No ISSN lookup
* No LTWA
* No CSL / citeproc
* No external abbreviation database

The only optional non-local path is the existing Gemini suggestion callback, and it is treated as a low-confidence fallback.

## Resolver Priority Order

`resolvePublicationAbbreviation()` applies sources in this order:

1. `style === "none"` returns the full title unchanged.
2. Plain-title custom overrides win.
3. Metadata abbreviations win when present.
   For MDPI this means `metadata.journalAbbrev` is used before any local fallback rule.
4. Local journal rules run for journal titles.
5. Local conference-series matching runs for conference / proceedings titles.
6. Gemini runs only when enabled and an injected callback is provided.
7. Safe fallback returns the original full title.

## Resolver Return Object

The resolver returns:

```js
{
  abbreviation,
  source,
  confidence,
  needsReview
}
```

Field meanings:

* `abbreviation`: the selected display string.
* `source`: where the result came from, such as `custom`, `metadata`, `journalRules`, `conferenceSeries`, `gemini`, `fallback`, or `style:none`.
* `confidence`: a numeric confidence score used to distinguish deterministic local matches from weaker fallback paths.
* `needsReview`: `true` only when the result should be treated as lower-confidence output. In the current MVP that is the Gemini path.

## Journal Rules vs Conference-Series Rules

Journal resolution and conference resolution are intentionally different.

### Journal token abbreviation

Journal rules are token-based and deterministic. They preserve known organization acronyms such as `IEEE` and `ACM`, then shorten known journal words such as:

* `Transactions` -> `Trans.`
* `Journal` -> `J.`
* `Communications` -> `Commun.`
* `Wireless` -> `Wirel.`
* `Vehicular` -> `Veh.`
* `Technology` -> `Technol.`
* `Selected` -> `Sel.`
* `Computing` -> `Comput.`
* `Processing` -> `Process.`
* `Letters` -> `Lett.`
* `Network` / `Networking` -> `Netw.`

The journal module also contains exact local mappings for already-supported titles so existing IEEE and MDPI outputs stay stable.

### Conference-series abbreviation

Conference resolution does not abbreviate by token. It matches normalized series names against known conference families and returns the canonical series abbreviation.

Examples:

* `2020 IEEE Global Communications Conference` -> `IEEE GLOBECOM`
* `IEEE International Conference on Communications` -> `IEEE ICC`
* `2024 IEEE 99th Vehicular Technology Conference (VTC2024-Spring)` -> `IEEE VTC`

This split avoids trying to force conference names through journal-style word substitution.

## Custom Overrides

Current user behavior is preserved. Plain-title JSON still works:

```json
{
  "Transactions on Wireless Communications": "MyTWC"
}
```

If the incoming full title exactly matches a key in `customAbbreviations`, that value wins before any metadata or local rule.

## Metadata Abbreviation Behavior

Metadata abbreviations are checked before local journal or conference logic.

This matters most for MDPI because pages often provide `citation_journal_abbrev`, which is parsed into `metadata.journalAbbrev`.

Current MDPI formatter behavior:

* `standard_abbr` uses `journalAbbrev` when present.
* `simplest_abbr` also uses `journalAbbrev` when present.
* If no metadata abbreviation is available, the resolver falls back to local deterministic logic.

## Gemini as Low-Confidence Fallback

Gemini is not part of the deterministic core.

Rules:

* The resolver never calls Gemini unless `useGemini` is enabled.
* The resolver uses an injected `suggestViaGemini` callback instead of owning network behavior directly.
* Gemini results are returned with:
  * `source: "gemini"`
  * lower `confidence`
  * `needsReview: true`

This keeps the resolver unit-testable in Node and ensures the network path is optional and explicit.

## Adding a Conference Series

Conference families live in [src/abbreviations/data/conference-series.json](../src/abbreviations/data/conference-series.json).

Add a new object with:

* `abbreviation`: the canonical display abbreviation
* `titles`: one or more noisy/full-name variants that should normalize to that series

Example shape:

```json
{
  "abbreviation": "IEEE EXAMPLECONF",
  "titles": [
    "IEEE Example Conference",
    "Example Conference"
  ]
}
```

After adding a series, add a resolver test for both the canonical form and at least one noisy form with year / ordinal noise if relevant.

## Adding a Journal Token Rule

Journal token rules live in [src/abbreviations/journalRules.js](../src/abbreviations/journalRules.js).

To add a new token abbreviation:

1. Update the `TOKEN_RULES` map.
2. Add or update a resolver test showing the intended output.
3. If an exact title must stay stable, add it to `EXACT_JOURNAL_ABBREVIATIONS` instead of relying only on token substitution.

Use exact mappings for titles where deterministic token substitution is not enough or where historical output must not drift.

## Known Limitations

Current limitations are intentional:

* No external lookup is implemented yet.
* No LTWA / ISO 4 completeness is attempted.
* Unknown titles can fall back to the full original title.
* The resolver accepts `style: "short"`, but this MVP currently keeps the same local deterministic abbreviation path as `standard` so existing citation outputs stay stable.
* Conference display formatting such as `in Proceedings of ...` still happens in the citation formatter after abbreviation resolution.
* `needsReview` is currently available to callers but is not yet surfaced in popup UI text.
