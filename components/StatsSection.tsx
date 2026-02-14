"use client";
import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
    {
        id: 1,
        value: "5k+",
        label: "Students Trusted",
        desc: "From over 5+ countries relies on our expertise.",
        bg: "bg-[#F8F9FB]", // Very light blue-gray
        text: "text-gray-900"
    },
    {
        id: 2,
        value: "8k+",
        label: "Assignments Delivered",
        desc: "On-time delivery with premium quality assurance.",
        bg: "bg-[#E6F0FF]", // Light primary blue
        text: "text-primary"
    },
    {
        id: 3,
        value: "1k+",
        label: "Subject Experts",
        desc: "PhD scholars and industry professionals.",
        bg: "bg-[#2956A8]", // Primary Blue
        text: "text-white"
    },
    {
        id: 4,
        value: "98%",
        label: "Success Rate",
        desc: "Students achieving Merit & Distinction grades.",
        bg: "bg-[#1e4690]", // Darker Blue
        text: "text-white"
    },
];

const StatsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const cards = cardsRef.current;
            const totalScroll = 2000; // Scroll distance to complete animation



            // Actual stacking animation logic:
            // We want cards to start below and slide UP into view, stacking on top of each other.
            // But standard CSS stacking context means later elements are on top.
            // So we can have them fixed in a pile and reveal them, or sticky stack.

            // Let's use a simple "Scroll slides in cards from bottom" approach pinned.

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: `+=${totalScroll}`,
                    scrub: 1,
                    pin: true,
                }
            });

            cards.forEach((card, i) => {
                if (i === 0) return; // First card is already visible

                tl.fromTo(card,
                    { y: "100%", opacity: 1, scale: 0.9 + (i * 0.02) }, // Start below, slightly smaller
                    { y: "0%", opacity: 1, scale: 1, ease: "power2.out" } // Slide up to cover previous
                );
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="bg-white">
            <div ref={triggerRef} className="h-screen w-full flex items-center justify-center relative overflow-hidden px-6 lg:px-12">
                {/* Subtle Grid Background to fill space */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="max-w-[1380px] w-full mx-auto h-full flex items-center relative">

                    {/* Left Content - Scaled up */}
                    <div className="w-full lg:w-1/2 relative z-10 hidden lg:block pr-12">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block font-poppins">Our Impact</span>
                        <h3 className="text-5xl lg:text-7xl font-bold font-montserrat text-gray-900 mb-8 leading-[1.1]">
                            Proven results <br /> that speak for <br /> <span className="text-primary">themselves.</span>
                        </h3>
                        <p className="text-gray-500 font-poppins text-lg max-w-md leading-relaxed">
                            Numbers don't lie. Join the thousands of students who have transformed their academic journey with us.
                        </p>
                    </div>

                    {/* Cards Container - Bigger and better positioned */}
                    <div className="relative w-full lg:w-1/2 h-[450px] md:h-[600px] z-20 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-xl h-full">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.id}
                                    ref={(el) => { cardsRef.current[index] = el }}
                                    className={`absolute top-0 left-0 w-full h-full rounded-[2rem] ${stat.bg} p-8 md:p-12 flex flex-col justify-between shadow-2xl border border-black/5 origin-bottom`}
                                    style={{
                                        zIndex: index + 1,
                                        transform: index === 0 ? 'none' : 'translateY(100%)'
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-7xl md:text-9xl font-bold ${stat.text} opacity-90 font-montserrat tracking-tighter`}>
                                            {stat.value}
                                        </span>
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${index > 1 ? 'border-white/20' : 'border-black/5'}`}>
                                            <span className={`text-lg font-bold ${stat.text}`}>0{index + 1}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className={`text-3xl font-bold mb-3 ${stat.text} font-montserrat`}>{stat.label}</h4>
                                        <p className={`text-xl ${index > 1 ? 'text-white/80' : 'text-gray-600'} font-poppins leading-relaxed`}>{stat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>)
};

export default StatsSection;
