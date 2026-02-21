"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/context/toastContext";
import { ChevronLeft, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function AddStudentPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        university: "",
        course: "",
        password: "",
        confirmPassword: "",
    });
    const [countryCode, setCountryCode] = useState("+91");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const update = (key: string, value: string) => {
        setForm((p) => ({ ...p, [key]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const phone = form.phone.trim() ? countryCode + form.phone.trim() : undefined;
            const res = await fetch(`${API}/api/admin/students`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.name,
                    email: form.email,
                    phone,
                    password: form.password,
                    university: form.university || undefined,
                    course: form.course || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Failed to add student");

            showToast("Student added successfully", "success");
            router.push("/admin/students");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
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

                {/* Phone */}
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className={labelCls}>Phone</Label>
                    <PhoneInput
                        id="phone"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        onCountryChange={(code) => setCountryCode(code)}
                        defaultCountry="in"
                    />
                </div>

                {/* ─── Academic Info ─── */}
                <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-4">Academic Details</p>
                </div>

                {/* University */}
                <div className="space-y-1.5">
                    <Label htmlFor="university" className={labelCls}>University / College</Label>
                    <Input id="university" placeholder="e.g. Delhi University" value={form.university} onChange={(e) => update("university", e.target.value)} />
                </div>

                {/* Course */}
                <div className="space-y-1.5">
                    <Label htmlFor="course" className={labelCls}>Course</Label>
                    <Input id="course" placeholder="e.g. MBA, B.Tech CSE, MBBS" value={form.course} onChange={(e) => update("course", e.target.value)} />
                </div>

                {/* ─── Account Credentials ─── */}
                <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-4">Account Credentials</p>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password" className={labelCls}>Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min. 8 characters"
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className={labelCls}>Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter password"
                            value={form.confirmPassword}
                            onChange={(e) => update("confirmPassword", e.target.value)}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-[13px] text-red-500 font-poppins -mt-1">{error}</p>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-gray-100">
                    <Button type="submit" className="flex-1 sm:flex-none" disabled={loading}>
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                            <UserPlus className="w-4 h-4 mr-1.5" />
                        )}
                        {loading ? "Adding…" : "Add Student"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
