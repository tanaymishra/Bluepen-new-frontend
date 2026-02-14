
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { assignmentTypes } from "../constants";

interface StepOneProps {
    selectedType: string | null;
    setSelectedType: (id: string) => void;
    next: () => void;
    variants: any;
}

export default function StepOne({
    selectedType,
    setSelectedType,
    next,
    variants,
}: StepOneProps) {
    return (
        <motion.div
            key="s1"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
        >
            <div className="text-center mb-7 lg:mb-9">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-montserrat text-gray-900">
                    What do you need help with?
                </h2>
                <p className="text-gray-500 text-[13px] lg:text-[15px] font-poppins mt-1 lg:mt-2">
                    Select the category that best describes your work
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {assignmentTypes.map((type) => {
                    const Icon = type.icon;
                    const sel = selectedType === type.id;
                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            className={cn(
                                "relative text-left p-4 sm:p-5 lg:p-6 rounded-xl border-[1.5px] transition-all duration-200 group",
                                sel
                                    ? "border-primary bg-primary/[0.03] ring-1 ring-primary/10"
                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                            )}
                        >
                            {type.popular && (
                                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-widest bg-accent/20 text-amber-700 px-2 py-0.5 rounded-full font-poppins">
                                    Popular
                                </span>
                            )}
                            <div
                                className={cn(
                                    "w-9 h-9 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center mb-3 lg:mb-4 transition-colors",
                                    sel
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200/70"
                                )}
                            >
                                <Icon className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
                            </div>
                            <h3 className="font-semibold text-gray-900 font-montserrat text-[14px] lg:text-[16px] leading-snug mb-0.5 lg:mb-1">
                                {type.title}
                            </h3>
                            <p className="text-gray-500 text-[12px] lg:text-[13px] font-poppins leading-relaxed">
                                {type.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-end mt-7 lg:mt-9">
                <Button
                    onClick={next}
                    disabled={!selectedType}
                    size="lg"
                    className="w-full sm:w-auto min-w-[160px]"
                >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
}
