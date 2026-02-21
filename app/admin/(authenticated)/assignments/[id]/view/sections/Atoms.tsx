"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { stageColor, stageLabel } from "./constants";

export function StageBadge({ stage }: { stage: string }) {
    const c = stageColor[stage] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold font-poppins", c.bg, c.text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
            {stageLabel[stage] ?? stage}
        </span>
    );
}

export function MetaChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-[#012551]/5 flex items-center justify-center shrink-0">
                <Icon className="w-[15px] h-[15px] text-[#012551]" />
            </div>
            <div className="min-w-0">
                <p className="text-[10.5px] text-gray-400 font-poppins uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-[13.5px] font-semibold text-gray-800 font-poppins truncate">{value || "—"}</p>
            </div>
        </div>
    );
}

export function ContactRow({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
    if (!value || value === "—") return null;
    return (
        <p className="flex items-center gap-2 text-[12.5px] text-gray-500 font-poppins">
            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {value}
        </p>
    );
}
