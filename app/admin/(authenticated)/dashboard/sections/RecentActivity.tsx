"use client";

import React from "react";
import {
    FileText,
    CreditCard,
    UserPlus,
    Settings,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_RECENT_ACTIVITY, type AdminRecentActivity } from "@/lib/static";

const typeConfig: Record<
    AdminRecentActivity["type"],
    { icon: React.ElementType; color: string; bg: string }
> = {
    assignment: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    payment: { icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
    user: { icon: UserPlus, color: "text-violet-600", bg: "bg-violet-50" },
    system: { icon: Settings, color: "text-gray-600", bg: "bg-gray-100" },
    deadline: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function RecentActivity() {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900 font-montserrat">
                    Recent Activity
                </h2>
                <span className="text-[11px] text-gray-400 font-poppins font-medium">
                    Live Feed
                </span>
            </div>

            <div className="space-y-1">
                {ADMIN_RECENT_ACTIVITY.map((item, i) => {
                    const cfg = typeConfig[item.type];
                    const Icon = cfg.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                            {/* Icon */}
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                    cfg.bg
                                )}
                            >
                                <Icon className={cn("w-4 h-4", cfg.color)} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-gray-800 font-poppins font-medium leading-snug">
                                    {item.action}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] text-gray-500 font-poppins">
                                        {item.user}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-[11px] text-gray-400 font-poppins">
                                        {item.role}
                                    </span>
                                </div>
                            </div>

                            {/* Timestamp */}
                            <span className="text-[11px] text-gray-400 font-poppins whitespace-nowrap mt-1">
                                {timeAgo(item.timestamp)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
