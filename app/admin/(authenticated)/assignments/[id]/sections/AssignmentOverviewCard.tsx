"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AssignmentDetail } from "../store/assignmentStore";

interface AssignmentOverviewCardProps {
    assignment: AssignmentDetail;
}

function formatDateTime(iso: string) {
    if (!iso || iso === "—") return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatDateShort(iso: string) {
    if (!iso || iso === "—") return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatCurrency(amount: number) {
    if (amount === undefined || amount === null) return "—";
    return amount.toLocaleString("en-IN", { 
        style: "currency", 
        currency: "INR", 
        maximumFractionDigits: 0 
    });
}

function DetailCell({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
            <p className="text-[10px] text-gray-500 font-poppins mb-1 uppercase tracking-wider font-medium">
                {label}
            </p>
            <p className="text-[14px] font-semibold text-gray-900 font-poppins leading-tight">
                {value ?? "—"}
            </p>
        </div>
    );
}

export default function AssignmentOverviewCard({ assignment }: AssignmentOverviewCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm"
        >
            {/* Header Banner */}
            <div className="relative h-[140px] bg-gradient-to-r from-[#012551] via-[#1a3f7a] to-[#2956A8] overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-[0.07]">
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                        <circle cx="120" cy="100" r="70" fill="white" />
                        <circle cx="300" cy="50" r="45" fill="white" />
                        <circle cx="480" cy="120" r="55" fill="white" />
                        <circle cx="650" cy="70" r="40" fill="white" />
                        <rect x="200" y="30" width="20" height="100" rx="4" fill="white" />
                        <rect x="560" y="15" width="18" height="90" rx="4" fill="white" />
                        <rect x="700" y="60" width="60" height="15" rx="3" fill="white" />
                        <rect x="700" y="85" width="50" height="10" rx="2" fill="white" />
                        <rect x="700" y="105" width="55" height="10" rx="2" fill="white" />
                    </svg>
                </div>
                <div className="absolute top-5 right-5">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm text-[12px] h-8 font-poppins"
                    >
                        Edit Details
                    </Button>
                </div>
                <div className="absolute bottom-4 left-6 text-[11px] text-white/50 font-poppins">
                    Submitted on {formatDateTime(assignment.submittedAt)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-[19px] font-bold text-gray-900 font-montserrat leading-tight">
                        {assignment.title.charAt(0).toUpperCase() + assignment.title.slice(1)}
                    </h2>
                </div>
                
                <p className="text-[13px] text-gray-600 font-poppins leading-relaxed mb-6">
                    {assignment.description || "No description provided."}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <DetailCell label="Academic Level" value={assignment.academicLevel} />
                    <DetailCell label="Stream" value={assignment.stream} />
                    <DetailCell label="Type" value={assignment.type} />
                    <DetailCell label="Subject" value={assignment.subject} />
                    <DetailCell 
                        label="Word Count" 
                        value={assignment.wordCount ? assignment.wordCount.toLocaleString() : "—"} 
                    />
                    <DetailCell label="Deadline" value={formatDateShort(assignment.deadline)} />
                    <DetailCell 
                        label="Freelancer Amount" 
                        value={formatCurrency(assignment.freelancerAmount)} 
                    />
                    <DetailCell 
                        label="Total Amount" 
                        value={formatCurrency(assignment.totalAmount)} 
                    />
                    <DetailCell label="Referencing" value={assignment.referencingStyle} />
                </div>
            </div>
        </motion.div>
    );
}
