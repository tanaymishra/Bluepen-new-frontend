"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    CheckCircle,
    Users,
    Calendar,
} from "lucide-react";

// Card wrapper with entrance animation + CSS float
function FloatingCard({
    children,
    className,
    delay = 0,
    floatDuration = 6,
    floatDistance = 8,
}: {
    children: React.ReactNode;
    className: string;
    delay?: number;
    floatDuration?: number;
    floatDistance?: number;
}) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            <div
                className="animate-float"
                style={{
                    animationDuration: `${floatDuration}s`,
                    animationDelay: `${delay}s`,
                    // @ts-ignore
                    "--float-distance": `${floatDistance}px`,
                } as React.CSSProperties}
            >
                {children}
            </div>
        </motion.div>
    );
}

export default function AuthBrandPanel() {
    return (
        <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative bg-[#012551] items-center justify-center overflow-hidden">
            {/* Float animation */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(calc(-1 * var(--float-distance, 8px))); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>

            {/* Subtle dot pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Ambient glow */}
            <div className="absolute top-[15%] left-[25%] w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-[#6ec9f1]/5 rounded-full blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Logo */}
                <div className="absolute top-10 left-10 z-20">
                    <Link href="/">
                        <Image
                            src="/assets/logo/bluepenonly.svg"
                            alt="Bluepen"
                            width={120}
                            height={40}
                            priority
                            className="brightness-0 invert hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>

                {/* Card 1: Recent assignment */}
                <FloatingCard
                    className="absolute top-[12%] left-[7%] w-[280px]"
                    delay={0.3}
                    floatDuration={7}
                    floatDistance={6}
                >
                    <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <p className="text-white/90 text-sm font-semibold font-poppins mb-0.5">
                                    Marketing Strategy Report
                                </p>
                                <p className="text-white/40 text-[11px] font-poppins">
                                    University of Toronto · MBA
                                </p>
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                            <div className="text-[11px] text-white/40 font-poppins">
                                Delivered Feb 12
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="text-[11px] text-emerald-400/80 font-poppins font-medium">
                                Grade: A
                            </div>
                        </div>
                    </div>
                </FloatingCard>

                {/* Card 2: Live activity */}
                <FloatingCard
                    className="absolute top-[10%] right-[8%] w-[240px]"
                    delay={0.5}
                    floatDuration={8}
                    floatDistance={7}
                >
                    <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white/90 text-xs font-semibold font-poppins">
                                317 experts online now
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-poppins">
                                <span className="text-white/50">Available today</span>
                                <span className="text-white/80 font-medium">183</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-poppins">
                                <span className="text-white/50">Average reply</span>
                                <span className="text-[#6ec9f1] font-medium">~12 min</span>
                            </div>
                        </div>
                    </div>
                </FloatingCard>

                {/* Card 3: This week stats */}
                <FloatingCard
                    className="absolute top-[45%] left-[6%] w-[220px]"
                    delay={0.7}
                    floatDuration={9}
                    floatDistance={5}
                >
                    <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-white/40" />
                            <span className="text-white/50 text-[11px] font-poppins">
                                This week
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-white text-2xl font-bold font-montserrat">
                                284
                            </span>
                            <span className="text-emerald-400 text-xs font-medium font-poppins flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" />
                                23%
                            </span>
                        </div>
                        <p className="text-white/40 text-[11px] font-poppins">
                            Assignments completed
                        </p>
                    </div>
                </FloatingCard>

                {/* Card 4: Student count */}
                <FloatingCard
                    className="absolute top-[40%] right-[7%] w-[200px]"
                    delay={0.9}
                    floatDuration={7.5}
                    floatDistance={8}
                >
                    <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-[#6ec9f1]" />
                            <span className="text-white/50 text-[11px] font-poppins">
                                Students
                            </span>
                        </div>
                        <p className="text-white text-2xl font-bold font-montserrat mb-1">
                            5,127
                        </p>
                        <p className="text-white/40 text-[11px] font-poppins">
                            Across 12 countries
                        </p>
                    </div>
                </FloatingCard>

                {/* Card 5: Turnaround info */}
                <FloatingCard
                    className="absolute bottom-[16%] left-[10%] w-[235px]"
                    delay={1.1}
                    floatDuration={6.5}
                    floatDistance={6}
                >
                    <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4">
                        <p className="text-white/90 text-sm font-semibold font-poppins mb-1">
                            Most orders ready in 48h
                        </p>
                        <p className="text-white/40 text-[11px] font-poppins leading-relaxed">
                            Rush delivery available for urgent deadlines
                        </p>
                    </div>
                </FloatingCard>

                {/* Card 6: Quality note */}
                <FloatingCard
                    className="absolute bottom-[14%] right-[10%] w-[210px]"
                    delay={1.3}
                    floatDuration={8}
                    floatDistance={7}
                >
                    <div className="bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-[10px] font-bold text-[#6ec9f1] font-montserrat">
                                ✓
                            </div>
                            <span className="text-white/90 text-xs font-semibold font-poppins">
                                Plagiarism-free
                            </span>
                        </div>
                        <p className="text-white/40 text-[11px] font-poppins leading-relaxed">
                            Full report included with every order
                        </p>
                    </div>
                </FloatingCard>

                {/* Central tagline */}
                <motion.div
                    className="relative z-20 text-center px-8 max-w-[360px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2 className="text-[30px] xl:text-[34px] font-bold text-white font-montserrat leading-[1.15] mb-3">
                        Expert help for<br />
                        <span className="text-[#6ec9f1]">every deadline</span>
                    </h2>
                    <p className="text-white/35 text-[13px] font-poppins leading-relaxed">
                        From essays to dissertations, we connect you<br />
                        with verified academic experts
                    </p>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-10 text-[11px] text-white/20 font-poppins">
                © {new Date().getFullYear()} Bluepen
            </div>
        </div>
    );
}
