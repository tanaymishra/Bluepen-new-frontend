"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Briefcase, Mail } from "lucide-react";
import { useFreelancerApplyStore } from "../store";

const SPECIALISATIONS = [
    "Business & Management",
    "Engineering",
    "Medical & Health Sciences",
    "Law",
    "Computer Science",
    "Arts & Humanities",
    "Commerce & Accounting",
    "Science",
    "Education",
    "Social Sciences",
    "Architecture & Design",
    "Media & Communications",
];

export default function StepSpecialisation() {
    const { email, setEmail, specialisations, toggleSpecialisation, error } =
        useFreelancerApplyStore();

    return (
        <>
            <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-[18px] h-[18px] text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary font-poppins">
                    Freelancer Application
                </span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat mt-3">
                What are you best at?
            </h2>
            <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6 leading-relaxed">
                Select the subjects you can write about. You can pick multiple.
            </p>

            <div className="space-y-5">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Your Email
                    </Label>
                    <Input
                        type="email"
                        placeholder="you@example.co.uk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="w-[18px] h-[18px]" />}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Specialisations
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        {SPECIALISATIONS.map((s) => {
                            const active = specialisations.includes(s);
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => toggleSpecialisation(s)}
                                    className={cn(
                                        "flex items-center gap-2.5 p-3 rounded-xl border text-left text-[13px] font-poppins transition-all",
                                        active
                                            ? "border-primary bg-primary/[0.05] text-primary font-medium"
                                            : "border-gray-100 text-gray-600 hover:border-primary/20 hover:bg-primary/[0.02]"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                                            active ? "bg-primary border-primary" : "border-gray-300"
                                        )}
                                    >
                                        {active && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
