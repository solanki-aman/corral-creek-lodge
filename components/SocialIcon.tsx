// Simplified brand glyphs, drawn on a 24-unit grid and inheriting the link colour.
export default function SocialIcon({name}:{name:string}){
 const common={viewBox:'0 0 24 24',className:'social-icon','aria-hidden':true} as const;
 if(name==='Instagram')return <svg {...common}><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.6" cy="6.4" r="1.3" fill="currentColor"/></svg>;
 if(name==='Facebook')return <svg {...common}><path fill="currentColor" d="M12 1.5a10.5 10.5 0 0 0-1.64 20.87v-7.34H7.7V12h2.66V9.7c0-2.63 1.57-4.09 3.97-4.09 1.15 0 2.35.2 2.35.2v2.59h-1.32c-1.3 0-1.71.81-1.71 1.64V12h2.91l-.47 3.03h-2.44v7.34A10.5 10.5 0 0 0 12 1.5Z"/></svg>;
 if(name==='X')return <svg {...common}><path fill="currentColor" d="M17.75 2.5h3.07l-6.7 7.66L22 21.5h-6.17l-4.83-6.32-5.53 6.32H2.4l7.17-8.19L2 2.5h6.33l4.37 5.78Zm-1.08 17.2h1.7L7.4 4.2H5.58Z"/></svg>;
 if(name==='Tripadvisor')return <svg {...common}><g fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="6.8" cy="13.2" r="4.3"/><circle cx="17.2" cy="13.2" r="4.3"/><path d="M2.3 8.8C4 8.2 5.5 8 6.8 8.2 9 6.4 15 6.4 17.2 8.2c1.3-.2 2.8 0 4.5.6"/><path d="M10.4 16.6 12 18.8l1.6-2.2"/></g><circle cx="6.8" cy="13.2" r="1.6" fill="currentColor"/><circle cx="17.2" cy="13.2" r="1.6" fill="currentColor"/></svg>;
 return null;
}
