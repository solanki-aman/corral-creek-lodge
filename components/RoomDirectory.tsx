'use client';
import {useEffect,useRef,useState} from 'react';
import {BookButton} from './SiteChrome';
import {LogoMark} from './Logo';
import {ROOM_SIZE,directory,petRooms,places,roomKinds,typeOf} from '../lib/rooms';

/*
 The lodge, modelled in CSS 3D (vector-sharp at any size, no WebGL). The footprint is traced from satellite imagery:
 two long two-story wings meeting at a bend, their balconies facing the parking lot, a lawn of big pines along
 Mountain 99, the log welcome arch at the driveway and the Kern beyond the road.
 World units: 3 per satellite pixel (about 8 cm). x runs east, y runs south, z is up.

 The chapter opens on the real welcome-arch photo. Scrolling dissolves the photo into the model seen from the same
 spot by the arch, then the camera rises, circles the property and settles on each room type.
*/
const sat=(x:number,y:number)=>[(x-310)*3,(y-430)*3] as const;
const pts=(a:number[][])=>a.map(([x,y])=>sat(x,y).join(',')).join(' ');

type Focus='overview'|'king'|'queen'|'pet'|'amenities';
type Cam={rx:number;rz:number;s:number;x:number;y:number};
const cams:Record<Focus,Cam>={overview:{rx:56,rz:-30,s:.62,x:40,y:120},king:{rx:62,rz:-42,s:1.05,x:40,y:-20},queen:{rx:62,rz:-26,s:1.05,x:40,y:-20},pet:{rx:60,rz:-24,s:1.05,x:-70,y:-50},amenities:{rx:52,rz:-38,s:.72,x:0,y:200}};
// Scroll path: photo hold, dissolve, rise and orbit, then one stop per room type.
const START:Cam={rx:86,rz:-52,s:1.25,x:-150,y:430};
const path:(Cam&{p:number;f:Focus})[]=[
 {p:0,...START,f:'overview'},{p:.1,...START,f:'overview'},
 {p:.2,rx:74,rz:-45,s:.8,x:-20,y:260,f:'overview'},
 {p:.3,rx:58,rz:-110,s:.6,x:40,y:120,f:'overview'},
 {p:.4,rx:56,rz:-230,s:.6,x:40,y:120,f:'overview'},
 {p:.48,rx:56,rz:-390,s:.62,x:40,y:120,f:'overview'},
 {p:.55,...cams.king,rz:cams.king.rz-360,f:'king'},{p:.63,...cams.king,rz:cams.king.rz-360,f:'king'},
 {p:.7,...cams.queen,rz:cams.queen.rz-360,f:'queen'},{p:.78,...cams.queen,rz:cams.queen.rz-360,f:'queen'},
 {p:.85,...cams.pet,rz:cams.pet.rz-360,f:'pet'},{p:.91,...cams.pet,rz:cams.pet.rz-360,f:'pet'},
 {p:.97,...cams.amenities,rz:cams.amenities.rz-360,f:'amenities'},{p:1,...cams.amenities,rz:cams.amenities.rz-360,f:'amenities'}
];
const ease=(t:number)=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function at(p:number){let i=0;while(i<path.length-2&&p>path[i+1].p)i++;const a=path[i],b=path[i+1];const t=ease(Math.min(1,Math.max(0,(p-a.p)/(b.p-a.p||1))));const m=(k:keyof Cam)=>a[k]+(b[k]-a[k])*t;return {cam:{rx:m('rx'),rz:m('rz'),s:m('s'),x:m('x'),y:m('y')},f:(t>.5?b.f:a.f) as Focus}}

// ---------- building parts (local coordinates of a wing: x along the wing, y from back wall to front) ----------
const H=120,D=132,BAL=30,RIDGE=48;
const Door=({n,x,floor}:{n:number;x:number;floor:1|2})=><span className={`dr dr-${typeOf(n)} ${petRooms.includes(n)?'dr-pet':''}`} style={{left:x,top:floor===2?14:H/2+14}}><b>{String(n).padStart(2,'0')}</b></span>;
const Tag=({label,x,cls}:{label:string;x:number;cls:string})=><span className={`dr dr-tag ${cls}`} style={{left:x,top:H/2+14}}><b>{label}</b></span>;
function Wing({x,y,angle,L,join,children}:{x:number;y:number;angle:number;L:number;join:'start'|'end';children:React.ReactNode}){
 const T=D+BAL,half=T/2,S=Math.hypot(half,RIDGE),a=Math.atan2(RIDGE,half)*180/Math.PI;
 const posts=Array.from({length:Math.floor(L/58)+1},(_,i)=>8+i*((L-16)/Math.floor(L/58)));
 return <div className="wg" style={{left:x,top:y,transform:`rotateZ(${angle}deg)`}}>
  {/* walls */}
  <i className="f wl-back" style={{width:L,height:H}}/>
  {join!=='start'&&<i className="f wl-end" style={{width:H,height:D,left:-H}}/>}
  {join!=='end'&&<i className="f wl-end wl-end-r" style={{width:H,height:D,left:L}}/>}
  <div className="f wl-front" style={{width:L,height:H,top:D-H}}>{children}</div>
  {/* upper balcony: deck, railing and the posts that carry the roof overhang */}
  <i className="f bal-deck" style={{width:L,height:BAL,top:D,transform:`translateZ(${H/2}px)`}}/>
  <i className="f bal-rail" style={{width:L,height:24,top:T-24,transform:`translateZ(${H/2}px) rotateX(-90deg)`}}/>
  <i className="f bal-rail bal-rail-low" style={{width:L,height:14,top:T-14,transform:'rotateX(-90deg)'}}/>
  {posts.map(px=><i key={px} className="f bal-post" style={{left:px,width:5,height:H+6,top:T-H-6,transform:'rotateX(-90deg)'}}/>)}
  {/* pitched roof with gable ends */}
  <i className="f rf rf-back" style={{width:L+16,left:-8,height:S,transform:`translateZ(${H}px) rotateX(${a}deg)`}}/>
  <i className="f rf rf-front" style={{width:L+16,left:-8,height:S,top:T-S,transform:`translateZ(${H}px) rotateX(${-a}deg)`}}/>
  {join!=='start'&&<i className="f gable" style={{width:RIDGE,height:T,left:-RIDGE,transform:`translateZ(${H}px) rotateY(90deg)`}}/>}
  {join!=='end'&&<i className="f gable" style={{width:RIDGE,height:T,left:L-RIDGE,transform:`translateZ(${H}px) rotateY(90deg)`}}/>}
 </div>
}
function Stair({x,y,angle,flip=false}:{x:number;y:number;angle:number;flip?:boolean}){return <div className="wg" style={{left:x,top:y,transform:`rotateZ(${angle}deg)`}}><i className="f stair" style={{width:100,height:26,left:flip?-100:0,transformOrigin:flip?'right':'left',transform:`translateZ(${H/2}px) rotateY(${flip?-37:37}deg)`}}/></div>}
function Box({x,y,w,d,h,cls}:{x:number;y:number;w:number;d:number;h:number;cls:string}){
 return <div className={`bx ${cls}`} style={{left:x,top:y,width:w,height:d}}>
  <i className="f f-top" style={{width:w,height:d,transform:`translateZ(${h}px)`}}/>
  <i className="f f-back" style={{width:w,height:h}}/><i className="f f-left" style={{width:h,height:d,left:-h}}/>
  <i className="f f-right" style={{width:h,height:d,left:w}}/><i className="f f-front" style={{width:w,height:h,top:d-h}}/>
 </div>
}
const Tree=({x,y,s=1,kind='pine'}:{x:number;y:number;s?:number;kind?:'pine'|'cedar'|'scrub'})=><div className={`tree tree-${kind}`} style={{left:x,top:y,'--ts':s} as React.CSSProperties}><i/><i/><i/></div>;
const Label=({n,x,y,z,text}:{n:number;x:number;y:number;z:number;text:string})=><div className="ld-label" style={{left:x,top:y,'--z':`${z}px`} as React.CSSProperties}><span><b>{n}</b>{text}</span></div>;
const spread=(n:number,from:number,to:number)=>Array.from({length:n},(_,i)=>from+(to-from)*(n===1?.5:i/(n-1)));

// Wings: the west wing runs east from the laundry end; the east wing bends 60° toward the road and ends at the office.
const W1={x:sat(220,372)[0],y:sat(220,372)[1],L:300,angle:0,join:'end' as const};
const W2={x:sat(318,366)[0],y:sat(318,366)[1],L:500,angle:60,join:'start' as const};
const west2=[13,14,15,16,17],east2=[18,19,20,21,22,23,24],west1=[1,2,3],east1=[4,5,6,7,8];
const bigTrees:[number,number,number,'pine'|'cedar'|'scrub'][]=[[285,455,1.7,'pine'],[240,490,1.5,'cedar'],[210,462,1.2,'pine'],[275,515,1.1,'cedar'],[196,386,1.2,'pine'],[182,318,1.3,'pine'],[330,165,1.3,'scrub'],[252,196,1.1,'scrub'],[275,142,1,'scrub'],[345,55,1,'scrub'],[392,28,1.1,'scrub'],[492,26,1.1,'scrub'],[618,48,1,'scrub'],[574,124,1,'scrub'],[645,124,1.1,'scrub'],[474,265,1.1,'scrub'],[418,448,.9,'pine'],[250,630,.9,'pine'],[160,555,.8,'cedar'],[125,455,.8,'cedar'],[480,545,1.2,'pine'],[462,690,1,'pine'],[740,720,1,'scrub'],[690,260,.9,'scrub'],[560,20,.9,'scrub']];

const steps:{id:Focus;label:string}[]=[{id:'overview',label:'The property'},{id:'king',label:'Comfort King'},{id:'queen',label:'Double Queen'},{id:'pet',label:'Pet-friendly'},{id:'amenities',label:'On site'}];

export default function RoomDirectory(){
 const sec=useRef<HTMLElement>(null);const world=useRef<HTMLDivElement>(null);const stage=useRef<HTMLDivElement>(null);
 const [focus,setFocus]=useState<Focus>('overview');const [flying,setFlying]=useState(false);
 useEffect(()=>{const el=sec.current,w=world.current,st=stage.current;if(!el||!w||!st)return;let raf=0;let last:Focus='overview';
  const apply=(c:Cam)=>{const fit=Math.min(1.15,st.clientWidth/1000,st.clientHeight/620);w.style.transform=`rotateX(${c.rx}deg) rotateZ(${c.rz}deg) scale(${c.s*fit}) translate3d(${-c.x}px,${-c.y}px,0)`;w.style.setProperty('--rx',`${c.rx}deg`);w.style.setProperty('--rz',`${c.rz}deg`)};
  const paint=()=>{raf=0;const on=document.documentElement.dataset.motion==='on'&&getComputedStyle(el).getPropertyValue('--pinned').trim()==='1';setFlying(on);
   if(!on){el.style.setProperty('--intro','1');apply(cams[last]);return}
   const r=el.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/Math.max(1,el.offsetHeight-innerHeight)));
   el.style.setProperty('--intro',String(Math.min(1,Math.max(0,(p-.06)/.12))));
   const {cam,f}=at(p);apply(cam);if(f!==last){last=f;setFocus(f)}};
  const on=()=>{if(!raf)raf=requestAnimationFrame(paint)};paint();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);addEventListener('motion-change',on);
  const pick=(e:Event)=>{last=(e as CustomEvent).detail;on()};addEventListener('ld-focus',pick);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',on);removeEventListener('resize',on);removeEventListener('motion-change',on);removeEventListener('ld-focus',pick)}},[]);
 function choose(f:Focus){const el=sec.current;if(flying&&el){const target=path.find(k=>k.f===f&&k.p>=.3)!;const p=f==='overview'?.32:target.p+.03;scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*p,behavior:'smooth'});return}setFocus(f);dispatchEvent(new CustomEvent('ld-focus',{detail:f}))}
 const k=roomKinds.king,q=roomKinds.queen;
 const [ax,ay]=sat(236,648);
 return <section className={`ld ld-${focus} ${flying?'is-flying':''}`} id="rooms" aria-labelledby="ld-title" ref={sec}>
  <div className="ld-pin">
   <div className="ld-stage" ref={stage} aria-hidden="true">
    <svg className="ld-sky" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="ld-granite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9d3c7"/><stop offset="1" stopColor="#a39a8a"/></linearGradient></defs><path d="M0 500 L0 300 L120 210 L200 250 L330 120 L420 190 L520 90 L610 160 L700 110 L820 60 L930 150 L1040 100 L1150 170 L1260 80 L1380 170 L1480 130 L1600 200 L1600 500Z" fill="url(#ld-granite)"/><path d="M330 120 L360 170 L340 160 L310 190Z M820 60 L860 110 L830 100 L800 130Z M1260 80 L1290 130 L1270 118 L1240 140Z" fill="#f4f1ea" opacity=".7"/><path d="M0 500 L0 380 L160 320 L300 360 L460 290 L620 350 L780 300 L930 360 L1100 300 L1260 350 L1420 310 L1600 350 L1600 500Z" fill="#c9a86a"/><path d="M0 500 L0 430 L220 400 L420 440 L640 400 L860 440 L1080 405 L1300 440 L1600 410 L1600 500Z" fill="#b08f55"/></svg>
    <div className="ld-world" ref={world}>
     <svg className="ld-ground" viewBox="-930 -1100 2300 2110" style={{left:-930,top:-1100,width:2300,height:2110}}>
      <defs>
       <pattern id="ld-dirt" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#c9ad7a"/><circle cx="5" cy="6" r="1.4" fill="#b39463"/><circle cx="13" cy="13" r="1.1" fill="#a88a5a"/><circle cx="14" cy="4" r=".9" fill="#d8c296"/></pattern>
       <pattern id="ld-grass" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#6f9a52"/><path d="M3 9 l1 -4 M8 11 l1 -5" stroke="#5c8544" strokeWidth="1.2"/></pattern>
      </defs>
      <rect x="-930" y="-1100" width="2300" height="2110" fill="url(#ld-dirt)"/>
      {/* dirt tracks up the hill behind the lodge */}
      <path d={`M${sat(160,300)} C ${sat(260,200)} ${sat(420,140)} ${sat(640,0)}`} fill="none" stroke="#dcc79c" strokeWidth="26" strokeLinecap="round"/>
      <path d={`M${sat(430,520)} C ${sat(520,420)} ${sat(600,330)} ${sat(640,300)} S ${sat(700,320)} ${sat(720,340)}`} fill="none" stroke="#dcc79c" strokeWidth="22" strokeLinecap="round"/>
      {/* the Kern, across the road */}
      <path d="M-930 -1100 L-800 -1100 C -760 -700, -840 -300, -760 100 S -700 700, -640 1010 L-930 1010 Z" fill="#3f8f97"/>
      <path d="M-800 -1100 C -760 -700, -840 -300, -760 100 S -700 700, -640 1010" fill="none" stroke="#d9ecdf" strokeWidth="16" opacity=".75"/>
      <path className="ld-flow" d="M-880 -1100 C -840 -700, -900 -300, -840 100 S -780 700, -720 1010" fill="none" stroke="#e8f6f2" strokeWidth="3" strokeDasharray="6 34"/>
      {/* Mountain 99 */}
      <path d={`M${sat(78,-40)} L${sat(228,800)}`} stroke="#5d5a55" strokeWidth="72"/>
      <path d={`M${sat(78,-40)} L${sat(228,800)}`} stroke="#f2c14e" strokeWidth="3" strokeDasharray="26 18"/>
      {/* lawn with big trees along the road, parking lot and driveway */}
      <polygon points={pts([[200,432],[262,436],[300,640],[250,652],[205,560]])} fill="url(#ld-grass)"/>
      <polygon points={pts([[262,436],[300,428],[350,470],[398,522],[400,566],[372,612],[336,652],[300,660],[250,652],[296,640]])} fill="#8b8883"/>
      <polygon points={pts([[232,636],[300,640],[300,662],[228,660]])} fill="#8b8883"/>
      {Array.from({length:7},(_,i)=>{const [x1,y1]=sat(292+i*2,470+i*25),[x2,y2]=sat(312+i*2,468+i*25);return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f4f1e8" strokeWidth="3"/>})}
      {Array.from({length:6},(_,i)=>{const [x1,y1]=sat(345+i*6,478+i*18),[x2,y2]=sat(362+i*6,470+i*18);return <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f4f1e8" strokeWidth="3"/>})}
      {/* building shadow */}
      <polygon points={pts([[216,368],[322,360],[420,522],[398,538],[330,420],[216,426]])} fill="#000" opacity=".12" transform="translate(14 14)"/>
      <circle cx={sat(716,365)[0]} cy={sat(716,365)[1]} r="62" fill="#e9e6de" stroke="#b9b3a6" strokeWidth="6"/>
      <text x={sat(95,700)[0]} y={sat(95,700)[1]} className="ld-road-label" transform={`rotate(-80 ${sat(95,700)[0]} ${sat(95,700)[1]})`}>MOUNTAIN 99</text>
      <text x="-900" y="700" className="ld-river-label" transform="rotate(-84 -900 700)">Kern River</text>
     </svg>
     {/* white split-rail fence along the road */}
     <div className="wg" style={{left:sat(203,300)[0],top:sat(203,300)[1],transform:`rotateZ(${Math.atan2(sat(236,636)[1]-sat(203,300)[1],sat(236,636)[0]-sat(203,300)[0])*180/Math.PI}deg)`}}><i className="f fence" style={{width:Math.hypot(sat(236,636)[0]-sat(203,300)[0],sat(236,636)[1]-sat(203,300)[1]),height:22,top:-22,transform:'rotateX(-90deg)'}}/></div>
     <Wing {...W1}>{west2.map((n,i)=><Door key={n} n={n} x={spread(5,70,W1.L-30)[i]} floor={2}/>)}<Tag label="Laundry" x={40} cls="dr-laundry"/>{west1.map((n,i)=><Door key={n} n={n} x={spread(3,120,W1.L-40)[i]} floor={1}/>)}</Wing>
     <Wing {...W2}>{east2.map((n,i)=><Door key={n} n={n} x={spread(7,60,W2.L-40)[i]} floor={2}/>)}{east1.map((n,i)=><Door key={n} n={n} x={spread(5,60,W2.L-130)[i]} floor={1}/>)}<Tag label="Office" x={W2.L-60} cls="dr-office"/></Wing>
     <div className="wg" style={{left:W2.x,top:W2.y,transform:'rotateZ(60deg)'}}><Stair x={W2.L} y={D+2} angle={0}/></div>
     <Box x={sat(312,436)[0]} y={sat(312,436)[1]} w={96} d={70} h={10} cls="deck"/>
     {[[322,442],[336,452]].map(([x,y])=>{const [px,py]=sat(x,y);return <div key={x} className="umbrella" style={{left:px,top:py}}><i/><b/></div>})}
     {/* log welcome arch over the driveway: two posts, a beam, the sign, cut-out pines and a trout */}
     <div className="wg arch" style={{left:ax,top:ay,transform:'rotateZ(90deg)'}}>
      {[-58,58].map(o=><Box key={o} x={o-6} y={-6} w={12} d={12} h={104} cls="post"/>)}
      <div className="wg" style={{left:0,top:0,transform:'translateZ(96px)'}}><Box x={-74} y={-7} w={148} d={14} h={12} cls="beam"/></div>
      <div className="f arch-sign" style={{left:-54,width:108,height:24,top:-24,transform:'translateZ(66px) rotateX(-90deg)'}}><span>Welcome to Corral Creek</span></div>
      <div className="f arch-cutout" style={{left:-50,width:100,height:34,top:-34,transform:'translateZ(108px) rotateX(-90deg)'}}><i className="c-pine"/><i className="c-trout"/><i className="c-pine"/></div>
     </div>
     {bigTrees.map(([x,y,s,kind],i)=>{const [px,py]=sat(x,y);return <Tree key={i} x={px} y={py} s={s} kind={kind}/>})}
     <Label n={1} x={sat(412,528)[0]} y={sat(412,528)[1]} z={170} text="Office"/>
     <Label n={2} x={sat(318,444)[0]} y={sat(318,444)[1]} z={60} text="BBQ deck"/>
     <Label n={3} x={ax} y={ay} z={150} text="Entrance"/>
     <Label n={4} x={sat(340,590)[0]} y={sat(340,590)[1]} z={30} text="Parking"/>
     <Label n={5} x={sat(222,398)[0]} y={sat(222,398)[1]} z={170} text="Laundry"/>
    </div>
    <div className="ld-vignette"/>
   </div>
   <figure className="ld-photo">
    <img src="/images/lodge.jpg" alt="The Welcome to Corral Creek log arch in front of the red two-story lodge, with granite mountains behind" loading="lazy"/>
    <figcaption><span>You’ve arrived</span><strong>Welcome to <em>Corral Creek.</em></strong><small aria-hidden="true">Scroll to step inside ↓</small></figcaption>
   </figure>
   <div className="ld-panel">
    <p className="chapter-mark"><span>02</span>The rooms</p>
    <h2 id="ld-title">Twenty studios. <em>Pick your door.</em></h2>
    <div className="ld-steps" role="group" aria-label="Show on the model">{steps.map(s=><button key={s.id} aria-pressed={focus===s.id} onClick={()=>choose(s.id)}>{s.label}</button>)}</div>
    <div className="ld-cards">
     <div className={`ld-card ld-card-overview ${focus==='overview'?'is-on':''}`}><p className="ld-rating"><b>{directory.rating}</b> <span aria-hidden="true">★★★★★</span> Google rating</p><ul className="ld-tags"><li>20 studio rooms</li><li>Kitchenette in every room</li><li>Pet-friendly rooms</li><li>Guest laundry</li><li>BBQ deck</li></ul><p>Two long wings of studios, every door opening onto a covered balcony or porch facing the lot, with the Kern across Mountain 99.</p></div>
     <div className={`ld-card ld-card-king ${focus==='king'?'is-on':''}`}><div className="ld-thumb"><img src={`/images/${k.image}.jpg`} alt="Comfort King studio with a king bed and kitchenette" loading="lazy"/></div><h3><span className="sw sw-king" aria-hidden="true"/>{k.name}</h3><p className="ld-line">{k.line}</p><p>{k.bed} · sleeps {k.sleeps} · {ROOM_SIZE} · {k.rooms.length} rooms</p><p className="ld-nums">{k.rooms.map(n=><span key={n}>{n}</span>)}</p></div>
     <div className={`ld-card ld-card-queen ${focus==='queen'?'is-on':''}`}><div className="ld-thumb"><img src={`/images/${q.image}.jpg`} alt="Double Queen studio with two queen beds and a kitchenette" loading="lazy"/></div><h3><span className="sw sw-queen" aria-hidden="true"/>{q.name}</h3><p className="ld-line">{q.line}</p><p>{q.bed} · sleeps {q.sleeps} · {ROOM_SIZE} · {q.rooms.length} rooms</p><p className="ld-nums">{q.rooms.map(n=><span key={n}>{n}</span>)}</p></div>
     <div className={`ld-card ld-card-pet ${focus==='pet'?'is-on':''}`}><h3><span className="sw sw-pet" aria-hidden="true"/>Pet-friendly rooms</h3><p className="ld-line">Your pet gets a getaway, too.</p><p>Rooms 1 to 5, all on the ground floor: three Double Queens (1, 2, 3) and two Comfort Kings (4, 5). Pets stay leashed and are never left alone in the room.</p><p className="ld-nums">{petRooms.map(n=><span key={n}>{n}</span>)}</p></div>
     <div className={`ld-card ld-card-amenities ${focus==='amenities'?'is-on':''}`}><ol className="ld-places">{places.map(p=><li key={p.id}><b>{p.n}</b><span><strong>{p.label}</strong>{p.note}</span></li>)}</ol><p className="ld-addr"><LogoMark/> {directory.address}<br/>GPS {directory.gps}</p></div>
    </div>
    <div className="ld-cta"><BookButton className="button ld-book"/><span>Check-in 3 pm · Check-out 11 am · Step-free needs? Call <a href="tel:+17603763601">760-376-3601</a></span></div>
    <p className="ld-hint" aria-hidden="true">{flying?'Keep scrolling to fly around the lodge':'Tap a room type to fly to it'}</p>
   </div>
  </div>
 </section>
}
