'use client';
import {useEffect} from 'react';
import TreasureMap from './TreasureMap';
import Interlude from './Interlude';
import RoomsBoard from './RoomsBoard';
import ValleyLedger from './ValleyLedger';
import Guestbook from './Guestbook';
import {useLocalData} from './ValleyGuide';

export default function LodgeHome(){const {data,failed}=useLocalData();
 // Chapters rise into place once, as they enter the viewport.
 useEffect(()=>{const els=document.querySelectorAll('.home-chapter');if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('is-in'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e));return()=>io.disconnect()},[]);
 return <><TreasureMap data={data}/><Interlude/><div className="home-chapter"><RoomsBoard/></div><div className="home-chapter"><ValleyLedger data={data} failed={failed}/></div><div className="home-chapter"><Guestbook/></div></>}
