import {describe,it,expect} from 'vitest';
import {blankDocument,sampleDocument,totals,safeParseProject,amountSchema,issues,amountWords} from '../packages/domain';
import {calculateRule,exampleRule,validateRule} from '../packages/domain/rules';
describe('canonical payroll arithmetic',()=>{
 it('reconciles independent wage and reimbursement fixture',()=>{const d=blankDocument();d.basic='100000';d.lines=[{id:'1',label:'Deduction',translated:'',amount:'8000',category:'deduction',taxable:false},{id:'2',label:'Expenses',translated:'',amount:'5000',category:'reimbursement',taxable:false},{id:'3',label:'Employer cost',translated:'',amount:'2000',category:'employer-contribution',taxable:false}];const t=totals(d);expect(t.gross.toString()).toBe('100000');expect(t.net.toString()).toBe('92000');expect(t.cash.toString()).toBe('97000');expect(t.employer.toString()).toBe('2000');});
 it('uses exact decimals and hourly mode without double counting salary',()=>{const d=blankDocument();d.basis='hourly';d.basic='9999';d.hours='0.1';d.rate='0.2';expect(totals(d).base.toString()).toBe('0.02');});
 it('blank contains no sample identity',()=>{expect(JSON.stringify(blankDocument())).not.toContain('Acme');expect(blankDocument().sample).toBe(false);expect(sampleDocument().sample).toBe(true);});
 it('sample fixture totals match',()=>{const t=totals(sampleDocument());expect(t.gross.toString()).toBe('5600');expect(t.deductions.toString()).toBe('500');expect(t.net.toString()).toBe('5100');});
 it('validates negative, nonfinite and excessive precision',()=>{for(const s of ['-1','NaN','Infinity','0.000000001','1000000000000'])expect(amountSchema.safeParse(s).success).toBe(false);});
 it('requires names and date ordering before export',()=>{const d=blankDocument();expect(issues(d)).toContain('Company name is required.');d.periodEnd='2020-01-01';expect(issues(d)).toContain('Pay period end must be on or after its start.');});
 it('rejects nonexistent calendar dates',()=>{const d=sampleDocument();d.periodEnd='2026-02-30';expect(issues(d)).toContain('periodEnd: Enter a valid calendar date.');});
 it('deduction changes net wages by the exact same amount',()=>{const d=sampleDocument();const before=totals(d).net;d.lines.push({id:'extra',label:'Extra',translated:'',amount:'0.17',category:'deduction',taxable:false});expect(before.minus(totals(d).net).toString()).toBe('0.17');});
 it('rejects unsafe JSON and remote image assets',()=>{expect(()=>safeParseProject('{"__proto__":{}}')).toThrow();expect(()=>safeParseProject(JSON.stringify({...blankDocument(),logo:'https://example.com/track.png'}))).toThrow();});
 it('roundtrips a project with a fixed schema',()=>{expect(safeParseProject(JSON.stringify(sampleDocument()))).toEqual(sampleDocument());});
 it('English amounts retain currency and fractional precision',()=>{expect(amountWords('1250.50','USD')).toBe('one thousand two hundred fifty USD and 50 / 100');expect(amountWords('42','JPY')).toBe('forty-two JPY');expect(amountWords('1.125','KWD')).toBe('one KWD and 125 / 1000');});
});
describe('safe user-configured rules',()=>{
 it.each([['0','0'],['999.99','0'],['1000','0'],['1000.01','0'],['1999.99','100'],['2000','100'],['2000.01','100'],['2500','200']])('progressive fixture income %s -> tax %s',(income,tax)=>{expect(calculateRule(exampleRule,income,'2026-06-01').tax.toString()).toBe(tax);});
 it('computes base-plus-marginal separately',()=>{expect(calculateRule({...exampleRule,mode:'base-marginal'},'2500','2026-06-01').tax.toString()).toBe('200');});
 it('applies allowance and a capped contribution independently',()=>{const t=calculateRule({...exampleRule,allowance:'500',contributionRate:'5',contributionCap:'1000'},'2500','2026-06-01');expect(t.tax.toString()).toBe('100');expect(t.contribution.toString()).toBe('50');expect(t.net.toString()).toBe('2350');});
 it('rejects gap, overlap, missing final band and invalid dates',()=>{const p=structuredClone(exampleRule);p.bands[1].lower='1001';expect(()=>validateRule(p)).toThrow();p.bands[1].lower='999';expect(()=>validateRule(p)).toThrow();expect(()=>validateRule({...exampleRule,bands:exampleRule.bands.slice(0,2)})).toThrow();expect(()=>calculateRule(exampleRule,'2500','2027-01-01')).toThrow();});
 it('ignores a forged trusted status',()=>{expect(validateRule({...exampleRule,trust:'built-in-reviewed'})).not.toHaveProperty('trust');});
 it.each(['Infinity','NaN','-1','1e20'])('rejects invalid rule income %s',(value)=>{expect(()=>calculateRule(exampleRule,value,'2026-06-01')).toThrow();});
 it('tax is nondecreasing over increasing incomes',()=>{let prior=0;for(let i=0;i<=10000;i+=37){const current=Number(calculateRule(exampleRule,String(i),'2026-06-01').tax);expect(current).toBeGreaterThanOrEqual(prior);prior=current;}});
});
