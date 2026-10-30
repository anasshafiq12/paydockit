import {type PayrollDocument,totals,money,dateLabel,certificateParagraph,issues,documentMoney,documentDate,documentWords,documentTitle,documentSubject,documentFooter,renderDocumentText} from '@shared/domain';
import {getTemplate} from '@shared/documents/templates';
import {stampPNG,stampDimensions} from './stamp';
import {installPDFFonts,type PDFFontData} from './pdf-fonts';

export async function generatePDF(doc:PayrollDocument,fontData?:PDFFontData){
 const problems=issues(doc);if(problems.length)throw new Error(problems.join('\n'));
 if(doc.language!=='en')throw new Error('Use browser print for Arabic and Urdu documents. Direct multilingual PDF is pending verification.');
 const c=doc.customization,l=c.labels,v=c.show,footerData=documentFooter(doc);
 const strings=[documentTitle(doc),documentSubject(doc),certificateParagraph(doc),...Object.values(c.labels),...c.fields.flatMap(f=>[f.label,f.value]),c.currencyDisplay,...Object.values(footerData),doc.company,doc.employee,doc.employeeId,doc.department,doc.employmentType,doc.addressee,doc.address,doc.title,doc.notes,doc.signer,doc.signerTitle,doc.contact,doc.registration,doc.reference,doc.duties,doc.purpose,...doc.lines.map(l=>l.label)];
 if(strings.some(s=>/[\u0590-\u08ff]/.test(s)))throw new Error('Some characters need a wider font. Use Print / Save as PDF to preserve them.');
 const {jsPDF}=await import('jspdf');
 const pdf=new jsPDF({unit:'mm',format:doc.paper.toLowerCase(),compress:true});
 const original=getTemplate(doc.template),design={...original,accent:c.accent||original.accent,ink:c.textColor||original.ink,soft:c.accent?'#f1f5fb':original.soft},width=pdf.internal.pageSize.getWidth(),height=pdf.internal.pageSize.getHeight();
 const margin=doc.template==='framed'?23:18,right=width-margin,bodyWidth=width-2*margin;
 const bodyFont=c.font==='serif'?'times':c.font==='mono'?'courier':c.font==='sans'?'helvetica':design.font==='serif'?'times':'helvetica';const fontAlias=await installPDFFonts(pdf,strings.join(' '),bodyFont,['editorial','framed','payroll-form'].includes(doc.template),fontData);let y=20,headerBottom=45,tableActive='';
 const footerFields=c.fields.filter(f=>f.section==='footer');
 pdf.setFont(fontAlias('helvetica'),'normal');pdf.setFontSize(7);
 const footerCompany=v.footerIdentity?pdf.splitTextToSize(footerData.company,bodyWidth*.48) as string[]:[];const footerContact=v.footerIdentity?pdf.splitTextToSize(footerData.contact,bodyWidth*.48) as string[]:[];
 const footerNotes=v.footerNote?pdf.splitTextToSize(footerData.note,bodyWidth) as string[]:[];const footerRefs=v.footerReference?pdf.splitTextToSize(footerData.reference,bodyWidth-35) as string[]:[];const customFooterLines=footerFields.flatMap(f=>pdf.splitTextToSize(f.label+': '+f.value,bodyWidth)) as string[];
 const footerHeight=v.footer?Math.max(26,14+Math.max(footerCompany.length,footerContact.length)*3.6+(footerNotes.length+footerRefs.length+customFooterLines.length)*3.2):12;if(footerHeight>85)throw new Error('Footer text is too long for this page. Move longer details into body custom fields.');
 const title=documentTitle(doc).toUpperCase();
 function base(font=bodyFont,style='normal',size=10,color:string=design.ink){pdf.setFont(fontAlias(font),style);pdf.setFontSize(size);pdf.setTextColor(color);}
 function stampWatermark(){if(!doc.sample)return;pdf.saveGraphicsState();base('helvetica','bold',54,'#e9edf1');pdf.text('SAMPLE',width/2-5,height/2+20,{angle:35,align:'center'});pdf.restoreGraphicsState();}
 function header(){
  const centered=['editorial','framed'].includes(doc.template),navy=doc.template==='executive';
  if(doc.template==='editorial'){pdf.setFillColor('#fffcf7');pdf.rect(0,0,width,height,'F');}
  if(doc.template==='framed'){pdf.setDrawColor('#aaa2bc');pdf.setLineWidth(.35);pdf.rect(8,8,width-16,height-16);pdf.setDrawColor('#dfdae9');pdf.setLineWidth(.2);pdf.rect(10,10,width-20,height-20);}
  if(doc.template==='modern'){pdf.setFillColor(design.accent);pdf.rect(0,0,2.8,height,'F');}
  if(doc.template==='corporate'){pdf.setFillColor(design.accent);pdf.rect(0,0,width,4,'F');}
  base(centered||doc.template==='payroll-form'?'times':'helvetica',centered?'normal':'bold',centered?23:20,design.accent);
  const companyLines=pdf.splitTextToSize(doc.company,centered?bodyWidth:bodyWidth-56) as string[];
  const addressParts=[v.address?doc.address:'',v.contact?doc.contact:'',v.registration?doc.registration:'',...c.fields.filter(f=>f.section==='header').map(f=>f.label+': '+f.value)].filter(Boolean);
  base('helvetica','normal',8);
  const addressLines=addressParts.flatMap(s=>pdf.splitTextToSize(s,centered?bodyWidth:bodyWidth-56)) as string[];
  const logoProps=doc.logo&&v.logo?pdf.getImageProperties(doc.logo):null;const logoW=logoProps?Math.min(c.logoWidth,30*logoProps.width/logoProps.height):0;const logoH=logoProps?logoW*logoProps.height/logoProps.width:0;const logoHeight=logoProps?logoH+5:0;
  headerBottom=centered?24+logoHeight+companyLines.length*8+addressLines.length*4.2+20:25+logoHeight+companyLines.length*8+addressLines.length*4.2+7;
  headerBottom=Math.max(centered?57:46,headerBottom);
  if(headerBottom>height-100)throw new Error('Company letterhead is too long for this page. Shorten the header and move extra information to notes.');
  if(navy&&v.header){pdf.setFillColor(design.accent);pdf.rect(0,0,width,headerBottom,'F');}
  if(!v.header){stampWatermark();y=20;base();return;}
  let cy=24;
  if(logoProps){const area=centered?bodyWidth:bodyWidth-56;const left=c.logoAlign==='right'?margin+area-logoW:c.logoAlign==='center'?margin+(area-logoW)/2:margin;pdf.addImage(doc.logo,'PNG',left,cy-5,logoW,logoH);cy+=logoHeight;}
  if(['corporate','modern'].includes(doc.template)){base('helvetica','bold',6,design.accent);pdf.text(l.letterhead,margin,cy-7);}
  base(centered?'times':'helvetica',centered?'normal':'bold',centered?23:20,navy?'#ffffff':design.accent);
  for(const line of companyLines){pdf.text(line,centered?width/2:margin,cy,centered?{align:'center'}:{});cy+=8;}
  base('helvetica','normal',8,navy?'#cad5df':'#7d8998');
  for(const line of addressLines){pdf.text(line,centered?width/2:margin,cy,centered?{align:'center'}:{});cy+=4.2;}
  if(centered){base('helvetica','bold',8,design.accent);pdf.text(title,width/2,cy+6,{align:'center',charSpace:.45});base('helvetica','normal',7,'#8c93a0');pdf.text([v.reference?(doc.reference||c.referenceFallback):'',v.issueDate?documentDate(doc,doc.issueDate):''].filter(Boolean).join('  /  '),width/2,cy+12,{align:'center'});}
  else{base('helvetica','bold',8,navy?'#dfc394':design.accent);const titleLines=pdf.splitTextToSize(title,49) as string[];pdf.text(titleLines,right,24,{align:'right',lineHeightFactor:1.6});base('helvetica','normal',7,navy?'#cad5df':'#8995a6');if(v.issueDate)pdf.text(documentDate(doc,doc.issueDate),right,31+titleLines.length*4,{align:'right'});if(v.reference&&(doc.reference||c.referenceFallback)){const refs=pdf.splitTextToSize(doc.reference||c.referenceFallback,49) as string[];pdf.text(refs.slice(0,3),right,37+titleLines.length*4,{align:'right'});}}
  pdf.setDrawColor(navy?'#bd9b62':design.accent);pdf.setLineWidth(navy?1:doc.template==='corporate'?.9:.3);if(doc.template!=='hr-letter')pdf.line(margin,headerBottom,right,headerBottom);
  if(doc.template==='ledger'){pdf.setLineWidth(.2);pdf.line(margin,headerBottom+1.2,right,headerBottom+1.2);}
  if(doc.template==='modern'){pdf.setLineWidth(.7);pdf.line(right-51,18,right-51,headerBottom-5);}
  stampWatermark();y=headerBottom+11;base();
 }
 function footer(page:number,count:number){if(!v.footer)return;const band=['executive','corporate'].includes(doc.template);const top=height-footerHeight;if(band){pdf.setFillColor(design.accent);pdf.rect(0,top,width,footerHeight,'F');}pdf.setDrawColor(design.accent);pdf.setLineWidth(.3);if(doc.template!=='hr-letter')pdf.line(margin,top,right,top);let fy=top+6;base('helvetica','bold',7,band?'#ffffff':design.accent);if(footerCompany.length)pdf.text(footerCompany,margin,fy,{lineHeightFactor:1.45});base('helvetica','normal',7,band?'#d2dce7':'#7e8c9d');if(footerContact.length)pdf.text(footerContact,right,fy,{align:'right',lineHeightFactor:1.45});fy+=Math.max(footerCompany.length,footerContact.length)*3.6;for(const line of [...customFooterLines,...footerNotes]){pdf.text(line,margin,fy);fy+=3.2;}if(footerRefs.length)pdf.text(footerRefs,margin,fy,{lineHeightFactor:1.3});if(v.pageNumbers)pdf.text(l.page+' '+page+' / '+count,right,Math.max(fy,height-11),{align:'right'});}
 function rawTableHeading(){base('helvetica','bold',8,design.accent);pdf.setFillColor(design.soft);pdf.rect(margin,y-5,bodyWidth,9,'F');pdf.text(tableActive,margin+3,y);pdf.text((l.amount?l.amount+' ':'')+'('+(c.currencyDisplay||doc.currency)+')',right-3,y,{align:'right'});y+=10;base();}
 function page(){pdf.addPage();header();if(tableActive)rawTableHeading();}
 function room(size:number){if(y+size>height-footerHeight-6)page();}
 function paragraph(text:string,size=10){size=size*c.fontSize/10;base(bodyFont,'normal',size);const lines=pdf.splitTextToSize(text,bodyWidth) as string[];const step=size*.352778*1.75;for(const line of lines){room(step);base(bodyFont,'normal',size);pdf.text(line,margin,y);y+=step;}y+=5;}
 function heading(text:string){room(19);const serif=design.font==='serif',letter=doc.template==='hr-letter';base(serif?'times':'helvetica',serif?'normal':'bold',serif?18:15);const lines=pdf.splitTextToSize(text,bodyWidth-8) as string[];const block=lines.length*7;
  if(doc.template==='ledger'){pdf.setFillColor(design.soft);pdf.rect(margin,y-6,bodyWidth,block+8,'F');pdf.setDrawColor(design.accent);pdf.setLineWidth(.9);pdf.line(margin,y-6,margin,y+block+2);}
  if(doc.template==='modern'){pdf.setDrawColor(design.accent);pdf.setLineWidth(.8);pdf.line(margin,y-5,margin,y+block);}
  pdf.text(lines,serif||letter?width/2:margin+3,y,serif||letter?{align:'center',lineHeightFactor:1.35}:{lineHeightFactor:1.35});if(letter){pdf.setDrawColor(design.ink);pdf.setLineWidth(.3);const ruleWidth=Math.min(bodyWidth,Math.max(...lines.map(line=>pdf.getTextWidth(line))));pdf.line((width-ruleWidth)/2,y+block-5,(width+ruleWidth)/2,y+block-5);}y+=block+10;base();}
 function tableHeading(text:string){room(15);tableActive=text;rawTableHeading();}
 function row(label:string,value:string,highlight=false){const rowSize=9*c.fontSize/10;base('helvetica','normal',rowSize);const lines=pdf.splitTextToSize(label,bodyWidth-58) as string[];const values=pdf.splitTextToSize(value,51) as string[];const rowH=Math.max(8,Math.max(lines.length,values.length)*rowSize*.45+4);room(rowH);
  if(highlight){pdf.setFillColor(design.soft);pdf.rect(margin,y-5,bodyWidth,rowH,'F');}
  pdf.setDrawColor(['ledger','payroll-form'].includes(doc.template)?'#b9bfc3':'#e7ecf2');pdf.setLineWidth(.15);pdf.line(margin,y+rowH-5,right,y+rowH-5);
  if(['ledger','payroll-form'].includes(doc.template)){pdf.rect(margin,y-5,bodyWidth,rowH);pdf.line(right-54,y-5,right-54,y+rowH-5);}
  base('helvetica',highlight?'bold':'normal',rowSize,highlight?design.accent:design.ink);pdf.text(lines,margin+3,y);pdf.text(values,right-3,y,{align:'right'});y+=rowH;base();
 }
 header();
 if(doc.template==='payroll-form'&&v.header&&doc.kind==='payslip')heading(documentTitle(doc));
 const t=totals(doc),fmt=(value:Parameters<typeof documentMoney>[1])=>documentMoney(doc,value),date=(value:string)=>documentDate(doc,value);
 function customFields(section:string){c.fields.filter(f=>f.section===section).forEach(f=>paragraph((f.label?f.label+': ':'')+f.value,9));}
 if(!v.header)heading(documentTitle(doc));
 if(doc.kind==='payslip'){
  const employeeInfo=[l.employee+': '+doc.employee+(v.employeeId&&doc.employeeId?' - '+doc.employeeId:''),v.jobTitle?doc.title+(v.department&&doc.department?' - '+doc.department:''):''].filter(Boolean);paragraph(employeeInfo.join('\n'),10);
  const payInfo=[v.payPeriod?l.payPeriod+': '+date(doc.periodStart)+' - '+date(doc.periodEnd):'',v.paymentDate?l.paymentDate+': '+date(doc.paymentDate):'',v.days?(doc.basis==='hourly'?l.hours+': '+doc.hours+' x '+l.hourlyRate+': '+fmt(doc.rate):l.paidDays+': '+doc.paidDays+' - '+l.unpaidDays+': '+doc.unpaidDays):''].filter(Boolean);if(payInfo.length)paragraph(payInfo.join('\n'),8);
  customFields('employee');tableHeading(l.earnings);row(doc.basis==='hourly'?l.hourly:l.basic,fmt(t.base));
  doc.lines.filter(p=>p.category==='earning').forEach(p=>row(p.label,fmt(p.amount)));if(v.gross)row(l.gross,fmt(t.gross),true);
  doc.lines.filter(p=>p.category==='deduction').forEach(p=>row(p.label+' ('+l.deduction+')','- '+fmt(p.amount)));
  if(v.deductions)row(l.deductions,fmt(t.deductions));if(v.net)row(l.net,fmt(t.net),true);
  if(v.reimbursements)doc.lines.filter(p=>p.category==='reimbursement').forEach(p=>row(p.label+' ('+l.reimbursement+')',fmt(p.amount)));
  if(v.cash)row(l.cash,fmt(t.cash),true);tableActive='';y+=4;if(v.amountWords)paragraph(documentWords(doc,t.cash.toString()),8);
  if(v.contributions&&doc.lines.some(p=>p.category==='employer-contribution')){tableHeading(l.contributions);doc.lines.filter(p=>p.category==='employer-contribution').forEach(p=>row(p.label,fmt(p.amount)));tableActive='';}
  if(v.ytd&&Number(doc.ytd)>0)paragraph(l.ytdOpening+': '+fmt(doc.ytd)+' - '+l.ytdClosing+': '+fmt(t.gross.plus(doc.ytd)),8);
 }else{
  paragraph(doc.addressee,9);y+=2;heading(documentSubject(doc));customFields('employee');paragraph(certificateParagraph(doc),11);
  if(doc.kind==='salary-certificate'&&v.salaryBreakdown){tableHeading(l.salaryBreakdown);row(l.basic,fmt(t.base));doc.lines.filter(p=>p.category==='earning').forEach(p=>row(p.label,fmt(p.amount)));row(renderDocumentText(doc,l.monthlySalary),fmt(doc.salaryDesignation==='net'?t.net:t.gross),true);tableActive='';y+=7;}
  if(v.verification)paragraph(renderDocumentText(doc,c.verificationText||'For confirmation, please contact {contact}.'),10);
 }
 customFields('body');
 if(doc.calculationSnapshot)paragraph('User-configured estimate: '+doc.calculationSnapshot.name+' v'+doc.calculationSnapshot.version+'. Original calculation date: '+doc.calculationSnapshot.effectiveDate+'. Amount edits do not recalculate this snapshot.',8);
 if(doc.notes)paragraph(doc.notes,9);
 if(v.signer){room(doc.signature?40:30);y+=9;
 if(doc.signature){const props=pdf.getImageProperties(doc.signature);const w=Math.min(38,15*props.width/props.height),h=Math.min(15,38*props.height/props.width);pdf.addImage(doc.signature,'PNG',margin,y,w,h);y+=h+4;}
 pdf.setDrawColor('#c3cddb');pdf.setLineWidth(.25);if(v.signatureLine)pdf.line(margin,y,margin+53,y);y+=6;base(bodyFont,'bold',10);pdf.text(doc.signer||l.signer,margin,y);y+=6;base('helvetica','normal',8,'#8693a5');pdf.text(pdf.splitTextToSize(doc.signerTitle,bodyWidth),margin,y);}
 if(doc.stampEnabled){pdf.setPage(1);const image=await stampPNG(doc);const dimensions=stampDimensions(doc);const factor=dimensions.height/dimensions.width;pdf.addImage(image,'PNG',doc.stampX,doc.stampY,doc.stampWidth,doc.stampWidth*factor,undefined,'FAST',-doc.stampRotation);}
 const count=pdf.getNumberOfPages();for(let i=1;i<=count;i++){pdf.setPage(i);footer(i,count);}
 pdf.setProperties({title:doc.kind,author:doc.company,subject:'Employer-prepared document - '+design.name});return pdf;
}
