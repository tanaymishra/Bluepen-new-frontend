"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_PMS, ADMIN_STREAMS, type AdminPM } from "@/lib/static";
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
    UserCog,
    UserRoundPlus,
    MoreVertical,
    Mail,
    Phone,
} from "lucide-react";
import Link from "next/link";

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: AdminPM["status"] }) {
    const map: Record<AdminPM["status"], { bg: string; text: string; label: string }> = {
        active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
        inactive: { bg: "bg-gray-100", text: "text-gray-500", label: "Inactive" },
    };
    const s = map[status];
    return (
        <span className={cn("inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins", s.bg, s.text)}>
            {s.label}
        </span>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ──────────────────────────────────────── */

export default function AdminPMsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AdminPM["status"] | "all">("all");

    const filtered = useMemo(() => {
        return ADMIN_PMS.filter((pm) => {
            const q = search.toLowerCase();
            const matchSearch = !q || pm.name.toLowerCase().includes(q) || pm.email.toLowerCase().includes(q) || pm.id.toLowerCase().includes(q);
            const matchStatus = statusFilter === "all" || pm.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    const hasFilters = search || statusFilter !== "all";

    const totalActive = ADMIN_PMS.filter((p) => p.status === "active").length;
    const totalManaged = ADMIN_PMS.reduce((sum, p) => sum + p.totalManaged, 0);

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
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 font-montserrat">Project Managers</h1>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/add-pm">
                        <UserRoundPlus className="w-4 h-4 mr-1.5" />
                        Add PM
                    </Link>
                </Button>
            </motion.div>

            {/* Stat cards */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
            >
                {[
                    { label: "Total PMs", value: ADMIN_PMS.length },
                    { label: "Active", value: totalActive },
                    { label: "Total Managed", value: totalManaged },
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
                            placeholder="Search PMs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminPM["status"] | "all")}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                                {["PM", "Contact", "Managed Streams", "Total Managed", "Active", "Joined", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((pm) => (
                                <tr key={pm.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[12px] font-bold font-montserrat shrink-0">
                                                {pm.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-[13.5px] font-semibold text-gray-900 font-poppins">{pm.name}</p>
                                                <p className="text-[11.5px] text-gray-400 font-poppins">{pm.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="space-y-0.5">
                                            <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5">
                                                <Mail className="w-3 h-3 text-gray-400" />{pm.email}
                                            </p>
                                            <p className="text-[12px] text-gray-500 font-poppins flex items-center gap-1.5">
                                                <Phone className="w-3 h-3 text-gray-400" />{pm.phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {pm.managedStreams.map((s) => (
                                                <span key={s} className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10.5px] font-medium font-poppins whitespace-nowrap">{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-800 font-poppins tabular-nums">{pm.totalManaged}</td>
                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins tabular-nums">{pm.activeAssignments}</td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(pm.joinedAt)}</td>
                                    <td className="px-4 py-3.5"><StatusBadge status={pm.status} /></td>
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
                        <UserCog className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] font-medium text-gray-400 font-poppins">No PMs found</p>
                        <p className="text-[12px] text-gray-300 font-poppins mt-1">Try adjusting your filters</p>
                    </div>
                )}

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {ADMIN_PMS.length} PMs
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
