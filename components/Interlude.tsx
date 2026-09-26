import {LogoMark} from './Logo';
// A postcard from the lodge. As you scroll, it rises into view, the welcome-arch photo develops like an instant print,
// the postmark lands, and the card flips to a handwritten note. The motion is pure CSS scroll-driven animation;
// without support, or with motion off, both sides sit side by side as a still spread.
const lines=['Coffee on the porch.','The river, across the road.','Burgers on the deck at dusk.'];
export default function Interlude(){return <section className="pc" aria-labelledby="pc-title">
 <div className="pc-pin">
  <p className="pc-kicker" aria-hidden="true">A postcard from up the river</p>
  <div className="pc-fly"><div className="pc-card">
   <figure className="pc-front">
    <img src="/images/lodge.jpg" alt="The Welcome to Corral Creek log arch in front of the red two-story lodge, with granite mountains behind" loading="lazy"/>
    <figcaption className="pc-greeting"><span>Greetings from</span><h2 id="pc-title">Corral Creek</h2></figcaption>
    <span className="pc-postmark" aria-hidden="true"><b>KERNVILLE</b><i>UPPER KERN · CA</i></span>
   </figure>
   <div className="pc-back">
    <div className="pc-note"><p className="pc-dear">Wish you were here,</p><ol>{lines.map((l,i)=><li key={l} style={{'--i':i} as React.CSSProperties}>{l}</li>)}</ol><p className="pc-sign">See you up the river.</p></div>
    <div className="pc-address"><span className="pc-stamp" aria-hidden="true"><LogoMark/></span><p>Corral Creek Lodge<br/>Upper Kern River<br/>Kernville, CA 93238</p></div>
   </div>
  </div></div>
  <dl className="pc-count"><div><dt>Rooms</dt><dd>20</dd></div><div><dt>Miles to Kernville</dt><dd>9</dd></div><div><dt>River across the road</dt><dd>1</dd></div></dl>
 </div>
</section>}
