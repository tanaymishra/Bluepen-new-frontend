"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Copy,
    Check,
    Users,
    Gift,
    ArrowRight,
    Share2,
} from "lucide-react";
import { MOCK_REFERRAL_DATA } from "@/lib/static";

/* ────────────────────────────────────────── helpers */

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const STATUS_MAP = {
    pending: { label: "Invite Sent", color: "#6B7280", bg: "#F3F4F6" },
    signed_up: { label: "Signed Up", color: "#2956A8", bg: "#DCE6F7" },
    first_order: { label: "First Order", color: "#D97706", bg: "#FEF3C7" },
    rewarded: { label: "Rewarded", color: "#16A34A", bg: "#CFF4E7" },
} as const;

/* ────────────────────────────────────────── page */

export default function ReferralsPage() {
    const [copied, setCopied] = useState<"code" | "link" | null>(null);
    const data = MOCK_REFERRAL_DATA;

    const handleCopy = (text: string, type: "code" | "link") => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

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
                    Referrals
                </h1>
                <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                    Invite friends and earn rewards on every successful referral
                </p>
            </motion.div>

            {/* Invite Banner */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 }}
                className="bg-primary-dark rounded-2xl p-6 sm:p-8 mb-5 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.03] rounded-full blur-xl" />
                <div className="absolute bottom-0 right-8 w-24 h-24 bg-white/[0.02] rounded-full blur-lg" />

                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 mb-4">
                        <Gift className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[11px] font-semibold text-white/70 font-poppins uppercase tracking-wider">
                            Refer &amp; Earn
                        </span>
                    </div>
                    <h2 className="text-[20px] sm:text-[24px] font-bold text-white font-montserrat leading-tight mb-2">
                        Give 10%, Get 15%
                    </h2>
                    <p className="text-[13px] text-white/50 font-poppins leading-relaxed mb-5">
                        Your friend gets 10% off their first order, and you earn 15% credit
                        on your next assignment. Win-win!
                    </p>

                    {/* Referral Code */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-2 bg-white/[0.08] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
                            <span className="text-[14px] font-bold text-white font-montserrat tracking-wider flex-1">
                                {data.code}
                            </span>
                            <button
                                onClick={() => handleCopy(data.code, "code")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11.5px] font-semibold text-white/80 font-poppins transition-colors"
                            >
                                {copied === "code" ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                                {copied === "code" ? "Copied" : "Copy"}
                            </button>
                        </div>
                        <button
                            onClick={() => handleCopy(data.link, "link")}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-dark text-[13px] font-semibold font-poppins hover:bg-gray-50 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            {copied === "link" ? "Link Copied!" : "Share Link"}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Total Referred
                    </p>
                    <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        {data.totalReferred}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                        people invited
                    </p>
                </div>
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Successful
                    </p>
                    <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        {data.successfulReferrals}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                        completed &amp; rewarded
                    </p>
                </div>
                <div className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/[0.03] rounded-full blur-md" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                        Total Earned
                    </p>
                    <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                        ₹{data.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">
                        from referrals
                    </p>
                </div>
            </motion.div>

            {/* Referral List */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
            >
                <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">
                        Your Referrals
                    </p>
                </div>

                <div className="divide-y divide-gray-50/80">
                    {data.referrals.map((referral, i) => {
                        const status = STATUS_MAP[referral.status];
                        return (
                            <motion.div
                                key={referral.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.15, delay: i * 0.03 }}
                                className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/40 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/[0.06] flex items-center justify-center text-primary text-[12px] font-bold font-montserrat shrink-0">
                                    {referral.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13.5px] font-semibold text-gray-800 font-poppins truncate">
                                        {referral.name}
                                    </p>
                                    <p className="text-[11.5px] text-gray-400 font-poppins mt-0.5 truncate">
                                        {referral.email}
                                        <span className="text-gray-200 mx-1.5">|</span>
                                        Invited {formatDate(referral.invitedAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span
                                        className="px-2 py-[3px] rounded-md text-[10.5px] font-semibold font-poppins tracking-wide uppercase whitespace-nowrap"
                                        style={{ backgroundColor: status.bg, color: status.color }}
                                    >
                                        {status.label}
                                    </span>
                                    {referral.rewardAmount && (
                                        <span className="text-[13px] font-bold text-primary font-montserrat tabular-nums hidden sm:block">
                                            +₹{referral.rewardAmount}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.16 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mt-5"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    How It Works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                        { step: "1", title: "Share Your Code", desc: "Send your unique referral code or link to friends" },
                        { step: "2", title: "Friend Signs Up", desc: "They register on Bluepen and place their first order" },
                        { step: "3", title: "Both Get Rewarded", desc: "You earn 15% credit, they get 10% off their first order" },
                    ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/[0.07] flex items-center justify-center text-primary text-[12px] font-bold font-montserrat shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <p className="text-[13.5px] font-semibold text-gray-800 font-poppins mb-0.5">
                                    {item.title}
                                </p>
                                <p className="text-[12px] text-gray-400 font-poppins leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
