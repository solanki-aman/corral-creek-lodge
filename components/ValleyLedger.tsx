'use client';
import {useEffect,useRef,useState} from 'react';
import type {LocalData} from './ValleyGuide';
import {CHECKED,annualEvents,food,outdoors} from '../lib/valley';

const tabs=[{id:'food',label:'Eat & drink',n:'I'},{id:'events',label:'Happenings',n:'II'},{id:'outdoors',label:'Get outside',n:'III'}] as const;
type Tab=typeof tabs[number]['id'];
const pt=(d:string,o:Intl.DateTimeFormatOptions)=>new Date(d).toLocaleString('en-US',{timeZone:'America/Los_Angeles',...o});

export default function ValleyLedger({data,failed}:{data:LocalData|null;failed:boolean}){
 const [tab,setTab]=useState<Tab>('food');const refs=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{const on=(e:Event)=>{const t=(e as CustomEvent).detail;if(tabs.some(x=>x.id===t))setTab(t)};addEventListener('valley-tab',on);return()=>removeEventListener('valley-tab',on)},[]);
 function key(e:React.KeyboardEvent,i:number){const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();const n=(i+d+tabs.length)%tabs.length;setTab(tabs[n].id);refs.current[n]?.focus()}
 // Past events drop off once the local-info check supplies the current time.
 const now=data?Date.parse(data.checkedAt):0;const upcoming=annualEvents.filter(e=>Date.parse(e.date)>=now-864e5);
 return <section className="vl" id="valley" aria-labelledby="vl-title">
  <header className="vl-head"><p className="chapter-mark"><span>03</span>The valley</p><h2 id="vl-title">Nine miles of <em>good reasons.</em></h2><p>A few places we’d send a friend, checked with each source on {CHECKED}. Hours change, so tap through before you go.</p>
   <div className="vl-tabs" role="tablist" aria-label="Valley guide">{tabs.map((t,i)=><button key={t.id} ref={el=>{refs.current[i]=el}} role="tab" id={`vl-tab-${t.id}`} aria-selected={tab===t.id} aria-controls="vl-panel" tabIndex={tab===t.id?0:-1} onClick={()=>setTab(t.id)} onKeyDown={e=>key(e,i)}><span aria-hidden="true">{t.n}</span>{t.label}</button>)}</div>
  </header>
  <div className="vl-panel" id="vl-panel" role="tabpanel" aria-labelledby={`vl-tab-${tab}`} key={tab}>
   {tab==='food'&&<ul className="vl-cards">{food.map((f,i)=><li key={f.name} className="vl-ticket" style={{'--i':i} as React.CSSProperties}><p className="vl-kind">{f.kind}</p><h3>{f.name}</h3><p className="vl-where">{f.where}</p><ul>{f.facts.map(x=><li key={x}>{x}</li>)}</ul><a href={f.url}>Source: {f.source} <span aria-hidden="true">↗</span></a></li>)}</ul>}
   {tab==='events'&&<div className="vl-events"><div className="vl-live"><p className="vl-kind"><span className="vl-dot" aria-hidden="true"/>Live from the community calendar</p>{data?.events.length?<ul>{data.events.map(e=><li key={e.url}><a href={e.url}><time dateTime={e.date}><b>{pt(e.date,{day:'numeric'})}</b>{pt(e.date,{month:'short'})}</time><span>{e.title}<small>{pt(e.date,{weekday:'long',hour:'numeric',minute:'2-digit'})}</small></span></a></li>)}</ul>:<p className="vl-empty">{!data&&!failed?'Checking the calendar…':'The calendar isn’t answering right now. Try the full listing.'}</p>}<a className="vl-more" href="https://events.kernvalley.us/">Kern Valley Events calendar <span aria-hidden="true">↗</span></a>{data?.eventsAvailable&&<small className="vl-checked">Checked {pt(data.checkedAt,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} PT</small>}</div>
    <ul className="vl-big">{upcoming.map(e=><li key={e.name}><p className="vl-kind">{e.label}</p><h3><a href={e.url}>{e.name}</a></h3><p>{e.copy}</p>{e.note&&<p className="vl-note">{e.note}</p>}</li>)}<li className="vl-source">Big-event dates from the <a href="https://explorekernville.com/main-events/">Kernville Chamber of Commerce</a>.</li></ul></div>}
   {tab==='outdoors'&&<ul className="vl-cards vl-out">{outdoors.map((o,i)=><li key={o.name} className="vl-photo" style={{'--i':i} as React.CSSProperties}><img src={`/images/${o.image}.jpg`} alt={o.alt} loading="lazy"/><div><h3>{o.name}</h3><p>{o.copy}</p><a href={o.url}>{o.link} <span aria-hidden="true">↗</span></a></div></li>)}</ul>}
  </div>
 </section>
}
