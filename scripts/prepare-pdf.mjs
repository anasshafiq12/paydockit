import {fileURLToPath} from 'node:url';
import path from 'node:path';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
import {cp,mkdir} from 'node:fs/promises';
const dest='apps/private-tools/public/pdf-assets';
await mkdir(dest,{recursive:true});
for(const file of ['build/pdf.worker.min.mjs','cmaps','standard_fonts','wasm'])await cp('node_modules/pdfjs-dist/'+file,dest+'/'+file.split('/').at(-1),{recursive:true});
console.log('PDF viewer assets prepared locally.');
