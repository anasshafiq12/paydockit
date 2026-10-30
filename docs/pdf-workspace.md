# Client-side PDF workspace

Implemented 30 October 2026. Open `/pdf-editor/` (or `/stamp-pdf/`); the public explanation is `/tools/pdf-editor/`.

## Included

- Open a local PDF, drag/drop, or load a fictional two-page sample.
- Quick company and dated office-status stamps; reuse a saved stamp or transfer a design from the stamp studio.
- Add text, raster images and signature pictures, highlights, rectangles and freehand drawings.
- Select/drag additions and adjust position, dimensions, rotation, opacity and color; duplicate and bring to front.
- Optional white-paper cleanup for an uploaded stamp/signature image.
- Rotate, reorder and remove pages, append another PDF, and undo/redo (30 snapshots).
- Export a separate PDF. Original content is copied; additions are flattened as a transparent raster overlay per edited page.
- Responsive layout, explicit field labels, keyboard text placement and arrow-key movement, visible progress/errors and an unsaved-session closing warning.

## Architecture

PDF.js renders pages in a local worker; pdf-lib copies original pages and adds overlays in the crop box's coordinate system, compensating for page rotation. Both libraries load only with the PDF workspace. `scripts/prepare-pdf.mjs` copies the pinned PDF.js worker, CMaps, fonts and decoders into the static export before build/dev. No CDN or remote document conversion is used. Vercel packaging includes those assets and both editor routes with noindex/no-store headers. The PDF workspace contains no AdSense tag or file-upload API.

Documents are kept in memory, not automatically persisted. Limits: 25 MB/file, 60 MB total and 150 pages. Page rendering and overlay export have pixel bounds. Images use the existing validated raster importer. Encrypted files are rejected; they must be unlocked in the original application first.

This is an annotation and page-organization editor. It does not replace existing text, perform OCR, provide secure redaction or create cryptographic signatures. Existing digital signatures can be invalidated by modifications; complex PDF features/forms require reviewing the downloaded copy.

## Verification

- TypeScript and the full 157-test suite passed, including crop/rotation mapping, four-turn annotation geometry, multi-source page copying/reordering and invalid-input rejection.
- Production static build completed; SEO regression checked 28 public pages and 9 private workspace routes with zero failures.
- Browser opened a sample, placed a company stamp and downloaded an edited two-page PDF. The downloaded file retained original text and contained the stamp overlay; its rendered page was visually checked.
- Browser merged the supplied nine-page research document into the two-page sample, producing an 11-page workspace. Keyboard text placement and page rotation were exercised.
- Production static export with generated CSP rendered the sample without console errors. A 390 px viewport was inspected, with zoom and a properties panel below the preview.

The other roadmap features (Excel payroll exports, salary revision letters, timesheets and other document categories) remain separate future work. This change implements the requested PDF-first workflow plus closely related stamp cleanup/status controls.
