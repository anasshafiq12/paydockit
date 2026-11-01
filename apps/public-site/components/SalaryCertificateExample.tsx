import {toolsOrigin} from '@shared/content';
import {sampleDocument,certificateParagraph,documentDate,documentMoney,totals} from '@shared/domain';

export default function SalaryCertificateExample(){
 const doc={...sampleDocument('salary-certificate'),issueDate:'2026-10-01'};
 doc.customization.dateFormat='long';
 const pay=totals(doc);
 const examples=[['Monthly gross',pay.gross],['Monthly net',pay.net],['Annualized gross',pay.gross.times(12)],['Annualized net',pay.net.times(12)]] as const;
 return <>
  <section id="salary-certificate-format">
   <h2>Salary certificate format and fictional sample</h2>
   <p>A practical format includes employer letterhead and contact details, an issue date, the employee’s role and employment dates, a clearly labelled salary amount and an authorized signer. Ask the recipient if it needs a particular addressee, reference or purpose.</p>
   <div className="certificate-example" aria-label="Fictional salary certificate sample">
    <span className="sample-label">FICTIONAL SAMPLE</span>
    <p><strong>{doc.company}</strong><br/>{doc.address}<br/>Verification contact: {doc.contact}</p>
    <p>Issued: {documentDate(doc,doc.issueDate)}<br/><strong>Salary confirmation</strong></p>
    <p>{doc.addressee},</p>
    <p>{certificateParagraph(doc)}</p>
    <p>{doc.signer}<br/>{doc.signerTitle}</p>
   </div>
   <p>The wording uses the editor’s fictional sample data. Choose a design in the <a href="/templates/#salary-certificates">salary certificate template catalog</a>, then prepare the employer’s own verified letter in <a href={`${toolsOrigin}/salary-certificate/`}>the salary certificate generator</a>.</p>
  </section>
  <section>
   <h2>Check gross, net and annual salary before issuing</h2>
   <p>In this example, {documentMoney(doc,pay.base)} basic pay plus {documentMoney(doc,pay.gross.minus(pay.base))} in allowances gives {documentMoney(doc,pay.gross)} monthly gross. Entered employee deductions of {documentMoney(doc,pay.deductions)} give {documentMoney(doc,pay.net)} monthly net. The certificate confirms the salary basis you select.</p>
   <div className="comparison-scroll" role="region" aria-label="Salary certificate sample amounts" tabIndex={0}><table className="comparison-table"><caption>Fictional salary basis example</caption><thead><tr><th scope="col">Selected display</th><th scope="col">Example amount</th></tr></thead><tbody>{examples.map(([label,amount])=><tr key={label}><th scope="row">{label}</th><td>{documentMoney(doc,amount)}</td></tr>)}</tbody></table></div>
   <p>Annual display multiplies the selected monthly amount by 12. It does not establish actual earnings over the past year or automatically account for changing pay, irregular bonuses or unpaid periods. Use verified payroll records for a historical earnings statement. The <a href="/calculators/gross-to-net/">gross-to-net calculator with manual deductions</a> explains the arithmetic.</p>
   <ul><li>Confirm the issue date, recipient, purpose and verification contact.</li><li>Check the currency, amount and monthly/annual and gross/net labels against employer records.</li><li>Review the final letter and obtain approval from the employer’s authorized signer before issuing it.</li></ul>
   <p className="article-meta">Example and product explanation updated 1 November 2026 by PayDockit.</p>
  </section>
 </>;
}
