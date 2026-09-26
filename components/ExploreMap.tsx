'use client';
import ValleyGuide,{useLocalData,ValleySignal} from './ValleyGuide';
export default function ExploreMap(){const {data,failed}=useLocalData();return <><ValleySignal data={data}/><ValleyGuide data={data} failed={failed}/></>}
