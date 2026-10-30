export const templateIds=['classic','minimal','corporate','ledger','executive','editorial','modern','framed','payroll-form','hr-letter'] as const;
export type TemplateId=typeof templateIds[number];
export const documentTemplates=[
 {id:'classic',name:'Classic blue',description:'A crisp blue rule, balanced letterhead, and a quiet contact footer.',accent:'#265ed8',ink:'#24354c',soft:'#edf4ff',font:'sans',category:'Essential',header:'rule'},
 {id:'minimal',name:'Minimal monochrome',description:'Clean black typography and generous space. Made for grayscale printing.',accent:'#262b32',ink:'#262b32',soft:'#f3f4f5',font:'sans',category:'Essential',header:'minimal'},
 {id:'corporate',name:'Corporate letterhead',description:'A bold blue masthead with a matching band at the foot of the page.',accent:'#235389',ink:'#233b56',soft:'#eef3f9',font:'sans',category:'Business',header:'band'},
 {id:'ledger',name:'Structured ledger',description:'Precise ruled tables and a teal document label for detailed payroll.',accent:'#247268',ink:'#294541',soft:'#edf6f3',font:'sans',category:'Business',header:'ledger'},
 {id:'executive',name:'Executive navy',description:'Deep navy letterhead, a fine brass accent, and a confident closing bar.',accent:'#20384f',ink:'#263d51',soft:'#eff3f6',font:'sans',category:'Signature',header:'navy'},
 {id:'editorial',name:'Editorial ivory',description:'Elegant serif headings, warm bronze rules, and centered letterhead.',accent:'#927344',ink:'#423b31',soft:'#f7f3eb',font:'serif',category:'Signature',header:'centered'},
 {id:'modern',name:'Modern teal',description:'A fresh vertical accent, clear section labels, and an offset footer.',accent:'#157c82',ink:'#23484c',soft:'#eaf6f5',font:'sans',category:'Contemporary',header:'split'},
 {id:'framed',name:'Formal frame',description:'A fine double frame, classic typography, and a ceremonial title.',accent:'#696583',ink:'#39374e',soft:'#f3f1f8',font:'serif',category:'Signature',header:'frame'},
 {id:'payroll-form',name:'Traditional payroll form',description:'Serif letterhead, a centered document title, and fully ruled payroll tables for a traditional office form.',accent:'#353535',ink:'#303030',soft:'#f5f5f5',font:'serif',category:'Business',header:'form'},
 {id:'hr-letter',name:'HR confirmation letter',description:'Open white letterhead, a centered underlined subject, and generous paragraph spacing for formal correspondence.',accent:'#285e78',ink:'#20252a',soft:'#f1f5f7',font:'sans',category:'Business',header:'letter'},
] as const;
export function getTemplate(id:string){return documentTemplates.find(t=>t.id===id)||documentTemplates[0];}
