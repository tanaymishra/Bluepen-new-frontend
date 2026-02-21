"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Paperclip } from "lucide-react";

function FileUploadArea({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
    return (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-primary/40 hover:bg-primary/[0.02] transition-all group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/5 transition-colors">
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-[13px] font-semibold text-gray-700 font-poppins mb-1">
                {label}
            </p>
            <p className="text-[11px] text-gray-400 font-poppins">
                Drag & drop or click to upload
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
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 font-montserrat">
                    File Uploads
                </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUploadArea label="Guidelines" icon={FileText} />
                <FileUploadArea label="Assignment" icon={FileText} />
                <FileUploadArea label="Additional Files" icon={Paperclip} />
            </div>
        </motion.div>
    );
}
