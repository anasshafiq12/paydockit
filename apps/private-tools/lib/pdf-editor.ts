import {PDFDocument,degrees} from 'pdf-lib';
export type Mark={id:string;kind:'text'|'image'|'highlight'|'box'|'path';x:number;y:number;w:number;h:number;angle:number;opacity:number;color:string;text?:string;fontSize?:number;src?:string;points?:{x:number;y:number}[]};
export type PDFSheet={id:string;source:number;index:number;rotation:number;width:number;height:number;marks:Mark[]};
export function rotateSheet(page:PDFSheet):PDFSheet{return {...page,rotation:(page.rotation+90)%360,width:page.height,height:page.width,marks:page.marks.map(m=>({...m,x:1-m.y,y:m.x,w:m.w*page.width/page.height,h:m.h*page.height/page.width,angle:(m.angle+90)%360}))};}
export function overlayPlacement(rotation:number,x:number,y:number,width:number,height:number){
 const r=((rotation%360)+360)%360;
 return {x:x+(r===90||r===180?width:0),y:y+(r===180||r===270?height:0),rotate:degrees(r),width:r===90||r===270?height:width,height:r===90||r===270?width:height};
}
export async function exportEditedPDF(sources:Uint8Array[],pages:PDFSheet[],overlay:(page:PDFSheet)=>Promise<string|null>){
 if(!pages.length)throw new Error('Keep at least one page.');
 const docs=await Promise.all(sources.map(bytes=>PDFDocument.load(bytes)));
 const output=await PDFDocument.create();
 for(const sheet of pages){
  const [page]=await output.copyPages(docs[sheet.source],[sheet.index]);output.addPage(page);
  const rotation=(page.getRotation().angle+sheet.rotation)%360;page.setRotation(degrees(rotation));
  const png=await overlay(sheet);
  if(png){const image=await output.embedPng(png),crop=page.getCropBox();page.drawImage(image,overlayPlacement(rotation,crop.x,crop.y,crop.width,crop.height));}
 }
 output.setProducer('PayDockit - local PDF workspace');return output.save();
}
export async function drawMarks(canvas:HTMLCanvasElement,sheet:PDFSheet,scale=1){
 canvas.width=Math.ceil(sheet.width*scale);canvas.height=Math.ceil(sheet.height*scale);
 const ctx=canvas.getContext('2d')!;ctx.scale(scale,scale);
 for(const m of sheet.marks){
  const w=m.w*sheet.width,h=m.h*sheet.height;
  ctx.save();ctx.translate(m.x*sheet.width,m.y*sheet.height);ctx.rotate(m.angle*Math.PI/180);ctx.globalAlpha=m.opacity;ctx.fillStyle=m.color;ctx.strokeStyle=m.color;
  if(m.kind==='image'&&m.src){const image=new Image();image.src=m.src;await image.decode();ctx.drawImage(image,-w/2,-h/2,w,h);}
  if(m.kind==='text'){
   const size=m.fontSize||18;ctx.font=`${size}px Arial`;ctx.textBaseline='top';
   let y=-h/2;for(const line of (m.text||'').split('\n')){let current='';for(const word of line.split(' ')){const next=current?current+' '+word:word;if(ctx.measureText(next).width>w&&current){if(y+size<=h/2)ctx.fillText(current,-w/2,y,w);y+=size*1.25;current=word;}else current=next;}if(y+size<=h/2)ctx.fillText(current,-w/2,y,w);y+=size*1.25;}
  }
  if(m.kind==='highlight')ctx.fillRect(-w/2,-h/2,w,h);
  if(m.kind==='box'){ctx.lineWidth=2;ctx.strokeRect(-w/2,-h/2,w,h);}
  if(m.kind==='path'&&m.points?.length){ctx.lineWidth=2;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();m.points.forEach((p,i)=>i?ctx.lineTo((p.x-.5)*w,(p.y-.5)*h):ctx.moveTo((p.x-.5)*w,(p.y-.5)*h));ctx.stroke();}
  ctx.restore();
 }
 return canvas;
}
