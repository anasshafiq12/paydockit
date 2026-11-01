import {toolsOrigin,publicOrigin} from '@shared/content';
import {pdfTitle,pdfDescription,pdfDefinition,pdfFeatures,pdfQuestions,pdfLimits} from '@shared/pdf-content';
import {pageMetadata} from '../../../lib/metadata';

export const metadata=pageMetadata(pdfTitle,pdfDescription,'/tools/pdf-editor/');
const comparisons=[
 ['Add a visual stamp or note','Supported','New additions are flattened into images in the downloaded copy. Original page content is retained.'],
 ['Replace existing PDF words','Not supported','Edit the original source document in its authoring application when possible.'],
 ['Securely redact information','Not supported','A covering shape or image does not remove underlying text or data.'],
 ['Sign with a digital certificate','Not supported','An uploaded signature picture or company stamp is a graphic, not a cryptographic signature.'],
] as const;
export default function PDFEditorPage(){
 const url=`${publicOrigin}/tools/pdf-editor/`;
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'WebApplication','@id':`${url}#application`,name:'PayDockit PDF editor',url,description:pdfDescription,applicationCategory:'BusinessApplication',operatingSystem:'Web browser',isAccessibleForFree:true,featureList:[...pdfFeatures]},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:publicOrigin+'/'},{'@type':'ListItem',position:2,name:'PDF editor',item:url}]},
 ]};
 return <main id="main">
  <div className="page-hero"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>PDF editor</span></nav><div className="eyebrow">DOCUMENT FINISHING, ON YOUR DEVICE</div><h1>Free PDF editor and PDF stamp tool</h1><p>{pdfDefinition}</p><a className="button" href={`${toolsOrigin}/pdf-editor/`}>Open PDF editor →</a><p className="tool-availability">Free, no signup. Your PDF is processed on this device.</p></div>
  <article className="page-content article">
   <section><h2>What can you do in the PDF editor?</h2><ul>{pdfFeatures.map(feature=><li key={feature}>{feature}</li>)}</ul><p>Use an owned stamp or signature scan, with optional white-paper cleanup. PNG, JPEG and WebP images are supported; SVG image uploads are not. The <a href="/tools/stamp-maker/">business stamp studio</a> can transfer its generated design directly to the PDF workspace.</p></section>
   <figure style={{margin:'28px 0'}}><img src="/pdf-editor-stamped-example.jpg" width={1264} height={1168} loading="lazy" decoding="async" style={{width:'100%',height:'auto',border:'1px solid #dfe7f2',borderRadius:10}} alt="PayDockit PDF editor showing a fictional Acme Studio document with a company stamp and page controls"/><figcaption style={{fontSize:12,lineHeight:1.7,color:'#667084',marginTop:10}}>Fictional sample in the PayDockit PDF editor. The same company stamp has been applied to both pages.</figcaption></figure>
   <section><h2>How to stamp and edit a PDF</h2><ol><li>Choose a PDF or try the clearly labelled fictional example.</li><li>Choose Stamp to create a company or dated PAID, RECEIVED or APPROVED mark, or upload your own image.</li><li>Select an addition to move, resize, rotate or change its opacity. Use Apply image to all pages if needed.</li><li>Add text, highlights or drawings. Rotate, reorder, remove or append pages when needed.</li><li>Review each changed page and download the edited PDF. Keep your original file.</li></ol><p>For example, fictional Acme Studio opens a two-page letter, adds its company stamp to page one, copies it to every page and downloads the reviewed copy. The original letter remains unchanged.</p></section>
   <section><h2>PDF annotation, text editing and redaction compared</h2><p>This is an annotation and page-organization editor. These tasks produce different results:</p><div className="comparison-scroll" role="region" aria-label="PDF editing capabilities" tabIndex={0}><table className="comparison-table"><caption>What PayDockit supports when editing an existing PDF</caption><thead><tr><th scope="col">Task</th><th scope="col">Support</th><th scope="col">What to expect</th></tr></thead><tbody>{comparisons.map(([task,support,detail])=><tr key={task}><th scope="row">{task}</th><td>{support}</td><td>{detail}</td></tr>)}</tbody></table></div></section>
   <section><h2>File limits and local processing</h2><p>Use PDFs up to {pdfLimits.fileMB} MB each, {pdfLimits.totalMB} MB total and {pdfLimits.pages} pages in one workspace. Password-protected PDFs must be unlocked in their original application first. Complex documents may need more browser memory or may render differently across viewers.</p><p>Your PDF files, edits and uploaded images stay in browser memory during this workspace session. They are not automatically backed up. Download the edited copy before closing the tab. The PDF workspace contains no advertising script; public information pages use Google AdSense. Read the <a href="/privacy/">privacy policy</a> and <a href="/scope/">feature scope</a> for the distinction.</p></section>
   <section><h2>Common questions about stamping and editing PDFs</h2><div className="tool-faq">{pdfQuestions.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
   <section><h2>Related tools and explanations</h2><ul><li><a href="/tools/stamp-maker/">Create a company stamp design</a></li><li><a href="/guides/company-stamp-png-vs-svg/">Choose PNG or SVG for a stamp</a></li><li><a href="/tools/employment-certificate/">Prepare an employment certificate</a></li><li><a href="/tools/salary-slip/">Create a salary slip</a></li></ul></section>
   <p className="article-meta">Product information updated 31 October 2026 by PayDockit. <a href="/contact/">Report an error or suggest a correction</a>.</p>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  </article>
 </main>;
}
