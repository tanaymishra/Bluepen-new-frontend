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
        <div className="relative rounded-2xl overflow-hidden h-full min-h-[220px] bg-[#012551]">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/[0.04] rounded-full -translate-y-1/3 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/[0.03] rounded-full translate-y-1/3 -translate-x-1/4" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 p-6 flex flex-col justify-between"
                >
                    {/* Top */}
                    <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white/80" />
                        </div>
                        {slide.type === "weather" && (
                            <Sun className="w-10 h-10 text-[#F8D881] opacity-50" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="mt-4">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-white/50 font-poppins font-semibold">
                            {slide.title}
                        </p>
                        <h3 className="text-xl font-bold text-white font-montserrat mt-1">
                            {slide.subtitle}
                        </h3>
                        <p className="text-2xl font-extrabold text-[#F8D881] font-montserrat mt-1">
                            {slide.highlight}
                        </p>
                        {slide.meta && (
                            <p className="text-xs text-white/60 font-poppins mt-2">
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
                    className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
                </button>
                <div className="flex items-center gap-1.5">
                    {ADMIN_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                i === current
                                    ? "w-5 bg-[#F8D881]"
                                    : "w-1.5 bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
                <button
                    onClick={next}
                    className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                </button>
            </div>
        </div>
    );
}
