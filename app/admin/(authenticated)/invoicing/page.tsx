"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_INVOICES, type AdminInvoice } from "@/lib/static";
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
    Receipt,
    FileText,
    Calendar,
    IndianRupee,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

/* ─── Status Badge ─── */
function InvoiceStatusBadge({ status }: { status: AdminInvoice["status"] }) {
    const map: Record<AdminInvoice["status"], { bg: string; text: string; label: string }> = {
        pending: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending" },
        settled: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Settled" },
        partially_paid: { bg: "bg-blue-50", text: "text-blue-600", label: "Partial" },
        disputed: { bg: "bg-red-50", text: "text-red-500", label: "Disputed" },
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

export default function InvoicingPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AdminInvoice["status"] | "all">("all");

    const filtered = useMemo(() => {
        return ADMIN_INVOICES.filter((inv) => {
            const q = search.toLowerCase();
            const matchSearch = !q || inv.freelancerName.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q) || inv.freelancerEmail.toLowerCase().includes(q);
            const matchStatus = statusFilter === "all" || inv.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    const hasFilters = search || statusFilter !== "all";

    /* Stats */
    const totalPending = ADMIN_INVOICES.filter((i) => i.status === "pending" || i.status === "partially_paid").reduce((s, i) => s + i.totalAmount, 0);
    const totalSettled = ADMIN_INVOICES.filter((i) => i.status === "settled").reduce((s, i) => s + i.totalAmount, 0);

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-6"
            >
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-1">Finance</p>
                <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 font-montserrat">Invoices</h1>
            </motion.div>

            {/* Stat cards */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
            >
                {[
                    { label: "Total Invoices", value: ADMIN_INVOICES.length },
                    { label: "Pending", value: ADMIN_INVOICES.filter((i) => i.status === "pending").length },
                    { label: "Outstanding", value: formatCurrency(totalPending) },
                    { label: "Settled", value: formatCurrency(totalSettled) },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-3.5 sm:p-4">
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-poppins font-medium mb-1">{stat.label}</p>
                        <p className="text-[18px] sm:text-[20px] font-bold text-gray-900 font-montserrat">{stat.value}</p>
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
                <div className="flex flex-col gap-3">
                    <div className="flex-1">
                        <Input
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Search by freelancer or invoice ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminInvoice["status"] | "all")}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="settled">Settled</SelectItem>
                                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                                <SelectItem value="disputed">Disputed</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasFilters && (
                            <Button variant="outline" size="sm" onClick={resetFilters} className="shrink-0 w-full sm:w-auto">
                                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ═══ Mobile Card Layout ═══ */}
            <div className="block lg:hidden space-y-3">
                {filtered.map((inv, i) => (
                    <Link key={inv.id} href={`/admin/invoicing/${inv.id}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="bg-white rounded-xl border border-gray-100/80 p-4 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group"
                        >
                            {/* Top: Invoice ID + status */}
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-primary font-poppins">{inv.id}</p>
                                    <p className="text-[13.5px] font-semibold text-gray-900 font-poppins mt-0.5">{inv.freelancerName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <InvoiceStatusBadge status={inv.status} />
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] font-poppins">
                                <div>
                                    <p className="text-gray-400 text-[10.5px] mb-0.5">Items</p>
                                    <p className="text-gray-700 font-medium">{inv.lineItems.length} assignment{inv.lineItems.length > 1 ? "s" : ""}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10.5px] mb-0.5">Amount</p>
                                    <p className="text-gray-900 font-bold tabular-nums">{formatCurrency(inv.totalAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10.5px] mb-0.5">Raised</p>
                                    <p className="text-gray-600">{formatDate(inv.raisedAt)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10.5px] mb-0.5">Due</p>
                                    <p className="text-gray-600">{formatDate(inv.dueDate)}</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
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
                                {["Invoice", "Freelancer", "Items", "Amount", "Raised", "Due", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((inv) => (
                                <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-4 py-3.5">
                                        <Link href={`/admin/invoicing/${inv.id}`} className="text-[13px] font-bold text-primary font-poppins hover:underline">{inv.id}</Link>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="text-[13.5px] font-semibold text-gray-900 font-poppins">{inv.freelancerName}</p>
                                        <p className="text-[11.5px] text-gray-400 font-poppins mt-0.5">{inv.freelancerEmail}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins tabular-nums">{inv.lineItems.length}</td>
                                    <td className="px-4 py-3.5 text-[13.5px] font-bold text-gray-900 font-poppins tabular-nums whitespace-nowrap">{formatCurrency(inv.totalAmount)}</td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(inv.raisedAt)}</td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(inv.dueDate)}</td>
                                    <td className="px-4 py-3.5"><InvoiceStatusBadge status={inv.status} /></td>
                                    <td className="px-4 py-3.5">
                                        <Link href={`/admin/invoicing/${inv.id}`}>
                                            <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-3 py-1">
                                                View
                                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] font-medium text-gray-400 font-poppins">No invoices found</p>
                        <p className="text-[12px] text-gray-300 font-poppins mt-1">Try adjusting your filters</p>
                    </div>
                )}

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {ADMIN_INVOICES.length} invoices
                    </p>
                </div>
            </motion.div>

            {/* Mobile empty + count */}
            {filtered.length === 0 && (
                <div className="block lg:hidden text-center py-12">
                    <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-[14px] font-medium text-gray-400 font-poppins">No invoices found</p>
                    <p className="text-[12px] text-gray-300 font-poppins mt-1">Try adjusting your filters</p>
                </div>
            )}
            {filtered.length > 0 && (
                <div className="block lg:hidden mt-3 text-center">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {ADMIN_INVOICES.length} invoices
                    </p>
                </div>
            )}
        </div>
    );
}
