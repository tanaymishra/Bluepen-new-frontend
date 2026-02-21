"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const UPLOAD_SLOTS = ["Guidelines", "Assignment File", "Supporting Docs"];

export default function FileUploads() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
            <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#012551]/5 flex items-center justify-center">
                    <Upload className="w-3.5 h-3.5 text-[#012551]" />
                </div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">File Uploads</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {UPLOAD_SLOTS.map(label => (
                    <label
                        key={label}
                        className="flex flex-col items-center justify-center gap-2.5 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer group hover:border-[#012551]/30 hover:bg-[#012551]/[0.02] transition-all text-center"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#012551]/5 flex items-center justify-center transition-colors">
                            <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#012551] transition-colors" />
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-gray-600 font-poppins">{label}</p>
                            <p className="text-[11px] text-gray-400 font-poppins mt-0.5">Click to upload</p>
                        </div>
                    </label>
                ))}
            </div>
        </motion.div>
    );
}
