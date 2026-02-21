"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, BookOpen, Clock } from "lucide-react";
import { useAssignmentViewStore } from "../store/useAssignmentViewStore";
import { StageBadge } from "./Atoms";
import { fmtDate, fmtRelative } from "./constants";

export default function AssignmentHero() {
    const router = useRouter();
    const assignment = useAssignmentViewStore(s => s.assignment)!;
    const stage = assignment.stage;

    return (
        <div className="relative bg-[#012551] overflow-hidden">
            {/* dot grid */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,.8) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />
            {/* glow blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-indigo-400/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
                {/* back */}
                <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-white/60 hover:text-white/90 text-[13px] font-poppins font-medium transition-colors group mb-6"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Assignments
                </motion.button>

                <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-0 lg:justify-between">
                    {/* title block */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <StageBadge stage={stage} />
                            <span className="text-white/30 text-[11px] font-poppins">#{assignment.id}</span>
                            <span className="text-white/30 text-[11px] font-poppins">·</span>
                            <span className="text-white/50 text-[11px] font-poppins flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {fmtRelative(assignment.submittedAt)}
                            </span>
                        </div>

                        <h1 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-white font-montserrat leading-tight max-w-[650px]">
                            {assignment.title.charAt(0).toUpperCase() + assignment.title.slice(1)}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08]">
                                <Calendar className="w-3.5 h-3.5 text-white/60" />
                                <span className="text-[12px] text-white/70 font-poppins">Due {fmtDate(assignment.deadline)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08]">
                                <BookOpen className="w-3.5 h-3.5 text-white/60" />
                                <span className="text-[12px] text-white/70 font-poppins">{assignment.stream}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* action buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="flex flex-wrap gap-2 lg:flex-col lg:items-end"
                    >
                        <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-[13px] font-poppins font-medium hover:bg-white/20 transition-all backdrop-blur-sm">
                            Edit Details
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-[13px] font-poppins font-medium hover:bg-red-500/30 transition-all">
                            Delete
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
