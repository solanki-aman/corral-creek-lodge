// Only fixed public sources are fetched; source markup is never rendered as HTML.
const EVENTS='https://events.kernvalley.us/';
const FORECAST='https://api.weather.gov/gridpoints/HNX/93,48/forecast';
const decode=(s:string)=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
export async function GET(){
 const [weather,events]=await Promise.allSettled([
  fetch(FORECAST,{headers:{'User-Agent':'CorralCreekLodge (corralcreekresort.com)','Accept':'application/geo+json'},signal:AbortSignal.timeout(7000)}).then(async r=>{if(!r.ok)throw Error('weather');const {properties:p}=await r.json() as {properties:{updateTime:string;periods:{endTime:string;name:string;temperature:number;temperatureUnit:string;shortForecast:string}[]}};const period=p.periods.find((x:{endTime:string})=>Date.parse(x.endTime)>Date.now());if(!period||!p.updateTime)throw Error('forecast');return {name:period.name,temperature:period.temperature,temperatureUnit:period.temperatureUnit,shortForecast:period.shortForecast,updated:p.updateTime}}),
  fetch(EVENTS,{signal:AbortSignal.timeout(7000)}).then(async r=>{if(!r.ok)throw Error('events');const html=await r.text();return html.split(/class="event card event-card"/).slice(1).flatMap(block=>{const title=block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/)?.[1];const date=block.match(/itemprop="startDate" datetime="([^"]+)"/)?.[1];const link=block.match(/href="([^"]+)"/)?.[1];if(!title||!date||!link||!Number.isFinite(Date.parse(date))||Date.parse(date)<Date.now())return [];const url=new URL(decode(link),EVENTS);if(url.protocol!=='https:')return [];return [{title:decode(title),date,url:url.href}]}).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).slice(0,3)})
 ]);
 return Response.json({checkedAt:new Date().toISOString(),weather:weather.status==='fulfilled'?weather.value:null,events:events.status==='fulfilled'?events.value:[],eventsAvailable:events.status==='fulfilled'},{headers:{'Cache-Control':'public, max-age=900, s-maxage=900'}});
}
