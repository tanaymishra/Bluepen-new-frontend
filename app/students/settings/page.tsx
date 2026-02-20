"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/settings/useSettings";
import { useToast } from "@/context/toastContext";
import {
    Bell,
    Shield,
    Eye,
    EyeOff,
    Save,
    Loader2,
} from "lucide-react";

/* ────────────────────────────────────────── toggle */

function Toggle({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative w-10 h-[22px] rounded-full transition-colors duration-200 shrink-0",
                enabled ? "bg-primary" : "bg-gray-200"
            )}
        >
            <div
                className={cn(
                    "absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                    enabled ? "translate-x-[22px]" : "translate-x-[3px]"
                )}
            />
        </button>
    );
}

/* ────────────────────────────────────────── page */

export default function SettingsPage() {
    const { prefs, isLoading, isSaving, updatePref, changePassword } = useSettings();
    const { showToast } = useToast();
    const [showCurrent, setShowCurrent]     = useState(false);
    const [showNew, setShowNew]             = useState(false);
    const [showConfirm, setShowConfirm]     = useState(false);
    const [currentPw, setCurrentPw]         = useState("");
    const [newPw, setNewPw]                 = useState("");
    const [confirmPw, setConfirmPw]         = useState("");
    const [pwLoading, setPwLoading]         = useState(false);

    const handlePasswordSave = async () => {
        if (!currentPw || !newPw || !confirmPw) {
            showToast("Please fill in all password fields", "warning");
            return;
        }
        if (newPw !== confirmPw) {
            showToast("New passwords do not match", "error");
            return;
        }
        if (newPw.length < 8) {
            showToast("Password must be at least 8 characters", "warning");
            return;
        }
        setPwLoading(true);
        try {
            await changePassword(currentPw, newPw);
            showToast("Password updated successfully", "success");
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
        } catch (e: unknown) {
            showToast(e instanceof Error ? e.message : "Failed to update password", "error");
        } finally {
            setPwLoading(false);
        }
    };

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
                    Settings
                </h1>
                <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                    Manage your account preferences
                </p>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center">
                            <Bell className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-[13.5px] font-semibold text-gray-800 font-poppins">
                            Notifications
                        </p>
                    </div>
                    {isSaving && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                </div>

                <div className="space-y-0 divide-y divide-gray-50">
                    {(isLoading ? [
                        { key: "emailUpdates" as const,      label: "Email Updates",       desc: "Receive assignment status updates via email" },
                        { key: "emailPromotions" as const,   label: "Promotional Emails",  desc: "Offers, discounts, and newsletter" },
                        { key: "smsUpdates" as const,        label: "SMS Notifications",   desc: "Important alerts via text message" },
                        { key: "pushNotifications" as const, label: "Push Notifications",  desc: "Browser push notifications" },
                        { key: "deadlineReminders" as const, label: "Deadline Reminders",  desc: "Get reminded before assignment deadlines" },
                    ] : [
                        { key: "emailUpdates" as const,      label: "Email Updates",       desc: "Receive assignment status updates via email" },
                        { key: "emailPromotions" as const,   label: "Promotional Emails",  desc: "Offers, discounts, and newsletter" },
                        { key: "smsUpdates" as const,        label: "SMS Notifications",   desc: "Important alerts via text message" },
                        { key: "pushNotifications" as const, label: "Push Notifications",  desc: "Browser push notifications" },
                        { key: "deadlineReminders" as const, label: "Deadline Reminders",  desc: "Get reminded before assignment deadlines" },
                    ] as const).map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between py-3.5"
                        >
                            <div>
                                <p className="text-[13.5px] font-medium text-gray-800 font-poppins">
                                    {item.label}
                                </p>
                                <p className="text-[12px] text-gray-400 font-poppins mt-0.5">
                                    {item.desc}
                                </p>
                            </div>
                            {isLoading ? (
                                <div className="w-10 h-[22px] rounded-full bg-gray-100 animate-pulse" />
                            ) : (
                                <Toggle
                                    enabled={prefs[item.key]}
                                    onChange={(v) => updatePref(item.key, v)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-800 font-poppins">
                        Change Password
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                                value={currentPw}
                                onChange={(e) => setCurrentPw(e.target.value)}
                                className="w-full h-10 px-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                            />
                            <button
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPw}
                                    onChange={(e) => setNewPw(e.target.value)}
                                    className="w-full h-10 px-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                                />
                                <button
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                    className="w-full h-10 px-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                                />
                                <button
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handlePasswordSave}
                            disabled={pwLoading}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins shadow-sm shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {pwLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {pwLoading ? "Saving..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-red-100 p-5 sm:p-6"
            >
                <p className="text-[11px] uppercase tracking-widest text-red-400 font-poppins font-semibold mb-2">
                    Danger Zone
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <p className="text-[13.5px] font-medium text-gray-800 font-poppins">
                            Delete Account
                        </p>
                        <p className="text-[12px] text-gray-400 font-poppins mt-0.5">
                            Permanently delete your account and all data. This cannot be
                            undone.
                        </p>
                    </div>
                    <button className="shrink-0 px-4 py-2 rounded-lg border border-red-200 text-red-500 text-[12.5px] font-medium font-poppins hover:bg-red-50 transition-colors">
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
