"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Search,
    TrendingUp,
    TrendingDown,
    FileText,
    GraduationCap,
    Gift,
    UserPlus,
    DollarSign,
    CheckCircle2,
    BarChart3,
    Users,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import {
    ADMIN_METRICS,
    ADMIN_WRITER_WORKLOADS,
    type MetricPeriod,
    type GrowthMetric,
} from "@/lib/static";

/* ────────── Helpers ────────── */

const periodLabels: Record<MetricPeriod, string> = {
    "1m": "1 Month",
    "6m": "6 Months",
    "1y": "1 Year",
};

const metricIcons: Record<string, React.ElementType> = {
    assignments: FileText,
    dissertations: GraduationCap,
    referrals: Gift,
    signups: UserPlus,
    revenue: DollarSign,
    completion_rate: CheckCircle2,
};

const metricColors: Record<string, { bar: string; bg: string; text: string }> = {
    assignments: { bar: "bg-primary", bg: "bg-primary/10", text: "text-primary" },
    dissertations: { bar: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600" },
    referrals: { bar: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" },
    signups: { bar: "bg-sky-500", bg: "bg-sky-50", text: "text-sky-600" },
    revenue: { bar: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-600" },
    completion_rate: { bar: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-600" },
};

function MiniBarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
    const max = Math.max(...data.map((d) => d.value));

    return (
        <div className="flex items-end gap-1 h-20 mt-3">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className={cn("w-full rounded-t-md transition-all duration-500", color)}
                        style={{ height: `${(d.value / max) * 100}%`, minHeight: 4 }}
                    />
                    <span className="text-[8px] text-gray-400 font-poppins truncate w-full text-center">
                        {d.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function GrowthCard({ metric, period }: { metric: GrowthMetric; period: MetricPeriod }) {
    const data = metric[period];
    const Icon = metricIcons[metric.id] ?? BarChart3;
    const colors = metricColors[metric.id] ?? metricColors.assignments;
    const isPositive = data.growth >= 0;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-sm transition-shadow">
            {/* Top */}
            <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg)}>
                    <Icon className={cn("w-[18px] h-[18px]", colors.text)} />
                </div>
                <div
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold font-poppins",
                        isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                    )}
                >
                    {isPositive ? (
                        <ArrowUpRight className="w-3 h-3" />
                    ) : (
                        <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(data.growth)}%
                </div>
            </div>

            {/* Name + value */}
            <h3 className="text-sm font-bold text-gray-900 font-montserrat mt-3">
                {metric.name}
            </h3>
            <p className="text-[11px] text-gray-400 font-poppins mt-0.5">
                {metric.description}
            </p>

            {/* Chart */}
            <MiniBarChart data={data.data} color={colors.bar} />
        </div>
    );
}

/* ────────── Writer Workload Table ────────── */

function WorkloadTable({ writers, search }: { writers: typeof ADMIN_WRITER_WORKLOADS; search: string }) {
    const filtered = writers.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
    );

    // Standard deviation
    const counts = filtered.map((w) => w.assigned);
    const mean = counts.reduce((a, b) => a + b, 0) / (counts.length || 1);
    const variance =
        counts.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (counts.length || 1);
    const stdDev = Math.sqrt(variance);

    const maxAssigned = Math.max(...writers.map((w) => w.assigned));

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-bold text-gray-900 font-montserrat">
                        Writer Workload Distribution
                    </h2>
                    <p className="text-xs text-gray-400 font-poppins mt-0.5">
                        Standard deviation of assignments: <span className="font-semibold text-gray-600">{stdDev.toFixed(1)}</span>
                        {" · "}Mean: <span className="font-semibold text-gray-600">{mean.toFixed(1)}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span className="text-[11px] text-gray-500 font-poppins">Assigned</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] text-gray-500 font-poppins">Completed</span>
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-sm text-gray-400 font-poppins text-center py-8">
                    No writers match your search.
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((w) => {
                        const completionPct = ((w.completed / w.assigned) * 100).toFixed(0);
                        return (
                            <div
                                key={w.name}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-montserrat shrink-0">
                                    {w.name.split(" ").map((n) => n[0]).join("")}
                                </div>

                                {/* Name & turnaround */}
                                <div className="w-[140px] shrink-0">
                                    <p className="text-[13px] font-semibold text-gray-800 font-poppins truncate">
                                        {w.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-poppins">
                                        Avg. turnaround: {w.avgTurnaround}h
                                    </p>
                                </div>

                                {/* Bar */}
                                <div className="flex-1">
                                    <div className="flex h-5 rounded-full overflow-hidden bg-gray-100">
                                        <div
                                            className="bg-primary rounded-l-full transition-all duration-500"
                                            style={{ width: `${(w.assigned / maxAssigned) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-50 mt-1">
                                        <div
                                            className="bg-emerald-500 rounded-l-full transition-all duration-500"
                                            style={{ width: `${(w.completed / maxAssigned) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Numbers */}
                                <div className="text-right w-[80px] shrink-0">
                                    <p className="text-sm font-bold text-gray-800 font-montserrat">
                                        {w.assigned}
                                        <span className="text-[10px] font-normal text-gray-400 ml-0.5">asgn</span>
                                    </p>
                                    <p className="text-[11px] text-emerald-600 font-poppins font-medium">
                                        {completionPct}% done
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ────────── Page ────────── */

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

export default function AdminMetricsPage() {
    const [period, setPeriod] = useState<MetricPeriod>("1m");
    const [search, setSearch] = useState("");

    const filteredMetrics = useMemo(() => {
        if (!search.trim()) return ADMIN_METRICS;
        const q = search.toLowerCase();
        return ADMIN_METRICS.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q)
        );
    }, [search]);

    return (
        <div className="space-y-6">
            {/* ─── Header ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-montserrat">
                        Metrics
                    </h1>
                    <p className="text-sm text-gray-500 font-poppins mt-0.5">
                        Growth analytics & performance insights
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search metrics..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-[220px] rounded-xl border border-gray-200 text-sm font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                        />
                    </div>

                    {/* Period pills */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        {(["1m", "6m", "1y"] as MetricPeriod[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold font-poppins transition-all duration-200",
                                    period === p
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ─── Growth Cards ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {filteredMetrics.map((metric) => (
                    <GrowthCard key={metric.id} metric={metric} period={period} />
                ))}
            </motion.div>

            {filteredMetrics.length === 0 && (
                <div className="text-center py-12">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-poppins">No metrics match &quot;{search}&quot;</p>
                </div>
            )}

            {/* ─── Writer Workload ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <WorkloadTable writers={ADMIN_WRITER_WORKLOADS} search={search} />
            </motion.div>
        </div>
    );
}
