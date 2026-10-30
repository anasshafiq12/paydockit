import type {jsPDF} from 'jspdf';
export type PDFFontData=Record<string,string>;
const cache=new Map<string,Promise<string>>();
async function fontData(name:string){if(!cache.has(name))cache.set(name,(async()=>{try{const response=await fetch('/fonts/'+name+'.ttf');if(!response.ok)throw new Error('Font unavailable');const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(binary);}catch{cache.delete(name);throw new Error('The local PDF font could not load. Retry or use Print / Save as PDF.');}})());return cache.get(name)!;}
export async function installPDFFonts(pdf:jsPDF,text:string,bodyFont:string,centered:boolean,provided?:PDFFontData){
 if(!/[^\x00-\xff\u2010-\u2027\u20ac]/.test(text))return (font:string)=>font;
 const families=['NotoSans',...(bodyFont==='times'||centered?['NotoSerif']:[]),...(bodyFont==='courier'?['NotoSansMono']:[])];
 for(const family of families){for(const [variant,style] of [['Regular','normal'],['Bold','bold']]){const name=family+'-'+variant;const data=provided?.[name]||await fontData(name);pdf.addFileToVFS(name+'.ttf',data);pdf.addFont(name+'.ttf',family,style);}}
 pdf.setFont('NotoSans','normal');
 const metadata=pdf.getFont().metadata as unknown as {characterToGlyph:(code:number)=>number};
 for(const char of text){const code=char.codePointAt(0)!;if(code>127&&!metadata.characterToGlyph(code))throw new Error('Some characters need a wider font. Use Print / Save as PDF to preserve them.');}
 return (font:string)=>font==='times'?'NotoSerif':font==='courier'?'NotoSansMono':'NotoSans';
}
