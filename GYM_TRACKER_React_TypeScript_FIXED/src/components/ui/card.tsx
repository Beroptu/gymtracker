import * as React from 'react';
import {cn} from '../../lib/utils';
export const Card=React.forwardRef<HTMLDivElement,React.HTMLAttributes<HTMLDivElement>>(({className,...props},ref)=><div ref={ref} className={cn('rounded-[22px] border border-line bg-surface shadow-panel',className)} {...props}/>);
Card.displayName='Card';
export const CardContent=({className,...props}:React.HTMLAttributes<HTMLDivElement>)=><div className={cn('p-5 sm:p-6',className)} {...props}/>;
