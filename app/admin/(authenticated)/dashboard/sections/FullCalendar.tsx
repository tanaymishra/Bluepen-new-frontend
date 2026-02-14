"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ADMIN_DEADLINE_MAP } from "@/lib/static";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    X,
    FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function FullCalendar() {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const isCurrentMonth =
        viewYear === now.getFullYear() && viewMonth === now.getMonth();
    const today = isCurrentMonth ? now.getDate() : -1;

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

    const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    const goPrev = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
        setSelectedDay(null);
    };

    const goNext = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
        setSelectedDay(null);
    };

    const goToday = () => {
        setViewYear(now.getFullYear());
        setViewMonth(now.getMonth());
        setSelectedDay(null);
    };

    // Only show deadline data for current real month (Feb 2026)
    const isDeadlineMonth =
        viewYear === 2026 && viewMonth === 1; // Feb 2026

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // Pad trailing cells
    while (cells.length % 7 !== 0) cells.push(null);

    const selectedDeadline =
        isDeadlineMonth && selectedDay ? ADMIN_DEADLINE_MAP[selectedDay] : null;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900 font-montserrat">
                            Calendar
                        </h2>
                        <p className="text-xs text-gray-400 font-poppins">
                            Click on a day to view deadlines
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isCurrentMonth && (
                        <button
                            onClick={goToday}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/[0.07] hover:bg-primary/[0.12] font-poppins transition-colors"
                        >
                            Today
                        </button>
                    )}
                    <button
                        onClick={goPrev}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <p className="text-sm font-semibold text-gray-800 font-montserrat min-w-[140px] text-center">
                        {monthLabel}
                    </p>
                    <button
                        onClick={goNext}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayLabels.map((d) => (
                    <div
                        key={d}
                        className="text-center text-[11px] font-semibold text-gray-400 font-poppins py-2"
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    if (day === null) {
                        return <div key={`e-${i}`} className="aspect-[1.4]" />;
                    }

                    const deadline = isDeadlineMonth
                        ? ADMIN_DEADLINE_MAP[day]
                        : null;
                    const hasDeadline = !!deadline;
                    const isToday = day === today;
                    const isSelected = day === selectedDay;

                    return (
                        <button
                            key={day}
                            onClick={() =>
                                setSelectedDay(day === selectedDay ? null : day)
                            }
                            className={cn(
                                "aspect-[1.4] rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-medium font-poppins transition-all duration-200 relative",
                                isToday
                                    ? "bg-primary text-white font-bold shadow-sm shadow-primary/20"
                                    : isSelected
                                    ? "bg-primary/[0.08] text-primary ring-2 ring-primary/30"
                                    : "text-gray-700 hover:bg-gray-50",
                                hasDeadline && !isToday && !isSelected && "hover:bg-primary/[0.05]"
                            )}
                        >
                            <span>{day}</span>
                            {hasDeadline && (
                                <span
                                    className={cn(
                                        "text-[9px] font-bold leading-none",
                                        isToday
                                            ? "text-white/80"
                                            : "text-primary"
                                    )}
                                >
                                    {deadline!.count} deadline{deadline!.count > 1 ? "s" : ""}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected day detail */}
            <AnimatePresence>
                {selectedDeadline && selectedDay && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-5 pt-5 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 font-poppins">
                                            {selectedDeadline.count} Deadline{selectedDeadline.count > 1 ? "s" : ""}
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-poppins">
                                            {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString("en-IN", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                                {selectedDeadline.assignments.map((a, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/20 transition-colors"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <p className="text-[12px] text-gray-700 font-poppins font-medium truncate">
                                            {a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
