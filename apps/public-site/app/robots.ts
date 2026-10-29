import type {MetadataRoute} from 'next';
import {publicOrigin} from '@shared/content';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:'*',allow:'/'},sitemap:`${publicOrigin}/sitemap.xml`};}
