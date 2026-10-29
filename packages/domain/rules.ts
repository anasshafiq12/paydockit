import {z} from 'zod';
import Decimal from 'decimal.js';
import {dec,amountSchema} from './index';
const numeric=z.string().regex(/^\d{1,12}(\.\d{1,4})?$/);
export const ruleSchema=z.object({schemaVersion:z.literal(1),name:z.string().min(1).max(100),version:z.string().min(1).max(40),country:z.string().max(100),effectiveFrom:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),effectiveTo:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),yearLabel:z.string().max(100),frequency:z.enum(['monthly','annual']),currency:z.string().regex(/^[A-Z]{3}$/),precision:z.number().int().min(0).max(3),mode:z.enum(['progressive','base-marginal']),allowance:numeric,contributionRate:numeric,contributionCap:numeric,source:z.string().max(1000),bands:z.array(z.object({lower:numeric,upper:numeric.nullable(),rate:numeric,base:numeric})).min(1).max(50)});
export type RulePack=z.infer<typeof ruleSchema>;
export const exampleRule:RulePack={schemaVersion:1,name:'My custom tax profile',version:'1.0',country:'',effectiveFrom:'2026-01-01',effectiveTo:'2026-12-31',yearLabel:'2026',frequency:'monthly',currency:'USD',precision:2,mode:'progressive',allowance:'0',contributionRate:'0',contributionCap:'0',source:'',bands:[{lower:'0',upper:'1000',rate:'0',base:'0'},{lower:'1000',upper:'2000',rate:'10',base:'0'},{lower:'2000',upper:null,rate:'20',base:'100'}]};
export function validateRule(input:unknown):RulePack {
  const p=ruleSchema.parse(input);
  if(p.effectiveTo<p.effectiveFrom)throw new Error('Effective end date must follow the start.');
  if(dec(p.contributionRate).gt(100))throw new Error('Contribution rate cannot exceed 100%.');
  p.bands.forEach((b,i)=>{if(dec(b.rate).gt(100))throw new Error('Rates must be between 0 and 100%.');if(i===0&&!dec(b.lower).isZero())throw new Error('First bracket must start at zero.');if(i&&p.bands[i-1].upper!==b.lower)throw new Error('Brackets must be contiguous and ordered.');if(b.upper!==null&&dec(b.upper).lte(b.lower))throw new Error('Bracket upper bound must exceed lower bound.');if(b.upper===null&&i!==p.bands.length-1)throw new Error('Only the final bracket can be unlimited.');});
  if(p.bands.at(-1)?.upper!==null)throw new Error('Final bracket must have an unlimited upper bound.');
  return p;
}
export function calculateRule(input:RulePack,income:string,date:string) {
  const p=validateRule(input);if(date<p.effectiveFrom||date>p.effectiveTo)throw new Error('Calculation date is outside this profile’s effective period.');
  amountSchema.parse(income);
  const gross=dec(income);if(gross.isNegative()||!gross.isFinite())throw new Error('Enter a nonnegative income.');
  const taxable=Decimal.max(0,gross.minus(p.allowance));
  const slices=p.bands.map(b=>({ ...b,width:Decimal.max(0,(b.upper===null?taxable:DecimalMin(taxable,dec(b.upper))).minus(b.lower)) }));
  const band=p.bands.find(b=>taxable.gte(b.lower)&&(b.upper===null||taxable.lt(b.upper)))!;
  const tax=(p.mode==='progressive'?slices.reduce((sum,b)=>sum.plus(b.width.times(b.rate).div(100)),dec(0)):dec(band.base).plus(taxable.minus(band.lower).times(band.rate).div(100))).toDecimalPlaces(p.precision);
  const contribution=(dec(p.contributionCap).gt(0)?DecimalMin(gross,dec(p.contributionCap)):gross).times(p.contributionRate).div(100).toDecimalPlaces(p.precision);
  return {taxable,tax,contribution,net:gross.minus(tax).minus(contribution),slices};
}
const DecimalMin=(a:ReturnType<typeof dec>,b:ReturnType<typeof dec>)=>a.lt(b)?a:b;
