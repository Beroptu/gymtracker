import {useEffect,useState} from 'react';
import {Clock3,Pause,Plus,TimerReset} from 'lucide-react';
import {Button} from './ui/button';
import {Workout} from '../types';
export default function RestTimer({workout,onUpdate}:{workout:Workout;onUpdate:(patch:Partial<Workout>)=>void}){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const id=window.setInterval(()=>setNow(Date.now()),300);return()=>window.clearInterval(id)},[]);
  const remaining=Math.max(0,Math.ceil(((workout.restEndAt??0)-now)/1000));
  const running=remaining>0;
  const mm=String(Math.floor(remaining/60)).padStart(2,'0');const ss=String(remaining%60).padStart(2,'0');
  const circumference=2*Math.PI*29;
  const rate=running ? Math.min(1,remaining/workout.restSeconds):0;
  return <div className="rounded-[22px] border border-line bg-surface p-4 sm:p-5"><div className="flex items-center gap-4"><div className="relative flex h-20 w-20 shrink-0 items-center justify-center"><svg className="absolute inset-0 -rotate-90" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="29" fill="none" stroke="rgb(var(--raised))" strokeWidth="6"/><circle cx="40" cy="40" r="29" fill="none" stroke="#4385ff" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference*(1-rate)} className="transition-all duration-300"/></svg><span className="font-mono text-lg font-extrabold tabular-nums">{running?`${mm}:${ss}`:'—:—'}</span></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm font-bold"><Clock3 size={17} className="text-accent"/>Таймер отдыха</div><div className="mt-1 text-xs text-muted">{running?'Восстановись перед следующим подходом':'Выбери время для отдыха'}</div><div className="mt-3 flex flex-wrap gap-1.5">{[60,90,120,180].map(time=><button key={time} onClick={()=>onUpdate({restSeconds:time,restEndAt:Date.now()+time*1000})} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${workout.restSeconds===time?'bg-accent text-white':'bg-raised text-muted hover:text-foreground'}`}>{time} сек</button>)}</div></div></div><div className="mt-3 flex justify-end gap-2 border-t border-line pt-3">{running&&<Button size="sm" variant="secondary" onClick={()=>onUpdate({restEndAt:(workout.restEndAt??Date.now())+30000})}><Plus size={15}/>30 сек</Button>}<Button size="sm" variant="ghost" onClick={()=>onUpdate({restEndAt:undefined})}>{running?<Pause size={15}/>:<TimerReset size={15}/>} {running?'Остановить':'Сбросить'}</Button></div></div>;
}
