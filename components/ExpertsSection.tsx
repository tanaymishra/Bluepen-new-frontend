"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ExpertsSection = () => {
    return (
        <section className="relative bg-[#0f1629] overflow-hidden">
            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Accent glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1380px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-24 lg:py-32">

                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-blue-400 font-bold tracking-wider uppercase text-xs mb-6 block font-poppins"
                        >
                            Expert Network
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white leading-[1.1] mb-8"
                        >
                            Assignments by the{" "}
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    top 5%
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 8" fill="none">
                                    <path d="M2 6C30 2 90 2 118 6" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                                </svg>
                            </span>{" "}
                            of experts.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 font-poppins text-lg leading-relaxed mb-10 max-w-lg"
                        >
                            Every assignment is handled by rigorously vetted professionals —
                            PhD scholars, industry practitioners, and subject-matter experts
                            who have cleared our multi-stage screening process.
                        </motion.p>

                        {/* Trust metrics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-10 mb-10"
                        >
                            <div>
                                <span className="text-3xl font-bold text-white font-montserrat">1,000+</span>
                                <p className="text-sm text-gray-500 font-poppins mt-1">Vetted Experts</p>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div>
                                <span className="text-3xl font-bold text-white font-montserrat">4.9/5</span>
                                <p className="text-sm text-gray-500 font-poppins mt-1">Avg. Rating</p>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div>
                                <span className="text-3xl font-bold text-white font-montserrat">50+</span>
                                <p className="text-sm text-gray-500 font-poppins mt-1">Subjects</p>
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                href="/freelancer/signup"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold font-poppins hover:bg-gray-100 transition-colors duration-300 group"
                            >
                                Become an Expert
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <Link
                                href="/newPost/post"
                                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white rounded-full font-medium font-poppins hover:bg-white/5 transition-colors duration-300"
                            >
                                Hire an Expert
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="w-full lg:w-1/2 order-1 lg:order-2 relative"
                    >
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
                            <Image
                                src="/assets/section5.png"
                                alt="Expert network"
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white p-4 rounded-2xl shadow-2xl shadow-black/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-poppins">Acceptance Rate</p>
                                <p className="text-sm font-bold text-gray-900 font-montserrat">Only 5% make it</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ExpertsSection;
