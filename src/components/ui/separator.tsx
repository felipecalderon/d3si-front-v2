import * as React from "react"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("shrink-0 bg-border h-[1px] w-full", className)} {...props} />
))
Separator.displayName = "Separator"

export { Separator }
