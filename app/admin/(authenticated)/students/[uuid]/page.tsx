"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    Loader2,
    Mail,
    Phone,
    GraduationCap,
    BookOpen,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Users,
    Copy,
    Check,
    FileText,
    Clock,
    IndianRupee,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ── Types ── */
interface StudentProfile {
    uuid: string;
    fullName: string;
    email: string;
    phone: string | null;
    university: string | null;
    course: string | null;
    profilePicture: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    referralCode: string | null;
}

interface WalletInfo {
    balance: number;
    currency: string;
}

interface Stats {
    totalAssignments: number;
    activeAssignments: number;
    totalSpent: number;
    totalCredits: number;
    totalReferred: number;
}

interface Transaction {
    uuid: string;
    type: "credit" | "debit";
    reason: string;
    amount: number;
    balanceAfter: number;
    paymentRef: string | null;
    note: string | null;
    createdAt: string;
}

interface Assignment {
    uuid: string;
    title: string;
    description: string | null;
    subject: string | null;
    deadline: string;
    budget: number | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    freelancerName: string | null;
}

/* ── Helpers ── */
function formatCurrency(n: number) {
    return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function reasonLabel(reason: string): string {
    const map: Record<string, string> = {
        payment: "Assignment Payment",
        refund: "Refund",
        referral_bonus: "Referral Bonus",
        coupon_discount: "Coupon Discount",
        wallet_topup: "Wallet Top-up",
        admin_adjustment: "Admin Adjustment",
    };
    return map[reason] ?? reason;
}

const statusColors: Record<string, { bg: string; text: string }> = {
    open: { bg: "bg-blue-50", text: "text-blue-600" },
    assigned: { bg: "bg-amber-50", text: "text-amber-600" },
    in_progress: { bg: "bg-purple-50", text: "text-purple-600" },
    submitted: { bg: "bg-indigo-50", text: "text-indigo-600" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-600" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-500" },
};

function StatusBadge({ status }: { status: string }) {
    const c = statusColors[status] ?? { bg: "bg-gray-100", text: "text-gray-600" };
    return (
        <span className={cn("inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins capitalize", c.bg, c.text)}>
            {status.replace("_", " ")}
        </span>
    );
}

/* ──────────────────────────────────────── */

export default function StudentProfilePage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params.uuid as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [wallet, setWallet] = useState<WalletInfo>({ balance: 0, currency: "INR" });
    const [stats, setStats] = useState<Stats>({ totalAssignments: 0, activeAssignments: 0, totalSpent: 0, totalCredits: 0, totalReferred: 0 });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [activeTab, setActiveTab] = useState<"assignments" | "wallet">("assignments");
    const [copiedCode, setCopiedCode] = useState(false);

    useEffect(() => {
        if (!uuid) return;
        const load = async () => {
            try {
                const res = await fetch(`${API}/api/admin/students/${uuid}`, { credentials: "include" });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message ?? "Failed to load student");
                setStudent(data.data.student);
                setWallet(data.data.wallet);
                setStats(data.data.stats);
                setTransactions(data.data.transactions);
                setAssignments(data.data.assignments);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Failed to load student");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [uuid]);

    const copyReferralCode = async () => {
        if (!student?.referralCode) return;
        await navigator.clipboard.writeText(student.referralCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
        );
    }

    /* ── Error ── */
    if (error || !student) {
        return (
            <div className="max-w-[900px] mx-auto text-center py-20">
                <p className="text-[14px] font-medium text-red-400 font-poppins">{error || "Student not found"}</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4">Go back</Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1 text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors group mb-3"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    back to students
                </button>
            </motion.div>

            {/* ═══ Profile Card ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-5"
            >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-[22px] font-montserrat shrink-0">
                        {student.fullName.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat">{student.fullName}</h1>
                            <span className={cn(
                                "inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins",
                                student.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                            )}>
                                {student.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-2 text-[13px] text-gray-500 font-poppins">
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{student.email}</span>
                            {student.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{student.phone}</span>}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1.5 text-[12.5px] text-gray-400 font-poppins">
                            {student.university && <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{student.university}</span>}
                            {student.course && <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{student.course}</span>}
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {formatDate(student.createdAt)}</span>
                        </div>

                        {/* Referral Code */}
                        {student.referralCode && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-1.5">
                                <span className="text-[12px] text-primary/70 font-poppins font-medium">Referral:</span>
                                <span className="text-[13px] text-primary font-mono font-semibold">{student.referralCode}</span>
                                <button onClick={copyReferralCode} className="p-0.5 hover:bg-primary/10 rounded transition-colors">
                                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-primary/50" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ═══ Stats Grid ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5"
            >
                {[
                    { label: "Wallet Balance", value: formatCurrency(wallet.balance), icon: Wallet, color: "text-emerald-500" },
                    { label: "Total Spent", value: formatCurrency(stats.totalSpent), icon: IndianRupee, color: "text-red-400" },
                    { label: "Total Credits", value: formatCurrency(stats.totalCredits), icon: ArrowDownLeft, color: "text-blue-500" },
                    { label: "Assignments", value: `${stats.totalAssignments} (${stats.activeAssignments} active)`, icon: FileText, color: "text-purple-500" },
                    { label: "Referred", value: String(stats.totalReferred), icon: Users, color: "text-amber-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-3.5">
                        <div className="flex items-center gap-2 mb-1.5">
                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                            <p className="text-[10.5px] text-gray-400 font-poppins font-medium">{stat.label}</p>
                        </div>
                        <p className="text-[16px] font-bold text-gray-900 font-montserrat">{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            {/* ═══ Tabs ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}
                className="mb-4"
            >
                <div className="flex gap-1 bg-gray-100/60 rounded-xl p-1 w-fit">
                    {(["assignments", "wallet"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-[13px] font-poppins font-medium transition-all capitalize",
                                activeTab === tab
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab === "assignments" ? `Assignments (${stats.totalAssignments})` : `Wallet Statement (${transactions.length})`}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* ═══ Assignments Tab ═══ */}
            {activeTab === "assignments" && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    {assignments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100/80 text-center py-16">
                            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-[14px] font-medium text-gray-400 font-poppins">No assignments yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile cards */}
                            <div className="block lg:hidden space-y-3">
                                {assignments.map((a) => (
                                    <div key={a.uuid} className="bg-white rounded-xl border border-gray-100/80 p-4">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-[14px] font-semibold text-gray-900 font-poppins">{a.title}</h3>
                                            <StatusBadge status={a.status} />
                                        </div>
                                        {a.subject && <p className="text-[12px] text-gray-400 font-poppins mb-2">{a.subject}</p>}
                                        <div className="grid grid-cols-2 gap-2 text-[12px] font-poppins">
                                            <div>
                                                <p className="text-gray-400 text-[10.5px]">Deadline</p>
                                                <p className="text-gray-700 font-medium">{formatDate(a.deadline)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-[10.5px]">Budget</p>
                                                <p className="text-gray-700 font-medium">{a.budget ? formatCurrency(a.budget) : "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-[10.5px]">Freelancer</p>
                                                <p className="text-gray-700 font-medium">{a.freelancerName ?? "Unassigned"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-[10.5px]">Created</p>
                                                <p className="text-gray-700 font-medium">{formatDate(a.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {["Title", "Subject", "Deadline", "Budget", "Freelancer", "Status", "Created"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.map((a) => (
                                                <tr key={a.uuid} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <p className="text-[13px] font-semibold text-gray-900 font-poppins max-w-[240px] truncate">{a.title}</p>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins">{a.subject ?? "—"}</td>
                                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-600 font-poppins whitespace-nowrap">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" />{formatDate(a.deadline)}</span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-700 font-poppins tabular-nums whitespace-nowrap">{a.budget ? formatCurrency(a.budget) : "—"}</td>
                                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins">{a.freelancerName ?? <span className="text-gray-300">Unassigned</span>}</td>
                                                    <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(a.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                                    <p className="text-[12px] text-gray-400 font-poppins">{assignments.length} assignment{assignments.length !== 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* ═══ Wallet Statement Tab ═══ */}
            {activeTab === "wallet" && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                >
                    {transactions.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100/80 text-center py-16">
                            <Wallet className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-[14px] font-medium text-gray-400 font-poppins">No transactions yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile cards */}
                            <div className="block lg:hidden space-y-2.5">
                                {transactions.map((tx) => (
                                    <div key={tx.uuid} className="bg-white rounded-xl border border-gray-100/80 p-4">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-7 h-7 rounded-lg flex items-center justify-center",
                                                    tx.type === "credit" ? "bg-emerald-50" : "bg-red-50"
                                                )}>
                                                    {tx.type === "credit"
                                                        ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                                                        : <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-gray-800 font-poppins">{reasonLabel(tx.reason)}</p>
                                                    <p className="text-[11px] text-gray-400 font-poppins">{formatDateTime(tx.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "text-[14px] font-bold font-montserrat tabular-nums",
                                                    tx.type === "credit" ? "text-emerald-600" : "text-red-500"
                                                )}>
                                                    {tx.type === "credit" ? "+" : "−"}{formatCurrency(tx.amount)}
                                                </p>
                                                <p className="text-[10.5px] text-gray-400 font-poppins">Bal: {formatCurrency(tx.balanceAfter)}</p>
                                            </div>
                                        </div>
                                        {tx.note && <p className="text-[11.5px] text-gray-400 font-poppins mt-1 pl-9">{tx.note}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {["", "Type", "Amount", "Balance After", "Note", "Reference", "Date"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((tx) => (
                                                <tr key={tx.uuid} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <div className={cn(
                                                            "w-7 h-7 rounded-lg flex items-center justify-center",
                                                            tx.type === "credit" ? "bg-emerald-50" : "bg-red-50"
                                                        )}>
                                                            {tx.type === "credit"
                                                                ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                                                                : <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <p className="text-[13px] font-semibold text-gray-800 font-poppins">{reasonLabel(tx.reason)}</p>
                                                        <p className="text-[11px] text-gray-400 font-poppins capitalize">{tx.type}</p>
                                                    </td>
                                                    <td className={cn(
                                                        "px-4 py-3.5 text-[14px] font-bold font-montserrat tabular-nums whitespace-nowrap",
                                                        tx.type === "credit" ? "text-emerald-600" : "text-red-500"
                                                    )}>
                                                        {tx.type === "credit" ? "+" : "−"}{formatCurrency(tx.amount)}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins tabular-nums whitespace-nowrap">{formatCurrency(tx.balanceAfter)}</td>
                                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins max-w-[200px] truncate">{tx.note ?? "—"}</td>
                                                    <td className="px-4 py-3.5 text-[12px] text-gray-400 font-mono">{tx.paymentRef ?? "—"}</td>
                                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDateTime(tx.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                                    <p className="text-[12px] text-gray-400 font-poppins">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
}
