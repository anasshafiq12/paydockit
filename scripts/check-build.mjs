import {readFile,readdir,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {adsenseScriptSrc,isAdSenseScript} from './adsense.mjs';
async function htmlFiles(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await htmlFiles(file));else if(entry.name.endsWith('.html'))result.push(file);}return result;}
const report=[];
for(const app of ['public-site','private-tools']){
 const root=path.resolve(`apps/${app}/out`);const html=await readFile(path.join(root,app==='public-site'?'index.html':'payslip/index.html'),'utf8');
 const scripts=[...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]))];let gzip=0;
 const externalScripts=[];
 for(const src of scripts){if(app==='public-site'&&src===adsenseScriptSrc){externalScripts.push(src);continue;}if(!src.startsWith('/'))throw new Error(`External script in ${app}: ${src}`);gzip+=gzipSync(await readFile(path.join(root,src.split('?')[0]))).length;}
 for(const file of await htmlFiles(root)){
  const page=await readFile(file,'utf8');
  if(/^google-site-verification: google[a-f0-9]+\.html\s*$/.test(page))continue;
  const tags=[...page.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script>/gi)];
  const ads=tags.filter(match=>isAdSenseScript(match[1]));
  if(app==='public-site'){
   if(ads.length!==1||!page.slice(0,page.indexOf('</head>')).includes(ads[0][0]))throw new Error(`Expected one AdSense script in the head: ${file}`);
   for(const tag of tags){const src=tag[1].match(/\bsrc="([^"]+)"/i)?.[1];if(src&&!isAdSenseScript(tag[1]))throw new Error(`Unexpected public script: ${file}: ${src}`);}
  }else if(/googlesyndication|google-analytics|googletagmanager|hotjar|clarity\.ms/i.test(page))throw new Error(`Unexpected third-party tracking host in private workspace: ${file}`);
 }
 if(app==='public-site'&&(await readFile(path.join(root,'ads.txt'),'utf8')).trim()!=='google.com, pub-9360996257353318, DIRECT, f08c47fec0942fa0')throw new Error('AdSense publisher missing from ads.txt.');
 report.push({app,initialScriptCount:scripts.length,externalScripts,initialScriptGzipBytes:gzip,budgetBytes:(app==='public-site'?150:250)*1024,withinBudget:gzip<=(app==='public-site'?150:250)*1024});
 if(app==='public-site'){for(const needle of ['<h1','rel="canonical"','application/ld+json'])if(!html.includes(needle))throw new Error(`SEO output missing ${needle}`);await stat(path.join(root,'sitemap.xml'));await stat(path.join(root,'robots.txt'));}
 else if(!html.includes('noindex'))throw new Error('Private page must be noindex.');
}
await writeFile('docs/build-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
