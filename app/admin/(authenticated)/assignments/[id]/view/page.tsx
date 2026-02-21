"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAssignmentViewStore } from "./store/useAssignmentViewStore";
import AssignmentHero from "./sections/AssignmentHero";
import DetailsCard from "./sections/DetailsCard";
import TeamCard from "./sections/TeamCard";
import StudentMarksRow from "./sections/StudentMarksRow";
import FileUploads from "./sections/FileUploads";
import ProgressSidebar from "./sections/ProgressSidebar";
import PersonDrawers from "./sections/PersonDrawers";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function AssignmentViewPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const {
        assignment, loading, notFound,
        setAssignment, setLoading, setNotFound,
        setPmName, setFreelancerName, reset,
    } = useAssignmentViewStore();

    useEffect(() => {
        reset();
        fetch(`${API}/api/admin/assignments/${id}`, { credentials: "include" })
            .then(r => {
                if (r.status === 404) { setNotFound(true); return null; }
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(json => {
                if (!json) return;
                setAssignment(json.data);
                if (json.data.pmName !== "—") setPmName(json.data.pmName);
                if (json.data.freelancerName !== "—") setFreelancerName(json.data.freelancerName);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    /* ── loading ── */
    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-9 h-9 text-[#012551] animate-spin" />
            <p className="text-[14px] text-gray-400 font-poppins">Loading assignment…</p>
        </div>
    );

    /* ── not found ── */
    if (notFound || !assignment) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-[22px] font-bold font-montserrat text-gray-900">Assignment not found</h2>
            <p className="text-[14px] text-gray-400 font-poppins max-w-xs">
                The assignment <strong>#{id}</strong> does not exist or you don&apos;t have permission to view it.
            </p>
            <button
                onClick={() => router.push("/admin/assignments")}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#012551] text-white text-[13px] font-semibold font-poppins rounded-xl hover:bg-[#012551]/90 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Assignments
            </button>
        </div>
    );

    return (
        <>
            {/* Drawers rendered outside the scrolling area */}
            <PersonDrawers />

            <div className="min-h-screen bg-[#f8f9fc] -m-5 lg:-m-8">
                <AssignmentHero />

                <div className="max-w-[1200px] mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                        {/* Left column */}
                        <div className="space-y-5">
                            <DetailsCard />
                            <TeamCard />
                            <StudentMarksRow />
                            <FileUploads />
                        </div>

                        {/* Right sidebar */}
                        <ProgressSidebar />
                    </div>
                </div>
            </div>
        </>
    );
}
