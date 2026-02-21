"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

function FileUploadArea({ label }: { label: string }) {
    return (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-[#012551]/30 hover:bg-[#012551]/[0.02] transition-all group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#012551]/5 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#012551] transition-colors" />
            </div>
            <p className="text-[13px] font-semibold text-gray-700 font-poppins mb-1">
                {label}
            </p>
            <p className="text-[11px] text-gray-400 font-poppins">
                Drag & drop or click
            </p>
        </div>
    );
}

export default function FileUploadSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
        >
            <p className="text-[11px] font-semibold text-gray-500 font-poppins uppercase tracking-wider mb-4">
                Document Uploads
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FileUploadArea label="Guidelines" />
                <FileUploadArea label="Assignment" />
                <FileUploadArea label="Additional Files" />
            </div>
        </motion.div>
    );
}
