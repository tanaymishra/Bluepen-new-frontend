import React from "react";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export const metadata = {
    title: "Bluepen — Admin Login",
    description: "Sign in to the Bluepen admin portal.",
};

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-[100dvh] w-full bg-white overflow-hidden">
            {/* ─── Left Brand Panel (Desktop Only) ─── */}
            <AuthBrandPanel />

            {/* ─── Right Form Panel ─── */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#6ec9f1]/[0.03] rounded-full blur-[80px] -z-10" />

                <div className="w-full max-w-[440px]">{children}</div>
            </div>
        </div>
    );
}
