import type {Metadata} from 'next';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import Providers from '../components/Providers';
import '@fontsource/noto-naskh-arabic/arabic-400.css';
import '@fontsource/noto-nastaliq-urdu/arabic-400.css';
import './globals.css';
import '@shared/ui/templates.css';
import './document-designs.css';
import './stamp-designs.css';
import './customization.css';
export const metadata:Metadata={title:'Private workspace | PayDockit',description:'Local document editing. Your payroll data stays in your browser.',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#workspace" className="skip-link">Skip to workspace</a><AppRouterCacheProvider><Providers>{children}</Providers></AppRouterCacheProvider></body></html>}
