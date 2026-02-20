
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guarantees } from "../constants";
import SummaryRow from "./SummaryRow";

interface StepThreeProps {
    selectedTypeData: any;
    formData: any;
    back: () => void;
    submit: () => void;
    submitting?: boolean;
    submitError?: string | null;
    variants: any;
}

export default function StepThree({
    selectedTypeData,
    formData,
    back,
    submit,
    submitting = false,
    submitError,
    variants,
}: StepThreeProps) {
    if (!selectedTypeData) return null;

    return (
        <motion.div
            key="s3"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
        >
            <div className="text-center mb-7 lg:mb-9">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-montserrat text-gray-900">
                    Review your order
                </h2>
                <p className="text-gray-500 text-[13px] lg:text-[15px] font-poppins mt-1 lg:mt-2">
                    Make sure everything looks right before submitting
                </p>
            </div>

            {/* summary */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 overflow-hidden">
                {/* header */}
                <div className="flex items-center gap-3 lg:gap-4 p-4 sm:p-5 lg:p-6">
                    <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                        {React.createElement(selectedTypeData.icon, {
                            className: "w-[18px] h-[18px]",
                        })}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 font-montserrat text-[14px] lg:text-base truncate">
                            {selectedTypeData.title}
                        </p>
                        <p className="text-[12px] lg:text-[13px] text-gray-500 font-poppins truncate">
                            {formData.subtype || "—"}
                        </p>
                    </div>
                </div>

                {/* rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
                    <SummaryRow
                        label="Title"
                        value={formData.title}
                        className="col-span-full lg:col-span-2"
                    />
                    <SummaryRow label="Academic Level" value={formData.academicLevel} />
                    <SummaryRow label="Subject" value={formData.subject || "—"} />
                    <SummaryRow label="Word Count" value={formData.wordCount || "—"} />
                    <SummaryRow
                        label="Deadline"
                        value={
                            formData.deadline
                                ? formData.deadline.toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })
                                : "—"
                        }
                    />
                    <SummaryRow
                        label="Referencing"
                        value={formData.referencingStyle || "—"}
                    />
                </div>

                {/* instructions */}
                {formData.instructions && (
                    <div className="p-4 sm:p-5 lg:p-6 bg-white">
                        <p className="text-[11px] lg:text-[12px] text-gray-400 font-poppins uppercase tracking-wider mb-1.5">
                            Instructions
                        </p>
                        <p className="text-[13px] lg:text-[14px] text-gray-700 font-poppins leading-relaxed whitespace-pre-wrap break-words">
                            {formData.instructions}
                        </p>
                    </div>
                )}

                {/* files */}
                {formData.files.length > 0 && (
                    <div className="p-4 sm:p-5 lg:p-6 bg-white">
                        <p className="text-[11px] lg:text-[12px] text-gray-400 font-poppins uppercase tracking-wider mb-2">
                            Attachments ({formData.files.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {formData.files.map((f: any, i: number) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 text-[12px] text-gray-600 font-poppins"
                                >
                                    <Paperclip className="w-3 h-3" />
                                    {f.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 mb-1">
                {guarantees.map(({ icon: G, text }) => (
                    <span
                        key={text}
                        className="flex items-center gap-1.5 text-[12px] lg:text-[13px] text-gray-500 font-poppins"
                    >
                        <G className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-500" />
                        {text}
                    </span>
                ))}
            </div>

            {/* nav */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8">
                <Button variant="ghost" onClick={back} size="lg" className="w-full sm:w-auto" disabled={submitting}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Edit details
                </Button>
                {submitError && (
                    <p className="text-[13px] text-red-500 font-poppins self-center">{submitError}</p>
                )}
                <Button onClick={submit} size="lg" className="w-full sm:w-auto min-w-[180px]" disabled={submitting}>
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting…
                        </>
                    ) : (
                        <>
                            Submit Assignment
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
