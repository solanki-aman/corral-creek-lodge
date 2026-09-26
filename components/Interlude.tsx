// A pinned scroll scene: the lodge's welcome-arch photo opens from a small frame to full screen, then the porch fades in while a day at the lodge is told line by line.
// The motion is pure CSS scroll-driven animation; without support, or with motion off, it renders as a still, readable panel.
const lines=[{t:'Coffee on the porch.',s:'Twenty rooms, each with its own kitchenette.'},{t:'The river, across the road.',s:'Upper Kern whitewater, a short walk away.'},{t:'Burgers on the deck at dusk.',s:'Propane BBQs, picnic tables, ice for the cooler.'}];
export default function Interlude(){return <section className="il" aria-label="A day at Corral Creek">
 <div className="il-pin">
  <div className="il-frame"><img className="il-main" src="/images/lodge.jpg" alt="The Welcome to Corral Creek log arch in front of the red two-story lodge, with granite mountains behind" loading="lazy"/><img className="il-porch" src="/images/porch.jpg" alt="" loading="lazy"/><div className="il-shade"/></div>
  <div className="il-welcome"><p>You’ve arrived</p><h2>Welcome to <em>Corral Creek.</em></h2></div>
  <p className="il-kicker">A day at Corral Creek</p>
  <ol className="il-lines">{lines.map((l,i)=><li key={l.t} style={{'--i':i} as React.CSSProperties}><strong>{l.t}</strong><span>{l.s}</span></li>)}</ol>
  <dl className="il-count"><div><dt>Rooms</dt><dd>20</dd></div><div><dt>Miles to Kernville</dt><dd>9</dd></div><div><dt>River across the road</dt><dd>1</dd></div></dl>
 </div>
</section>}
