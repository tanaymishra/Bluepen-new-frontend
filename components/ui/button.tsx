
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const variantClasses = {
            default: "bg-gradient-to-r from-primary via-[#3b6dbf] to-primary bg-[length:200%_100%] hover:bg-[100%_0] text-white shadow-[0_4px_14px_rgba(41,86,168,0.25)] hover:shadow-[0_6px_20px_rgba(41,86,168,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 font-poppins font-semibold border-none",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground font-poppins font-medium",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-poppins font-medium",
            ghost: "hover:bg-accent hover:text-accent-foreground font-poppins font-medium",
            link: "text-primary underline-offset-4 hover:underline font-poppins font-medium",
        }

        const sizeClasses = {
            default: "h-11 px-8 py-2 rounded-xl text-[15px]", // Increased height and rounded-xl
            sm: "h-9 rounded-lg px-3 text-xs",
            lg: "h-12 rounded-2xl px-8 text-base",
            icon: "h-10 w-10 rounded-xl",
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
