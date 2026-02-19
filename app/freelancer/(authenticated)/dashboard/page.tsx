"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/authentication/authentication";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────── */
/*  Mock data                                                  */
/* ─────────────────────────────────────────────────────────── */

interface FreelancerAssignment {
    id: string;
    title: string;
    subject: string;
    score: number | null;
    status: "completed" | "in_progress" | "pending" | "revision";
    deadline: string;
}

const MOCK: FreelancerAssignment[] = [
    { id: "FRL-001", title: "Marketing Strategy Report", subject: "Business", score: 88, status: "completed", deadline: "2026-01-10" },
    { id: "FRL-002", title: "Financial Analysis Case Study", subject: "Finance", score: 74, status: "completed", deadline: "2026-01-18" },
    { id: "FRL-003", title: "Literature Review on AI in Healthcare", subject: "Healthcare", score: 92, status: "completed", deadline: "2026-01-28" },
    { id: "FRL-004", title: "Data Structures Assignment", subject: "Computer Science", score: 65, status: "completed", deadline: "2026-02-05" },
    { id: "FRL-005", title: "Environmental Science Essay", subject: "Science", score: 81, status: "completed", deadline: "2026-02-08" },
    { id: "FRL-006", title: "Human Resource Management Report", subject: "Management", score: 55, status: "completed", deadline: "2026-02-11" },
    { id: "FRL-007", title: "Constitutional Law Dissertation", subject: "Law", score: 78, status: "completed", deadline: "2026-02-14" },
    { id: "FRL-008", title: "Psychology Research Paper", subject: "Psychology", score: null, status: "in_progress", deadline: "2026-02-25" },
    { id: "FRL-009", title: "Economics Supply-Demand Analysis", subject: "Economics", score: null, status: "pending", deadline: "2026-02-28" },
    { id: "FRL-010", title: "Network Security Audit Report", subject: "IT", score: null, status: "revision", deadline: "2026-03-03" },
];

/* ─────────────────────────────────────────────────────────── */
/*  Reward tiers                                               */
/* ─────────────────────────────────────────────────────────── */

type TierKey = "bronze" | "silver" | "gold" | "platinum";

interface Tier {
    key: TierKey;
    label: string;
    min: number;
    max: number | null;
    color: string;
    mutedColor: string;
    perks: string[];
}

const TIERS: Tier[] = [
    {
        key: "bronze",
        label: "Bronze",
        min: 0,
        max: 9,
        color: "#b8762a",
        mutedColor: "#fdf4e8",
        perks: ["Standard assignment access", "Basic support"],
    },
    {
        key: "silver",
        label: "Silver",
        min: 10,
        max: 24,
        color: "#6b7f96",
        mutedColor: "#eef1f5",
        perks: ["Priority assignment queue", "Faster payout cycles", "Silver recognition"],
    },
    {
        key: "gold",
        label: "Gold",
        min: 25,
        max: 49,
        color: "#b07d0e",
        mutedColor: "#fdf8e3",
        perks: ["Premium assignment pool", "Dedicated project manager", "Bonus incentives"],
    },
    {
        key: "platinum",
        label: "Platinum",
        min: 50,
        max: null,
        color: "#5b21b6",
        mutedColor: "#f2f0fb",
        perks: ["Exclusive high-value projects", "Top-tier payout rates", "Platinum status"],
    },
];

function getTier(completed: number): Tier {
    return [...TIERS].reverse().find((t) => completed >= t.min) ?? TIERS[0];
}

function getNextTier(t: Tier): Tier | null {
    const i = TIERS.indexOf(t);
    return TIERS[i + 1] ?? null;
}

/*  */
/*  Score buckets                                              */
/*  */

const BUCKETS = [
    { label: "< 50",   min: 0,  max: 49,  color: "#f87171" },
    { label: "50–64",  min: 50, max: 64,  color: "#fb923c" },
    { label: "65–74",  min: 65, max: 74,  color: "#fbbf24" },
    { label: "75–84",  min: 75, max: 84,  color: "#34d399" },
    { label: "85–100", min: 85, max: 100, color: "#60a5fa" },
];

function buildBuckets(data: FreelancerAssignment[]) {
    return BUCKETS.map((b) => ({
        ...b,
        count: data.filter(
            (a) => a.score !== null && a.score >= b.min && a.score <= b.max
        ).length,
    }));
}

/*  */
/*  Helpers                                                    */
/*  */

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function formatDeadline(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}

const STATUS_MAP: Record<
    FreelancerAssignment["status"],
    { label: string; color: string; bg: string }
> = {
    completed:   { label: "Completed",   color: "#059669", bg: "#ecfdf5" },
    in_progress: { label: "In Progress", color: "#2563eb", bg: "#eff6ff" },
    pending:     { label: "Pending",     color: "#d97706", bg: "#fffbeb" },
    revision:    { label: "Revision",    color: "#dc2626", bg: "#fef2f2" },
};

/*  */
/*  Main page                                                  */
/*  */

export default function FreelancerDashboard() {
    const { user, isHydrated } = useAuth();
    const firstName = isHydrated && user?.firstname ? user.firstname : "there";

    const stats = useMemo(() => {
        const total     = MOCK.length;
        const completed = MOCK.filter((a) => a.status === "completed").length;
        const pending   = MOCK.filter((a) => a.status === "pending" || a.status === "revision").length;
        const active    = MOCK.filter((a) => a.status === "in_progress").length;
        const graded    = MOCK.filter((a) => a.score !== null);
        const avgScore  = graded.length
            ? Math.round(graded.reduce((s, a) => s + (a.score as number), 0) / graded.length)
            : 0;
        const rate = total ? Math.round((completed / total) * 100) : 0;
        return { total, completed, pending, active, avgScore, rate };
    }, []);

    const buckets  = useMemo(() => buildBuckets(MOCK), []);
    const maxCount = Math.max(...buckets.map((b) => b.count), 1);

    const tier     = getTier(stats.completed);
    const nextTier = getNextTier(tier);
    const progress = nextTier
        ? Math.min(((stats.completed - tier.min) / (nextTier.min - tier.min)) * 100, 100)
        : 100;

    const recent = MOCK.slice(0, 5);

    return (
        <div className="max-w-[1100px] mx-auto">

            {/*  Greeting  */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <p className="text-[12px] text-gray-400 font-poppins mb-0.5">
                    {new Date().toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat leading-tight">
                    {getGreeting()},{" "}
                    <span className="text-primary">{firstName}</span>
                </h1>
            </motion.div>

            {/*  Stats row  */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
            >
                {([
                    { label: "Total Assigned",     value: stats.total,     sub: "assignments" },
                    { label: "Completed",           value: stats.completed, sub: `${stats.rate}% completion rate`, showBar: true },
                    { label: "Pending / Revision",  value: stats.pending,   sub: "needs attention" },
                    { label: "In Progress",         value: stats.active,    sub: "active right now" },
                ] as const).map((card) => (
                    <div
                        key={card.label}
                        className="relative bg-white rounded-2xl border border-gray-100/80 p-5 overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow"
                    >
                        <div className="absolute -top-5 -right-5 w-20 h-20 bg-primary/[0.025] rounded-full blur-md" />
                        <p className="text-[10.5px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">
                            {card.label}
                        </p>
                        <p className="text-[32px] font-extrabold text-gray-900 font-montserrat leading-none tracking-tight">
                            {card.value}
                        </p>
                        <p className="text-[11.5px] text-gray-400 font-poppins mt-1.5">{card.sub}</p>
                        {"showBar" in card && card.showBar && (
                            <div className="mt-3">
                                <div className="h-[4px] bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-700"
                                        style={{ width: `${stats.rate}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </motion.div>

            {/*  Chart + Reward  */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

                {/* Marks distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 }}
                    className="lg:col-span-3 bg-white rounded-2xl border border-gray-100/80 p-6"
                >
                    <div className="flex items-start justify-between mb-7">
                        <div>
                            <p className="text-[10.5px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1">
                                Performance
                            </p>
                            <h2 className="text-[15px] font-bold text-gray-900 font-montserrat">
                                Marks Distribution
                            </h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[28px] font-extrabold text-gray-900 font-montserrat leading-none">
                                {stats.avgScore}
                                <span className="text-[14px] font-semibold text-gray-400 ml-0.5">/100</span>
                            </p>
                            <p className="text-[11px] text-gray-400 font-poppins mt-0.5">avg score</p>
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div className="flex items-end gap-3 h-[110px]">
                        {buckets.map((b) => {
                            const pct = (b.count / maxCount) * 100;
                            return (
                                <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
                                    <p className={cn(
                                        "text-[11px] font-semibold font-poppins h-[16px]",
                                        b.count > 0 ? "text-gray-700" : "text-transparent"
                                    )}>
                                        {b.count}
                                    </p>
                                    <div className="w-full bg-gray-100 rounded-md relative" style={{ height: 72 }}>
                                        <motion.div
                                            className="w-full rounded-md absolute bottom-0"
                                            style={{ backgroundColor: b.color }}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.max(pct, b.count > 0 ? 8 : 0)}%` }}
                                            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-poppins whitespace-nowrap">
                                        {b.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Reward level */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.16 }}
                    className="lg:col-span-2 bg-white rounded-2xl border border-gray-100/80 p-6 flex flex-col"
                >
                    <p className="text-[10.5px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1">
                        Reward Level
                    </p>
                    <h2 className="text-[15px] font-bold text-gray-900 font-montserrat mb-5">
                        Your Tier
                    </h2>

                    {/* Active tier badge */}
                    <div
                        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5"
                        style={{ backgroundColor: tier.mutedColor }}
                    >
                        <div
                            className="w-[3px] h-8 rounded-full shrink-0"
                            style={{ backgroundColor: tier.color }}
                        />
                        <div>
                            <p
                                className="text-[18px] font-bold font-montserrat leading-tight"
                                style={{ color: tier.color }}
                            >
                                {tier.label}
                            </p>
                            <p className="text-[11px] text-gray-500 font-poppins">
                                {stats.completed} assignment{stats.completed !== 1 ? "s" : ""} completed
                            </p>
                        </div>
                    </div>

                    {/* Perks */}
                    <ul className="space-y-2 mb-5 flex-1">
                        {tier.perks.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-[12px] font-poppins text-gray-600">
                                <span
                                    className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: tier.color }}
                                />
                                {p}
                            </li>
                        ))}
                    </ul>

                    {/* Progress to next */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[11px] text-gray-400 font-poppins">
                                {nextTier
                                    ? `${nextTier.min - stats.completed} more to reach ${nextTier.label}`
                                    : "Highest tier reached"}
                            </p>
                            <p className="text-[11px] font-semibold font-poppins" style={{ color: tier.color }}>
                                {Math.round(progress)}%
                            </p>
                        </div>
                        <div className="h-[4px] w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: tier.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>

                        {/* Tier steps */}
                        <div className="flex items-center justify-between mt-4">
                            {TIERS.map((t) => {
                                const isActive = t.key === tier.key;
                                const isPast   = TIERS.indexOf(tier) > TIERS.indexOf(t);
                                return (
                                    <div key={t.key} className="flex flex-col items-center gap-1.5">
                                        <div
                                            className={cn(
                                                "w-2 h-2 rounded-full",
                                                isActive && "ring-2 ring-offset-2"
                                            )}
                                            style={{
                                                backgroundColor: isPast || isActive ? t.color : "#e5e7eb",
                                                // @ts-ignore
                                                "--tw-ring-color": t.color,
                                            }}
                                        />
                                        <p
                                            className="text-[9px] font-semibold font-poppins"
                                            style={{
                                                color: isActive ? t.color : isPast ? "#9ca3af" : "#d1d5db",
                                            }}
                                        >
                                            {t.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/*  Recent assignments  */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-[14px] font-bold text-gray-900 font-montserrat">
                        Recent Assignments
                    </h2>
                    <p className="text-[12px] text-gray-400 font-poppins">
                        {MOCK.length} total
                    </p>
                </div>

                {/* Column headers */}
                <div className="hidden md:grid grid-cols-[1fr_120px_80px_80px] gap-4 px-6 py-2.5 text-[10px] uppercase tracking-widest text-gray-400 font-poppins font-semibold bg-gray-50/60 border-b border-gray-100">
                    <span>Assignment</span>
                    <span>Subject</span>
                    <span className="text-center">Score</span>
                    <span className="text-right">Deadline</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-50">
                    {recent.map((a, i) => {
                        const st = STATUS_MAP[a.status];
                        return (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: 0.22 + i * 0.04 }}
                                className="grid grid-cols-1 md:grid-cols-[1fr_120px_80px_80px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/40 transition-colors"
                            >
                                {/* Title + id */}
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-800 font-poppins truncate">
                                        {a.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10.5px] text-gray-400 font-mono">{a.id}</span>
                                        <span
                                            className="text-[10px] font-semibold px-1.5 py-[2px] rounded-md font-poppins md:hidden"
                                            style={{ backgroundColor: st.bg, color: st.color }}
                                        >
                                            {st.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Subject */}
                                <p className="hidden md:block text-[12.5px] text-gray-500 font-poppins truncate">
                                    {a.subject}
                                </p>

                                {/* Score */}
                                <div className="hidden md:flex items-center justify-center">
                                    {a.score !== null ? (
                                        <span
                                            className={cn(
                                                "text-[13px] font-bold font-montserrat",
                                                a.score >= 75
                                                    ? "text-emerald-600"
                                                    : a.score >= 55
                                                    ? "text-amber-600"
                                                    : "text-red-500"
                                            )}
                                        >
                                            {a.score}
                                        </span>
                                    ) : (
                                        <span
                                            className="text-[10px] font-semibold px-2 py-[3px] rounded-md font-poppins"
                                            style={{ backgroundColor: st.bg, color: st.color }}
                                        >
                                            {st.label}
                                        </span>
                                    )}
                                </div>

                                {/* Deadline */}
                                <p className="hidden md:block text-[12px] text-gray-400 font-poppins text-right">
                                    {formatDeadline(a.deadline)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-50 px-6 py-3 flex items-center justify-between">
                    <p className="text-[11.5px] text-gray-400 font-poppins">
                        Showing {recent.length} of {MOCK.length} assignments
                    </p>
                    <button className="inline-flex items-center gap-1 text-[12px] text-primary font-medium font-poppins hover:underline underline-offset-2 transition-colors">
                        View all
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
