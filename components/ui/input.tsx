import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode
    trailingIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, trailingIcon, ...props }, ref) => {
        return (
            <div className="relative group w-full">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors duration-200">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-[14px] font-poppins text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        icon && "pl-11",
                        trailingIcon && "pr-12",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {trailingIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {trailingIcon}
                    </div>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
