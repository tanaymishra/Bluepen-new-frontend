"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ADMIN_STREAMS } from "@/lib/static";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/context/toastContext";
import { ChevronLeft, Eye, EyeOff, Loader2, UserRoundPlus } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function AddPMPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [countryCode, setCountryCode] = useState("+91");
    const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const update = (key: string, value: string) => {
        setForm((p) => ({ ...p, [key]: value }));
        setError("");
    };

    const toggleStream = (stream: string) => {
        setSelectedStreams((prev) =>
            prev.includes(stream) ? prev.filter((s) => s !== stream) : [...prev, stream]
        );
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
            const res = await fetch(`${API}/api/admin/pms`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.name,
                    email: form.email,
                    phone,
                    password: form.password,
                    managedStreams: selectedStreams,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Failed to add PM");

            showToast("Project Manager added successfully", "success");
            router.push("/admin/pms");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[680px] mx-auto">
            {/* Header */}
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
                    <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Phone</Label>
                    <PhoneInput
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        onCountryChange={(code) => setCountryCode(code)}
                        defaultCountry="in"
                        placeholder="98123 00001"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[13px] font-semibold text-gray-700 font-poppins">Password</Label>
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
                    <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-gray-700 font-poppins">Confirm Password</Label>
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
                    <Button type="submit" className="flex-1 sm:flex-none" disabled={loading}>
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                            <UserRoundPlus className="w-4 h-4 mr-1.5" />
                        )}
                        {loading ? "Adding…" : "Add PM"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}
