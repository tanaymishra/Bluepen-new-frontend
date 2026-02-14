import React from "react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Bluepen — Account",
    description: "Sign in or create an account on Bluepen.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-[100dvh] w-full bg-white overflow-hidden">
            {/* ─── Left Decorative Panel (Desktop Only) ─── */}
            <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative bg-gradient-to-br from-[#012551] via-primary to-[#1e4690] items-center justify-center overflow-hidden">
                {/* Animated gradient mesh */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-30%] left-[-20%] w-[700px] h-[700px] bg-[#6ec9f1]/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-[#F8D881]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" />
                </div>

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
                    <Link href="/">
                        <Image
                            src="/assets/logo/bluepenonly.svg"
                            alt="Bluepen Logo"
                            width={160}
                            height={55}
                            priority
                            className="brightness-0 invert mb-12 hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    <h2 className="text-3xl xl:text-4xl font-bold text-white font-montserrat leading-tight mb-6">
                        Your academic success,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8D881] to-[#6ec9f1]">
                            simplified.
                        </span>
                    </h2>

                    <p className="text-blue-100/80 text-base xl:text-lg font-poppins leading-relaxed mb-10">
                        Connect with expert writers, deliver outstanding assignments, and
                        never miss a deadline again.
                    </p>

                    {/* Trust indicators */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white font-montserrat">5k+</span>
                            <span className="text-xs text-blue-200/70 font-poppins mt-1">Students</span>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white font-montserrat">98.5%</span>
                            <span className="text-xs text-blue-200/70 font-poppins mt-1">Success Rate</span>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white font-montserrat">50+</span>
                            <span className="text-xs text-blue-200/70 font-poppins mt-1">Experts</span>
                        </div>
                    </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute bottom-8 left-8 text-[11px] text-blue-200/40 font-poppins">
                    © {new Date().getFullYear()} Bluepen. All rights reserved.
                </div>
            </div>

            {/* ─── Right Form Panel ─── */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 relative">
                {/* Subtle background decor for form side */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#6ec9f1]/[0.03] rounded-full blur-[80px] -z-10" />

                <div className="w-full max-w-[440px]">{children}</div>
            </div>
        </div>
    );
}
