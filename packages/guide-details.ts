export const stampGuide={
 slug:'company-stamp-png-vs-svg',
 title:'Company stamp PNG or SVG: which should you download?',
 description:'Choose a transparent stamp image or scalable vector artwork, set its size, and check the result before adding it to a document.',
 category:'STAMP DESIGN',
 minutes:4,
 body:[
  ['Start with how you will use the stamp','A digital company stamp is a graphic made from business text, borders and other design choices. It can be placed on a document, but the graphic alone does not verify the issuer or authenticate that document. Before designing it, decide whether you need an image for a letter, artwork for further editing, or a file to discuss with a physical stamp supplier.'],
  ['Choose transparent PNG for a document image','PNG is a raster format: the design is stored as pixels. A transparent background lets the page show through around the stamp. PayDockit exports a PNG that is 1,200 pixels wide. It is useful for inserting into a word processor or placing on a PayDockit salary slip or certificate. Check that your destination application preserves transparency, then resize the image without stretching it. Enlarging a raster image beyond its available pixels can make its edges look soft.'],
  ['Choose SVG for scalable artwork and further editing','SVG describes vector shapes and text instead of a fixed pixel grid. Its borders and other vector artwork can scale without the pixelation of an enlarged PNG. PayDockit’s SVG keeps text editable, which can help when adjusting the design in a vector editor. Font availability matters: another application may substitute a missing font and change the text’s appearance. Open the exported file in the application that will use it and check the rim text, line breaks and spacing.'],
  ['Check physical size separately from pixel dimensions','PayDockit lets you set the stamp width in millimetres. A fictional 38 mm round company stamp should be checked at that intended width when inserted or printed. Pixel width and physical print width are different settings, and a document application may initially insert an image at another size. Use the application’s size controls and preserve the aspect ratio. For a physical rubber stamp, ask your supplier which artwork format, dimensions, fonts and line thickness it accepts before ordering. PayDockit does not manufacture or ship stamps.'],
  ['Review the finished design before sharing','Use a business name and details you are authorized to represent. Keep small text readable and inspect transparent areas, borders, curved text and the company name at the final size. If you add the graphic to an employment document, check that it does not cover important facts or the authorized signature. A decorative stamp does not replace any signature, approval or authentication process required for the actual document.'],
 ],
 source:'https://developer.mozilla.org/en-US/docs/Web/SVG',
};

export const guideActions:Record<string,{href:string;label:string}>={
 'understanding-your-salary-slip':{href:'/tools/salary-slip/',label:'Create a salary slip'},
 'employment-vs-salary-certificate':{href:'/tools/employment-certificate/',label:'Prepare an employment certificate'},
 'gross-net-and-cash-payable':{href:'/calculators/gross-to-net/',label:'Calculate net wages from manual deductions'},
 'country-presets':{href:'/scope/',label:'Review formatting and calculation scope'},
 'privacy-and-local-backups':{href:'/templates/',label:'Choose a document template'},
 'custom-tax-brackets':{href:'/rules/',label:'Open the custom tax rule builder'},
 'company-stamp-png-vs-svg':{href:'/tools/stamp-maker/',label:'Create a company stamp'},
};

export const comparisonRows=[
 ['Salary slip / payslip','Record earnings and deductions for a specific pay period','Employer and employee details, period, earnings, deductions, net wages and any separate reimbursements.'],
 ['Employment certificate','Confirm current or former employment','Employer, employee, job title, employment dates and status, with an authorized verification contact. Salary can be included when requested and authorized.'],
 ['Salary certificate','Confirm employer-stated compensation','Employment details, salary amount, currency, monthly or annual basis, gross or net designation, and authorized issuer.'],
 ['Experience letter','Describe a completed period of employment','Actual start and end dates, role and approved factual duties. It should not invent accomplishments or recommendations.'],
];
