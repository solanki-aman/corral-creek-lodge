import type { Metadata } from 'next';
import {SiteHeader,SiteFooter} from '../components/SiteChrome';
import './globals.css';
import './field-guide.css';
import './expedition.css';
const origin=process.env.NEXT_PUBLIC_SITE_URL||'https://corral-creek-lodge.mangowhiteclaw.chatgpt.site';
export const metadata: Metadata = { metadataBase:new URL(origin), title:'Corral Creek Lodge | A little closer to the wild', description:'A mountain lodge along the Kern River, nine miles north of Kernville. Find your room and explore the Kern River Valley.',robots:{index:false,follow:false},icons:{icon:'/logo-mark.svg'},openGraph:{title:'Corral Creek Lodge',description:'A little closer to the wild. Your mountain home base in the Kern River Valley.',type:'website',images:[`${origin}/og.png`]},twitter:{card:'summary_large_image',title:'Corral Creek Lodge',description:'A little closer to the wild. Your mountain home base in the Kern River Valley.',images:[`${origin}/og.png`]} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><SiteHeader/>{children}<SiteFooter/></body></html>; }
