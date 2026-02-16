"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ADMIN_COUPONS, type AdminCoupon } from "@/lib/static";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Search,
    RotateCcw,
    Ticket,
    Plus,
    Copy,
    MoreVertical,
    Percent,
    IndianRupee,
} from "lucide-react";

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: AdminCoupon["status"] }) {
    const map: Record<AdminCoupon["status"], { bg: string; text: string; label: string }> = {
        active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
        expired: { bg: "bg-gray-100", text: "text-gray-500", label: "Expired" },
        disabled: { bg: "bg-red-50", text: "text-red-500", label: "Disabled" },
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

export default function GenerateCouponsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<AdminCoupon["status"] | "all">("all");
    const [sheetOpen, setSheetOpen] = useState(false);

    /* New coupon form */
    const [newCode, setNewCode] = useState("");
    const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
    const [discountValue, setDiscountValue] = useState("");
    const [maxUses, setMaxUses] = useState("");
    const [minOrder, setMinOrder] = useState("");

    const filtered = useMemo(() => {
        return ADMIN_COUPONS.filter((c) => {
            const q = search.toLowerCase();
            const matchSearch = !q || c.code.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
            const matchStatus = statusFilter === "all" || c.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    const hasFilters = search || statusFilter !== "all";

    /* Stats */
    const activeCoupons = ADMIN_COUPONS.filter((c) => c.status === "active").length;
    const totalUsed = ADMIN_COUPONS.reduce((sum, c) => sum + c.usedCount, 0);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
    };

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
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-1">Finance</p>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 font-montserrat">Generate Coupons</h1>
                </div>
                <Button size="sm" onClick={() => setSheetOpen(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    New Coupon
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
                    { label: "Total Coupons", value: ADMIN_COUPONS.length },
                    { label: "Active", value: activeCoupons },
                    { label: "Total Redemptions", value: totalUsed },
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
                            placeholder="Search coupons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdminCoupon["status"] | "all")}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
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
                                {["Code", "Discount", "Usage", "Min Order", "Valid Period", "Status", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-gray-400 font-poppins font-semibold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((coupon) => (
                                <tr key={coupon.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 font-mono text-[13px] font-bold text-gray-800 tracking-wider">
                                                {coupon.code}
                                            </span>
                                            <button
                                                onClick={() => copyCode(coupon.code)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                                title="Copy code"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-800 font-poppins">
                                            {coupon.discountType === "percentage" ? (
                                                <><Percent className="w-3.5 h-3.5 text-primary" />{coupon.discountValue}%</>
                                            ) : (
                                                <><IndianRupee className="w-3.5 h-3.5 text-primary" />{coupon.discountValue}</>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="text-[13px] font-semibold text-gray-800 font-poppins tabular-nums">{coupon.usedCount}</span>
                                        <span className="text-[12px] text-gray-400 font-poppins">
                                            {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : " / ∞"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-[13px] text-gray-600 font-poppins tabular-nums whitespace-nowrap">
                                        {coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString("en-IN")}` : "None"}
                                    </td>
                                    <td className="px-4 py-3.5 text-[12.5px] text-gray-500 font-poppins whitespace-nowrap">
                                        {formatDate(coupon.validFrom)} – {formatDate(coupon.validUntil)}
                                    </td>
                                    <td className="px-4 py-3.5"><StatusBadge status={coupon.status} /></td>
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
                        <Ticket className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-[14px] font-medium text-gray-400 font-poppins">No coupons found</p>
                        <p className="text-[12px] text-gray-300 font-poppins mt-1">Try adjusting your filters</p>
                    </div>
                )}

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[12px] text-gray-400 font-poppins">
                        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of {ADMIN_COUPONS.length} coupons
                    </p>
                </div>
            </motion.div>

            {/* ─── Create Coupon Sheet ─── */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="w-[400px] sm:w-[440px]">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-[18px] font-bold font-montserrat text-gray-900">
                            Create Coupon
                        </SheetTitle>
                        <SheetDescription className="text-[13px] text-gray-400 font-poppins">
                            Generate a new discount coupon code
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Coupon Code</Label>
                            <Input placeholder="e.g. SUMMER25" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} className="font-mono tracking-wider" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Discount Type</Label>
                            <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "flat")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Discount Value</Label>
                            <Input type="number" placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 500"} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Max Uses</Label>
                                <Input type="number" placeholder="0 = unlimited" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Min Order (₹)</Label>
                                <Input type="number" placeholder="0" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <Button className="w-full" onClick={() => setSheetOpen(false)}>
                                <Ticket className="w-4 h-4 mr-1.5" />
                                Generate Coupon
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
