
import React from "react";
import { cn } from "@/lib/utils";

export default function SummaryRow({
    label,
    value,
    className,
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={cn("bg-white p-4 sm:p-5 lg:p-6", className)}>
            <p className="text-[11px] lg:text-[12px] text-gray-400 font-poppins uppercase tracking-wider mb-0.5">
                {label}
            </p>
            <p className="text-[13px] font-medium text-gray-800 font-poppins break-words">
                {value}
            </p>
        </div>
    );
}
