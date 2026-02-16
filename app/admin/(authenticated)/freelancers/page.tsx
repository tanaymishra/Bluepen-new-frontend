"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_FREELANCERS, ADMIN_STREAMS, type AdminFreelancer } from "@/lib/static";
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
    Star,
    Users,
    MoreVertical,
    PenTool,
} from "lucide-react";

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: AdminFreelancer["status"] }) {
    const map: Record<AdminFreelancer["status"], { bg: string; text: string; label: string }> = {
        active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
        inactive: { bg: "bg-gray-100", text: "text-gray-500", label: "Inactive" },
        "on-hold": { bg: "bg-amber-50", text: "text-amber-600", label: "On Hold" },
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

export default function AdminFreelancersPage() {
    const [search, setSearch] = useState("");
    const [streamFilter, setStreamFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<AdminFreelancer["status"] | "all">("all");

    const filtered = useMemo(() => {
        return ADMIN_FREELANCERS.filter((f) => {
            const q = search.toLowerCase();
            const matchSearch = !q || f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q) || f.id.toLowerCase().includes(q);
            const matchStream = streamFilter === "all" || f.expertise.includes(streamFilter);
            const matchStatus = statusFilter === "all" || f.status === statusFilter;
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
    const totalActive = ADMIN_FREELANCERS.filter((f) => f.status === "active").length;
    const totalEarned = ADMIN_FREELANCERS.reduce((sum, f) => sum + f.totalEarned, 0);
    const avgRating = (ADMIN_FREELANCERS.reduce((sum, f) => sum + f.rating, 0) / ADMIN_FREELANCERS.length).toFixed(1);

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
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 font-montserrat">Freelancers</h1>
                </div>
            </motion.div>

            {/* Stat cards */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
            >
                {[
                    { label: "Total Freelancers", value: ADMIN_FREELANCERS.length },
                    { label: "Active", value: totalActive },
                    { label: "Total Paid", value: formatCurrency(totalEarned) },
                    { label: "Avg. Rating", value: avgRating },
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
                            placeholder="Search freelancers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={streamFilter} onValueChange={setStreamFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Expertise" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Expertise</SelectItem>
                            {ADMIN_STREAMS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminFreelancer["status"] | "all")}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
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
                                {["Freelancer", "Expertise", "Completed", "Active", "Earned", "Rating", "Joined", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((fl) => (
                                <tr key={fl.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div>
                                            <p className="text-[13.5px] font-semibold text-gray-900 font-poppins">{fl.name}</p>
                                            <p className="text-[11.5px] text-gray-400 font-poppins mt-0.5">{fl.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {fl.expertise.map((e) => (
                                                <span key={e} className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10.5px] font-medium font-poppins whitespace-nowrap">{e}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-800 font-poppins tabular-nums">{fl.totalCompleted}</td>
                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins tabular-nums">{fl.activeAssignments}</td>
                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-700 font-poppins tabular-nums whitespace-nowrap">{formatCurrency(fl.totalEarned)}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-600 font-poppins">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            {fl.rating}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(fl.joinedAt)}</td>
                                    <td className="px-4 py-3.5"><StatusBadge status={fl.status} /></td>
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
                        <PenTool className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] font-medium text-gray-400 font-poppins">No freelancers found</p>
                        <p className="text-[12px] text-gray-300 font-poppins mt-1">Try adjusting your filters</p>
                    </div>
                )}

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {ADMIN_FREELANCERS.length} freelancers
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
