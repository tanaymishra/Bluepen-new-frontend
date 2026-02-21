"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssignmentViewStore } from "../store/useAssignmentViewStore";
import { ADMIN_PM_LIST, ADMIN_FREELANCER_LIST } from "@/lib/static";

function Drawer({
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
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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

export default function PersonDrawers() {
    const pmName = useAssignmentViewStore(s => s.pmName);
    const flName = useAssignmentViewStore(s => s.freelancerName);
    const pmOpen = useAssignmentViewStore(s => s.pmDrawerOpen);
    const flOpen = useAssignmentViewStore(s => s.flDrawerOpen);
    const setPmOpen = useAssignmentViewStore(s => s.setPmDrawerOpen);
    const setFlOpen = useAssignmentViewStore(s => s.setFlDrawerOpen);
    const setPmName = useAssignmentViewStore(s => s.setPmName);
    const setFlName = useAssignmentViewStore(s => s.setFreelancerName);

    return (
        <>
            <Drawer
                open={pmOpen}
                onClose={() => setPmOpen(false)}
                title="Assign Project Manager"
                description="Select a PM to oversee this assignment"
                people={ADMIN_PM_LIST}
                currentPerson={pmName}
                onSelect={setPmName}
            />
            <Drawer
                open={flOpen}
                onClose={() => setFlOpen(false)}
                title="Assign Freelancer"
                description="Select an expert to work on this assignment"
                people={ADMIN_FREELANCER_LIST}
                currentPerson={flName}
                onSelect={setFlName}
            />
        </>
    );
}
