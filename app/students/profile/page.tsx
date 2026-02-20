"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Mail,
    GraduationCap,
    Edit3,
    Save,
    X,
    Loader2,
    User,
    Phone,
} from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/profile/useProfile";

/* ── helpers ── */

const NA = () => (
    <span className="text-gray-400 italic text-[13px] font-poppins">N/A</span>
);

const PHONE_COUNTRY_MAP = [
    { value: "in", code: "+91" },
    { value: "gb", code: "+44" },
    { value: "au", code: "+61" },
    { value: "ae", code: "+971" },
    { value: "us", code: "+1" },
    { value: "ca", code: "+1" },
] as const;

function parseStoredPhone(stored: string | null): {
    countryValue: string;
    countryCode: string;
    digits: string;
} {
    if (!stored) return { countryValue: "in", countryCode: "+91", digits: "" };
    for (const { value, code } of PHONE_COUNTRY_MAP) {
        if (stored.startsWith(code)) {
            return { countryValue: value, countryCode: code, digits: stored.slice(code.length) };
        }
    }
    return { countryValue: "in", countryCode: "+91", digits: stored };
}

function getInitials(fullName: string | null | undefined): string {
    if (!fullName?.trim()) return "?";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* ── page ── */

export default function ProfilePage() {
    const { profile, loading, error, saving, saveError, updateProfile } = useProfile();

    const [editing, setEditing] = useState(false);
    const [editFullName, setEditFullName]       = useState("");
    const [editUniversity, setEditUniversity]   = useState("");
    const [editCourse, setEditCourse]           = useState("");
    const [phoneDigits, setPhoneDigits]         = useState("");
    const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
    const [phoneInputKey, setPhoneInputKey]     = useState(0);
    const [phoneDefaultCountry, setPhoneDefaultCountry] = useState<string>("in");
    const [fieldErrors, setFieldErrors]         = useState<Record<string, string>>({});

    const startEditing = () => {
        if (!profile) return;
        const parsed = parseStoredPhone(profile.phone_number);
        setEditFullName(profile.full_name ?? "");
        setEditUniversity(profile.university ?? "");
        setEditCourse(profile.course ?? "");
        setPhoneDigits(parsed.digits);
        setPhoneCountryCode(parsed.countryCode);
        setPhoneDefaultCountry(parsed.countryValue);
        setPhoneInputKey((k) => k + 1);
        setFieldErrors({});
        setEditing(true);
    };

    const cancelEditing = () => { setEditing(false); setFieldErrors({}); };

    const handleSave = async () => {
        const errs: Record<string, string> = {};
        if (!editFullName.trim()) errs.full_name = "Full name is required";
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }

        const phone_number = phoneDigits.trim()
            ? phoneCountryCode + phoneDigits.trim().replace(/[\s\-().]/g, "")
            : null;

        const updated = await updateProfile({
            full_name:    editFullName.trim(),
            phone_number: phone_number,
            university:   editUniversity.trim() || null,
            course:       editCourse.trim() || null,
        });
        if (updated) setEditing(false);
    };

    /* ── loading / error states ── */
    if (loading) {
        return (
            <div className="max-w-[860px] mx-auto flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="max-w-[860px] mx-auto py-16 text-center">
                <p className="text-[14px] text-red-500 font-poppins">{error}</p>
                <p className="text-[12.5px] text-gray-400 font-poppins mt-1">Please refresh the page.</p>
            </div>
        );
    }

    const fullName   = profile?.full_name    ?? null;
    const email      = profile?.email        ?? null;
    const phone      = profile?.phone_number ?? null;
    const university = profile?.university   ?? null;
    const course     = profile?.course       ?? null;

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
                    Profile
                </h1>
                <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                    Manage your personal information and academic details
                </p>
            </motion.div>

            {/* Avatar card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-8 mb-4"
            >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-montserrat shrink-0 select-none">
                        {getInitials(fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[20px] font-bold text-gray-900 font-montserrat">
                            {fullName ?? "Student"}
                        </h2>
                        <p className="text-[13px] text-gray-400 font-poppins mt-0.5">Student Account</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {email ?? "—"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                {phone ?? <NA />}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <div className="flex items-center justify-between mb-5">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">
                        Personal Information
                    </p>
                    <button
                        onClick={editing ? cancelEditing : startEditing}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium font-poppins transition-colors",
                            editing ? "text-red-500 hover:bg-red-50" : "text-primary hover:bg-primary/5"
                        )}
                    >
                        {editing ? (
                            <><X className="w-3.5 h-3.5" />Cancel</>
                        ) : (
                            <><Edit3 className="w-3.5 h-3.5" />Edit</>
                        )}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {editing ? (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                            className="space-y-4"
                        >
                            {/* Full Name */}
                            <div>
                                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    value={editFullName}
                                    onChange={(e) => {
                                        setEditFullName(e.target.value);
                                        if (fieldErrors.full_name) setFieldErrors((p) => { const c = { ...p }; delete c.full_name; return c; });
                                    }}
                                    className={fieldErrors.full_name ? "border-red-300" : ""}
                                    placeholder="Your full name"
                                />
                                {fieldErrors.full_name && (
                                    <p className="text-[11.5px] text-red-500 font-poppins mt-1">{fieldErrors.full_name}</p>
                                )}
                            </div>

                            {/* Email — read-only */}
                            <div>
                                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                    Email Address
                                </label>
                                <div className="flex h-12 items-center px-3.5 rounded-xl border border-gray-100 bg-gray-50 text-[13px] font-poppins text-gray-400 cursor-not-allowed gap-2">
                                    <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                                    {email}
                                </div>
                                <p className="text-[11px] text-gray-400 font-poppins mt-1">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                    Phone Number
                                </label>
                                <PhoneInput
                                    key={phoneInputKey}
                                    defaultCountry={phoneDefaultCountry}
                                    onCountryChange={(code) => setPhoneCountryCode(code)}
                                    value={phoneDigits}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneDigits(e.target.value)}
                                    placeholder="98765 43210"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {[
                                { label: "Full Name",     value: fullName, Icon: User },
                                { label: "Email Address", value: email,    Icon: Mail },
                                { label: "Phone Number",  value: phone,    Icon: Phone },
                            ].map(({ label, value, Icon }) => (
                                <div key={label} className={label === "Email Address" ? "sm:col-span-2" : ""}>
                                    <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                        {label}
                                    </label>
                                    <div className="flex items-center gap-2 py-2">
                                        <Icon className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                        {value ? (
                                            <p className="text-[13.5px] text-gray-800 font-poppins">{value}</p>
                                        ) : (
                                            <NA />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {editing && (
                    <div className="mt-5 pt-4 border-t border-gray-50">
                        {saveError && (
                            <p className="text-[12px] text-red-500 font-poppins mb-3">{saveError}</p>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins shadow-sm shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                                ) : (
                                    <><Save className="w-4 h-4" />Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Academic Details */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
            >
                <div className="flex items-center justify-between mb-5">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold">
                        Academic Details
                    </p>
                    {!editing && (
                        <button
                            onClick={startEditing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium font-poppins text-primary hover:bg-primary/5 transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5" />Edit
                        </button>
                    )}
                </div>

                {editing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                University
                            </label>
                            <Input
                                value={editUniversity}
                                onChange={(e) => setEditUniversity(e.target.value)}
                                placeholder="e.g., University of London"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                Course
                            </label>
                            <Input
                                value={editCourse}
                                onChange={(e) => setEditCourse(e.target.value)}
                                placeholder="e.g., B.Sc. Computer Science"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { label: "University", value: university },
                            { label: "Course",     value: course },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                                    <GraduationCap className="w-[15px] h-[15px] text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-0.5">
                                        {label}
                                    </p>
                                    {value ? (
                                        <p className="text-[13.5px] text-gray-800 font-poppins">{value}</p>
                                    ) : (
                                        <NA />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
