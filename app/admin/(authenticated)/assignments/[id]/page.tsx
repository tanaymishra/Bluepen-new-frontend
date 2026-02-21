"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, UserCog, PenTool } from "lucide-react";
import { ADMIN_PM_LIST, ADMIN_FREELANCER_LIST } from "@/lib/static";
import { useAssignmentStore } from "./store/assignmentStore";
import AssignmentHeader from "./sections/AssignmentHeader";
import AssignmentOverviewCard from "./sections/AssignmentOverviewCard";
import TeamAssignmentCards from "./sections/TeamAssignmentCards";
import StudentMarksCards from "./sections/StudentMarksCards";
import FileUploadSection from "./sections/FileUploadSection";
import StatusTimeline from "./sections/StatusTimeline";
import PersonSheet from "./sections/PersonSheet";
import AssignmentNotFound from "./sections/AssignmentNotFound";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function AdminAssignmentDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        assignment,
        loading,
        error,
        pmName,
        freelancerName,
        pmSheetOpen,
        flSheetOpen,
        setAssignment,
        setLoading,
        setError,
        setPmName,
        setFreelancerName,
        setPmSheetOpen,
        setFlSheetOpen,
        resetTimeline,
    } = useAssignmentStore();

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                const res = await fetch(`${API}/api/admin/assignments/${id}`, {
                    credentials: "include"
                });
                if (res.status === 404) {
                    setError(true);
                    return;
                }
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setAssignment(data.data);

                // Initialize local state based on fetched data
                if (data.data.pmName !== "—") setPmName(data.data.pmName);
                if (data.data.freelancerName !== "—") setFreelancerName(data.data.freelancerName);

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, [id, setAssignment, setError, setLoading, setPmName, setFreelancerName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !assignment) {
        return <AssignmentNotFound id={id} />;
    }

    return (
        <div className="max-w-[1100px] mx-auto">
            <AssignmentHeader assignmentId={assignment.id} />

            {/* Main Grid: Content + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-5">
                    <AssignmentOverviewCard assignment={assignment} />
                    <TeamAssignmentCards />
                    <StudentMarksCards />
                    <FileUploadSection />
                </div>

                {/* Right Column (1/3) — Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100/80 p-5 h-fit lg:sticky lg:top-6 shadow-sm"
                >
                    <StatusTimeline
                        currentStep={assignment.currentStep}
                        onReset={resetTimeline}
                    />
                </motion.div>
            </div>

            {/* PM Sheet */}
            <PersonSheet
                open={pmSheetOpen}
                onOpenChange={setPmSheetOpen}
                title={pmName ? "Update PM" : "Assign PM"}
                description="Select a project manager for this assignment"
                people={ADMIN_PM_LIST}
                currentPerson={pmName}
                onSelect={setPmName}
                icon={UserCog}
            />

            {/* Freelancer Sheet */}
            <PersonSheet
                open={flSheetOpen}
                onOpenChange={setFlSheetOpen}
                title={freelancerName ? "Update Freelancer" : "Assign Freelancer"}
                description="Select a freelancer for this assignment"
                people={ADMIN_FREELANCER_LIST}
                currentPerson={freelancerName}
                onSelect={setFreelancerName}
                icon={PenTool}
            />
        </div>
    );
}
