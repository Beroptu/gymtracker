import {ReactNode} from 'react';
import {AlertTriangle} from 'lucide-react';
import {Dialog,DialogContent} from './ui/dialog';
import {Button} from './ui/button';
export default function ConfirmDialog({open,onOpenChange,title,description,confirm='Удалить',destructive=true,onConfirm}:{open:boolean;onOpenChange:(open:boolean)=>void;title:string;description:ReactNode;confirm?:string;destructive?:boolean;onConfirm:()=>void}){
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent title={title}><div className="flex gap-3 rounded-xl bg-orange-400/10 p-4 text-sm leading-relaxed text-muted"><AlertTriangle size={20} className="mt-0.5 shrink-0 text-orange-400"/>{description}</div><div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={()=>onOpenChange(false)}>Отмена</Button><Button variant={destructive?'danger':'default'} onClick={()=>{onConfirm();onOpenChange(false)}}>{confirm}</Button></div></DialogContent></Dialog>;
}
