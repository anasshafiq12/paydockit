import SalaryCertificateExample from '../../../components/SalaryCertificateExample';
import {pageMetadata} from '../../../lib/metadata';
import StampCatalog from '../../../components/StampCatalog';
import {tools,toolsOrigin,publicOrigin} from '@shared/content';
import {toolContent} from '@shared/tool-content';
import type {Metadata} from 'next';
import Icon from '../../../components/Icon';

export function generateStaticParams(){return tools.map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const content=toolContent[slug as keyof typeof toolContent];
 return pageMetadata(content.title,content.metaDescription,`/tools/${slug}/`);
}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const t=tools.find(t=>t.slug===slug)!;const content=toolContent[t.slug];const stamp=slug==='stamp-maker';
 return <main id="main">
  <div className="page-hero"><div className="breadcrumb"><a href="/">Home</a><span>/</span><a href="/#tools">Tools</a><span>/</span>{t.title}</div><span className={`icon-tile ${t.color}`}><Icon name={t.icon}/></span><h1 style={{marginTop:22}}>{content.primaryKeyword}</h1><p>{content.definition}</p><a className="button" href={`${toolsOrigin}/${t.editor}/`}>{stamp?'Design a company stamp':`Create ${t.title.toLowerCase()}`} <Icon name="arrow" size={18}/></a><p className="tool-availability">Free to use. No account, email or payment required.</p></div>
  {stamp&&<StampCatalog/>}
  <div className="page-content">
   <section className="content-panel"><h2>Who this {stamp?'stamp maker':'generator'} is for</h2><ul>{content.audiences.map(text=><li key={text}>{text}</li>)}</ul><p>Editing and export take place in your browser. Saving a project is your choice.</p></section>
   <section><h2>{stamp?'What to include in your company stamp':`What to include in your ${t.title.toLowerCase()}`}</h2><ul>{content.checklist.map(text=><li key={text}>{text}</li>)}</ul></section>
   <section><h2>How to create your {t.title.toLowerCase()}</h2>{slug==='salary-certificate'?<ol><li>Enter the employer and employee details, monthly basic pay, earnings and deductions.</li><li>Choose a currency and select monthly or annual display, with a gross or net designation.</li><li>Confirm the issue date, recipient and authorized signer. Review the letter, then download PDF or editable Word.</li></ol>:<ol><li>{stamp?'Open the stamp designer and choose a layout.':'Open the workspace. Start blank or load a clearly marked fictional sample.'}</li><li>{stamp?'Enter your authorized business text. Choose the shape, typeface, size, borders and ink color.':'Enter the employer and employee details, dates, currency and relevant pay amounts or certificate wording.'}</li><li>{stamp?'Inspect the lettering and dimensions. Export PNG or SVG, or save an editable JSON project.':'Review the preview and any missing fields, then download your file. Sample documents retain their SAMPLE mark.'}</li></ol>}</section>
   <section><h2>{stamp?'Transparent PNG or scalable SVG':'PDF, editable Word and printable formats'}</h2><p>{content.formats}</p>{!stamp&&<p>English is supported for direct PDF and Word exports. Arabic and Urdu print layouts remain translation drafts requiring native review.</p>}</section>
   <section><h2>A fictional {stamp?'company stamp':t.title.toLowerCase()} example</h2><p>{content.example}</p></section>
   {slug==='salary-certificate'&&<SalaryCertificateExample/>}
   <section><h2>Common questions about {stamp?'online stamp designs':t.title.toLowerCase()+'s'}</h2><div className="tool-faq">{content.faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
   <section><h2>Related tools and explanations</h2><ul>{content.related.map(([href,label])=><li key={href}><a href={href}>{label}</a></li>)}</ul>{!stamp&&<p>Confirm the facts and your authorization before issuing a document. <a href="/scope/">Read the calculation and formatting scope</a>.</p>}</section>
   <a className="button" href={`${toolsOrigin}/${t.editor}/`}>{stamp?'Open the stamp designer':`Open ${t.title.toLowerCase()} generator`} →</a>
  </div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify([{'@context':'https://schema.org','@type':'WebApplication',name:content.primaryKeyword,description:content.metaDescription,url:`${publicOrigin}/tools/${slug}/`,applicationCategory:'BusinessApplication',operatingSystem:'Web browser',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:publicOrigin},{'@type':'ListItem',position:2,name:t.title,item:`${publicOrigin}/tools/${slug}/`}]}])}}/>
 </main>;
}
