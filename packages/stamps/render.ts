import {stampSettingsSchema,type StampSettings} from './schema';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
export function stampDimensions(input:Partial<StampSettings>){const shape=input.stampShape||'circle';return {width:240,height:shape==='oval'?170:shape==='rectangle'||shape==='rounded'?156:240};}
export function supportsCurvedText(input:Partial<StampSettings>){return !/[\u0590-\u08ff\ufb1d-\ufeff]/.test([input.stampText,input.stampSubtext].join(' '));}
export function stampSVG(input:Partial<StampSettings>,idPrefix='paydockit-stamp'){
 const d=stampSettingsSchema.parse(input),{width,height}=stampDimensions(d),cx=width/2,cy=height/2;
 const prefix='s-'+idPrefix.replace(/[^a-zA-Z0-9_-]/g,'');
 const font=d.stampFont==='serif'?'Georgia, Times New Roman, serif':d.stampFont==='mono'?'Courier New, monospace':'Arial, Helvetica, sans-serif';
 const round=d.stampShape==='circle'||d.stampShape==='oval',curved=round&&d.stampLayout==='curved'&&supportsCurvedText(d);
 const stroke=d.stampBorderWidth*240/d.stampWidth,mmHeight=d.stampWidth*height/width;
 const txt=(s:string)=>d.stampUppercase?s.toUpperCase():s;
 const top=txt(d.stampText||'YOUR COMPANY'),bottom=txt(d.stampSubtext),lines=d.stampCenterLines.map(txt).filter(Boolean);
 const pointUnits=240/(d.stampWidth*72/25.4),outerSize=d.stampTextSize*pointUnits,centerSize=d.stampCenterSize*pointUnits;
 const fit=(text:string,size:number,available:number)=>{const weight=Array.from(text).reduce((sum,c)=>sum+(/[MW@]/.test(c)?.94:/[I1il| .]/.test(c)?.32:.64),0);return Math.max(1,Math.min(size,(available-Math.max(0,text.length-1)*d.stampSpacing)/Math.max(1,weight)));};
 const textWidth=(y:number)=>round?Math.max(50,2*(cx-(curved?46:14))*Math.sqrt(Math.max(.15,1-((y-cy)/(cy-(curved?(d.stampShape==='oval'?39:46):14)))**2))-28):198;
 const text=(s:string,x:number,y:number,size:number,bold=false)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${fit(s,size,textWidth(y)).toFixed(2)}" font-weight="${bold?700:400}" letter-spacing="${d.stampSpacing}" direction="${/[\u0590-\u08ff]/.test(s)?'rtl':'ltr'}" unicode-bidi="plaintext">${escape(s)}</text>`;
 let borders='';
 for(let i=0;i<d.stampBorderCount;i++){
  let inset=8+i*6;
  if(curved&&d.stampBorderCount>1&&i===d.stampBorderCount-1)inset=d.stampShape==='oval'?39:46;
  if(round)borders+=`<ellipse cx="${cx}" cy="${cy}" rx="${cx-inset}" ry="${cy-inset}" stroke-width="${i===0?stroke:Math.max(.8,stroke*.55)}"/>`;
  else borders+=`<rect x="${inset}" y="${inset}" width="${width-inset*2}" height="${height-inset*2}" rx="${d.stampShape==='rounded'?12:0}" stroke-width="${i===0?stroke:Math.max(.8,stroke*.55)}"/>`;
 }
 const ornament=(x:number,y:number)=>d.stampSeparator==='none'?'':d.stampSeparator==='dot'?`<circle cx="${x}" cy="${y}" r="3"/>`:d.stampSeparator==='diamond'?`<path d="M${x} ${y-5}l4 5-4 5-4-5Z"/>`:`<path d="M${x} ${y-5}l1.5 3.3 3.5.5-2.5 2.4.6 3.5-3.1-1.7-3.1 1.7.6-3.5-2.5-2.4 3.5-.5Z"/>`;
 let wording='',defs='';
 if(curved){
  const rx=91,topRy=d.stampShape==='oval'?50:83,bottomRy=d.stampShape==='oval'?60:96;
  defs=`<defs><path id="${prefix}-top" d="M ${cx-rx},${cy} A ${rx},${topRy} 0 0 1 ${cx+rx},${cy}"/><path id="${prefix}-bottom" d="M ${cx-rx},${cy} A ${rx},${bottomRy} 0 0 0 ${cx+rx},${cy}"/></defs>`;
  const arc=(s:string,path:string)=>`<text font-size="${fit(s,outerSize,245).toFixed(2)}" font-weight="700" letter-spacing="${d.stampSpacing}" text-anchor="middle"><textPath href="#${prefix}-${path}" startOffset="50%">${escape(s)}</textPath></text>`;
  wording=arc(top,'top')+(bottom?arc(bottom,'bottom'):'');
  wording+=ornament(cx-94,cy)+ornament(cx+94,cy);
  const lineGap=d.stampShape==='oval'?17:22;const start=cy-(lines.length-1)*lineGap/2;
  lines.forEach((line,i)=>{wording+=text(line,cx,start+i*lineGap,centerSize,i===0);});
  if(d.stampCenterRule&&lines.length>0){const dy=Math.min(d.stampShape==='oval'?31:48,(lines.length-1)*lineGap/2+14);borders+=`<path d="M ${cx-44} ${cy-dy}h88 M ${cx-44} ${cy+dy}h88" stroke-width="1"/>`;}
 }else if(d.stampTemplate==='legacy'&&lines.length===0){
  wording=text(top,cx,cy-8,outerSize,true)+text(bottom,cx,cy+26,outerSize*.55);
  borders+=`<path d="M 43 ${cy+7}h154" stroke-width="1"/>`;
 }else{
  const outerGap=round?d.stampShape==='oval'?41:78:height/2-24;
  wording=text(top,cx,cy-outerGap,outerSize,true)+(bottom?text(bottom,cx,cy+outerGap,outerSize*.65):'');
  const availableHeight=Math.max(25,outerGap*2-30),gap=Math.min(25,availableHeight/Math.max(1,lines.length));const start=cy-(lines.length-1)*gap/2;
  lines.forEach((line,i)=>{wording+=text(line,cx,start+i*gap,centerSize,i===0);});
  if(d.stampCenterRule&&lines.length){const y=cy-outerGap+13;borders+=`<path d="M 32 ${y}h176" stroke-width="1"/>`;}
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${d.stampWidth}mm" height="${mmHeight}mm" viewBox="0 0 ${width} ${height}" role="img" aria-label="Business stamp"><title>${escape(top)} business stamp</title>${defs}<g opacity="${d.stampOpacity}" color="${d.stampColor}" font-family="${font}"><g fill="none" stroke="currentColor">${borders}</g><g fill="currentColor" stroke="none">${wording}</g></g></svg>`;
}
