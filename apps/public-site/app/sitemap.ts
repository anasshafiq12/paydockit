import type {MetadataRoute} from 'next';
import {tools,calculators,guides,publicOrigin} from '@shared/content';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return ['','templates','guides','about','privacy','terms','cookies','editorial-policy','scope','contact',...tools.map(t=>`tools/${t.slug}`),...calculators.map(c=>`calculators/${c.slug}`),...guides.map(g=>`guides/${g.slug}`)].map(p=>({url:`${publicOrigin}/${p?p+'/':''}`,lastModified:'2026-10-29',changeFrequency:'monthly',priority:p?0.7:1}));}
