"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    User,
    Wallet,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Settings,
    HelpCircle,
    Menu,
    X,
} from "lucide-react";

const sidebarLinks = [
    { href: "/students/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students/assignments", label: "My Assignments", icon: FileText },
    { href: "/students/profile", label: "Profile", icon: User },
    { href: "/students/wallet", label: "Wallet", icon: Wallet },
    { href: "/students/notifications", label: "Notifications", icon: Bell },
    { href: "/students/settings", label: "Settings", icon: Settings },
    { href: "/students/support", label: "Help & Support", icon: HelpCircle },
];

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, clearUser, isHydrated } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        clearUser();
        window.location.href = "/login";
    };

    const getInitials = (first?: string, last?: string) =>
        `${first?.charAt(0) ?? ""}${last?.charAt(0) ?? ""}`.toUpperCase();

    return (
        <div className="flex min-h-screen bg-[#F5F7FA]">
            {/* ─── Mobile Overlay ─── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    collapsed ? "w-[72px]" : "w-[260px]",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo Area */}
                <div
                    className={cn(
                        "flex items-center h-16 px-4 border-b border-gray-100 shrink-0",
                        collapsed ? "justify-center" : "justify-between"
                    )}
                >
                    {!collapsed && (
                        <Link href="/" className="relative w-28 h-8">
                            <Image
                                src="/assets/logo/bluepenonly.svg"
                                alt="Bluepen"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                    )}
                    {collapsed && (
                        <Link href="/" className="relative w-8 h-8">
                            <Image
                                src="/assets/logo/bluepenonly.svg"
                                alt="Bluepen"
                                fill
                                className="object-contain"
                            />
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const active = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium font-poppins transition-all duration-200 group",
                                    active
                                        ? "bg-primary/[0.07] text-primary"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                                    collapsed && "justify-center px-0"
                                )}
                                title={collapsed ? link.label : undefined}
                            >
                                <Icon
                                    className={cn(
                                        "w-[18px] h-[18px] shrink-0 transition-colors",
                                        active
                                            ? "text-primary"
                                            : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                />
                                {!collapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card */}
                <div className={cn("border-t border-gray-100 p-3 shrink-0", collapsed && "px-2")}>
                    {isHydrated && user ? (
                        <div
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-xl",
                                collapsed && "justify-center p-1"
                            )}
                        >
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-montserrat shrink-0">
                                {getInitials(user.firstname, user.lastname)}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-800 font-poppins truncate">
                                        {user.firstname} {user.lastname}
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-poppins truncate">
                                        {user.email}
                                    </p>
                                </div>
                            )}
                            {!collapsed && (
                                <button
                                    onClick={handleLogout}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ) : (
                        !collapsed && (
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins hover:bg-primary-dark transition-colors"
                            >
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <div
                className={cn(
                    "flex-1 transition-all duration-300",
                    collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
                )}
            >
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-5 lg:px-8">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden lg:block" />

                    <div className="flex items-center gap-3">
                        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
                            <Bell className="w-[18px] h-[18px]" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-5 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
