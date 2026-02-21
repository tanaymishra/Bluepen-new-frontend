"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/context/toastContext";
import {
    ChevronLeft,
    Loader2,
    Mail,
    Phone,
    GraduationCap,
    BookOpen,
    Calendar,
    Copy,
    Check,
    Plus,
    Minus,
    X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ── Types ── */
interface StudentProfile {
    uuid: string; fullName: string; email: string; phone: string | null;
    university: string | null; course: string | null; isActive: boolean;
    createdAt: string; referralCode: string | null;
}
interface WalletInfo { balance: number; currency: string }
interface Stats { totalAssignments: number; activeAssignments: number; totalSpent: number; totalCredits: number; totalReferred: number }
interface Transaction { uuid: string; type: "credit" | "debit"; reason: string; amount: number; balanceAfter: number; paymentRef: string | null; note: string | null; createdAt: string }
interface Assignment { uuid: string; title: string; subject: string | null; deadline: string; budget: number | null; status: string; createdAt: string; freelancerName: string | null }

/* ── Helpers ── */
function formatCurrency(n: number) { return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 }); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
function formatDateTime(iso: string) { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

function reasonLabel(r: string) {
    const m: Record<string, string> = { payment: "Payment", refund: "Refund", referral_bonus: "Referral Bonus", coupon_discount: "Coupon Discount", wallet_topup: "Wallet Top-up", admin_adjustment: "Admin Adjustment" };
    return m[r] ?? r;
}

const STATUS_CLS: Record<string, string> = {
    open: "bg-sky-50 text-sky-700",
    assigned: "bg-amber-50 text-amber-700",
    in_progress: "bg-violet-50 text-violet-700",
    submitted: "bg-indigo-50 text-indigo-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-gray-100 text-gray-500",
};

/* ──────────────────────────────────────── */

export default function StudentProfilePage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { uuid } = useParams() as { uuid: string };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [student, setStudent] = useState<StudentProfile | null>(null);
    const [wallet, setWallet] = useState<WalletInfo>({ balance: 0, currency: "INR" });
    const [stats, setStats] = useState<Stats>({ totalAssignments: 0, activeAssignments: 0, totalSpent: 0, totalCredits: 0, totalReferred: 0 });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [tab, setTab] = useState<"assignments" | "wallet">("assignments");
    const [copiedCode, setCopiedCode] = useState(false);

    /* ── Wallet adjust ── */
    const [showAdjust, setShowAdjust] = useState(false);
    const [adjustType, setAdjustType] = useState<"credit" | "debit">("credit");
    const [adjustAmount, setAdjustAmount] = useState("");
    const [adjustNote, setAdjustNote] = useState("");
    const [adjusting, setAdjusting] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API}/api/admin/students/${uuid}`, { credentials: "include" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Failed to load");
            setStudent(data.data.student);
            setWallet(data.data.wallet);
            setStats(data.data.stats);
            setTransactions(data.data.transactions);
            setAssignments(data.data.assignments);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (uuid) fetchProfile(); }, [uuid]);

    const copyCode = async () => {
        if (!student?.referralCode) return;
        await navigator.clipboard.writeText(student.referralCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleAdjust = async () => {
        const amt = parseFloat(adjustAmount);
        if (!amt || amt <= 0) { showToast("Enter a valid amount", "error"); return; }
        setAdjusting(true);
        try {
            const res = await fetch(`${API}/api/admin/students/${uuid}/wallet/adjust`, {
                method: "POST", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: adjustType, amount: amt, note: adjustNote || undefined }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Failed");
            showToast(data.message, "success");
            setShowAdjust(false); setAdjustAmount(""); setAdjustNote("");
            setLoading(true); await fetchProfile();
        } catch (e: unknown) {
            showToast(e instanceof Error ? e.message : "Failed", "error");
        } finally { setAdjusting(false); }
    };

    if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-7 h-7 text-primary animate-spin" /></div>;
    if (error || !student) return (
        <div className="max-w-[900px] mx-auto text-center py-20">
            <p className="text-[14px] font-medium text-red-400 font-poppins">{error || "Student not found"}</p>
            <Button variant="outline" onClick={() => router.back()} className="mt-4">Go back</Button>
        </div>
    );

    return (
        <div className="max-w-[1000px] mx-auto">
            {/* Back + Title */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors group mb-2">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />back to students
                </button>
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-1">Student Profile</p>
            </motion.div>

            {/* ═══ Profile Card ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-5"
            >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[18px] font-montserrat shrink-0">
                        {student.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 font-montserrat">{student.fullName}</h1>
                            <span className={cn(
                                "inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins",
                                student.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                            )}>
                                {student.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-2 text-[13px] text-gray-500 font-poppins">
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{student.email}</span>
                            {student.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{student.phone}</span>}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[12.5px] text-gray-400 font-poppins">
                            {student.university && <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{student.university}</span>}
                            {student.course && <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{student.course}</span>}
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {formatDate(student.createdAt)}</span>
                        </div>

                        {student.referralCode && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-primary-light/50 rounded-lg px-3 py-1.5">
                                <span className="text-[12px] text-primary/80 font-poppins font-medium">Referral:</span>
                                <span className="text-[13px] text-primary font-mono font-semibold">{student.referralCode}</span>
                                <button onClick={copyCode} className="p-0.5 hover:bg-primary/10 rounded transition-colors">
                                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-primary/50" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ═══ Stat Cards ═══ — same pattern as students list page */}
            <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}
                className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5"
            >
                {[
                    { label: "Wallet Balance", value: formatCurrency(wallet.balance) },
                    { label: "Total Spent", value: formatCurrency(stats.totalSpent) },
                    { label: "Credits Received", value: formatCurrency(stats.totalCredits) },
                    { label: "Assignments", value: `${stats.totalAssignments}`, sub: stats.activeAssignments > 0 ? `${stats.activeAssignments} active` : null },
                    { label: "Referrals Made", value: `${stats.totalReferred}` },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-3.5 sm:p-4">
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-poppins font-medium mb-1">{stat.label}</p>
                        <p className="text-[18px] sm:text-[20px] font-bold text-gray-900 font-montserrat">{stat.value}</p>
                        {stat.sub && <p className="text-[11px] text-primary font-poppins font-medium mt-0.5">{stat.sub}</p>}
                    </div>
                ))}
            </motion.div>

            {/* ═══ Tab Switcher + Actions ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"
            >
                <div className="flex gap-1 bg-white rounded-xl border border-gray-100/80 p-1 w-fit">
                    {(["assignments", "wallet"] as const).map((t) => (
                        <button key={t} onClick={() => setTab(t)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-[13px] font-poppins font-medium transition-all",
                                tab === t ? "bg-primary/[0.07] text-primary" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {t === "assignments" ? `Assignments (${stats.totalAssignments})` : `Wallet (${transactions.length})`}
                        </button>
                    ))}
                </div>

                {tab === "wallet" && (
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => { setAdjustType("credit"); setShowAdjust(true); }}>
                            <Plus className="w-4 h-4 mr-1.5" />Add Balance
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setAdjustType("debit"); setShowAdjust(true); }}>
                            <Minus className="w-4 h-4 mr-1.5" />Deduct
                        </Button>
                    </div>
                )}
            </motion.div>

            {/* ════════════════ ASSIGNMENTS TAB ════════════════ */}
            {tab === "assignments" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {assignments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100/80 text-center py-16">
                            <GraduationCap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-[14px] font-medium text-gray-400 font-poppins">No assignments yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile cards */}
                            <div className="block lg:hidden space-y-3">
                                {assignments.map((a, i) => (
                                    <motion.div key={a.uuid}
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.03 }}
                                        className="bg-white rounded-xl border border-gray-100/80 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <p className="text-[14px] font-semibold text-gray-900 font-poppins">{a.title}</p>
                                            <span className={cn("shrink-0 px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins capitalize", STATUS_CLS[a.status] ?? "bg-gray-100 text-gray-600")}>{a.status.replace("_", " ")}</span>
                                        </div>
                                        {a.subject && <p className="text-[12px] text-gray-400 font-poppins mb-2">{a.subject}</p>}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px] font-poppins">
                                            <div><p className="text-gray-400 text-[10.5px] mb-0.5">Deadline</p><p className="text-gray-700 font-medium">{formatDate(a.deadline)}</p></div>
                                            <div><p className="text-gray-400 text-[10.5px] mb-0.5">Budget</p><p className="text-gray-700 font-medium">{a.budget ? formatCurrency(a.budget) : "—"}</p></div>
                                            <div><p className="text-gray-400 text-[10.5px] mb-0.5">Freelancer</p><p className="text-gray-700 font-medium">{a.freelancerName ?? "—"}</p></div>
                                            <div><p className="text-gray-400 text-[10.5px] mb-0.5">Created</p><p className="text-gray-700 font-medium">{formatDate(a.createdAt)}</p></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead><tr className="border-b border-gray-100">
                                            {["Title", "Subject", "Deadline", "Budget", "Freelancer", "Status", "Created"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {assignments.map((a) => (
                                                <tr key={a.uuid} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3.5"><p className="text-[13.5px] font-semibold text-gray-900 font-poppins max-w-[240px] truncate">{a.title}</p></td>
                                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins">{a.subject ?? "—"}</td>
                                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(a.deadline)}</td>
                                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-700 font-poppins tabular-nums whitespace-nowrap">{a.budget ? formatCurrency(a.budget) : "—"}</td>
                                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins">{a.freelancerName ?? <span className="text-gray-300">Unassigned</span>}</td>
                                                    <td className="px-4 py-3.5"><span className={cn("px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins capitalize", STATUS_CLS[a.status] ?? "bg-gray-100 text-gray-600")}>{a.status.replace("_", " ")}</span></td>
                                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">{formatDate(a.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                                    <p className="text-[12px] text-gray-400 font-poppins">Showing <span className="font-semibold text-gray-600">{assignments.length}</span> assignment{assignments.length !== 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* ════════════════ WALLET TAB ════════════════ */}
            {tab === "wallet" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {transactions.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100/80 text-center py-16">
                            <p className="text-[14px] font-medium text-gray-400 font-poppins">No transactions yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile */}
                            <div className="block lg:hidden space-y-2.5">
                                {transactions.map((tx, i) => (
                                    <motion.div key={tx.uuid}
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                                        className="bg-white rounded-xl border border-gray-100/80 p-4 flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-semibold text-gray-800 font-poppins">{reasonLabel(tx.reason)}</p>
                                            <p className="text-[11px] text-gray-400 font-poppins mt-0.5">{formatDateTime(tx.createdAt)}</p>
                                            {tx.note && <p className="text-[11px] text-gray-400 font-poppins mt-0.5 truncate">{tx.note}</p>}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className={cn("text-[14px] font-bold font-montserrat tabular-nums", tx.type === "credit" ? "text-emerald-600" : "text-red-500")}>
                                                {tx.type === "credit" ? "+" : "−"}{formatCurrency(tx.amount)}
                                            </p>
                                            <p className="text-[10.5px] text-gray-400 font-poppins tabular-nums">Bal: {formatCurrency(tx.balanceAfter)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Desktop */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead><tr className="border-b border-gray-100">
                                            {["Description", "Type", "Amount", "Balance After", "Note", "Reference", "Date"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {transactions.map((tx) => (
                                                <tr key={tx.uuid} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-800 font-poppins">{reasonLabel(tx.reason)}</td>
                                                    <td className="px-4 py-3.5">
                                                        <span className={cn("inline-flex items-center px-2.5 py-[3px] rounded-full text-[11px] font-semibold font-poppins",
                                                            tx.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                                        )}>{tx.type}</span>
                                                    </td>
                                                    <td className={cn("px-4 py-3.5 text-[14px] font-bold font-montserrat tabular-nums whitespace-nowrap",
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
                                    <p className="text-[12px] text-gray-400 font-poppins">Showing <span className="font-semibold text-gray-600">{transactions.length}</span> transaction{transactions.length !== 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* ═══ Wallet Adjustment Modal ═══ */}
            {showAdjust && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAdjust(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}
                        className="relative bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-[440px] p-5 sm:p-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[18px] font-bold text-gray-900 font-montserrat">
                                {adjustType === "credit" ? "Add Balance" : "Deduct Balance"}
                            </h2>
                            <button onClick={() => setShowAdjust(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-primary-light/40 rounded-xl p-4 mb-5">
                            <p className="text-[12px] text-gray-500 font-poppins">
                                {adjustType === "credit" ? "Adding to" : "Deducting from"} <span className="font-semibold text-gray-700">{student.fullName}</span>
                            </p>
                            <p className="text-[20px] font-bold text-gray-900 font-montserrat tabular-nums mt-0.5">Current: {formatCurrency(wallet.balance)}</p>
                        </div>

                        {/* Toggle */}
                        <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-4">
                            <button onClick={() => setAdjustType("credit")}
                                className={cn("flex-1 py-2 rounded-lg text-[13px] font-poppins font-medium transition-all",
                                    adjustType === "credit" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}>Add Balance</button>
                            <button onClick={() => setAdjustType("debit")}
                                className={cn("flex-1 py-2 rounded-lg text-[13px] font-poppins font-medium transition-all",
                                    adjustType === "debit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}>Deduct</button>
                        </div>

                        <div className="space-y-4 mb-5">
                            <div className="space-y-1.5">
                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Amount (₹)</Label>
                                <Input type="number" min="1" step="0.01" placeholder="0.00" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} autoFocus />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Note <span className="text-gray-400 font-normal">(optional)</span></Label>
                                <Input placeholder="e.g. Refund for assignment #42" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                            <Button onClick={handleAdjust} disabled={adjusting} className="flex-1 sm:flex-none">
                                {adjusting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : adjustType === "credit" ? <Plus className="w-4 h-4 mr-1.5" /> : <Minus className="w-4 h-4 mr-1.5" />}
                                {adjusting ? "Processing…" : adjustType === "credit" ? "Add Balance" : "Deduct Balance"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAdjust(false)} disabled={adjusting}>Cancel</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
