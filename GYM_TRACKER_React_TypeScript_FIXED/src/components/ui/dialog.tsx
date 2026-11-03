import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
import {cn} from '../../lib/utils';
export const Dialog=DialogPrimitive.Root;
export const DialogTrigger=DialogPrimitive.Trigger;
export const DialogClose=DialogPrimitive.Close;
export function DialogContent({children,className,title,description}:{children:ReactNode;className?:string;title:string;description?:string}){
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-[6px] data-[state=open]:animate-enter"/><DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-[71] max-h-[min(90dvh,850px)] w-[calc(100%-28px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] border border-line bg-surface p-5 text-foreground shadow-2xl outline-none sm:p-7',className)}><div className="mb-5 pr-8"><DialogPrimitive.Title className="text-xl font-bold tracking-tight">{title}</DialogPrimitive.Title>{description&&<DialogPrimitive.Description className="mt-1.5 text-sm leading-relaxed text-muted">{description}</DialogPrimitive.Description>}</div>{children}<DialogPrimitive.Close aria-label="Закрыть" className="absolute right-4 top-4 rounded-lg p-2 text-muted hover:bg-raised hover:text-foreground"><X size={18}/></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}
