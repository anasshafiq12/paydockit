import {readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
async function allFiles(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await allFiles(file));else files.push(file);}return files;}
// Public pages use native links/details and have no client components. Keep the
// statically rendered React HTML and JSON-LD without shipping an unused runtime.
for(const source of [...await allFiles('apps/public-site/app'),...await allFiles('apps/public-site/components')].filter(f=>/\.[jt]sx?$/.test(f))){if(/['"]use client['"]/.test(await readFile(source,'utf8')))throw new Error('Public client component found: disable runtime stripping or use native HTML before deploying.');}
let count=0;
for(const file of (await allFiles('apps/public-site/out')).filter(f=>f.endsWith('.html'))){let html=await readFile(file,'utf8');html=html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi,(whole,attrs)=>/type="application\/ld\+json"/i.test(attrs)?whole:'').replace(/<link\b(?=[^>]*\bas="script")[^>]*>/gi,'');await writeFile(file,html);count++;}
console.log(`Optimized ${count} public HTML pages: native interactions, preserved structured data, no unused hydration runtime.`);
