import {readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
async function files(dir){let result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await files(file));else if(entry.name.endsWith('.html'))result.push(file);}return result;}
for(const app of ['public-site','private-tools']){
 const root=path.resolve(`apps/${app}/out`);let content=`/*\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n${app==='private-tools'?'  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n':''}`;
 for(const file of await files(root)){
  const html=await readFile(file,'utf8');const hashes=[...new Set([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].filter(m=>m[1]).map(m=>`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`))];
  const route='/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');
  content+=`\n${route}\n  Content-Security-Policy: default-src 'self'; script-src 'self' ${hashes.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'\n`;
 }
 await writeFile(path.join(root,'_headers'),content);console.log(`${app}: wrote static security headers (script hashes, no remote script hosts).`);
}
