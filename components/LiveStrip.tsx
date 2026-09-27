'use client';
import type {LocalData} from './ValleyGuide';

// One compact strip under the hero: the current Kernville forecast and the next few community events, both live.
const pt=(d:string,o:Intl.DateTimeFormatOptions)=>new Date(d).toLocaleString('en-US',{timeZone:'America/Los_Angeles',...o});
export default function LiveStrip({data,failed}:{data:LocalData|null;failed:boolean}){
 const w=data?.weather;
 return <section className="lv" aria-labelledby="lv-title">
  <h2 id="lv-title" className="lv-head"><span className="vl-dot" aria-hidden="true"/>Live up the river</h2>
  <a className="lv-weather" href="https://forecast.weather.gov/MapClick.php?lat=35.7547&lon=-118.4254">
   {w?<><b>{w.temperature}°{w.temperatureUnit}</b><span>{w.shortForecast}<small>{w.name} · Kernville · NWS</small></span></>:<span>{failed||data?'Kernville forecast':'Checking the forecast…'}<small>National Weather Service</small></span>}
  </a>
  <ul className="lv-events">
   {data?.events.length?data.events.map(e=><li key={e.url}><a href={e.url}><time dateTime={e.date}><b>{pt(e.date,{day:'numeric'})}</b>{pt(e.date,{month:'short'})}</time><span>{e.title}<small>{pt(e.date,{weekday:'short',hour:'numeric',minute:'2-digit'})}</small></span></a></li>)
   :<li className="lv-empty">{!data&&!failed?'Checking the community calendar…':'See what’s on in the valley'}</li>}
  </ul>
  <a className="lv-more" href="https://events.kernvalley.us/">All valley events <span aria-hidden="true">→</span></a>
 </section>
}
