"use client";
import React from "react";
import { motion } from "framer-motion";

/* -------- Custom SVG Illustrations -------- */
const LoginIllustration = () => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Phone Body */}
        <rect x="55" y="10" width="90" height="160" rx="16" fill="#EBF1FA" stroke="#2956A8" strokeWidth="2" />
        <rect x="63" y="26" width="74" height="120" rx="4" fill="white" />
        {/* Screen Content - WhatsApp style */}
        <circle cx="100" cy="60" r="14" fill="#2956A8" opacity="0.1" />
        <path d="M95 60L99 64L106 56" stroke="#2956A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Input fields */}
        <rect x="73" y="82" width="54" height="8" rx="4" fill="#F0F4FA" />
        <rect x="73" y="96" width="54" height="8" rx="4" fill="#F0F4FA" />
        {/* Login button */}
        <rect x="73" y="114" width="54" height="12" rx="6" fill="#2956A8" />
        {/* Notch */}
        <rect x="85" y="14" width="30" height="6" rx="3" fill="#D4DFF0" />
        {/* Google + WhatsApp icons (abstract) */}
        <circle cx="90" cy="140" r="6" fill="#F0F4FA" />
        <circle cx="110" cy="140" r="6" fill="#E8F5E9" />
        {/* Signal waves */}
        <path d="M155 35C160 30 160 45 155 40" stroke="#2956A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <path d="M162 30C170 23 170 50 162 43" stroke="#2956A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </svg>
);

const UploadIllustration = () => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main document */}
        <rect x="50" y="30" width="80" height="110" rx="8" fill="white" stroke="#2956A8" strokeWidth="2" />
        {/* Folded corner */}
        <path d="M110 30L130 30L130 50L110 50Z" fill="#EBF1FA" stroke="#2956A8" strokeWidth="1.5" />
        <path d="M110 30L110 50L130 50" stroke="#2956A8" strokeWidth="1.5" fill="none" />
        {/* Text lines */}
        <rect x="62" y="60" width="40" height="4" rx="2" fill="#D4DFF0" />
        <rect x="62" y="72" width="55" height="4" rx="2" fill="#D4DFF0" />
        <rect x="62" y="84" width="35" height="4" rx="2" fill="#D4DFF0" />
        <rect x="62" y="96" width="50" height="4" rx="2" fill="#D4DFF0" />
        {/* Upload arrow */}
        <circle cx="90" cy="118" r="12" fill="#2956A8" opacity="0.1" />
        <path d="M90 124V112M90 112L85 117M90 112L95 117" stroke="#2956A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Second document (behind, offset) */}
        <rect x="60" y="22" width="80" height="110" rx="8" fill="#F5F8FC" stroke="#D4DFF0" strokeWidth="1" opacity="0.5" transform="translate(18, -8) rotate(6, 100, 77)" />
        {/* Floating elements */}
        <circle cx="160" cy="50" r="8" fill="#EBF1FA" />
        <path d="M157 50L160 53L163 48" stroke="#2956A8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="100" r="6" fill="#EBF1FA" />
        <rect x="37" y="98" width="6" height="4" rx="1" fill="#2956A8" opacity="0.3" />
    </svg>
);

const RelaxIllustration = () => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Dashboard window */}
        <rect x="25" y="20" width="150" height="130" rx="12" fill="white" stroke="#2956A8" strokeWidth="1.5" />
        {/* Title bar */}
        <rect x="25" y="20" width="150" height="28" rx="12" fill="#F5F8FC" />
        <rect x="25" y="36" width="150" height="12" fill="#F5F8FC" />
        <circle cx="40" cy="34" r="4" fill="#FF6B6B" opacity="0.6" />
        <circle cx="52" cy="34" r="4" fill="#FFD93D" opacity="0.6" />
        <circle cx="64" cy="34" r="4" fill="#6BCB77" opacity="0.6" />
        {/* Progress bars */}
        <rect x="40" y="58" width="120" height="6" rx="3" fill="#EBF1FA" />
        <rect x="40" y="58" width="108" height="6" rx="3" fill="#2956A8" />
        <rect x="40" y="74" width="120" height="6" rx="3" fill="#EBF1FA" />
        <rect x="40" y="74" width="72" height="6" rx="3" fill="#2956A8" opacity="0.6" />
        <rect x="40" y="90" width="120" height="6" rx="3" fill="#EBF1FA" />
        <rect x="40" y="90" width="96" height="6" rx="3" fill="#2956A8" opacity="0.3" />
        {/* Status badge */}
        <rect x="40" y="108" width="60" height="18" rx="9" fill="#E8F5E9" />
        <circle cx="52" cy="117" r="3" fill="#4CAF50" />
        <rect x="60" y="114" width="30" height="6" rx="3" fill="#81C784" />
        {/* Checkmark */}
        <rect x="110" y="108" width="50" height="18" rx="9" fill="#EBF1FA" />
        <rect x="118" y="114" width="34" height="6" rx="3" fill="#D4DFF0" />
        {/* Floating notification */}
        <rect x="145" y="8" width="40" height="20" rx="6" fill="#2956A8" opacity="0.9" />
        <rect x="152" y="15" width="26" height="4" rx="2" fill="white" opacity="0.8" />
    </svg>
);

/* -------- Main Component -------- */
const steps = [
    {
        num: "01",
        title: "Create Your Account",
        desc: "Sign up in seconds with WhatsApp OTP or Google Sign-in. No lengthy forms, no hassle — just instant access to expert academic help.",
        Illustration: LoginIllustration,
    },
    {
        num: "02",
        title: "Post Your Assignment",
        desc: "Upload your assignment brief, set your deadline, and share any reference materials. Our smart form guides you through every detail.",
        Illustration: UploadIllustration,
    },
    {
        num: "03",
        title: "Sit Back & Track",
        desc: "Monitor real-time progress from your personal dashboard. Get notified at every milestone while our vetted experts deliver quality work.",
        Illustration: RelaxIllustration,
    },
];

const ProcessSection = () => {
    return (
        <section className="py-28 bg-[#F7F9FC] relative overflow-hidden">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#2956A8 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div className="max-w-[1380px] mx-auto px-6 lg:px-12 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-xl mb-20"
                >
                    <span className="text-primary font-bold tracking-wider uppercase text-xs mb-4 block font-poppins">
                        How It Works
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-gray-900 leading-[1.15]">
                        From sign-up to <br className="hidden md:block" />
                        submission, <span className="text-primary">effortlessly.</span>
                    </h2>
                </motion.div>

                {/* Staggered Cards */}
                <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">

                    {/* Card 1 — spans col 1-4, starts at top */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0 }}
                        className="lg:col-span-4 bg-white rounded-3xl p-8 border border-gray-200/60 hover:border-primary/20 transition-colors duration-500 group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[80px] font-bold font-montserrat text-primary/[0.07] leading-none absolute top-4 right-6 select-none">01</span>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs font-bold uppercase tracking-[.2em] text-primary font-poppins">Step One</span>
                        </div>
                        <div className="w-full h-48 mb-8 flex items-center justify-center">
                            <LoginIllustration />
                        </div>
                        <h3 className="text-xl font-bold font-montserrat text-gray-900 mb-3">{steps[0].title}</h3>
                        <p className="text-gray-500 font-poppins leading-relaxed text-[15px]">{steps[0].desc}</p>
                    </motion.div>

                    {/* Card 2 — spans col 5-8, offset down */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="lg:col-span-4 lg:mt-16 bg-primary rounded-3xl p-8 border border-primary hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[80px] font-bold font-montserrat text-white/[0.07] leading-none absolute top-4 right-6 select-none">02</span>
                            <div className="w-2 h-2 rounded-full bg-white" />
                            <span className="text-xs font-bold uppercase tracking-[.2em] text-blue-200 font-poppins">Step Two</span>
                        </div>
                        <div className="w-full h-48 mb-8 flex items-center justify-center [&_svg_rect]:!stroke-white/40 [&_svg_circle]:!stroke-white/40 [&_svg_path]:!stroke-white/60 [&_svg_rect[fill='white']]:!fill-white/10 [&_svg_rect[fill='#EBF1FA']]:!fill-white/10 [&_svg_rect[fill='#D4DFF0']]:!fill-white/20 [&_svg_rect[fill='#F5F8FC']]:!fill-white/5">
                            <UploadIllustration />
                        </div>
                        <h3 className="text-xl font-bold font-montserrat text-white mb-3">{steps[1].title}</h3>
                        <p className="text-blue-100 font-poppins leading-relaxed text-[15px]">{steps[1].desc}</p>
                    </motion.div>

                    {/* Card 3 — spans col 9-12, starts at top */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-4 bg-white rounded-3xl p-8 border border-gray-200/60 hover:border-primary/20 transition-colors duration-500 group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[80px] font-bold font-montserrat text-primary/[0.07] leading-none absolute top-4 right-6 select-none">03</span>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs font-bold uppercase tracking-[.2em] text-primary font-poppins">Step Three</span>
                        </div>
                        <div className="w-full h-48 mb-8 flex items-center justify-center">
                            <RelaxIllustration />
                        </div>
                        <h3 className="text-xl font-bold font-montserrat text-gray-900 mb-3">{steps[2].title}</h3>
                        <p className="text-gray-500 font-poppins leading-relaxed text-[15px]">{steps[2].desc}</p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
