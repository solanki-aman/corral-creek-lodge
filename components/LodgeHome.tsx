'use client';
import LodgeExperience from './LodgeExperience';
import ValleyGuide,{useLocalData,ValleySignal} from './ValleyGuide';
import Guestbook from './Guestbook';
export default function LodgeHome(){const {data,failed}=useLocalData();return <><ValleySignal data={data}/><LodgeExperience/><ValleyGuide data={data} failed={failed}/><Guestbook/><section className="social-postscript"><div><p className="eyebrow">A POSTCARD IS NICE. KEEPING IN TOUCH IS BETTER.</p><h2>See you <em>up the river.</em></h2></div><a href="https://www.instagram.com/corralcreeklodge/" className="instagram-link">@corralcreeklodge<span>Follow the lodge on Instagram ↗</span></a><a className="social-photo-link" href="/gallery"><img src="/images/porch.jpg" alt="A quiet moment on the Corral Creek Lodge porch" loading="lazy"/><span>Lodge photo album ↗</span></a></section></>}
