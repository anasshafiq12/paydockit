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

## Cloudflare Pages or equivalent

Create two static projects from the same repository and build environment. The first publishes `apps/public-site/out`; the second publishes `apps/private-tools/out`. The root build writes a host `_headers` file into each export. Keep host-injected analytics and automatic scripts OFF on the tools project. Do not enable SPA fallback; nonexistent paths must use `404.html` with a 404 response.

The generated CSP hashes Next inline script contents on each page. There is no `unsafe-eval` or remotely hosted script permission. Emotion and inline layout controls require `style-src 'unsafe-inline'`; this is a documented styling constraint, not a script exception. Validate the deployed CSP, loaded chunks, fonts, imports, downloads, and print paths. Development mode needs WebSocket/dev exceptions; the production headers apply only to exported files.

## Generic static hosting / Caddy

Use the corresponding public and private output directories as each origin's document root. Apply the generated `_headers` rules using your host's equivalent mechanism; Caddy does not automatically parse Cloudflare's file format. Serve directory `index.html` normally and a 404 for nonexistent paths. Configure HTTPS, HSTS after validating the hostname setup, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, frame restrictions, and private `X-Robots-Tag: noindex, nofollow`. Do not create a shared parent-domain cookie.

## SEO handover

Unique page metadata, canonical URLs, crawlable navigation, Organization / WebApplication / Article / BreadcrumbList data, sitemap and robots output are included. Configure a real social preview image before launch if desired. Submit the public sitemap in the owner's Search Console property. Search engines choose whether and how to show sitelinks; no implementation can guarantee sitelinks or rankings.

## Launch decisions

Choose and configure the real domains and hosting. Supply business identity, support address and retention information. Verify production security headers and two-origin boundary. Ads are disabled and there is no ads.txt publisher entry. A real publisher account, appropriate certified consent integration, and disclosure review are separate owner setup steps if monetization is later enabled.
