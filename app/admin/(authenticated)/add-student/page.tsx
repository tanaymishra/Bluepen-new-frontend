"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/context/toastContext";
import { ChevronLeft, Loader2, UserPlus, Search, Copy, Check } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface ReferralMatch {
    fullName: string;
    code: string;
}

export default function AddStudentPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        university: "",
        course: "",
        referralCode: "",
    });
    const [countryCode, setCountryCode] = useState("+91");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ── Referral autocomplete state ── */
    const [referralQuery, setReferralQuery] = useState("");
    const [referralResults, setReferralResults] = useState<ReferralMatch[]>([]);
    const [referralLoading, setReferralLoading] = useState(false);
    const [showReferralDropdown, setShowReferralDropdown] = useState(false);
    const referralRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    /* ── Success state ── */
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const update = (key: string, value: string) => {
        setForm((p) => ({ ...p, [key]: value }));
        setError("");
    };

    /* ── Referral search with debounce ── */
    const searchReferrals = useCallback(async (query: string) => {
        if (query.length < 2) {
            setReferralResults([]);
            setShowReferralDropdown(false);
            return;
        }
        setReferralLoading(true);
        try {
            const res = await fetch(
                `${API}/api/admin/students/referrals/search?q=${encodeURIComponent(query)}`,
                { credentials: "include" }
            );
            const data = await res.json();
            if (res.ok && data.data) {
                setReferralResults(data.data);
                setShowReferralDropdown(data.data.length > 0);
            }
        } catch {
            setReferralResults([]);
        } finally {
            setReferralLoading(false);
        }
    }, []);

    const handleReferralInput = (value: string) => {
        setReferralQuery(value);
        update("referralCode", value);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => searchReferrals(value), 300);
    };

    const selectReferral = (match: ReferralMatch) => {
        setReferralQuery(`${match.fullName} — ${match.code}`);
        update("referralCode", match.code);
        setShowReferralDropdown(false);
    };

    /* Close dropdown on outside click */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (referralRef.current && !referralRef.current.contains(e.target as Node)) {
                setShowReferralDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ── Submit ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
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
                    university: form.university || undefined,
                    course: form.course || undefined,
                    referredBy: form.referralCode || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Failed to add student");

            showToast("Student added successfully", "success");
            setGeneratedPassword(data.data?.generatedPassword || "");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            setError(msg);
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const copyPassword = async () => {
        await navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        showToast("Password copied to clipboard", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const labelCls = "text-[13px] font-semibold text-gray-700 font-poppins";

    /* ── Success screen ── */
    if (generatedPassword) {
        return (
            <div className="max-w-[680px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-5 text-center"
                >
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                        <Check className="w-7 h-7 text-green-500" />
                    </div>
                    <h2 className="text-[20px] font-bold text-gray-900 font-montserrat">Student Created!</h2>
                    <p className="text-[13px] text-gray-500 font-poppins">
                        Share the auto-generated password below with the student. They can change it later.
                    </p>

                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3">
                        <code className="text-[15px] font-mono font-medium text-gray-800 tracking-wide select-all">
                            {generatedPassword}
                        </code>
                        <button
                            onClick={copyPassword}
                            className="shrink-0 p-2 rounded-lg hover:bg-gray-200/60 transition-colors text-gray-500 hover:text-gray-700"
                            title="Copy password"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button onClick={() => router.push("/admin/students")} className="flex-1">
                            View Students
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setGeneratedPassword("");
                                setForm({ name: "", email: "", phone: "", university: "", course: "", referralCode: "" });
                                setReferralQuery("");
                            }}
                        >
                            Add Another
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ── Form ── */
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

                {/* ─── Referral ─── */}
                <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 font-poppins font-semibold mb-4">Referral</p>
                </div>

                {/* Referral Code — autocomplete */}
                <div className="space-y-1.5" ref={referralRef}>
                    <Label htmlFor="referralCode" className={labelCls}>Referred by</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input
                            id="referralCode"
                            placeholder="Search by student name or referral code…"
                            value={referralQuery}
                            onChange={(e) => handleReferralInput(e.target.value)}
                            onFocus={() => referralResults.length > 0 && setShowReferralDropdown(true)}
                            className="pl-9"
                            autoComplete="off"
                        />
                        {referralLoading && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                        )}

                        {/* Dropdown */}
                        {showReferralDropdown && (
                            <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-xl border border-gray-200 bg-white shadow-lg max-h-[220px] overflow-y-auto animate-in fade-in-0 zoom-in-95">
                                {referralResults.map((match) => (
                                    <button
                                        key={match.code}
                                        type="button"
                                        onClick={() => selectReferral(match)}
                                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        <span className="text-[13px] font-medium text-gray-800 font-poppins">{match.fullName}</span>
                                        <span className="text-[12px] text-gray-400 font-mono font-medium">{match.code}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-[11px] text-gray-400 font-poppins mt-0.5">Leave blank if not referred</p>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-[13px] text-red-500 font-poppins -mt-1">{error}</p>
                )}

                {/* Info: Password is auto-generated */}
                <div className="bg-blue-50/60 rounded-xl border border-blue-100 p-3.5">
                    <p className="text-[12px] text-blue-600 font-poppins font-medium">
                        💡 Password will be auto-generated and shown after creation.
                    </p>
                </div>

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
