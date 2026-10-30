import {z} from 'zod';
export const defaultLabels={letterhead:'COMPANY LETTERHEAD',employee:'EMPLOYEE',jobTitle:'Job title',employeeId:'Employee ID',department:'Department',payPeriod:'PAY PERIOD',paymentDate:'Payment date',paidDays:'Paid days',unpaidDays:'Unpaid days',hours:'Hours',hourlyRate:'Rate',earnings:'Earnings & adjustments',amount:'Amount',basic:'Basic pay',hourly:'Hourly earnings',gross:'Gross earnings',deductions:'Total employee deductions',deduction:'Deduction',net:'Net wages',reimbursement:'Reimbursement',cash:'Cash payable',contributions:'Employer contributions (separate from net wages)',ytdOpening:'YTD opening gross',ytdClosing:'Closing gross',salaryBreakdown:'Monthly compensation breakdown',monthlySalary:'Monthly {designation} salary',signer:'Authorized signatory',page:'Page'};
export type LabelKey=keyof typeof defaultLabels;
const labels=z.object(Object.fromEntries(Object.entries(defaultLabels).map(([k,v])=>[k,z.string().max(180).default(v)])) as {[K in LabelKey]:z.ZodDefault<z.ZodString>});
export const defaultVisibility={header:true,address:true,contact:true,registration:true,reference:true,issueDate:true,employeeId:true,department:true,jobTitle:true,payPeriod:true,paymentDate:true,days:true,amountWords:true,signer:true,signatureLine:true,footer:true,footerIdentity:true,footerNote:true,footerReference:true,pageNumbers:true,salaryBreakdown:true,verification:true,logo:true,gross:true,deductions:true,net:true,reimbursements:true,cash:true,contributions:true,ytd:true};
export type VisibilityKey=keyof typeof defaultVisibility;
const visibility=z.object(Object.fromEntries(Object.keys(defaultVisibility).map(k=>[k,z.boolean().default(true)])) as {[K in VisibilityKey]:z.ZodDefault<z.ZodBoolean>});
const short=z.string().max(2000).default('');
export const customizationSchema=z.object({
 documentTitle:short,referenceFallback:z.string().max(120).default('DOCUMENT'),subject:short,certificateText:z.string().max(16000).default(''),verificationText:short,amountWordsText:short,footerCompany:short,footerContact:short,footerNote:short,footerReference:short,
 labels:labels.default(()=>({...defaultLabels})),show:visibility.default(()=>({...defaultVisibility})),
 font:z.enum(['template','sans','serif','mono']).default('template'),fontSize:z.number().min(8).max(14).default(10),accent:z.string().regex(/^(#[a-fA-F0-9]{6})?$/).default(''),textColor:z.string().regex(/^(#[a-fA-F0-9]{6})?$/).default(''),logoWidth:z.number().min(10).max(55).default(28),logoAlign:z.enum(['left','center','right']).default('left'),
 currencyDisplay:z.string().max(24).default(''),currencyDecimals:z.number().int().min(0).max(8).nullable().default(null),currencyPosition:z.enum(['before','after']).default('before'),dateFormat:z.enum(['long','iso','us','uk']).default('long'),
 fields:z.array(z.object({id:z.string().max(100),label:z.string().max(100),value:z.string().max(2000),section:z.enum(['header','employee','body','footer'])})).max(24).default([]),
});
export type DocumentCustomization=z.infer<typeof customizationSchema>;
export const defaultCustomization=()=>customizationSchema.parse({});
