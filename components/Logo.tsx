// The Corral Creek mark: two peaks, the Kern below them, and the X that marks the lodge.
export function LogoMark({className='',title}:{className?:string;title?:string}){return <svg className={`logo-mark ${className}`} viewBox="0 0 64 64" role={title?'img':undefined} aria-label={title} aria-hidden={title?undefined:true}>
 <circle cx="32" cy="32" r="31" className="lm-disc"/>
 <circle cx="32" cy="32" r="26.5" className="lm-ring"/>
 <path className="lm-peaks" d="M9 41 L24 19 L31 29 L38 22 L55 41 Z"/>
 <path className="lm-snow" d="M24 19 L27.5 24 L24.5 23 L21.5 25 Z M38 22 L41 26.5 L38 25.5 L35.5 27 Z"/>
 <path className="lm-river" d="M10 46.5 C 18 42, 24 50.5, 32 46.5 S 46 42, 54 46.5"/>
 <path className="lm-river lm-river-2" d="M15 52.5 C 21 49, 26 55.5, 32 52.5 S 43 49.5, 49 52.5"/>
 <path className="lm-x" d="M43 14 L49 20 M49 14 L43 20"/>
</svg>}

export function LogoBadge({className=''}:{className?:string}){return <svg className={`logo-badge ${className}`} viewBox="0 0 200 200" aria-hidden="true">
 <defs><path id="badge-ring" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0"/></defs>
 <circle cx="100" cy="100" r="96" className="lb-edge"/>
 <text className="lb-text"><textPath href="#badge-ring" textLength="486" lengthAdjust="spacing">CORRAL CREEK LODGE ✕ UPPER KERN RIVER ✕ KERNVILLE, CA ✕</textPath></text>
 <g transform="translate(48.8 48.8) scale(1.6)"><circle cx="32" cy="32" r="31" className="lm-disc"/><path className="lm-peaks" d="M9 41 L24 19 L31 29 L38 22 L55 41 Z"/><path className="lm-river" d="M10 46.5 C 18 42, 24 50.5, 32 46.5 S 46 42, 54 46.5"/><path className="lm-x" d="M43 14 L49 20 M49 14 L43 20"/></g>
</svg>}
