"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Users, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentViewStore } from "../store/useAssignmentViewStore";
import { ContactRow } from "./Atoms";

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
    const assigned = !!name && name !== "—";
    const initials = assigned ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

    return (
        <div className={cn(
            "rounded-2xl p-5 border transition-all",
            assigned ? "bg-white border-gray-200" : "bg-gray-50 border-dashed border-gray-200"
        )}>
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

export default function TeamCard() {
    const assignment = useAssignmentViewStore(s => s.assignment)!;
    const pmName = useAssignmentViewStore(s => s.pmName);
    const flName = useAssignmentViewStore(s => s.freelancerName);
    const setPmOpen = useAssignmentViewStore(s => s.setPmDrawerOpen);
    const setFlOpen = useAssignmentViewStore(s => s.setFlDrawerOpen);

    return (
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
                    phone={assignment.pmPhone}
                    accent="bg-violet-600"
                    onAssign={() => setPmOpen(true)}
                />
                <PersonCard
                    role="Freelancer / Expert"
                    name={flName}
                    phone={assignment.freelancerPhone}
                    accent="bg-amber-600"
                    onAssign={() => setFlOpen(true)}
                />
            </div>
        </motion.div>
    );
}
