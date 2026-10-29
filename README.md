# PayDockit

A static Next.js / React / TypeScript payroll document toolkit. No application backend, account system, payroll API, database server, remote processing, or paid AI service is required.

## Run locally

Requirements: Node.js 22.13+ (tested with 24.13), npm.

```sh
npm ci
npm run dev
```

- Public website: http://localhost:3000
- Private document workspace: http://localhost:3001/payslip/

The two ports are separate origins, mirroring the production architecture. Editor data defaults to memory and is lost on refresh unless explicitly saved or exported.

## Check and build

```sh
npm test
npm run typecheck
npm run build
```

Build emits **two independent static sites**:

- `apps/public-site/out` — SEO pages and original English content.
- `apps/private-tools/out` — document editors, stamp studio, calculators, and custom rules.

After building, `scripts/headers.mjs` creates host-compatible security headers with hashes for Next's inline scripts. `scripts/check-build.mjs` verifies initial SEO markup, private noindex, external script restrictions, and initial JavaScript budgets. Reports are written to `docs/build-report.json`.

## Available workflows

- Salary slip: company and employee details, salary or hours × rate, earnings, deductions, reimbursements, employer contributions, informational days, and opening/closing YTD gross.
- Employment certificate: current/former employment, experience, optional salary, approved duties, purpose, department-only signer.
- Salary certificate: monthly/annual, gross/net designation, salary breakdown, contact and signer.
- Eight document layouts with visual selection and full-size preview; General plus eight optional formatting presets; editable currency; A4/Letter.
- Local raster logo/signature import, generated business stamp with millimetre placement, drag/keyboard/numeric controls.
- Searchable English PDFs; print; blank templates; versioned JSON import/export; explicit expiring local drafts and employer profile.
- Ten professional stamp layouts: curved circular/oval text, up to four center lines, 1–3 borders, adjustable fonts/spacing, safe SVG and transparent 1,200 px PNG exports, saved design/project import/export, and local transfer into document editors.
- Six arithmetic calculators and JSON explanation reports.
- Custom tax workspace: progressive and base-plus-marginal models, source notes, dates, allowances, capped contributions, simulations, editable fixtures, clone, safe JSON import, snapshot report.
- CSV batch mapping, row validation, up to 100 English PDFs in a ZIP, progress/cancellation, and per-row manifest.

Arabic/Urdu document panels use self-hosted fonts and browser print. They are labeled translation drafts: full translated certificate prose, native review, text extraction, and cross-browser shaping are **not launch-verified**. Direct multilingual PDF remains disabled. See the full support and verification matrix in `docs/implementation-status.md`.

## Deployment and SEO

Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_TOOLS_URL` **at build time** to real HTTPS origins. Put the same values in each app's `.env.local`, or pass them as environment variables to the root build command. The root `.env.example` documents the variables; Next reads app-specific environment files.

Deploy the public export to your main origin and the private export to a separate tools origin. Do not use an SPA rewrite to `index.html`; configure real 404 responses. Hosting requires only static file serving. See `docs/deployment.md` for Caddy and Cloudflare Pages options.

Public pages contain server-generated HTML, unique titles/descriptions, canonical URLs, Open Graph metadata, structured data, internal links, `robots.txt`, and an XML sitemap. Google determines sitelinks; the app provides clear navigation and structure but cannot guarantee them.

## Before a public launch

1. Configure real domains and HTTPS, rebuild, and verify host headers.
2. Supply operator identity, support contact, and hosting retention details in policy content.
3. Review the six editorial drafts and optional Arabic/Urdu wording with accountable reviewers.
4. Complete the remaining browser, device, export parity, and accessibility checks listed in the implementation checklist.
5. Keep advertising disabled unless the real publisher and appropriate consent provider are configured. No publisher ID or consent is fabricated.

See `docs/architecture.md`, `docs/privacy-data-map.md`, `docs/rule-maintenance.md`, `docs/source-register.md`, and `docs/implementation-status.md`.

The included app-specific .env.production files point to the registered private preview origins. Local development still uses localhost defaults. Override these variables when moving to your own domains. Public exports preserve the statically rendered Next/React HTML and JSON-LD while removing unused hydration scripts; adding a public client component intentionally fails that optimization guard.
