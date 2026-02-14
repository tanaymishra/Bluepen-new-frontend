
import React from "react";
import Navbar from "@/components/user/navbar/navbar";
import Footer from "@/components/Footer";
import { LegalSidebar } from "@/components/legal/LegalSidebar";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50 font-poppins">
            <Navbar />

            {/* Header / Breadcrumb Area */}
            <div className="bg-white border-b border-gray-100 pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-2">Legal Center</h1>
                    <p className="text-gray-500 max-w-2xl text-[15px]">
                        Review our policies and terms. We believe in transparency and providing clear information about our service.
                    </p>
                </div>
            </div>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 align-start">

                    {/* Sidebar */}
                    <aside className="hidden md:block sticky top-24 self-start">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-1 font-montserrat">
                                Policies
                            </h3>
                            <LegalSidebar />
                        </div>
                    </aside>

                    {/* Mobile Navigation (Simple Dropdown or Stack) - For now just stack on mobile if Sidebar supports it */}
                    {/* Or render Sidebar on mobile too? Let's hide sidebar on mobile and use top navigation or horizontal scroll if needed. */}
                    {/* Actually, for better UX on mobile, let's just show the sidebar content at the top or bottom. */}
                    <div className="md:hidden mb-8">
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <LegalSidebar />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
