
import React from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5 lg:space-y-2">
            <Label className="text-[13px] lg:text-[14px]">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-[12px] lg:text-[13px] text-red-500 font-poppins flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}
