export const batchLimits={fileMB:5,rows:100} as const;
export const batchTitle='Bulk Payslip Generator from CSV | Free PDF ZIP';
export const batchDescription='Create up to 100 payslip PDFs from a CSV in your browser. Map columns, review row errors and download a ZIP with a status manifest. Free, no document upload.';
export const batchFields=[
 ['company','Employer name','Required; use the verified employer name.'],
 ['employee','Employee name','Required; one employee record per row.'],
 ['title','Job title','Optional in the payslip workflow.'],
 ['basic','Basic pay','A plain nonnegative amount, such as 4800. Enter the amount for the period; no automatic proration is applied.'],
 ['deductions','Manual deductions','A nonnegative amount; defaults to 0 when blank. It cannot exceed gross pay.'],
 ['reimbursements','Nonwage reimbursement','A nonnegative amount; defaults to 0. Added to net wages to calculate cash payable.'],
 ['currency','Currency code','Use a valid three-letter currency code such as USD or GBP; blank defaults to USD. No exchange-rate conversion.'],
 ['periodStart','Period start','Required, YYYY-MM-DD.'],
 ['periodEnd','Period end','Required, YYYY-MM-DD; cannot precede the start.'],
 ['paymentDate','Payment date','Required, YYYY-MM-DD.'],
] as const;
