"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AssignmentNotFound({ id }: { id: string }) {
    return (
        <div className="max-w-[900px] mx-auto py-20 text-center">
            <p className="text-[15px] font-medium text-gray-500 font-poppins mb-2">
                Assignment not found
            </p>
            <p className="text-[13px] text-gray-400 font-poppins mb-6">
                The assignment "{id}" does not exist.
            </p>
            <Button asChild>
                <Link href="/admin/assignments">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Assignments
                </Link>
            </Button>
        </div>
    );
}
