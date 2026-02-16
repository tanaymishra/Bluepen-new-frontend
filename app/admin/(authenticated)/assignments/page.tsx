"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import {
    ADMIN_ASSIGNMENTS,
    ADMIN_STREAMS,
    ADMIN_PM_LIST,
    ASSIGNMENT_STAGES,
    getStageByKey,
    type AssignmentStageKey,
} from "@/lib/static";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    ArrowUpRight,
    RotateCcw,
    CalendarDays,
} from "lucide-react";

/* ─── Stage Badge ─── */
function StageBadge({ stageKey }: { stageKey: AssignmentStageKey }) {
    const stage = getStageByKey(stageKey);
    return (
        <span
            className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins whitespace-nowrap"
            style={{ backgroundColor: stage.bgColor, color: stage.color }}
        >
            {stage.label}
        </span>
    );
}

/* ─── Helpers ─── */
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/* ──────────────────────────────────────── */

export default function AdminAssignmentsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AssignmentStageKey | "all">("all");
    const [pmFilter, setPmFilter] = useState("all");
    const [streamFilter, setStreamFilter] = useState("all");
    const [studentFilter, setStudentFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    /* unique student names for filter */
    const studentNames = useMemo(
        () => [...new Set(ADMIN_ASSIGNMENTS.map((a) => a.studentName))].sort(),
        []
    );

    /* counts by stage */
    const stageCounts = useMemo(() => {
        const counts: Record<string, number> = { all: ADMIN_ASSIGNMENTS.length };
        ASSIGNMENT_STAGES.forEach((s) => {
            counts[s.key] = ADMIN_ASSIGNMENTS.filter((a) => a.stage === s.key).length;
        });
        return counts;
    }, []);

    /* active filter count */
    const activeFilterCount = [
        pmFilter !== "all",
        streamFilter !== "all",
        studentFilter !== "all",
        dateFrom !== null,
        dateTo !== null,
    ].filter(Boolean).length;

    /* filtered list */
    const filtered = useMemo(() => {
        return ADMIN_ASSIGNMENTS.filter((a) => {
            if (search) {
                const q = search.toLowerCase();
                if (
                    !a.id.toLowerCase().includes(q) &&
                    !a.title.toLowerCase().includes(q) &&
                    !a.studentName.toLowerCase().includes(q) &&
                    !a.subject.toLowerCase().includes(q)
                )
                    return false;
            }
            if (statusFilter !== "all" && a.stage !== statusFilter) return false;
            if (pmFilter !== "all" && a.pmName !== pmFilter) return false;
            if (streamFilter !== "all" && a.stream !== streamFilter) return false;
            if (studentFilter !== "all" && a.studentName !== studentFilter) return false;
            if (dateFrom && new Date(a.submittedAt) < dateFrom) return false;
            if (dateTo) {
                const end = new Date(dateTo);
                end.setHours(23, 59, 59);
                if (new Date(a.submittedAt) > end) return false;
            }
            return true;
        });
    }, [search, statusFilter, pmFilter, streamFilter, studentFilter, dateFrom, dateTo]);

    const handleReset = () => {
        setSearch("");
        setStatusFilter("all");
        setPmFilter("all");
        setStreamFilter("all");
        setStudentFilter("all");
        setDateFrom(null);
        setDateTo(null);
    };

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* ─── Header ─── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            >
                <div>
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat">
                        Assignments
                    </h1>
                    <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                        {ADMIN_ASSIGNMENTS.length} total &middot; {filtered.length} shown
                    </p>
                </div>
                {activeFilterCount > 0 && (
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reset filters
                    </Button>
                )}
            </motion.div>

            {/* ─── Search + Filter Dropdowns ─── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="flex flex-col lg:flex-row gap-3 mb-4"
            >
                {/* Search */}
                <div className="flex-1 min-w-[220px]">
                    <Input
                        placeholder="Search by ID, title, student, or subject..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                        className="h-10 text-[13px]"
                    />
                </div>

                {/* PM Select */}
                <Select value={pmFilter} onValueChange={setPmFilter}>
                    <SelectTrigger className="h-10 min-w-[150px] text-[13px]">
                        <SelectValue placeholder="All PMs" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All PMs</SelectItem>
                        {ADMIN_PM_LIST.map((pm) => (
                            <SelectItem key={pm} value={pm}>
                                {pm}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Stream Select */}
                <Select value={streamFilter} onValueChange={setStreamFilter}>
                    <SelectTrigger className="h-10 min-w-[170px] text-[13px]">
                        <SelectValue placeholder="All Streams" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Streams</SelectItem>
                        {ADMIN_STREAMS.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Student Select */}
                <Select value={studentFilter} onValueChange={setStudentFilter}>
                    <SelectTrigger className="h-10 min-w-[150px] text-[13px]">
                        <SelectValue placeholder="All Students" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        {studentNames.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Date Range Pickers */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none z-10" />
                        <DatePicker
                            selected={dateFrom}
                            onChange={(d: Date | null) => setDateFrom(d)}
                            placeholderText="From"
                            dateFormat="dd MMM yyyy"
                            isClearable
                            className="h-10 w-[140px] pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-[12px] font-poppins text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                        />
                    </div>
                    <span className="text-gray-400 text-[12px] font-poppins">to</span>
                    <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none z-10" />
                        <DatePicker
                            selected={dateTo}
                            onChange={(d: Date | null) => setDateTo(d)}
                            placeholderText="To"
                            dateFormat="dd MMM yyyy"
                            isClearable
                            minDate={dateFrom ?? undefined}
                            className="h-10 w-[140px] pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-[12px] font-poppins text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                        />
                    </div>
                </div>
            </motion.div>

            {/* ─── Status Filter Pills ─── */}
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
                        onClick={() =>
                            setStatusFilter(filter.key as AssignmentStageKey | "all")
                        }
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium font-poppins whitespace-nowrap transition-all border",
                            statusFilter === filter.key
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        {filter.label}
                        <span
                            className={cn(
                                "text-[10px] tabular-nums px-1.5 py-[1px] rounded-full font-semibold",
                                statusFilter === filter.key
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-400"
                            )}
                        >
                            {stageCounts[filter.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* ─── Table ─── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px] font-poppins">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    ID
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    Title
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    Student
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    Stream
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    Marks
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    Status
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5">
                                    PM
                                </th>
                                <th className="text-left text-[11px] uppercase tracking-widest text-gray-400 font-semibold px-5 py-3.5 hidden xl:table-cell">
                                    Submitted
                                </th>
                                <th className="px-5 py-3.5 w-10" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-5 py-3.5">
                                            <span className="font-mono text-[11.5px] text-gray-500 tracking-tight">
                                                {a.id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-[260px]">
                                            <Link
                                                href={`/admin/assignments/${a.id}`}
                                                className="text-[13px] font-medium text-gray-800 hover:text-primary transition-colors line-clamp-1"
                                            >
                                                {a.title}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                                            {a.studentName}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 text-[12px] whitespace-nowrap">
                                            {a.stream}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            {a.marks !== null ? (
                                                <span className="font-semibold text-gray-800 tabular-nums">
                                                    {a.marks}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-[12px]">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <StageBadge stageKey={a.stage} />
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 text-[12px] whitespace-nowrap">
                                            {a.pmName}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-400 text-[12px] whitespace-nowrap hidden xl:table-cell">
                                            {formatDate(a.submittedAt)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/admin/assignments/${a.id}`}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-primary/5 transition-all"
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center">
                                        <p className="text-[14px] font-medium text-gray-500 font-poppins mb-1">
                                            No assignments found
                                        </p>
                                        <p className="text-[12.5px] text-gray-400 font-poppins">
                                            Try adjusting your filters or search term
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
