'use client';
import dynamic from 'next/dynamic';
const PDFWorkspace=dynamic(()=>import('./PDFWorkspace'));
const Editor=dynamic(()=>import('./Editor'));
const StampStudio=dynamic(()=>import('./StampStudio'));
const CalculatorWorkspace=dynamic(()=>import('./CalculatorWorkspace'));
const RulesWorkspace=dynamic(()=>import('./RulesWorkspace'));
const BatchWorkspace=dynamic(()=>import('./BatchWorkspace'));
export default function ToolRouter({tool}:{tool:string}){if(tool==='pdf-editor'||tool==='stamp-pdf')return <PDFWorkspace/>;if(tool==='stamp-maker')return <StampStudio/>;if(tool==='calculator')return <CalculatorWorkspace/>;if(tool==='rules')return <RulesWorkspace/>;if(tool==='batch')return <BatchWorkspace/>;return <Editor kind={tool as 'payslip'|'employment-certificate'|'salary-certificate'}/>;}
