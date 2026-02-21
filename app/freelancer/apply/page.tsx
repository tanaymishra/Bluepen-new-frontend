"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    ChevronLeft,
    Check,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useFreelancerApplyStore } from "./store";
import StepSpecialisation from "./sections/StepSpecialisation";
import StepExperience from "./sections/StepExperience";
import StepResumeVerify from "./sections/StepResumeVerify";
import StepDetails from "./sections/StepDetails";
import StepGraphic from "./sections/StepGraphic";
import ResumeDialog from "./sections/ResumeDialog";

const STEPS = [
    { num: 1, label: "Specialisation" },
    { num: 2, label: "Experience" },
    { num: 3, label: "Resume & Verify" },
    { num: 4, label: "Your Details" },
];

export default function FreelancerApplyPage() {
    const router = useRouter();
    const {
        step,
        setStep,
        loading,
        error,
        setError,
        email,
        submitted,
        resumeUploaded,
        emailVerified,
        handleStep1,
        handleStep2,
        handleStep4,
    } = useFreelancerApplyStore();

    const canProceedStep3 = resumeUploaded && emailVerified;

    /* ── Success screen ── */
    if (submitted) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-[#F5F7FA] px-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-[480px] w-full p-8 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                        <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-[24px] font-bold text-gray-900 font-montserrat mb-2">
                        Application Submitted!
                    </h1>
                    <p className="text-[14px] text-gray-500 font-poppins leading-relaxed mb-6">
                        Your application is under review. We&apos;ll notify you
                        at{" "}
                        <span className="font-semibold text-gray-700">
                            {email}
                        </span>{" "}
                        once it&apos;s processed. This usually takes 24–48
                        hours.
                    </p>
                    <Button
                        onClick={() => router.push("/freelancer/login")}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col">
            {/* ── Top bar ── */}
            <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between shrink-0 z-20">
                <Link href="/" className="relative w-28 h-8">
                    <Image
                        src="/assets/logo/bluepenonly.svg"
                        alt="Bluepen"
                        fill
                        className="object-contain object-left"
                    />
                </Link>
                <Link
                    href="/freelancer/login"
                    className="text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors"
                >
                    Already have an account?
                </Link>
            </header>

            {/* ── Main content: left graphic + right form ── */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* LEFT — animated SVG panel (hidden on mobile) */}
                <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] sticky top-0 h-screen bg-white border-r border-gray-100">
                    <StepGraphic step={step} />
                </div>

                {/* RIGHT — form panel */}
                <div className="flex-1 flex flex-col items-center px-5 py-8 overflow-y-auto bg-[#F5F7FA] lg:bg-white">
                    {/* Stepper */}
                    <div className="flex items-center gap-0 mb-8 w-full max-w-[560px]">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold font-montserrat shrink-0 transition-all",
                                            step > s.num
                                                ? "bg-primary text-white"
                                                : step === s.num
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-200 text-gray-500"
                                        )}
                                    >
                                        {step > s.num ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            s.num
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[12px] font-poppins font-medium whitespace-nowrap hidden sm:block",
                                            step >= s.num
                                                ? "text-gray-800"
                                                : "text-gray-400"
                                        )}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "flex-1 h-[2px] mx-2 rounded-full transition-all",
                                            step > s.num
                                                ? "bg-primary"
                                                : "bg-gray-200"
                                        )}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Form content */}
                    <div className="w-full max-w-[560px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-8 lg:bg-transparent lg:border-0 lg:rounded-none lg:p-0"
                            >
                                {step === 1 && <StepSpecialisation />}
                                {step === 2 && <StepExperience />}
                                {step === 3 && <StepResumeVerify />}
                                {step === 4 && <StepDetails />}

                                {/* ── Error ── */}
                                {error && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        className="flex items-start gap-2.5 p-3.5 mt-5 rounded-xl bg-red-50 border border-red-100"
                                    >
                                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-[13px] text-red-600 font-poppins">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}

                                {/* ── Actions ── */}
                                <div
                                    className={cn(
                                        "flex items-center gap-3 mt-6 pt-5 border-t border-gray-100",
                                        step === 1
                                            ? "justify-end"
                                            : "justify-between"
                                    )}
                                >
                                    {step > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(step - 1)}
                                            disabled={loading}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Back
                                        </Button>
                                    )}

                                    {step === 1 && (
                                        <Button
                                            onClick={handleStep1}
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                            )}
                                            {loading
                                                ? "Starting…"
                                                : "Continue"}
                                            {!loading && (
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            )}
                                        </Button>
                                    )}

                                    {step === 2 && (
                                        <Button
                                            onClick={handleStep2}
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                            )}
                                            {loading ? "Saving…" : "Continue"}
                                            {!loading && (
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            )}
                                        </Button>
                                    )}

                                    {step === 3 && (
                                        <Button
                                            onClick={() => {
                                                if (canProceedStep3) {
                                                    setStep(4);
                                                } else {
                                                    setError(
                                                        !resumeUploaded
                                                            ? "Please upload your resume first"
                                                            : "Please verify your email"
                                                    );
                                                }
                                            }}
                                            disabled={loading}
                                        >
                                            Continue
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    )}

                                    {step === 4 && (
                                        <Button
                                            onClick={handleStep4}
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                            )}
                                            {loading
                                                ? "Submitting…"
                                                : "Submit Application"}
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Resume / Start New dialog */}
            <ResumeDialog />
        </div>
    );
}
