'use client';
import {useRef,useState} from 'react';
import {guestbook} from '../lib/guestbook';
import {social} from '../lib/valley';

const sources=['All','Tripadvisor','Expedia','Google','Booking'] as const;
export default function Guestbook(){
 const [source,setSource]=useState<typeof sources[number]>('All');const track=useRef<HTMLOListElement>(null);
 const shown=guestbook.filter(r=>source==='All'||r.source===source);
 function page(d:number){const t=track.current;if(!t)return;t.scrollBy({left:d*t.clientWidth*.85,behavior:document.documentElement.dataset.motion==='off'?'auto':'smooth'})}
 function pick(s:typeof sources[number]){setSource(s);track.current?.scrollTo({left:0})}
 return <section className="gb" id="guestbook" aria-labelledby="gb-title">
  <header className="gb-head"><div><p className="chapter-mark"><span>04</span>The guest register</p><h2 id="gb-title">Sixteen guests. <em>In their own words.</em></h2><p>Every review from the lodge’s original website, word for word.</p></div>
   <div className="gb-tools"><div className="gb-filter" role="group" aria-label="Filter reviews by site">{sources.map(s=><button key={s} aria-pressed={source===s} onClick={()=>pick(s)}>{s}<span>{s==='All'?guestbook.length:guestbook.filter(r=>r.source===s).length}</span></button>)}</div>
   <div className="gb-arrows"><button onClick={()=>page(-1)} aria-label="Scroll reviews back">←</button><button onClick={()=>page(1)} aria-label="Scroll reviews forward">→</button></div></div></header>
  <p className="sr-only" role="status">{shown.length} reviews shown</p>
  <ol className="gb-track" ref={track} tabIndex={0} aria-label="Guest reviews, scroll sideways">{shown.map((r,i)=><li key={r.name} className="gb-card" style={{'--tilt':`${((i*37)%5-2)*.45}deg`} as React.CSSProperties}>
   <p className="gb-stamp"><span>{r.keepsake}</span></p>
   <figure><blockquote>{r.headline&&<p className="gb-headline">{r.headline}</p>}{r.text.map((p,j)=><p key={j}>{p}</p>)}</blockquote>
   <figcaption><strong>{r.name}</strong><span>{r.source}{r.rating?` · ${r.rating}`:''}</span>{r.detail&&<small>{r.detail}</small>}</figcaption></figure>
  </li>)}</ol>
  <div className="gb-foot"><p>Stayed with us? Add your page to the register, or follow along for what’s happening up the river.</p><ul>{social.map(s=><li key={s.name}><a href={s.url}><b>{s.name}</b>{s.handle} <span aria-hidden="true">↗</span></a></li>)}</ul></div>
 </section>
}
