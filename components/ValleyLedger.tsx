'use client';
import {useEffect,useRef,useState} from 'react';
import type {LocalData} from './ValleyGuide';
import {LogoMark} from './Logo';
import {CHECKED,annualEvents,food,outdoors} from '../lib/valley';
import {kernMap} from '../lib/kernvilleMap';

const {main,inset}=kernMap;
// Downtown is drawn a second time, enlarged, inside a round inset on the empty east side of the map.
const IN={cx:1060,cy:500,r:235};const S=IN.r*2/inset.w;const CROP=(inset.h*S-IN.r*2)/2;
const inMain=([x,y]:readonly number[])=>[IN.cx-IN.r+x*S,IN.cy-IN.r+y*S-CROP];
const pct=([x,y]:number[])=>({left:`${x/main.w*100}%`,top:`${y/main.h*100}%`});

type Tab='food'|'events'|'outdoors';
type Place={id:string;tab:Tab[];label:string;icon:string;at:number[];side?:'l'|'r'|'t'|'b'};
const places:Place[]=[
 {id:'cheryls',tab:['food'],label:'Cheryl’s Diner',icon:'🍔',at:inMain(inset.pins.cheryls),side:'l'},
 {id:'krbc',tab:['food'],label:'Kern River Brewing',icon:'🍺',at:inMain(inset.pins.krbc),side:'r'},
 {id:'ewings',tab:['food'],label:'Ewings on the Kern',icon:'🍽',at:inMain(inset.pins.ewings),side:'r'},
 {id:'circle',tab:['events'],label:'Circle Park',icon:'🎪',at:inMain(inset.pins.circle),side:'r'},
 {id:'museum',tab:['outdoors'],label:'Kern Valley Museum',icon:'🏛',at:inMain(inset.pins.museum),side:'r'},
 {id:'riverside',tab:['outdoors'],label:'Riverside Park',icon:'🌳',at:inMain(inset.pins.riverside),side:'l'},
 {id:'lodge',tab:['food','events','outdoors'],label:'Corral Creek Lodge',icon:'✕',at:[...main.pins.lodge],side:'t'},
 {id:'giants',tab:['outdoors'],label:'Trail of 100 Giants ↗',icon:'🌲',at:[1555,72],side:'l'}
];
const tabs:{id:Tab;label:string;first:string}[]=[{id:'food',label:'Eat & drink',first:'cheryls'},{id:'events',label:'Happenings',first:'circle'},{id:'outdoors',label:'Get outside',first:'giants'}];
const pt=(d:string,o:Intl.DateTimeFormatOptions)=>new Date(d).toLocaleString('en-US',{timeZone:'America/Los_Angeles',...o});
const hills=[[520,650],[640,700],[760,640],[300,120],[430,60],[640,40],[1350,560],[1460,640],[1540,470],[860,300],[1250,60]];
const pines=[[570,610],[610,640],[700,600],[1390,420],[1420,470],[1500,560],[360,200],[470,150],[1180,120],[930,330],[80,300],[40,380]];

function Card({place,data,failed}:{place:string;data:LocalData|null;failed:boolean}){
 const f=food.find(x=>({cheryls:'Cheryl’s Diner',krbc:'Kern River Brewing Company',ewings:'Ewings on the Kern'} as Record<string,string>)[place]===x.name);
 if(f)return <><p className="km-kind">{f.kind}</p><h3>{f.name}</h3><p className="km-where">{f.where}</p><ul className="km-facts">{f.facts.map(x=><li key={x}>{x}</li>)}</ul><a className="km-src" href={f.url}>Source: {f.source} <span aria-hidden="true">↗</span></a></>;
 if(place==='circle'){const now=data?Date.parse(data.checkedAt):0;const up=annualEvents.filter(e=>Date.parse(e.date)>=now-864e5);return <><p className="km-kind">Downtown green · Kernville</p><h3>What’s on in the valley</h3>
  <div className="km-live"><p className="km-kind"><span className="vl-dot" aria-hidden="true"/>Live community calendar</p>{data?.events.length?<ul>{data.events.map(e=><li key={e.url}><a href={e.url}><time dateTime={e.date}>{pt(e.date,{month:'short',day:'numeric'})}</time>{e.title}</a></li>)}</ul>:<p>{!data&&!failed?'Checking the calendar…':'The calendar isn’t answering. Try the full listing.'}</p>}<a className="km-src" href="https://events.kernvalley.us/">Kern Valley Events <span aria-hidden="true">↗</span></a></div>
  <ul className="km-annual">{up.map(e=><li key={e.name}><b>{e.label}</b><a href={e.url}>{e.name}</a>{e.note&&<small>{e.note}</small>}</li>)}</ul><p className="km-note">Circle Park hosts the Summer Festival and the Christmas kick-off. Dates from the <a href="https://explorekernville.com/main-events/">Kernville Chamber</a>.</p></>}
 if(place==='lodge')return <><p className="km-kind">Your base camp</p><h3>Corral Creek Lodge</h3><p>About nine miles up the river road from town, with the Kern across the road. The drive follows the river the whole way.</p></>;
 if(place==='riverside')return <><p className="km-kind">Downtown · on the river</p><h3>Riverside Park</h3><p>A green riverbank park in the middle of Kernville, a few steps from Kernville Road’s cafés and shops.</p></>;
 const o=outdoors.find(x=>(place==='giants'&&x.name==='Trail of 100 Giants')||(place==='museum'&&x.name==='Kern Valley Museum'));
 if(o)return <><img className="km-photo" src={`/images/${o.image}.jpg`} alt={o.alt} loading="lazy"/><h3>{o.name}</h3><p>{o.copy}</p>{place==='giants'&&<p className="km-note">Keep driving north past the lodge on Mountain Highway 99, then climb into the Sequoia National Forest.</p>}<a className="km-src" href={o.url}>{o.link} <span aria-hidden="true">↗</span></a></>;
 return null;
}

export default function ValleyLedger({data,failed}:{data:LocalData|null;failed:boolean}){
 const [tab,setTab]=useState<Tab>('food');const [sel,setSel]=useState('cheryls');const [seen,setSeen]=useState(false);
 const sec=useRef<HTMLElement>(null);const route=useRef<SVGPathElement>(null);const car=useRef<SVGGElement>(null);const refs=useRef<(HTMLButtonElement|null)[]>([]);const scroller=useRef<HTMLDivElement>(null);
 useEffect(()=>{const on=(e:Event)=>{const t=(e as CustomEvent).detail as Tab;const x=tabs.find(y=>y.id===t);if(x){setTab(t);setSel(x.first)}};addEventListener('valley-tab',on);return()=>removeEventListener('valley-tab',on)},[]);
 // As the section scrolls through the viewport, the route draws itself and the little car drives from the lodge into town.
 useEffect(()=>{const el=sec.current,p=route.current,c=car.current;if(!el||!p||!c)return;const len=p.getTotalLength();p.style.strokeDasharray=`${len}`;let raf=0;
  const paint=()=>{raf=0;const still=document.documentElement.dataset.motion!=='on';const r=el.getBoundingClientRect();const prog=still?1:Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height*.8)));p.style.strokeDashoffset=`${len*(1-prog)}`;const a=p.getPointAtLength(len*prog),b=p.getPointAtLength(Math.min(len,len*prog+2));const ang=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;c.setAttribute('transform',`translate(${a.x} ${a.y}) rotate(${ang})`)};
  const on=()=>{if(!raf)raf=requestAnimationFrame(paint)};paint();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);addEventListener('motion-change',on);
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setSeen(true);io.disconnect()}},{threshold:.2});io.observe(el);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',on);removeEventListener('resize',on);removeEventListener('motion-change',on);io.disconnect()}},[]);
 // On narrow screens the map scrolls sideways; bring the chosen pin into the middle.
 useEffect(()=>{const sc=scroller.current;const p=places.find(x=>x.id===sel);if(!sc||!p||sc.scrollWidth<=sc.clientWidth+4)return;const x=p.at[0]/main.w*sc.scrollWidth;sc.scrollTo({left:x-sc.clientWidth/2,behavior:document.documentElement.dataset.motion==='on'?'smooth':'auto'})},[sel]);
 function key(e:React.KeyboardEvent,i:number){const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();const n=(i+d+tabs.length)%tabs.length;choose(tabs[n].id);refs.current[n]?.focus()}
 function choose(t:Tab){setTab(t);setSel(tabs.find(x=>x.id===t)!.first)}
 const current=places.find(p=>p.id===sel)!;
 return <section className={`vl km ${seen?'is-seen':''}`} id="valley" aria-labelledby="vl-title" ref={sec}>
  <header className="km-head"><div><p className="chapter-mark"><span>03</span>The valley</p><h2 id="vl-title">Nine miles of <em>good reasons.</em></h2></div>
   <div><p>Our river road to Kernville, drawn from the real map. Tap a pin. Everything was checked with its source on {CHECKED}.</p>
   <div className="vl-tabs km-tabs" role="tablist" aria-label="Valley guide">{tabs.map((t,i)=><button key={t.id} ref={el=>{refs.current[i]=el}} role="tab" id={`vl-tab-${t.id}`} aria-selected={tab===t.id} aria-controls="vl-panel" tabIndex={tab===t.id?0:-1} onClick={()=>choose(t.id)} onKeyDown={e=>key(e,i)}>{t.label}</button>)}</div></div></header>
  <div className="km-stage" role="tabpanel" id="vl-panel" aria-labelledby={`vl-tab-${tab}`}>
   <div className="km-scroll" ref={scroller} tabIndex={0} aria-label="Map of the river road to Kernville, scroll sideways on small screens"><div className="km-map">
    <svg viewBox={`0 0 ${main.w} ${main.h}`} className="km-svg" role="img" aria-label="Illustrated map: the Kern River and the river road run from Corral Creek Lodge in the north down to downtown Kernville in the south, about nine miles. North points to the right.">
     <defs>
      <clipPath id="km-inset-clip"><circle cx={IN.cx} cy={IN.cy} r={IN.r}/></clipPath>
      <pattern id="km-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" className="km-hatch-line"/></pattern>
      <symbol id="km-hill" viewBox="0 0 80 40"><path d="M2 38 Q 20 6, 40 4 Q 60 6, 78 38" className="km-hill-line"/><path d="M22 26 Q 32 14, 40 12 M44 16 Q 52 18, 58 26" className="km-hill-line thin"/></symbol>
      <symbol id="km-pine" viewBox="0 0 20 30"><path d="M10 1 L18 22 H2 Z M10 22 V29" className="km-pine-line"/></symbol>
     </defs>
     <rect width={main.w} height={main.h} className="km-paper"/>
     <g className="km-deco">{hills.map(([x,y],i)=><use key={i} href="#km-hill" x={x} y={y} width="96" height="48" style={{'--d':`${i*60}ms`} as React.CSSProperties}/>)}{pines.map(([x,y],i)=><use key={`p${i}`} href="#km-pine" x={x} y={y} width="16" height="24"/>)}</g>
     <text className="km-area" x="560" y="96">SEQUOIA NATIONAL FOREST</text><text className="km-area" x="360" y="700">KERN RIVER VALLEY</text>
     <g className="km-water">{main.river.map((d,i)=><g key={i}><path d={d} className="km-river-bank"/><path d={d} className="km-river"/><path d={d} className="km-river-flow"/></g>)}{main.creek.map((d,i)=><path key={`c${i}`} d={d} className="km-creek"/>)}</g>
     <g className="km-roads">{main.roads.map((d,i)=><path key={i} d={d} className="km-road"/>)}</g>
     <path ref={route} d={main.route} className="km-route"/>
     <text className="km-label km-river-label" transform="translate(705 150) rotate(-10)">KERN RIVER</text>
     <text className="km-label km-road-label" transform="translate(1150 262) rotate(12)">MOUNTAIN HWY 99</text>
     <text className="km-label km-road-label" transform="translate(410 468) rotate(-38)">SIERRA WAY</text>
     <text className="km-label km-small" transform="translate(1398 330) rotate(80)">CORRAL CREEK</text>
     <g className="km-edge"><text x="14" y="610">← TO LAKE ISABELLA</text><text x={main.w-14} y="345" textAnchor="end">TO JOHNSONDALE →</text></g>
     <g className="km-town-dot"><circle cx={main.pins.town[0]} cy={main.pins.town[1]} r="30"/><text x={main.pins.town[0]} y={main.pins.town[1]+62} textAnchor="middle">KERNVILLE</text></g>
     <path className="km-leader" d={`M${main.pins.town[0]+30} ${main.pins.town[1]} C 500 ${main.pins.town[1]+120}, 700 620, ${IN.cx-IN.r} ${IN.cy+20}`}/>
     <g className="km-inset">
      <circle cx={IN.cx} cy={IN.cy} r={IN.r+10} className="km-inset-ring"/>
      <g clipPath="url(#km-inset-clip)"><rect x={IN.cx-IN.r} y={IN.cy-IN.r} width={IN.r*2} height={IN.r*2} className="km-inset-paper"/><rect x={IN.cx-IN.r} y={IN.cy-IN.r} width={IN.r*2} height={IN.r*2} fill="url(#km-hatch)" className="km-inset-hatch"/>
       <g transform={`translate(${IN.cx-IN.r} ${IN.cy-IN.r-CROP}) scale(${S})`}>{inset.parks.map((d,i)=><path key={i} d={d} className="km-park"/>)}{inset.river.map((d,i)=><g key={`r${i}`}><path d={d} className="km-river-bank" style={{strokeWidth:34}}/><path d={d} className="km-river" style={{strokeWidth:20}}/><path d={d} className="km-river-flow"/></g>)}{inset.roads.map((d,i)=><path key={`d${i}`} d={d} className="km-road" style={{strokeWidth:5}}/>)}</g></g>
      <circle cx={IN.cx} cy={IN.cy} r={IN.r} className="km-inset-edge"/>
      <text className="km-inset-title" x={IN.cx} y={IN.cy+IN.r+40} textAnchor="middle">DOWNTOWN KERNVILLE · ENLARGED</text>
     </g>
     <g ref={car} className="km-car" aria-hidden="true"><rect x="-13" y="-7" width="26" height="14" rx="5"/><rect x="-3" y="-5.5" width="9" height="11" rx="2" className="km-car-glass"/></g>
     <g className="km-compass" transform="translate(1490 650)"><circle r="40"/><path d="M-30 0 L0 -7 L44 0 L0 7 Z"/><text x="56" y="6">N</text></g>
     <g className="km-scale" transform="translate(40 728)"><path d="M0 0 H184"/><path d="M0 -6 V6 M92 -4 V4 M184 -6 V6"/><text x="92" y="-12" textAnchor="middle">1 MILE</text></g>
    </svg>
    {places.map((p,i)=>{const on=p.tab.includes(tab);return <button key={p.id} className={`km-pin km-${p.side} ${p.id==='lodge'?'km-home':''} ${on?'is-on':''} ${sel===p.id?'is-sel':''}`} style={{...pct(p.at),'--i':i} as React.CSSProperties} onClick={()=>setSel(p.id)} aria-pressed={sel===p.id} tabIndex={on||p.id==='lodge'?0:-1} aria-hidden={on||p.id==='lodge'?undefined:true}>
     <span className="km-pin-dot" aria-hidden="true">{p.id==='lodge'?<LogoMark/>:p.icon}</span><span className="km-pin-label">{p.label}</span></button>})}
   </div></div>
   <p className="km-drag" aria-hidden="true">Drag the map ↔</p>
   <div className="km-card" aria-live="polite" key={sel}><Card place={current.id} data={data} failed={failed}/></div>
  </div>
 </section>
}
