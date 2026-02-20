"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    X,
    Loader2,
} from "lucide-react";
import { useWallet, type WalletTx } from "@/hooks/wallet/useWallet";
import { useAuth } from "@/authentication/authentication";
import { useToast } from "@/context/toastContext";

/* ────────────────────────────────────────── helpers */

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function txDescription(tx: WalletTx): string {
    if (tx.description) return tx.description;
    switch (tx.reason) {
        case "wallet_topup":     return "Wallet Top-up";
        case "payment":          return tx.assignmentId ? `Payment for ${tx.assignmentId}` : "Assignment Payment";
        case "refund":           return tx.assignmentId ? `Refund — ${tx.assignmentId}` : "Refund";
        case "referral_bonus":   return "Referral Bonus";
        case "coupon_discount":  return "Coupon Discount";
        case "admin_adjustment": return "Account Adjustment";
        default:                 return "Transaction";
    }
}

function TransactionIcon({ tx }: { tx: WalletTx }) {
    if (tx.reason === "wallet_topup")
        return (
            <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-primary" />
            </div>
        );
    if (tx.type === "credit")
        return (
            <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-4 h-4 text-primary" />
            </div>
        );
    return (
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
    );
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];
type FilterKey = "all" | "topup" | "payment" | "refund";

/* ────────────────────────────────────────── Add Funds Modal */

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: (amount: number) => void;
    isProcessing: boolean;
    error: string | null;
}

function AddFundsModal({ isOpen, onClose, onProceed, isProcessing, error }: AddFundsModalProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [custom, setCustom] = useState("");

    const resolvedAmount = selected ?? (custom ? parseFloat(custom) : 0);
    const isValid = resolvedAmount >= 1 && resolvedAmount <= 100000;

    function handlePreset(amt: number) {
        setSelected(amt);
        setCustom("");
    }

    function handleCustom(val: string) {
        setCustom(val.replace(/[^0-9]/g, ""));
        setSelected(null);
    }

    function handleProceed() {
        if (!isValid) return;
        onProceed(resolvedAmount);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-[16px] font-bold text-gray-900 font-montserrat">Add Funds</p>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Preset chips */}
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                            Select Amount
                        </p>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {PRESET_AMOUNTS.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => handlePreset(amt)}
                                    className={cn(
                                        "py-2.5 rounded-xl text-[13px] font-semibold font-poppins border transition-all",
                                        selected === amt
                                            ? "bg-primary/[0.08] border-primary text-primary"
                                            : "border-gray-100 text-gray-600 hover:border-primary/40 hover:bg-primary/[0.03]"
                                    )}
                                >
                                    ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                                </button>
                            ))}
                        </div>

                        {/* Custom amount */}
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-2">
                            Or Enter Custom
                        </p>
                        <div className="relative mb-5">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] font-semibold font-poppins pointer-events-none">
                                ₹
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={custom}
                                onChange={(e) => handleCustom(e.target.value)}
                                className={cn(
                                    "w-full pl-8 pr-4 py-2.5 rounded-xl border text-[14px] font-semibold font-poppins text-gray-900 outline-none transition-all",
                                    custom
                                        ? "border-primary bg-primary/[0.03]"
                                        : "border-gray-100 bg-gray-50 focus:border-primary focus:bg-white"
                                )}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-[12px] text-red-500 font-poppins mb-4 -mt-2">{error}</p>
                        )}

                        {/* Proceed button */}
                        <button
                            onClick={handleProceed}
                            disabled={!isValid || isProcessing}
                            className={cn(
                                "w-full py-3 rounded-xl text-[13.5px] font-bold font-poppins flex items-center justify-center gap-2 transition-all",
                                isValid && !isProcessing
                                    ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Opening payment…
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    {isValid ? `Proceed to Pay ₹${resolvedAmount.toLocaleString()}` : "Proceed to Pay"}
                                </>
                            )}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ────────────────────────────────────────── page */

export default function WalletPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { balance, transactions, isLoading, error: walletError, isProcessing, openAddFundsFlow } = useWallet();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterKey>("all");

    const filtered = useMemo(() => {
        if (filter === "all")     return transactions;
        if (filter === "topup")   return transactions.filter((t) => t.reason === "wallet_topup");
        if (filter === "payment") return transactions.filter((t) => t.reason === "payment");
        if (filter === "refund")  return transactions.filter((t) => t.type === "credit" && t.reason !== "wallet_topup");
        return transactions;
    }, [filter, transactions]);

    const totalAdded = useMemo(
        () => transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0),
        [transactions],
    );

    const totalSpent = useMemo(
        () => transactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0),
        [transactions],
    );

    async function handleProceed(amount: number) {
        setModalError(null);
        try {
            await openAddFundsFlow(
                amount,
                (user as any)?.email ?? "",
                (user as any)?.name ?? "",
            );
            setModalOpen(false);
            showToast(`₹${amount.toLocaleString()} added to your wallet!`, "success");
        } catch (e: any) {
            const msg: string = e?.message ?? "Payment failed";
            if (msg !== "Payment cancelled") setModalError(msg);
        }
    }

    return (
        <>
            <AddFundsModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setModalError(null); }}
                onProceed={handleProceed}
                isProcessing={isProcessing}
                error={modalError}
            />

            <div className="max-w-[1140px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                >
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat">
                        Wallet
                    </h1>
                    <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                        Manage your balance and view transaction history
                    </p>
                </motion.div>

                {/* Balance Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.06 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
                >
                    {/* Main Balance */}
                    <div className="relative bg-primary-dark rounded-2xl p-6 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/[0.04] rounded-full blur-md" />
                        <Wallet className="w-5 h-5 text-white/40 mb-3" />
                        <p className="text-[11px] uppercase tracking-widest text-white/50 font-poppins font-semibold mb-2">
                            Available Balance
                        </p>
                        {isLoading ? (
                            <div className="h-9 w-24 bg-white/10 rounded-lg animate-pulse" />
                        ) : (
                            <p className="text-[32px] font-extrabold text-white font-montserrat leading-none tracking-tight">
                                ₹{balance.toLocaleString()}
                            </p>
                        )}
                        <button
                            onClick={() => { setModalError(null); setModalOpen(true); }}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[12.5px] font-semibold font-poppins transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Funds
                        </button>
                    </div>

                    {/* Total Added */}
                    <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                            Total Added
                        </p>
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
                        ) : (
                            <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                                ₹{totalAdded.toLocaleString()}
                            </p>
                        )}
                        <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                            top-ups &amp; refunds
                        </p>
                    </div>

                    {/* Total Spent */}
                    <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                            Total Spent
                        </p>
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
                        ) : (
                            <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                                ₹{totalSpent.toLocaleString()}
                            </p>
                        )}
                        <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                            across all assignments
                        </p>
                    </div>
                </motion.div>

                {/* Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12 }}
                    className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">
                            Transactions
                        </p>
                        <div className="flex items-center gap-1">
                            {(["all", "topup", "payment", "refund"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[11.5px] font-medium font-poppins capitalize transition-colors",
                                        filter === f
                                            ? "bg-primary/[0.07] text-primary"
                                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {f === "topup" ? "Top-up" : f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="divide-y divide-gray-50/80">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-5 sm:px-6 py-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3.5 w-40 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-3 w-28 bg-gray-50 rounded animate-pulse" />
                                    </div>
                                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error state */}
                    {!isLoading && walletError && (
                        <p className="text-center text-[13px] text-gray-400 font-poppins py-10">{walletError}</p>
                    )}

                    {/* Empty state */}
                    {!isLoading && !walletError && filtered.length === 0 && (
                        <p className="text-center text-[13px] text-gray-400 font-poppins py-10">No transactions yet.</p>
                    )}

                    {/* Transaction rows */}
                    {!isLoading && !walletError && (
                        <div className="divide-y divide-gray-50/80">
                            {filtered.map((txn, i) => (
                                <motion.div
                                    key={txn.id}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15, delay: i * 0.03 }}
                                    className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/40 transition-colors"
                                >
                                    <TransactionIcon tx={txn} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13.5px] font-semibold text-gray-800 font-poppins truncate">
                                            {txDescription(txn)}
                                        </p>
                                        <p className="text-[11.5px] text-gray-400 font-poppins mt-0.5">
                                            {formatDate(txn.date)} at {formatTime(txn.date)}
                                            {txn.assignmentId && (
                                                <>
                                                    <span className="text-gray-200 mx-1.5">|</span>
                                                    <Link
                                                        href={`/students/assignments/${txn.assignmentId}`}
                                                        className="text-primary hover:underline underline-offset-2"
                                                    >
                                                        {txn.assignmentId}
                                                    </Link>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <p
                                        className={cn(
                                            "text-[14px] font-bold font-montserrat tabular-nums shrink-0",
                                            txn.type === "credit" ? "text-primary" : "text-gray-700"
                                        )}
                                    >
                                        {txn.type === "credit" ? "+" : "-"}₹
                                        {txn.amount.toLocaleString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}

