# Privacy and data map

| Data | Default location | Persistence | Egress |
|---|---|---|---|
| Employer, employee, dates, salary lines | React memory on tools origin | Until navigation/refresh | No application network endpoint |
| Logo and authorized signature | Re-encoded local data URL | Memory; included if project/draft saved | None during editing/export |
| Draft | Tools-origin localStorage, explicit save | 30 days; expired on access | None |
| Employer profile | Separate tools-origin localStorage record, explicit remember | 30 days; expired on access | None |
| Stamp / tax profile | Tools-origin localStorage, explicit save | 30 days; expired on access | None |
| Calculator-to-payslip amounts | Tools-origin one-use sessionStorage record | Removed by receiving editor | None |
| Downloaded project, PDF, SVG, PNG, ZIP | User-selected Downloads directory | User controls deletion | App cannot delete or recall |
| Public/editor asset requests | Static hosting | Hosting-provider access-log policy | Ordinary HTTP access metadata |
| Contact submissions | Not implemented | None | None |

LocalStorage was used for the bounded opt-in initial implementation rather than IndexedDB. Large embedded images may exceed browser quotas. The UI reports storage failure and offers JSON export. It is not encrypted. Shared-device exposure is disclosed. Clear local data removes all keys with the application's namespace. No private export cache or service worker exists.

The calculator handoff is same-origin sessionStorage only and never uses a URL. It is removed when consumed by the editor. Custom estimates retain their original profile snapshot in the document project without automatic recalculation.

No entered values are logged or transmitted by application code. A full browser network capture including offline/error paths, all file inputs, storage inspection, and malicious-import tests remains on the release checklist. Do not claim that hosting providers collect no data.

