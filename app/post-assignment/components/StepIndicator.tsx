
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepIndicator({ current }: { current: number }) {
    const labels = ["Select type", "Fill details", "Review"];
    return (
        <div className="flex items-center justify-between w-full max-w-md lg:max-w-2xl mx-auto mb-8 lg:mb-12">
            {labels.map((label, i) => {
                const num = i + 1;
                const done = current > num;
                const active = current === num;
                return (
                    <React.Fragment key={num}>
                        <div className="flex flex-col items-center gap-1.5 lg:gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold font-montserrat transition-all duration-300 shrink-0",
                                    done && "bg-emerald-500 text-white",
                                    active && "bg-primary text-white shadow-md shadow-primary/30",
                                    !done && !active && "bg-gray-100 text-gray-400"
                                )}
                            >
                                {done ? <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" /> : num}
                            </div>
                            <span
                                className={cn(
                                    "text-[11px] lg:text-[13px] font-medium font-poppins whitespace-nowrap",
                                    active ? "text-gray-900" : done ? "text-emerald-600" : "text-gray-400"
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {i < labels.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-[2px] mx-2 lg:mx-4 rounded-full transition-all duration-500 -mt-5 lg:-mt-6",
                                    done ? "bg-emerald-400" : "bg-gray-200"
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
