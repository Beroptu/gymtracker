import * as React from 'react';
import {cn} from '../../lib/utils';
export const Input=React.forwardRef<HTMLInputElement,React.InputHTMLAttributes<HTMLInputElement>>(({className,...props},ref)=><input ref={ref} className={cn('h-11 w-full min-w-0 rounded-xl border border-line bg-raised px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-muted/60',className)} {...props}/>);
Input.displayName='Input';
export const Textarea=React.forwardRef<HTMLTextAreaElement,React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({className,...props},ref)=><textarea ref={ref} className={cn('w-full min-w-0 resize-y rounded-xl border border-line bg-raised px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-muted/60',className)} {...props}/>);
Textarea.displayName='Textarea';
