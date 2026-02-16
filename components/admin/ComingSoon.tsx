"use client";

import React from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-primary/[0.06] flex items-center justify-center mb-6">
                <Construction className="w-9 h-9 text-primary/60" />
            </div>
            <h1 className="text-[26px] sm:text-[32px] font-bold text-gray-900 font-montserrat mb-2">
                Coming Soon
            </h1>
            <p className="text-[14px] text-gray-400 font-poppins max-w-sm leading-relaxed">
                The <span className="font-semibold text-gray-600">{title}</span> module is currently under development. Stay tuned!
            </p>
            <div className="mt-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-primary/25 animate-pulse [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-primary/15 animate-pulse [animation-delay:0.4s]" />
            </div>
        </motion.div>
    );
}
