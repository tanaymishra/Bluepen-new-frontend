"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssignmentHeaderProps {
    assignmentId: string;
}

export default function AssignmentHeader({ assignmentId }: AssignmentHeaderProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5"
        >
            <div>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1 text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors group mb-1"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    back
                </button>
                <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 font-montserrat">
                    Assignment #{assignmentId}
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                </Button>
            </div>
        </motion.div>
    );
}
