"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    BookOpen,
    User,
    Phone,
    Mail,
    Award,
    CheckCircle2,
    Circle,
    Loader2,
    Clock,
    DollarSign,
    FileText,
    Layers,
    Upload,
    X,
    Search,
    Check,
    ChevronRight,
    AlertCircle,
    RotateCcw,
    Users,
    Briefcase,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_PM_LIST, ADMIN_FREELANCER_LIST, ADMIN_STATUS_STEPS } from "@/lib/static";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ─────────────────────────── Types ─────────────────────────── */
interface AssignmentDetail {
    id: string;
    title: string;
    description: string;
    type: string;
    subtype: string;
    subject: string;
    stream: string;
    academicLevel: string;
    wordCount: string | number;
    deadline: string;
    submittedAt: string;
    stage: string;
    freelancerAmount: number;
    totalAmount: number;
    referencingStyle: string;
    marks: number | null;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    pmName: string;
    pmPhone: string;
    freelancerName: string;
    freelancerPhone: string;
    currentStep: number;
}

/* ─────────────────────────── Formatters ─────────────────────────── */
const fmtDate = (iso: string) => {
    if (!iso || iso === "—") return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const fmtMoney = (n: number) => {
    if (n == null) return "—";
    return "₹" + n.toLocaleString("en-IN");
};

const fmtRelative = (iso: string) => {
    if (!iso || iso === "—") return "";
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d} days ago`;
};

/* ─────────────────────────── Stage Colours ─────────────────────────── */
const stageColor: Record<string, { bg: string; text: string; dot: string }> = {
    submitted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    assigned_pm: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
    assigned_freelancer: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    in_progress: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    marks_received: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
};

const stageLabel: Record<string, string> = {
    submitted: "Submitted",
    assigned_pm: "Assigned PM",
    assigned_freelancer: "Assigned Freelancer",
    in_progress: "In Progress",
    completed: "Completed",
    marks_received: "Marks Received",
};

/* ─────────────────────────── Pill Badge ─────────────────────────── */
function StageBadge({ stage }: { stage: string }) {
    const c = stageColor[stage] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold font-poppins", c.bg, c.text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
            {stageLabel[stage] ?? stage}
        </span>
    );
}

/* ─────────────────────────── Metadata Chip ─────────────────────────── */
function MetaChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-[#012551]/5 flex items-center justify-center shrink-0">
                <Icon className="w-[15px] h-[15px] text-[#012551]" />
            </div>
            <div className="min-w-0">
                <p className="text-[10.5px] text-gray-400 font-poppins uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-[13.5px] font-semibold text-gray-800 font-poppins truncate">{value || "—"}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────── Person Drawer ─────────────────────────── */
function PersonDrawer({
    open,
    onClose,
    title,
    description,
    people,
    currentPerson,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    people: readonly string[];
    currentPerson: string;
    onSelect: (name: string) => void;
}) {
    const [query, setQuery] = useState("");
    const filtered = people.filter(p => p.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => { if (!open) setQuery(""); }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ ease: "circOut", duration: 0.32 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-white z-50 flex flex-col shadow-2xl"
                    >
                        {/* top */}
                        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-[18px] font-bold text-gray-900 font-montserrat">{title}</h3>
                                    <p className="text-[13px] text-gray-500 font-poppins mt-0.5">{description}</p>
                                </div>
                                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors shrink-0 mt-0.5">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Search name…"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#012551]/20 text-[14px] font-poppins text-gray-900 placeholder:text-gray-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* list */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                            {filtered.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                    <p className="text-[14px] font-poppins">No results</p>
                                </div>
                            ) : filtered.map(person => {
                                const active = person === currentPerson;
                                const initials = person.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                                return (
                                    <button
                                        key={person}
                                        onClick={() => { onSelect(person); onClose(); }}
                                        className={cn(
                                            "w-full flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left",
                                            active
                                                ? "border-[#012551] bg-[#012551]/[0.03] shadow-sm"
                                                : "border-gray-150 hover:border-gray-300 hover:bg-gray-50 border-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[14px] font-bold font-montserrat",
                                            active ? "bg-[#012551] text-white" : "bg-gray-100 text-gray-600"
                                        )}>
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-[14px] font-semibold font-poppins", active ? "text-[#012551]" : "text-gray-800")}>{person}</p>
                                            <p className="text-[12px] text-gray-400 font-poppins">Available</p>
                                        </div>
                                        {active && (
                                            <div className="w-6 h-6 rounded-full bg-[#012551] flex items-center justify-center shrink-0">
                                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ─────────────────────────── Timeline ─────────────────────────── */
function Timeline({ currentStep }: { currentStep: number }) {
    return (
        <div className="relative">
            {/* vertical rule */}
            <div className="absolute left-[15px] top-5 bottom-5 w-px bg-gray-100" />

            <div className="space-y-0">
                {ADMIN_STATUS_STEPS.map((label, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    return (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            className="relative flex items-start gap-4 pb-6 last:pb-0"
                        >
                            {/* dot */}
                            <div className={cn(
                                "relative z-10 w-[30px] h-[30px] rounded-full shrink-0 border-2 flex items-center justify-center transition-all",
                                done ? "bg-emerald-500 border-emerald-500" :
                                    active ? "bg-[#012551] border-[#012551]" :
                                        "bg-white border-gray-200"
                            )}>
                                {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                {active && <span className="w-2 h-2 rounded-full bg-white" />}
                            </div>

                            {/* text */}
                            <div className="pt-0.5 min-w-0">
                                <p className={cn(
                                    "text-[13.5px] font-semibold font-poppins leading-tight",
                                    done ? "text-gray-700" :
                                        active ? "text-[#012551]" :
                                            "text-gray-400"
                                )}>
                                    {label}
                                </p>
                                <p className={cn(
                                    "text-[11px] font-poppins mt-0.5",
                                    done ? "text-emerald-500" :
                                        active ? "text-[#012551]/60 italic" :
                                            "text-gray-300"
                                )}>
                                    {done ? "Completed" :
                                        active ? "In progress" :
                                            "Pending"}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────── Contact Row ─────────────────────────── */
function ContactRow({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
    if (!value || value === "—") return null;
    return (
        <p className="flex items-center gap-2 text-[12.5px] text-gray-500 font-poppins">
            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {value}
        </p>
    );
}

/* ─────────────────────────── Person Card ─────────────────────────── */
function PersonCard({
    role,
    name,
    phone,
    accent,
    onAssign,
}: {
    role: string;
    name: string;
    phone: string;
    accent: string;
    onAssign: () => void;
}) {
    const assigned = name && name !== "—";
    const initials = assigned ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

    return (
        <div className={cn("rounded-2xl p-5 border transition-all", assigned ? "bg-white border-gray-200" : "bg-gray-50 border-dashed border-gray-200")}>
            <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold pt-0.5">{role}</p>
                <button
                    onClick={onAssign}
                    className={cn(
                        "text-[12px] font-semibold font-poppins px-3 py-1 rounded-lg transition-all",
                        assigned
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-[#012551] text-white hover:bg-[#012551]/90"
                    )}
                >
                    {assigned ? "Change" : "Assign"}
                </button>
            </div>

            {assigned ? (
                <div className="flex items-center gap-3">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[14px] font-bold font-montserrat text-white", accent)}>
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[15px] font-bold text-gray-900 font-poppins truncate">{name}</p>
                        <ContactRow icon={Phone} value={phone} />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 opacity-50">
                    <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-[14px] text-gray-400 font-poppins">Not yet assigned</p>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────── Marks Card ─────────────────────────── */
function MarksDisplay({ marks }: { marks: number | null }) {
    const pct = marks !== null ? marks : null;
    const grade =
        pct === null ? null :
            pct >= 70 ? { label: "Merit", color: "text-emerald-600", bg: "bg-emerald-50" } :
                pct >= 50 ? { label: "Passed", color: "text-blue-600", bg: "bg-blue-50" } :
                    { label: "Failed", color: "text-red-600", bg: "bg-red-50" };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#012551]/5 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#012551]" />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-3">Marks Received</p>

            {pct !== null ? (
                <>
                    <div className="relative w-24 h-24 mb-3">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
                            <circle
                                cx="18" cy="18" r="15.9" fill="none"
                                stroke={pct >= 70 ? "#10b981" : pct >= 50 ? "#3b82f6" : "#ef4444"}
                                strokeWidth="2.5"
                                strokeDasharray={`${(pct / 100) * 100} 100`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[22px] font-bold font-montserrat text-gray-900">{pct}</span>
                        </div>
                    </div>
                    {grade && (
                        <span className={cn("px-4 py-1.5 rounded-full text-[12px] font-bold font-poppins", grade.bg, grade.color)}>
                            {grade.label}
                        </span>
                    )}
                </>
            ) : (
                <div className="py-2">
                    <p className="text-[28px] font-bold text-gray-300 font-montserrat">N/A</p>
                    <p className="text-[12px] text-gray-400 font-poppins mt-1">Awaiting mark entry</p>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AssignmentViewPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<AssignmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [pmName, setPmName] = useState("");
    const [flName, setFlName] = useState("");
    const [pmOpen, setPmOpen] = useState(false);
    const [flOpen, setFlOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        fetch(`${API}/api/admin/assignments/${id}`, { credentials: "include" })
            .then(r => {
                if (r.status === 404) { setNotFound(true); return null; }
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(json => {
                if (!json) return;
                setData(json.data);
                if (json.data.pmName !== "—") setPmName(json.data.pmName);
                if (json.data.freelancerName !== "—") setFlName(json.data.freelancerName);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    /* ── loading ── */
    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-9 h-9 text-[#012551] animate-spin" />
            <p className="text-[14px] text-gray-400 font-poppins">Loading assignment…</p>
        </div>
    );

    /* ── not found ── */
    if (notFound || !data) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-[22px] font-bold font-montserrat text-gray-900">Assignment not found</h2>
            <p className="text-[14px] text-gray-400 font-poppins max-w-xs">The assignment <strong>#{id}</strong> does not exist or you don't have permission to view it.</p>
            <button
                onClick={() => router.push("/admin/assignments")}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#012551] text-white text-[13px] font-semibold font-poppins rounded-xl hover:bg-[#012551]/90 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Assignments
            </button>
        </div>
    );

    const stage = data.stage;
    const sc = stageColor[stage] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

    return (
        <>
            {/* ─── Drawers ─── */}
            <PersonDrawer
                open={pmOpen}
                onClose={() => setPmOpen(false)}
                title="Assign Project Manager"
                description="Select a PM to oversee this assignment"
                people={ADMIN_PM_LIST}
                currentPerson={pmName}
                onSelect={setPmName}
            />
            <PersonDrawer
                open={flOpen}
                onClose={() => setFlOpen(false)}
                title="Assign Freelancer"
                description="Select an expert to work on this assignment"
                people={ADMIN_FREELANCER_LIST}
                currentPerson={flName}
                onSelect={setFlName}
            />

            <div className="min-h-screen bg-[#f8f9fc] -m-5 lg:-m-8">

                {/* ══════════ HERO ══════════ */}
                <div className="relative bg-[#012551] overflow-hidden">
                    {/* dot grid */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                    }} />
                    {/* blobs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-indigo-400/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
                        {/* back */}
                        <motion.button
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => router.back()}
                            className="flex items-center gap-1.5 text-white/60 hover:text-white/90 text-[13px] font-poppins font-medium transition-colors group mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Assignments
                        </motion.button>

                        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-0 lg:justify-between">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* badge row */}
                                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                                    <StageBadge stage={stage} />
                                    <span className="text-white/30 text-[11px] font-poppins">#{data.id}</span>
                                    <span className="text-white/30 text-[11px] font-poppins">·</span>
                                    <span className="text-white/50 text-[11px] font-poppins flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {fmtRelative(data.submittedAt)}
                                    </span>
                                </div>

                                {/* title */}
                                <h1 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-white font-montserrat leading-tight max-w-[650px]">
                                    {data.title.charAt(0).toUpperCase() + data.title.slice(1)}
                                </h1>

                                {/* deadline pill */}
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08]">
                                        <Calendar className="w-3.5 h-3.5 text-white/60" />
                                        <span className="text-[12px] text-white/70 font-poppins">Due {fmtDate(data.deadline)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08]">
                                        <BookOpen className="w-3.5 h-3.5 text-white/60" />
                                        <span className="text-[12px] text-white/70 font-poppins">{data.stream}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="flex flex-wrap gap-2 lg:flex-col lg:items-end"
                            >
                                <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-[13px] font-poppins font-medium hover:bg-white/20 transition-all backdrop-blur-sm">
                                    Edit Details
                                </button>
                                <button className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-[13px] font-poppins font-medium hover:bg-red-500/30 transition-all">
                                    Delete
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ══════════ MAIN CONTENT ══════════ */}
                <div className="max-w-[1200px] mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                        {/* ────── LEFT ────── */}
                        <div className="space-y-5">

                            {/* Description card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                                            <FileText className="w-3.5 h-3.5 text-[#012551]" />
                                        </div>
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Description</p>
                                    </div>
                                </div>
                                <p className="text-[14px] text-gray-600 font-poppins leading-[1.9] whitespace-pre-line">
                                    {data.description || "No description provided for this assignment."}
                                </p>
                            </motion.div>

                            {/* Metadata grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                                        <Layers className="w-3.5 h-3.5 text-[#012551]" />
                                    </div>
                                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Assignment Details</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                    <div>
                                        <MetaChip icon={BookOpen} label="Academic Level" value={data.academicLevel} />
                                        <MetaChip icon={Layers} label="Type" value={data.type} />
                                        <MetaChip icon={FileText} label="Subject / Topic" value={data.subject} />
                                        <MetaChip icon={Star} label="Referencing" value={data.referencingStyle} />
                                    </div>
                                    <div>
                                        <MetaChip icon={BookOpen} label="Word Count" value={data.wordCount ? String(data.wordCount) + " words" : "—"} />
                                        <MetaChip icon={Calendar} label="Submitted" value={fmtDate(data.submittedAt)} />
                                        <MetaChip icon={Calendar} label="Deadline" value={fmtDate(data.deadline)} />
                                        <MetaChip icon={DollarSign} label="Budget" value={fmtMoney(data.totalAmount)} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Team assignment */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                                        <Users className="w-3.5 h-3.5 text-[#012551]" />
                                    </div>
                                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Team Assignment</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <PersonCard
                                        role="Project Manager"
                                        name={pmName}
                                        phone={data.pmPhone}
                                        accent="bg-violet-600"
                                        onAssign={() => setPmOpen(true)}
                                    />
                                    <PersonCard
                                        role="Freelancer / Expert"
                                        name={flName}
                                        phone={data.freelancerPhone}
                                        accent="bg-amber-600"
                                        onAssign={() => setFlOpen(true)}
                                    />
                                </div>
                            </motion.div>

                            {/* Student info + Marks */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4"
                            >
                                {/* Student */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                                    <div className="flex items-center gap-2 mb-5">
                                        <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                                            <User className="w-3.5 h-3.5 text-[#012551]" />
                                        </div>
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Student</p>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#012551] flex items-center justify-center shrink-0 text-[15px] font-bold font-montserrat text-white">
                                            {data.studentName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-[16px] font-bold text-gray-900 font-poppins">{data.studentName}</p>
                                            <p className="text-[12px] text-gray-400 font-poppins">Student</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pl-1">
                                        <ContactRow icon={Phone} value={data.studentPhone} />
                                        <ContactRow icon={Mail} value={data.studentEmail} />
                                    </div>
                                </div>

                                {/* Marks */}
                                <MarksDisplay marks={data.marks} />
                            </motion.div>

                            {/* File uploads */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                                        <Upload className="w-3.5 h-3.5 text-[#012551]" />
                                    </div>
                                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">File Uploads</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {["Guidelines", "Assignment File", "Supporting Docs"].map(label => (
                                        <label
                                            key={label}
                                            className="flex flex-col items-center justify-center gap-2.5 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer group hover:border-[#012551]/30 hover:bg-[#012551]/[0.02] transition-all text-center"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#012551]/5 flex items-center justify-center transition-colors">
                                                <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#012551] transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-gray-600 font-poppins">{label}</p>
                                                <p className="text-[11px] text-gray-400 font-poppins mt-0.5">Click to upload</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* ────── RIGHT SIDEBAR ────── */}
                        <div className="space-y-5">

                            {/* Timeline card */}
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:sticky lg:top-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#012551]" />
                                        </div>
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">Progress</p>
                                    </div>
                                    <StageBadge stage={stage} />
                                </div>

                                <Timeline currentStep={data.currentStep} />

                                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                                    <button className="w-full py-2.5 rounded-xl bg-[#012551] text-white text-[13px] font-semibold font-poppins hover:bg-[#012551]/90 transition-colors">
                                        Advance Stage
                                    </button>
                                    <button className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-[13px] font-semibold font-poppins hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Reset
                                    </button>
                                </div>
                            </motion.div>

                            {/* Quick info */}
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                            >
                                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">Quick Overview</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-gray-500 font-poppins">Total Budget</span>
                                        <span className="text-[14px] font-bold text-gray-900 font-poppins">{fmtMoney(data.totalAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-gray-500 font-poppins">Expert Pay</span>
                                        <span className="text-[14px] font-bold text-gray-900 font-poppins">{fmtMoney(data.freelancerAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-gray-500 font-poppins">Word Count</span>
                                        <span className="text-[14px] font-bold text-gray-900 font-poppins">{data.wordCount ? String(data.wordCount) : "—"}</span>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-gray-500 font-poppins">Marks</span>
                                        <span className={cn(
                                            "text-[14px] font-bold font-poppins",
                                            data.marks === null ? "text-gray-300" :
                                                data.marks >= 70 ? "text-emerald-600" :
                                                    data.marks >= 50 ? "text-blue-600" :
                                                        "text-red-600"
                                        )}>
                                            {data.marks !== null ? `${data.marks}/100` : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
