# Source register

The supplied product specification is retained in `docs/product-specification.md`. Its research register is background material rather than a command to enable country tax rules or publish unsupported compliance claims.

Implementation references checked 29 October 2026:

- Next.js bundled `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`: static HTML export and deployment behavior. Online reference: https://nextjs.org/docs/app/guides/static-exports
- Next.js bundled `01-app/02-guides/lazy-loading.md`: client dynamic imports and server-component split limitations.
- Material UI official integration: https://mui.com/material-ui/integrations/nextjs/ — App Router cache provider.
- Next.js metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- GOV.UK payslip guidance (linked as further reading, not treated as global compliance requirements): https://www.gov.uk/payslips

Installed exact framework baseline: Next.js 16.4.3, React 19.3.1, Material UI 9.5.0, jsPDF 4.2.1. npm lockfile captures the complete reproducible dependency graph. Noto Naskh Arabic and Noto Nastaliq Urdu are self-hosted via Fontsource 5.3.0 under the fonts' SIL Open Font License; license text accompanies the installed packages. Other dependencies retain their package licenses. Do not claim a separate legal license audit.

## Content workflow

Content data lives in `packages/content.ts`; policy content lives in the public catch-all page. Add an original worked example, explicit scope, named accountable author/team, actual dates, review status, related tool and correction route. Do not invent expert credentials. Resolve source accuracy and arrange qualified review before jurisdiction-specific financial/legal publication. A substantive date should change only after real editorial work. The current six project-team drafts disclose pending independent review.
