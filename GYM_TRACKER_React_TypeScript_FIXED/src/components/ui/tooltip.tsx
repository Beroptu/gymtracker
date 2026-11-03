import type { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
export const TooltipProvider=TooltipPrimitive.Provider;
export const Tooltip=TooltipPrimitive.Root;
export const TooltipTrigger=TooltipPrimitive.Trigger;
export function TooltipContent({children}:{children:ReactNode}){return <TooltipPrimitive.Portal><TooltipPrimitive.Content sideOffset={6} className="z-[80] rounded-lg bg-[#243148] px-3 py-2 text-xs text-white shadow-lg">{children}<TooltipPrimitive.Arrow className="fill-[#243148]"/></TooltipPrimitive.Content></TooltipPrimitive.Portal>}
