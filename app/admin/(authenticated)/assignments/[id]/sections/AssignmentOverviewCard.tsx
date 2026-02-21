"use client";

import React from "react";
import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
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
        <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition-colors">
            <p className="text-[11px] text-gray-500 font-poppins mb-1.5 uppercase tracking-wide">
                {label}
            </p>
            <p className="text-[14px] font-semibold text-gray-900 font-poppins leading-snug">
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
            <div className="relative h-[100px] bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-8 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-2 left-12 w-24 h-24 bg-white rounded-full blur-2xl" />
                </div>
                <div className="absolute top-4 right-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm text-[12px] h-8"
                    >
                        Edit
                    </Button>
                </div>
                <div className="absolute bottom-3 left-5 text-[11px] text-white/60 font-poppins">
                    Submitted on {formatDateTime(assignment.submittedAt)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="text-[20px] font-bold text-gray-900 font-montserrat leading-tight">
                        {assignment.title.charAt(0).toUpperCase() + assignment.title.slice(1)}
                    </h2>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors shrink-0">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
                
                <p className="text-[13px] text-gray-500 font-poppins leading-relaxed mb-6">
                    {assignment.description || "No description provided."}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
