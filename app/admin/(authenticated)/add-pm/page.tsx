"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ADMIN_STREAMS } from "@/lib/static";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, UserRoundPlus } from "lucide-react";

export default function AddPMPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [selectedStreams, setSelectedStreams] = useState<string[]>([]);

    const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

    const toggleStream = (stream: string) => {
        setSelectedStreams((prev) =>
            prev.includes(stream) ? prev.filter((s) => s !== stream) : [...prev, stream]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/admin/pms");
    };

    return (
        <div className="max-w-[680px] mx-auto">
            {/* Back */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1 text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors group mb-2"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    back
                </button>
                <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 font-montserrat mb-6">Add Project Manager</h1>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-5"
            >
                {/* Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[13px] font-semibold text-gray-700 font-poppins">Full Name</Label>
                    <Input id="name" placeholder="e.g. Arjun Mehta" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[13px] font-semibold text-gray-700 font-poppins">Email</Label>
                    <Input id="email" type="email" placeholder="pm@bluepen.co.in" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[13px] font-semibold text-gray-700 font-poppins">Phone</Label>
                    <Input id="phone" placeholder="+91 98123 00001" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                </div>

                {/* Managed Streams */}
                <div className="space-y-2.5">
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Managed Streams</Label>
                    <div className="grid grid-cols-2 gap-2.5">
                        {ADMIN_STREAMS.map((stream) => (
                            <label
                                key={stream}
                                className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedStreams.includes(stream)}
                                    onCheckedChange={() => toggleStream(stream)}
                                />
                                <span className="text-[13px] text-gray-700 font-poppins">{stream}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Button type="submit" className="flex-1 sm:flex-none">
                        <UserRoundPlus className="w-4 h-4 mr-1.5" />
                        Add PM
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
