"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ADMIN_STATUS_STEPS } from "@/lib/static";

interface StatusTimelineProps {
    currentStep: number;
    onReset: () => void;
}

export default function StatusTimeline({ currentStep, onReset }: StatusTimelineProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-[12px] font-semibold text-gray-500 font-poppins tracking-wide uppercase">
                    Status Timeline
                </p>
                <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 rounded-lg">
                        Update
                    </Button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="relative pl-8">
                {/* vertical line */}
                <div className="absolute left-[11px] top-3 bottom-12 w-[2px] bg-gray-100" />

                <div className="space-y-0">
                    {ADMIN_STATUS_STEPS.map((step, i) => {
                        let status: "done" | "in-progress" | "pending";
                        if (i < currentStep) status = "done";
                        else if (i === currentStep) status = "in-progress";
                        else status = "pending";

                        return (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.06 }}
                                className="relative pb-6 last:pb-0"
                            >
                                {/* dot */}
                                <div
                                    className={cn(
                                        "absolute -left-8 top-[2px] w-[22px] h-[22px] rounded-full border-[2.5px] flex items-center justify-center z-10",
                                        status === "done"
                                            ? "border-emerald-500 bg-emerald-500"
                                            : status === "in-progress"
                                                ? "border-primary bg-primary"
                                                : "border-gray-200 bg-white"
                                    )}
                                >
                                    {status === "done" && (
                                        <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                                    )}
                                    {status === "in-progress" && (
                                        <span className="text-[9px] font-bold text-white font-montserrat">
                                            {i + 1}
                                        </span>
                                    )}
                                </div>

                                {/* label + timestamp */}
                                <div className="ml-2 min-h-[36px]">
                                    <span
                                        className={cn(
                                            "text-[13px] font-semibold font-poppins leading-none",
                                            status === "done"
                                                ? "text-gray-800"
                                                : status === "in-progress"
                                                    ? "text-primary"
                                                    : "text-gray-400"
                                        )}
                                    >
                                        {step}
                                    </span>
                                    <p
                                        className={cn(
                                            "text-[11px] font-poppins mt-1",
                                            status === "done"
                                                ? "text-gray-400"
                                                : status === "in-progress"
                                                    ? "text-primary/60 italic"
                                                    : "text-gray-300"
                                        )}
                                    >
                                        {status === "done" && "Done"}
                                        {status === "in-progress" && "in-progress"}
                                        {status === "pending" && "yet to accomplish"}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={onReset}
                className="mt-4 flex items-center gap-1.5 text-[12px] text-red-500 hover:text-red-600 font-medium font-poppins transition-colors"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset timeline
            </button>
        </div>
    );
}
