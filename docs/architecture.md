# Architecture

## Two static origins

`apps/public-site` is a Next.js App Router static export. Public content is rendered at build time and contains ordinary anchors, semantic headings, and metadata before JavaScript runs. `apps/private-tools` is a second Next.js static export containing client components and Material UI. Both share typed modules in `packages/`. Production needs static hosting, not a Next server.

Set the actual main and tools HTTPS origins before building. Local development runs on ports 3000 and 3001. Cross-origin links contain no employee data. Tool URLs accept only allowlisted template/calculator identifiers and the explicit blank-template flag. No account, cookie-sharing, API route, server action, or document-upload endpoint exists.

## Data and calculation pipeline

Client form state → validated Zod document schema → `decimal.js` canonical totals → HTML preview / English jsPDF / print. Pay lines have stable IDs and explicit categories. The same domain function supplies all totals. Monetary inputs are bounded canonical decimal strings; hours × rate is separate from salary basic pay. Reimbursements do not enter wage gross; employer contributions do not reduce employee net.

The HTML and PDF adapters share facts and totals but have distinct layout implementations. Basic English PDF output has been downloaded, rendered, and text-extracted. Exact long-document visual parity across all templates and scripts remains an explicit verification task. PDF pagination is visible in the exported file; preview warns about differences.

## Export decision

jsPDF is lazy-loaded for searchable English PDF text. Its standard font character coverage is checked; unsupported scripts are blocked with a browser-print alternative. We did not select a complex-script PDF library on an unsupported shaping claim. Local Arabic/Urdu fonts support HTML draft panels and printing. Full certificate translation, native review, font embedding/text extraction, and cross-browser RTL verification remain gated.

Stamp graphics come from a fixed escaped SVG schema. Raster uploads are decoded and re-encoded on a local canvas, bounded by 5 MB and 16 megapixels. No arbitrary SVG upload or remote image URL is accepted. Logo/signature project imports accept local image data only. PDF stamps use page-one millimetre coordinates; the HTML placement model uses the same physical units. Stamp rotation and cross-template placement still need exhaustive export testing.

## Loading and dependencies

Public content uses server components. Private tool routing uses client-side dynamic imports; PDF, CSV and ZIP libraries load on demand. Material UI uses the App Router Emotion cache integration. Noto language font files are self-hosted; the browser loads font faces only when used. Production output is scanned for remote script sources and known tracking hosts. Initial JavaScript measurements are recorded in `build-report.json`, not substituted for field Core Web Vitals.

No third-party analytics, advertising, telemetry, machine translation, authentication, or database has been introduced. Next's development/build telemetry is a developer tool setting and can be disabled with `NEXT_TELEMETRY_DISABLED=1`; it is unrelated to browser payroll processing.
