import {type PayrollDocument,totals,money,dateLabel,certificateParagraph,amountWords,issues} from '@shared/domain';
import {getTemplate} from '@shared/documents/templates';
import {stampPNG} from './stamp';

export async function generatePDF(doc:PayrollDocument){
 const problems=issues(doc);if(problems.length)throw new Error(problems.join('\n'));
 if(doc.language!=='en')throw new Error('Use browser print for Arabic and Urdu documents. Direct multilingual PDF is pending verification.');
 const strings=[doc.company,doc.employee,doc.employeeId,doc.department,doc.employmentType,doc.addressee,doc.address,doc.title,doc.notes,doc.signer,doc.signerTitle,doc.contact,doc.registration,doc.reference,doc.duties,doc.purpose,...doc.lines.map(l=>l.label)];
 if(strings.some(s=>/[^\x00-\x7F\u00A0-\u00FF\u2010-\u2027\u20AC]/.test(s)))throw new Error('Some characters need a wider font. Use Print / Save as PDF to preserve them.');
 const {jsPDF}=await import('jspdf');
 const pdf=new jsPDF({unit:'mm',format:doc.paper.toLowerCase(),compress:true});
 const design=getTemplate(doc.template),width=pdf.internal.pageSize.getWidth(),height=pdf.internal.pageSize.getHeight();
 const margin=doc.template==='framed'?23:18,right=width-margin,bodyWidth=width-2*margin;
 const bodyFont=design.font==='serif'?'times':'helvetica';let y=20,headerBottom=45,tableActive='';
 const title=doc.kind==='payslip'?'SALARY SLIP':doc.kind==='salary-certificate'?'SALARY CERTIFICATE':doc.status==='experience'?'EXPERIENCE CERTIFICATE':'EMPLOYMENT CERTIFICATE';
 function base(font=bodyFont,style='normal',size=10,color:string=design.ink){pdf.setFont(font,style);pdf.setFontSize(size);pdf.setTextColor(color);}
 function stampWatermark(){if(!doc.sample)return;pdf.saveGraphicsState();base('helvetica','bold',54,'#e9edf1');pdf.text('SAMPLE',width/2-5,height/2+20,{angle:35,align:'center'});pdf.restoreGraphicsState();}
 function header(){
  const centered=['editorial','framed'].includes(doc.template),navy=doc.template==='executive';
  if(doc.template==='editorial'){pdf.setFillColor('#fffcf7');pdf.rect(0,0,width,height,'F');}
  if(doc.template==='framed'){pdf.setDrawColor('#aaa2bc');pdf.setLineWidth(.35);pdf.rect(8,8,width-16,height-16);pdf.setDrawColor('#dfdae9');pdf.setLineWidth(.2);pdf.rect(10,10,width-20,height-20);}
  if(doc.template==='modern'){pdf.setFillColor(design.accent);pdf.rect(0,0,2.8,height,'F');}
  if(doc.template==='corporate'){pdf.setFillColor(design.accent);pdf.rect(0,0,width,4,'F');}
  base(centered?'times':'helvetica',centered?'normal':'bold',centered?23:20,design.accent);
  const companyLines=pdf.splitTextToSize(doc.company,centered?bodyWidth:bodyWidth-56) as string[];
  const addressParts=[doc.address,doc.contact,doc.registration].filter(Boolean);
  base('helvetica','normal',8);
  const addressLines=addressParts.flatMap(s=>pdf.splitTextToSize(s,centered?bodyWidth:bodyWidth-56)) as string[];
  const logoHeight=doc.logo?20:0;
  headerBottom=centered?24+logoHeight+companyLines.length*8+addressLines.length*4.2+20:25+logoHeight+companyLines.length*8+addressLines.length*4.2+7;
  headerBottom=Math.max(centered?57:46,headerBottom);
  if(headerBottom>height-100)throw new Error('Company letterhead is too long for this page. Shorten the header and move extra information to notes.');
  if(navy){pdf.setFillColor(design.accent);pdf.rect(0,0,width,headerBottom,'F');}
  let cy=24;
  if(doc.logo){const props=pdf.getImageProperties(doc.logo);const w=Math.min(28,16*props.width/props.height),h=Math.min(16,28*props.height/props.width);pdf.addImage(doc.logo,'PNG',centered?(width-w)/2:margin,cy-5,w,h);cy+=logoHeight;}
  if(['corporate','modern'].includes(doc.template)){base('helvetica','bold',6,design.accent);pdf.text('COMPANY LETTERHEAD',margin,cy-7);}
  base(centered?'times':'helvetica',centered?'normal':'bold',centered?23:20,navy?'#ffffff':design.accent);
  for(const line of companyLines){pdf.text(line,centered?width/2:margin,cy,centered?{align:'center'}:{});cy+=8;}
  base('helvetica','normal',8,navy?'#cad5df':'#7d8998');
  for(const line of addressLines){pdf.text(line,centered?width/2:margin,cy,centered?{align:'center'}:{});cy+=4.2;}
  if(centered){base('helvetica','bold',8,design.accent);pdf.text(title,width/2,cy+6,{align:'center',charSpace:.45});base('helvetica','normal',7,'#8c93a0');pdf.text([doc.reference,dateLabel(doc.issueDate)].filter(Boolean).join('  /  '),width/2,cy+12,{align:'center'});}
  else{base('helvetica','bold',8,navy?'#dfc394':design.accent);const titleLines=pdf.splitTextToSize(title,49) as string[];pdf.text(titleLines,right,24,{align:'right',lineHeightFactor:1.6});base('helvetica','normal',7,navy?'#cad5df':'#8995a6');pdf.text(dateLabel(doc.issueDate),right,31+titleLines.length*4,{align:'right'});if(doc.reference){const refs=pdf.splitTextToSize(doc.reference,49) as string[];pdf.text(refs.slice(0,3),right,37+titleLines.length*4,{align:'right'});}}
  pdf.setDrawColor(navy?'#bd9b62':design.accent);pdf.setLineWidth(navy?1:doc.template==='corporate'?.9:.3);pdf.line(margin,headerBottom,right,headerBottom);
  if(doc.template==='ledger'){pdf.setLineWidth(.2);pdf.line(margin,headerBottom+1.2,right,headerBottom+1.2);}
  if(doc.template==='modern'){pdf.setLineWidth(.7);pdf.line(right-51,18,right-51,headerBottom-5);}
  stampWatermark();y=headerBottom+11;base();
 }
 function footer(page:number,count:number){
  const band=['executive','corporate'].includes(doc.template);
  const footerTop=height-28;
  if(band){pdf.setFillColor(design.accent);pdf.rect(0,footerTop,width,28,'F');}
  pdf.setDrawColor(doc.template==='executive'?'#bd9b62':design.accent);pdf.setLineWidth(doc.template==='modern'?.8:.25);pdf.line(margin,footerTop,right,footerTop);
  base('helvetica','bold',7,band?'#ffffff':design.accent);
  const company=pdf.splitTextToSize(doc.company,bodyWidth*.52) as string[];pdf.text(company[0]||'',margin,footerTop+7);
  base('helvetica','normal',7,band?'#d2dce7':'#7e8c9d');
  const contact=pdf.splitTextToSize(doc.contact||doc.address||'',bodyWidth*.45) as string[];pdf.text(contact[0]||'',right,footerTop+7,{align:'right'});
  base('helvetica','normal',6,band?'#b9c9d9':'#97a2af');
  const note=doc.sample?'FICTIONAL SAMPLE - NOT FOR ISSUE':doc.kind==='payslip'?'Employer-prepared payroll document':'Employer-issued statement - no payment transfer implied';
  pdf.text(note,margin,footerTop+14);pdf.text('Page '+page+' of '+count,right,footerTop+14,{align:'right'});
 }
 function rawTableHeading(){base('helvetica','bold',8,design.accent);pdf.setFillColor(design.soft);pdf.rect(margin,y-5,bodyWidth,9,'F');pdf.text(tableActive,margin+3,y);pdf.text(doc.currency,right-3,y,{align:'right'});y+=10;base();}
 function page(){pdf.addPage();header();if(tableActive)rawTableHeading();}
 function room(size:number){if(y+size>height-35)page();}
 function paragraph(text:string,size=10){base(bodyFont,'normal',size);const lines=pdf.splitTextToSize(text,bodyWidth) as string[];const step=size*.352778*1.75;for(const line of lines){room(step);base(bodyFont,'normal',size);pdf.text(line,margin,y);y+=step;}y+=5;}
 function heading(text:string){room(19);const serif=design.font==='serif';base(serif?'times':'helvetica',serif?'normal':'bold',serif?18:15);const lines=pdf.splitTextToSize(text,bodyWidth-8) as string[];const block=lines.length*7;
  if(doc.template==='ledger'){pdf.setFillColor(design.soft);pdf.rect(margin,y-6,bodyWidth,block+8,'F');pdf.setDrawColor(design.accent);pdf.setLineWidth(.9);pdf.line(margin,y-6,margin,y+block+2);}
  if(doc.template==='modern'){pdf.setDrawColor(design.accent);pdf.setLineWidth(.8);pdf.line(margin,y-5,margin,y+block);}
  pdf.text(lines,serif?width/2:margin+3,y,serif?{align:'center',lineHeightFactor:1.35}:{lineHeightFactor:1.35});y+=block+10;base();}
 function tableHeading(text:string){room(15);tableActive=text;rawTableHeading();}
 function row(label:string,value:string,highlight=false){base('helvetica','normal',9);const lines=pdf.splitTextToSize(label,bodyWidth-58) as string[];const rowH=Math.max(8,lines.length*4+4);room(rowH);
  if(highlight){pdf.setFillColor(design.soft);pdf.rect(margin,y-5,bodyWidth,rowH,'F');}
  pdf.setDrawColor(doc.template==='ledger'?'#d4e3df':'#e7ecf2');pdf.setLineWidth(.15);pdf.line(margin,y+rowH-5,right,y+rowH-5);
  if(doc.template==='ledger'){pdf.rect(margin,y-5,bodyWidth,rowH);pdf.line(right-54,y-5,right-54,y+rowH-5);}
  base('helvetica',highlight?'bold':'normal',9,highlight?design.accent:design.ink);pdf.text(lines,margin+3,y);pdf.text(value,right-3,y,{align:'right'});y+=rowH;base();
 }
 header();
 const t=totals(doc),fmt=(v:Parameters<typeof money>[0])=>money(v,doc.currency);
 if(doc.kind==='payslip'){
  paragraph('Employee: '+doc.employee+(doc.employeeId?' - '+doc.employeeId:'')+'\n'+doc.title+(doc.department?' - '+doc.department:''),10);
  paragraph('Pay period: '+dateLabel(doc.periodStart)+' - '+dateLabel(doc.periodEnd)+'\nPayment date: '+dateLabel(doc.paymentDate)+'\n'+(doc.basis==='hourly'?'Hours: '+doc.hours+' x Rate: '+fmt(doc.rate):'Paid days: '+doc.paidDays+' - Unpaid days: '+doc.unpaidDays),8);
  tableHeading('Earnings & adjustments');row(doc.basis==='hourly'?'Hourly earnings':'Basic pay',fmt(t.base));
  doc.lines.filter(l=>l.category==='earning').forEach(l=>row(l.label,fmt(l.amount)));row('Gross earnings',fmt(t.gross),true);
  doc.lines.filter(l=>l.category==='deduction').forEach(l=>row(l.label+' (deduction)','- '+fmt(l.amount)));
  row('Total employee deductions',fmt(t.deductions));row('Net wages',fmt(t.net),true);
  doc.lines.filter(l=>l.category==='reimbursement').forEach(l=>row(l.label+' (reimbursement)',fmt(l.amount)));
  row('Cash payable',fmt(t.cash),true);tableActive='';y+=4;paragraph(amountWords(t.cash.toString(),doc.currency),8);
  if(doc.lines.some(l=>l.category==='employer-contribution')){tableHeading('Employer contributions (separate from net wages)');doc.lines.filter(l=>l.category==='employer-contribution').forEach(l=>row(l.label,fmt(l.amount)));tableActive='';}
  if(Number(doc.ytd)>0)paragraph('YTD opening gross: '+fmt(doc.ytd)+' - Closing gross: '+fmt(t.gross.plus(doc.ytd)),8);
 }else{
  paragraph(doc.addressee,9);y+=2;heading(doc.kind==='salary-certificate'?'Salary confirmation':doc.status==='experience'?'Experience certificate':doc.status==='former'?'Former employment confirmation':'Confirmation of employment');
  paragraph(certificateParagraph(doc),11);
  if(doc.kind==='salary-certificate'){tableHeading('Monthly compensation breakdown');row('Basic pay',fmt(t.base));doc.lines.filter(l=>l.category==='earning').forEach(l=>row(l.label,fmt(l.amount)));row('Monthly '+doc.salaryDesignation+' salary',fmt(doc.salaryDesignation==='net'?t.net:t.gross),true);tableActive='';y+=7;}
  paragraph('For confirmation, please contact '+(doc.contact||'[Employer contact]')+'.',10);
 }
 if(doc.calculationSnapshot)paragraph('User-configured estimate: '+doc.calculationSnapshot.name+' v'+doc.calculationSnapshot.version+'. Original calculation date: '+doc.calculationSnapshot.effectiveDate+'. Amount edits do not recalculate this snapshot.',8);
 if(doc.notes)paragraph(doc.notes,9);
 room(doc.signature?40:30);y+=9;
 if(doc.signature){const props=pdf.getImageProperties(doc.signature);const w=Math.min(38,15*props.width/props.height),h=Math.min(15,38*props.height/props.width);pdf.addImage(doc.signature,'PNG',margin,y,w,h);y+=h+4;}
 pdf.setDrawColor('#c3cddb');pdf.setLineWidth(.25);pdf.line(margin,y,margin+53,y);y+=6;base(bodyFont,'bold',10);pdf.text(doc.signer||'Authorized signatory',margin,y);y+=6;base('helvetica','normal',8,'#8693a5');pdf.text(pdf.splitTextToSize(doc.signerTitle,bodyWidth),margin,y);
 if(doc.stampEnabled){pdf.setPage(1);const image=await stampPNG(doc);const factor=doc.stampShape==='circle'?220/240:155/240;pdf.addImage(image,'PNG',doc.stampX,doc.stampY,doc.stampWidth,doc.stampWidth*factor,undefined,'FAST',-doc.stampRotation);}
 const count=pdf.getNumberOfPages();for(let i=1;i<=count;i++){pdf.setPage(i);footer(i,count);}
 pdf.setProperties({title:doc.kind,author:doc.company,subject:'Employer-prepared document - '+design.name});return pdf;
}
