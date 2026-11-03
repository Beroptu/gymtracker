import { AppData, Exercise, Muscle, TrainingDay, Workout, WorkoutDayId } from '../types';

const ex = (id: string, name: string, sets: number, minReps: number, maxReps: number, muscle: Muscle, increment = 2.5): Exercise => ({id,name,sets,minReps,maxReps,muscle,increment});
export const DEFAULT_PLAN: TrainingDay[] = [
  {id:'mon',weekday:1,short:'ПН',title:'Понедельник',focus:'Грудь · Бицепс · Плечи',exercises:[
    ex('bench','Жим штанги лежа',3,6,10,'Грудь',2.5),
    ex('incline-db','Жим гантелей на наклонной скамье',3,8,12,'Грудь',2),
    ex('cable-fly','Сведения рук в кроссовере',2,12,15,'Грудь',2.5),
    ex('barbell-curl','Подъем штанги на бицепс',3,8,12,'Бицепс',2.5),
    ex('incline-curl','Сгибания рук на наклонной скамье',2,10,15,'Бицепс',2),
    ex('lateral-db','Махи гантелями в стороны',3,12,20,'Плечи',1),
  ]},
  {id:'wed',weekday:3,short:'СР',title:'Среда',focus:'Спина · Трицепс · Ноги',exercises:[
    ex('pullup','Подтягивания / вертикальная тяга',3,6,12,'Спина',2.5),
    ex('barbell-row','Тяга штанги или Т-грифа',3,8,12,'Спина',2.5),
    ex('seated-row','Горизонтальная тяга блока',2,10,15,'Спина',2.5),
    ex('rope-pushdown','Разгибание рук с канатом',3,10,15,'Трицепс',2.5),
    ex('overhead-cable','Французский жим из-за головы в блоке',2,10,15,'Трицепс',2.5),
    ex('leg-press','Жим ногами',3,8,12,'Ноги',5),
    ex('leg-curl','Сгибание ног в тренажере',3,10,15,'Ноги',2.5),
  ]},
  {id:'fri',weekday:5,short:'ПТ',title:'Пятница',focus:'Верх тела',exercises:[
    ex('flat-db','Жим гантелей лежа',3,8,12,'Грудь',2),
    ex('neutral-pulldown','Тяга верхнего блока нейтральным хватом',3,8,12,'Спина',2.5),
    ex('seated-db-press','Жим гантелей сидя',3,8,12,'Плечи',2),
    ex('cable-lateral','Махи в стороны в кроссовере',2,12,20,'Плечи',1),
    ex('ez-curl','Сгибания рук с EZ-грифом',3,8,12,'Бицепс',2.5),
    ex('tricep-pushdown','Разгибания рук на блоке',3,10,15,'Трицепс',2.5),
  ]},
];

export const freshData = (): AppData => ({ version: 1, plan: structuredClone(DEFAULT_PLAN), history: [], active: null, theme: 'dark' });
export const uuid = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const localDate = (iso: string) => new Date(iso);
export const displayDate = (iso: string, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('ru-RU',options ?? {day:'numeric',month:'long',year:'numeric'}).format(localDate(iso));
export const nearDay = (plan: TrainingDay[], history: AppData['history'], now = new Date()) => {
  for(let offset = 0;offset < 8;offset++){
    const target = new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset);
    const day = plan.find(p=>p.weekday === target.getDay());
    if(!day) continue;
    if(offset === 0 && history.some(h=>h.dayId === day.id && dateKey(new Date(h.startedAt)) === dateKey(target))) continue;
    return {day, date: target};
  }
  return {day:plan[0],date:now};
};
export const createWorkout = (day: TrainingDay, history: AppData['history']): Workout => ({
  id:uuid(),dayId:day.id,title:day.title,startedAt:new Date().toISOString(),notes:'',restSeconds:90,
  exercises: day.exercises.map(exercise => {
    const previous = [...history].reverse().flatMap(workout=>workout.exercises).find(p=>p.exerciseId===exercise.id);
    const previousDone = previous?.sets.filter(s=>s.done) ?? [];
    return {exerciseId:exercise.id,name:exercise.name,muscle:exercise.muscle,minReps:exercise.minReps,maxReps:exercise.maxReps,increment:exercise.increment,
      sets:Array.from({length:exercise.sets},(_,i)=>({ id:uuid(),weight:previousDone[i]?.weight ?? previousDone.at(-1)?.weight ?? '',reps:'',done:false,goodForm:false }))};
  }),
});
export const emptyExercise = (ex: Exercise): LoggedExercisePlaceholder => ({ id:ex.id, name:ex.name });
type LoggedExercisePlaceholder = { id: string; name: string };
export const parseNum = (v: string): number => Number(v.replace(',','.'));
export const formatNumber = (n:number, digits=0) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:digits}).format(n);
export const completedSets = (w: Workout) => w.exercises.flatMap(e=>e.sets).filter(s=>s.done);
export const totalSets = (w: Workout) => w.exercises.reduce((n,e)=>n+e.sets.length,0);
export const volume = (w: Workout) => completedSets(w).reduce((n,s)=>n+Math.max(0,parseNum(s.weight)||0)*Math.max(0,parseNum(s.reps)||0),0);
export const completion = (w:Workout) => totalSets(w) ? Math.round(completedSets(w).length / totalSets(w) * 100) : 0;
export const countSince = (h: Workout[], from: Date) => h.filter(w=>new Date(w.completedAt ?? w.startedAt)>=from).length;
export const mondayOf = (date:Date) => { const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());d.setDate(d.getDate() - (d.getDay()+6)%7);return d;};
export const previousExercise = (history:Workout[], exerciseId:string, before?:string) => [...history].reverse().filter(w=>!before||new Date(w.startedAt)<new Date(before)).flatMap(w=>w.exercises).find(e=>e.exerciseId===exerciseId);
export const previousWorkout = (history:Workout[], dayId:WorkoutDayId, before?:string) => [...history].reverse().find(w=>w.dayId===dayId && (!before||new Date(w.startedAt)<new Date(before)));
export const suggestedIncrease = (exercise:Workout['exercises'][number]) => {
  if(!exercise.sets.length || !exercise.sets.every(s=>s.done && s.goodForm && parseNum(s.reps)>=exercise.maxReps && Number.isFinite(parseNum(s.weight)) && s.weight.trim()!=='')) return null;
  const highest = Math.max(...exercise.sets.map(s=>parseNum(s.weight)));
  return highest + exercise.increment;
};
