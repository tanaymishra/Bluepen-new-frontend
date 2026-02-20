"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BarChart3,
    FileText,
    ClipboardCheck,
    GraduationCap,
    UserPlus,
    Users,
    UserCog,
    UserRoundPlus,
    Receipt,
    Award,
    Ticket,
    Gift,
    Link2,
    CreditCard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Menu,
    X,
} from "lucide-react";

/* ────────── Sidebar config with groups ────────── */

interface SidebarItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

interface SidebarGroup {
    title: string;
    items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
    {
        title: "Main",
        items: [
            { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/metrics", label: "Metrics", icon: BarChart3 },
        ],
    },
    {
        title: "Assignments",
        items: [
            { href: "/admin/assignments", label: "Assignments", icon: FileText },
            { href: "/admin/results", label: "Results", icon: ClipboardCheck },
        ],
    },
    {
        title: "People",
        items: [
            { href: "/admin/students", label: "Students", icon: GraduationCap },
            { href: "/admin/add-student", label: "Add Student", icon: UserPlus },
            { href: "/admin/freelancers", label: "Freelancers", icon: Users },
            { href: "/admin/pms", label: "PMs", icon: UserCog },
            { href: "/admin/add-pm", label: "Add PM", icon: UserRoundPlus },
        ],
    },
    {
        title: "Finance",
        items: [
            { href: "/admin/invoicing", label: "Invoicing", icon: Receipt },
            { href: "/admin/generate-payment", label: "Generate Payment", icon: CreditCard },
            { href: "/admin/rewards", label: "Rewards", icon: Award },
            { href: "/admin/generate-coupons", label: "Generate Coupons", icon: Ticket },
            { href: "/admin/referrals", label: "Referrals", icon: Gift },
            { href: "/admin/affiliates", label: "Affiliates", icon: Link2 },
        ],
    },
];

export default function AdminAuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, clearUser, isHydrated } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    /* ── Auth guard ── */
    useEffect(() => {
        if (!isHydrated) return;
        if (!user || user.role !== "admin") {
            router.replace("/admin/login");
        }
    }, [isHydrated, user, router]);

    const handleLogout = async () => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/admin/logout`,
                { method: "POST", credentials: "include" },
            );
        } catch { /* ignore */ }
        clearUser();
        window.location.href = "/admin/login";
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
                        <Link href="/admin/dashboard" className="relative w-28 h-8">
                            <Image
                                src="/assets/logo/bluepenonly.svg"
                                alt="Bluepen"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                    )}
                    {collapsed && (
                        <Link href="/admin/dashboard" className="relative w-8 h-8">
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
                <nav className="flex-1 overflow-y-auto py-3 px-3">
                    {sidebarGroups.map((group, gi) => (
                        <div key={group.title} className={cn(gi > 0 && "mt-2")}>
                            {/* Group label */}
                            {!collapsed && (
                                <p className="px-3 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.12em] text-gray-400/70 font-poppins font-semibold select-none">
                                    {group.title}
                                </p>
                            )}
                            {collapsed && gi > 0 && (
                                <div className="mx-3 my-2 h-px bg-gray-100" />
                            )}

                            <div className="space-y-0.5">
                                {group.items.map((link) => {
                                    const Icon = link.icon;
                                    const active =
                                        pathname === link.href ||
                                        pathname.startsWith(link.href + "/");
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium font-poppins transition-all duration-200 group relative",
                                                active
                                                    ? "bg-primary/[0.07] text-primary"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                                                collapsed && "justify-center px-0"
                                            )}
                                            title={collapsed ? link.label : undefined}
                                        >
                                            {/* Active indicator bar */}
                                            {active && !collapsed && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                                            )}
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
                            </div>
                        </div>
                    ))}
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
                                href="/admin/login"
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

                    <div className="hidden lg:block">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-poppins font-semibold">
                            Admin Panel
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
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
