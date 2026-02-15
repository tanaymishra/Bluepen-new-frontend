"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ADMIN_ASSIGNMENTS,
    ADMIN_STATUS_STEPS,
    getStageByKey,
    type AssignmentStageKey,
} from "@/lib/static";
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Layers,
    Type,
    Hash,
    Calendar,
    FileText,
    Clock,
    IndianRupee,
    UserCog,
    PenTool,
    Phone,
    Mail,
    User,
    Award,
    Upload,
    Check,
    Loader2,
    Copy,
} from "lucide-react";

/* ─── Helpers ─── */

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatCurrency(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

/* ─── Sub-components ─── */

function StageBadge({
    stageKey,
    size = "sm",
}: {
    stageKey: AssignmentStageKey;
    size?: "sm" | "md";
}) {
    const stage = getStageByKey(stageKey);
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-semibold font-poppins",
                size === "md"
                    ? "px-3 py-1 text-[12px]"
                    : "px-2.5 py-[3px] text-[11px]"
            )}
            style={{ backgroundColor: stage.bgColor, color: stage.color }}
        >
            {stage.label}
        </span>
    );
}

function DetailField({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ElementType;
}) {
    return (
        <div className="flex items-start gap-3 py-3.5">
            {Icon && (
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-[15px] h-[15px] text-gray-400" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1">
                    {label}
                </p>
                <div className="text-[13.5px] text-gray-800 font-poppins leading-relaxed">
                    {value}
                </div>
            </div>
        </div>
    );
}

/* ─── Status Timeline ─── */

function StatusTimeline({ currentStep }: { currentStep: number }) {
    return (
        <div className="relative pl-6">
            {/* vertical line */}
            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gray-100" />

            <div className="space-y-0">
                {ADMIN_STATUS_STEPS.map((step, i) => {
                    let status: "done" | "in-progress" | "pending";
                    if (i < currentStep) status = "done";
                    else if (i === currentStep) status = "in-progress";
                    else status = "pending";

                    return (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className="relative pb-6 last:pb-0"
                        >
                            {/* dot */}
                            <div
                                className={cn(
                                    "absolute -left-6 top-[5px] w-[18px] h-[18px] rounded-full border-[2.5px] flex items-center justify-center z-10",
                                    status === "done"
                                        ? "border-emerald-400 bg-emerald-400"
                                        : status === "in-progress"
                                        ? "border-primary bg-white"
                                        : "border-gray-200 bg-white"
                                )}
                            >
                                {status === "done" && (
                                    <Check
                                        className="w-[10px] h-[10px] text-white"
                                        strokeWidth={3}
                                    />
                                )}
                                {status === "in-progress" && (
                                    <div className="w-[7px] h-[7px] rounded-full bg-primary" />
                                )}
                            </div>

                            {/* label */}
                            <div className="ml-2">
                                <span
                                    className={cn(
                                        "text-[12.5px] font-semibold font-poppins",
                                        status === "done"
                                            ? "text-emerald-600"
                                            : status === "in-progress"
                                            ? "text-primary"
                                            : "text-gray-400"
                                    )}
                                >
                                    {step}
                                </span>
                                {status === "in-progress" && (
                                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-primary/70 font-poppins">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Current
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Contact Card ─── */

function ContactCard({
    title,
    name,
    phone,
    email,
    icon: Icon,
}: {
    title: string;
    name: string;
    phone: string;
    email?: string;
    icon: React.ElementType;
}) {
    return (
        <div className="bg-gray-50/70 rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">
                    {title}
                </p>
            </div>
            <p className="text-[14px] font-semibold text-gray-800 font-poppins mb-2">
                {name}
            </p>
            <div className="flex items-center gap-2 text-[12.5px] text-gray-500 font-poppins mb-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {phone}
            </div>
            {email && (
                <div className="flex items-center gap-2 text-[12.5px] text-gray-500 font-poppins">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {email}
                </div>
            )}
        </div>
    );
}

/* ─── File Upload Area ─── */

function FileUploadArea({ label }: { label: string }) {
    return (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/30 hover:bg-primary/[0.02] transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/5 transition-colors">
                <Upload className="w-[18px] h-[18px] text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-[13px] font-medium text-gray-600 font-poppins mb-1">
                {label}
            </p>
            <p className="text-[11.5px] text-gray-400 font-poppins">
                Drag &amp; drop or click to upload
            </p>
        </div>
    );
}

/* ─── Copy Button ─── */

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy ID"
        >
            {copied ? (
                <Check className="w-3.5 h-3.5 text-primary" />
            ) : (
                <Copy className="w-3.5 h-3.5" />
            )}
        </button>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Page
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AdminAssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const assignment = useMemo(
        () => ADMIN_ASSIGNMENTS.find((a) => a.id === id),
        [id]
    );

    /* ─── Not Found ─── */
    if (!assignment) {
        return (
            <div className="max-w-[900px] mx-auto py-20 text-center">
                <p className="text-[15px] font-medium text-gray-500 font-poppins mb-2">
                    Assignment not found
                </p>
                <p className="text-[13px] text-gray-400 font-poppins mb-6">
                    The assignment &ldquo;{id}&rdquo; does not exist.
                </p>
                <Link
                    href="/admin/assignments"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins hover:bg-primary-dark transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Assignments
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1040px] mx-auto">
            {/* ─── Back ─── */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
            >
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 font-poppins font-medium transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>
            </motion.div>

            {/* ─── Header ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-2.5">
                    <div className="flex items-center gap-1.5 text-[12px] font-mono text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
                        {assignment.id}
                        <CopyButton text={assignment.id} />
                    </div>
                    <StageBadge stageKey={assignment.stage} size="md" />
                </div>
                <h1 className="text-[20px] sm:text-[24px] font-bold text-gray-900 font-montserrat leading-tight mb-1">
                    {assignment.title}
                </h1>
                <p className="text-[13px] text-gray-400 font-poppins">
                    Submitted by{" "}
                    <span className="text-gray-600 font-medium">
                        {assignment.studentName}
                    </span>{" "}
                    &middot; {formatDateTime(assignment.submittedAt)}
                </p>
            </motion.div>

            {/* ─── Main Grid: Details + Timeline ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                {/* Left: Assignment Details */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 }}
                    className="lg:col-span-3 bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
                >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1">
                        Assignment Details
                    </p>

                    <div className="divide-y divide-gray-50">
                        <DetailField
                            label="Description"
                            value={
                                <p className="text-[13px] text-gray-600 leading-[1.75]">
                                    {assignment.description}
                                </p>
                            }
                            icon={BookOpen}
                        />
                        <DetailField
                            label="Academic Level"
                            value={assignment.academicLevel}
                            icon={GraduationCap}
                        />
                        <DetailField
                            label="Stream"
                            value={assignment.stream}
                            icon={Layers}
                        />
                        <DetailField
                            label="Type"
                            value={
                                <span>
                                    {assignment.type}
                                    <span className="text-gray-400 mx-1.5">
                                        &middot;
                                    </span>
                                    {assignment.subtype}
                                </span>
                            }
                            icon={Type}
                        />
                        <DetailField
                            label="Submitted By"
                            value={assignment.studentName}
                            icon={User}
                        />
                        <DetailField
                            label="Word Count"
                            value={`${assignment.wordCount.toLocaleString()} words`}
                            icon={Hash}
                        />
                        <DetailField
                            label="Posted On"
                            value={formatDateShort(assignment.submittedAt)}
                            icon={Calendar}
                        />
                        <DetailField
                            label="Deadline"
                            value={formatDateShort(assignment.deadline)}
                            icon={Clock}
                        />
                        <DetailField
                            label="Referencing Style"
                            value={assignment.referencingStyle}
                            icon={FileText}
                        />
                        <DetailField
                            label="Freelancer Amount"
                            value={formatCurrency(assignment.freelancerAmount)}
                            icon={IndianRupee}
                        />
                        <DetailField
                            label="Total Amount"
                            value={formatCurrency(assignment.totalAmount)}
                            icon={IndianRupee}
                        />
                    </div>
                </motion.div>

                {/* Right: Status History Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12 }}
                    className="lg:col-span-2 bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
                >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-5">
                        Status History
                    </p>
                    <StatusTimeline currentStep={assignment.currentStep} />
                </motion.div>
            </div>

            {/* ─── PM & Freelancer ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    PM &amp; Freelancer
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ContactCard
                        title="Project Manager"
                        name={assignment.pmName}
                        phone={assignment.pmPhone}
                        icon={UserCog}
                    />
                    <ContactCard
                        title="Freelancer"
                        name={assignment.freelancerName}
                        phone={assignment.freelancerPhone}
                        icon={PenTool}
                    />
                </div>
            </motion.div>

            {/* ─── Student & Marks ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    Student &amp; Marks
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ContactCard
                        title="Student"
                        name={assignment.studentName}
                        phone={assignment.studentPhone}
                        email={assignment.studentEmail}
                        icon={User}
                    />
                    <div className="bg-gray-50/70 rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-3">
                            <Award className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-2">
                            Marks Received
                        </p>
                        {assignment.marks !== null ? (
                            <p className="text-[32px] font-bold text-gray-900 font-montserrat tabular-nums">
                                {assignment.marks}
                                <span className="text-[14px] text-gray-400 font-poppins font-normal ml-1">
                                    / 100
                                </span>
                            </p>
                        ) : (
                            <p className="text-[15px] text-gray-400 font-poppins">
                                NA
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ─── File Uploads ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    File Uploads
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FileUploadArea label="Guidelines" />
                    <FileUploadArea label="Assignment" />
                    <FileUploadArea label="Additional Files" />
                </div>
            </motion.div>
        </div>
    );
}
