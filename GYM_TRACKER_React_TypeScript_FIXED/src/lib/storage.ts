import { AppData } from '../types';
import { freshData } from './defaults';
const KEY = 'gym-tracker:v1';
export function loadData():AppData {
  try {
    const stored=localStorage.getItem(KEY);
    if(!stored) return freshData();
    const parsed:unknown=JSON.parse(stored);
    if(validateData(parsed)) return parsed;
  } catch (e) { console.warn('Не удалось прочитать сохраненные данные:',e); }
  return freshData();
}
export function validateData(v:unknown):v is AppData {
  if(typeof v!=='object'||v===null) return false;
  const p=v as Record<string,unknown>;
  return p.version===1 && Array.isArray(p.plan) && p.plan.length===3 && p.plan.every((d:unknown)=>{
    if(typeof d!=='object'||d===null) return false;
    const o=d as Record<string,unknown>;
    return typeof o.id==='string' && typeof o.weekday==='number' && typeof o.title==='string' && Array.isArray(o.exercises) && o.exercises.every((ex:unknown)=>{
      if(typeof ex!=='object'||ex===null) return false;
      const x=ex as Record<string,unknown>;
      return typeof x.id==='string' && typeof x.name==='string' && typeof x.sets==='number' && typeof x.minReps==='number' && typeof x.maxReps==='number' && typeof x.muscle==='string' && typeof x.increment==='number';
    });
  }) && Array.isArray(p.history) && p.history.every(validateWorkout) && (p.active===null||validateWorkout(p.active)) && (p.theme==='dark'||p.theme==='light');
}
function validateWorkout(v:unknown):boolean {
  if(typeof v!=='object'||v===null) return false;
  const w=v as Record<string,unknown>;
  return typeof w.id==='string' && typeof w.startedAt==='string' && typeof w.dayId==='string' && typeof w.notes==='string' && Array.isArray(w.exercises) && w.exercises.every((e:unknown)=>{
    if(typeof e!=='object'||e===null) return false;
    const x=e as Record<string,unknown>;
    return typeof x.exerciseId==='string' && typeof x.name==='string' && typeof x.muscle==='string' && Array.isArray(x.sets) && x.sets.every((s:unknown)=>{
      if(typeof s!=='object'||s===null) return false;
      const row=s as Record<string,unknown>;
      return typeof row.id==='string' && typeof row.weight==='string' && typeof row.reps==='string' && typeof row.done==='boolean' && typeof row.goodForm==='boolean';
    });
  });
}
export function saveData(data:AppData) { localStorage.setItem(KEY,JSON.stringify(data)); }
export function download(content:string, filename:string, mime:string) {
  const blob=new Blob([content],{type:mime}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
}
export function toCSV(data:AppData) {
  const escape=(v:string|number)=>`"${String(v).replaceAll('"','""')}"`;
  const rows=[['Дата','День','Упражнение','Мышечная группа','Подход','Вес (кг)','Повторения','Выполнен','Правильная техника','Объем (кг)','Заметки']];
  for(const w of data.history) for(const e of w.exercises) for(const [i,s] of e.sets.entries())
    rows.push([w.completedAt??w.startedAt,w.title,e.name,e.muscle,String(i+1),s.weight,s.reps,s.done?'Да':'Нет',s.goodForm?'Да':'Нет',String(s.done?(Number(s.weight.replace(',','.'))||0)*(Number(s.reps.replace(',','.'))||0):0),w.notes]);
  return '\ufeff'+rows.map(row=>row.map(escape).join(';')).join('\r\n');
}
