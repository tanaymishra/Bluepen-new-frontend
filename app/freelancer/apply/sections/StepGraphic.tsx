"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepGraphicProps {
    step: number;
}

/* ── Per-step config ── */
const stepConfig = [
    {
        label: "Specialisation",
        tagline: "Pick your expertise",
        accent: "#3B82F6",
        accentLight: "#93C5FD",
        accentFaint: "#DBEAFE",
    },
    {
        label: "Experience",
        tagline: "Show your skills",
        accent: "#10B981",
        accentLight: "#6EE7B7",
        accentFaint: "#D1FAE5",
    },
    {
        label: "Resume & Verify",
        tagline: "Almost there",
        accent: "#F59E0B",
        accentLight: "#FCD34D",
        accentFaint: "#FEF3C7",
    },
    {
        label: "Your Details",
        tagline: "Final step",
        accent: "#8B5CF6",
        accentLight: "#C4B5FD",
        accentFaint: "#EDE9FE",
    },
];

/*
 * Each step has a set of SVG paths/shapes that morph from one to the next.
 * We use framer-motion's layout animations + path interpolation.
 */

/* Abstract blob paths — each step morphs between these */
const blobPaths = [
    // Step 1 — rounded square-ish
    "M200,80 C260,80 320,120 320,200 C320,280 260,320 200,320 C140,320 80,280 80,200 C80,120 140,80 200,80Z",
    // Step 2 — organic blob
    "M200,70 C280,70 340,130 330,200 C320,280 270,330 200,330 C130,330 70,280 80,200 C90,120 120,70 200,70Z",
    // Step 3 — shield-like
    "M200,60 C280,60 330,110 330,190 C330,270 270,340 200,340 C130,340 70,270 70,190 C70,110 120,60 200,60Z",
    // Step 4 — circle
    "M200,65 C275,65 335,125 335,200 C335,275 275,335 200,335 C125,335 65,275 65,200 C65,125 125,65 200,65Z",
];

/* Inner decorative paths */
const innerPaths = [
    // Step 1 — grid dots pattern (represented as a path)
    "M160,160 L240,160 L240,240 L160,240 Z M180,180 L220,180 L220,220 L180,220 Z",
    // Step 2 — pen stroke
    "M150,250 Q170,180 200,170 Q230,160 250,200 Q260,230 230,250 Q200,260 180,240 Z",
    // Step 3 — upload arrow
    "M200,150 L230,190 L215,190 L215,250 L185,250 L185,190 L170,190 Z",
    // Step 4 — person silhouette
    "M200,150 C220,150 230,165 230,180 C230,195 220,210 200,210 C180,210 170,195 170,180 C170,165 180,150 200,150 M155,260 C155,235 175,220 200,220 C225,220 245,235 245,260 Z",
];

/* Floating satellite shapes */
const satellites = [
    // Step 1
    [
        { cx: 100, cy: 100, r: 12, delay: 0 },
        { cx: 300, cy: 120, r: 8, delay: 0.3 },
        { cx: 280, cy: 300, r: 10, delay: 0.6 },
    ],
    // Step 2
    [
        { cx: 120, cy: 280, r: 10, delay: 0.1 },
        { cx: 290, cy: 100, r: 14, delay: 0.4 },
        { cx: 100, cy: 180, r: 8, delay: 0.2 },
    ],
    // Step 3
    [
        { cx: 110, cy: 130, r: 10, delay: 0 },
        { cx: 300, cy: 260, r: 12, delay: 0.5 },
        { cx: 260, cy: 100, r: 6, delay: 0.3 },
    ],
    // Step 4
    [
        { cx: 130, cy: 290, r: 8, delay: 0.2 },
        { cx: 280, cy: 130, r: 12, delay: 0 },
        { cx: 100, cy: 200, r: 10, delay: 0.4 },
    ],
];

/* Orbit ring radii per step */
const orbitRadii = [130, 120, 140, 125];

export default function StepGraphic({ step }: StepGraphicProps) {
    const idx = step - 1;
    const config = stepConfig[idx];
    const sats = satellites[idx];

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Subtle radial bg */}
            <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${config.accentFaint} 0%, transparent 70%)`,
                }}
            />

            {/* SVG scene */}
            <svg
                viewBox="0 0 400 400"
                className="w-[340px] h-[340px] lg:w-[400px] lg:h-[400px] xl:w-[440px] xl:h-[440px]"
                fill="none"
            >
                {/* Orbit ring */}
                <motion.circle
                    cx={200}
                    cy={200}
                    r={orbitRadii[idx]}
                    stroke={config.accentLight}
                    strokeWidth={1}
                    strokeDasharray="6 6"
                    fill="none"
                    opacity={0.5}
                    animate={{ r: orbitRadii[idx] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* Main blob — morphs between steps */}
                <motion.path
                    d={blobPaths[idx]}
                    fill={config.accentFaint}
                    stroke={config.accentLight}
                    strokeWidth={1.5}
                    animate={{ d: blobPaths[idx] }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                />

                {/* Inner decorative shape — morphs */}
                <AnimatePresence mode="wait">
                    <motion.path
                        key={`inner-${step}`}
                        d={innerPaths[idx]}
                        fill="none"
                        stroke={config.accent}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        exit={{ opacity: 0, pathLength: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </AnimatePresence>

                {/* Center accent dot */}
                <motion.circle
                    cx={200}
                    cy={200}
                    r={4}
                    fill={config.accent}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Floating satellites */}
                {sats.map((s, i) => (
                    <motion.circle
                        key={`sat-${step}-${i}`}
                        cx={s.cx}
                        cy={s.cy}
                        r={s.r}
                        fill={config.accentLight}
                        opacity={0.6}
                        animate={{
                            cy: [s.cy, s.cy - 10, s.cy, s.cy + 8, s.cy],
                            cx: [s.cx, s.cx + 6, s.cx, s.cx - 6, s.cx],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            delay: s.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Connecting lines from satellites to center */}
                {sats.map((s, i) => (
                    <motion.line
                        key={`line-${step}-${i}`}
                        x1={200}
                        y1={200}
                        x2={s.cx}
                        y2={s.cy}
                        stroke={config.accentLight}
                        strokeWidth={0.5}
                        opacity={0.25}
                        strokeDasharray="4 4"
                        animate={{
                            x2: [s.cx, s.cx + 6, s.cx, s.cx - 6, s.cx],
                            y2: [s.cy, s.cy - 10, s.cy, s.cy + 8, s.cy],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            delay: s.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Step number — large, faded */}
                <motion.text
                    x={200}
                    y={370}
                    textAnchor="middle"
                    className="font-montserrat"
                    fontSize={48}
                    fontWeight={800}
                    fill={config.accentLight}
                    opacity={0.3}
                    key={`num-${step}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.3, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    0{step}
                </motion.text>
            </svg>

            {/* Text below the SVG */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`text-${step}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-12 left-0 right-0 text-center px-8"
                >
                    <p
                        className="text-[13px] font-semibold uppercase tracking-[0.15em] font-poppins mb-1"
                        style={{ color: config.accent }}
                    >
                        Step {step} of 4
                    </p>
                    <h3 className="text-[22px] lg:text-[26px] font-bold text-gray-800 font-montserrat">
                        {config.label}
                    </h3>
                    <p className="text-[13px] text-gray-400 font-poppins mt-1">
                        {config.tagline}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-1.5 justify-center mt-5">
                        {[1, 2, 3, 4].map((s) => (
                            <motion.div
                                key={s}
                                className="h-1 rounded-full"
                                style={{
                                    backgroundColor:
                                        s <= step ? config.accent : "#E5E7EB",
                                }}
                                animate={{
                                    width: s === step ? 24 : 8,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
