import {describe,it,expect} from 'vitest';
import {sampleDocument,type PayrollDocument} from '../packages/domain';
import {generatePDF} from '../apps/private-tools/lib/pdf';
describe('English document export',()=>{
 for(const kind of ['payslip','employment-certificate','salary-certificate'] as const){
  for(const template of ['classic','minimal','corporate','ledger'] as const){
   it(`exports ${kind} with ${template} as a one-page PDF`,async()=>{const d={...sampleDocument(kind),template};const pdf=await generatePDF(d);expect(pdf.getNumberOfPages()).toBe(1);expect(pdf.output()).toMatch(/^%PDF-/);});
  }
 }
 it('paginates long lines without forcing one page',async()=>{const d=sampleDocument();d.lines=Array.from({length:65},(_,i)=>({id:String(i),label:`Detailed earning component ${i+1} with explanatory text for a longer line item`,translated:'',amount:'10',category:'earning',taxable:false}));const pdf=await generatePDF(d);expect(pdf.getNumberOfPages()).toBeGreaterThan(1);});
 it('blocks unsupported scripts rather than exporting missing glyphs',async()=>{const d=sampleDocument();d.employee='علی';await expect(generatePDF(d)).rejects.toThrow('Print');});
 it('blocks incomplete documents before PDF rendering',async()=>{await expect(generatePDF({...sampleDocument(),employee:''})).rejects.toThrow('Employee name');});
});
