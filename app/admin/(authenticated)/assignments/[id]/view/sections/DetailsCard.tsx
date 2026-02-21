"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, DollarSign, FileText, Layers, Star } from "lucide-react";
import { useAssignmentViewStore } from "../store/useAssignmentViewStore";
import { MetaChip } from "./Atoms";
import { fmtDate, fmtMoney } from "./constants";

export default function DetailsCard() {
    const a = useAssignmentViewStore(s => s.assignment)!;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
            {/* description */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-[#012551]" />
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Description</p>
                </div>
                <p className="text-[14px] text-gray-600 font-poppins leading-[1.9] whitespace-pre-line">
                    {a.description || "No description provided for this assignment."}
                </p>
            </div>

            {/* metadata grid */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                        <Layers className="w-3.5 h-3.5 text-[#012551]" />
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Assignment Details</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <div>
                        <MetaChip icon={BookOpen} label="Academic Level" value={a.academicLevel} />
                        <MetaChip icon={Layers} label="Type" value={a.type} />
                        <MetaChip icon={FileText} label="Subject / Topic" value={a.subject} />
                        <MetaChip icon={Star} label="Referencing" value={a.referencingStyle} />
                    </div>
                    <div>
                        <MetaChip icon={BookOpen} label="Word Count" value={a.wordCount ? `${a.wordCount} words` : "—"} />
                        <MetaChip icon={Calendar} label="Submitted" value={fmtDate(a.submittedAt)} />
                        <MetaChip icon={Calendar} label="Deadline" value={fmtDate(a.deadline)} />
                        <MetaChip icon={DollarSign} label="Budget" value={fmtMoney(a.totalAmount)} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
