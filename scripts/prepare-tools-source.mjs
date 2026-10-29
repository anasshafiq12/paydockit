import {cp,readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();const target=path.join(root,'deployments/tools');await mkdir(target,{recursive:true});
const excluded=new Set(['node_modules','.git','.next','out','deployments','.openai']);
for(const entry of await readdir(root,{withFileTypes:true})){if(excluded.has(entry.name)||entry.name.endsWith('.tar.gz'))continue;await cp(path.join(root,entry.name),path.join(target,entry.name),{recursive:true,filter:source=>!source.split(path.sep).some(s=>excluded.has(s)&&source!==root)&&!source.endsWith('.tsbuildinfo')});}
for(const app of ['public-site','private-tools'])await cp(path.join(root,'apps',app,'out'),path.join(target,'apps',app,'out'),{recursive:true});
console.log('Prepared a complete source copy and matching built static outputs for the tools Site.');
