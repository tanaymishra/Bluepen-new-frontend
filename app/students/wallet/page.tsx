"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
} from "lucide-react";
import { MOCK_WALLET, type WalletTransaction } from "@/lib/static";

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

function TransactionIcon({ type }: { type: WalletTransaction["type"] }) {
    if (type === "topup")
        return (
            <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-primary" />
            </div>
        );
    if (type === "refund")
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

/* ────────────────────────────────────────── page */

export default function WalletPage() {
    const [filter, setFilter] = useState<"all" | "payment" | "topup" | "refund">("all");

    const filtered = useMemo(() => {
        if (filter === "all") return MOCK_WALLET.transactions;
        return MOCK_WALLET.transactions.filter((t) => t.type === filter);
    }, [filter]);

    const totalSpent = MOCK_WALLET.transactions
        .filter((t) => t.type === "payment")
        .reduce((s, t) => s + Math.abs(t.amount), 0);

    const totalAdded = MOCK_WALLET.transactions
        .filter((t) => t.type === "topup" || t.type === "refund")
        .reduce((s, t) => s + t.amount, 0);

    return (
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
                    <p className="text-[32px] font-extrabold text-white font-montserrat leading-none tracking-tight">
                        ₹{MOCK_WALLET.balance.toLocaleString()}
                    </p>
                    <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[12.5px] font-semibold font-poppins transition-colors">
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
                    <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        ₹{totalAdded.toLocaleString()}
                    </p>
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
                    <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        ₹{totalSpent.toLocaleString()}
                    </p>
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
                        {(["all", "payment", "topup", "refund"] as const).map((f) => (
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

                <div className="divide-y divide-gray-50/80">
                    {filtered.map((txn, i) => (
                        <motion.div
                            key={txn.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, delay: i * 0.03 }}
                            className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/40 transition-colors"
                        >
                            <TransactionIcon type={txn.type} />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13.5px] font-semibold text-gray-800 font-poppins truncate">
                                    {txn.description}
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
                                    txn.amount > 0 ? "text-primary" : "text-gray-700"
                                )}
                            >
                                {txn.amount > 0 ? "+" : ""}₹
                                {Math.abs(txn.amount).toLocaleString()}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
