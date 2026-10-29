import {z} from 'zod';
export const stampTemplateIds=['corporate-round','classic-round','triple-ring','monogram-round','department-round','oval-ring','office-rectangle','rounded-office','square-monogram','minimal-oval','legacy'] as const;
export const stampSettingsSchema=z.object({
 stampEnabled:z.boolean().default(false),stampTemplate:z.enum(stampTemplateIds).default('legacy'),
 stampText:z.string().max(80).default(''),stampSubtext:z.string().max(80).default('AUTHORIZED BUSINESS'),
 stampCenterLines:z.array(z.string().max(48)).max(4).default([]),
 stampLayout:z.enum(['curved','straight']).default('straight'),stampFont:z.enum(['sans','serif','mono']).default('sans'),stampUppercase:z.boolean().default(true),
 stampBorderCount:z.number().int().min(1).max(3).default(2),stampBorderWidth:z.number().min(.15).max(1.2).default(.45),stampTextSize:z.number().min(5).max(16).default(8),stampCenterSize:z.number().min(5).max(20).default(8),stampSpacing:z.number().min(0).max(3).default(1),stampSeparator:z.enum(['dot','diamond','star','none']).default('dot'),stampCenterRule:z.boolean().default(true),
 stampColor:z.string().regex(/^#[a-fA-F0-9]{6}$/).default('#1d4ed8'),stampShape:z.enum(['circle','oval','rectangle','rounded','square']).default('circle'),stampWidth:z.number().min(20).max(80).default(38),stampX:z.number().min(0).max(170).default(145),stampY:z.number().min(20).max(250).default(210),stampRotation:z.number().min(-180).max(180).default(-12),stampOpacity:z.number().min(.1).max(1).default(.85),
});
export type StampSettings=z.infer<typeof stampSettingsSchema>;
export const defaultStampSettings=stampSettingsSchema.parse({});
export const stampTemplates:[string,string,string,Partial<StampSettings>][]=[
 ['corporate-round','Corporate ring','Curved company name, city line, and three center details.',{stampShape:'circle',stampLayout:'curved',stampBorderCount:2,stampCenterLines:['HUMAN RESOURCES','BUSINESS OFFICE','REG. 012345'],stampFont:'sans',stampSeparator:'dot',stampCenterRule:true,stampColor:'#24559b'}],
 ['classic-round','Classic round','A simple outer circle with elegant serif lettering.',{stampShape:'circle',stampLayout:'curved',stampBorderCount:1,stampCenterLines:['ACME STUDIO','COMPANY OFFICE'],stampFont:'serif',stampSeparator:'diamond',stampCenterRule:false,stampColor:'#303943'}],
 ['triple-ring','Triple ring','Three precise borders with clear text around the rim.',{stampShape:'circle',stampLayout:'curved',stampBorderCount:3,stampCenterLines:['ADMINISTRATION','ACME STUDIO'],stampFont:'sans',stampSeparator:'star',stampCenterRule:true,stampColor:'#8e3542'}],
 ['monogram-round','Round monogram','A bold initial block framed by circular company text.',{stampShape:'circle',stampLayout:'curved',stampBorderCount:2,stampCenterLines:['AS','ACME STUDIO'],stampCenterSize:16,stampFont:'serif',stampSeparator:'diamond',stampCenterRule:false,stampColor:'#235d60'}],
 ['department-round','Department seal','A compact departmental layout with four editable center lines.',{stampShape:'circle',stampLayout:'curved',stampBorderCount:2,stampCenterLines:['ACME STUDIO','PEOPLE OPERATIONS','INTERNAL OFFICE','REG. 012345'],stampCenterSize:6.5,stampFont:'sans',stampSeparator:'dot',stampCenterRule:false,stampColor:'#494d78'}],
 ['oval-ring','Corporate oval','An oval rim with curved text and two central details.',{stampShape:'oval',stampLayout:'curved',stampBorderCount:2,stampCenterLines:['HUMAN RESOURCES','REG. 012345'],stampCenterSize:7,stampTextSize:7,stampFont:'sans',stampSeparator:'dot',stampCenterRule:false,stampColor:'#24559b'}],
 ['office-rectangle','Office rectangle','Four clean business lines and a double rectangular border.',{stampShape:'rectangle',stampLayout:'straight',stampBorderCount:2,stampCenterLines:['PEOPLE OPERATIONS','24 MAPLE AVENUE','SPRINGFIELD','REG. 012345'],stampCenterSize:6,stampTextSize:8,stampFont:'sans',stampSeparator:'none',stampCenterRule:true,stampColor:'#303943'}],
 ['rounded-office','Rounded office','A softer rectangular stamp for a department or business address.',{stampShape:'rounded',stampLayout:'straight',stampBorderCount:1,stampCenterLines:['ADMINISTRATION','24 MAPLE AVENUE','REG. 012345'],stampCenterSize:7,stampFont:'sans',stampSeparator:'none',stampCenterRule:true,stampColor:'#245d8f'}],
 ['square-monogram','Square monogram','A distinctive square design with a prominent business initial.',{stampShape:'square',stampLayout:'straight',stampBorderCount:2,stampCenterLines:['AS','ACME STUDIO'],stampCenterSize:17,stampTextSize:6,stampFont:'serif',stampSeparator:'none',stampCenterRule:false,stampColor:'#72583c'}],
 ['minimal-oval','Minimal oval','Straight horizontal text inside a restrained oval outline.',{stampShape:'oval',stampLayout:'straight',stampBorderCount:1,stampCenterLines:['BUSINESS OFFICE','REG. 012345'],stampCenterSize:7,stampTextSize:7,stampFont:'mono',stampSeparator:'none',stampCenterRule:false,stampColor:'#3b7164'}],
];
export function applyStampTemplate(current:StampSettings,id:string):StampSettings {
 const template=stampTemplates.find(t=>t[0]===id);if(!template)return current;
 // Layout changes preserve entered identity and center text; samples are used only in thumbnails.
 return stampSettingsSchema.parse({...current,...template[3],stampTemplate:id,stampText:current.stampText,stampSubtext:current.stampSubtext,stampCenterLines:current.stampCenterLines.length?current.stampCenterLines:(template[3].stampCenterLines||[]).map(()=>''),stampColor:current.stampColor,stampWidth:current.stampWidth,stampOpacity:current.stampOpacity,stampX:current.stampX,stampY:current.stampY,stampRotation:current.stampRotation});
}
export function stampSample(id:string):StampSettings {const t=stampTemplates.find(t=>t[0]===id);return stampSettingsSchema.parse({...defaultStampSettings,stampTemplate:id,stampText:'ACME STUDIO',stampSubtext:'SPRINGFIELD · REG. 012345',stampOpacity:1,...t?.[3]});}
