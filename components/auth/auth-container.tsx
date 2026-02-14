
import React from "react";
import { cn } from "@/lib/utils";

interface AuthContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function AuthContainer({ children, className }: AuthContainerProps) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white relative overflow-hidden px-4 py-8 md:px-6">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-blue-50/50 to-transparent -z-10" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div
                className={cn(
                    "relative w-full max-w-[480px] rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] md:p-10",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}
