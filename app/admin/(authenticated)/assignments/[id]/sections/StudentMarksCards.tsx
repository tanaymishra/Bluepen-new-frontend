"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
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
                <p className="text-[11px] font-semibold text-gray-500 font-poppins uppercase tracking-wider mb-4">
                    Student Information
                </p>
                
                <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#012551]/10 flex items-center justify-center shrink-0 border border-[#012551]/20">
                        <span className="text-[16px] font-bold text-[#012551] font-montserrat">
                            {assignment.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                            {assignment.studentName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-poppins">
                            Student
                        </p>
                    </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-100">
                    {assignment.studentPhone !== "—" && (
                        <div className="flex items-center gap-2.5 text-[13px] text-gray-600 font-poppins">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{assignment.studentPhone}</span>
                        </div>
                    )}
                    {assignment.studentEmail !== "—" && (
                        <div className="flex items-center gap-2.5 text-[13px] text-gray-600 font-poppins">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{assignment.studentEmail}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Marks Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-[11px] font-semibold text-gray-500 font-poppins uppercase tracking-wider mb-4">
                    Performance Metrics
                </p>

                <div className="flex flex-col items-center justify-center py-3">
                    {assignment.marks !== null ? (
                        <>
                            <div className="relative mb-3">
                                <svg className="w-28 h-28 transform -rotate-90">
                                    <circle
                                        cx="56"
                                        cy="56"
                                        r="50"
                                        stroke="#f3f4f6"
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="56"
                                        cy="56"
                                        r="50"
                                        stroke={assignment.marks >= 70 ? "#10b981" : assignment.marks >= 50 ? "#F8D881" : "#ef4444"}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${(assignment.marks / 100) * 314} 314`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-[28px] font-bold text-gray-900 font-montserrat leading-none">
                                            {assignment.marks}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-poppins mt-0.5">
                                            / 100
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-600 font-poppins font-medium">
                                {assignment.marks >= 70 ? "Excellent Performance" : 
                                 assignment.marks >= 50 ? "Good Performance" : "Needs Improvement"}
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3 border border-gray-100">
                                <span className="text-[32px] text-gray-300 font-montserrat">—</span>
                            </div>
                            <p className="text-[13px] text-gray-600 font-poppins font-medium">
                                Marks Not Received
                            </p>
                            <p className="text-[11px] text-gray-400 font-poppins mt-1">
                                Awaiting results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
