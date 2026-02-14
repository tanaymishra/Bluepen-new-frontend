import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[14px] font-poppins text-gray-900 ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
