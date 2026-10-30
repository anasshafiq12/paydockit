import type {Metadata} from 'next';
import {Header,Footer} from '../components/Shell';
import {publicOrigin} from '@shared/content';
import './globals.css';
import '@shared/ui/templates.css';
import './template-catalog.css';
import './stamp-catalog.css';
export const metadata:Metadata={metadataBase:new URL(publicOrigin),title:{default:'Free Payslip, Certificate & Stamp Generators | PayDockit',template:'%s | PayDockit'},description:'Create salary slips, employment certificates, salary certificates and business stamps. Free browser-based tools with no signup. Your document data stays on your device.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'en_US',siteName:'PayDockit',title:'PayDockit — Payslips, Certificates & Company Stamps',description:'Free, private payroll and employment document tools.'},twitter:{card:'summary'},robots:{index:true,follow:true},referrer:'no-referrer'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9360996257353318" crossOrigin="anonymous"/></head><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/></body></html>}
