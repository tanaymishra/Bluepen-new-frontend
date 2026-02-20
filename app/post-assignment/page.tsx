
"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/components/user/navbar/navbar";
import Footer from "@/components/Footer";
import { assignmentTypes } from "./constants";
import StepIndicator from "./components/StepIndicator";
import HeroSection from "./components/HeroSection";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import { usePostAssignment } from "@/hooks/assignments/usePostAssignment";

export default function PostAssignmentPage() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subtype: "",
        title: "",
        academicLevel: "",
        subject: "",
        wordCount: "",
        deadline: null as Date | null,
        referencingStyle: "",
        instructions: "",
        files: [] as File[],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedTypeData = assignmentTypes.find((t) => t.id === selectedType);

    const set = useCallback(
        (field: string, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => {
                if (!prev[field]) return prev;
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        },
        []
    );

    const setDeadline = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, deadline: date }));
        if (date && errors.deadline) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy.deadline;
                return copy;
            });
        }
    };

    const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFormData((prev) => ({
            ...prev,
            files: [...prev.files, ...Array.from(e.target.files!)].slice(0, 5),
        }));
        e.target.value = "";
    };

    const removeFile = (i: number) =>
        setFormData((prev) => ({ ...prev, files: prev.files.filter((_, idx) => idx !== i) }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!formData.subtype) e.subtype = "Please select a type";
        if (!formData.title.trim()) e.title = "Please enter a title or topic";
        if (!formData.academicLevel) e.academicLevel = "Please select your academic level";
        if (!formData.deadline) e.deadline = "Please set a deadline";
        setErrors(e);
        return !Object.keys(e).length;
    };

    const { submitting, error: submitError, submit: postAssignment } = usePostAssignment();

    const next = () => {
        if (step === 1 && selectedType) setStep(2);
        else if (step === 2 && validate()) setStep(3);
    };
    const back = () => step > 1 && setStep(step - 1);

    const submit = () => {
        if (submitting) return;
        postAssignment({
            type:             selectedType ?? '',
            subtype:          formData.subtype,
            title:            formData.title,
            academicLevel:    formData.academicLevel,
            subject:          formData.subject,
            wordCount:        formData.wordCount,
            deadline:         formData.deadline,
            referencingStyle: formData.referencingStyle,
            instructions:     formData.instructions,
            files:            formData.files,
        });
    };

    const variants = {
        enter: { opacity: 0, y: 24 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <HeroSection />

            {/* ───── FORM CARD ───── */}
            <main className="flex-1 relative z-10 -mt-10 pb-20">
                <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
                    <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-5 sm:p-8 md:p-10 lg:p-14">
                        <StepIndicator current={step} />

                        <AnimatePresence mode="wait">
                            {/* ════════ STEP 1 ════════ */}
                            {step === 1 && (
                                <StepOne
                                    key="step1"
                                    selectedType={selectedType}
                                    setSelectedType={setSelectedType}
                                    next={next}
                                    variants={variants}
                                />
                            )}

                            {/* ════════ STEP 2 ════════ */}
                            {step === 2 && selectedTypeData && (
                                <StepTwo
                                    key="step2"
                                    selectedTypeData={selectedTypeData}
                                    formData={formData}
                                    errors={errors}
                                    set={set}
                                    setDeadline={setDeadline}
                                    addFiles={addFiles}
                                    removeFile={removeFile}
                                    back={back}
                                    next={next}
                                    variants={variants}
                                />
                            )}

                            {/* ════════ STEP 3 ════════ */}
                            {step === 3 && selectedTypeData && (
                                <StepThree
                                    key="step3"
                                    selectedTypeData={selectedTypeData}
                                    formData={formData}
                                    back={back}
                                    submit={submit}
                                    submitting={submitting}
                                    submitError={submitError}
                                    variants={variants}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />

            {/* ───── datepicker overrides ───── */}
            <style jsx global>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker {
                    font-family: var(--font-poppins), "Poppins", sans-serif !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 12px !important;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important;
                    overflow: hidden;
                }
                .react-datepicker__header {
                    background: #f9fafb !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    padding-top: 12px !important;
                }
                .react-datepicker__current-month {
                    font-family: var(--font-montserrat), "Montserrat", sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    color: #111827 !important;
                }
                .react-datepicker__day-name {
                    color: #9ca3af !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    width: 2.2rem !important;
                }
                .react-datepicker__day {
                    width: 2.2rem !important;
                    line-height: 2.2rem !important;
                    font-size: 13px !important;
                    color: #374151 !important;
                    margin: 0.2rem !important;
                    border-radius: 8px !important;
                    transition: all 0.2s !important;
                }
                .react-datepicker__day:hover {
                    background-color: #f3f4f6 !important;
                    color: #111827 !important;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected {
                    background-color: #2563eb !important;
                    color: white !important;
                    font-weight: 600 !important;
                }
                .react-datepicker__day--today {
                    color: #2563eb !important;
                    font-weight: 600 !important;
                    background: #eff6ff !important;
                }
                .react-datepicker__day--disabled {
                    color: #d1d5db !important;
                    pointer-events: none !important;
                }
                .react-datepicker__time-container {
                    border-left: 1px solid #f3f4f6 !important;
                }
                .react-datepicker__time-list-item:hover {
                    background-color: #f3f4f6 !important;
                }
                .react-datepicker__time-list-item--selected {
                    background-color: #2563eb !important;
                    color: white !important;
                }
                
                /* custom scrollbar for time picker */
                .react-datepicker__time-list::-webkit-scrollbar {
                    width: 4px;
                }
                .react-datepicker__time-list::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
