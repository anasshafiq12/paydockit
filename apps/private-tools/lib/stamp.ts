import {stampSVG,stampDimensions} from '@shared/stamps/render';
import type {StampSettings} from '@shared/stamps/schema';
import {download} from './local';
export {stampSVG,stampDimensions};
export async function stampPNG(doc:Partial<StampSettings>){
 const svg=stampSVG(doc,'export-stamp'),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 try{const img=new Image();img.src=url;await img.decode();const {width,height}=stampDimensions(doc);const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=Math.round(1200*height/width);canvas.getContext('2d')!.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/png');}finally{URL.revokeObjectURL(url);}
}
export async function exportStamp(doc:Partial<StampSettings>,type:'svg'|'png'){
 if(type==='svg'){download(new Blob([stampSVG(doc,'export-stamp')],{type:'image/svg+xml'}),'business-stamp.svg');return;}
 const data=await stampPNG(doc);const response=await fetch(data);download(await response.blob(),'business-stamp.png');
}
