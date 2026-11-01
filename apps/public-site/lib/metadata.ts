import type {Metadata} from 'next';

// Keep each page's social summary attached to its own canonical URL.
export function pageMetadata(title:string,description:string,path:string,type:'website'|'article'='website'):Metadata{
 const branded=title.endsWith(' | PayDockit')?title:`${title} | PayDockit`;
 return {title,description,alternates:{canonical:path},openGraph:{title:branded,description,url:path,type,siteName:'PayDockit',locale:'en_US'},twitter:{card:'summary',title:branded,description}};
}
