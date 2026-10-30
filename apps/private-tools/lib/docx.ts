import {type PayrollDocument,totals,documentMoney,documentDate,documentTitle,documentSubject,documentFooter,documentWords,certificateParagraph,renderDocumentText,issues} from '@shared/domain';
import {getTemplate} from '@shared/documents/templates';
import {stampPNG,stampDimensions} from './stamp';
export async function generateDOCX(doc:PayrollDocument):Promise<Blob>{
 const errors=issues(doc);if(errors.length)throw new Error(errors.join('\n'));
 const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,Header,Footer,ImageRun,AlignmentType,WidthType,BorderStyle,PageNumber,HorizontalPositionRelativeFrom,VerticalPositionRelativeFrom,TextWrappingType}=await import('docx');
 const c=doc.customization,l=c.labels,v=c.show,design=getTemplate(doc.template),footer=documentFooter(doc),t=totals(doc),color=(c.accent||design.accent).slice(1),ink=(c.textColor||design.ink).slice(1),soft=c.accent?c.accent.slice(1)+'10':design.soft.slice(1);
 const form=doc.template==='payroll-form',letter=doc.template==='hr-letter';
 const font=c.font==='serif'||(c.font==='template'&&design.font==='serif')?'Times New Roman':c.font==='mono'?'Courier New':'Arial';const size=c.fontSize*2;
 const mm=(n:number)=>Math.round(n/25.4*1440),money=(value:Parameters<typeof documentMoney>[1])=>documentMoney(doc,value),date=(s:string)=>documentDate(doc,s);
 const border={style:BorderStyle.SINGLE,size:5,color};const grid={style:BorderStyle.SINGLE,size:3,color:'B9BFC3'};const none={style:BorderStyle.NONE,size:0,color:'FFFFFF'};
 const p=(text:string,bold=false,options:object={})=>new Paragraph({spacing:{after:110,line:Math.round(c.fontSize*20*1.45)},children:text.split('\n').map((line,i)=>new TextRun({text:line,break:i?1:undefined,bold,font,size,color:ink})),...options});
 const custom=(section:string)=>c.fields.filter(f=>f.section===section).map(f=>p((f.label?f.label+': ':'')+f.value));
 const data=(uri:string)=>{const raw=atob(uri.split(',')[1]);return Uint8Array.from(raw,char=>char.charCodeAt(0));};
 async function picture(uri:string,widthMm:number,maxHeightMm=30){let ratio=1;if(typeof Image!=='undefined'){const img=new Image();img.src=uri;await img.decode();ratio=img.naturalWidth/img.naturalHeight;}const height=Math.min(maxHeightMm,widthMm/ratio),width=Math.min(widthMm,height*ratio);return new ImageRun({type:uri.startsWith('data:image/jpeg')?'jpg':'png',data:data(uri),transformation:{width:width/25.4*96,height:height/25.4*96},altText:{name:'Employer image',title:'Authorized employer branding',description:'Uploaded locally'}});}
 const headerLeft:InstanceType<typeof Paragraph>[]=[];
 if(v.logo&&doc.logo)headerLeft.push(new Paragraph({alignment:c.logoAlign==='center'?AlignmentType.CENTER:c.logoAlign==='right'?AlignmentType.RIGHT:AlignmentType.LEFT,children:[await picture(doc.logo,c.logoWidth)]}));
 if(['corporate','modern'].includes(doc.template))headerLeft.push(p(l.letterhead,false,{spacing:{after:50},children:[new TextRun({text:l.letterhead,font:'Arial',size:13,color})]}));
 headerLeft.push(p(doc.company,true,{spacing:{after:90},children:[new TextRun({text:doc.company,font,size:38,bold:true,color})]}));
 if(v.address&&doc.address)headerLeft.push(p(doc.address,false,{children:[new TextRun({text:doc.address,font,size:16,color:'8390A0'})]}));
 if(v.contact&&doc.contact)headerLeft.push(p(doc.contact,false,{children:[new TextRun({text:doc.contact,font,size:16,color:'8390A0'})]}));
 if(v.registration&&doc.registration)headerLeft.push(p(doc.registration,false,{children:[new TextRun({text:doc.registration,font,size:16,color:'8390A0'})]}));
 headerLeft.push(...custom('header'));
 const headerRight=[p(documentTitle(doc).toUpperCase(),true,{alignment:AlignmentType.RIGHT,children:[new TextRun({text:documentTitle(doc).toUpperCase(),font:'Arial',size:17,bold:true,color})]})];
 if(v.reference)headerRight.push(p(doc.reference||c.referenceFallback,false,{alignment:AlignmentType.RIGHT,children:[new TextRun({text:doc.reference||c.referenceFallback,font:'Arial',size:15,color:'8894A5'})]}));
 if(v.issueDate)headerRight.push(p(date(doc.issueDate),false,{alignment:AlignmentType.RIGHT,children:[new TextRun({text:date(doc.issueDate),font:'Arial',size:15,color:'8894A5'})]}));
 const header=new Header({children:[new Table({width:{size:100,type:WidthType.PERCENTAGE},columnWidths:[6500,3200],borders:{top:none,bottom:letter?none:border,left:none,right:none,insideHorizontal:none,insideVertical:none},rows:[new TableRow({children:[new TableCell({width:{size:67,type:WidthType.PERCENTAGE},children:headerLeft,margins:{bottom:160}}),new TableCell({width:{size:33,type:WidthType.PERCENTAGE},children:headerRight,margins:{bottom:160}})]})]}),p('')]});
 const footerChildren:InstanceType<typeof Paragraph>[]=[];
 if(v.footerIdentity)footerChildren.push(p(footer.company+(footer.contact?'  |  '+footer.contact:''),false,{border:{top:letter?none:border},spacing:{before:120,after:75},children:[new TextRun({text:footer.company+(footer.contact?'  |  '+footer.contact:''),font:'Arial',size:15,color})]}));
 footerChildren.push(...custom('footer'));
 if(v.footerNote&&footer.note)footerChildren.push(p(footer.note,false,{children:[new TextRun({text:footer.note,font:'Arial',size:13,color:'8894A5'})]}));
 if(v.footerReference&&footer.reference)footerChildren.push(p(footer.reference,false,{children:[new TextRun({text:footer.reference,font:'Arial',size:13,color:'8894A5'})]}));
 if(v.pageNumbers)footerChildren.push(new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:l.page+' ',font:'Arial',size:13,color:'8894A5'}),new TextRun({children:[PageNumber.CURRENT],font:'Arial',size:13}),new TextRun({text:' / ',size:13}),new TextRun({children:[PageNumber.TOTAL_PAGES],font:'Arial',size:13})]}));
 const body:(InstanceType<typeof Paragraph>|InstanceType<typeof Table>)[]=[];
 if(doc.sample)body.push(p('SAMPLE — FICTIONAL DOCUMENT',true,{children:[new TextRun({text:'SAMPLE — FICTIONAL DOCUMENT',font:'Arial',size:18,bold:true,color:'B42318'})]}));
 if(!v.header)body.push(p(documentTitle(doc),true,{heading:'Title'}));
 function table(rows:{label:string;value:string;highlight?:boolean;header?:boolean}[]){return new Table({width:{size:100,type:WidthType.PERCENTAGE},columnWidths:[6500,3200],borders:{top:form?grid:none,bottom:form?grid:none,left:form?grid:none,right:form?grid:none,insideHorizontal:form?grid:{style:BorderStyle.SINGLE,size:3,color:'E6EBF2'},insideVertical:form?grid:none},rows:rows.map(row=>new TableRow({tableHeader:row.header,cantSplit:true,children:[new TableCell({width:{size:67,type:WidthType.PERCENTAGE},shading:row.highlight||row.header?{fill:soft.length===6?soft:'EFF4FA'}:undefined,margins:{top:80,bottom:80,left:110,right:110},children:[p(row.label,!!(row.highlight||row.header),{spacing:{after:0},children:[new TextRun({text:row.label,font:'Arial',size:Math.max(17,size-1),bold:!!(row.highlight||row.header),color:row.highlight||row.header?color:ink})]})]}),new TableCell({width:{size:33,type:WidthType.PERCENTAGE},shading:row.highlight||row.header?{fill:soft.length===6?soft:'EFF4FA'}:undefined,margins:{top:80,bottom:80,left:110,right:110},children:[p(row.value,!!row.highlight,{alignment:AlignmentType.RIGHT,spacing:{after:0},children:[new TextRun({text:row.value,font:'Arial',size:Math.max(17,size-1),bold:!!(row.highlight||row.header),color:row.highlight||row.header?color:ink})]})]})]}))});}
 if(doc.kind==='payslip'){
  if(form&&v.header)body.push(p(documentTitle(doc).toUpperCase(),true,{alignment:AlignmentType.CENTER,spacing:{before:120,after:240}}));
  body.push(p(l.employee+': '+doc.employee+(v.employeeId&&doc.employeeId?' · '+doc.employeeId:''),true));
  if(v.jobTitle&&doc.title)body.push(p(doc.title+(v.department&&doc.department?' · '+doc.department:'')));
  if(v.payPeriod)body.push(p(l.payPeriod+': '+date(doc.periodStart)+' – '+date(doc.periodEnd)));
  if(v.paymentDate)body.push(p(l.paymentDate+': '+date(doc.paymentDate)));
  if(v.days)body.push(p(doc.basis==='hourly'?l.hours+': '+doc.hours+' × '+l.hourlyRate+': '+money(doc.rate):l.paidDays+': '+doc.paidDays+' · '+l.unpaidDays+': '+doc.unpaidDays));
  body.push(...custom('employee'));
  const rows=[{label:l.earnings,value:l.amount+' ('+(c.currencyDisplay||doc.currency)+')',header:true},{label:doc.basis==='hourly'?l.hourly:l.basic,value:money(t.base)}];
  doc.lines.filter(x=>x.category==='earning').forEach(x=>rows.push({label:x.label,value:money(x.amount)}));
  if(v.gross)rows.push({label:l.gross,value:money(t.gross),...{highlight:true}});
  doc.lines.filter(x=>x.category==='deduction').forEach(x=>rows.push({label:x.label+' ('+l.deduction+')',value:'− '+money(x.amount)}));
  if(v.deductions)rows.push({label:l.deductions,value:money(t.deductions)});
  if(v.net)rows.push({label:l.net,value:money(t.net),...{highlight:true}});
  if(v.reimbursements)doc.lines.filter(x=>x.category==='reimbursement').forEach(x=>rows.push({label:x.label+' ('+l.reimbursement+')',value:money(x.amount)}));
  if(v.cash)rows.push({label:l.cash,value:money(t.cash),...{highlight:true}});
  body.push(table(rows));if(v.amountWords)body.push(p(documentWords(doc,t.cash.toString()),false,{spacing:{before:120,after:140}}));
  if(v.contributions&&doc.lines.some(x=>x.category==='employer-contribution')){body.push(p(l.contributions,true));body.push(table(doc.lines.filter(x=>x.category==='employer-contribution').map(x=>({label:x.label,value:money(x.amount)}))));}
  if(v.ytd&&Number(doc.ytd)>0)body.push(p(l.ytdOpening+': '+money(doc.ytd)+' · '+l.ytdClosing+': '+money(t.gross.plus(doc.ytd))));
 }else{
  body.push(p(doc.addressee));body.push(p(documentSubject(doc),true,{heading:'Title',alignment:letter||form?AlignmentType.CENTER:AlignmentType.LEFT,spacing:{before:220,after:250},children:[new TextRun({text:documentSubject(doc),font,size:32,bold:!letter,underline:letter?{}:undefined,color:ink})]}));
  body.push(...custom('employee'));body.push(p(certificateParagraph(doc),false,{spacing:{line:Math.round(c.fontSize*20*1.7),after:220}}));
  if(doc.kind==='salary-certificate'&&v.salaryBreakdown)body.push(table([{label:l.salaryBreakdown,value:c.currencyDisplay||doc.currency,header:true},{label:l.basic,value:money(t.base)},...doc.lines.filter(x=>x.category==='earning').map(x=>({label:x.label,value:money(x.amount)})),{label:renderDocumentText(doc,l.monthlySalary),value:money(doc.salaryDesignation==='net'?t.net:t.gross),highlight:true}]));
  if(v.verification)body.push(p(renderDocumentText(doc,c.verificationText||'For confirmation, please contact {contact}.')));
 }
 if(doc.language!=='en'){body.push(p('Translation draft — native review pending',true));body.push(p(doc.translatedCompany,false,{bidirectional:true}));body.push(p(doc.translatedEmployee+' — '+doc.translatedTitle,false,{bidirectional:true}));if(doc.translatedAddress)body.push(p(doc.translatedAddress,false,{bidirectional:true}));body.push(p(money(t.gross)+' / '+money(t.net),false,{bidirectional:true}));}
 body.push(...custom('body'));if(doc.notes)body.push(p(doc.notes));
 if(v.signer){body.push(p('',false,{spacing:{before:180,after:80},keepNext:true}));if(doc.signature)body.push(new Paragraph({children:[await picture(doc.signature,38,15)],keepNext:true}));if(v.signatureLine)body.push(p('____________________________',false,{keepNext:true}));body.push(p(doc.signer||l.signer,true,{keepNext:true}));body.push(p(doc.signerTitle));}
 if(doc.stampEnabled){const png=await stampPNG(doc),d=stampDimensions(doc);body.unshift(new Paragraph({children:[new ImageRun({type:'png',data:data(png),transformation:{width:doc.stampWidth/25.4*96,height:doc.stampWidth*d.height/d.width/25.4*96,rotation:doc.stampRotation},floating:{horizontalPosition:{relative:HorizontalPositionRelativeFrom.PAGE,offset:Math.round(doc.stampX*36000)},verticalPosition:{relative:VerticalPositionRelativeFrom.PAGE,offset:Math.round(doc.stampY*36000)},behindDocument:false,allowOverlap:true,wrap:{type:TextWrappingType.NONE}}})]}));}
 const headerExtra=(doc.logo&&v.logo?25:0)+c.fields.filter(f=>f.section==='header').length*7;const footerExtra=c.fields.filter(f=>f.section==='footer').length*7+Math.ceil((footer.note.length+footer.contact.length)/130)*3;
 const document=new Document({creator:doc.company,title:documentTitle(doc),description:'Editable employer document prepared locally',styles:{default:{document:{run:{font,size,color:ink},paragraph:{spacing:{after:110}}}}},sections:[{properties:{page:{size:{width:mm(doc.paper==='A4'?210:215.9),height:mm(doc.paper==='A4'?297:279.4)},margin:{top:mm(v.header?48+headerExtra:18),bottom:mm(v.footer?28+footerExtra:18),left:mm(doc.template==='framed'?23:18),right:mm(doc.template==='framed'?23:18),header:mm(10),footer:mm(10)},borders:doc.template==='framed'?{pageBorderTop:border,pageBorderBottom:border,pageBorderLeft:border,pageBorderRight:border}:undefined}},headers:v.header?{default:header}:undefined,footers:v.footer?{default:new Footer({children:footerChildren})}:undefined,children:body}]});
 return Packer.toBlob(document);
}
