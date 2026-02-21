"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_STATUS_STEPS } from "@/lib/static";
import { useAssignmentViewStore } from "../store/useAssignmentViewStore";
import { StageBadge } from "./Atoms";

function StepList({ currentStep }: { currentStep: number }) {
    return (
        <div className="relative">
            <div className="absolute left-[15px] top-5 bottom-5 w-px bg-gray-100" />
            <div className="space-y-0">
                {ADMIN_STATUS_STEPS.map((label, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    return (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            className="relative flex items-start gap-4 pb-6 last:pb-0"
                        >
                            <div className={cn(
                                "relative z-10 w-[30px] h-[30px] rounded-full shrink-0 border-2 flex items-center justify-center transition-all",
                                done ? "bg-emerald-500 border-emerald-500" :
                                    active ? "bg-[#012551] border-[#012551]" :
                                        "bg-white border-gray-200"
                            )}>
                                {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                {active && <span className="w-2 h-2 rounded-full bg-white" />}
                            </div>

                            <div className="pt-0.5 min-w-0">
                                <p className={cn(
                                    "text-[13.5px] font-semibold font-poppins leading-tight",
                                    done ? "text-gray-700" :
                                        active ? "text-[#012551]" :
                                            "text-gray-400"
                                )}>
                                    {label}
                                </p>
                                <p className={cn(
                                    "text-[11px] font-poppins mt-0.5",
                                    done ? "text-emerald-500" :
                                        active ? "text-[#012551]/60 italic" :
                                            "text-gray-300"
                                )}>
                                    {done ? "Completed" : active ? "In progress" : "Pending"}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ProgressSidebar() {
    const assignment = useAssignmentViewStore(s => s.assignment)!;

    return (
        <div className="space-y-5">
            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]  lg:top-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#012551]" />
                        </div>
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Progress</p>
                    </div>
                    <StageBadge stage={assignment.stage} />
                </div>

                <StepList currentStep={assignment.currentStep} />

                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                    <button className="w-full py-2.5 rounded-xl bg-[#012551] text-white text-[13px] font-semibold font-poppins hover:bg-[#012551]/90 transition-colors">
                        Advance Stage
                    </button>
                    <button className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-[13px] font-semibold font-poppins hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                </div>
            </motion.div>

            {/* Quick overview */}
            <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">Quick Overview</p>
                <div className="space-y-3">
                    {[
                        { label: "Total Budget", value: "₹" + (assignment.totalAmount ?? 0).toLocaleString("en-IN") },
                        { label: "Expert Pay", value: "₹" + (assignment.freelancerAmount ?? 0).toLocaleString("en-IN") },
                        { label: "Word Count", value: assignment.wordCount ? String(assignment.wordCount) : "—" },
                    ].map(row => (
                        <div key={row.label} className="flex items-center justify-between">
                            <span className="text-[13px] text-gray-500 font-poppins">{row.label}</span>
                            <span className="text-[14px] font-bold text-gray-900 font-poppins">{row.value}</span>
                        </div>
                    ))}
                    <div className="h-px bg-gray-100" />
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-gray-500 font-poppins">Marks</span>
                        <span className={cn(
                            "text-[14px] font-bold font-poppins",
                            assignment.marks === null ? "text-gray-300" :
                                assignment.marks >= 70 ? "text-emerald-600" :
                                    assignment.marks >= 50 ? "text-blue-600" :
                                        "text-red-600"
                        )}>
                            {assignment.marks !== null ? `${assignment.marks}/100` : "N/A"}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
