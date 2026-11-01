import type {Metadata} from 'next';
import {pageMetadata} from '../lib/metadata';
import {Header,Footer} from '../components/Shell';
import {publicOrigin} from '@shared/content';
import './globals.css';
import '@shared/ui/templates.css';
import './template-catalog.css';
import './stamp-catalog.css';
const title='Free Payslip, Certificate, Stamp & PDF Tools | PayDockit';
const description='Create payslips, employment and salary certificates, business stamps, or edit existing PDFs. Free browser-based tools with local document processing and no signup.';
export const metadata:Metadata={...pageMetadata(title,description,'/'),metadataBase:new URL(publicOrigin),title:{default:title,template:'%s | PayDockit'},robots:{index:true,follow:true},referrer:'no-referrer'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9360996257353318" crossOrigin="anonymous"/></head><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/></body></html>}
