"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ADMIN_INVOICES,
    ADMIN_ASSIGNMENTS,
    type AdminInvoice,
    type InvoiceLineItem,
} from "@/lib/static";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft,
    Printer,
    Check,
    X,
    Plus,
    Trash2,
    Search,
    Receipt,
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    IndianRupee,
} from "lucide-react";

/* ─── Helpers ─── */
function formatCurrency(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDateLong(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/* ─── Status badge (invoice-level) ─── */
function StatusPill({ status }: { status: AdminInvoice["status"] }) {
    const map: Record<
        AdminInvoice["status"],
        { bg: string; text: string; icon: React.ElementType; label: string }
    > = {
        pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock, label: "Pending" },
        settled: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: CheckCircle2, label: "Settled" },
        partially_paid: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: IndianRupee, label: "Partially Paid" },
        disputed: { bg: "bg-red-50 border-red-200", text: "text-red-600", icon: AlertTriangle, label: "Disputed" },
    };
    const s = map[status];
    const Icon = s.icon;
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold font-poppins border", s.bg, s.text)}>
            <Icon className="w-3.5 h-3.5" />
            {s.label}
        </span>
    );
}

/* ══════════════════════════════════════ */

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const invoiceBase = ADMIN_INVOICES.find((inv) => inv.id === id);

    /* Local mutable state — simulate editable invoice */
    const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(invoiceBase?.lineItems ?? []);
    const [status, setStatus] = useState<AdminInvoice["status"]>(invoiceBase?.status ?? "pending");
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [addSearch, setAddSearch] = useState("");
    const [settleConfirm, setSettleConfirm] = useState(false);

    const total = useMemo(() => lineItems.reduce((s, li) => s + li.amount, 0), [lineItems]);

    /* Assignments by this freelancer that aren't already in the invoice */
    const availableAssignments = useMemo(() => {
        if (!invoiceBase) return [];
        const existing = new Set(lineItems.map((li) => li.assignmentId));
        return ADMIN_ASSIGNMENTS.filter(
            (a) =>
                a.freelancerName === invoiceBase.freelancerName &&
                !existing.has(a.id)
        );
    }, [invoiceBase, lineItems]);

    const filteredAvailable = useMemo(() => {
        const q = addSearch.toLowerCase();
        if (!q) return availableAssignments;
        return availableAssignments.filter(
            (a) => a.title.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
        );
    }, [availableAssignments, addSearch]);

    if (!invoiceBase) {
        return (
            <div className="max-w-[800px] mx-auto text-center py-20">
                <Receipt className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-[16px] font-medium text-gray-400 font-poppins">Invoice not found</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/invoicing")}>
                    Back to Invoices
                </Button>
            </div>
        );
    }

    const handleRemoveItem = (assignmentId: string) => {
        setLineItems((prev) => prev.filter((li) => li.assignmentId !== assignmentId));
    };

    const handleAddItem = (asg: (typeof ADMIN_ASSIGNMENTS)[number]) => {
        const newItem: InvoiceLineItem = {
            assignmentId: asg.id,
            title: asg.title,
            completionDate: asg.deadline,
            amount: asg.freelancerAmount,
        };
        setLineItems((prev) => [...prev, newItem]);
    };

    const handleSettle = () => {
        setStatus("settled");
        setSettleConfirm(false);
    };

    return (
        <div className="max-w-[860px] mx-auto pb-12">
            {/* Back */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <button
                    onClick={() => router.push("/admin/invoicing")}
                    className="inline-flex items-center gap-1 text-[13px] text-primary hover:text-primary/80 font-poppins font-medium transition-colors group mb-4"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Invoices
                </button>
            </motion.div>

            {/* ═══════════════════════════════════════════
                INVOICE DOCUMENT — PDF-like styling
               ═══════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden print:shadow-none print:border-0 print:rounded-none"
            >
                {/* ─── Top colored band ─── */}
                <div className="h-2 bg-gradient-to-r from-[#012551] via-[#2956A8] to-[#4A7FD7]" />

                {/* ─── Header row ─── */}
                <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Left: brand */}
                        <div>
                            <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight font-montserrat" style={{ color: "#012551" }}>
                                BLUE<span style={{ color: "#2956A8" }}>PEN</span>
                            </h2>
                            <p className="text-[11px] text-gray-400 font-poppins mt-0.5 uppercase tracking-wider">Academic Writing Solutions</p>
                        </div>
                        {/* Right: invoice meta */}
                        <div className="text-left sm:text-right">
                            <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-1">Invoice</p>
                            <p className="text-[20px] sm:text-[22px] font-bold text-gray-900 font-montserrat">{invoiceBase.id}</p>
                            <StatusPill status={status} />
                        </div>
                    </div>
                </div>

                {/* ─── Addresses row ─── */}
                <div className="px-6 sm:px-10 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-dashed border-gray-200">
                    {/* From */}
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-poppins font-bold mb-2">From</p>
                        <p className="text-[14px] font-bold text-gray-900 font-poppins">Bluepen Pvt. Ltd.</p>
                        <p className="text-[12px] text-gray-500 font-poppins leading-relaxed mt-1">
                            Noida, Uttar Pradesh, India<br />
                            admin@bluepen.co.in
                        </p>
                    </div>
                    {/* To */}
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-poppins font-bold mb-2">To — Writer</p>
                        <p className="text-[14px] font-bold text-gray-900 font-poppins">{invoiceBase.freelancerName}</p>
                        <p className="text-[12px] text-gray-500 font-poppins leading-relaxed mt-1">
                            {invoiceBase.freelancerEmail}<br />
                            ID: {invoiceBase.freelancerId}
                        </p>
                    </div>
                </div>

                {/* ─── Dates row ─── */}
                <div className="px-6 sm:px-10 py-4 flex flex-wrap gap-x-8 gap-y-2 text-[12px] font-poppins border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <span className="text-gray-400 mr-1.5">Invoice Date:</span>
                        <span className="text-gray-700 font-semibold">{formatDateLong(invoiceBase.raisedAt)}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 mr-1.5">Due Date:</span>
                        <span className="text-gray-700 font-semibold">{formatDateLong(invoiceBase.dueDate)}</span>
                    </div>
                    {status === "settled" && invoiceBase.settledAt && (
                        <div>
                            <span className="text-gray-400 mr-1.5">Settled On:</span>
                            <span className="text-emerald-600 font-semibold">{formatDateLong(invoiceBase.settledAt)}</span>
                        </div>
                    )}
                </div>

                {/* ─── Line Items Table ─── */}
                <div className="px-6 sm:px-10 py-6">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-poppins font-bold mb-4">Assignment Details</p>

                    {/* Desktop table */}
                    <div className="hidden sm:block">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-900">
                                    <th className="text-left pb-2.5 text-[11px] uppercase tracking-wider text-gray-500 font-poppins font-bold w-[80px]">#</th>
                                    <th className="text-left pb-2.5 text-[11px] uppercase tracking-wider text-gray-500 font-poppins font-bold">Assignment</th>
                                    <th className="text-left pb-2.5 text-[11px] uppercase tracking-wider text-gray-500 font-poppins font-bold w-[120px]">Completed</th>
                                    <th className="text-right pb-2.5 text-[11px] uppercase tracking-wider text-gray-500 font-poppins font-bold w-[110px]">Amount</th>
                                    <th className="w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((li, idx) => (
                                    <tr key={li.assignmentId} className="border-b border-gray-100 last:border-0">
                                        <td className="py-3.5 text-[12px] text-gray-400 font-poppins tabular-nums">{String(idx + 1).padStart(2, "0")}</td>
                                        <td className="py-3.5">
                                            <p className="text-[12.5px] font-semibold text-gray-800 font-poppins leading-snug">{li.title}</p>
                                            <p className="text-[11px] text-gray-400 font-poppins mt-0.5">{li.assignmentId}</p>
                                        </td>
                                        <td className="py-3.5 text-[12px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(li.completionDate)}</td>
                                        <td className="py-3.5 text-right text-[13px] font-semibold text-gray-800 font-poppins tabular-nums">{formatCurrency(li.amount)}</td>
                                        <td className="py-3.5 text-center">
                                            {status !== "settled" && (
                                                <button
                                                    onClick={() => handleRemoveItem(li.assignmentId)}
                                                    className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Remove from invoice"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {lineItems.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-[13px] text-gray-400 font-poppins">No line items — add assignments below</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked */}
                    <div className="block sm:hidden space-y-3">
                        {lineItems.map((li, idx) => (
                            <div key={li.assignmentId} className="rounded-lg border border-gray-100 p-3.5 relative">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 font-poppins mb-0.5">{li.assignmentId}</p>
                                        <p className="text-[12.5px] font-semibold text-gray-800 font-poppins leading-snug">{li.title}</p>
                                    </div>
                                    {status !== "settled" && (
                                        <button
                                            onClick={() => handleRemoveItem(li.assignmentId)}
                                            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                    <span className="text-[11px] text-gray-400 font-poppins">{formatDate(li.completionDate)}</span>
                                    <span className="text-[13px] font-bold text-gray-800 font-poppins tabular-nums">{formatCurrency(li.amount)}</span>
                                </div>
                            </div>
                        ))}
                        {lineItems.length === 0 && (
                            <p className="py-6 text-center text-[13px] text-gray-400 font-poppins">No items</p>
                        )}
                    </div>
                </div>

                {/* ─── Total bar ─── */}
                <div className="mx-6 sm:mx-10 border-t-2 border-gray-900" />
                <div className="px-6 sm:px-10 py-4 flex items-center justify-between">
                    <p className="text-[12px] uppercase tracking-wider text-gray-500 font-poppins font-bold">Total Payable</p>
                    <p className="text-[22px] sm:text-[26px] font-extrabold font-montserrat tabular-nums" style={{ color: "#012551" }}>
                        {formatCurrency(total)}
                    </p>
                </div>

                {/* ─── Notes ─── */}
                {invoiceBase.notes && (
                    <div className="px-6 sm:px-10 pb-4">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-poppins font-bold mb-1">Notes</p>
                        <p className="text-[12px] text-gray-500 font-poppins italic">{invoiceBase.notes}</p>
                    </div>
                )}

                {/* ─── Action bar ─── */}
                {status !== "settled" && (
                    <div className="px-6 sm:px-10 py-5 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {!settleConfirm ? (
                            <>
                                <Button
                                    onClick={() => setSettleConfirm(true)}
                                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled={lineItems.length === 0}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    Settle Invoice
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddPanel(!showAddPanel)}
                                    className="flex-1 sm:flex-none"
                                >
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    {showAddPanel ? "Hide" : "Add / Remove Assignments"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.print()}
                                    className="flex-1 sm:flex-none print:hidden"
                                >
                                    <Printer className="w-4 h-4 mr-1.5" />
                                    Print
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 w-full">
                                <p className="text-[13px] font-medium text-gray-700 font-poppins flex-1">
                                    Confirm settlement of <span className="font-bold text-emerald-600">{formatCurrency(total)}</span>?
                                </p>
                                <Button
                                    onClick={handleSettle}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    size="sm"
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Yes, Settle
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setSettleConfirm(false)}>
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {status === "settled" && (
                    <div className="px-6 sm:px-10 py-5 border-t border-gray-100 bg-emerald-50/50 flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <p className="text-[13px] font-medium text-emerald-700 font-poppins">
                                This invoice has been settled{invoiceBase.settledAt ? ` on ${formatDateLong(invoiceBase.settledAt)}` : ""}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="w-full sm:w-auto print:hidden"
                        >
                            <Printer className="w-4 h-4 mr-1.5" />
                            Print
                        </Button>
                    </div>
                )}

                {/* ─── Bottom brand ─── */}
                <div className="px-6 sm:px-10 py-4 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-300 font-poppins">
                        This is a computer-generated invoice. No signature required.
                    </p>
                </div>

                {/* ─── Bottom band ─── */}
                <div className="h-1.5 bg-gradient-to-r from-[#012551] via-[#2956A8] to-[#4A7FD7]" />
            </motion.div>

            {/* ═════════════════════════════════════════════
                ADD / REMOVE ASSIGNMENTS PANEL
               ═════════════════════════════════════════════ */}
            <AnimatePresence>
                {showAddPanel && status !== "settled" && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden print:hidden"
                    >
                        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[14px] font-bold text-gray-900 font-poppins">
                                    Assignments by {invoiceBase.freelancerName}
                                </p>
                                <p className="text-[11.5px] text-gray-400 font-poppins mt-0.5">
                                    Add or remove assignments from this invoice
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAddPanel(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-5 sm:px-6 py-3 border-b border-gray-50">
                            <Input
                                icon={<Search className="w-4 h-4" />}
                                placeholder="Search assignments..."
                                value={addSearch}
                                onChange={(e) => setAddSearch(e.target.value)}
                            />
                        </div>

                        {/* Available list */}
                        <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
                            {filteredAvailable.length === 0 && (
                                <div className="py-10 text-center">
                                    <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-[13px] text-gray-400 font-poppins">
                                        {availableAssignments.length === 0
                                            ? "All assignments are already in this invoice"
                                            : "No matching assignments"}
                                    </p>
                                </div>
                            )}
                            {filteredAvailable.map((asg) => (
                                <div
                                    key={asg.id}
                                    className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12.5px] font-semibold text-gray-800 font-poppins truncate">{asg.title}</p>
                                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-400 font-poppins">
                                            <span>{asg.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{asg.stream}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="font-semibold text-gray-600 tabular-nums">{formatCurrency(asg.freelancerAmount)}</span>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAddItem(asg)}
                                        className="shrink-0 text-[11px] px-3 py-1 border-primary/30 text-primary hover:bg-primary/5"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
