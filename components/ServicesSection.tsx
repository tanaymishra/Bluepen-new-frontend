"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const services = [
    {
        id: "assignments",
        title: "Assignments",
        desc: "Professionally crafted assignments with comprehensive analysis, precise formatting, and scholarly excellence across every subject.",
        img: "/section4/research.png",
        span: "md:col-span-7",
        height: "h-[380px] md:h-[420px]",
        variant: "light" as const,
    },
    {
        id: "dissertation",
        title: "Masters Dissertations & Thesis",
        desc: "In-depth research, clear structure, and meticulous attention to bring your academic ideas to life.",
        img: "/section4/dissertation.png",
        span: "md:col-span-5",
        height: "h-[380px] md:h-[420px]",
        variant: "dark" as const,
    },
    {
        id: "phd",
        title: "PhD Thesis & Proposal",
        desc: "Expert assistance from proposal to defense. Clean methodology, thorough literature reviews, and publication-ready work.",
        img: "/section4/coding.png",
        span: "md:col-span-5",
        height: "h-[380px] md:h-[420px]",
        variant: "light" as const,
    },
    {
        id: "applications",
        title: "University Applications",
        desc: "Compelling SOPs and LORs that highlight your unique strengths. Stand out in academic and professional applications.",
        img: "/section4/sop.png",
        span: "md:col-span-7",
        height: "h-[380px] md:h-[420px]",
        variant: "accent" as const,
    },
];

const cardVariants = {
    light: {
        bg: "bg-white",
        border: "border-gray-200/60",
        title: "text-gray-900",
        desc: "text-gray-500",
        tag: "bg-gray-100 text-gray-600",
        overlay: "from-white/90 via-white/60 to-transparent",
    },
    dark: {
        bg: "bg-[#1a1a2e]",
        border: "border-[#2a2a4a]",
        title: "text-white",
        desc: "text-gray-400",
        tag: "bg-white/10 text-white/80",
        overlay: "from-[#1a1a2e]/95 via-[#1a1a2e]/70 to-transparent",
    },
    accent: {
        bg: "bg-primary",
        border: "border-primary",
        title: "text-white",
        desc: "text-blue-100",
        tag: "bg-white/15 text-white/90",
        overlay: "from-primary/95 via-primary/70 to-transparent",
    },
};

const ServicesSection = () => {
    return (
        <section className="py-28 bg-white relative">
            <div className="max-w-[1380px] mx-auto px-6 lg:px-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl"
                    >
                        <span className="text-primary font-bold tracking-wider uppercase text-xs mb-4 block font-poppins">
                            Our Services
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-gray-900 leading-[1.1]">
                            We do it <span className="text-primary">all.</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 font-poppins text-lg max-w-md md:text-right leading-relaxed"
                    >
                        Every aspect is covered, guaranteeing a flawless result — from undergraduate essays to doctoral research.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {services.map((service, index) => {
                        const v = cardVariants[service.variant];
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`${service.span} ${service.height} ${v.bg} rounded-3xl border ${v.border} overflow-hidden relative group cursor-pointer`}
                            >
                                {/* Image — fills the card, visible on the right/bottom */}
                                <div className="absolute inset-0 flex items-end justify-end pointer-events-none">
                                    <div className="relative w-[65%] h-[70%] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out">
                                        <Image
                                            src={service.img}
                                            alt={service.title}
                                            fill
                                            className="object-contain object-right-bottom"
                                        />
                                    </div>
                                </div>

                                {/* Gradient overlay for text readability */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${v.overlay} pointer-events-none`} />

                                {/* Content — top-left */}
                                <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                                    <span className={`${v.tag} text-xs font-bold uppercase tracking-[.15em] px-3 py-1.5 rounded-full w-fit font-poppins mb-auto`}>
                                        {service.title}
                                    </span>

                                    <div className="mt-auto max-w-[280px]">
                                        <h3 className={`text-2xl font-bold font-montserrat ${v.title} mb-3 leading-tight`}>
                                            {service.title}
                                        </h3>
                                        <p className={`${v.desc} font-poppins text-[15px] leading-relaxed`}>
                                            {service.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover border glow */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 flex justify-center"
                >
                    <Link
                        href="/newPost/post"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold font-poppins hover:bg-gray-800 transition-colors duration-300 group"
                    >
                        Get Started Today
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

export default ServicesSection;
