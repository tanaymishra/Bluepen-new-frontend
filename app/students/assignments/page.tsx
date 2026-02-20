"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Search,
    ArrowUpRight,
    Plus,
    X,
    Loader2,
} from "lucide-react";
import {
    ASSIGNMENT_STAGES,
    getStageByKey,
    type AssignmentStageKey,
} from "@/lib/static";
import { useAssignments } from "@/hooks/assignments/useAssignments";

/* ────────────────────────────────────────── helpers */

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

/* ────────────────────────────────────────── page */

export default function AssignmentsPage() {
    const { assignments, loading } = useAssignments();
    const [activeFilter, setActiveFilter] = useState<AssignmentStageKey | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "deadline">("newest");

    const filtered = useMemo(() => {
        let result = [...assignments];
        if (activeFilter !== "all") {
            result = result.filter((a) => a.stage === activeFilter);
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
        result.sort((a, b) =>
            sortBy === "newest"
                ? new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
                : new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        return result;
    }, [activeFilter, searchQuery, sortBy]);

    const stageCounts = useMemo(() => {
        const counts: Record<string, number> = { all: assignments.length };
        ASSIGNMENT_STAGES.forEach((s) => {
            counts[s.key] = assignments.filter((a) => a.stage === s.key).length;
        });
        return counts;
    }, [assignments]);

    return (
        <div className="max-w-[1140px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat">
                        My Assignments
                    </h1>
                    <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                        {loading ? "Loading…" : `${assignments.length} total assignment${assignments.length !== 1 ? "s" : ""}`}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
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

            {/* Search + Sort */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08 }}
                className="flex flex-col sm:flex-row gap-3 mb-5"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, ID, or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-9 rounded-xl border border-gray-200 bg-white text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "deadline")}
                    className="h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-[13px] font-poppins text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 cursor-pointer"
                >
                    <option value="newest">Newest first</option>
                    <option value="deadline">Deadline (soonest)</option>
                </select>
            </motion.div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4">
                {[
                    { key: "all" as const, label: "All" },
                    ...ASSIGNMENT_STAGES.filter((s) => stageCounts[s.key] > 0).map((s) => ({
                        key: s.key,
                        label: s.label,
                    })),
                ].map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium font-poppins whitespace-nowrap transition-all border",
                            activeFilter === filter.key
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        {filter.label}
                        <span
                            className={cn(
                                "text-[10px] tabular-nums px-1.5 py-[1px] rounded-full font-semibold",
                                activeFilter === filter.key
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-400"
                            )}
                        >
                            {stageCounts[filter.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Assignment Cards */}
            <div className="space-y-3">
                {loading ? (
                    <div className="py-20 flex items-center justify-center bg-white rounded-2xl border border-gray-100/80">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                ) : filtered.length > 0 ? (
                    filtered.map((a, i) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                        >
                            <Link
                                href={`/students/assignments/${a.id}`}
                                className="group flex items-start gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100/80 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-gray-200/80 transition-all duration-200 cursor-pointer"
                            >
                                <div
                                    className="w-[3px] h-12 sm:h-10 rounded-full shrink-0 mt-1"
                                    style={{ backgroundColor: getStageByKey(a.stage).color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3 mb-1.5">
                                        <p className="text-[14px] font-semibold text-gray-800 font-poppins leading-snug">
                                            {a.title}
                                        </p>
                                        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 shrink-0 mt-0.5" />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-gray-400 font-poppins mb-2.5">
                                        <span className="font-mono text-[10.5px] tracking-tight">
                                            {a.id}
                                        </span>
                                        <span className="text-gray-200">|</span>
                                        <span>{a.subject}</span>
                                        <span className="text-gray-200">|</span>
                                        <span>
                                            {a.type} · {a.subtype}
                                        </span>
                                        <span className="text-gray-200">|</span>
                                        <span>{a.wordCount.toLocaleString()} words</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <StageBadge stageKey={a.stage} />
                                        <span
                                            className={cn(
                                                "text-[12px] font-medium font-poppins",
                                                deadlineColor(a.deadline, a.stage)
                                            )}
                                        >
                                            {a.stage === "completed"
                                                ? `Completed ${formatDate(a.deadline)}`
                                                : formatRelative(a.deadline)}
                                        </span>
                                        <span className="text-[11.5px] text-gray-400 font-poppins">
                                            Submitted {formatDate(a.submittedAt)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-gray-100/80">
                        <p className="text-[14px] font-medium text-gray-500 font-poppins mb-1">
                            {assignments.length === 0 ? "No assignments yet" : "No assignments found"}
                        </p>
                        <p className="text-[12.5px] text-gray-400 font-poppins">
                            {searchQuery
                                ? "Try a different search term"
                                : assignments.length === 0
                                ? "Post your first assignment to get started"
                                : "Try a different filter"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
