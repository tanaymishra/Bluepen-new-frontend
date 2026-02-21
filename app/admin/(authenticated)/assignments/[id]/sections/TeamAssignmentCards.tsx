"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCog, PenTool, Phone } from "lucide-react";
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
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <UserCog className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Project Manager
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary text-[12px] h-auto p-0 hover:bg-transparent"
                        onClick={() => setPmSheetOpen(true)}
                    >
                        {pmName ? "Change" : "Assign"}
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0 border border-amber-200/50">
                        <UserCog className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                            {pmName || "Not assigned"}
                        </p>
                        {pmName && assignment.pmPhone !== "—" && (
                            <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5 mt-1">
                                <Phone className="w-3 h-3" />
                                {assignment.pmPhone}
                            </p>
                        )}
                        {!pmName && (
                            <p className="text-[12px] text-gray-400 font-poppins mt-1">
                                Click to assign
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Freelancer Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <PenTool className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Freelancer
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary text-[12px] h-auto p-0 hover:bg-transparent"
                        onClick={() => setFlSheetOpen(true)}
                    >
                        {freelancerName ? "Change" : "Assign"}
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <PenTool className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                            {freelancerName || "Not assigned"}
                        </p>
                        {freelancerName && assignment.freelancerPhone !== "—" && (
                            <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5 mt-1">
                                <Phone className="w-3 h-3" />
                                {assignment.freelancerPhone}
                            </p>
                        )}
                        {!freelancerName && (
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
