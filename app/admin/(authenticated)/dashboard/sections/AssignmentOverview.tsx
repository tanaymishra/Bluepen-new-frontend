"use client";

import React from "react";
import {
    FileText,
    Loader,
    CheckCircle2,
    UserCheck,
    Users,
    AlertTriangle,
    Trophy,
    XCircle,
    RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_ASSIGNMENT_STATS, ADMIN_WIN_LOSS } from "@/lib/static";

interface StatCard {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bg: string;
}

const statCards: StatCard[] = [
    { label: "Total Assignments", value: ADMIN_ASSIGNMENT_STATS.total, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Under Process", value: ADMIN_ASSIGNMENT_STATS.underProcess, icon: Loader, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Reviewed", value: ADMIN_ASSIGNMENT_STATS.reviewed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Assigned to PM", value: ADMIN_ASSIGNMENT_STATS.assignedToPm, icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "With Freelancers", value: ADMIN_ASSIGNMENT_STATS.withFreelancers, icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Marks Not Received", value: ADMIN_ASSIGNMENT_STATS.marksNotReceived, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Completed", value: ADMIN_ASSIGNMENT_STATS.completed, icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Lost", value: ADMIN_ASSIGNMENT_STATS.lost, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Resit", value: ADMIN_ASSIGNMENT_STATS.resit, icon: RotateCcw, color: "text-violet-600", bg: "bg-violet-50" },
];

function formatNumber(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return n.toString();
}

export default function AssignmentOverview() {
    const { wins, losses } = ADMIN_WIN_LOSS;
    const total = wins + losses;
    const winPct = ((wins / total) * 100).toFixed(1);
    const lossPct = ((losses / total) * 100).toFixed(1);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="text-base font-bold text-gray-900 font-montserrat mb-5">
                Assignment Overview
            </h2>

            {/* Win / Loss Ratio */}
            <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700 font-poppins">
                        Win to Loss Ratio
                    </p>
                    <p className="text-xs text-gray-400 font-poppins">
                        {wins.toLocaleString("en-IN")} won · {losses.toLocaleString("en-IN")} lost
                    </p>
                </div>
                {/* Bar */}
                <div className="flex h-4 rounded-full overflow-hidden">
                    <div
                        className="bg-primary flex items-center justify-center transition-all duration-500"
                        style={{ width: `${winPct}%` }}
                    >
                        <span className="text-[9px] font-bold text-white font-poppins">
                            {winPct}%
                        </span>
                    </div>
                    <div
                        className="bg-red-400 flex items-center justify-center transition-all duration-500"
                        style={{ width: `${lossPct}%` }}
                    >
                        <span className="text-[9px] font-bold text-white font-poppins">
                            {lossPct}%
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span className="text-[11px] text-gray-500 font-poppins">Won</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="text-[11px] text-gray-500 font-poppins">Lost</span>
                    </div>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                        >
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    card.bg
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-[18px] h-[18px]",
                                        card.color
                                    )}
                                />
                            </div>
                            <p className="text-xl font-bold text-gray-900 font-montserrat">
                                {formatNumber(card.value)}
                            </p>
                            <p className="text-[11px] text-gray-500 font-poppins text-center leading-tight">
                                {card.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
