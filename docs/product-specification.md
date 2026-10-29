# PayDockit Payroll and Employment Document Platform

## Implementation specification for Codex

Prepared 29 October 2026. Product name: PayDockit. Domain and trademark availability still need checking; the application name is fixed by the owner. Audience: Codex implementing the React application and the owner reviewing launch readiness.

Build a production-quality, no-signup web application for preparing salary slips, employment certificates, salary certificates, bilingual documents, and authorized business stamps. Target English-speaking users worldwide with one English-first interface, general-purpose tools, optional country formatting presets, configurable calculators, transparent calculation details, fast local PDF generation, and original English educational content. Country selection must never be required to create a basic document. The ordinary user should finish a straightforward document in under two minutes. All core document features must remain usable without registration, email capture, payment, or an advertising interaction.

This specification is the implementation contract. Requirements marked P0 are launch requirements; P1 completes the full product; P2 is an explicitly deferred extension. Do not present unfinished features as working. Implement complete vertical slices and maintain a visible implementation checklist. Research citations are numbered and linked in the source register at the end. Recheck time-sensitive sources before shipping.

Revision: owner-confirmed PayDockit name, global English-first positioning and optional country presets. This revision replaces the earlier country-led rollout throughout the implementation scope.

## 1 Product decisions and boundaries

### 1.1 Four measurable goals

1. Speed: at least 8 of 10 representative first-time test users create a valid basic document within 120 seconds after opening the editor, excluding time spent finding their employer's information. Measure locally during usability testing; do not collect names or salaries for analytics.
2. Accuracy: universal arithmetic and custom tax rules have reproducible tests, explicit assumptions and clear provenance labels. Any optional statutory pack requires its own effective period, official sources and independent payroll review. Formatting presets alone never establish compliance.
3. Revenue: useful public tools and original reference articles support an AdSense application and organic traffic. Approval, search rankings, traffic, and stable revenue cannot be promised.
4. Privacy: calculations, uploaded branding, document editing, and exports happen in the browser. No payroll document upload, remote AI processing, or server document retention in the baseline product.

### 1.2 What the application does

It prepares employer documents and performs calculations within a stated scope. The employer remains responsible for truthful information, authorization, required delivery, record retention, and any statutory reporting. A generated certificate does not prove employment merely because the software produced it.

It is not a payroll filing service, bank payment system, Wage Protection System submission, government certificate issuer, notarization service, or cryptographic signature service. Saudi and UAE wage-protection workflows are separate from creating PDFs [8, 9]. Never display an official certification, regulator endorsement, Chamber of Commerce attestation, verified salary badge, or guaranteed visa or bank acceptance.

Stamps are user-created business graphics. They do not authenticate the issuer or replace a legally required signature. Support ordinary business identity and authorized uploaded signatures, without government seal libraries or fabricated third-party credentials. Sample documents must be visibly marked SAMPLE until the user clears sample data and supplies their own information.

### 1.3 One global application with optional presets

PayDockit is a general-purpose document toolkit for English-speaking individuals, HR staff and small businesses worldwide. Organize the experience by task: Salary slip, Employment certificate, Salary certificate, Stamps and Calculators. Do not organize navigation, onboarding, templates or marketing around countries. English is the default UI, default document language and editorial language. Bilingual output is an optional document feature, not the main audience definition.

Provide a General preset that works immediately without choosing a country. Put optional Country preset under document settings. A preset supplies currency and display format, date format, paper size and suggested editable field labels. It must not imply statutory compliance, change the interface language, restrict access to tools or require nationality or residency questions. All preset values remain editable. Never silently change existing amounts or convert currencies when applying a preset.

| Setting | General default | Optional preset behavior |
| --- | --- | --- |
| UI and document language | English | UI remains English; bilingual output selected separately |
| Currency | Clearly visible editable ISO currency selector | Suggest a currency and supported symbol; require confirmation if amounts already exist |
| Dates | Unambiguous English month name format | Suggest a local display convention while preserving underlying dates |
| Paper | A4 | Suggest A4 or Letter |
| Identifiers | Optional generic employee and business IDs | Suggest familiar labels, kept optional unless the user selects a reviewed checklist |
| Earnings and deductions | Basic pay, editable allowance and deduction rows | Offer optional familiar labels; no assumed legal rates |
| Tax | Manual amounts or user-configured rules | No tax rules are silently enabled |

### 1.4 Preset scope and calculation scope

Initial lightweight examples may include General, United States, United Kingdom, Canada, Australia, India, Pakistan, Saudi Arabia and UAE. These are convenience presets, not separate country products or a country rollout. Use USD, GBP, CAD, AUD, INR, PKR, SAR and AED respectively where applicable, with unambiguous ISO labels. No market receives a privileged onboarding flow. Do not delay the global manual generators until country research is complete.

Keep formatting presets and tax rule packs in separate schemas and modules. A formatting preset contains no tax formula, compliance badge, required statutory workflow or automatic deduction. A user may combine a formatting preset with manual amounts, a custom rule pack, or an independently reviewed optional pack.

The P0 calculator experience is universal arithmetic and the manually editable tax-rule builder. Reviewed jurisdiction-specific packs are optional later extensions selected explicitly from the calculator's advanced settings. There is no required launch country or mandatory built-in statutory calculator. If such a pack is published, show its jurisdiction, effective period, sources and reviewed scenario; otherwise keep the result labelled Manual amounts or User-configured estimate. Imported files cannot declare themselves trusted.

Country-specific legal examples in the research register illustrate why formatting cannot establish payroll compliance. They are reference material for optional future packs, not instructions to implement country portals or audit every jurisdiction before launching PayDockit.

## 2 Research findings and feature implications

Zoho's free payslip tool includes branding, employee information, paid and unpaid days, custom fields, variable earnings and deductions, totals and amount in words. Its reviewed page explicitly describes an India-specific template [1]. These features are baseline expectations, not sufficient differentiation.

TankhaPay's tool offers gross and net calculations, amounts in words and PDF or Excel export [2]. Our product should add explicit rule provenance and distinguish manually prepared documents from reviewed payroll calculations. Do not make unsupported claims about competitors' privacy or accuracy.

UK guidance requires pre-deduction and post-deduction earnings, variable deductions, and hours when pay varies with time worked [3]. Australian guidance includes employer and employee information, pay period, payment date, gross and net amounts, relevant pay components and superannuation information, with special confidentiality handling for family and domestic violence leave [4]. These examples establish limits on compliance claims. Keep any later reviewed checklists separate from the simple formatting presets; they are not mandatory launch modules.

Google policies restrict low-value screens and misleading ad interactions [11, 12]. Therefore, editorial usefulness and clear separation between advertisements and download controls are functional requirements. Google also warns against scaled unoriginal pages created primarily for rankings [14]. Do not generate hundreds of country-language keyword pages without meaningful local differences.

Priority additions from this research and workflow analysis: local reusable employer profiles, multiple pay periods, paid-day calculations, year-to-date values, line-item taxability, protected identity fields, an accessible stamp positioning interface, batch CSV processing, a calculation explanation sheet, and general document completeness checks, with optional reviewed jurisdictional checklists later. These are proposed improvements, not claims that every competitor lacks them.

## 3 User journeys

### 3.1 Basic salary slip in under two minutes

Open the public salary-slip page and enter the private editor directly in English using the General preset. Country selection is optional inside settings. Only allowlisted preset, template and document-language identifiers may be transferred in the link. On the private origin choose a template, enter company and employee names, period, basic pay, allowances and deductions. See gross and net values update immediately. Optional sections stay collapsed. Review highlighted errors, choose PDF or Print, and download without a modal asking for an email or account.

The editor defaults to Manual amounts for every preset. Switching to calculated deductions must preserve manual entries for recovery and explain what will be replaced. Applying a country preset retains all entered fields and amounts, previews suggested formatting changes and requires confirmation for currency changes. It never performs exchange-rate conversion or enables tax rules.

### 3.2 Bilingual employment certificate

Choose employment certificate and Arabic plus English or Urdu plus English. Fill shared facts once. Enter or confirm both versions of company name, person name, job title and address. Select a reviewed wording template, purpose, salary inclusion and authorized signer details. Preview the two-column or stacked version, optionally place a stamp, and export. Missing translations are visible and block a document advertised as fully bilingual.

### 3.3 Repeat employer and multi-month workflow

Choose Remember company on this device or export a company profile. Reuse the company profile in any tool. Duplicate a payslip into a new month with a mandatory review of dates and variable amounts. Do not carry forward a statement that salary was paid without explicit confirmation. Batch mode creates one PDF per employee or period and an optional combined PDF, plus a manifest, entirely locally.

### 3.4 Salary calculation to document

Start with universal gross-to-net arithmetic or a user-configured tax profile. Choose jurisdiction, effective period and employee scenario only when explicitly selecting an optional reviewed tax pack. Supply the inputs required by that selected mode. Read the calculation breakdown and assumptions. Select Create payslip with these amounts without placing salary data in a URL; this transition occurs inside the private origin. Unsupported scenarios keep manual document generation available but do not produce an apparently reviewed calculation.

## 4 Functional requirements

### 4.1 Salary slip generator P0

Shared employer fields: legal and display name, translated name, address, optional registration or tax ID, contact details, logo and internal reference. Shared employee fields: name and translated name, ID, title, department, start date, employment type and optional masked bank or identity details. Do not collect full passport, national identifier or bank account by default.

Pay fields: frequency, period start and end, payment date, currency, pay basis, basic salary or hours and rate, paid days, unpaid leave, overtime, bonus, commissions, arrears, allowances, reimbursement lines, deduction lines, employer contribution lines, year-to-date opening values and optional closing values. Hourly and salaried modes must not double-count basic pay.

Each earnings line has a stable ID, label, translated label, amount, taxable classification, contribution classification and category. Manual mode does not infer taxability from text labels. Employer contributions are separate from employee deductions. Nonwage reimbursements are represented separately; they can increase cash payable without being misleadingly included in wage gross.

Show gross earnings, taxable basis when calculated, employee deductions, net wages, reimbursements and cash payable. The primary net label must be defined consistently in UI, explanation and PDF. Show amount in words only in supported, tested languages. Do not silently substitute inaccurate wording for an unsupported currency subunit.

Templates: Classic payroll, Minimal monochrome, Corporate letterhead and Bilingual ledger. All share the same data and totals. Support A4 default and Letter option, readable grayscale printing, one-page basic documents and multipage overflow. Do not shrink text indefinitely to force a single page.

P0 exports: searchable PDF, print view and versioned JSON project. P1: PNG preview export, CSV values export, batch PDFs and ZIP. DOCX export is P2 because editable cross-language layout needs its own QA; do not imply it exists at launch.

### 4.2 Employment certificate generator P0

Include issue date, optional reference, addressee or To whom it may concern, subject, employer, employee, role, employment dates, current or former status, full-time or other employment type, optional salary, optional approved duties, purpose, signer name or department, signer title, contact and signature area. A department-only signing block must be supported without forcing a personal HR name.

Templates: current employment confirmation, former employment confirmation, experience certificate, and employment with salary. Current employment uses a start date and Present; former employment requires an end date. Salary inclusion is an explicit choice, never inferred from unrelated tool data. Experience descriptions are editable factual text, not automatically invented praise or responsibilities. Do not insert liability waivers as universal legal language.

### 4.3 Salary certificate generator P0

Support monthly or annual salary basis, basic and allowances breakdown, fixed and variable components, optional average earnings period, gross or net designation, currency, employment tenure, signer and verification contact. Generate accurate labels such as monthly gross salary rather than ambiguous salary. A certificate states employer-confirmed compensation; it must not automatically state that funds were transferred. Optional bank-addressed text is editable and never described as bank-approved.

### 4.4 Bilingual document system P0

The application UI, navigation, validation, help and public content are English. Documents default to English. Preserve optional Arabic and Urdu documents and English with Arabic or English with Urdu bilingual pairs from the original feature scope, accessed through Document language settings. Do not add a UI-language selector or localized public-site routes for launch. Language resources and RTL handling are used inside documents and previews, independently of country presets.

Store facts once and wording in language resources. Dates, monetary values and IDs must match across both language panels. Names and job titles use explicit translated fields; no automatic transliteration claim. Remote machine translation is outside the privacy-first baseline. Offer a Copy English value control where appropriate, visibly marking it untranslated.

Support side-by-side English left and Arabic or Urdu right on desktop paper; stacked bilingual layout for long text and narrower formats. Each block declares its own direction. Use Unicode isolation for mixed IDs, emails, phone numbers and monetary values. Preserve natural Arabic joining, Urdu glyphs, punctuation and line wrapping. Offer Latin versus local numeral preference without changing stored numbers. Gregorian dates are the default. Optional Hijri display is P1, with an explicit calendar method and no claim that an approximate conversion is an official date.

Use self-hosted licensed fonts with Latin, Arabic and Urdu coverage; candidate families are Noto Sans, Noto Naskh Arabic and Noto Nastaliq Urdu. Measure Nastaliq line height and clipping. Font selection and UI RTL support do not prove the PDF engine handles complex scripts correctly. PDF language support is gated by rendered samples and text-extraction tests.

### 4.5 Authorized business stamp studio P0

Create circular, oval, rectangular and rounded-rectangle business stamps. Editable content: business name, translated name, registration text, city, department and optional approved graphic. Controls: dimensions in millimetres, border count and thickness, text size, spacing, curve position, ink color, opacity and rotation. Provide restrained presets in blue, black and red, plus custom colors.

Generate SVG from a fixed internal schema, not arbitrary user markup. Support transparent PNG export and safe generated SVG export. Uploaded stamps accept PNG, JPEG and WebP after validation. Arbitrary uploaded SVG is disabled in P0 to avoid scripts and external-resource references. Curved Arabic and Urdu are P1 only if shaping is correct; P0 can use straight RTL text inside a circular border rather than broken letter-by-letter arcs.

Place a stamp on a document with drag handles, resize, rotate, snap to signer area, reset and remove. Store coordinates in page points or millimetres with a page index; viewport zoom must not change exported position. Provide keyboard movement and numeric X, Y, width and rotation fields. Warn about overlap with body text and keep within printable bounds by default. Preserve transparent backgrounds.

Support uploaded authorized signature images and typed signer names. Explain once near the control that an image signature is not a cryptographic digital signature. Do not include official seals, third-party bank stamps, attestation badges, signature imitation, or false verification templates.

### 4.6 Calculators P0 and P1

P0 universal calculators: gross-to-net arithmetic using manual deductions; hourly to monthly and annual conversion using explicit working assumptions; percentage salary increase; overtime arithmetic with user-selected multiplier; unpaid-leave proration with actual-days, working-days or fixed-divisor choice. Label these arithmetic tools, not statutory entitlement determinations.

Optional later calculator extensions: independently reviewed jurisdiction-specific salary withholding, eligible employee contributions and employer costs. These are outside the core P0 and P1 delivery contract unless separately commissioned; implement extension points without requiring packs to launch. Custom net-to-gross is P1 only for supported monotonic custom-rule scenarios labelled as estimates; statutory use additionally requires review with a bounded iterative solver, precision limits and explicit treatment of discontinuities. Gratuity and end-of-service, statutory overtime, leave encashment and minimum-wage checks need separate jurisdiction and eligibility rules; defer until reviewed. Do not calculate them from a universal percentage.

Every result shows calculation mode, currency, inputs, assumptions and arithmetic breakdown. Custom tax results also show the selected rule version, effective period and user-supplied provenance. Only optional reviewed statutory results require jurisdiction, applicable schedule, reviewed scope and official source links. Provide a separate calculation report. Official-source citations belong in the explanation report; ordinary employer documents should not appear to be issued by the tax authority.

### 4.7 Local rule builder P0

The owner specifically requires entering country tax details by hand. Implement an offline-capable Rules workspace with a profile name, optional country and region metadata, effective dates, fiscal-year label, pay frequency, currency precision, brackets, allowances, contribution definitions, source links and test cases. Support create, clone, validate, simulate, import and export JSON. No public authentication is needed because edits remain local and never change other users' rules.

For published site-wide rules, the maintainer edits versioned files in the repository, runs validation and tests, obtains review and deploys. Public users cannot update global rules. This is the maintenance workflow for the no-signup baseline; do not build an unauthenticated public admin endpoint. If a hosted editing CMS is added later it requires separate staff authentication and is outside public no-signup scope.

Provide two clearly separate tax modes: progressive slices and fixed-base-plus-marginal bands. A band carries lower bound, upper bound or null, marginal rate, and fixed base only for the second mode. Validate ascending bounds, no unintended gaps or overlaps, rates within configured limits and explicitly supported discontinuities. Reject executable expressions; use a safe, bounded declarative operation set.

Custom profiles show a persistent User-configured badge, source status and modification time. A custom file cannot set a trusted reviewed status; trust is assigned only by the deployed built-in registry. Protect against prototype pollution, oversized inputs and deeply nested rules. Import must show a summary and require explicit replacement of an existing local profile.

### 4.8 Reusable profiles and batch generation P1

Opt-in local company profiles, template presets, stamp library and draft list. Provide clear explanation that storage is on the current browser and shared devices can expose it. Default document state is memory-only. Remembering a company and saving an employee document are different choices.

CSV batch import includes a downloadable schema, a column mapper, UTF-8 handling, required-field checks, row-level errors, preview and estimated export size. Cap the initial release at 100 documents per batch and 5 MB CSV, with a documented override only after profiling. Use bounded worker processing, progress, cancellation and stable filenames. Never silently skip an invalid employee. Show a manifest with success or failure for every row. Exports for spreadsheets must neutralize leading formula characters in text cells.

### 4.9 Useful supporting tools

P0: amount-to-words tool in reviewed supported languages, printable blank templates, document completeness checklist, company letterhead settings, and comparison guidance for employment versus salary versus experience certificates.

P1: annual salary summary from user-provided records, multi-month salary-slip pack, duplicate-document workflow, local backup and restore, signature image cropping and manual background removal, and batch field consistency report. Annual summaries must not impersonate statutory tax forms. Image background processing stays local.

P2: invoice and receipt generators, tax-deduction certificates, official-format payroll exports, electronic signatures and integrations. These expand regulatory scope and must not delay the core product. A stamp and payroll document suite should remain coherent rather than becoming an unrelated collection of calculators.

## 5 Design and interaction specification

### 5.1 Visual direction

Modern Material-inspired productivity software: calm, familiar, light surfaces, strong typography and restrained elevation. Use Material UI components with a coherent custom theme rather than default styling everywhere. No decorative dashboard charts, oversized hero taking over the tool page, or placeholder metrics.

| Token | Starting value | Usage |
| --- | --- | --- |
| Primary | #1D4ED8 | Main actions, active states |
| Primary soft | #EFF6FF | Selected cards and contextual surfaces |
| Canvas | #F6F8FC | Application background |
| Surface | #FFFFFF | Forms and paper |
| Text | #172033 | Main text |
| Muted | #526078 | Secondary text; verify contrast in context |
| Border | #D8DFEA | Dividers and form structure |
| Success | #137547 | Valid completion |
| Error | #B42318 | Invalid fields |
| Radius | 12 px panels, 8 px controls | Consistent shape |
| Spacing | 4, 8, 12, 16, 24, 32, 48 px | Layout scale |

Typography: 16 px body, 14 px helper, 24–32 px page heading, 20 px section heading. Inputs 44–48 px high; touch targets generally at least 44 px as a product target. Use tabular figures for money. Dark mode is P1 for the shell only; paper remains white and exports do not inherit dark styles. Icons supplement visible labels. Flags are optional decorative country cues, never the only country label or a language selector.

### 5.2 Public pages

Header: PayDockit logo, Tools, Templates, Calculators, Guides and Open tools. No login or signup links. Home page leads with a concise explanation, prominent Salary slip, Employment certificate, Salary certificate and Stamp cards, plus Browse calculators. Show optional document languages, local-processing scope and available formatting presets and calculation modes truthfully. Follow with real sample previews, how it works, useful guides and FAQs.

Each public tool page has a unique title, a short task explanation, a visible Start button, a fictional sample, genuine instructions, supported features and limitations, related guides and sources where relevant. Public pages can host ads but must not collect document data. The private editor is a separate top-level navigation, not embedded in an advertising page.

### 5.3 Private editor desktop layout

Use a 64 px toolbar with document title, optional preset, document language settings, save status, Clear and Download. Under it, a progress navigation with Company, Employee, Pay or Content, Design, Review. Avoid locking users into a rigid wizard; all sections are accessible and review indicates missing requirements.

At 1280 px viewport and above, use approximately 44% form and 56% preview, with a 24 px gap and max content width around 1600 px. Preview is sticky, zoomable and scrollable independently without trapping the page. Provide Fit width and Actual size. A collapsible outline can sit within the form column; do not add a third permanent sidebar that crowds content.

Form sections use labelled inputs, short helpful examples and optional sections collapsed. Currency symbol and ISO code appear at input boundaries. Earnings and deductions have obvious Add line controls. Totals remain visible in a compact summary. Validation errors attach to fields and appear in a linked error summary on export; do not flash errors for untouched optional inputs.

Preview updates after a short debounce, uses the actual document layout output and clearly marks unsatisfied required fields. Do not re-render a heavy PDF on every keystroke. Render a lightweight preview while typing, then update the actual PDF after idle or on Review; acceptance tests must establish parity.

### 5.4 Mobile layout

At 360–767 px use Edit and Preview tabs, one form column, compact document settings with optional preset and document-language controls, and a sticky bottom action bar with Back or Next and Review or Download. Preserve visible labels and avoid horizontal page scrolling. Earnings rows can expand into cards. Stamp placement opens a full-screen panel with numeric positioning; dragging is optional. At tablet sizes use a user-switchable preview drawer or stacked layout.

### 5.5 Empty, busy and error states

Empty editor offers Start blank and Load fictional sample. Sample mode has an unmistakable watermark. PDF generation shows progress and cancellation where possible. A font-load or unsupported-script failure blocks that export with a clear explanation and a retry; never export missing glyphs silently. Storage-quota failure offers project-file download. Unsupported calculator scenarios explain missing support and offer manual entry. Offline mode works after required assets and optional presets and required local rule assets are available; show exactly what is cached.

### 5.6 Accessibility

Target WCAG 2.2 AA [20]. Include keyboard completion, visible unobscured focus, logical RTL focus order, programmatic labels, field instructions, error associations, skip link and reduced motion. Do not communicate required fields or rule status by color alone. Provide an accessible HTML document preview even if exported PDF tagging is limited; do not claim PDF/UA conformance without separate verification. Live totals use restrained announcements and must not interrupt each keypress. Check dialogs rendered through portals for explicit direction, as required by the chosen MUI integration [18].

## 6 Optional country formatting presets

Country is a convenience setting, not the product's structure. Keep the default English-first General workflow usable without a preset. Place preset selection in Document settings rather than an initial country-selection screen. Do not detect location to force a preset or redirect users.

Maintain a small static registry with preset ID, English name, suggested ISO currency, date display, paper size, numeral preference and optional editable field-label suggestions. Use a separate tax registry. Preset changes never overwrite user-edited fields, delete custom rows, add mandatory sensitive identifiers, enable deductions or change the English UI. Show a concise changes preview and allow reset to General.

Use Intl.NumberFormat and locale-aware formatting for display; arithmetic uses canonical decimal values. Keep ISO currency codes visible when symbols are ambiguous, such as USD, CAD and AUD. Currency is independently selectable. English document wording and Latin numerals remain the default. Regional digit grouping can be an advanced option.

For SAR, use an official SAMA asset according to its guidelines or the stable SAR text fallback [7]. Use AED text until any official symbol asset and usage terms have been verified. Do not use money emojis as formal currency marks. Self-host approved assets with source and license records.

Identifiers are optional generic fields by default. Presets may suggest labels such as business registration, employee number, ABN, NTN or Iqama, but must not imply registry verification. Mask sensitive personal identifiers by default. Bilingual document selection remains independent of the preset.

Do not build country-specific payroll forms, separate country tools, regional account systems, mandatory legal questionnaires or comprehensive local compliance modules. Future reviewed checklists and tax packs must be explicitly selected optional modules, separately tested and accurately scoped.

## 7 Architecture and implementation stack

### 7.1 Recommended stack

React with TypeScript using Next.js App Router and static generation for public pages. Use a static-export-compatible architecture initially: public content and tool routes are built HTML, while editors are client components. Next.js supports generating HTML per route for static exports [16]. No payroll API is required. A plain Vite SPA is not the recommended public SEO baseline unless equivalent prerendering is implemented.

Suggested dependencies: Material UI and its recommended styling integration; React Hook Form plus Zod; a small Zustand store only for cross-tool state; decimal.js for money; plain typed English UI messages and separate document-language catalogs; no public-site internationalization framework is required; date-fns or a small date library where Intl is insufficient; IndexedDB wrapper such as idb for opt-in profiles; a CSV parser and ZIP library loaded only on batch routes; Vitest and Testing Library; Playwright and axe-core. Pin compatible stable versions at implementation time, commit a lockfile, and check licenses. Do not blindly copy versions from this document.

PDF engine decision is a technical spike, not an unsupported promise. Start by evaluating pdfmake with embedded fonts, since it supports client-side custom fonts [19]. Compare complex-script output, text extraction, tables, page breaks and stamps against a second candidate if necessary. Reject any pipeline that reverses whole Arabic strings or breaks shaping. If the selected library cannot pass Arabic and Urdu tests, use a proven local shaping pipeline or browser print for those scripts with clearly stated export support, and do not mark full bilingual PDF support complete until it passes. Raster-only PDFs are not the default acceptable substitute for searchable text.

### 7.2 Origin isolation

Deploy public content at the main origin and private tools at a distinct origin such as tools.example.com. Both are outputs of the same repository, with independent layouts, CSP and script bundles. The private origin must never load AdSense, tag managers, session replay, third-party analytics or remotely served fonts. Distinct URL paths on one origin are weaker isolation and are not the target design.

When opening the editor use a fresh top-level navigation, noopener where applicable and Referrer-Policy: no-referrer. Only allowlisted preset, document-language and template IDs are accepted in URLs. Never transfer salary or employee data using query strings, fragments or public-origin storage. Data entry starts on the private origin. Calculator to document handoff happens within that origin. Do not embed the private application in the public page. Public articles can link back from the editor through ordinary links without sharing editor state.

Use host-only cookies if any are later introduced; do not set shared parent-domain cookies. Both origins need HTTPS, and subdomain isolation does not eliminate all same-site or supply-chain risk. Validate the boundary with network tests and storage inspection. Private tool routes can be noindex while public landing pages carry search content. Robots directives are not access control.

### 7.3 Repository structure

```text
apps/
  public-site/          # static React content, tool landing pages, guides, ads
  private-tools/        # editor, calculations, local rules and exports
packages/
  domain/              # schemas, money, validation and deterministic math
  presets/             # lightweight optional formatting defaults
  tax-rules/           # custom rule schema and optional reviewed registry
  documents/           # canonical document AST and layout adapters
  pdf/                 # export engine, fonts, positioning and worker bridge
  ui/                  # shared tokens and accessible components
  i18n/                # message catalogs and reviewed template wording
content/
  guides/              # editorial MDX with citations and review metadata
  preset-help/         # optional English explanations, not country landing pages
tests/
  fixtures/            # fictional multilingual and boundary examples
  e2e/                 # privacy, editing and export journeys
docs/
  architecture.md
  rule-maintenance.md
  preset-and-calculation-scope.md
  deployment.md
  privacy-data-map.md
  implementation-status.md
```

A workspace monorepo is recommended for origin separation and shared deterministic logic. Avoid unnecessary microservices. Shared UI packages must not pull public analytics into private-tool dependencies. CI should fail if forbidden script hosts or analytics imports appear in the private build.

### 7.4 Core schemas

```ts
type DecimalString = string; // validated canonical decimal, never a JS float amount
type RuleTrust = 'built-in-reviewed' | 'built-in-unreviewed' | 'user-custom';

interface Money { amount: DecimalString; currency: string }
interface LocalizedText { en?: string; ar?: string; ur?: string }
interface PayLine {
  id: string;
  label: LocalizedText;
  category: 'earning' | 'deduction' | 'reimbursement' | 'employer-contribution';
  amount: DecimalString;
  taxClass: string;
  contributionClass: string;
}
interface RulePack {
  schemaVersion: number;
  id: string;
  version: string;
  country: string;
  subdivision?: string;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  yearLabel: string;
  supportedScenarios: string[];
  excludedScenarios: string[];
  calculationMethod: string;
  rules: unknown; // replace with a discriminated safe-operation schema
  roundingPolicy: unknown; // explicit stage, scale and tie handling
  sources: { url: string; title: string; accessedOn: string; provision?: string }[];
  review: { status: 'draft' | 'reviewed' | 'withdrawn'; reviewedOn?: string; reviewerRole?: string };
  fixtures: { input: unknown; expected: unknown; source?: string }[];
}
interface PayrollDocument {
  schemaVersion: number;
  documentId: string;
  kind: 'payslip' | 'employment-certificate' | 'salary-certificate';
  countryPresetId?: string; // omitted means General; never a required jurisdiction
  currency: string;
  languages: string[];
  templateId: string;
  company: unknown; // replace with validated domain model
  employee: unknown;
  payLines: PayLine[];
  calculationSnapshot?: {
    rulePackId: string; ruleVersion: string; inputs: unknown;
    outputs: unknown; assumptions: string[];
  };
  placements: { assetId: string; page: number; xPt: number; yPt: number;
    widthPt: number; heightPt: number; rotationDeg: number }[];
}
```

These interfaces are a contract outline. Replace unknown types with validated schemas before production. Trust is derived from the deployed registry, not accepted from uploaded JSON. Store rule snapshots with exported projects so historical documents do not silently recalculate under new law. A re-opened document offers Keep original calculation or Recalculate with selected version, with a visible difference summary.

### 7.5 Document pipeline

Validated form state flows to normalized domain facts, then deterministic calculations, then a language-aware document AST, then preview and PDF adapters. There must be one canonical source for calculated totals. Templates must not recalculate values independently. Layout nodes include paragraphs, bilingual blocks, tables, repeatable headers, signer sections and positioned assets.

The PDF adapter handles pagination, repeated table headers, widow avoidance, margin checks and stamp placement. Keep the signature block together where feasible. Use safe plain text for user content rather than raw HTML. Revoke Blob URLs after export and strip uploaded image metadata by decoding and re-encoding locally. Download filenames default to document type and date, with employee names as an explicit preference.

## 8 Configurable calculation mathematics and optional rule governance

### 8.1 Canonical arithmetic

All money uses decimal arithmetic or integer minor units with explicit scale. Never perform totals using binary floating-point numbers. Keep quantities such as hours and rates at required intermediate precision and apply the rule pack's rounding at the defined stage. Currency decimal count and statutory rounding need not be identical.

For a progressive-slice tax model, tax equals the sum of taxable slice width multiplied by that slice's rate. For a base-plus-marginal model, select the matching band and calculate fixed base plus marginal rate times income above that band's lower bound. Do not add both formulas together.

For illustrative nonstatutory fixtures only: 0 to 1,000 at 0%, next 1,000 at 10%, remainder at 20% gives tax of 200 for taxable income 2,500. Another arithmetic fixture: gross wages 100,000, employee deductions 8,000 and nonwage reimbursements 5,000 produce net wages 92,000 and cash payable 97,000. These invented examples are not any country's tax rates.

Monthly annualization must be an explicit estimate mode. For a supported annual reconciliation method, calculate expected annual taxable salary, annual liability and prior withholding; then allocate the remainder to remaining supported pay periods according to the reviewed rules. Do not universally divide annual liability by 12. Bonuses, employment changes, irregular payments, credits, refunds and midyear starts can change treatment. Unsupported cases must be identified rather than approximated under a payroll-ready badge.

Never multiply monthly pay by 4 to derive an annual salary. Conversions use defined pay frequencies, such as 12 monthly or 26 fortnightly, and explicitly handle years or schedules with additional pay periods when applicable. Proration and overtime divisors are employer or jurisdiction choices, not hidden assumptions.

### 8.2 Optional published statutory rule review lifecycle

1. Resolve the enacted authority, applicability and effective dates; keep the exact URL and relevant provision.
2. Write the supported employee scenarios and exclusions before coding rates.
3. Enter rules through the local builder or repository schema; validate structure and arithmetic.
4. Add authoritative examples, boundaries, rounding tests and ineligible-scenario tests.
5. Obtain qualified local payroll or tax review of the published scope. Record role and date; do not invent credentials.
6. Publish a versioned immutable pack, changelog and review date. Preserve earlier packs for historical periods.
7. On reported error, withdraw the affected calculation scenario, publish a correction note and keep manual generation usable.

This lifecycle applies only if reviewed statutory packs are later published. It does not block the global document tools or custom rule builder. Review those published packs monthly and when budget or regulatory changes occur. This is an operational recommendation, not a guarantee monthly review captures every change. Expired, missing or withdrawn packs must not run as current verified calculations. Availability is evaluated by pay-period dates and scenario, not only today's date. If a pay period crosses a rule change, split only when the implemented rules support that method; otherwise require manual review.

## 9 Privacy and security implementation

Default: memory-only state. Offer explicit Save draft on this device, Remember company and Export project actions. Persistent local saving has a configurable expiry, initially 30 days, with the shared-device warning. Implement expiry enforcement on next open; do not promise background deletion after the browser is closed. Clear all local data deletes application IndexedDB stores, opted-in drafts, uploaded assets and caches of private exports. It cannot delete files already downloaded to the user's device.

IndexedDB is not protection against XSS or a compromised browser; local storage choices must not be marketed as encryption [21]. If encrypted backup is implemented, use standard Web Crypto authenticated encryption with a documented password-derived key approach; never invent cryptography or store the decryption password beside the backup. Treat this as P1 and test recovery, corruption and wrong-password errors.

Private origin controls: restrictive host-configured CSP, no third-party script hosts, object-src none, base-uri none, frame-ancestors none, and appropriately limited connect-src. Allow only narrowly required worker and Blob behavior. Use production-compatible nonces or hashes where feasible; document any build constraints rather than inserting broad unsafe-eval. Host security headers are deployment configuration because static-export apps cannot rely on server-only Next.js header features [16].

Validate file signatures, MIME type and actual decoded images. Start with 5 MB per image, 10 MB per project JSON, pixel count limits and bounded imported collections. Refuse remote image URLs so an employer logo cannot cause hidden external requests. Reject HTML in fields, sanitize safe generated SVG, guard JSON parsing and prohibit arbitrary formula evaluation. Do not add remote URL fetching as an import convenience.

No PII in URLs, cookies, logs, error telemetry, analytics, crash attachments or contact forms by default. Errors use event codes and software version, not form values. No session replay anywhere in the editor. Public analytics, if enabled with appropriate consent, count public page and tool-open events only. Editor completion rates can be measured in consented local research; do not undermine privacy to measure the funnel.

Privacy policy must distinguish local document processing from hosting access logs, public analytics, advertising partners, consent records and voluntary support correspondence. Do not claim that absolutely no data is collected across the entire website. Publish a contact route that asks users not to send real payroll documents.

## 10 SEO and original content

### 10.1 Routes and rendering

Public routes: /tools/salary-slip, /tools/employment-certificate, /tools/salary-certificate, /tools/stamp-maker, /calculators/gross-to-net, /calculators/salary-converter, /calculators/salary-increase, /calculators/overtime, /calculators/unpaid-leave, /templates, /guides, /about and policy pages. All launch content is English. Prioritize global task intent such as free salary slip generator, employment certificate template, salary certificate maker and business stamp maker.

Do not create /countries navigation, country-specific tool copies, localized marketing pages or a country rollout sitemap. Optional presets live within tools and can have a single helpful English guide if needed. A currency or country query parameter must not create a separately indexed page.

Private routes: tools.example.com/payslip, /employment-certificate, /salary-certificate, /stamp-maker, /calculator and /rules. Keep them noindex and out of public sitemaps. Actual projects and assets never receive public URLs.

Public pages must deliver real content in initial HTML. Google's JavaScript guidance recommends server rendering or prerendering for crawler accessibility and speed [13]. Implement unique English titles and descriptions, canonical URLs, semantic headings, crawlable anchors, real 404 status handling, XML sitemap, robots.txt and social metadata. No hreflang is needed for an English-only public site.

Use accurate BreadcrumbList, Organization, Article and WebApplication structured data where applicable. Do not promise FAQ rich results or invent ratings. Keep draft states, sample-data variants and query permutations out of the index.

### 10.2 Editorial launch backlog

Prepare these 15 article briefs as a useful initial backlog, not a Google-mandated article count. Content needs actual authorship, appropriate review, examples and sources before publishing.

1. Salary slip components explained with a fictional annotated example.
2. Gross pay, net wages and cash payable explained.
3. Employment certificate versus salary certificate versus experience letter.
4. How to write an English employment certificate.
5. How to prepare a clear salary certificate with a breakdown.
6. Hourly, monthly and annual salary conversions with explicit assumptions.
7. Calculating a salary increase in money and percentage.
8. Overtime calculations using a stated rate and multiplier.
9. Unpaid leave proration methods with worked examples.
10. Custom tax brackets and how to check a calculation.
11. Company letterhead and professional document formatting.
12. Optional country presets and what they change.
13. Bilingual documents with matching names, dates and amounts.
14. Business stamps and what they do not authenticate.
15. How local document processing and downloadable backups protect privacy.



Each article has an identifiable author or accountable editorial team, review status, published and materially updated dates, official references, an original worked example, assumptions, related tools and a correction route. No invented experts, scraped wording, automatic year updates or mass AI-written country clones. Word count is not a quality target. Financial and jurisdictional claims need appropriate review before publication.

## 11 AdSense implementation and business operations

Interpret Google ads here as AdSense display monetization. Google Ads paid acquisition is a separate optional business decision and is not required for the build.

### 11.1 Where ads can appear

Substantive public guides and template pages: one responsive in-content placement after useful introductory material and one lower placement when article length supports it. Public tool landing pages: restrained placement after meaningful instructions or supporting content. Reserve ad space to reduce layout shift. These slot counts are conservative product choices, not official Google thresholds.

Private editor, stamp studio with user content, private calculators, preview, export and download screens: no ads or advertising scripts. Generated PDFs and images: no ads. Do not use a download countdown, fake download button, rewarded click, pop-under, forced interstitial or ad near a control likely to cause accidental clicks. Google explicitly warns about ads mistaken for navigation or downloads [12].

Use a public-layout AdSlot component controlled by configuration, publisher ID and consent state. Render placeholders in development and do not click live ads for testing. Do not refresh ads based on typing or route events without confirming current policy permission. Auto ads are off initially; if later enabled they must remain impossible to load on the private origin.

### 11.2 Consent and approval readiness

Publish About, Contact, Privacy, Terms, Cookie information, Editorial policy, Corrections and Preset and calculation scope pages. Present accurate capabilities and no broken or placeholder tools. Configure HTTPS, real navigation, accessible content and a valid owner contact. Add ads.txt using the exact verified publisher details after approval or when instructed by the account workflow; never invent a publisher ID.

Google requires an appropriate certified CMP integrated with the TCF for the covered advertising scenarios in the EEA, UK and Switzerland [15]. Use a maintained certified solution, apply the actual region and consent requirements, and allow users to revisit choices. Nonpersonalized advertising is not automatically exempt from consent obligations. A CMP's certification is not blanket legal compliance. Confirm applicable privacy requirements before launch.

Do not claim a guaranteed article count, minimum traffic threshold, guaranteed approval or guaranteed RPM. The application can be useful before ads are enabled. Revenue depends on geography, audience, demand, viewability and policy status. Forecast using pageviews divided by 1,000 times observed page RPM, and label any numbers as hypothetical until actual account data exists. Track public traffic, search queries, Core Web Vitals and policy notices, never salary content.

## 12 Performance and offline behavior

Targets: field p75 LCP at most 2.5 seconds, INP at most 200 ms and CLS at most 0.1 where sufficient real-user data exists [17]. Lab tests are a development proxy, not proof of field performance. Product budgets: public first-route JavaScript initially target 150 KB gzip excluding approved ad code; private editor shell target 250 KB gzip excluding lazily loaded PDF and language assets. Measure and record actual results. These are project budgets, not framework guarantees.

Split public and private bundles. Load PDF engine, CSV tooling, ZIP creation and extra language fonts on demand. Self-host fonts, subset when legally and technically safe, and preload only the active UI font. Lazy-load noncritical previews. Use workers for expensive batch and calculation work where the chosen library allows it. Keep normal form editing responsive and debounce preview jobs with cancellation or stale-job rejection.

Single simple PDF target: under 3 seconds after required assets are loaded on a documented midrange test device. Report device, document and script language in benchmarks. A heavy Urdu font and a 100-document batch have different targets. Use real dimensioned assets and fixed ad slots to prevent layout jumps. Avoid unnecessary animation and broad icon imports.

P1 service worker caches application code, fonts and public rule packs only. Never cache generated PDFs, form submissions or private documents in shared response caches. Version caches and show update availability without losing active work. Core privacy claims must hold offline and online. First-ever offline use cannot be promised before assets are cached.

## 13 Validation and acceptance tests

### 13.1 Domain and rule tests

Test all universal arithmetic and custom rule operations with independent fixtures. For any optional built-in reviewed pack, additionally test at each threshold just below, exactly on and just above the boundary; effective-date edges; currency rounding; zero income; invalid negative input; caps; bonuses and supported year-to-date reconciliation. Compare against official examples and independent expected fixtures. A self-written formula tested against itself is insufficient.

Property tests: totals reconcile; progressive tax is nondecreasing where the jurisdiction's rule should be; increasing an employee deduction decreases net wages by the same amount; employer contributions do not reduce employee net; reimbursements do not enter taxable salary unless their class requires it. Reject NaN, Infinity, excessive precision, wrong currency and malformed year ranges.

### 13.2 Document and bilingual tests

Create golden fixtures for English, Arabic, Urdu and both bilingual pairs; long company and employee names; mixed RTL IDs; two-page deductions; large amounts; zero values; custom labels; missing optional fields; symbols and cents. Render exports to images and inspect clipping, joining, text order, overlaps, signatures, stamps and page breaks. Extract PDF text and verify essential names and monetary values. Check fonts are embedded as permitted and output remains searchable.

The final preview and downloaded document must agree on dates, totals, wording and asset positions. Test A4 and Letter, desktop and mobile zoom, browser print and PDF exports. Verify no sample values survive in a blank project and sample watermark cannot disappear while sample mode remains active.

### 13.3 Browser and privacy tests

Playwright tests cover complete no-signup journeys, imported drafts, unsupported rules, optional preset changes, keyboard stamp positioning, failed exports, clearing data, offline asset behavior and batch cancellation. Test current Chrome, Edge, Firefox and Safari plus Android Chrome and iOS Safari on real devices where possible.

Capture private-origin network requests while entering unique fictional names and amounts. Assert that no field values, documents or uploaded images leave the browser. Assert that AdSense, tag managers and third-party analytics do not load on private routes. Inspect public URLs, referrers, storage and console logs for leakage. Test malicious filenames, CSV formulas, HTML injection, oversized image dimensions and malicious rule imports.

### 13.4 Explicit release acceptance

| ID | Requirement | Evidence |
| --- | --- | --- |
| A01 | Basic valid slip within 120 seconds | Moderated test with at least 10 first-time users |
| A02 | No account, email or ad gate | E2E from landing through download |
| A03 | Salary and employment certificates complete | All P0 templates generate valid PDFs |
| A04 | Bilingual integrity | Native review, visual PDF checks and text extraction |
| A05 | Stamp positions stable | Export-coordinate checks across zoom and page sizes |
| A06 | Universal and custom-rule mathematics correct | Independent arithmetic fixtures; review only for optional statutory packs |
| A07 | No payroll egress | Network and telemetry inspection |
| A08 | Ad isolation | Private bundle and browser host assertions |
| A09 | Responsive accessible editing | Keyboard, screen-reader sampling and axe checks |
| A10 | Searchable public content | Initial HTML, sitemap, status and metadata checks |
| A11 | Maintainable tax rules | Clone, edit, test, version and historical reopen demo |
| A12 | No false support claims | Support matrix agrees with enabled features |

The global product can launch with manual documents, universal calculators and custom tax profiles. No country payroll pack is a release prerequisite. Any optional statutory calculator advertised later must pass a separate review gate.

## 14 Implementation plan and milestones

### Milestone 0 Scope and risky prototypes

Create architecture and data-map documents, the General preset and optional formatting registry and the English public route inventory. Prototype PDF layout with English, Arabic and Urdu, custom fonts, bilingual tables and positioned stamps. Prototype origin-separated deployments and a declarative tax pack. Deliver rendered fictional examples and an explicit PDF-engine decision. Resolve script shaping and money-model design before polishing a large UI.

### Milestone 1 Shared foundation

Build the monorepo, TypeScript validation, UI tokens, routing, accessible form controls, localization, money primitives, canonical document model and CI. Deploy public and private shells. Add host headers and basic forbidden-script assertions. Provide blank and fictional sample datasets with no real personal data.

### Milestone 2 Complete document workflow

Implement payslip editor, employment and salary certificates, all P0 templates, local preview, PDF and print, JSON import and export, branding, authorized signatures and stamp studio. Complete mobile and keyboard workflows. Deliver a complete global English manual-document journey with optional presets with no placeholder controls.

### Milestone 3 Universal calculators and custom tax workspace

Build universal salary arithmetic tools and the local rule editor, safe import, simulation, explanations, immutable snapshots and test runner. Complete custom tax functionality without waiting for a national payroll pack. Include optional reviewed-pack extension points, but no country-specific statutory pack is required for this milestone. Preserve clear User-configured estimate labels.

### Milestone 4 Public content and monetization preparation

Build indexable landing pages, an English preset-help guide, template catalog and reviewed original guides. Add source and editorial metadata, policy pages, public-only consent management, ads disabled by default, ads.txt configuration and Search Console handover instructions. Run policy and accessibility checks. AdSense application is an owner account action; Codex must not fabricate account approval.

### Milestone 5 Full product completion

Add opt-in profiles, local draft management, batch generation, ZIP manifests, multi-month workflows, calculation reports, offline assets and the optional formatting-preset registry. Complete cross-browser QA, usability timing and launch checklist. P2 features remain separately tracked and are not represented as available.

### Milestone 6 Launch and maintenance

Publish support scope, changelog and corrections process. Monitor public search performance and errors without payroll telemetry. Review source changes, dependency security, content accuracy and policy notifications. Retest tax packs before relevant fiscal-year transitions. Release a corrected pack with preserved history when needed.

Do not promise a fixed delivery date before the PDF spike, content-review needs and optional calculator scope are known. Implementation can be staged, but each completed milestone must be runnable and reviewable. Runtime is predominantly static hosting; budget separately for domain, review expertise, editorial work, device testing and maintenance. No paid AI API is needed for the baseline.

## 15 Codex execution instructions

Use this document as the product contract. Build the application, not merely a visual mockup. Start by inspecting the repository and its instructions; preserve existing work. If the repository is empty, initialize the recommended workspace. Use the latest compatible stable dependencies verified from primary documentation, lock versions and record the actual stack.

Proceed milestone by milestone. Keep docs/implementation-status.md updated with complete, blocked, reviewed and deferred states. Resolve routine implementation choices autonomously. Surface genuine blockers, such as missing enacted rules, unavailable deployment configuration or absent payroll review, with the affected feature scope. Continue implementing unrelated authorized functionality.

Do not invent tax rates, regulator approval, expert reviews, supported languages, publishers, testimonials, traffic, employee records, or policy guarantees. If review is missing, implement the schema and fixtures and leave the production statutory calculation disabled without blocking general tools or custom rules. Populate development with clearly fictional data. Do not use the project owner's actual salary or identity as fixtures.

Required implementation output: runnable repository; README with install, develop, test, build and deploy commands; two-origin hosting configuration; schema and documented rule-maintenance workflow; all P0 features; explicit P1 completion checklist; source register; preset and calculation scope matrix; tested templates and fonts; meaningful tests and results; privacy data map; content authoring workflow; and a concise handover showing remaining launch decisions.

Definition of done: all advertised controls work; PDFs match previews and contain no clipping; supported bilingual scripts render correctly; no public signup exists; no sensitive data leaves the editor; universal and custom-rule calculations pass independent fixtures; any optional reviewed packs pass their own review gates; public pages are indexable; private routes have no ads; mobile editing is usable; and disabled or unreviewed capabilities are labelled honestly. No unexplained TODOs in advertised core functionality.

### Pasteable kickoff prompt

> Read this entire specification and implement the PayDockit React application in this repository. Follow the milestones and acceptance criteria. Begin with repository inspection, the multilingual PDF spike, canonical money and document schemas, and origin-separated public and private shells. Then implement complete vertical slices for salary slips, employment certificates, salary certificates, bilingual templates, business stamps, optional formatting presets, custom tax rules and English supporting content. Keep every core tool usable without signup. Use local browser processing and public-only advertising. Never invent tax rules or payroll review. Track scope and verification in docs/implementation-status.md and keep working until the authorized implementation is complete or a specific external prerequisite blocks a named feature.

## 16 Launch decisions requiring owner input

These decisions can be made during implementation; they need not block initial coding. Use the confirmed PayDockit name and choose its domain after availability checks. Confirm the desired lightweight preset list. Arrange native-language review for optional bilingual templates. Appoint a payroll reviewer only if choosing to publish an optional statutory pack. Supply actual public business contact and privacy details. Choose hosting that can serve both origins and set security headers. Configure the real AdSense publisher account and consent provider when ready. Provide approved employer sample branding or use clearly fictional assets.

Manual document generation and the configurable engine can be implemented before these external reviews. Production claims about legitimate payroll calculation cannot be completed through UI quality or a disclaimer alone.

## 17 Source register

Research accessed 29 October 2026. Sources support the nearby findings; proposed architecture, priorities, UI values and budgets are recommendations. These links are also the starting point for implementation-time verification. Do not treat this register as a complete legal review of every country.

1. Zoho Payroll, free payslip generator and baseline fields: https://www.zoho.com/in/payroll/free-payslip-generator/
2. TankhaPay, free payslip generator and export workflow: https://www.tankhapay.com/tools/payslip-generator
3. GOV.UK, payslip requirements: https://www.gov.uk/payslips
4. Fair Work Ombudsman, pay-slip requirements and confidentiality: https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips
5. Fair Work Ombudsman, record-keeping obligations: https://www.fairwork.gov.au/pay-and-wages/paying-wages/record-keeping
6. FBR enacted-year source entry points: https://www.fbr.gov.pk/Categ/Finance-Acts/620 and https://www.fbr.gov.pk/withholding-taxes-rate-card/174298/174301 and https://www.fbr.gov.pk/Categ/Income-Tax-Ordinance/326/1000
7. Saudi Central Bank, Saudi riyal symbol guidelines: https://www.sama.gov.sa/en-US/Currency/SRS/Pages/Guideline.aspx
8. Saudi government, wage-protection upload service: https://my.gov.sa/en/services/19988 and employment certificate service: https://my.gov.sa/en/services/19310
9. UAE government, payment of salaries and WPS: https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/payment-of-wages
10. UAE government, taxation: https://u.ae/en/information-and-services/finance-and-investment/taxation
11. Google Publisher Policies: https://support.google.com/publisherpolicies/answer/10502938?hl=en
12. Google AdSense ad placement policies: https://support.google.com/adsense/answer/1346295?hl=en
13. Google Search Central, JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
14. Google Search Central, spam policies and scaled content abuse: https://developers.google.com/search/docs/essentials/spam-policies
15. Google AdSense, consent management requirements: https://support.google.com/adsense/answer/13554020?hl=en
16. Next.js, static exports: https://nextjs.org/docs/app/guides/static-exports
17. Google web.dev, Core Web Vitals thresholds: https://web.dev/articles/defining-core-web-vitals-thresholds
18. Material UI, RTL integration: https://mui.com/material-ui/customization/right-to-left/
19. pdfmake, client-side custom fonts: https://pdfmake.github.io/docs/fonts/custom-fonts-client-side/
20. W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
21. OWASP, HTML5 storage and security: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html

Research limitations: PayDockit targets English-speaking users globally; no country-specific launch priority is assumed. The earlier country research remains background reference for optional future packs, not the launch scope. Exact statutory rates and all employee categories were not independently audited for this planning document. UK and Australian payroll calculation packs require additional ATO and HMRC implementation sources, not only document-field guidance. Saudi insurance applicability and UAE pension eligibility require separate local review. The plan explicitly prevents those gaps from becoming unlabelled production assumptions.
