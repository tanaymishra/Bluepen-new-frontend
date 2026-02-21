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
    icon: Icon,
}: PersonSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[380px] sm:w-[420px]">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-[18px] font-bold font-montserrat text-gray-900">
                        {title}
                    </SheetTitle>
                    <SheetDescription className="text-[13px] text-gray-400 font-poppins">
                        {description}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-2">
                    {people.map((person) => {
                        const isActive = person === currentPerson;
                        return (
                            <button
                                key={person}
                                onClick={() => {
                                    onSelect(person);
                                    onOpenChange(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left",
                                    isActive
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-500"
                                    )}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            "text-[14px] font-semibold font-poppins",
                                            isActive ? "text-primary" : "text-gray-800"
                                        )}
                                    >
                                        {person}
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-poppins">
                                        Available
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
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
