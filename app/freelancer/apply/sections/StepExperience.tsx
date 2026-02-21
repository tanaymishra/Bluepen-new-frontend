"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useFreelancerApplyStore } from "../store";

export default function StepExperience() {
    const {
        wordsPerDay, setWordsPerDay,
        linkedin, setLinkedin,
        workLinks, addWorkLink, removeWorkLink, updateWorkLink,
        pastExperience, setPastExperience,
    } = useFreelancerApplyStore();

    const wordCount = pastExperience.trim().split(/\s+/).filter(Boolean).length;

    return (
        <>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-900 font-montserrat">
                Experience & Portfolio
            </h2>
            <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6">
                Tell us about your writing experience.
            </p>

            <div className="space-y-5">
                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Words you can write per day
                    </Label>
                    <Input
                        type="number"
                        min="100"
                        placeholder="e.g. 3000"
                        value={wordsPerDay}
                        onChange={(e) => setWordsPerDay(e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        LinkedIn Profile{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Input
                        placeholder="https://linkedin.com/in/yourname"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                        Published Work Links{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    {workLinks.map((link, i) => (
                        <div key={i} className="flex gap-2">
                            <Input
                                placeholder="https://..."
                                value={link}
                                onChange={(e) => updateWorkLink(i, e.target.value)}
                            />
                            {workLinks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeWorkLink(i)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addWorkLink}
                        className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add another link
                    </button>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                            Past Experience
                        </Label>
                        <span
                            className={cn(
                                "text-[11px] font-poppins tabular-nums",
                                wordCount >= 50 ? "text-emerald-500" : "text-gray-400"
                            )}
                        >
                            {wordCount}/50 words min
                        </span>
                    </div>
                    <textarea
                        placeholder="Describe your writing experience, areas of expertise, academic background, notable projects..."
                        value={pastExperience}
                        onChange={(e) => setPastExperience(e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-800 font-poppins placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                </div>
            </div>
        </>
    );
}
