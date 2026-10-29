import Decimal from 'decimal.js';
import { z } from 'zod';
import {templateIds} from '../documents/templates';
import {stampSettingsSchema,defaultStampSettings} from '../stamps/schema';

Decimal.set({ precision: 32, rounding: Decimal.ROUND_HALF_UP });
export const amountSchema = z.string().regex(/^\d{1,12}(\.\d{1,4})?$/, 'Enter a nonnegative amount with up to four decimal places.');
const text = z.string().max(2000);
export const lineSchema = z.object({ id: text, label: z.string().min(1).max(100), translated: text.default(''), amount: amountSchema, category: z.enum(['earning','deduction','reimbursement','employer-contribution']), taxable: z.boolean().default(false) });
export const snapshotSchema=z.object({kind:z.literal('user-custom'),name:z.string().max(100),version:z.string().max(40),profileJson:z.string().max(200000),income:amountSchema,tax:amountSchema,contribution:amountSchema,effectiveDate:z.string()});
export type PayLine = z.infer<typeof lineSchema>;
export const documentSchema = z.object({
  schemaVersion: z.literal(1), kind: z.enum(['payslip','employment-certificate','salary-certificate']), sample: z.boolean(),
  company: text, address: text, contact: text, registration: text, employee: text, employeeId: text, title: text, department: text,
  translatedCompany: text, translatedEmployee: text, translatedTitle: text, translatedAddress: text,
  startDate: z.string(), endDate: z.string(), periodStart: z.string(), periodEnd: z.string(), paymentDate: z.string(), issueDate: z.string(), reference: text,
  currency: z.enum(['USD','GBP','CAD','AUD','INR','PKR','SAR','AED','EUR','JPY','KWD']), preset: text,
  basis: z.enum(['salary','hourly']), basic: amountSchema, hours: amountSchema, rate: amountSchema, lines: z.array(lineSchema).max(100),
  paidDays: amountSchema, unpaidDays: amountSchema, ytd: amountSchema,
  employmentType: text, status: z.enum(['current','former','experience']), addressee: text, purpose: text, duties: text, includeSalary: z.boolean(), salaryFrequency: z.enum(['monthly','annual']), salaryDesignation: z.enum(['gross','net']), signer: text, signerTitle: text, notes: text,
  template: z.enum(templateIds), paper: z.enum(['A4','Letter']), language: z.enum(['en','en-ar','en-ur','ar','ur']),
  logo: z.string().max(8000000), signature: z.string().max(8000000), calculationSnapshot:snapshotSchema.optional(), ...stampSettingsSchema.shape,
});
export type PayrollDocument = z.infer<typeof documentSchema>;
export const currencies = ['USD','GBP','CAD','AUD','INR','PKR','SAR','AED','EUR','JPY','KWD'] as const;
export const presets: Record<string,{name:string;currency:PayrollDocument['currency'];paper:'A4'|'Letter'}> = {
  general:{name:'General',currency:'USD',paper:'A4'},us:{name:'United States',currency:'USD',paper:'Letter'},uk:{name:'United Kingdom',currency:'GBP',paper:'A4'},ca:{name:'Canada',currency:'CAD',paper:'Letter'},au:{name:'Australia',currency:'AUD',paper:'A4'},in:{name:'India',currency:'INR',paper:'A4'},pk:{name:'Pakistan',currency:'PKR',paper:'A4'},sa:{name:'Saudi Arabia',currency:'SAR',paper:'A4'},ae:{name:'United Arab Emirates',currency:'AED',paper:'A4'},
};
export const today = () => new Date().toLocaleDateString('en-CA');
export function blankDocument(kind:PayrollDocument['kind']='payslip'):PayrollDocument {
  const date = today();
  return {...defaultStampSettings,stampTemplate:"corporate-round",stampLayout:"curved",schemaVersion:1,kind,sample:false,company:'',address:'',contact:'',registration:'',employee:'',employeeId:'',title:'',department:'',translatedCompany:'',translatedEmployee:'',translatedTitle:'',translatedAddress:'',startDate:'',endDate:'',periodStart:date.slice(0,7)+'-01',periodEnd:date,paymentDate:date,issueDate:date,reference:'',currency:'USD',preset:'general',basis:'salary',basic:'0',hours:'0',rate:'0',lines:[],paidDays:'0',unpaidDays:'0',ytd:'0',employmentType:'Full-time',status:'current',addressee:'To whom it may concern',purpose:'',duties:'',includeSalary:false,salaryFrequency:'monthly',salaryDesignation:'gross',signer:'',signerTitle:'Human Resources',notes:'',template:'classic',paper:'A4',language:'en',logo:'',signature:'',stampEnabled:false,stampText:'',stampSubtext:'AUTHORIZED BUSINESS',stampColor:'#1d4ed8',stampShape:'circle',stampWidth:38,stampX:145,stampY:210,stampRotation:-12,stampOpacity:.85};
}
export function sampleDocument(kind:PayrollDocument['kind']='payslip'):PayrollDocument {
  return {...blankDocument(kind),sample:true,company:'Acme Studio',address:'24 Maple Avenue, Springfield',contact:'hr@example.com',employee:'Alex Morgan',employeeId:'EMP-042',title:'Product Designer',department:'Design',startDate:'2024-03-04',basic:'4800',paidDays:'22',signer:'Jamie Parker',signerTitle:'People Operations Manager',stampText:'ACME STUDIO',lines:[{id:'housing',label:'Housing allowance',translated:'',amount:'600',category:'earning',taxable:false},{id:'transport',label:'Transport allowance',translated:'',amount:'200',category:'earning',taxable:false},{id:'tax',label:'Manual withholding',translated:'',amount:'420',category:'deduction',taxable:false},{id:'insurance',label:'Health insurance',translated:'',amount:'80',category:'deduction',taxable:false}]};
}
export const dec = (s:string|number) => new Decimal(s);
export function precision(currency:string) { return currency==='JPY'?0:currency==='KWD'?3:2; }
export function money(value:string|Decimal,currency='USD') { return `${currency} ${new Intl.NumberFormat('en-US',{minimumFractionDigits:precision(currency),maximumFractionDigits:precision(currency)}).format(Number(value.toString()))}`; }
export function totals(doc:PayrollDocument) {
  const base=doc.basis==='hourly'?dec(doc.hours||'0').times(doc.rate||'0'):dec(doc.basic||'0');
  const sum=(category:PayLine['category'])=>doc.lines.filter(l=>l.category===category).reduce((s,l)=>s.plus(l.amount||'0'),dec(0));
  const gross=base.plus(sum('earning')), deductions=sum('deduction'), net=gross.minus(deductions), reimbursements=sum('reimbursement');
  return {base,gross,deductions,net,reimbursements,cash:net.plus(reimbursements),employer:sum('employer-contribution')};
}
export function issues(doc:PayrollDocument):string[] {
  const result:string[]=[];
  const parsed=documentSchema.safeParse(doc);
  if(!parsed.success) result.push(...parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`));
  for(const key of ['periodStart','periodEnd','paymentDate','issueDate','startDate','endDate'] as const){const value=doc[key];if(value&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value+'T00:00:00Z'))||new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value))result.push(`${key}: Enter a valid calendar date.`);}
  if(!doc.company.trim())result.push('Company name is required.');
  if(!doc.employee.trim())result.push('Employee name is required.');
  if(doc.kind==='payslip') {
    if(!doc.periodStart||!doc.periodEnd)result.push('Both pay period dates are required.');
    if(doc.periodEnd<doc.periodStart)result.push('Pay period end must be on or after its start.');
    if(!doc.paymentDate)result.push('Payment date is required.');
  } else {
    if(!doc.title.trim())result.push('Job title is required.');
    if(!doc.startDate)result.push('Employment start date is required.');
    if(!doc.issueDate)result.push('Issue date is required.');
    if(!doc.signer.trim()&&!doc.signerTitle.trim())result.push('A signer name or department is required.');
    if(doc.status!=='current'&&!doc.endDate)result.push('Former employment requires an end date.');
    if(doc.endDate&&doc.endDate<doc.startDate)result.push('Employment end must follow the start date.');
  }
  if(doc.language!=='en'&&(!doc.translatedCompany||!doc.translatedEmployee||!doc.translatedTitle))result.push('Complete translated company name, employee name and job title.');
  if(parsed.success&&totals(doc).net.isNegative())result.push('Deductions exceed gross earnings.');
  return [...new Set(result)];
}
export function dateLabel(s:string) { return s?new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'—'; }
export function certificateParagraph(doc:PayrollDocument) {
  const tenure=`from ${dateLabel(doc.startDate)} to ${doc.status==='current'?'Present':dateLabel(doc.endDate)}`;
  let body=`This is to confirm that ${doc.employee||'[Employee name]'} ${doc.status==='current'?'is employed':'was employed'} by ${doc.company||'[Company name]'} as ${doc.title||'[Job title]'} on a ${doc.employmentType.toLowerCase()} basis, ${tenure}.`;
  if(doc.kind==='salary-certificate'||doc.includeSalary) { const t=totals(doc); const v=doc.salaryDesignation==='net'?t.net:t.gross; body+=` The ${doc.salaryFrequency} ${doc.salaryDesignation} salary is ${money(doc.salaryFrequency==='annual'?v.times(12):v,doc.currency)}.`; }
  if(doc.duties)body+=` ${doc.duties}`;
  if(doc.purpose)body+=` This certificate is issued for ${doc.purpose}.`;
  return body;
}
export function safeParseProject(raw:string) {
  if(raw.length>10*1024*1024)throw new Error('Project exceeds 10 MB.');
  const object=JSON.parse(raw,(key,value)=>{if(['__proto__','prototype','constructor'].includes(key))throw new Error('Unsafe project key.');return value;});
  const doc=documentSchema.parse(object);
  for(const asset of [doc.logo,doc.signature])if(asset&&!/^data:image\/(png|jpeg|webp);base64,/.test(asset))throw new Error('Project image must be a local raster image.');
  return doc;
}
export function words(n:number):string {
  if(!Number.isSafeInteger(n)||n<0||n>999999999999)return 'Amount outside supported range';
  const ones=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  if(n<20)return ones[n];if(n<100)return tens[Math.floor(n/10)]+(n%10?'-'+ones[n%10]:'');
  if(n<1000)return ones[Math.floor(n/100)]+' hundred'+(n%100?' '+words(n%100):'');
  for(const [value,label] of [[1e9,'billion'],[1e6,'million'],[1000,'thousand']] as const)if(n>=value)return words(Math.floor(n/value))+' '+label+(n%value?' '+words(n%value):'');
  return '';
}
export function amountWords(value:string,currency:string) {const n=dec(value).toDecimalPlaces(precision(currency));const divisor=10**precision(currency);return `${words(n.floor().toNumber())} ${currency}${n.mod(1).isZero()?'':` and ${n.mod(1).times(divisor).round()} / ${divisor}`}`;}
