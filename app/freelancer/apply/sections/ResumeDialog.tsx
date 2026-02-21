"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useFreelancerApplyStore } from "../store";

const STEPS = [
    { num: 1, label: "Specialisation" },
    { num: 2, label: "Experience" },
    { num: 3, label: "Resume & Verify" },
    { num: 4, label: "Your Details" },
];

export default function ResumeDialog() {
    const { showResumeDialog, existingAppInfo, email, resumeExisting, startFresh } =
        useFreelancerApplyStore();

    if (!showResumeDialog || !existingAppInfo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => useFreelancerApplyStore.setState({ showResumeDialog: false })}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-[440px] p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold text-gray-900 font-montserrat">
                        Existing Application Found
                    </h2>
                    <button
                        onClick={() =>
                            useFreelancerApplyStore.setState({ showResumeDialog: false })
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-primary-light/40 rounded-xl p-4 mb-5">
                    <p className="text-[13px] text-gray-600 font-poppins leading-relaxed">
                        We found an application for{" "}
                        <span className="font-semibold text-gray-800">{email}</span> started on{" "}
                        <span className="font-semibold text-gray-800">
                            {new Date(existingAppInfo.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                        .
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[12px] text-primary/70 font-poppins font-medium">
                            Progress:
                        </span>
                        <span className="text-[12px] text-primary font-poppins font-semibold">
                            Step {existingAppInfo.currentStep} of 4 —{" "}
                            {STEPS[existingAppInfo.currentStep - 1]?.label}
                        </span>
                    </div>
                </div>

                <div className="space-y-2.5">
                    <Button onClick={resumeExisting} className="w-full">
                        <ChevronRight className="w-4 h-4 mr-1.5" />
                        Continue Where I Left Off
                    </Button>
                    <Button variant="outline" onClick={startFresh} className="w-full">
                        Start a New Application
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
