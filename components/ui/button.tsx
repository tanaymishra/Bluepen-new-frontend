import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap font-poppins font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white shadow-sm hover:bg-primary-dark active:scale-[0.98] active:bg-[#01214a]",
                destructive:
                    "bg-error text-white shadow-sm hover:bg-error-dark active:scale-[0.98]",
                outline:
                    "border border-gray-200 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]",
                secondary:
                    "bg-primary-light text-primary font-medium hover:bg-primary-light/80 active:scale-[0.98]",
                ghost:
                    "text-gray-700 font-medium hover:bg-gray-100 active:scale-[0.98]",
                link:
                    "text-primary underline-offset-4 hover:underline font-medium p-0 h-auto",
            },
            size: {
                default: "h-11 px-6 rounded-xl text-[14px]",
                sm: "h-9 px-4 rounded-lg text-[13px]",
                lg: "h-12 px-8 rounded-xl text-[15px]",
                icon: "h-10 w-10 rounded-xl text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
