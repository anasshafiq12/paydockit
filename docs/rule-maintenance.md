# Custom rules and future reviewed packs

The local builder supports only safe declarative operations: progressive slices **or** fixed-base-plus-marginal bands, a taxable allowance, and a percentage employee contribution with an optional basis cap. No expressions, eval, functions, dynamic code, built-in statutory rates, or admin endpoint exists.

Profiles carry a name, version, frequency, currency precision, effective dates, fiscal-year label, optional region metadata and source notes. Imports are bounded and schema-validated; unexpected trust fields are stripped. Every profile remains **User-configured**. The UI requires a summary/replacement action before import changes the current profile. Cloning creates a separate in-memory name/version. Save is explicit and local.

Lower bounds are inclusive, upper bounds exclusive. Bands start at zero, are contiguous and ordered, and the final band has an unlimited upper bound. Rates are bounded from zero to 100%. Base-plus-marginal profiles can contain explicit discontinuities; the UI does not characterize them as suitable for a net-to-gross solver. No such solver is exposed.

Taxable basis is max(0, gross minus allowance). Progressive tax sums each slice; fixed-base mode chooses exactly one band. Employee contribution applies to gross or the capped gross basis. Tax and contribution each round half-up to the specified precision before subtraction. No hidden annualization, prior withholding reconciliation, law selection or currency conversion occurs.

Before using a custom profile, record your source, select the relevant frequency/date, and enter independently expected test cases around every threshold. Export profile JSON and the report snapshot. Historical JSON snapshots do not automatically refresh rates. Maintain versions explicitly.

If adding site-wide statutory packs later: write the precise supported scenario and effective dates, collect enacted official sources, create independently expected fixtures, obtain qualified local review, publish immutable versioned packs and a changelog, preserve historical packs, and withdraw unsupported or incorrect scenarios. Never promote an imported trust flag or let public users edit global rules.
