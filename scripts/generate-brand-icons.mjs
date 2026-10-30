import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';

// One vector source keeps the header, browser tab and home-screen icon in sync.
const svg=await readFile(new URL('../packages/ui/brand-icon.svg',import.meta.url));
const sizes=[16,32,48];
const images=await Promise.all(sizes.map(size=>sharp(svg).resize(size,size).png().toBuffer()));
const directory=Buffer.alloc(6+16*images.length);
directory.writeUInt16LE(1,2);directory.writeUInt16LE(images.length,4);
let offset=directory.length;
images.forEach((image,index)=>{const entry=6+16*index;directory[entry]=sizes[index];directory[entry+1]=sizes[index];directory.writeUInt16LE(1,entry+4);directory.writeUInt16LE(32,entry+6);directory.writeUInt32LE(image.length,entry+8);directory.writeUInt32LE(offset,entry+12);offset+=image.length;});
const ico=Buffer.concat([directory,...images]);
const apple=await sharp(svg).resize(180,180).png().toBuffer();
for(const app of ['public-site','private-tools']){
 const root=new URL(`../apps/${app}/`,import.meta.url);
 await mkdir(new URL('public/',root),{recursive:true});
 await writeFile(new URL('public/brand-icon.svg',root),svg);
 await writeFile(new URL('app/icon.svg',root),svg);
 await writeFile(new URL('app/favicon.ico',root),ico);
 await writeFile(new URL('app/apple-icon.png',root),apple);
}
