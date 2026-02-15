"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ADMIN_ASSIGNMENTS,
    ADMIN_STATUS_STEPS,
    ADMIN_PM_LIST,
    ADMIN_FREELANCER_LIST,
    getStageByKey,
    type AssignmentStageKey,
} from "@/lib/static";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    ChevronLeft,
    ChevronRight,
    Trash2,
    MoreVertical,
    Check,
    Upload,
    UserCog,
    PenTool,
    Phone,
    Mail,
    User,
    Award,
    RotateCcw,
    ArrowLeft,
} from "lucide-react";

/* ─── Helpers ─── */

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatDateShort(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatCurrency(amount: number) {
    return amount.toLocaleString("en-IN");
}

/* ─── Detail Cell (3-col grid item) ─── */

function DetailCell({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11.5px] text-gray-400 font-poppins mb-1">{label}</p>
            <p className="text-[14px] font-bold text-gray-900 font-poppins leading-snug">
                {value}
            </p>
        </div>
    );
}

/* ─── Status Timeline ─── */

function StatusTimeline({
    currentStep,
    onReset,
}: {
    currentStep: number;
    onReset: () => void;
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-[12px] font-semibold text-gray-500 font-poppins tracking-wide">
                    status
                </p>
                <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" className="h-7 text-[11px] px-3 rounded-lg">
                        Update
                    </Button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="relative pl-8">
                {/* vertical line */}
                <div className="absolute left-[11px] top-3 bottom-12 w-[2px] bg-gray-100" />

                <div className="space-y-0">
                    {ADMIN_STATUS_STEPS.map((step, i) => {
                        let status: "done" | "in-progress" | "pending";
                        if (i < currentStep) status = "done";
                        else if (i === currentStep) status = "in-progress";
                        else status = "pending";

                        return (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.06 }}
                                className="relative pb-6 last:pb-0"
                            >
                                {/* dot */}
                                <div
                                    className={cn(
                                        "absolute -left-8 top-[2px] w-[22px] h-[22px] rounded-full border-[2.5px] flex items-center justify-center z-10",
                                        status === "done"
                                            ? "border-emerald-500 bg-emerald-500"
                                            : status === "in-progress"
                                            ? "border-primary bg-primary"
                                            : "border-gray-200 bg-white"
                                    )}
                                >
                                    {status === "done" && (
                                        <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                                    )}
                                    {status === "in-progress" && (
                                        <span className="text-[9px] font-bold text-white font-montserrat">
                                            {i + 1}
                                        </span>
                                    )}
                                </div>

                                {/* label + timestamp */}
                                <div className="ml-2 min-h-[36px]">
                                    <span
                                        className={cn(
                                            "text-[13px] font-semibold font-poppins leading-none",
                                            status === "done"
                                                ? "text-gray-800"
                                                : status === "in-progress"
                                                ? "text-primary"
                                                : "text-gray-400"
                                        )}
                                    >
                                        {step}
                                    </span>
                                    <p
                                        className={cn(
                                            "text-[11px] font-poppins mt-1",
                                            status === "done"
                                                ? "text-gray-400"
                                                : status === "in-progress"
                                                ? "text-primary/60 italic"
                                                : "text-gray-300"
                                        )}
                                    >
                                        {status === "done" && "13 Feb 2026, 06:31 PM"}
                                        {status === "in-progress" && "in-progress"}
                                        {status === "pending" && "yet to accomplish"}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={onReset}
                className="mt-4 flex items-center gap-1.5 text-[12px] text-red-500 hover:text-red-600 font-medium font-poppins transition-colors"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset timeline
            </button>
        </div>
    );
}

/* ─── Person Selection Sheet ─── */

function PersonSheet({
    open,
    onOpenChange,
    title,
    description,
    people,
    currentPerson,
    onSelect,
    icon: Icon,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    people: readonly string[];
    currentPerson: string;
    onSelect: (name: string) => void;
    icon: React.ElementType;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[380px] sm:w-[420px]">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-[18px] font-bold font-montserrat text-gray-900">
                        {title}
                    </SheetTitle>
                    <SheetDescription className="text-[13px] text-gray-400 font-poppins">
                        {description}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-2">
                    {people.map((person) => {
                        const isActive = person === currentPerson;
                        return (
                            <button
                                key={person}
                                onClick={() => {
                                    onSelect(person);
                                    onOpenChange(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left",
                                    isActive
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-500"
                                    )}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            "text-[14px] font-semibold font-poppins",
                                            isActive ? "text-primary" : "text-gray-800"
                                        )}
                                    >
                                        {person}
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-poppins">
                                        Available
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
}

/* ─── File Upload Area ─── */

function FileUploadArea({ label }: { label: string }) {
    return (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-primary/30 hover:bg-primary/[0.02] transition-all group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mx-auto mb-2.5 group-hover:bg-primary/5 transition-colors">
                <Upload className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-[13px] font-medium text-gray-600 font-poppins mb-0.5">
                {label}
            </p>
            <p className="text-[11px] text-gray-400 font-poppins">
                Drag &amp; drop or click to upload
            </p>
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Page
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AdminAssignmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const assignmentData = useMemo(
        () => ADMIN_ASSIGNMENTS.find((a) => a.id === id),
        [id]
    );

    /* local state for PM/Freelancer assignment */
    const [pmName, setPmName] = useState(assignmentData?.pmName ?? "");
    const [freelancerName, setFreelancerName] = useState(
        assignmentData?.freelancerName ?? ""
    );
    const [pmSheetOpen, setPmSheetOpen] = useState(false);
    const [flSheetOpen, setFlSheetOpen] = useState(false);

    /* navigation helpers */
    const allIds = ADMIN_ASSIGNMENTS.map((a) => a.id);
    const currentIdx = allIds.indexOf(id);
    const prevId = currentIdx > 0 ? allIds[currentIdx - 1] : null;
    const nextId = currentIdx < allIds.length - 1 ? allIds[currentIdx + 1] : null;

    /* ─── Not Found ─── */
    if (!assignmentData) {
        return (
            <div className="max-w-[900px] mx-auto py-20 text-center">
                <p className="text-[15px] font-medium text-gray-500 font-poppins mb-2">
                    Assignment not found
                </p>
                <p className="text-[13px] text-gray-400 font-poppins mb-6">
                    The assignment &ldquo;{id}&rdquo; does not exist.
                </p>
                <Button asChild>
                    <Link href="/admin/assignments">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Assignments
                    </Link>
                </Button>
            </div>
        );
    }

    const assignment = assignmentData;

    return (
        <div className="max-w-[1100px] mx-auto">
            {/* ─── Top Bar: back, title, actions ─── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5"
            >
                <div>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-1 text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors group mb-1"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        back
                    </button>
                    <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 font-montserrat">
                        Assignments #{assignment.id.replace("ASG-", "")}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm">
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Delete
                    </Button>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        {prevId ? (
                            <Link
                                href={`/admin/assignments/${prevId}`}
                                className="flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-medium font-poppins text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Previous
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-medium font-poppins text-gray-300 border-r border-gray-200 cursor-not-allowed">
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Previous
                            </span>
                        )}
                        {nextId ? (
                            <Link
                                href={`/admin/assignments/${nextId}`}
                                className="flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-medium font-poppins text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Next
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1 px-3 py-1.5 text-[12.5px] font-medium font-poppins text-gray-300 cursor-not-allowed">
                                Next
                                <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ─── Main Grid: Content + Timeline ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* ══════════ LEFT COLUMN (2/3) ══════════ */}
                <div className="lg:col-span-2 space-y-5">
                    {/* ─── Hero Banner + Details Card ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
                    >
                        {/* Banner */}
                        <div className="relative h-[130px] bg-gradient-to-r from-[#012551] via-[#1a3f7a] to-[#2956A8] overflow-hidden">
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
                            <div className="absolute top-4 right-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm text-[12px] h-8"
                                >
                                    Edit
                                </Button>
                            </div>
                            <div className="absolute bottom-3 right-4 text-[11px] text-white/40 font-poppins">
                                last edited on {formatDateTime(assignment.submittedAt)}
                            </div>
                        </div>

                        {/* Title + Description */}
                        <div className="p-5 sm:p-6 pb-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900 font-montserrat leading-snug">
                                    {assignment.title.charAt(0).toLowerCase() + assignment.title.slice(1)}
                                </h2>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors shrink-0">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[13px] text-gray-400 font-poppins leading-[1.8] mb-6">
                                {assignment.description}
                            </p>

                            {/* ─── Detail Grid (3 columns matching reference) ─── */}
                            <div className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-gray-100 pt-5">
                                <DetailCell label="Level" value={assignment.academicLevel} />
                                <DetailCell label="Stream" value={assignment.stream} />
                                <DetailCell label="Type" value={assignment.type} />
                                <DetailCell label="Submitted by" value={assignment.studentName} />
                                <DetailCell label="Word Count" value={assignment.wordCount.toLocaleString()} />
                                <DetailCell label="Posted on" value={formatDateShort(assignment.submittedAt)} />
                                <DetailCell label="Deadline" value={formatDateShort(assignment.deadline)} />
                                <DetailCell label="Freelancer Amount" value={formatCurrency(assignment.freelancerAmount)} />
                                <DetailCell label="Total Amount" value={formatCurrency(assignment.totalAmount)} />
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── PM & Freelancer Cards ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {/* PM Card */}
                        <div className="bg-[#FFF8E6] rounded-2xl p-5 border border-[#F8D881]/30">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[12px] font-semibold text-gray-500 font-poppins">
                                    PM assigned
                                </p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-primary text-[13px] h-auto p-0"
                                    onClick={() => setPmSheetOpen(true)}
                                >
                                    {pmName ? "Update" : "Assign"}
                                </Button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#F8D881]/40 flex items-center justify-center shrink-0">
                                    <UserCog className="w-5 h-5 text-[#B8860B]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                                        {pmName || "Not assigned"}
                                    </p>
                                    {pmName && (
                                        <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5 mt-0.5">
                                            <Phone className="w-3 h-3" />
                                            {assignment.pmPhone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Freelancer Card */}
                        <div className="bg-[#FFF8E6] rounded-2xl p-5 border border-[#F8D881]/30">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[12px] font-semibold text-gray-500 font-poppins">
                                    Freelancer assigned
                                </p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-primary text-[13px] h-auto p-0"
                                    onClick={() => setFlSheetOpen(true)}
                                >
                                    {freelancerName ? "Update" : "Assign"}
                                </Button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#F8D881]/40 flex items-center justify-center shrink-0">
                                    <PenTool className="w-5 h-5 text-[#B8860B]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">
                                        {freelancerName || "Not assigned"}
                                    </p>
                                    {freelancerName && (
                                        <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5 mt-0.5">
                                            <Phone className="w-3 h-3" />
                                            {assignment.freelancerPhone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── Student & Marks ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {/* Student Card */}
                        <div className="bg-white rounded-2xl border border-gray-100/80 p-5">
                            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                                Student Contact
                            </p>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="w-[18px] h-[18px] text-primary" />
                                </div>
                                <p className="text-[15px] font-bold text-gray-900 font-poppins">
                                    {assignment.studentName}
                                </p>
                            </div>
                            <div className="space-y-2 pl-[52px]">
                                <p className="text-[12.5px] text-gray-500 font-poppins flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    {assignment.studentPhone}
                                </p>
                                <p className="text-[12.5px] text-gray-500 font-poppins flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    {assignment.studentEmail}
                                </p>
                            </div>
                        </div>

                        {/* Marks Card */}
                        <div className="bg-white rounded-2xl border border-gray-100/80 p-5 flex flex-col items-center justify-center text-center">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                                <Award className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-2">
                                Marks Received
                            </p>
                            {assignment.marks !== null ? (
                                <p className="text-[36px] font-bold text-gray-900 font-montserrat tabular-nums leading-none">
                                    {assignment.marks}
                                    <span className="text-[15px] text-gray-400 font-poppins font-normal ml-1">
                                        / 100
                                    </span>
                                </p>
                            ) : (
                                <p className="text-[16px] text-gray-400 font-poppins font-medium">
                                    NA
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* ─── File Uploads ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        className="bg-white rounded-2xl border border-gray-100/80 p-5"
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

                {/* ══════════ RIGHT COLUMN (1/3) — Timeline ══════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100/80 p-5 h-fit lg:sticky lg:top-6"
                >
                    <StatusTimeline
                        currentStep={assignment.currentStep}
                        onReset={() => {}}
                    />
                </motion.div>
            </div>

            {/* ─── PM Sheet ─── */}
            <PersonSheet
                open={pmSheetOpen}
                onOpenChange={setPmSheetOpen}
                title={pmName ? "Update PM" : "Assign PM"}
                description="Select a project manager for this assignment"
                people={ADMIN_PM_LIST}
                currentPerson={pmName}
                onSelect={setPmName}
                icon={UserCog}
            />

            {/* ─── Freelancer Sheet ─── */}
            <PersonSheet
                open={flSheetOpen}
                onOpenChange={setFlSheetOpen}
                title={freelancerName ? "Update Freelancer" : "Assign Freelancer"}
                description="Select a freelancer for this assignment"
                people={ADMIN_FREELANCER_LIST}
                currentPerson={freelancerName}
                onSelect={setFreelancerName}
                icon={PenTool}
            />
        </div>
    );
}
