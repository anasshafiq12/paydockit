# PayDockit SEO and AI-search audit

Audit date: 30 October 2026. Site: https://www.paydockit.com/. Scope: live public-page crawl, source review, browser rendering at desktop and mobile widths, and implementation/regression testing. Uses the installed seo-audit and ai-seo skills, with current official guidance taking precedence where the skill text is outdated.

## Audience, tools and search intent

PayDockit is a free browser-based business-document and stamp toolkit, rather than a statutory payroll processor. Its audience includes small employers, HR administrators, payroll staff, bookkeepers, and business owners. Employees can learn which document to request, but employment and salary statements must come from an authorized issuer. Stamp customers need a digital design; PayDockit does not manufacture rubber stamps.

The primary conversion is opening the relevant editor, completing truthful inputs and exporting a usable file. A payslip, an employment certificate, a salary certificate and a company stamp serve different tasks and should not share interchangeable landing-page descriptions.

## Recommended query ownership

These are relevance-based keyword priorities and wording candidates, not measured keyword volumes, difficulty scores or current rankings. Limited search-result samples and the implemented feature set support the intent distinctions; Search Console and keyword-planning data should refine their order by country and actual demand. No single keyword can optimize every category.

| Owning page | Primary intent/query | Natural secondary terms | Audience/task |
|---|---|---|---|
| `/` | Free business document and stamp generators | payslips, certificates, company stamps, salary calculators | Discover the right category |
| `/tools/salary-slip/` | Free salary slip generator | payslip generator, salary slip PDF, editable payslip Word, payslip format | Employers and bookkeepers recording a pay period |
| `/tools/employment-certificate/` | Employment certificate generator | employment confirmation letter, proof of employment letter, experience letter | HR confirming current or former employment |
| `/tools/salary-certificate/` | Salary certificate generator | salary certificate format, salary certificate PDF/Word, gross or net salary statement | Authorized compensation confirmation |
| `/tools/stamp-maker/` | Free online stamp maker | company stamp generator, digital company stamp, transparent stamp PNG, stamp SVG | Business/office staff designing an authorized stamp graphic |
| `/templates/` | Salary slip and certificate templates | payslip template, employment certificate template, salary certificate format | Compare and choose a layout |
| `/calculators/salary-converter/` | Hourly to monthly salary calculator | hourly to annual salary, average monthly pay | Convert pay frequency assumptions |
| `/calculators/salary-increase/` | Salary increase percentage calculator | pay rise calculator, salary after percentage raise | Calculate a raise |
| `/calculators/overtime/` | Overtime pay calculator | overtime hours, chosen overtime multiplier | Arithmetic using the user's applicable policy |
| `/calculators/unpaid-leave/` | Unpaid leave deduction calculator | unpaid days salary deduction, day divisor | Calculate a stated leave deduction |
| `/calculators/amount-to-words/` | Amount to words converter | money amount in English words | Express a monetary amount in words |
| `/calculators/gross-to-net/` | Gross to net calculator with manual deductions | net wages, reimbursements, cash payable | Manual arithmetic, not automatic country tax |

Keep synonyms on the owning page instead of creating near-duplicate doorway pages for every phrasing. Do not target government authentication, notary certification, guaranteed bank/visa approval, reviewed bilingual exports or country tax compliance as capabilities. Country and language pages should wait until the content and product support are real.

## Baseline evidence

- All 26 original sitemap URLs returned HTTP 200, with unique titles, one H1, self-canonicals on the custom domain, and indexable public content.
- The crawl checked 76 internal targets; it found no broken links and no orphan sitemap pages. Robots allowed crawling and referenced the correct sitemap. Unknown routes returned a real 404.
- Browser rendering confirmed Organization JSON-LD on the home page and WebApplication/BreadcrumbList on tool pages. JSON-LD was parsed in the DOM, not inferred absent from a text fetch.
- Seven workspaces are intentionally noindex; their indexable `/tools/.../` landing pages explain the products. This separation is retained. Robots does not block the workspaces from being crawled and reading noindex.
- The public pages have no executable script sources after export optimization. Home HTML was about 18.9 KB and the templates page about 54.1 KB before changes. These are payload sizes, not Core Web Vitals or speed scores.
- Home, stamp and salary-slip landing pages had no page-level horizontal overflow at 390×844 and desktop 1280px. However, mobile primary navigation was hidden without a replacement, and some secondary links had small hit areas.
- Source and live content disagreed: stamp users saw payroll examples and A4/Letter document features; DOCX exports existed but `/scope/` said DOCX was deferred. A “MOST POPULAR” badge had no supporting usage evidence.

Detailed baseline: `docs/qa/seo-baseline-2026-10-30.json`.

## Prioritized findings and implementation

| Impact | Effort | Finding | Action/status |
|---|---|---|---|
| High | Low–medium | Generic tool descriptions and wrong stamp examples fail distinct user intents | Implemented category-specific definitions, required inputs, users, export formats, fictional examples, FAQs and relevant links for all four tools |
| High | Low | Product claims contradict actual exports | Corrected scope; document pages explain PDF/DOCX/print/JSON; stamp page explains PNG/SVG and physical-service limits |
| High | Owner input | Prelaunch contact/accountability placeholders on a live site | Owner supplied PayDockit and info@paydockit.com; added real contact links and updated About, Contact, Privacy, Terms and Editorial Policy without inventing credentials |
| Medium | Low | Homepage does not clearly name multiple tool categories | Updated title, H1 and introductory audience copy; exposed all six calculators; replaced unsupported popularity badge with factual PDF + Word label |
| Medium | Low | Mobile category navigation disappears | Added native keyboard-accessible Tools & guides menu with all categories; increased mobile/footer link hit areas; keeps public pages free of client JavaScript |
| Medium | Low | Hashed static assets revalidate on repeat visits | Added one-year immutable caching only under `/_next/static/`; editor HTML retains no-store |
| Medium | Low | Sitemap uses one stale lastmod for every page | Removed untracked lastmod values rather than inventing modification dates; added the new stamp guide automatically |
| Medium | Medium | Guides lack task-specific next steps and stamp coverage | Added PNG-versus-SVG stamp guide; added employment-document comparison table; linked each guide to a relevant action; calculator pages now explain formulas and assumptions |
| Low | Low | `/index.html` aliases serve duplicate URLs | Added permanent redirects to each slash canonical, including the home page |
| Low | Low | Reused social metadata and large-image card without a share image | Tool/guide social titles and descriptions reflect their content; generic card switched to summary. Custom share artwork remains optional |

No high-impact crawl blocker was found. Rankings are not measured by this audit and no ranking result is promised.

## AI-answer usefulness and current platform guidance

The improvements publish clear definitions, concrete input/output explanations, worked examples, a comparison table and useful FAQs for people. They also make product facts less ambiguous when a search system retrieves a passage. The stamp guide answers a real selection question: transparent 1,200-pixel PNG versus scalable SVG with editable text, physical dimensions, font substitution and final-size checks.

Google's current guidance says useful people-first content and core SEO remain the foundation; special AI files, artificial chunking, or special schema are not required. No `llms.txt`, thin keyword variations, fabricated reviews, invented statistics, ratings, expert identities or automatic “freshness” dates were added. Visible FAQs were added for usability, without claiming FAQ rich-result eligibility.

Important documentation correction: the installed ai-seo skill says there is no dedicated Google AI report. The current Google guide and Search Console help now describe a Generative AI performance report, with worldwide rollout noted as 31 August 2026. Use that current documentation; report visibility/data for this property was not accessed. Google notes that insufficient impressions can explain a missing report.

The existing wildcard-allow robots policy permits search discovery; no redundant user-agent allowlist was added. OpenAI documents OAI-SearchBot search discovery separately from GPTBot training. Search eligibility does not guarantee that an assistant will cite or recommend the product. No repeated cross-platform citation measurement was performed, so there is no claimed AI visibility rate.

## Validation and limits

- `npm run typecheck`, the production Vercel build, and all 153 existing tests passed during implementation.
- `npm run audit:seo` validates generated routes/HTML: 27 sitemap pages, unique titles/descriptions, one H1, self-canonicals, JSON-LD parsing, crawlable links, seven noindex/no-store workspaces, no old hosting URLs, zero public executable script sources, real 404s, immutable hashed-asset caching and canonical alias redirects.
- Mobile browser checks confirmed the new menu exposes all tool categories with 44px menu links. Home, stamp landing and new stamp guide had no page-level horizontal overflow at 390×844; rendered structured data remained valid.
- The official PageSpeed Insights mobile API returned HTTP 429 (quota exhausted). No Lighthouse score, LCP/INP/CLS pass, field performance uplift, or ranking improvement is claimed. Use PageSpeed Insights and Search Console field data when available.
- Latest generated evidence: `docs/qa/seo-after-2026-10-30.json`. Production HTTP/browser checks should confirm deployment routing and headers after release.

## Work requiring accounts or further owner decisions

1. Search Console: confirm ownership, sitemap processing, Page Indexing, URL Inspection/Google-selected canonical, query clicks/impressions/CTR and country/device splits. The uploaded verification file is not evidence that account verification or indexing has completed.
2. Search Console: check Generative AI performance if the property has sufficient impressions; also review normal Search Performance. Inspect field Core Web Vitals when enough data exists.
3. Keyword Planner or a licensed keyword tool: measure demand and competition by the markets that actually use PayDockit. This audit cannot call any keyword “highest volume” or “best ranking.”
4. Bing Webmaster Tools: verify the site and review its crawl/search data. No connected Bing data was available.
5. Owner: confirm the supplied support mailbox is monitored, review legal/privacy wording, document provider retention details and obtain qualified review before publishing jurisdiction-specific payroll advice.
6. Authority: earn relevant independent mentions through useful original product examples, maintained resources and real outreach. Do not buy/fabricate endorsements. No backlink or reputation score was measured.

Suggested measurement cycle: record a dated pre-change account baseline; review indexing first, then compare query/page impressions, clicks and CTR over comparable periods while noting seasonality and site age. Track each tool family separately. Run a small fixed set of AI discovery questions repeatedly across platforms and record sample sizes and actual citations; a single answer is not a visibility measurement.

## Official sources checked

- [Google generative AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Search Console Generative AI performance report](https://support.google.com/webmasters/answer/16984139)
- [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google noindex and crawlability](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google sitemap and lastmod guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Google crawlable links and anchor text](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google FAQ/HowTo rich-result changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [OpenAI crawler purposes](https://developers.openai.com/api/docs/bots)
- [Vercel Cache-Control](https://vercel.com/docs/caching/cache-control-headers)
- [Vercel Build Output API routing](https://vercel.com/docs/build-output-api/configuration)
- [MDN SVG format reference](https://developer.mozilla.org/en-US/docs/Web/SVG)
