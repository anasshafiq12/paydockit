import {safeParseProject,type PayrollDocument} from '@shared/domain';
const prefix='paydockit:';
export function saveLocal(key:string,value:unknown){localStorage.setItem(prefix+key,JSON.stringify({expires:Date.now()+30*24*3600*1000,value}));}
export function readLocal<T>(key:string):T|null {try{const raw=localStorage.getItem(prefix+key);if(!raw)return null;const parsed=JSON.parse(raw);if(parsed.expires<Date.now()){localStorage.removeItem(prefix+key);return null;}return parsed.value as T;}catch{return null;}}
export function listDrafts(){const results:{key:string;doc:PayrollDocument}[]=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)!;if(!key.startsWith(prefix+'draft-'))continue;const value=readLocal<PayrollDocument>(key.slice(prefix.length));if(value)try{results.push({key:key.slice(prefix.length),doc:safeParseProject(JSON.stringify(value))});}catch{/* Invalid local records are not loaded. */}}return results;}
export function clearLocal(){for(const key of Object.keys(localStorage))if(key.startsWith(prefix))localStorage.removeItem(key);for(const key of Object.keys(sessionStorage))if(key.startsWith(prefix))sessionStorage.removeItem(key);}
export function download(blob:Blob,filename:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function exportJSON(data:unknown,filename:string){download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),filename);}
export async function imageData(file:File):Promise<string>{
  if(file.size>5*1024*1024)throw new Error('Choose an image smaller than 5 MB.');
  const head=new Uint8Array(await file.slice(0,12).arrayBuffer());
  const png=head[0]===137&&head[1]===80&&head[2]===78&&head[3]===71;
  const jpg=head[0]===255&&head[1]===216&&head[2]===255;
  const webp=String.fromCharCode(...head.slice(0,4))==='RIFF'&&String.fromCharCode(...head.slice(8,12))==='WEBP';
  if(!png&&!jpg&&!webp)throw new Error('Only valid PNG, JPEG, and WebP images are supported. SVG uploads are disabled.');
  const bitmap=await createImageBitmap(file);
  if(bitmap.width*bitmap.height>16_000_000){bitmap.close();throw new Error('Image exceeds the 16 megapixel limit.');}
  const canvas=document.createElement('canvas');const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);canvas.getContext('2d')!.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();return canvas.toDataURL('image/png');
}
