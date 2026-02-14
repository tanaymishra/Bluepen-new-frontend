"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Shield,
    FileText,
    RefreshCcw,
    Users,
    CreditCard,
    ChevronRight
} from "lucide-react";

const sidebarItems = [
    {
        title: "Terms of Service",
        href: "/terms",
        icon: FileText
    },
    {
        title: "Privacy Policy",
        href: "/privacy",
        icon: Shield
    },
    {
        title: "Refund Policy",
        href: "/refund-policy",
        icon: CreditCard
    },
    {
        title: "Revision Policy",
        href: "/changes",
        icon: RefreshCcw
    },
    {
        title: "Referral Program",
        href: "/referral",
        icon: Users
    }
];

export function LegalSidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col space-y-1">
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-poppins text-[15px]",
                            isActive
                                ? "bg-primary/5 text-primary font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                            <span>{item.title}</span>
                        </div>
                        {isActive && (
                            <ChevronRight className="w-4 h-4 text-primary opacity-50" />
                        )}
                    </Link>
                );
            })}

            <div className="mt-8 px-4">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900 font-montserrat mb-1">Need help?</h4>
                    <p className="text-xs text-blue-700/80 font-poppins mb-3">
                        Can't find what you're looking for? Contact our support team.
                    </p>
                    <a
                        href="mailto:support@bluepen.co.in"
                        className="text-xs font-semibold text-primary hover:underline"
                    >
                        Contact Support →
                    </a>
                </div>
            </div>
        </nav>
    );
}
