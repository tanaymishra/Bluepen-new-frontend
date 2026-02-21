"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Upload,
    Paperclip,
    X,
    Mail,
    Check,
    Loader2,
} from "lucide-react";
import { useFreelancerApplyStore } from "../store";

export default function StepResumeVerify() {
    const {
        email,
        resumeFile, resumeFileName, resumeUploading, resumeUploaded,
        setResumeFile, uploadResume,
        otpSent, otp, setOtp, emailVerified,
        sendingOtp, verifyingOtp,
        handleSendOtp, handleVerifyOtp,
        loading,
    } = useFreelancerApplyStore();

    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setResumeFile(file);
        e.target.value = "";
    };

    const removeFile = () => {
        setResumeFile(null);
    };

    return (
        <>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-900 font-montserrat">
                Resume & Verification
            </h2>
            <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6">
                Upload your CV and verify your email address.
            </p>

            <div className="space-y-6">
                {/* ── Resume upload ── */}
                <div className="space-y-2">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Resume / CV
                    </Label>

                    {!resumeFile && !resumeUploaded ? (
                        <label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center gap-1.5 border border-dashed border-gray-200 rounded-xl px-5 py-8 cursor-pointer hover:border-primary/30 hover:bg-primary/[0.015] transition-all group"
                        >
                            <Upload className="w-6 h-6 text-gray-300 group-hover:text-primary/40 transition-colors" />
                            <p className="text-[13px] font-poppins text-gray-500">
                                <span className="text-primary font-semibold">Browse files</span>{" "}
                                or drag & drop
                            </p>
                            <p className="text-[11px] text-gray-400 font-poppins">
                                PDF, DOC, DOCX — max 10 MB
                            </p>
                        </label>
                    ) : (
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="text-[13px] text-gray-700 font-poppins truncate">
                                    {resumeFileName}
                                </span>
                                {resumeUploaded && (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-poppins font-medium bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                        <Check className="w-3 h-3" /> Uploaded
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {!resumeUploaded && (
                                    <Button
                                        size="sm"
                                        onClick={uploadResume}
                                        disabled={resumeUploading}
                                    >
                                        {resumeUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Upload"
                                        )}
                                    </Button>
                                )}
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileRef}
                        id="resume-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />
                </div>

                {/* ── Divider ── */}
                <div className="h-px bg-gray-100" />

                {/* ── Email verification ── */}
                <div className="space-y-3">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Verify Email
                    </Label>

                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-gray-700 font-poppins font-medium truncate">
                                {email}
                            </p>
                            <p className="text-[11px] text-gray-400 font-poppins">
                                {emailVerified
                                    ? "Email verified ✓"
                                    : otpSent
                                        ? "OTP sent — check your inbox"
                                        : "We'll send a verification code"}
                            </p>
                        </div>
                        {emailVerified ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                        ) : !otpSent ? (
                            <Button size="sm" onClick={handleSendOtp} disabled={sendingOtp}>
                                {sendingOtp ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        ) : null}
                    </div>

                    {otpSent && !emailVerified && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2"
                        >
                            <Input
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="text-center tracking-[0.3em] font-mono text-[16px]"
                            />
                            <Button
                                size="sm"
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otp.length < 6}
                            >
                                {verifyingOtp ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Verify"
                                )}
                            </Button>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={sendingOtp}
                                className="text-[12px] text-primary hover:text-primary-dark font-poppins font-medium whitespace-nowrap transition-colors"
                            >
                                Resend
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
