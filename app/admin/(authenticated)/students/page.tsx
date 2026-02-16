"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_STUDENTS, ADMIN_STREAMS, type AdminStudent } from "@/lib/static";
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
    RotateCcw,
    GraduationCap,
    Mail,
    Phone,
    MoreVertical,
    UserPlus,
    Users,
} from "lucide-react";
import Link from "next/link";

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: AdminStudent["status"] }) {
    const map: Record<AdminStudent["status"], { bg: string; text: string; label: string }> = {
        active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
        inactive: { bg: "bg-gray-100", text: "text-gray-500", label: "Inactive" },
        blocked: { bg: "bg-red-50", text: "text-red-500", label: "Blocked" },
    };
    const s = map[status];
    return (
        <span className={cn("inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins", s.bg, s.text)}>
            {s.label}
        </span>
    );
}

function formatCurrency(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ──────────────────────────────────────── */

export default function AdminStudentsPage() {
    const [search, setSearch] = useState("");
    const [streamFilter, setStreamFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<AdminStudent["status"] | "all">("all");

    const filtered = useMemo(() => {
        return ADMIN_STUDENTS.filter((s) => {
            const q = search.toLowerCase();
            const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.university.toLowerCase().includes(q);
            const matchStream = streamFilter === "all" || s.stream === streamFilter;
            const matchStatus = statusFilter === "all" || s.status === statusFilter;
            return matchSearch && matchStream && matchStatus;
        });
    }, [search, streamFilter, statusFilter]);

    const resetFilters = () => {
        setSearch("");
        setStreamFilter("all");
        setStatusFilter("all");
    };

    const hasFilters = search || streamFilter !== "all" || statusFilter !== "all";

    /* Stats */
    const totalActive = ADMIN_STUDENTS.filter((s) => s.status === "active").length;
    const totalSpent = ADMIN_STUDENTS.reduce((sum, s) => sum + s.totalSpent, 0);

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
            >
                <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-1">People</p>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 font-montserrat">Students</h1>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/add-student">
                        <UserPlus className="w-4 h-4 mr-1.5" />
                        Add Student
                    </Link>
                </Button>
            </motion.div>

            {/* Stat cards */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
            >
                {[
                    { label: "Total Students", value: ADMIN_STUDENTS.length, icon: Users },
                    { label: "Active", value: totalActive, icon: GraduationCap },
                    { label: "Total Spent", value: formatCurrency(totalSpent), icon: GraduationCap },
                    { label: "Avg. Assignments", value: (ADMIN_STUDENTS.reduce((s, u) => s + u.totalAssignments, 0) / ADMIN_STUDENTS.length).toFixed(1), icon: GraduationCap },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-[11px] text-gray-400 font-poppins font-medium mb-1">{stat.label}</p>
                        <p className="text-[20px] font-bold text-gray-900 font-montserrat">{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-4 mb-5"
            >
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={streamFilter} onValueChange={setStreamFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Stream" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Streams</SelectItem>
                            {ADMIN_STREAMS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminStudent["status"] | "all")}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button variant="outline" size="sm" onClick={resetFilters} className="shrink-0">
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Reset
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {["Student", "University", "Stream", "Assignments", "Spent", "Joined", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((student, i) => (
                                <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div>
                                            <p className="text-[13.5px] font-semibold text-gray-900 font-poppins">{student.name}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-[11.5px] text-gray-400 font-poppins flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />{student.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins whitespace-nowrap">{student.university}</td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{student.stream}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="text-[13px] font-semibold text-gray-800 font-poppins">{student.totalAssignments}</span>
                                        {student.activeAssignments > 0 && (
                                            <span className="ml-1.5 text-[11px] text-primary font-poppins">({student.activeAssignments} active)</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-700 font-poppins tabular-nums whitespace-nowrap">{formatCurrency(student.totalSpent)}</td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(student.joinedAt)}</td>
                                    <td className="px-4 py-3.5"><StatusBadge status={student.status} /></td>
                                    <td className="px-4 py-3.5">
                                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] font-medium text-gray-400 font-poppins">No students found</p>
                        <p className="text-[12px] text-gray-300 font-poppins mt-1">Try adjusting your filters</p>
                    </div>
                )}

                {/* Result count */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {ADMIN_STUDENTS.length} students
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
