import {readFile,readdir,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const report=[];
for(const app of ['public-site','private-tools']){
 const root=path.resolve(`apps/${app}/out`);const html=await readFile(path.join(root,app==='public-site'?'index.html':'payslip/index.html'),'utf8');
 const scripts=[...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]))];let gzip=0;
 for(const src of scripts){if(!src.startsWith('/'))throw new Error(`External script in ${app}: ${src}`);gzip+=gzipSync(await readFile(path.join(root,src.split('?')[0]))).length;}
 if(/googlesyndication|google-analytics|googletagmanager|hotjar|clarity\.ms/i.test(html))throw new Error('Unexpected third-party tracking host.');
 report.push({app,initialScriptCount:scripts.length,initialScriptGzipBytes:gzip,budgetBytes:(app==='public-site'?150:250)*1024,withinBudget:gzip<=(app==='public-site'?150:250)*1024});
 if(app==='public-site'){for(const needle of ['<h1','rel="canonical"','application/ld+json'])if(!html.includes(needle))throw new Error(`SEO output missing ${needle}`);await stat(path.join(root,'sitemap.xml'));await stat(path.join(root,'robots.txt'));}
 else if(!html.includes('noindex'))throw new Error('Private page must be noindex.');
}
await writeFile('docs/build-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
