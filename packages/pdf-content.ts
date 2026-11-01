// These limits are enforced in the editor and described on the public page.
export const pdfLimits={fileMB:25,totalMB:60,pages:150} as const;
export const pdfTitle='Free PDF Editor & PDF Stamp Tool';
export const pdfDescription='Stamp PDFs, add text and highlights, and merge or arrange pages in your browser. Free PDF editor with no uploads or signup; download an edited copy.';
export const pdfDefinition='PayDockit’s free PDF editor adds stamps, text, images and annotations to an existing PDF, and lets you rotate, reorder, remove or merge pages. Files are processed in your browser, without document uploads. It creates an edited copy; it does not replace original PDF text or securely redact information.';
export const pdfFeatures=[
 'Add company stamps and signature pictures',
 'Add text, images, highlights, rectangles and drawings',
 'Move, resize, rotate and adjust the opacity of additions',
 'Apply a stamp image to one page or every page',
 'Rotate, reorder, remove and merge PDF pages',
 'Undo and redo edits; download a separate PDF copy',
] as const;
export const pdfQuestions=[
 ['How do I add a company stamp to a PDF?','Open a PDF in PayDockit, choose Stamp, and create a quick company or dated status stamp. You can also use a saved studio design or upload your own PNG, JPEG or WebP image. Place it, review its size and position, then download the edited PDF.'],
 ['Can I put the same stamp on every page?','Yes. Select the stamp image and choose Apply image to all pages. Review the placement on pages with different sizes or orientations before downloading. Undo restores the previous state.'],
 ['Can I edit or remove the original PDF text?','No. PayDockit adds new content over the original page. It does not replace existing words, perform OCR or securely remove underlying information. Covering text with an image or shape is not redaction.'],
 ['Does PayDockit upload my PDF or save it automatically?','No document upload or server-side conversion is used. The PDF workspace keeps files and edits in browser memory, without automatically saving them. Download your edited copy before closing the tab. Public information pages may load advertising; the PDF workspace contains no advertising script.'],
 ['Can I convert a PDF to Word or create a digital signature?','This workspace exports an edited PDF, not a Word conversion. A stamp or signature picture is a visual addition, not a certificate-based digital signature. Editing an already signed PDF may invalidate its digital signatures.'],
] as const;
