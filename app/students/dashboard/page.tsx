"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/authentication/authentication";
import {
    ArrowRight,
    Search,
    ArrowUpRight,
    Plus,
} from "lucide-react";
import {
    MOCK_ASSIGNMENTS,
    getStageByKey,
    type AssignmentStageKey,
    type MockAssignment,
} from "@/lib/static";

/* ──────────────────────────────────────────────────────── */

function formatDate(iso: string) {
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
    return `${days}d left`;
}

function deadlineColor(iso: string, stage: string) {
    if (stage === "completed") return "text-gray-400";
    const days = Math.ceil(
        (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return "text-red-500";
    if (days <= 2) return "text-amber-600";
    return "text-gray-500";
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function getMetrics(assignments: MockAssignment[]) {
    return {
        total: assignments.length,
        active: assignments.filter(
            (a) =>
                a.stage === "in_progress" ||
                a.stage === "assigned" ||
                a.stage === "under_review" ||
                a.stage === "revision"
        ).length,
        completed: assignments.filter((a) => a.stage === "completed").length,
        pending: assignments.filter((a) => a.stage === "submitted").length,
    };
}

/* ──────────────────────────────────────────────────────── */

function StageBadge({ stageKey }: { stageKey: AssignmentStageKey }) {
    const stage = getStageByKey(stageKey);
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-md text-[10.5px] font-semibold font-poppins tracking-wide uppercase whitespace-nowrap"
            style={{ backgroundColor: stage.bgColor, color: stage.color }}
        >
            {stage.label}
        </span>
    );
}

/* ──────────────────────────────────────────────────────── */

function AssignmentRow({ a, index }: { a: MockAssignment; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
        >
            <Link
                href={`/students/assignments/${a.id}`}
                className="group flex items-center gap-4 py-3.5 px-4 -mx-4 rounded-xl hover:bg-gray-50/60 transition-colors duration-150 cursor-pointer"
            >
                {/* Left color strip */}
                <div
                    className="w-[3px] h-10 rounded-full shrink-0"
                    style={{ backgroundColor: getStageByKey(a.stage).color }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-gray-800 font-poppins truncate leading-snug mb-0.5">
                        {a.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11.5px] text-gray-400 font-poppins">
                        <span className="font-mono text-[10.5px] tracking-tight">
                            {a.id}
                        </span>
                        <span className="text-gray-200">|</span>
                        <span>{a.subject}</span>
                        <span className="text-gray-200 hidden sm:inline">|</span>
                        <span className="hidden sm:inline">
                            {a.wordCount.toLocaleString()} words
                        </span>
                    </div>
                </div>

                {/* Desktop meta */}
                <div className="hidden md:flex items-center gap-5 shrink-0">
                    <StageBadge stageKey={a.stage} />
                    <p
                        className={cn(
                            "text-[12px] font-medium font-poppins w-[72px] text-right",
                            deadlineColor(a.deadline, a.stage)
                        )}
                    >
                        {a.stage === "completed"
                            ? formatDate(a.deadline)
                            : formatRelative(a.deadline)}
                    </p>
                </div>

                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 shrink-0" />
            </Link>

            {/* Mobile meta */}
            <div className="flex items-center justify-between pl-[23px] md:hidden text-[11.5px] font-poppins -mt-1 pb-1">
                <StageBadge stageKey={a.stage} />
                <span className={deadlineColor(a.deadline, a.stage)}>
                    {a.stage === "completed"
                        ? formatDate(a.deadline)
                        : formatRelative(a.deadline)}
                </span>
            </div>
        </motion.div>
    );
}

/* ──────────────────────────────────────────────────────── */

export default function StudentDashboard() {
    const { user, isHydrated } = useAuth();
    const [activeTab, setActiveTab] = useState<AssignmentStageKey | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);

    const metrics = useMemo(() => getMetrics(MOCK_ASSIGNMENTS), []);

    const filteredAssignments = useMemo(() => {
        let result = [...MOCK_ASSIGNMENTS];
        if (activeTab !== "all") {
            result = result.filter((a) => a.stage === activeTab);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.id.toLowerCase().includes(q) ||
                    a.subject.toLowerCase().includes(q)
            );
        }
        result.sort(
            (a, b) =>
                new Date(b.submittedAt).getTime() -
                new Date(a.submittedAt).getTime()
        );
        return result;
    }, [activeTab, searchQuery]);

    const firstName =
        isHydrated && user?.firstname ? user.firstname : "there";

    const completionRate = metrics.total
        ? Math.round((metrics.completed / metrics.total) * 100)
        : 0;

    return (
        <div className="max-w-[1140px] mx-auto">
            {/* ─── Greeting ─── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <p className="text-[13px] text-gray-400 font-poppins mb-0.5">
                        {new Date().toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat leading-tight">
                        {getGreeting()},{" "}
                        <span className="text-primary">{firstName}</span>
                    </h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 }}
                >
                    <Link
                        href="/post-assignment"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins shadow-sm shadow-primary/20 hover:bg-primary-dark hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        New Assignment
                    </Link>
                </motion.div>
            </div>

            {/* ─── Stats ─── */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7"
            >
                {/* Total */}
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Total
                    </p>
                    <p className="text-[32px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        {metrics.total}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                        assignments submitted
                    </p>
                </div>

                {/* Active */}
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Active
                    </p>
                    <p className="text-[32px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        {metrics.active}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                        being worked on
                    </p>
                </div>

                {/* Completed */}
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Completed
                    </p>
                    <p className="text-[32px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        {metrics.completed}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex-1 h-[5px] bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-700"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                        <span className="text-[10.5px] font-bold text-primary font-poppins tabular-nums">
                            {completionRate}%
                        </span>
                    </div>
                </div>

                {/* Awaiting */}
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Awaiting
                    </p>
                    <p className="text-[32px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        {metrics.pending}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                        to be assigned
                    </p>
                </div>
            </motion.div>

            {/* ─── Pending Banner ─── */}
            {metrics.pending > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="mb-6 rounded-xl bg-primary-dark p-4 sm:p-5 flex items-center justify-between gap-4"
                >
                    <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-white font-poppins leading-snug">
                            {metrics.pending} assignment{metrics.pending > 1 ? "s" : ""} awaiting expert match
                        </p>
                        <p className="text-[12px] text-white/45 font-poppins mt-0.5 truncate">
                            We&apos;re reviewing your requirements and will assign an expert shortly.
                        </p>
                    </div>
                    <Link
                        href="/students/assignments"
                        className="shrink-0 text-[12px] font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-lg font-poppins transition-colors hidden sm:inline-flex items-center gap-1"
                    >
                        View details
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </motion.div>
            )}

            {/* ─── Assignments ─── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
            >
                {/* Tab bar */}
                <div className="border-b border-gray-100 px-5 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar -mb-px">
                            {[
                                { key: "all" as const, label: "All", count: MOCK_ASSIGNMENTS.length },
                                { key: "submitted" as const, label: "Submitted", count: metrics.pending },
                                { key: "in_progress" as const, label: "In Progress", count: MOCK_ASSIGNMENTS.filter((a) => a.stage === "in_progress").length },
                                { key: "completed" as const, label: "Completed", count: metrics.completed },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={cn(
                                        "relative px-3.5 py-3.5 text-[12.5px] font-medium font-poppins whitespace-nowrap transition-colors",
                                        activeTab === tab.key
                                            ? "text-primary"
                                            : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span
                                            className={cn(
                                                "ml-1.5 text-[10px] tabular-nums px-1.5 py-[1px] rounded-full font-semibold",
                                                activeTab === tab.key
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-gray-100 text-gray-400"
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                    {activeTab === tab.key && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 py-2">
                            <AnimatePresence>
                                {searchOpen && (
                                    <motion.input
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 180, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                        className="h-8 px-3 rounded-lg border border-gray-200 bg-gray-50/50 text-[12.5px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30"
                                    />
                                )}
                            </AnimatePresence>
                            <button
                                onClick={() => {
                                    setSearchOpen(!searchOpen);
                                    if (searchOpen) setSearchQuery("");
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Search className="w-[15px] h-[15px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table header */}
                <div className="hidden md:flex items-center gap-4 px-5 sm:px-6 py-2 text-[10.5px] uppercase tracking-wider text-gray-350 font-poppins font-semibold border-b border-gray-50 bg-gray-50/40">
                    <div className="w-[3px] shrink-0" />
                    <div className="flex-1">Assignment</div>
                    <div className="w-[100px] text-center">Status</div>
                    <div className="w-[72px] text-right">Deadline</div>
                    <div className="w-4" />
                </div>

                {/* Rows */}
                <div className="px-5 sm:px-6 divide-y divide-gray-50/80">
                    {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((a, i) => (
                            <AssignmentRow key={a.id} a={a} index={i} />
                        ))
                    ) : (
                        <div className="py-16 text-center">
                            <p className="text-[14px] font-medium text-gray-500 font-poppins mb-1">
                                No assignments match your criteria
                            </p>
                            <p className="text-[12.5px] text-gray-400 font-poppins">
                                {searchQuery
                                    ? "Try a different search term"
                                    : "Switch tabs or post a new assignment"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {filteredAssignments.length > 0 && (
                    <div className="border-t border-gray-50 px-5 sm:px-6 py-3 flex items-center justify-between">
                        <p className="text-[11.5px] text-gray-400 font-poppins">
                            {filteredAssignments.length} of {MOCK_ASSIGNMENTS.length} assignments
                        </p>
                        <Link
                            href="/students/assignments"
                            className="inline-flex items-center gap-1 text-[12px] text-primary font-medium font-poppins hover:underline underline-offset-2"
                        >
                            View all assignments
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
