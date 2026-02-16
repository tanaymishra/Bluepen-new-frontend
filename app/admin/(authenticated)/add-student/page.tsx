"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ADMIN_STREAMS } from "@/lib/static";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, UserPlus } from "lucide-react";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 3 + i); // e.g. 2022–2031

export default function AddStudentPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "in",
        university: "",
        stream: "",
        course: "",
        intakeMonth: "",
        intakeYear: "",
        referralCode: "",
    });

    const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock — just go back
        router.push("/admin/students");
    };

    const labelCls = "text-[13px] font-semibold text-gray-700 font-poppins";

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
                <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 font-montserrat mb-6">Add Student</h1>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100/80 p-4 sm:p-6 space-y-5"
            >
                {/* ─── Personal Info ─── */}
                <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold">Personal Information</p>

                {/* Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="name" className={labelCls}>Full Name</Label>
                    <Input id="name" placeholder="e.g. Aarav Gupta" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <Label htmlFor="email" className={labelCls}>Email</Label>
                    <Input id="email" type="email" placeholder="student@university.edu" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                </div>

                {/* Phone — PhoneInput with country selector */}
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className={labelCls}>Phone</Label>
                    <PhoneInput
                        id="phone"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        onCountryChange={(code) => update("countryCode", code)}
                        defaultCountry="in"
                        required
                    />
                </div>

                {/* ─── Academic Info ─── */}
                <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-4">Academic Details</p>
                </div>

                {/* University */}
                <div className="space-y-1.5">
                    <Label htmlFor="university" className={labelCls}>University / College</Label>
                    <Input id="university" placeholder="e.g. Delhi University" value={form.university} onChange={(e) => update("university", e.target.value)} required />
                </div>

                {/* Course */}
                <div className="space-y-1.5">
                    <Label htmlFor="course" className={labelCls}>Course</Label>
                    <Input id="course" placeholder="e.g. MBA, B.Tech CSE, MBBS" value={form.course} onChange={(e) => update("course", e.target.value)} required />
                </div>

                {/* Stream */}
                <div className="space-y-1.5">
                    <Label className={labelCls}>Stream</Label>
                    <Select value={form.stream} onValueChange={(v) => update("stream", v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                            {ADMIN_STREAMS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Intake — Month & Year side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Intake Month</Label>
                        <Select value={form.intakeMonth} onValueChange={(v) => update("intakeMonth", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className={labelCls}>Intake Year</Label>
                        <Select value={form.intakeYear} onValueChange={(v) => update("intakeYear", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map((y) => (
                                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ─── Referral ─── */}
                <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-4">Referral</p>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="referralCode" className={labelCls}>Referred by / Referral Code</Label>
                    <Input
                        id="referralCode"
                        placeholder="e.g. REF-XXXX or coupon code (optional)"
                        value={form.referralCode}
                        onChange={(e) => update("referralCode", e.target.value)}
                    />
                    <p className="text-[11px] text-gray-400 font-poppins mt-0.5">Leave blank if not referred</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-gray-100">
                    <Button type="submit" className="flex-1 sm:flex-none">
                        <UserPlus className="w-4 h-4 mr-1.5" />
                        Add Student
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
