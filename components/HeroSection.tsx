"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Users } from "lucide-react";
import InfiniteSlider from "@/components/InfiniteSlider";

const sliderItems = [
    { id: 1, img: "/page/australia.png" },
    { id: 2, img: "/page/canada.png" },
    { id: 3, img: "/page/india.png" },
    { id: 4, img: "/page/uk.png" },
    { id: 5, img: "/page/usa.png" },
];

const HeroSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-[100dvh] bg-white overflow-hidden flex items-center py-20 lg:py-0"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-blue-50/50 to-transparent -z-10" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-[1380px] w-full mx-auto px-6 lg:px-12 h-full">
                <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12 lg:gap-6">

                    {/* Left Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center mt-20 lg:mt-0 order-1 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit mb-6"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary font-montserrat">
                                Academic Excellence
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="text-4xl md:text-5xl lg:text-[64px] leading-[1.1] font-bold text-gray-900 font-montserrat mb-6"
                        >
                            We help you <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                conquer assignments
                            </span>
                            <span className="text-primary">.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-lg text-gray-600 font-poppins mb-8 max-w-lg leading-relaxed"
                        >
                            Connect with top-tier experts for assignments, research, and projects.
                            Never worry about deadlines again—we've got you covered.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                        >
                            <Link
                                href="/newPost/post"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold font-poppins shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                Post Your Assignment
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-medium font-poppins hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                            >
                                How it works
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="border-t border-gray-100 pt-8"
                        >
                            <p className="text-sm font-medium text-gray-500 font-poppins mb-4 flex items-center gap-2">
                                <Users size={16} className="text-gray-400" />
                                Trusted by students from universities in 5+ countries
                            </p>
                            <div className="w-full max-w-md grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <InfiniteSlider items={sliderItems} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual */}
                    <motion.div
                        style={{ y, opacity }}
                        className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[700px] flex items-center justify-center order-2 lg:order-2"
                    >
                        {/* Main Image */}
                        <div className="relative z-10 w-[80%] h-full flex items-end justify-center">
                            <Image
                                src="/page/heroimg.png"
                                alt="Student Success"
                                width={700}
                                height={800}
                                priority
                                className="object-contain max-h-full drop-shadow-2xl"
                            />

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="absolute top-[20%] right-0 md:top-1/4 lg:-right-8 bg-white p-3 md:p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-3 max-w-[160px] md:max-w-[200px] scale-90 md:scale-100"
                            >
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={18} fill="currentColor" className="text-white bg-green-600 rounded-full" />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-poppins">Success Rate</p>
                                    <p className="text-sm md:text-lg font-bold text-gray-900 font-montserrat">98.5%</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                                className="absolute bottom-[20%] left-0 md:bottom-1/4 lg:-left-4 bg-white p-3 md:p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-3 scale-90 md:scale-100"
                            >
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-gray-200" />
                                    ))}
                                </div>
                                <div>
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>
                                    <p className="text-[10px] md:text-xs font-semibold text-gray-700 font-poppins mt-0.5">5k+ Reviews</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Background Blob/Shape */}
                        <div className="absolute overflow-hidden inset-0 flex items-center justify-center -z-10">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[120%] h-[120%] text-blue-50/80 fill-current opacity-60">
                                <path fill="#DCE6F7" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.5,8.6,82,21.5,70.5,32.3C59,43.1,47.5,51.8,35.6,58.7C23.7,65.6,11.3,70.7,-1.8,73.8C-14.9,77,-29.3,78.2,-41.8,71.6C-54.3,65,-64.9,50.6,-71.3,35.2C-77.7,19.8,-79.9,3.4,-77.3,-11.9C-74.7,-27.2,-67.3,-41.4,-56.1,-52C-44.9,-62.6,-29.9,-69.6,-15.5,-73.2C-1.1,-76.8,12.7,-77,30.5,-83.6L44.7,-76.4Z" transform="translate(100 100)" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
