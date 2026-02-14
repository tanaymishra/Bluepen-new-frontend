"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/authentication/authentication";
import {
    User,
    Bell,
    Shield,
    Eye,
    EyeOff,
    Save,
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
    const { user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [notifSettings, setNotifSettings] = useState({
        emailUpdates: true,
        emailPromotions: false,
        smsUpdates: true,
        pushNotifications: true,
        deadlineReminders: true,
    });

    const toggleNotif = (key: keyof typeof notifSettings) =>
        setNotifSettings((s) => ({ ...s, [key]: !s[key] }));

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

            {/* Account */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-800 font-poppins">
                        Account
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                            Email Address
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email ?? ""}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            defaultValue={user?.phone ?? ""}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center">
                        <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-800 font-poppins">
                        Notifications
                    </p>
                </div>

                <div className="space-y-0 divide-y divide-gray-50">
                    {(
                        [
                            {
                                key: "emailUpdates" as const,
                                label: "Email Updates",
                                desc: "Receive assignment status updates via email",
                            },
                            {
                                key: "emailPromotions" as const,
                                label: "Promotional Emails",
                                desc: "Offers, discounts, and newsletter",
                            },
                            {
                                key: "smsUpdates" as const,
                                label: "SMS Notifications",
                                desc: "Important alerts via text message",
                            },
                            {
                                key: "pushNotifications" as const,
                                label: "Push Notifications",
                                desc: "Browser push notifications",
                            },
                            {
                                key: "deadlineReminders" as const,
                                label: "Deadline Reminders",
                                desc: "Get reminded before assignment deadlines",
                            },
                        ] as const
                    ).map((item) => (
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
                            <Toggle
                                enabled={notifSettings[item.key]}
                                onChange={() => toggleNotif(item.key)}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 mb-4"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-800 font-poppins">
                        Security
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="w-full h-10 px-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins shadow-sm shadow-primary/20 hover:bg-primary-dark transition-all">
                            <Save className="w-4 h-4" />
                            Update Password
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
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
