"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    FileText,
    ExternalLink,
    Check,
    X,
    ShieldAlert,
    AlertCircle,
    PenTool,
    User,
    Calendar,
    ClipboardList,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ─── Types ─── */
interface FreelancerDetail {
    uuid: string;
    fullName: string | null;
    email: string;
    phone: string | null;
    specialisations: string[];
    wordsPerDay: number | null;
    linkedin: string | null;
    publishedWorkLinks: string[];
    pastExperience: string | null;
    resumeUrl: string | null;
    emailVerified: boolean;
    gender: string | null;
    profilePicture: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    pinCode: string | null;
    streetAddress: string | null;
    status: "pending" | "under_review" | "approved" | "rejected" | "suspended";
    currentStep: number;
    adminNotes: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: FreelancerDetail["status"] }) {
    const map: Record<string, { bg: string; text: string; dot: string; label: string }> = {
        pending: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400", label: "Pending" },
        under_review: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400", label: "Under Review" },
        approved: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", label: "Approved" },
        rejected: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400", label: "Rejected" },
        suspended: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400", label: "Suspended" },
    };
    const s = map[status] ?? map.pending;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold font-poppins",
                s.bg,
                s.text
            )}
        >
            <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
            {s.label}
        </span>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function InfoItem({
    icon: Icon,
    label,
    value,
    link,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null;
    link?: boolean;
}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-[11px] text-gray-400 font-poppins font-medium mb-0.5">
                    {label}
                </p>
                {link ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-primary font-poppins hover:underline inline-flex items-center gap-1"
                    >
                        {value}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                ) : (
                    <p className="text-[13px] text-gray-800 font-poppins break-words">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ────────────────────────────────────── */

export default function FreelancerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const uuid = params.uuid as string;

    const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");
    const [actionError, setActionError] = useState("");
    const [actionSuccess, setActionSuccess] = useState("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${API}/api/admin/freelancers/${uuid}`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch freelancer");
                const data = await res.json();
                setFreelancer(data.data);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Failed to load");
            } finally {
                setLoading(false);
            }
        };
        if (uuid) fetchDetail();
    }, [uuid]);

    const handleAction = async (
        action: "approve" | "reject" | "suspend"
    ) => {
        setActionLoading(true);
        setActionError("");
        setActionSuccess("");
        try {
            const res = await fetch(
                `${API}/api/admin/freelancers/${uuid}/status`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ action, adminNotes: adminNotes.trim() || undefined }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Action failed");
            setActionSuccess(data.message);
            setFreelancer((prev) =>
                prev ? { ...prev, status: data.data.status } : prev
            );
        } catch (e: unknown) {
            setActionError(e instanceof Error ? e.message : "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !freelancer) {
        return (
            <div className="max-w-[800px] mx-auto text-center py-20">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] text-gray-500 font-poppins">
                    {error || "Freelancer not found"}
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push("/admin/freelancers")}
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to list
                </Button>
            </div>
        );
    }

    const isPending =
        freelancer.status === "pending" ||
        freelancer.status === "under_review";
    const isApproved = freelancer.status === "approved";

    const address = [
        freelancer.streetAddress,
        freelancer.city,
        freelancer.state,
        freelancer.pinCode,
        freelancer.country,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="max-w-[900px] mx-auto">
            {/* Back button */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <button
                    onClick={() => router.push("/admin/freelancers")}
                    className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 font-poppins transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Freelancers
                </button>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-5"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-[20px] sm:text-[24px] font-bold text-gray-900 font-montserrat">
                                {freelancer.fullName || "Unnamed Applicant"}
                            </h1>
                            <p className="text-[13px] text-gray-500 font-poppins mt-0.5 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                {freelancer.email}
                                {freelancer.emailVerified && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
                                        <Check className="w-2.5 h-2.5" />
                                        Verified
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={freelancer.status} />
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Applied: {formatDate(freelancer.createdAt)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                        <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
                        Step: {freelancer.currentStep}/4
                    </div>
                    {freelancer.phone && (
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {freelancer.phone}
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left column — details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Specialisations */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5"
                    >
                        <h3 className="text-[13px] font-semibold text-gray-700 font-poppins mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            Specialisations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(freelancer.specialisations ?? []).map((s) => (
                                <span
                                    key={s}
                                    className="inline-block px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-[12px] font-medium font-poppins"
                                >
                                    {s}
                                </span>
                            ))}
                            {(!freelancer.specialisations ||
                                freelancer.specialisations.length === 0) && (
                                    <p className="text-[12px] text-gray-400 font-poppins italic">
                                        No specialisations selected
                                    </p>
                                )}
                        </div>
                    </motion.div>

                    {/* Experience */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5"
                    >
                        <h3 className="text-[13px] font-semibold text-gray-700 font-poppins mb-3 flex items-center gap-2">
                            <PenTool className="w-4 h-4 text-gray-400" />
                            Experience & Portfolio
                        </h3>

                        <div className="space-y-1 divide-y divide-gray-50">
                            {freelancer.wordsPerDay && (
                                <InfoItem
                                    icon={FileText}
                                    label="Words per day"
                                    value={String(freelancer.wordsPerDay)}
                                />
                            )}
                            <InfoItem
                                icon={ExternalLink}
                                label="LinkedIn"
                                value={freelancer.linkedin}
                                link
                            />
                            {(freelancer.publishedWorkLinks ?? []).map(
                                (link, i) => (
                                    <InfoItem
                                        key={i}
                                        icon={ExternalLink}
                                        label={`Published Work ${i + 1}`}
                                        value={link}
                                        link
                                    />
                                )
                            )}
                        </div>

                        {freelancer.pastExperience && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <p className="text-[11px] text-gray-400 font-poppins font-medium mb-1.5">
                                    Past Experience
                                </p>
                                <p className="text-[13px] text-gray-700 font-poppins leading-relaxed whitespace-pre-line">
                                    {freelancer.pastExperience}
                                </p>
                            </div>
                        )}

                        {freelancer.resumeUrl && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <InfoItem
                                    icon={FileText}
                                    label="Resume / CV"
                                    value={freelancer.resumeUrl}
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* Personal details */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.15 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5"
                    >
                        <h3 className="text-[13px] font-semibold text-gray-700 font-poppins mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            Personal Details
                        </h3>
                        <div className="space-y-1 divide-y divide-gray-50">
                            <InfoItem
                                icon={User}
                                label="Gender"
                                value={freelancer.gender}
                            />
                            <InfoItem
                                icon={MapPin}
                                label="Address"
                                value={address || null}
                            />
                        </div>
                    </motion.div>

                    {/* Assignment History — placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.2 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5"
                    >
                        <h3 className="text-[13px] font-semibold text-gray-700 font-poppins mb-3 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-gray-400" />
                            Assignment History
                        </h3>
                        <div className="text-center py-8">
                            <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-[13px] text-gray-400 font-poppins">
                                No assignments yet
                            </p>
                            <p className="text-[11px] text-gray-300 font-poppins mt-0.5">
                                Assignments will appear here once this
                                freelancer starts working
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right column — actions */}
                <div className="space-y-5">
                    {/* Action card */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-[72px]"
                    >
                        <h3 className="text-[13px] font-semibold text-gray-700 font-poppins mb-4">
                            Actions
                        </h3>

                        {/* Admin notes */}
                        <div className="space-y-1.5 mb-4">
                            <Label className="text-[12px] font-medium text-gray-500 font-poppins">
                                Admin Notes{" "}
                                <span className="text-gray-400">(optional)</span>
                            </Label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add a note about this decision..."
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-800 font-poppins placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        {/* Existing notes */}
                        {freelancer.adminNotes && (
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                                <p className="text-[11px] text-gray-400 font-poppins font-medium mb-1">
                                    Previous Note
                                </p>
                                <p className="text-[12px] text-gray-600 font-poppins">
                                    {freelancer.adminNotes}
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="space-y-2.5">
                            {isPending && (
                                <>
                                    <Button
                                        className="w-full"
                                        onClick={() => handleAction("approve")}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                        ) : (
                                            <Check className="w-4 h-4 mr-1.5" />
                                        )}
                                        Approve Application
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                        onClick={() => handleAction("reject")}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                        ) : (
                                            <X className="w-4 h-4 mr-1.5" />
                                        )}
                                        Reject Application
                                    </Button>
                                </>
                            )}
                            {isApproved && (
                                <Button
                                    variant="outline"
                                    className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
                                    onClick={() => handleAction("suspend")}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                    ) : (
                                        <ShieldAlert className="w-4 h-4 mr-1.5" />
                                    )}
                                    Suspend Freelancer
                                </Button>
                            )}
                            {!isPending && !isApproved && (
                                <p className="text-[12px] text-gray-400 font-poppins text-center py-2">
                                    No actions available for{" "}
                                    <span className="font-medium">
                                        {freelancer.status}
                                    </span>{" "}
                                    applications
                                </p>
                            )}
                        </div>

                        {/* Action feedback */}
                        {actionError && (
                            <div className="flex items-start gap-2 p-3 mt-3 rounded-xl bg-red-50 border border-red-100">
                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-red-600 font-poppins">
                                    {actionError}
                                </p>
                            </div>
                        )}
                        {actionSuccess && (
                            <div className="flex items-start gap-2 p-3 mt-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-emerald-600 font-poppins">
                                    {actionSuccess}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
