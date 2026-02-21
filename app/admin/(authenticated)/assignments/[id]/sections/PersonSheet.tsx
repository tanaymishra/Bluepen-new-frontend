"use client";

import React from "react";
import { Check } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface PersonSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    people: readonly string[];
    currentPerson: string;
    onSelect: (name: string) => void;
    icon: React.ElementType;
}

export default function PersonSheet({
    open,
    onOpenChange,
    title,
    description,
    people,
    currentPerson,
    onSelect,
}: PersonSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[420px] sm:w-[480px]">
                <SheetHeader className="mb-6 pb-4 border-b border-gray-100">
                    <SheetTitle className="text-[20px] font-bold font-montserrat text-gray-900">
                        {title}
                    </SheetTitle>
                    <SheetDescription className="text-[13px] text-gray-500 font-poppins">
                        {description}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-2.5">
                    {people.map((person) => {
                        const isActive = person === currentPerson;
                        const initials = person.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        
                        return (
                            <button
                                key={person}
                                onClick={() => {
                                    onSelect(person);
                                    onOpenChange(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group",
                                    isActive
                                        ? "border-[#012551] bg-[#012551]/5 shadow-sm"
                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                        isActive
                                            ? "bg-[#012551] text-white"
                                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                    )}
                                >
                                    <span className="text-[14px] font-bold font-montserrat">
                                        {initials}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            "text-[15px] font-semibold font-poppins",
                                            isActive ? "text-[#012551]" : "text-gray-900"
                                        )}
                                    >
                                        {person}
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-poppins mt-0.5">
                                        Available for assignment
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="w-7 h-7 rounded-full bg-[#F8D881] flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-[#012551]" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
}
