"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
    Users,
    PenTool,
    Mail,
    Loader2,
    ChevronRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ─── Types ─── */
interface Freelancer {
    uuid: string;
    fullName: string | null;
    email: string;
    phone: string | null;
    specialisations: string[];
    status: "pending" | "under_review" | "approved" | "rejected" | "suspended";
    currentStep: number;
    createdAt: string;
    emailVerified: boolean;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: Freelancer["status"] }) {
    const map: Record<string, { bg: string; text: string; label: string }> = {
        pending: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending" },
        under_review: { bg: "bg-blue-50", text: "text-blue-600", label: "Under Review" },
        approved: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Approved" },
        rejected: { bg: "bg-red-50", text: "text-red-500", label: "Rejected" },
        suspended: { bg: "bg-gray-100", text: "text-gray-500", label: "Suspended" },
    };
    const s = map[status] ?? map.pending;
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins",
                s.bg,
                s.text
            )}
        >
            {s.label}
        </span>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/* ────────────────────────────────────── */

export default function AdminFreelancersPage() {
    const router = useRouter();
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const res = await fetch(`${API}/api/admin/freelancers`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch freelancers");
                const data = await res.json();
                setFreelancers(data.data ?? []);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Failed to load");
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancers();
    }, []);

    const filtered = useMemo(() => {
        return freelancers.filter((f) => {
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                (f.fullName ?? "").toLowerCase().includes(q) ||
                f.email.toLowerCase().includes(q) ||
                f.uuid.toLowerCase().includes(q);
            const matchStatus =
                statusFilter === "all" || f.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter, freelancers]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };
    const hasFilters = search || statusFilter !== "all";

    /* Stats */
    const totalPending = freelancers.filter(
        (f) => f.status === "pending" || f.status === "under_review"
    ).length;
    const totalApproved = freelancers.filter(
        (f) => f.status === "approved"
    ).length;

    const goToDetail = (uuid: string) => {
        router.push(`/admin/freelancers/${uuid}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

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
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-1">
                        People
                    </p>
                    <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 font-montserrat">
                        Freelancers
                    </h1>
                </div>
            </motion.div>

            {/* Stat cards */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
            >
                {[
                    { label: "Total Applications", value: freelancers.length },
                    { label: "Pending Review", value: totalPending },
                    { label: "Approved", value: totalApproved },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-gray-100 p-3.5 sm:p-4"
                    >
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-poppins font-medium mb-1">
                            {stat.label}
                        </p>
                        <p className="text-[18px] sm:text-[20px] font-bold text-gray-900 font-montserrat">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-3 sm:p-4 mb-5"
            >
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">
                                Under Review
                            </SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="shrink-0"
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Reset
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 text-[13px] text-red-600 font-poppins">
                    {error}
                </div>
            )}

            {/* ═══ Mobile Card Layout ═══ */}
            <div className="block lg:hidden space-y-3">
                {filtered.map((fl, i) => (
                    <motion.div
                        key={fl.uuid}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="bg-white rounded-xl border border-gray-100/80 p-4 cursor-pointer hover:border-primary/20 transition-colors"
                        onClick={() => goToDetail(fl.uuid)}
                    >
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="min-w-0">
                                <p className="text-[14px] font-semibold text-gray-900 font-poppins truncate">
                                    {fl.fullName || "—"}
                                </p>
                                <p className="text-[11.5px] text-gray-400 font-poppins truncate mt-0.5">
                                    {fl.email}
                                </p>
                            </div>
                            <StatusBadge status={fl.status} />
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {(fl.specialisations ?? []).slice(0, 3).map((s) => (
                                <span
                                    key={s}
                                    className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10.5px] font-medium font-poppins"
                                >
                                    {s}
                                </span>
                            ))}
                            {(fl.specialisations ?? []).length > 3 && (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 text-[10.5px] font-medium font-poppins">
                                    +{fl.specialisations.length - 3}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] font-poppins">
                            <div>
                                <p className="text-gray-400 text-[10.5px] mb-0.5">
                                    Step
                                </p>
                                <p className="text-gray-800 font-semibold">
                                    {fl.currentStep} / 4
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10.5px] mb-0.5">
                                    Applied
                                </p>
                                <p className="text-gray-700">
                                    {formatDate(fl.createdAt)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ═══ Desktop Table ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="hidden lg:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {[
                                    "Applicant",
                                    "Specialisations",
                                    "Step",
                                    "Email Verified",
                                    "Applied",
                                    "Status",
                                    "",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((fl) => (
                                <tr
                                    key={fl.uuid}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                    onClick={() => goToDetail(fl.uuid)}
                                >
                                    <td className="px-4 py-3.5">
                                        <div>
                                            <p className="text-[13.5px] font-semibold text-gray-900 font-poppins">
                                                {fl.fullName || "—"}
                                            </p>
                                            <p className="text-[11.5px] text-gray-400 font-poppins mt-0.5 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {fl.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                                            {(fl.specialisations ?? [])
                                                .slice(0, 2)
                                                .map((s) => (
                                                    <span
                                                        key={s}
                                                        className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10.5px] font-medium font-poppins whitespace-nowrap"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            {(fl.specialisations ?? [])
                                                .length > 2 && (
                                                    <span className="inline-block px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 text-[10.5px] font-medium font-poppins">
                                                        +
                                                        {fl.specialisations
                                                            .length - 2}
                                                    </span>
                                                )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] text-gray-700 font-poppins tabular-nums">
                                        {fl.currentStep}/4
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className={cn(
                                                "text-[12px] font-poppins font-medium",
                                                fl.emailVerified
                                                    ? "text-emerald-500"
                                                    : "text-gray-400"
                                            )}
                                        >
                                            {fl.emailVerified ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">
                                        {formatDate(fl.createdAt)}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={fl.status} />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <PenTool className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] font-medium text-gray-400 font-poppins">
                            No freelancers found
                        </p>
                        <p className="text-[12px] text-gray-300 font-poppins mt-1">
                            {freelancers.length === 0
                                ? "No applications yet"
                                : "Try adjusting your filters"}
                        </p>
                    </div>
                )}

                {filtered.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                        <p className="text-[12px] text-gray-400 font-poppins">
                            Showing{" "}
                            <span className="font-semibold text-gray-600">
                                {filtered.length}
                            </span>{" "}
                            of {freelancers.length} applications
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Mobile empty + count */}
            {filtered.length === 0 && (
                <div className="block lg:hidden text-center py-12">
                    <PenTool className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-[14px] font-medium text-gray-400 font-poppins">
                        No freelancers found
                    </p>
                </div>
            )}
            {filtered.length > 0 && (
                <div className="block lg:hidden mt-3 text-center">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing{" "}
                        <span className="font-semibold text-gray-600">
                            {filtered.length}
                        </span>{" "}
                        of {freelancers.length} applications
                    </p>
                </div>
            )}
        </div>
    );
}
