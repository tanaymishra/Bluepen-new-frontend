"use client";

import React from "react";
import { motion } from "framer-motion";
import HeroSlideshow from "./sections/HeroSlideshow";
import DeadlineHeatmap from "./sections/DeadlineHeatmap";
import RecentActivity from "./sections/RecentActivity";
import AssignmentOverview from "./sections/AssignmentOverview";
import FullCalendar from "./sections/FullCalendar";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* ─── Section 1: Hero Slideshow + Heatmap Calendar ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-5"
            >
                <div className="lg:col-span-3">
                    <HeroSlideshow />
                </div>
                <div className="lg:col-span-2">
                    <DeadlineHeatmap />
                </div>
            </motion.div>

            {/* ─── Section 2: Recent Activity ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <RecentActivity />
            </motion.div>

            {/* ─── Section 3: Assignment Overview + Win/Loss ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <AssignmentOverview />
            </motion.div>

            {/* ─── Section 4: Full Calendar ─── */}
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <FullCalendar />
            </motion.div>
        </div>
    );
}
