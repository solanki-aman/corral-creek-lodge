'use client';
import {useCallback,useEffect,useLayoutEffect,useRef,useState,useSyncExternalStore} from 'react';
import {BookButton} from './SiteChrome';
import {LogoBadge} from './Logo';
import type {LocalData} from './ValleyGuide';

// Coordinates are in the drone photograph's own frame (aerial.jpg, 2000 × 1123 units).
const W=2000,H=1123;
type Stop={id:string;n:string;label:string;title:string;copy:string;x?:number;y?:number;image?:string;alt?:string;jump?:{href:string;label:string;tab?:string};book?:boolean};
const stops:Stop[]=[
 {id:'lodge',n:'X',label:'The lodge',x:935,y:492,title:'X marks the lodge.',copy:'Twenty rooms with kitchenettes, a BBQ deck and the mountains at your back. The treasure is a good night’s sleep.',book:true,jump:{href:'#rooms',label:'See all four room types'}},
 {id:'river',n:'1',label:'The Kern',x:1120,y:965,title:'The river is across the road.',copy:'Upper Kern whitewater, a short walk from your door. Fishing stays open all year; rafting season starts in mid-March.',jump:{href:'#valley',label:'Get outside',tab:'outdoors'}},
 {id:'road',n:'2',label:'The road',x:1230,y:585,title:'Nine miles to town.',copy:'The road past the lodge leads to Kernville, about fifteen minutes away. Guests call it secluded, not far.',jump:{href:'#valley',label:'Where to eat in town',tab:'food'}},
 {id:'town',n:'3',label:'Kernville',image:'kernville',alt:'Western storefronts in downtown Kernville (archive photograph, 2007)',title:'Burgers, brews and a table by the rapids.',copy:'Cheryl’s Diner has fed the valley since 1985. Kern River Brewing is the town’s only brewpub. Ewings sits over the rapids.',jump:{href:'#valley',label:'Three local tables',tab:'food'}},
 {id:'giants',n:'4',label:'The giants',image:'forest',alt:'Giant sequoias along the Trail of 100 Giants',title:'Sequoias older than the maps.',copy:'The Trail of 100 Giants is an easy paved loop among 1,500-year-old trees. Open in summer, and one of the closest lodges to it is ours.',jump:{href:'#valley',label:'Plan a forest day',tab:'outdoors'}},
 {id:'events',n:'5',label:'Happenings',image:'night',alt:'Corral Creek Lodge lit up at night',title:'Rodeos, festivals and Whiskey Flat Days.',copy:'The valley keeps a busy calendar. We pull the next few community events in live, and list the big ones ahead.',jump:{href:'#valley',label:'See what’s on',tab:'events'}}
];

const TOUR_MS=5200;
// Follows the site-wide motion setting (html[data-motion]), which honours prefers-reduced-motion.
function subscribeMotion(cb:()=>void){const mo=new MutationObserver(cb);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});return()=>mo.disconnect()}
const motionOn=()=>document.documentElement.dataset.motion==='on';
// Letters animate one by one, but each word stays in one unbreakable group so a line can only wrap between words.
function Letters({text}:{text:string}){let n=0;return <span className="tm-letters"><span className="sr-only">{text}</span>{text.split(' ').map((w,wi)=><span key={wi} className="tm-word" aria-hidden="true">{wi>0&&' '}<span className="tm-word-inner">{[...w].map(c=><span key={n} className="tm-letter" style={{'--n':n++} as React.CSSProperties}>{c}</span>)}</span></span>)}</span>}

export default function TreasureMap({data}:{data:LocalData|null}){
 const [active,setActive]=useState(0);const [ink,setInk]=useState(true);const [drawn,setDrawn]=useState(false);const [playing,setPlaying]=useState(true);const [hold,setHold]=useState(false);const [inView,setInView]=useState(true);
 const moving=useSyncExternalStore(subscribeMotion,motionOn,()=>false);const touring=playing&&moving&&!hold&&inView;
 const stage=useRef<HTMLDivElement>(null);const canvas=useRef<HTMLDivElement>(null);
 const stop=stops[active];
 const place=useCallback(()=>{const s=stage.current,c=canvas.current;if(!s||!c)return;const sw=s.clientWidth,sh=s.clientHeight;const zoom=1.1;const cw=Math.max(sw,sh*W/H)*zoom,ch=cw*H/W;const target=stops.find((p,i)=>i===active&&p.x!==undefined)||stops[0];const wide=sw>900;const fx=wide?.55:.5,fy=wide?.4:.52;let tx=sw*fx-(target.x!/W)*cw,ty=sh*fy-(target.y!/H)*ch;tx=Math.min(0,Math.max(sw-cw,tx));ty=Math.min(0,Math.max(sh-ch,ty));c.style.width=`${cw}px`;c.style.height=`${ch}px`;c.style.transform=`translate3d(${tx}px,${ty}px,0)`},[active]);
 useLayoutEffect(()=>{place()},[place]);
 useEffect(()=>{addEventListener('resize',place);const t=setTimeout(()=>setDrawn(true),150);return()=>{removeEventListener('resize',place);clearTimeout(t)}},[place]);
 function go(i:number){setActive((i+stops.length)%stops.length)}
 useEffect(()=>{if(!touring)return;const t=setTimeout(()=>setActive(a=>(a+1)%stops.length),TOUR_MS);return()=>clearTimeout(t)},[touring,active]);
 useEffect(()=>{const el=stage.current;if(!el||!('IntersectionObserver' in window))return;const io=new IntersectionObserver(([e])=>setInView(e.isIntersecting&&e.intersectionRatio>.35),{threshold:[0,.35,.6]});io.observe(el);return()=>io.disconnect()},[]);
 function jump(tab?:string){if(tab)window.dispatchEvent(new CustomEvent('valley-tab',{detail:tab}))}
 return <section className={`tm ${drawn?'is-drawn':''} ${ink?'is-ink':'is-photo'} ${touring?'is-touring':''}`} aria-labelledby="tm-title" style={{'--tour':`${TOUR_MS}ms`} as React.CSSProperties}>
  <div className="tm-stage" ref={stage}>
   <div className="tm-canvas" ref={canvas}>
    <img className="tm-photo" src="/images/aerial.jpg" alt="Drone photograph of Corral Creek Lodge: the red two-story lodge sits beside a mountain road, with the Kern River curving through the foreground." fetchPriority="high"/>
    <svg className="tm-ink" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
     <defs><mask id="tm-reveal"><path className="tm-reveal" d="M1120 965 C 1060 900, 960 840, 1000 760 S 880 640, 935 500" pathLength={1}/></mask></defs>
     <g className="tm-contours">{[0,1,2,3,4].map(i=><ellipse key={i} cx="1080" cy="170" rx={160+i*120} ry={70+i*55}/>)}{[0,1,2].map(i=><ellipse key={`b${i}`} cx="1820" cy="330" rx={90+i*80} ry={50+i*40}/>)}</g>
     <g className="tm-grid">{[1,2,3,4,5].map(i=><line key={i} x1={i*W/6} x2={i*W/6} y1="0" y2={H}/>)}{[1,2,3].map(i=><line key={`h${i}`} y1={i*H/4} y2={i*H/4} x1="0" x2={W}/>)}</g>
     <path className="tm-trail" mask="url(#tm-reveal)" d="M1120 965 C 1060 900, 960 840, 1000 760 S 880 640, 935 500"/>
     <g className="tm-x" transform="translate(935 492)"><path d="M-26 -26 L26 26 M26 -26 L-26 26"/></g>
    </svg>
    {stops.filter(p=>p.x!==undefined).map(p=>{const i=stops.indexOf(p);return <button key={p.id} tabIndex={-1} aria-hidden="true" className={`tm-pin ${p.id==='lodge'?'tm-pin-home':''} ${i===active?'is-on':''}`} style={{left:`${p.x!/W*100}%`,top:`${p.y!/H*100}%`}} onClick={()=>go(i)}><span>{p.n}</span><b>{p.label}</b></button>})}
   </div>
   <div className="tm-paper" aria-hidden="true"/>
   <LogoBadge className="tm-badge"/>
  </div>
  <div className="tm-title">
   <p className="tm-kicker">Upper Kern River · Kernville, California</p>
   <h1 id="tm-title"><Letters text="Corral Creek"/> <em>Lodge</em></h1>
   <p className="tm-lede">A little lodge where the road meets the river. Twenty rooms, a BBQ deck and the Sequoia National Forest out back.</p>
   <div className="tm-actions"><BookButton className="button tm-book">Check dates &amp; rates <span aria-hidden="true">↗</span></BookButton><a href="#rooms" className="tm-link">See the rooms</a></div>
  </div>
  <div className="tm-card" role="region" aria-label="Treasure map field notes" onMouseEnter={()=>setHold(true)} onMouseLeave={()=>setHold(false)} onFocus={()=>setHold(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHold(false)}}>
   <div className="tm-card-top"><p className="tm-kicker">Field notes · stop {active+1} of {stops.length}</p><div className="tm-card-tools">{moving&&<button className="tm-toggle tm-play" aria-pressed={!playing} onClick={()=>setPlaying(v=>!v)}>{playing?<><span aria-hidden="true">❚❚</span> Pause tour</>:<><span aria-hidden="true">▶</span> Play tour</>}</button>}<button className="tm-toggle" aria-pressed={!ink} onClick={()=>setInk(v=>!v)}>{ink?'True color':'Map ink'}</button></div></div>
   <ol className="tm-route">{stops.map((p,i)=><li key={p.id}><button onClick={()=>go(i)} aria-current={i===active?'step':undefined}><span aria-hidden="true" key={i===active?`on-${active}`:'off'}>{p.n}</span><span className="tm-route-label">{p.label}</span></button></li>)}</ol>
   <div className="tm-note" key={stop.id} aria-live="polite">
    {stop.image&&<img src={`/images/${stop.image}.jpg`} alt={stop.alt} loading="lazy"/>}
    {stop.image&&<p className="tm-edge">Beyond the edge of the map</p>}
    <h2>{stop.title}</h2><p>{stop.copy}</p>
    <div className="tm-note-actions">{stop.book&&<BookButton className="button tm-book small">Book the lodge <span aria-hidden="true">↗</span></BookButton>}{stop.jump&&<a href={stop.jump.href} onClick={()=>jump(stop.jump?.tab)}>{stop.jump.label} <span aria-hidden="true">↓</span></a>}</div>
   </div>
   <div className="tm-steps"><button onClick={()=>go(active-1)} aria-label="Previous stop">←</button><button className="tm-next" onClick={()=>go(active+1)}>Follow the trail <span aria-hidden="true">→</span></button></div>
  </div>
  <a className="tm-weather" href="https://forecast.weather.gov/MapClick.php?lat=35.7547&lon=-118.4254">{data?.weather?<><b>{data.weather.temperature}°{data.weather.temperatureUnit}</b> {data.weather.shortForecast}<small>{data.weather.name} · NWS forecast</small></>:<>Kernville forecast<small>National Weather Service</small></>}</a>
  <nav className="tm-chapters" aria-label="On this page"><a href="#rooms"><span>02</span>Rooms</a><a href="#valley"><span>03</span>The valley</a><a href="#guestbook"><span>04</span>Guestbook</a></nav>
 </section>
}
