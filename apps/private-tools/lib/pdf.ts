import {type PayrollDocument,totals,money,dateLabel,certificateParagraph,amountWords,issues} from '@shared/domain';
import {stampPNG} from './stamp';
export async function generatePDF(doc:PayrollDocument){
  const problems=issues(doc);if(problems.length)throw new Error(problems.join('\n'));
  if(doc.language!=='en')throw new Error('Use browser print for Arabic and Urdu documents. Direct multilingual PDF is pending verification.');
  const strings=[doc.company,doc.employee,doc.address,doc.title,doc.notes,doc.signer,doc.signerTitle,doc.contact,doc.registration,doc.reference,doc.duties,doc.purpose,...doc.lines.map(l=>l.label)];
  if(strings.some(s=>/[^\x00-\x7F\u00A0-\u00FF\u2010-\u2027\u20AC]/.test(s)))throw new Error('Some characters need a wider font. Use Print / Save as PDF to preserve them.');
  const {jsPDF}=await import('jspdf');
  const pdf=new jsPDF({unit:'mm',format:doc.paper.toLowerCase(),compress:true});
  const width=pdf.internal.pageSize.getWidth(),height=pdf.internal.pageSize.getHeight(),margin=18,right=width-margin;let y=20;
  const color=doc.template==='minimal'?'#222222':'#265ed8';
  function watermark(){if(doc.sample){pdf.setTextColor('#e1e5ec');pdf.setFontSize(54);pdf.text('SAMPLE',width/2,height/2,{angle:35,align:'center'});}}
  function footer(){pdf.setFontSize(7);pdf.setTextColor('#7b8799');pdf.text(doc.sample?'FICTIONAL SAMPLE - NOT FOR ISSUE':'Prepared with PayDockit - Employer-issued document',margin,height-10);pdf.text(String(pdf.getNumberOfPages()),right,height-10,{align:'right'});}
  function page(){footer();pdf.addPage();watermark();y=20;pdf.setFontSize(10);pdf.setTextColor('#172033');}
  function room(size:number){if(y+size>height-23)page();}
  function paragraph(text:string,size=10){pdf.setFontSize(size);pdf.setTextColor('#334155');const lines=pdf.splitTextToSize(text,width-margin*2) as string[];for(const line of lines){room(6);pdf.text(line,margin,y);y+=6;}y+=5;}
  function row(label:string,value:string,highlight=false){const lines=pdf.splitTextToSize(label,width-margin*2-57) as string[];const rowH=Math.max(9,lines.length*4+4);room(rowH);if(highlight){pdf.setFillColor(doc.template==='minimal'?'#f0f0f0':'#edf4ff');pdf.rect(margin,y-5,width-margin*2,rowH,'F');}pdf.setFont('helvetica',highlight?'bold':'normal');pdf.setFontSize(9);pdf.setTextColor('#263750');pdf.text(lines,margin+3,y);pdf.text(value,right-3,y,{align:'right'});y+=rowH;pdf.setFont('helvetica','normal');}
  watermark();
  if(doc.logo){pdf.addImage(doc.logo,'PNG',margin,y,16,16);y+=20;}
  pdf.setFont('helvetica','bold');pdf.setFontSize(20);pdf.setTextColor(color);pdf.text(pdf.splitTextToSize(doc.company,width-margin*2),margin,y);y+=Math.max(10,pdf.splitTextToSize(doc.company,width-margin*2).length*8);
  paragraph([doc.address,doc.contact,doc.registration].filter(Boolean).join(' - '),8);
  pdf.setDrawColor(color);pdf.line(margin,y,right,y);y+=13;
  pdf.setFont('helvetica','bold');paragraph(doc.kind==='payslip'?'SALARY SLIP':doc.kind==='salary-certificate'?'SALARY CERTIFICATE':doc.status==='experience'?'EXPERIENCE CERTIFICATE':'EMPLOYMENT CERTIFICATE',14);pdf.setFont('helvetica','normal');
  paragraph(`Issue date: ${dateLabel(doc.issueDate)}${doc.reference?' - Reference: '+doc.reference:''}`,8);
  const t=totals(doc),fmt=(v:Parameters<typeof money>[0])=>money(v,doc.currency);
  if(doc.kind==='payslip'){
    paragraph(`Employee: ${doc.employee}${doc.employeeId?' - '+doc.employeeId:''}\n${doc.title}${doc.department?' - '+doc.department:''}`,10);
    paragraph(`Pay period: ${dateLabel(doc.periodStart)} - ${dateLabel(doc.periodEnd)}\nPayment date: ${dateLabel(doc.paymentDate)}\n${doc.basis==='hourly'?`Hours: ${doc.hours} × Rate: ${fmt(doc.rate)}`:`Paid days: ${doc.paidDays} - Unpaid days: ${doc.unpaidDays}`}`,9);
    row(doc.basis==='hourly'?'Hourly earnings':'Basic pay',fmt(t.base));
    doc.lines.filter(l=>l.category==='earning').forEach(l=>row(l.label,fmt(l.amount)));
    row('Gross earnings',fmt(t.gross),true);
    doc.lines.filter(l=>l.category==='deduction').forEach(l=>row(l.label+' (deduction)','- '+fmt(l.amount)));
    row('Total employee deductions',fmt(t.deductions));row('Net wages',fmt(t.net),true);
    doc.lines.filter(l=>l.category==='reimbursement').forEach(l=>row(l.label+' (reimbursement)',fmt(l.amount)));
    row('Cash payable',fmt(t.cash),true);y+=4;paragraph(amountWords(t.cash.toString(),doc.currency),8);
    if(doc.lines.some(l=>l.category==='employer-contribution')){paragraph('Employer contributions (separate from employee net)',8);doc.lines.filter(l=>l.category==='employer-contribution').forEach(l=>row(l.label,fmt(l.amount)));}
    if(Number(doc.ytd)>0)paragraph(`YTD opening gross: ${fmt(doc.ytd)} - Closing gross: ${fmt(t.gross.plus(doc.ytd))}`,8);
  }else{paragraph(doc.addressee);y+=5;paragraph(certificateParagraph(doc),11);if(doc.kind==='salary-certificate'){row('Monthly basic pay',fmt(t.base));doc.lines.filter(l=>l.category==='earning').forEach(l=>row(l.label,fmt(l.amount)));row('Monthly '+doc.salaryDesignation+' salary',fmt(doc.salaryDesignation==='net'?t.net:t.gross),true);}paragraph(`For confirmation, please contact ${doc.contact||'[Employer contact]'}.`);}
  if(doc.calculationSnapshot)paragraph('User-configured estimate: '+doc.calculationSnapshot.name+' v'+doc.calculationSnapshot.version+'. Original calculation date: '+doc.calculationSnapshot.effectiveDate+'. Amount edits do not recalculate this snapshot.',8); if(doc.notes)paragraph(doc.notes,9);
  room(43);y+=10;if(doc.signature){pdf.addImage(doc.signature,'PNG',margin,y,35,14);y+=18;}pdf.setDrawColor('#c5cedb');pdf.line(margin,y,margin+53,y);y+=6;paragraph((doc.signer||'Authorized signatory')+'\n'+doc.signerTitle,9);
  if(doc.stampEnabled){pdf.setPage(1);const image=await stampPNG(doc);const heightFactor=doc.stampShape==='circle'?220/240:155/240;pdf.addImage(image,'PNG',doc.stampX,doc.stampY,doc.stampWidth,doc.stampWidth*heightFactor,undefined,'FAST',-doc.stampRotation);pdf.setPage(pdf.getNumberOfPages());}
  footer();pdf.setProperties({title:doc.kind,author:doc.company,subject:'Employer-prepared document'});return pdf;
}


