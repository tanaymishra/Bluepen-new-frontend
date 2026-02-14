"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cloud,
    Sun,
    Award,
    UserCheck,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_SLIDES, type AdminSlide } from "@/lib/static";

const slideIcons: Record<AdminSlide["type"], React.ElementType> = {
    weather: Cloud,
    freelancer_of_month: Award,
    pm_of_month: UserCheck,
};

const slideBg: Record<AdminSlide["type"], string> = {
    weather: "from-sky-500/10 to-blue-500/5",
    freelancer_of_month: "from-primary/10 to-primary/5",
    pm_of_month: "from-indigo-500/10 to-primary/5",
};

const slideIconBg: Record<AdminSlide["type"], string> = {
    weather: "bg-sky-500/10 text-sky-600",
    freelancer_of_month: "bg-primary/10 text-primary",
    pm_of_month: "bg-indigo-500/10 text-indigo-600",
};

export default function HeroSlideshow() {
    const [current, setCurrent] = useState(0);
    const total = ADMIN_SLIDES.length;

    const next = useCallback(() => setCurrent((p) => (p + 1) % total), [total]);
    const prev = useCallback(() => setCurrent((p) => (p - 1 + total) % total), [total]);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = ADMIN_SLIDES[current];
    const Icon = slideIcons[slide.type];

    return (
        <div className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden h-full min-h-[220px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br p-6 flex flex-col justify-between",
                        slideBg[slide.type]
                    )}
                >
                    {/* Top */}
                    <div className="flex items-start justify-between">
                        <div
                            className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center",
                                slideIconBg[slide.type]
                            )}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                        {slide.type === "weather" && (
                            <Sun className="w-10 h-10 text-amber-400 opacity-40" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="mt-4">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-gray-400 font-poppins font-semibold">
                            {slide.title}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 font-montserrat mt-1">
                            {slide.subtitle}
                        </h3>
                        <p className="text-2xl font-extrabold text-primary font-montserrat mt-1">
                            {slide.highlight}
                        </p>
                        {slide.meta && (
                            <p className="text-xs text-gray-500 font-poppins mt-2">
                                {slide.meta}
                            </p>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                <button
                    onClick={prev}
                    className="w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <div className="flex items-center gap-1.5">
                    {ADMIN_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                i === current
                                    ? "w-5 bg-primary"
                                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={next}
                    className="w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
