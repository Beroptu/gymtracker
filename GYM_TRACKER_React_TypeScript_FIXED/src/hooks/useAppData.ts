import {useCallback,useEffect,useRef,useState} from 'react';
import {AppData} from '../types';
import {freshData} from '../lib/defaults';
import {loadData} from '../lib/storage';
import {loadCloudData,saveCloudData} from '../lib/cloud';
export function useAppData(userId:string){
 const [data,setData]=useState<AppData>(freshData);
 const [ready,setReady]=useState(false);
 const [cloudError,setCloudError]=useState('');
 const [hasLocalData,setHasLocalData]=useState(false);
 const [revision,setRevision]=useState(0);
 const revisionRef=useRef(0);
 const update=useCallback((fn:(prev:AppData)=>AppData)=>{setData(prev=>fn(prev));revisionRef.current++;setRevision(revisionRef.current);},[]);
 useEffect(()=>{let canceled=false;setReady(false);setCloudError('');(async()=>{try{const cloud=await loadCloudData();if(canceled)return;setData(cloud??freshData());const local=loadData();setHasLocalData(!cloud&&(local.history.length>0||local.active!==null));setReady(true);}catch(err){if(!canceled)setCloudError(err instanceof Error?err.message:'Ошибка загрузки');}})();return()=>{canceled=true;};},[userId]);
 useEffect(()=>{if(!ready||revision===0)return;const timer=window.setTimeout(()=>{saveCloudData(data).then(()=>setCloudError('')).catch(e=>setCloudError(e instanceof Error?e.message:'Ошибка сохранения'));},850);return()=>clearTimeout(timer);},[data,ready,revision]);
 useEffect(()=>{document.documentElement.classList.toggle('dark',data.theme==='dark');document.documentElement.style.colorScheme=data.theme;},[data.theme]);
 const importLocal=()=>{const local=loadData();update(()=>local);setHasLocalData(false);};
 return {data,setData,update,ready,cloudError,hasLocalData,importLocal};
}
