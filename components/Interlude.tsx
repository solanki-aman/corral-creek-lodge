// A pinned scroll scene: the lodge photo opens from a small frame to full screen while a day at the lodge is told line by line.
// The motion is pure CSS scroll-driven animation; without support, or with motion off, it renders as a still, readable panel.
const lines=[{t:'Coffee on the porch.',s:'Twenty rooms, each with its own kitchenette.'},{t:'The river, across the road.',s:'Upper Kern whitewater, a short walk away.'},{t:'Burgers on the deck at dusk.',s:'Propane BBQs, picnic tables, ice for the cooler.'}];
export default function Interlude(){return <section className="il" aria-label="A day at Corral Creek">
 <div className="il-pin">
  <div className="il-frame"><img src="/images/porch.jpg" alt="The wooden porch and green room doors at Corral Creek Lodge" loading="lazy"/><div className="il-shade"/></div>
  <p className="il-kicker">A day at Corral Creek</p>
  <ol className="il-lines">{lines.map((l,i)=><li key={l.t} style={{'--i':i} as React.CSSProperties}><strong>{l.t}</strong><span>{l.s}</span></li>)}</ol>
  <dl className="il-count"><div><dt>Rooms</dt><dd>20</dd></div><div><dt>Miles to Kernville</dt><dd>9</dd></div><div><dt>River across the road</dt><dd>1</dd></div></dl>
 </div>
</section>}
