# Implementation and verification checklist

Updated 29 October 2026. **Implemented** describes code availability; **verified** describes the specific evidence below. This is a substantial runnable implementation, not a claim that every specification acceptance gate or P1 item has passed.

## Implemented P0 workflows

- [x] Next.js App Router / React / TypeScript static export; two independent public/tools origins.
- [x] Modern Material UI editing; responsive Edit/Preview; accessible labels and navigation; keyboard stamp movement.
- [x] Salary-slip employer/employee/pay details, salary/hourly separation, dynamic line categories, manual deductions, reimbursements, employer contributions, gross/net/cash and YTD gross.
- [x] Employment certificates: current/former/experience, optional salary, purpose, approved duties and department-only signer.
- [x] Salary certificates: monthly/annual, gross/net, breakdown, signer/contact.
- [x] Four layout choices, A4/Letter, General default and optional country formatting confirmation.
- [x] Live HTML preview, searchable English PDF, print, versioned JSON project validation/import/export, fictional sample watermark and start-blank action.
- [x] Logo and signature raster import with bounds and metadata stripping; no arbitrary SVG imports or remote image references.
- [x] Generated circle/oval/rectangle/rounded business stamps; ink/opacity/rotation/width; drag, keyboard, numeric positions; PNG/SVG exports.
- [x] Six arithmetic calculators including English amount words with numeric minor fractions.
- [x] Custom rule builder: clone, bounded declarative schema, two methods, effective dates, source notes, frequency, rounding, allowance, capped contribution, simulation, editable fixtures, JSON import confirmation/export and snapshot report.
- [x] Indexable public HTML, English tool/calculator/template/guide pages, unique metadata/canonical URLs, crawlable links, structured data, sitemap, robots and real static 404 output.
- [x] Public policy/scope/editorial/corrections pages. Owner contact is explicitly unconfigured; no fake submission form.
- [x] Ads and analytics disabled. Private scripts and fonts are self-hosted. Generated host security headers.

## Implemented P1 subset

- [x] Explicit 30-day local company profile and document drafts; restore/delete/clear; quota-error fallback to project download.
- [x] Saved local stamp and custom-rule profile.
- [x] CSV mapping, bounded import, row validation/preview, PDF ZIP, progress, cancellation between PDFs, stable filenames and a manifest for every row.
- [x] Calculator report and custom-rule report snapshots.

## Partial / verification-gated P0 details

- [ ] Full Arabic/Urdu translated certificate prose and complete translated pay lines. Current panels are visibly labeled **translation drafts**; direct multilingual PDFs are disabled. Self-hosted fonts and explicit translated names are present. Native-language review is an external prerequisite.
- [ ] All template/long-name/multipage/Letter/rotation golden-image tests and exact visual preview-to-direct-PDF parity. Canonical facts/totals are shared, but adapters differ. Browser print uses the actual HTML layout. Basic English sample PDF has been visually checked.
- [ ] Stamp border count/thickness, curved text/spacing, arbitrary approved raster stamp upload, fully constrained overlap detection and resize handles. Numeric placement/width, dragging and keyboard controls are available.
- [ ] Line-item contribution classification, separate taxable base display in payslip, average variable compensation period, optional masked sensitive identifier controls, paid/unpaid automatic proration, and monthly duplication review. Existing fields never silently imply these features.
- [ ] Custom employer contribution definitions beyond one bounded percentage rule, richer rule source registry and historical reopening/difference UI. Current exports preserve profile snapshots; ordinary documents start with manual amounts. Custom-rule-to-payslip transfer now preserves a user-custom snapshot with a visible provenance label.
- [ ] Modulated 10-user 120-second usability test, screen-reader sampling/axe audit, exhaustive browser network capture and Safari/Firefox/real-device checks.
- [ ] Public author/contact/operator details and independent editorial review. Six useful draft guides exist; the original fifteen-guide backlog is not presented as complete.

## Deferred P1/P2

- [ ] P1: multi-month packs, annual summaries, combined batch PDF, bounded worker processing, richer field consistency reports, net-to-gross for monotonic profiles, encrypted backups, local signature cropping/background removal, dark shell, service worker/offline update handling, PNG document previews, CSV values export, Hijri display.
- [ ] P2: DOCX, invoices/receipts, statutory government exports, electronic/cryptographic signatures and integrations.
- [ ] Optional statutory packs require sources and independent payroll review; no pack is advertised.

## Evidence

- TypeScript checks: passed for both apps.
- Domain/rule tests: 43 tests passed, covering domain/rule arithmetic, boundaries, all 12 English document/template combinations, multipage output, script coverage, and malformed inputs.
- Production builds: both static exports passed. Initial script measurements and checks: `build-report.json` (generated by build).
- Browser: desktop public content and editor inspected; fictional sample loaded and totals checked; English payslip PDF downloaded using the live browser. Narrow 390 px edit layout inspected.
- PDF: one-page English fictional payslip text extracted with pypdf; wages/deductions/net values matched; rendered via pypdfium2 and visually inspected without clipping. Sample watermark remained present.
- No claim of field Core Web Vitals, full accessibility conformance, native translation review, legal compliance, or production-origin verification is made.

## Owner launch setup

Real domain and two-origin hosting, production header validation, operator identity and support contact, editorial review, optional native-language review and optional AdSense/consent configuration remain external setup tasks. Source availability, search rankings, sitelinks, AdSense approval, and revenue are not guaranteed.

