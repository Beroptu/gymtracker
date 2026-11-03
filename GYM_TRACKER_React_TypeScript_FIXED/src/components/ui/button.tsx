import * as React from 'react';
import {cva,type VariantProps} from 'class-variance-authority';
import {cn} from '../../lib/utils';
const variants=cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',{
  variants:{variant:{default:'bg-accent text-white hover:bg-[#3375f3] shadow-glow',secondary:'bg-raised text-foreground hover:bg-accent/10',outline:'border border-line bg-transparent text-foreground hover:bg-raised',ghost:'text-muted hover:text-foreground hover:bg-raised',danger:'bg-red-500/15 text-red-400 hover:bg-red-500/25',success:'bg-success/15 text-success hover:bg-success/25'},size:{default:'h-11 px-5',sm:'h-9 px-3',lg:'h-12 px-6',icon:'h-10 w-10 p-0',iconSm:'h-8 w-8 p-0'}},defaultVariants:{variant:'default',size:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof variants>{}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,type='button',...props},ref)=><button ref={ref} type={type} className={cn(variants({variant,size}),className)} {...props}/>);
Button.displayName='Button';
