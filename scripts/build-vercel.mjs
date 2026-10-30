import {spawnSync} from 'node:child_process';
import {cp,mkdir,readdir,readFile,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const origin=new URL(process.env.PAYDOCKIT_SITE_URL||'https://paydockit.vercel.app').origin;
const npm=process.env.npm_execpath;
if(!npm)throw new Error('Run this script through npm run build:vercel.');
const build=spawnSync(process.execPath,[npm,'run','build'],{stdio:'inherit',env:{...process.env,NEXT_PUBLIC_SITE_URL:origin,NEXT_PUBLIC_TOOLS_URL:origin,NEXT_TELEMETRY_DISABLED:'1'}});
if(build.status!==0)process.exit(build.status||1);

const output=path.resolve(root,'.vercel/output');
// This script owns only the generated Build Output API directory.
if(output!==path.join(root,'.vercel','output'))throw new Error('Invalid output directory.');
await rm(output,{recursive:true,force:true});
const destination=path.join(output,'static');
await mkdir(destination,{recursive:true});
async function files(directory){const result=[];for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())result.push(...await files(file));else result.push(file);}return result;}
const tools=['payslip','employment-certificate','salary-certificate','stamp-maker','calculator','rules','batch'];
const exported=[];
for(const app of ['public-site','private-tools']){
 const source=path.join(root,'apps',app,'out');
 for(const file of await files(source)){
  const relative=path.relative(source,file).split(path.sep).join('/');
  if(relative==='_headers')continue;
  if(app==='private-tools'&&!tools.includes(relative.split('/')[0])&&!['_next','fonts'].includes(relative.split('/')[0]))continue;
  const target=path.join(destination,relative);
  const bytes=await readFile(file);
  try{const existing=await readFile(target);if(!existing.equals(bytes))throw new Error('Conflicting static asset: '+relative);continue;}catch(error){if(error.code!=='ENOENT')throw error;}
  await mkdir(path.dirname(target),{recursive:true});await cp(file,target);
  if(relative.endsWith('.html'))exported.push({relative,app});
 }
}
const baseline={'Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
const toolPattern=`/(?:${tools.join('|')})(?:/.*)?`;
const routes=[{src:'/(.*)',headers:baseline,continue:true},{src:toolPattern,headers:{'X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store'},continue:true}];
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const {relative,app} of exported){
 if(!relative.endsWith('index.html'))continue;
 const route='/'+relative.replace(/index\.html$/,'');
 const html=await readFile(path.join(destination,relative),'utf8');
 if(html.includes('jazzygecko24.chatgpt.site'))throw new Error('Legacy hosting URL remains in '+relative);
 if(app==='public-site'&&relative==='index.html'&&!html.includes(origin+'/payslip/'))throw new Error('Open tools does not point at this deployment.');
 const headerFile=await readFile(path.join(root,'apps',app,'out/_headers'),'utf8');
 const section=headerFile.split('\n'+route+'\n')[1]?.split('\n\n')[0];
 const policy=section?.match(/Content-Security-Policy: (.+)/)?.[1];
 if(!policy)throw new Error('Missing content security policy for '+route);
 if(route!=='/')routes.push({src:'^'+escape(route.slice(0,-1))+'$',status:308,headers:{Location:route}});
 routes.push({src:'^'+escape(route)+'$',dest:'/'+relative,headers:{'Content-Security-Policy':policy}});
 routes.push({src:'^/'+escape(relative)+'$',headers:{'Content-Security-Policy':policy},continue:true});
}
routes.push({handle:'filesystem'},{src:'/(.*)',dest:'/404.html',status:404});
await writeFile(path.join(output,'config.json'),JSON.stringify({version:3,routes},null,2));
for(const tool of tools)await readFile(path.join(destination,tool,'index.html'));
console.log(`Vercel: staged public pages and all ${tools.length} tool routes at ${origin}, with page-specific security headers.`);
