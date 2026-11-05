import type {AppData} from '../types';
import {validateData} from './storage';

const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const SESSION_KEY = 'gym-tracker:supabase-session';
const STATE_NAME = '__gym_tracker_state_v1__';
export const cloudConfigured = Boolean(url && key);
export type CloudSession = {access_token:string;refresh_token:string;expires_at:number;user:{id:string;email?:string}};
function readSession():CloudSession|null {try {const raw=localStorage.getItem(SESSION_KEY);return raw?JSON.parse(raw) as CloudSession:null;}catch{return null;}}
let session=readSession();
export function currentSession(){return session;}
export function setSession(next:CloudSession|null){session=next;if(next)localStorage.setItem(SESSION_KEY,JSON.stringify(next));else localStorage.removeItem(SESSION_KEY);}
async function request(path:string,init:RequestInit={},accessToken?:string){
  if(!cloudConfigured)throw Error('Укажите адрес и публичный ключ Supabase в переменных окружения.');
  const res=await fetch(`${url}${path}`,{...init,headers:{apikey:key!,...(init.body?{'Content-Type':'application/json'}:{}),...(accessToken?{Authorization:`Bearer ${accessToken}`}:{}) ,...init.headers}});
  if(!res.ok){const err=await res.json().catch(()=>({}));throw Error(err.msg||err.error_description||err.message||`Ошибка сервера: ${res.status}`);}
  if(res.status===204)return null;
  return res.json();
}
function normalizeSession(v:any):CloudSession {return {access_token:v.access_token,refresh_token:v.refresh_token,expires_at:Math.floor(Date.now()/1000)+(v.expires_in||3600),user:{id:v.user.id,email:v.user.email}};}
export async function signUp(email:string,password:string){return request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password})});}
export async function signIn(email:string,password:string){const v=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});const s=normalizeSession(v);setSession(s);return s;}
export async function refreshSession(){if(!session)return null;try {const v=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})});const s=normalizeSession(v);setSession(s);return s;}catch{setSession(null);return null;}}
export async function validSession(){if(!session)return null;if(session.expires_at<Date.now()/1000+90)return refreshSession();return session;}
export async function signOut(){const s=session;setSession(null);if(s)await request('/auth/v1/logout',{method:'POST'},s.access_token).catch(()=>{});}
async function authorized(path:string,init:RequestInit={}){let s=await validSession();if(!s)throw Error('Сессия истекла. Войди заново.');return request(path,init,s.access_token);}
export async function loadCloudData():Promise<AppData|null>{const rows=await authorized(`/rest/v1/workout_plans?name=eq.${STATE_NAME}&select=plan_data&limit=1`);const v=rows?.[0]?.plan_data;return validateData(v)?v:null;}
export async function saveCloudData(data:AppData){const s=await validSession();if(!s)throw Error('Сессия истекла. Войди заново.');const rows=await authorized(`/rest/v1/workout_plans?name=eq.${STATE_NAME}&select=id&limit=1`);
  if(rows?.length){await authorized(`/rest/v1/workout_plans?id=eq.${rows[0].id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({plan_data:data,updated_at:new Date().toISOString()})});}
  else {await authorized('/rest/v1/workout_plans',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:s.user.id,name:STATE_NAME,plan_data:data})});}
}
