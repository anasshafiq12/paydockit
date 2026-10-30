# Static deployment

## Build-time configuration

The repository produces two separate static output directories. Set actual HTTPS origins as environment variables in the build environment (or duplicate `.env.local` into each app). Do not deploy the localhost canonical values.

PowerShell example, with domains supplied by the operator:

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'https://www.your-domain.example'
$env:NEXT_PUBLIC_TOOLS_URL = 'https://tools.your-domain.example'
$env:NEXT_TELEMETRY_DISABLED = '1'
npm ci
npm run build
```

These are reserved example domains and are not registered, deployed, or verified domains.

## Vercel

The root `vercel.json` publishes both apps in one deployment through Vercel's Build Output API. It explicitly selects the Other framework preset (`framework: null`) so Vercel does not search for a root `.next` directory. Keep the project's Root Directory empty and leave Output Directory unset to use this configuration.

`npm run build:vercel` sets both public and tools links to `https://www.paydockit.com`, builds both exports, and merges their assets into `.vercel/output/static`. The public home page remains at `/`; editors are at `/payslip/`, `/employment-certificate/`, and `/salary-certificate/`, with stamp, calculator, rules, and batch routes alongside them. It fails on conflicting assets or old hosting links. Set `PAYDOCKIT_SITE_URL` to change the canonical production origin when moving to another domain.

The build writes `.vercel/output/config.json` with explicit page routing, real 404 responses, shared security headers, the generated per-page Content-Security-Policy hashes, and noindex/no-store headers on tool routes. Public pages retain their zero-runtime optimization. All pages share the deployment's browser storage origin; this mode must remain free of third-party scripts, analytics, or advertising.

The two independent exports and app-level `vercel.json` files remain available for separate-origin hosting. That mode requires separate projects and explicit `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_TOOLS_URL` environment variables; use `npm run build` instead of the combined Vercel command.

## Cloudflare Pages or equivalent

Create two static projects from the same repository and build environment. The first publishes `apps/public-site/out`; the second publishes `apps/private-tools/out`. The root build writes a host `_headers` file into each export. Keep host-injected analytics and automatic scripts OFF on the tools project. Do not enable SPA fallback; nonexistent paths must use `404.html` with a 404 response.

The generated CSP hashes Next inline script contents on each page. There is no `unsafe-eval` or remotely hosted script permission. Emotion and inline layout controls require `style-src 'unsafe-inline'`; this is a documented styling constraint, not a script exception. Validate the deployed CSP, loaded chunks, fonts, imports, downloads, and print paths. Development mode needs WebSocket/dev exceptions; the production headers apply only to exported files.

## Generic static hosting / Caddy

Use the corresponding public and private output directories as each origin's document root. Apply the generated `_headers` rules using your host's equivalent mechanism; Caddy does not automatically parse Cloudflare's file format. Serve directory `index.html` normally and a 404 for nonexistent paths. Configure HTTPS, HSTS after validating the hostname setup, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, frame restrictions, and private `X-Robots-Tag: noindex, nofollow`. Do not create a shared parent-domain cookie.

## SEO handover

Unique page metadata, canonical URLs, crawlable navigation, Organization / WebApplication / Article / BreadcrumbList data, sitemap and robots output are included. Configure a real social preview image before launch if desired. Submit the public sitemap in the owner's Search Console property. Search engines choose whether and how to show sitelinks; no implementation can guarantee sitelinks or rankings.

## Launch decisions

Choose and configure the real domains and hosting. Supply business identity, support address and retention information. Verify production security headers and two-origin boundary. Ads are disabled and there is no ads.txt publisher entry. A real publisher account, appropriate certified consent integration, and disclosure review are separate owner setup steps if monetization is later enabled.
