
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative bg-primary-dark pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28 overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle,rgba(255,255,255,.7) 1px,transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            />
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl lg:max-w-3xl mx-auto text-center px-5">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] text-white/70 text-[11px] lg:text-xs font-poppins font-medium mb-5 lg:mb-6 tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
                        Matched with an expert in under 30 minutes
                    </span>
                    <h1 className="text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-bold text-white font-montserrat leading-[1.15] mb-3 lg:mb-4">
                        Post Your Assignment
                    </h1>
                    <p className="text-white/45 text-sm sm:text-[15px] lg:text-base font-poppins leading-relaxed max-w-md lg:max-w-lg mx-auto">
                        Tell us what you need — we&apos;ll connect you with a verified expert
                        who specialises in your subject.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
