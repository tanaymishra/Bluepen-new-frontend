"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssignmentStore } from "../store/assignmentStore";

export default function TeamAssignmentCards() {
    const { 
        assignment, 
        pmName, 
        freelancerName,
        setPmSheetOpen,
        setFlSheetOpen 
    } = useAssignmentStore();

    if (!assignment) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            {/* PM Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-semibold text-gray-500 font-poppins uppercase tracking-wider">
                        Project Manager
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#012551] text-[12px] h-auto p-0 hover:bg-transparent font-poppins font-medium"
                        onClick={() => setPmSheetOpen(true)}
                    >
                        {pmName ? "Change" : "Assign"}
                    </Button>
                </div>
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#F8D881]/20 flex items-center justify-center shrink-0 border border-[#F8D881]/30">
                        <div className="w-7 h-7 rounded-lg bg-[#F8D881] flex items-center justify-center">
                            <span className="text-[13px] font-bold text-[#012551] font-montserrat">
                                PM
                            </span>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                            {pmName || "Not assigned"}
                        </p>
                        {pmName && assignment.pmPhone !== "—" ? (
                            <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5 mt-1">
                                <Phone className="w-3 h-3" />
                                {assignment.pmPhone}
                            </p>
                        ) : !pmName && (
                            <p className="text-[12px] text-gray-400 font-poppins mt-1">
                                Click to assign
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Freelancer Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-semibold text-gray-500 font-poppins uppercase tracking-wider">
                        Freelancer
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#012551] text-[12px] h-auto p-0 hover:bg-transparent font-poppins font-medium"
                        onClick={() => setFlSheetOpen(true)}
                    >
                        {freelancerName ? "Change" : "Assign"}
                    </Button>
                </div>
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#012551]/10 flex items-center justify-center shrink-0 border border-[#012551]/20">
                        <div className="w-7 h-7 rounded-lg bg-[#012551] flex items-center justify-center">
                            <span className="text-[13px] font-bold text-white font-montserrat">
                                FL
                            </span>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                            {freelancerName || "Not assigned"}
                        </p>
                        {freelancerName && assignment.freelancerPhone !== "—" ? (
                            <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5 mt-1">
                                <Phone className="w-3 h-3" />
                                {assignment.freelancerPhone}
                            </p>
                        ) : !freelancerName && (
                            <p className="text-[12px] text-gray-400 font-poppins mt-1">
                                Click to assign
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
