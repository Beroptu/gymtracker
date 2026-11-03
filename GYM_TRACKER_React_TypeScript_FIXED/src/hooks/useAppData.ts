import { useCallback, useEffect, useState } from 'react';
import { AppData } from '../types';
import { loadData, saveData } from '../lib/storage';
export function useAppData() {
  const [data,setData]=useState<AppData>(loadData);
  const update=useCallback((fn:(prev:AppData)=>AppData)=>setData(fn),[]);
  useEffect(()=>{try {saveData(data);} catch(e) {console.error('Нет места в локальном хранилище',e);}},[data]);
  useEffect(()=>{document.documentElement.classList.toggle('dark',data.theme==='dark');document.documentElement.style.colorScheme=data.theme;},[data.theme]);
  return {data,setData,update};
}
