import {cp,readFile,mkdir} from 'node:fs/promises';
const config=JSON.parse(await readFile('.openai/deploy-target.json','utf8'));
if(!['public-site','private-tools'].includes(config.app))throw new Error('Invalid static deployment target.');
await mkdir('out',{recursive:true});
await cp(`apps/${config.app}/out`,'out',{recursive:true});
console.log(`Staged ${config.app} in the static out directory.`);
