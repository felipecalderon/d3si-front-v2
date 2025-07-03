// components/ui/tooltip.tsx

"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipPortal = TooltipPrimitive.Portal
export const TooltipContentPrimitive = TooltipPrimitive.Content

export function Tooltip({
  children,
  content,
  side = "top",
  className,
}: {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={4}
            className={`z-50 rounded-md bg-black text-white px-2 py-1 text-xs shadow ${className || ""}`}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-black" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
