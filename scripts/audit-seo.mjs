import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';

// Offline regression checks for the exact static files and Vercel routes being deployed.
// This does not simulate browser rendering or measure rankings, field CWV, or rich-result eligibility.
const root=path.resolve('.vercel/output/static');
const config=JSON.parse(await readFile('.vercel/output/config.json','utf8'));
const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message);};
const decode=value=>value.replace(/&(?:amp|quot|apos|lt|gt|#39|#(\d+)|#x([a-f\d]+));/gi,(match,decimal,hex)=>decimal?String.fromCodePoint(Number(decimal)):hex?String.fromCodePoint(parseInt(hex,16)):({'&amp;':'&','&quot;':'"','&apos;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'}[match.toLowerCase()]||match));
const text=html=>decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
function attributes(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([,name,double,single])=>[name.toLowerCase(),decode(double??single)]));}
function meta(html,name){return [...html.matchAll(/<meta\b[^>]*>/gi)].map(m=>attributes(m[0])).find(a=>a.name===name||a.property===name)?.content||'';}
const canonical=html=>[...html.matchAll(/<link\b[^>]*>/gi)].map(m=>attributes(m[0])).find(a=>a.rel==='canonical')?.href||'';
async function staticFile(pathname){
 const filename=path.resolve(root,'.'+decodeURIComponent(pathname));
 if(filename!==root&&!filename.startsWith(root+path.sep))return null;
 try{const info=await stat(filename);if(info.isFile())return filename;if(info.isDirectory()){const index=path.join(filename,'index.html');if((await stat(index)).isFile())return index;}}catch{}
 return null;
}
async function resolve(requestUrl,depth=0){
 if(depth>5)return {status:508,headers:{},file:null};
 const url=new URL(requestUrl);const headers={};
 for(const route of config.routes||[]){
  if(route.handle==='filesystem'){const file=await staticFile(url.pathname);if(file)return {status:200,headers,file,url:url.href};continue;}
  if(!route.src||!new RegExp('^(?:'+route.src+')$').test(url.pathname))continue;
  Object.assign(headers,route.headers||{});
  if(route.status>=300&&route.status<400&&headers.Location){
   const redirect=new URL(headers.Location,url);
   return {status:route.status,headers,file:null,url:url.href,redirect:redirect.href};
  }
  if(route.dest){const file=await staticFile(new URL(route.dest,url).pathname);return {status:route.status|| (file?200:404),headers,file,url:url.href};}
  if(route.continue)continue;
 }
 return {status:404,headers,file:null,url:url.href};
}
async function follow(url,depth=0){const result=await resolve(url);if(result.redirect&&depth<5)return follow(result.redirect,depth+1);return result;}
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map(m=>decode(m[1].trim()));
assert(urls.length>0,'Sitemap has no URLs.');
assert(new Set(urls).size===urls.length,'Sitemap contains duplicate URLs.');
const origin=new URL(urls[0]).origin;
const workspaces=['payslip','employment-certificate','salary-certificate','stamp-maker','calculator','rules','batch'];
const isWorkspace=pathname=>workspaces.some(slug=>pathname===`/${slug}`||pathname.startsWith(`/${slug}/`));
const robots=await readFile(path.join(root,'robots.txt'),'utf8');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`),'robots.txt must reference the canonical sitemap.');
assert(!/^Disallow:\s*\/\s*$/mi.test(robots),'robots.txt blocks the whole site.');
const pages=[];const links=new Set();const titles=new Map();const descriptions=new Map();
for(const url of urls){
 const parsed=new URL(url);assert(parsed.origin===origin,`Noncanonical origin in sitemap: ${url}`);assert(!isWorkspace(parsed.pathname),`Workspace included in sitemap: ${url}`);
 const route=await resolve(url);assert(route.status===200&&!!route.file,`Public page does not resolve directly to a static 200: ${url}`);if(!route.file)continue;
 const html=await readFile(route.file,'utf8');const title=text(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');const description=meta(html,'description');
 const h1=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>text(m[1]));const canonicalUrl=canonical(html);const robotsMeta=meta(html,'robots');const visible=text(html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]||'');
 assert(!!title,`Missing title: ${url}`);assert(!!description,`Missing description: ${url}`);assert(h1.length===1&&!!h1[0],`Expected one nonempty H1: ${url}`);
 assert(canonicalUrl===url,`Canonical mismatch: ${url} -> ${canonicalUrl}`);assert(!/noindex/i.test(robotsMeta+' '+(route.headers['X-Robots-Tag']||'')),`Public page is noindex: ${url}`);
 assert(/width=device-width/i.test(meta(html,'viewport')),`Missing responsive viewport: ${url}`);
 assert(!titles.has(title),`Duplicate title: ${url} and ${titles.get(title)}`);assert(!descriptions.has(description),`Duplicate description: ${url} and ${descriptions.get(description)}`);titles.set(title,url);descriptions.set(description,url);
 const executableScripts=[...html.matchAll(/<script\b[^>]*>/gi)].filter(m=>{const a=attributes(m[0]);return a.src&&a.type!=='application/ld+json';});
 assert(executableScripts.length===0,`Public page ships executable script source: ${url}`);assert(!/jazzygecko24\.chatgpt\.site|paydockit\.vercel\.app/.test(html),`Old production host remains: ${url}`);
 const schema=[];
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(attributes(match[1]).type!=='application/ld+json')continue;try{const data=JSON.parse(match[2]);schema.push(...(Array.isArray(data)?data:data['@graph']||[data]));}catch{failures.push(`Invalid JSON-LD: ${url}`);}}
 for(const item of schema){const types=[item['@type']].flat();const name=types.includes('Article')?item.headline:types.includes('WebApplication')?item.name:null;if(name)assert(visible.toLowerCase().includes(String(name).toLowerCase()),`Primary schema name is not visible: ${url}: ${name}`);}
 const internalLinks=[];
 for(const match of html.matchAll(/<a\b[^>]*>/gi)){const href=attributes(match[0]).href;if(!href)continue;try{const destination=new URL(href,url);if(destination.origin===origin){destination.hash='';links.add(destination.href);internalLinks.push(destination.href);}}catch{failures.push(`Malformed link on ${url}: ${href}`);}}
 const alias=parsed.pathname==='/'?'/index.html':parsed.pathname+'index.html';const aliasRoute=await resolve(origin+alias);
 assert([301,308].includes(aliasRoute.status)&&aliasRoute.redirect===url,`index.html alias does not permanently redirect to canonical: ${alias}`);
 pages.push({url,status:route.status,title,description,h1,canonical:canonicalUrl,robots:robotsMeta,scriptSrcCount:executableScripts.length,htmlBytes:Buffer.byteLength(html),schemaTypes:schema.map(s=>s['@type']),internalLinks});
}
const linkChecks=[];
for(const url of links){const result=await follow(url);assert(result.status===200,`Broken internal href: ${url} (${result.status})`);linkChecks.push({url,status:result.status});}
const editors=[];
for(const slug of workspaces){const url=`${origin}/${slug}/`;const result=await resolve(url);assert(result.status===200&&!!result.file,`Workspace unavailable: ${url}`);if(!result.file)continue;const html=await readFile(result.file,'utf8');const tags=meta(html,'robots')+' '+(result.headers['X-Robots-Tag']||'');assert(/noindex/i.test(tags),`Workspace lost noindex: ${url}`);assert(result.headers['Cache-Control']==='no-store',`Workspace lost no-store: ${url}`);editors.push({url,status:result.status,robots:tags,cacheControl:result.headers['Cache-Control']});}
const hashed=await resolve(origin+'/_next/static/chunks/audit-example.js');
assert(/max-age=31536000/.test(hashed.headers['Cache-Control']||'')&&/immutable/.test(hashed.headers['Cache-Control']||''),'Hashed /_next/static assets need one-year immutable caching.');
const missing=await resolve(origin+'/seo-audit-definitely-missing/');assert(missing.status===404,'Unknown paths must return a real 404.');
const orphanSitemapUrls=urls.filter(url=>url!==origin+'/'&&!pages.some(page=>page.internalLinks.includes(url)));assert(orphanSitemapUrls.length===0,'Orphan sitemap URLs: '+orphanSitemapUrls.join(', '));
const report={auditedAt:new Date().toISOString(),site:origin,scope:'Offline validation of generated static HTML and Vercel route configuration. No browser rendering, external rich-result validation, rankings, or field Core Web Vitals are measured.',passed:failures.length===0,sitemapUrls:urls.length,pages,internalLinkChecks:linkChecks,orphanSitemapUrls,workspaces:editors,checks:{robotsSitemap:true,immutableAssetCaching:hashed.headers['Cache-Control'],missingRouteStatus:missing.status},failures};
await mkdir('docs/qa',{recursive:true});await writeFile('docs/qa/seo-after-2026-10-30.json',JSON.stringify(report,null,2));
console.log(`SEO regression: ${pages.length} public pages, ${links.size} internal links, ${editors.length} workspaces; ${failures.length} failures.`);
if(failures.length){for(const failure of failures)console.error('- '+failure);process.exitCode=1;}
