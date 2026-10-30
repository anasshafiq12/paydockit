import {describe,it,expect} from 'vitest';
import {PDFDocument,degrees,StandardFonts} from 'pdf-lib';
import {rotateSheet,overlayPlacement,exportEditedPDF,type PDFSheet} from '../apps/private-tools/lib/pdf-editor';
const sheet=(index=0):PDFSheet=>({id:String(index),source:0,index,rotation:0,width:200,height:300,marks:[]});
describe('local PDF editing export',()=>{
 it('maps display overlays onto cropped, rotated PDF coordinates',()=>{
  expect(overlayPlacement(0,10,20,200,300)).toMatchObject({x:10,y:20,width:200,height:300});
  expect(overlayPlacement(90,10,20,200,300)).toMatchObject({x:210,y:20,width:300,height:200});
  expect(overlayPlacement(180,10,20,200,300)).toMatchObject({x:210,y:320,width:200,height:300});
  expect(overlayPlacement(270,10,20,200,300)).toMatchObject({x:10,y:320,width:300,height:200});
 });
 it('rotates mark positions and preserves physical size through four turns',()=>{const original={...sheet(),marks:[{id:'m',kind:'image' as const,x:.2,y:.3,w:.4,h:.1,angle:0,opacity:1,color:'#000000'}]};let p=original;for(let i=0;i<4;i++)p=rotateSheet(p);expect(p.width).toBe(200);expect(p.height).toBe(300);expect(p.marks[0].x).toBeCloseTo(.2);expect(p.marks[0].y).toBeCloseTo(.3);expect(p.marks[0].w).toBeCloseTo(.4);expect(p.marks[0].h).toBeCloseTo(.1);});
 it('merges sources, reorders/removes pages and retains source rotation and content',async()=>{const a=await PDFDocument.create(),b=await PDFDocument.create();const font=await a.embedFont(StandardFonts.Helvetica);a.addPage([200,300]).drawText('Retained original',{font});a.addPage([400,500]);b.addPage([600,700]).setRotation(degrees(90));const bytes=await exportEditedPDF([await a.save(),await b.save()],[{...sheet(),source:1,rotation:90},{...sheet(),rotation:90}],async()=>null);const result=await PDFDocument.load(bytes);expect(result.getPageCount()).toBe(2);expect(result.getPage(0).getWidth()).toBe(600);expect(result.getPage(0).getRotation().angle).toBe(180);expect(result.getPage(1).getWidth()).toBe(200);expect(result.getPage(1).node.Contents()).toBeTruthy();});
 it('rejects an empty document and encrypted/malformed input',async()=>{await expect(exportEditedPDF([],[],async()=>null)).rejects.toThrow('at least one');await expect(exportEditedPDF([new Uint8Array([1,2,3])],[sheet()],async()=>null)).rejects.toThrow();});
});
