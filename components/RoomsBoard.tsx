import Link from 'next/link';
import {BookButton} from './SiteChrome';
import {amenities,roomTypes} from '../lib/valley';

export default function RoomsBoard(){return <section className="rb" id="rooms" aria-labelledby="rb-title">
 <header className="rb-head"><p className="chapter-mark"><span>02</span>The rooms</p><h2 id="rb-title">Twenty keys. <em>Four ways to stay.</em></h2><p>Every room is a studio with its own fully stocked kitchenette, a short walk from the river. Designated rooms welcome dogs.</p></header>
 <ul className="rb-grid">{roomTypes.map((r,i)=><li key={r.slug} className="rb-card" style={{'--i':i} as React.CSSProperties}>
  <div className="rb-photo"><img src={`/images/${r.image}.jpg`} alt={r.alt} loading="lazy"/>{r.pets&&<span className="rb-paw">Dogs welcome</span>}<span className="rb-keys">{r.rooms.length}<small> {r.rooms.length===1?"room":"rooms"}</small></span></div>
  <div className="rb-body"><h3><Link href={`/stay/${r.slug}`}>{r.name}</Link></h3><p className="rb-line">{r.line}</p>
   <dl><div><dt>Beds</dt><dd>{r.bed}</dd></div><div><dt>Sleeps</dt><dd>{r.sleeps}</dd></div><div><dt>Size</dt><dd>{r.size}</dd></div></dl>
   <p className="rb-numbers"><span className="sr-only">Room numbers: </span>{r.rooms.map(n=><span key={n}>{n}</span>)}</p></div>
 </li>)}</ul>
 <div className="rb-foot"><ul className="rb-amenities" aria-label="In every stay">{amenities.map(a=><li key={a}>{a}</li>)}</ul><div className="rb-cta"><BookButton className="button rb-book">Check live availability <span aria-hidden="true">↗</span></BookButton><p>Check-in 3 pm · Check-out 11 am · Non-smoking. Need step-free access? Call <a href="tel:+17603763601">760-376-3601</a> before booking.</p></div></div>
</section>}
