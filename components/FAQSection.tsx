"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqData = [
    {
        question: "What services does Bluepen offer?",
        answer:
            "We provide comprehensive academic assistance including assignment writing, dissertation and thesis support (Master's & PhD), coding projects, and professional document crafting (SOPs, LORs). We also offer plagiarism checks via Turnitin.",
    },
    {
        question: "Who will work on my assignment?",
        answer:
            "Your project is assigned to a subject-matter expert with relevant academic qualifications. Our team consists of PhD scholars, industry professionals, and experienced academic writers who have passed our rigorous vetting process.",
    },
    {
        question: "Can I request revisions?",
        answer:
            "Absolutely. We offer free revisions to ensure the final deliverable meets your exact requirements. Simply provide your feedback, and our experts will refine the work until you are satisfied, as per our revision policy.",
    },
    {
        question: "Is my personal information safe?",
        answer:
            "Yes, we prioritize your privacy. All personal details and assignment data are handled with strict confidentiality. We do not share your information with third parties.",
    },
];

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-[1380px] mx-auto px-6 lg:px-12">

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Header */}
                    <div className="lg:w-1/3">
                        <span className="text-primary font-bold tracking-wider uppercase text-xs mb-4 block font-poppins">
                            FAQ
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-gray-900 leading-tight mb-6">
                            Common <br /> questions.
                        </h2>
                        <p className="text-gray-500 font-poppins text-lg">
                            Everything you need to know about our services and process.
                        </p>
                    </div>

                    {/* Accordion */}
                    <div className="lg:w-2/3 space-y-4">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`border rounded-2xl transition-all duration-300 ${activeIndex === index ? 'border-primary/20 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                                <button
                                    onClick={() => toggle(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className={`font-bold font-montserrat text-lg ${activeIndex === index ? 'text-primary' : 'text-gray-900'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-gray-600 font-poppins leading-relaxed border-t border-transparent">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FAQSection;
