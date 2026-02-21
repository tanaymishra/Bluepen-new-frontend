"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Award, TrendingUp } from "lucide-react";
import { useAssignmentStore } from "../store/assignmentStore";

export default function StudentMarksCards() {
    const { assignment } = useAssignmentStore();

    if (!assignment) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            {/* Student Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Student Information
                    </p>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                            {assignment.studentName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-poppins uppercase tracking-wide">
                            Student
                        </p>
                    </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-gray-100">
                    {assignment.studentPhone !== "—" && (
                        <div className="flex items-center gap-2.5 text-[13px] text-gray-600 font-poppins">
                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <span>{assignment.studentPhone}</span>
                        </div>
                    )}
                    {assignment.studentEmail !== "—" && (
                        <div className="flex items-center gap-2.5 text-[13px] text-gray-600 font-poppins">
                            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <span className="truncate">{assignment.studentEmail}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Marks Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-700" />
                    </div>
                    <p className="text-[13px] font-semibold text-emerald-900 font-poppins">
                        Performance
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    {assignment.marks !== null ? (
                        <>
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center border border-emerald-200/50 shadow-sm">
                                    <div className="text-center">
                                        <p className="text-[32px] font-bold text-emerald-700 font-montserrat leading-none">
                                            {assignment.marks}
                                        </p>
                                        <p className="text-[11px] text-emerald-600 font-poppins mt-1">
                                            out of 100
                                        </p>
                                    </div>
                                </div>
                                {assignment.marks >= 70 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <TrendingUp className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </div>
                            <p className="text-[12px] text-emerald-700 font-poppins font-medium mt-3">
                                {assignment.marks >= 70 ? "Excellent Performance" : 
                                 assignment.marks >= 50 ? "Good Performance" : "Needs Improvement"}
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-emerald-200/50">
                                <Award className="w-7 h-7 text-emerald-400" />
                            </div>
                            <p className="text-[14px] text-emerald-700 font-poppins font-medium">
                                Marks Not Received
                            </p>
                            <p className="text-[11px] text-emerald-600 font-poppins mt-1">
                                Awaiting results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
