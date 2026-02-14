"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    Calendar,
    BookOpen,
    GraduationCap,
    Type,
    FileText,
    Hash,
    Copy,
    Check,
} from "lucide-react";
import {
    MOCK_ASSIGNMENTS,
    getStageByKey,
    getAssignmentHistory,
    ASSIGNMENT_STAGES,
    type AssignmentStageKey,
    type StageHistoryEvent,
} from "@/lib/static";

/* ──────────────────────────────────────────────────────── */

function formatDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }) +
        " at " +
        d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
}

function formatDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatRelative(iso: string) {
    const diff = new Date(iso).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
}

function deadlineMeta(iso: string, stage: string) {
    if (stage === "completed" || stage === "cancelled")
        return { text: formatDateShort(iso), className: "text-gray-500" };
    const days = Math.ceil(
        (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0)
        return { text: `Overdue by ${Math.abs(days)}d`, className: "text-red-600" };
    if (days <= 3)
        return { text: `${formatRelative(iso)} — ${formatDateShort(iso)}`, className: "text-gray-600" };
    return { text: `${formatRelative(iso)} — ${formatDateShort(iso)}`, className: "text-gray-600" };
}

/* ──────────────────────────────────────────────────────── */

function StageBadge({ stageKey, size = "sm" }: { stageKey: AssignmentStageKey; size?: "sm" | "md" }) {
    const stage = getStageByKey(stageKey);
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 font-semibold font-poppins uppercase tracking-wide whitespace-nowrap rounded-md",
                size === "md"
                    ? "px-3 py-1 text-[11.5px]"
                    : "px-2 py-[3px] text-[10.5px]"
            )}
            style={{ backgroundColor: stage.bgColor, color: stage.color }}
        >
            {stage.label}
        </span>
    );
}

/* ──────────────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────────────── */

function StageTimeline({ history }: { history: StageHistoryEvent[] | null }) {
    if (!history) {
        return (
            <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-[13.5px] font-medium text-gray-500 font-poppins mb-0.5">
                    History not available
                </p>
                <p className="text-[12px] text-gray-400 font-poppins">
                    Timeline will appear once the assignment is processed.
                </p>
            </div>
        );
    }

    return (
        <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gray-100" />

            <div className="space-y-0">
                {history.map((event, i) => {
                    const stage = getStageByKey(event.stage);
                    const isLatest = i === history.length - 1;
                    return (
                        <motion.div
                            key={`${event.stage}-${i}`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className="relative pb-6 last:pb-0"
                        >
                            {/* Dot */}
                            <div
                                className={cn(
                                    "absolute -left-6 top-[5px] w-[18px] h-[18px] rounded-full border-[2.5px] bg-white flex items-center justify-center z-10",
                                    isLatest ? "border-primary" : "border-gray-200"
                                )}
                            >
                                {isLatest && (
                                    <div
                                        className="w-[7px] h-[7px] rounded-full bg-primary"
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="ml-2">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span
                                        className="text-[12.5px] font-semibold font-poppins"
                                        style={{ color: isLatest ? "#2956A8" : "#6B7280" }}
                                    >
                                        {stage.label}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-poppins tabular-nums mb-1">
                                    {formatDateTime(event.timestamp)}
                                </p>
                                {event.note && (
                                    <p className="text-[12.5px] text-gray-500 font-poppins leading-relaxed">
                                        {event.note}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────────── */

function StageProgressBar({ currentStage }: { currentStage: AssignmentStageKey }) {
    const mainStages: AssignmentStageKey[] = [
        "submitted",
        "assigned",
        "in_progress",
        "under_review",
        "completed",
    ];

    const currentIdx = mainStages.indexOf(currentStage);
    // For revision/cancelled, map to a sensible index
    const effectiveIdx =
        currentStage === "revision"
            ? mainStages.indexOf("under_review")
            : currentStage === "cancelled"
                ? -1
                : currentIdx;

    return (
        <div className="flex items-center gap-1 w-full">
            {mainStages.map((s, i) => {
                const stage = getStageByKey(s);
                const reached = effectiveIdx >= i;
                const isCurrent = s === currentStage || (currentStage === "revision" && s === "under_review");
                return (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <div
                                className={cn(
                                    "w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold font-montserrat transition-all",
                                    reached
                                        ? "text-white bg-primary"
                                        : "bg-gray-100 text-gray-400"
                                )}
                            >
                                {i + 1}
                            </div>
                            <span
                                className={cn(
                                    "text-[9.5px] font-medium font-poppins whitespace-nowrap",
                                    isCurrent ? "text-gray-700 font-semibold" : reached ? "text-gray-500" : "text-gray-400"
                                )}
                            >
                                {stage.label}
                            </span>
                        </div>
                        {i < mainStages.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-[2px] rounded-full -mt-5",
                                    effectiveIdx > i ? "bg-primary/30" : "bg-gray-100"
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

/* ──────────────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────────────── */

export default function AssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const assignment = useMemo(
        () => MOCK_ASSIGNMENTS.find((a) => a.id === id),
        [id]
    );

    const history = useMemo(
        () => (assignment ? getAssignmentHistory(assignment.id) : null),
        [assignment]
    );

    if (!assignment) {
        return (
            <div className="max-w-[900px] mx-auto py-20 text-center">
                <p className="text-[15px] font-medium text-gray-500 font-poppins mb-2">
                    Assignment not found
                </p>
                <p className="text-[13px] text-gray-400 font-poppins mb-6">
                    The assignment &ldquo;{id}&rdquo; does not exist or has been removed.
                </p>
                <Link
                    href="/students/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins hover:bg-primary-dark transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const dl = deadlineMeta(assignment.deadline, assignment.stage);

    return (
        <div className="max-w-[960px] mx-auto">
            {/* ─── Back + breadcrumb ─── */}
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
                    Submitted {formatDateTime(assignment.submittedAt)}
                </p>
            </motion.div>

            {/* ─── Progress Bar ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    Progress
                </p>
                <StageProgressBar currentStage={assignment.stage} />
                {assignment.stage === "revision" && (
                    <p className="mt-3 text-[12px] text-primary font-poppins bg-primary/[0.06] px-3 py-1.5 rounded-lg inline-block">
                        Revision requested — expert is making changes
                    </p>
                )}
            </motion.div>

            {/* ─── Main Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left: Details */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12 }}
                    className="lg:col-span-3 bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
                >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1">
                        Assignment Details
                    </p>

                    <div className="divide-y divide-gray-50">
                        <DetailField
                            label="Type"
                            value={
                                <span>
                                    {assignment.type}
                                    <span className="text-gray-400 mx-1.5">·</span>
                                    {assignment.subtype}
                                </span>
                            }
                            icon={BookOpen}
                        />
                        <DetailField
                            label="Subject"
                            value={assignment.subject}
                            icon={GraduationCap}
                        />
                        <DetailField
                            label="Academic Level"
                            value={assignment.academicLevel}
                            icon={Type}
                        />
                        <DetailField
                            label="Word Count"
                            value={`${assignment.wordCount.toLocaleString()} words`}
                            icon={Hash}
                        />
                        <DetailField
                            label="Deadline"
                            value={
                                <span className={dl.className}>
                                    {dl.text}
                                </span>
                            }
                            icon={Calendar}
                        />
                        {assignment.referencingStyle && (
                            <DetailField
                                label="Referencing Style"
                                value={assignment.referencingStyle}
                                icon={FileText}
                            />
                        )}
                    </div>


                </motion.div>

                {/* Right: Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.16 }}
                    className="lg:col-span-2 bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
                >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-5">
                        Activity Timeline
                    </p>
                    <StageTimeline history={history} />
                </motion.div>
            </div>

            {/* ─── Instructions ─── */}
            {assignment.instructions && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-4 bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
                >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Instructions
                    </p>
                    <p className="text-[13.5px] text-gray-600 font-poppins leading-[1.75]">
                        {assignment.instructions}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
