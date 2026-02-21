"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PersonSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    people: readonly string[];
    currentPerson: string;
    onSelect: (name: string) => void;
    icon: React.ElementType;
}

export default function PersonSheet({
    open,
    onOpenChange,
    title,
    description,
    people,
    currentPerson,
    onSelect,
}: PersonSheetProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPeople = useMemo(() => {
        if (!searchQuery.trim()) return people;
        const query = searchQuery.toLowerCase();
        return people.filter(person => person.toLowerCase().includes(query));
    }, [people, searchQuery]);

    // Reset search when drawer closes
    useEffect(() => {
        if (!open) {
            setSearchQuery("");
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-white border-b border-gray-100 px-6 py-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-[20px] font-bold font-montserrat text-gray-900 mb-1">
                                        {title}
                                    </h2>
                                    <p className="text-[13px] text-gray-500 font-poppins">
                                        {description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors ml-3"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white font-poppins text-[14px]"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 px-6 py-5 space-y-2.5 overflow-y-auto">
                            {filteredPeople.length > 0 ? (
                                filteredPeople.map((person, index) => {
                                    const isActive = person === currentPerson;
                                    const initials = person.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    
                                    return (
                                        <motion.button
                                            key={person}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            onClick={() => {
                                                onSelect(person);
                                                onOpenChange(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group",
                                                isActive
                                                    ? "border-[#012551] bg-[#012551]/5 shadow-sm"
                                                    : "border-gray-200 hover:border-[#012551]/30 hover:bg-gray-50"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                                    isActive
                                                        ? "bg-[#012551] text-white"
                                                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                                )}
                                            >
                                                <span className="text-[14px] font-bold font-montserrat">
                                                    {initials}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={cn(
                                                        "text-[15px] font-semibold font-poppins",
                                                        isActive ? "text-[#012551]" : "text-gray-900"
                                                    )}
                                                >
                                                    {person}
                                                </p>
                                                <p className="text-[12px] text-gray-400 font-poppins mt-0.5">
                                                    Available for assignment
                                                </p>
                                            </div>
                                            {isActive && (
                                                <motion.div 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="w-7 h-7 rounded-full bg-[#F8D881] flex items-center justify-center shrink-0"
                                                >
                                                    <Check className="w-4 h-4 text-[#012551]" strokeWidth={3} />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                        <Search className="w-7 h-7 text-gray-400" />
                                    </div>
                                    <p className="text-[14px] text-gray-600 font-poppins font-medium">
                                        No results found
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-poppins mt-1">
                                        Try a different search term
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
