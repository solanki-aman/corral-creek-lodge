'use client';
import {useEffect,useRef,useState} from 'react';
import {BookButton} from './SiteChrome';
import {LogoMark} from './Logo';
import {ROOM_SIZE,directory,petRooms,places,roomKinds,typeOf} from '../lib/rooms';

/*
 A 3D model of the lodge built from CSS 3D boxes, so it stays vector-sharp at any size and needs no WebGL.
 Ground plane is x (right) × y (toward the road), z is up. The U-shaped lodge opens toward the parking lot,
 Mountain 99 and the Kern. As you scroll, a camera flies in from the river, circles the property and then
 settles on each room type; with motion off the same model sits still and the buttons move the camera.
*/
type Focus='overview'|'king'|'queen'|'pet'|'amenities';
type Cam={rx:number;rz:number;s:number;x:number;y:number};
const cams:Record<Focus,Cam>={overview:{rx:58,rz:-18,s:.85,x:0,y:-40},king:{rx:66,rz:-6,s:1.4,x:0,y:-150},queen:{rx:66,rz:8,s:1.4,x:0,y:-150},pet:{rx:74,rz:-4,s:1.6,x:-70,y:-175},amenities:{rx:62,rz:-28,s:.95,x:0,y:-10}};
// Scroll path: progress → camera. The first half is the fly-in and orbit, the rest visits each room type.
const path:(Cam&{p:number;f:Focus})[]=[
 {p:0,rx:84,rz:4,s:.9,x:0,y:-330,f:'overview'},
 {p:.12,rx:64,rz:-10,s:.8,x:0,y:-40,f:'overview'},
 {p:.24,rx:58,rz:-110,s:.78,x:0,y:-60,f:'overview'},
 {p:.36,rx:58,rz:-230,s:.78,x:0,y:-60,f:'overview'},
 {p:.46,rx:56,rz:-342,s:.85,x:0,y:-60,f:'overview'},
 {p:.52,...cams.king,rz:cams.king.rz-360,f:'king'},{p:.62,...cams.king,rz:cams.king.rz-360,f:'king'},
 {p:.68,...cams.queen,rz:cams.queen.rz-360,f:'queen'},{p:.76,...cams.queen,rz:cams.queen.rz-360,f:'queen'},
 {p:.82,...cams.pet,rz:cams.pet.rz-360,f:'pet'},{p:.88,...cams.pet,rz:cams.pet.rz-360,f:'pet'},
 {p:.94,...cams.amenities,rz:cams.amenities.rz-360,f:'amenities'},{p:1,...cams.amenities,rz:cams.amenities.rz-360,f:'amenities'}
];
const ease=(t:number)=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function at(p:number){let i=0;while(i<path.length-2&&p>path[i+1].p)i++;const a=path[i],b=path[i+1];const t=ease(Math.min(1,Math.max(0,(p-a.p)/(b.p-a.p||1))));const m=(k:keyof Cam)=>a[k]+(b[k]-a[k])*t;return {cam:{rx:m('rx'),rz:m('rz'),s:m('s'),x:m('x'),y:m('y')},f:(t>.5?b.f:a.f) as Focus}}

function Box({x,y,w,d,h,cls,front}:{x:number;y:number;w:number;d:number;h:number;cls:string;front?:React.ReactNode}){
 return <div className={`bx ${cls}`} style={{left:x,top:y,width:w,height:d}}>
  <i className="f f-top" style={{width:w,height:d,transform:`translateZ(${h}px)`}}/>
  <i className="f f-back" style={{width:w,height:h}}/>
  <i className="f f-left" style={{width:h,height:d,left:-h}}/>
  <i className="f f-right" style={{width:h,height:d,left:w}}/>
  <div className="f f-front" style={{width:w,height:h,top:d-h}}>{front}</div>
 </div>
}
const Door=({n,at,floor}:{n:number;at:number;floor:1|2})=><span className={`dr dr-${typeOf(n)} ${petRooms.includes(n)?'dr-pet':''}`} style={{left:at,top:floor===2?'10%':'58%'}}><b>{String(n).padStart(2,'0')}</b></span>;
const Tag=({label,at,cls=''}:{label:string;at:number;cls?:string})=><span className={`dr dr-tag ${cls}`} style={{left:at,top:'58%'}}><b>{label}</b></span>;
const Tree=({x,y,s=1}:{x:number;y:number;s?:number})=><div className="tree" style={{left:x,top:y,'--ts':s} as React.CSSProperties}><i/><i/></div>;
const Label=({n,x,y,z,text}:{n:number;x:number;y:number;z:number;text:string})=><div className="ld-label" style={{left:x,top:y,'--z':`${z}px`} as React.CSSProperties}><span><b>{n}</b>{text}</span></div>;

const HALL=[-166,-118.5,-71,-23.5,23.5,71,118.5,166];
const steps:{id:Focus;label:string}[]=[{id:'overview',label:'The property'},{id:'king',label:'Comfort King'},{id:'queen',label:'Double Queen'},{id:'pet',label:'Pet-friendly'},{id:'amenities',label:'On site'}];

export default function RoomDirectory(){
 const sec=useRef<HTMLElement>(null);const world=useRef<HTMLDivElement>(null);const stage=useRef<HTMLDivElement>(null);
 const [focus,setFocus]=useState<Focus>('overview');const [flying,setFlying]=useState(false);
 useEffect(()=>{const el=sec.current,w=world.current,st=stage.current;if(!el||!w||!st)return;let raf=0;let last:Focus='overview';
  const apply=(c:Cam)=>{const fit=Math.min(1.15,st.clientWidth/1000,st.clientHeight/620);w.style.transform=`rotateX(${c.rx}deg) rotateZ(${c.rz}deg) scale(${c.s*fit}) translate3d(${-c.x}px,${-c.y}px,0)`;w.style.setProperty('--rx',`${c.rx}deg`);w.style.setProperty('--rz',`${c.rz}deg`)};
  const paint=()=>{raf=0;const on=document.documentElement.dataset.motion==='on'&&getComputedStyle(el).getPropertyValue('--pinned').trim()==='1';setFlying(on);if(!on){apply(cams[last]);return}const r=el.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/Math.max(1,el.offsetHeight-innerHeight)));const {cam,f}=at(p);apply(cam);if(f!==last){last=f;setFocus(f)}};
  const on=()=>{if(!raf)raf=requestAnimationFrame(paint)};paint();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);addEventListener('motion-change',on);
  const pick=(e:Event)=>{last=(e as CustomEvent).detail;on()};addEventListener('ld-focus',pick);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',on);removeEventListener('resize',on);removeEventListener('motion-change',on);removeEventListener('ld-focus',pick)}},[]);
 function choose(f:Focus){const el=sec.current;if(flying&&el){const target=path.find(k=>k.f===f&&k.p>=(f==='overview'?.12:0))!;const p=f==='overview'?.14:target.p+.03;scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*p,behavior:'smooth'});return}setFocus(f);dispatchEvent(new CustomEvent('ld-focus',{detail:f}))}
 const k=roomKinds.king,q=roomKinds.queen;
 return <section className={`ld ld-${focus} ${flying?'is-flying':''}`} id="rooms" aria-labelledby="ld-title" ref={sec}>
  <div className="ld-pin">
   <div className="ld-stage" ref={stage} aria-hidden="true">
    <div className="ld-world" ref={world}>
     <svg className="ld-ground" viewBox="-700 -500 1400 1000" style={{left:-700,top:-500}}>
      <defs><pattern id="ld-grass" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#cdbb8a"/><circle cx="4" cy="5" r="1.2" fill="#b5a06c"/><circle cx="11" cy="11" r="1" fill="#a99662"/></pattern></defs>
      <rect x="-700" y="-500" width="1400" height="1000" fill="url(#ld-grass)"/>
      <path d="M-700 330 C -450 300, -250 380, 0 350 S 450 310, 700 360 L 700 500 L -700 500 Z" fill="#3f8f97"/>
      <path d="M-700 330 C -450 300, -250 380, 0 350 S 450 310, 700 360" fill="none" stroke="#d9ecdf" strokeWidth="14" opacity=".7"/>
      <path className="ld-flow" d="M-700 400 C -450 370, -250 450, 0 420 S 450 380, 700 430" fill="none" stroke="#e8f6f2" strokeWidth="3" strokeDasharray="6 30"/>
      <rect x="-700" y="228" width="1400" height="64" fill="#5d5a55"/>
      <path d="M-700 260 H 700" stroke="#f2c14e" strokeWidth="3" strokeDasharray="26 18"/>
      <rect x="-360" y="62" width="720" height="150" rx="8" fill="#8d8a84"/>
      {Array.from({length:15},(_,i)=><rect key={i} x={-330+i*46} y="70" width="3" height="46" fill="#f4f1e8"/>)}
      {Array.from({length:15},(_,i)=><rect key={`b${i}`} x={-330+i*46} y="158" width="3" height="46" fill="#f4f1e8"/>)}
      <rect x="-26" y="200" width="52" height="30" fill="#8d8a84"/>
      <rect x="-330" y="-250" width="660" height="330" rx="10" fill="#9f9a8a" opacity=".35"/>
      <text x="-640" y="275" className="ld-road-label">MOUNTAIN 99</text>
      <text x="360" y="450" className="ld-river-label">Kern River</text>
     </svg>
     <div className="ld-hills" style={{left:-700,top:-500-240,width:1400,height:240}}><svg viewBox="0 0 1400 240" preserveAspectRatio="none"><path d="M0 240 L0 150 L140 60 L230 120 L360 20 L470 110 L560 70 L700 150 L820 40 L930 120 L1060 50 L1180 130 L1290 80 L1400 140 L1400 240 Z" fill="#b89f7d"/><path d="M0 240 L0 190 L180 120 L330 170 L480 110 L640 180 L800 120 L960 170 L1120 110 L1260 170 L1400 150 L1400 240 Z" fill="#9c8563"/></svg></div>
     {/* The lodge: a long two-story bar with two wings reaching toward the road */}
     <Box x={-300} y={-220} w={600} d={100} h={120} cls="lodge" front={<>{HALL.map((xx,i)=><Door key={`a${i}`} n={i+1} at={xx+300} floor={1}/>)}{HALL.map((xx,i)=><Door key={`b${i}`} n={i+15} at={xx+300} floor={2}/>)}</>}/>
     <Box x={-300} y={-120} w={110} d={160} h={120} cls="lodge wing" front={<><Door n={13} at={30} floor={2}/><Door n={14} at={80} floor={2}/><Tag label="Laundry" at={55} cls="dr-laundry"/></>}/>
     <Box x={190} y={-120} w={110} d={160} h={120} cls="lodge wing" front={<><Door n={23} at={30} floor={2}/><Door n={24} at={80} floor={2}/><Tag label="Office" at={55} cls="dr-office"/></>}/>
     <Box x={-190} y={-119} w={380} d={15} h={60} cls="walk"/>
     <Box x={-300} y={41} w={110} d={20} h={60} cls="walk"/>
     <Box x={190} y={41} w={110} d={20} h={60} cls="walk"/>
     <Box x={-110} y={-80} w={220} d={70} h={8} cls="deck"/>
     {[-70,0,70].map(xx=><div key={xx} className="umbrella" style={{left:xx,top:-45}}><i/><b/></div>)}
     {[-40,40].map(xx=><Box key={xx} x={xx-5} y={210} w={10} d={10} h={80} cls="post"/>)}
     <Box x={-58} y={208} w={116} d={14} h={14} cls="beam" />
     <div className="arch-sign" style={{left:-52,top:215}}><span>Welcome to Corral Creek</span></div>
     {[[-520,-300,1.3],[-460,-160,1],[-600,40,1.2],[430,-300,1.2],[520,-150,1],[600,60,1.3],[-380,-330,.9],[360,-330,.9],[-560,200,1],[560,190,1.1],[-150,-300,.8],[150,-310,.9]].map(([x,y,s],i)=><Tree key={i} x={x} y={y} s={s}/>)}
     <Label n={1} x={245} y={40} z={150} text="Office"/>
     <Label n={2} x={0} y={-45} z={70} text="BBQ deck"/>
     <Label n={3} x={0} y={216} z={120} text="Entrance"/>
     <Label n={4} x={-250} y={140} z={40} text="Parking"/>
     <Label n={5} x={-245} y={40} z={150} text="Laundry"/>
    </div>
    <div className="ld-vignette"/>
   </div>
   <div className="ld-panel">
    <p className="chapter-mark"><span>02</span>The rooms</p>
    <h2 id="ld-title">Twenty studios. <em>Pick your door.</em></h2>
    <div className="ld-steps" role="group" aria-label="Show on the model">{steps.map(s=><button key={s.id} aria-pressed={focus===s.id} onClick={()=>choose(s.id)}>{s.label}</button>)}</div>
    <div className="ld-cards">
     <div className={`ld-card ld-card-overview ${focus==='overview'?'is-on':''}`}><p className="ld-rating"><b>{directory.rating}</b> <span aria-hidden="true">★★★★★</span> Google rating</p><ul className="ld-tags"><li>20 studio rooms</li><li>Kitchenette in every room</li><li>Pet-friendly rooms</li><li>Guest laundry</li><li>BBQ deck</li></ul><p>Floor 1 holds rooms 1 to 8, floor 2 holds rooms 13 to 24, all opening onto a courtyard with the Kern across the road.</p></div>
     <div className={`ld-card ld-card-king ${focus==='king'?'is-on':''}`}><div className="ld-thumb"><img src={`/images/${k.image}.jpg`} alt="Comfort King studio with a king bed and kitchenette" loading="lazy"/></div><h3><span className="sw sw-king" aria-hidden="true"/>{k.name}</h3><p className="ld-line">{k.line}</p><p>{k.bed} · sleeps {k.sleeps} · {ROOM_SIZE} · {k.rooms.length} rooms</p><p className="ld-nums">{k.rooms.map(n=><span key={n}>{n}</span>)}</p></div>
     <div className={`ld-card ld-card-queen ${focus==='queen'?'is-on':''}`}><div className="ld-thumb"><img src={`/images/${q.image}.jpg`} alt="Double Queen studio with two queen beds and a kitchenette" loading="lazy"/></div><h3><span className="sw sw-queen" aria-hidden="true"/>{q.name}</h3><p className="ld-line">{q.line}</p><p>{q.bed} · sleeps {q.sleeps} · {ROOM_SIZE} · {q.rooms.length} rooms</p><p className="ld-nums">{q.rooms.map(n=><span key={n}>{n}</span>)}</p></div>
     <div className={`ld-card ld-card-pet ${focus==='pet'?'is-on':''}`}><h3><span className="sw sw-pet" aria-hidden="true"/>Pet-friendly rooms</h3><p className="ld-line">Your dog gets a getaway, too.</p><p>Rooms 1 to 5, all on the ground floor: three Double Queens (1, 2, 3) and two Comfort Kings (4, 5). Pets stay leashed and are never left alone in the room.</p><p className="ld-nums">{petRooms.map(n=><span key={n}>{n}</span>)}</p></div>
     <div className={`ld-card ld-card-amenities ${focus==='amenities'?'is-on':''}`}><ol className="ld-places">{places.map(p=><li key={p.id}><b>{p.n}</b><span><strong>{p.label}</strong>{p.note}</span></li>)}</ol><p className="ld-addr"><LogoMark/> {directory.address}<br/>GPS {directory.gps}</p></div>
    </div>
    <div className="ld-cta"><BookButton className="button ld-book"/><span>Check-in 3 pm · Check-out 11 am · Step-free needs? Call <a href="tel:+17603763601">760-376-3601</a></span></div>
    <p className="ld-hint" aria-hidden="true">{flying?'Keep scrolling to fly around the lodge':'Tap a room type to fly to it'}</p>
   </div>
  </div>
 </section>
}
