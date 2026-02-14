"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ADMIN_DEADLINE_MAP } from "@/lib/static";
import { X } from "lucide-react";

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getHeatColor(count: number, maxCount: number): string {
    if (count === 0) return "";
    const ratio = count / maxCount;
    if (ratio <= 0.15) return "bg-emerald-100 text-emerald-800";
    if (ratio <= 0.3) return "bg-emerald-200 text-emerald-900";
    if (ratio <= 0.5) return "bg-emerald-300 text-emerald-900";
    if (ratio <= 0.7) return "bg-emerald-400 text-white";
    if (ratio <= 0.85) return "bg-emerald-500 text-white";
    return "bg-emerald-600 text-white";
}

export default function DeadlineHeatmap() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based (Feb = 1)
    const today = now.getDate();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);

    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const maxCount = Math.max(
        ...Object.values(ADMIN_DEADLINE_MAP).map((d) => d.count),
        1
    );

    const monthName = new Date(year, month).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const selectedData = selectedDay ? ADMIN_DEADLINE_MAP[selectedDay] : null;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 font-poppins font-semibold">
                        Deadline Density
                    </p>
                    <p className="text-sm font-semibold text-gray-800 font-montserrat mt-0.5">
                        {monthName}
                    </p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-poppins mr-1">Less</span>
                    {[100, 200, 300, 400, 500, 600].map((shade) => (
                        <div
                            key={shade}
                            className={cn(
                                "w-3 h-3 rounded-[3px]",
                                `bg-emerald-${shade}`
                            )}
                        />
                    ))}
                    <span className="text-[10px] text-gray-400 font-poppins ml-1">More</span>
                </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {dayLabels.map((d) => (
                    <div
                        key={d}
                        className="text-center text-[10px] font-semibold text-gray-400 font-poppins py-1"
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 flex-1">
                {cells.map((day, i) => {
                    if (day === null) {
                        return <div key={`empty-${i}`} />;
                    }
                    const deadline = ADMIN_DEADLINE_MAP[day];
                    const count = deadline?.count ?? 0;
                    const heatClass = getHeatColor(count, maxCount);
                    const isToday = day === today;

                    return (
                        <button
                            key={day}
                            onClick={() => count > 0 && setSelectedDay(day === selectedDay ? null : day)}
                            className={cn(
                                "relative aspect-square rounded-lg flex items-center justify-center text-xs font-medium font-poppins transition-all duration-200",
                                heatClass || "text-gray-600 hover:bg-gray-50",
                                count > 0 && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                                count === 0 && "cursor-default",
                                isToday && !heatClass && "ring-2 ring-primary/40 bg-primary/[0.05] text-primary font-bold",
                                isToday && heatClass && "ring-2 ring-primary/60",
                                selectedDay === day && "ring-2 ring-primary"
                            )}
                        >
                            {day}
                            {count > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-[8px] text-white font-bold flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected day detail */}
            {selectedData && selectedDay && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700 font-poppins">
                            {selectedData.count} deadline{selectedData.count > 1 ? "s" : ""} on Feb {selectedDay}
                        </p>
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="max-h-[80px] overflow-y-auto space-y-1">
                        {selectedData.assignments.slice(0, 4).map((a) => (
                            <p key={a.id} className="text-[11px] text-gray-500 font-poppins truncate">
                                • {a.id} — {a.title}
                            </p>
                        ))}
                        {selectedData.count > 4 && (
                            <p className="text-[11px] text-primary font-poppins font-medium">
                                +{selectedData.count - 4} more
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
