"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Mail,
    Phone,
    MessageSquare,
    ChevronDown,
    Send,
} from "lucide-react";

/* ────────────────────────────────────────── FAQ data */

const FAQ_ITEMS = [
    {
        question: "How does Bluepen work?",
        answer: "Submit your assignment details through our platform. We match you with a qualified academic expert who works on your assignment. You receive updates at each stage, and the completed work is delivered before your deadline.",
    },
    {
        question: "How long does it take to complete an assignment?",
        answer: "Turnaround time depends on the word count, complexity, and academic level. Most assignments are completed within 3\u20137 days. Rush orders can be completed in 24\u201348 hours for an additional fee.",
    },
    {
        question: "What if I need revisions?",
        answer: "We offer free revisions within the original scope of your assignment. Simply request a revision through the assignment detail page, and your expert will make the necessary changes promptly.",
    },
    {
        question: "How do I track my assignment progress?",
        answer: "Each assignment has a detailed progress page showing the current stage, activity timeline, and expert updates. You\u2019ll also receive notifications at key milestones.",
    },
    {
        question: "Is my information kept confidential?",
        answer: "Absolutely. We take privacy seriously. All personal information and assignment details are encrypted and never shared with third parties. Please review our Privacy Policy for full details.",
    },
    {
        question: "How do wallet payments work?",
        answer: "You can add funds to your Bluepen wallet via UPI, net banking, or card. Payments for assignments are deducted from your wallet balance. Refunds, if applicable, are credited back to your wallet.",
    },
];

/* ────────────────────────────────────────── FAQ Item */

function FAQItem({
    item,
    index,
}: {
    item: (typeof FAQ_ITEMS)[0];
    index: number;
}) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="border-b border-gray-50 last:border-b-0"
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full py-4 text-left group"
            >
                <p
                    className={cn(
                        "text-[13.5px] font-medium font-poppins pr-4 transition-colors",
                        open
                            ? "text-primary"
                            : "text-gray-700 group-hover:text-gray-900"
                    )}
                >
                    {item.question}
                </p>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                        open && "rotate-180 text-primary"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    open ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <p className="text-[13px] text-gray-500 font-poppins leading-[1.7] pb-4">
                    {item.answer}
                </p>
            </div>
        </motion.div>
    );
}

/* ────────────────────────────────────────── page */

export default function SupportPage() {
    return (
        <div className="max-w-[860px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat">
                    Help &amp; Support
                </h1>
                <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                    Find answers or get in touch with our team
                </p>
            </motion.div>

            {/* Contact Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
                <div className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center mb-3">
                        <Mail className="w-[18px] h-[18px] text-primary" />
                    </div>
                    <p className="text-[13px] font-semibold text-gray-800 font-poppins mb-0.5">
                        Email Us
                    </p>
                    <a
                        href="mailto:support@bluepen.co.in"
                        className="text-[12.5px] text-primary font-poppins hover:underline underline-offset-2"
                    >
                        support@bluepen.co.in
                    </a>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center mb-3">
                        <Phone className="w-[18px] h-[18px] text-primary" />
                    </div>
                    <p className="text-[13px] font-semibold text-gray-800 font-poppins mb-0.5">
                        Call Us
                    </p>
                    <a
                        href="tel:+919876543210"
                        className="text-[12.5px] text-primary font-poppins hover:underline underline-offset-2"
                    >
                        +91 98765 43210
                    </a>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center mb-3">
                        <MessageSquare className="w-[18px] h-[18px] text-primary" />
                    </div>
                    <p className="text-[13px] font-semibold text-gray-800 font-poppins mb-0.5">
                        Live Chat
                    </p>
                    <p className="text-[12.5px] text-gray-400 font-poppins">
                        Available 9 AM &ndash; 9 PM IST
                    </p>
                </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-6"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    Frequently Asked Questions
                </p>
                <div>
                    {FAQ_ITEMS.map((item, i) => (
                        <FAQItem key={i} item={item} index={i} />
                    ))}
                </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-4">
                    Send us a message
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                            Subject
                        </label>
                        <input
                            type="text"
                            placeholder="What do you need help with?"
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                            Message
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe your issue in detail..."
                            className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 resize-none"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins shadow-sm shadow-primary/20 hover:bg-primary-dark transition-all">
                            <Send className="w-4 h-4" />
                            Send Message
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
