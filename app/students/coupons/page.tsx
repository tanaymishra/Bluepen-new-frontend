"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Ticket,
    Copy,
    Check,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { MOCK_COUPONS, type Coupon } from "@/lib/static";

/* ────────────────────────────────────────── helpers */

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function daysUntil(iso: string) {
    const diff = new Date(iso).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ────────────────────────────────────────── coupon card */

function CouponCard({ coupon, index }: { coupon: Coupon; index: number }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const isActive = coupon.status === "active";
    const isUsed = coupon.status === "used";
    const remaining = daysUntil(coupon.validUntil);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className={cn(
                "relative bg-white rounded-2xl border overflow-hidden transition-shadow",
                isActive
                    ? "border-gray-100/80 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
                    : "border-gray-100/60 opacity-65"
            )}
        >
            {/* Dashed separator + notches */}
            <div className="absolute left-0 right-0 top-[88px] flex items-center pointer-events-none">
                <div className="w-3.5 h-7 bg-[#F5F7FA] rounded-r-full -ml-px" />
                <div className="flex-1 border-t border-dashed border-gray-200" />
                <div className="w-3.5 h-7 bg-[#F5F7FA] rounded-l-full -mr-px" />
            </div>

            {/* Top section */}
            <div className="p-5 pb-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[22px] font-extrabold text-primary font-montserrat">
                                {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}%`
                                    : `₹${coupon.discountValue}`}
                            </span>
                            <span className="text-[12px] text-gray-400 font-poppins font-medium uppercase">
                                OFF
                            </span>
                        </div>
                        <p className="text-[13px] text-gray-600 font-poppins leading-snug">
                            {coupon.description}
                        </p>
                    </div>
                    {isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-md text-[10.5px] font-semibold font-poppins tracking-wide uppercase bg-[#CFF4E7] text-[#16A34A] shrink-0">
                            Active
                        </span>
                    )}
                    {isUsed && (
                        <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-md text-[10.5px] font-semibold font-poppins tracking-wide uppercase bg-gray-100 text-gray-500 shrink-0">
                            Used
                        </span>
                    )}
                    {coupon.status === "expired" && (
                        <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-md text-[10.5px] font-semibold font-poppins tracking-wide uppercase bg-red-50 text-red-400 shrink-0">
                            Expired
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom section */}
            <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex-1 min-w-0">
                        <Ticket className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-[13px] font-bold text-gray-700 font-montserrat tracking-wider truncate">
                            {coupon.code}
                        </span>
                    </div>
                    {isActive ? (
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold font-poppins hover:bg-primary-dark transition-colors shrink-0"
                        >
                            {copied ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    ) : (
                        <div className="w-[76px]" />
                    )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] text-gray-400 font-poppins">
                    {coupon.minOrderValue && (
                        <span>Min order: ₹{coupon.minOrderValue.toLocaleString()}</span>
                    )}
                    {coupon.maxDiscount && (
                        <span>Max discount: ₹{coupon.maxDiscount.toLocaleString()}</span>
                    )}
                    {isActive && remaining > 0 && (
                        <span className="text-primary font-medium">
                            {remaining}d remaining
                        </span>
                    )}
                    {isUsed && coupon.usedAt && (
                        <span>Used on {formatDate(coupon.usedAt)}</span>
                    )}
                    {coupon.status === "expired" && (
                        <span>Expired {formatDate(coupon.validUntil)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ────────────────────────────────────────── page */

export default function CouponsPage() {
    const [filter, setFilter] = useState<"all" | "active" | "used" | "expired">("all");

    const filtered = useMemo(() => {
        if (filter === "all") return MOCK_COUPONS;
        return MOCK_COUPONS.filter((c) => c.status === filter);
    }, [filter]);

    const activeCoupons = MOCK_COUPONS.filter((c) => c.status === "active").length;

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
                    Coupons
                </h1>
                <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                    {activeCoupons} active coupon{activeCoupons !== 1 ? "s" : ""} available
                </p>
            </motion.div>

            {/* Filter */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="flex items-center gap-2 mb-5"
            >
                {(["all", "active", "used", "expired"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium font-poppins capitalize transition-all border",
                            filter === f
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        {f === "active" && <CheckCircle className="w-3.5 h-3.5" />}
                        {f === "used" && <Clock className="w-3.5 h-3.5" />}
                        {f === "expired" && <XCircle className="w-3.5 h-3.5" />}
                        {f}
                    </button>
                ))}
            </motion.div>

            {/* Coupon Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((coupon, i) => (
                        <CouponCard key={coupon.id} coupon={coupon} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-gray-100/80">
                    <Ticket className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-[14px] font-medium text-gray-500 font-poppins mb-1">
                        No coupons found
                    </p>
                    <p className="text-[12.5px] text-gray-400 font-poppins">
                        {filter !== "all"
                            ? `No ${filter} coupons right now`
                            : "Check back later for new offers"}
                    </p>
                </div>
            )}
        </div>
    );
}
