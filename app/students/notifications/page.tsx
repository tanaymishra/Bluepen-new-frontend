"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    FileText,
    CreditCard,
    AlertCircle,
    Clock,
    CheckCheck,
    ArrowUpRight,
} from "lucide-react";
import { MOCK_NOTIFICATIONS, type AppNotification } from "@/lib/static";

/* ────────────────────────────────────────── helpers */

function formatRelative(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
    const base = "w-9 h-9 rounded-xl flex items-center justify-center shrink-0";
    switch (type) {
        case "assignment":
            return (
                <div className={cn(base, "bg-primary/[0.06]")}>
                    <FileText className="w-4 h-4 text-primary" />
                </div>
            );
        case "payment":
            return (
                <div className={cn(base, "bg-primary/[0.06]")}>
                    <CreditCard className="w-4 h-4 text-primary" />
                </div>
            );
        case "deadline":
            return (
                <div className={cn(base, "bg-primary/[0.06]")}>
                    <Clock className="w-4 h-4 text-primary" />
                </div>
            );
        case "system":
            return (
                <div className={cn(base, "bg-gray-50")}>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                </div>
            );
    }
}

/* ────────────────────────────────────────── page */

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const sorted = useMemo(
        () =>
            [...notifications].sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            ),
        [notifications]
    );

    return (
        <div className="max-w-[860px] mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between mb-6"
            >
                <div>
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat">
                        Notifications
                    </h1>
                    <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                            : "You\u2019re all caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium text-primary font-poppins hover:bg-primary/5 transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all read
                    </button>
                )}
            </motion.div>

            {/* Notification List */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 }}
                className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden divide-y divide-gray-50/80"
            >
                {sorted.map((n, i) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.03 }}
                        onClick={() => markRead(n.id)}
                        className={cn(
                            "flex items-start gap-3.5 px-5 sm:px-6 py-4 transition-colors cursor-pointer",
                            !n.read ? "bg-primary/[0.02]" : "hover:bg-gray-50/40"
                        )}
                    >
                        <div className="relative mt-0.5">
                            <NotificationIcon type={n.type} />
                            {!n.read && (
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <p
                                    className={cn(
                                        "text-[13.5px] font-poppins leading-snug",
                                        !n.read
                                            ? "font-semibold text-gray-800"
                                            : "font-medium text-gray-700"
                                    )}
                                >
                                    {n.title}
                                </p>
                                <span className="text-[11px] text-gray-400 font-poppins shrink-0 mt-0.5">
                                    {formatRelative(n.timestamp)}
                                </span>
                            </div>
                            <p className="text-[12.5px] text-gray-500 font-poppins mt-0.5 leading-relaxed">
                                {n.message}
                            </p>
                            {n.link && (
                                <Link
                                    href={n.link}
                                    className="inline-flex items-center gap-1 mt-2 text-[12px] text-primary font-medium font-poppins hover:underline underline-offset-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View details
                                    <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
