import ToolRouter from '../../components/ToolRouter';
export function generateStaticParams(){return ['payslip','employment-certificate','salary-certificate','stamp-maker','calculator','rules','batch'].map(tool=>({tool}));}
export default async function Tool({params}:{params:Promise<{tool:string}>}){const{tool}=await params;return <ToolRouter tool={tool}/>;}
