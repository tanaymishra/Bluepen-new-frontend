"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentViewStore } from "../store/useAssignmentViewStore";
import { ContactRow } from "./Atoms";

function MarksRing({ marks }: { marks: number | null }) {
    const pct = marks ?? null;
    const grade =
        pct === null ? null :
            pct >= 70 ? { label: "Merit", color: "text-emerald-600", bg: "bg-emerald-50", stroke: "#10b981" } :
                pct >= 50 ? { label: "Passed", color: "text-blue-600", bg: "bg-blue-50", stroke: "#3b82f6" } :
                    { label: "Failed", color: "text-red-600", bg: "bg-red-50", stroke: "#ef4444" };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-[#012551]/5 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#012551]" />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">Marks Received</p>

            {pct !== null ? (
                <>
                    <div className="relative w-24 h-24 mb-3">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
                            <circle
                                cx="18" cy="18" r="15.9" fill="none"
                                stroke={grade?.stroke ?? "#e5e7eb"}
                                strokeWidth="2.5"
                                strokeDasharray={`${(pct / 100) * 100} 100`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[22px] font-bold font-montserrat text-gray-900">{pct}</span>
                        </div>
                    </div>
                    {grade && (
                        <span className={cn("px-4 py-1.5 rounded-full text-[12px] font-bold font-poppins", grade.bg, grade.color)}>
                            {grade.label}
                        </span>
                    )}
                </>
            ) : (
                <div className="py-2">
                    <p className="text-[28px] font-bold text-gray-300 font-montserrat">N/A</p>
                    <p className="text-[12px] text-gray-400 font-poppins mt-1">Awaiting mark entry</p>
                </div>
            )}
        </div>
    );
}

export default function StudentMarksRow() {
    const a = useAssignmentViewStore(s => s.assignment)!;
    const initials = a.studentName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4"
        >
            {/* Student */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#012551]" />
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Student</p>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#012551] flex items-center justify-center shrink-0 text-[15px] font-bold font-montserrat text-white">
                        {initials}
                    </div>
                    <div>
                        <p className="text-[16px] font-bold text-gray-900 font-poppins">{a.studentName}</p>
                        <p className="text-[12px] text-gray-400 font-poppins">Student</p>
                    </div>
                </div>

                <div className="space-y-2 pl-1">
                    <ContactRow icon={Phone} value={a.studentPhone} />
                    <ContactRow icon={Mail} value={a.studentEmail} />
                </div>
            </div>

            {/* Marks */}
            <MarksRing marks={a.marks} />
        </motion.div>
    );
}
