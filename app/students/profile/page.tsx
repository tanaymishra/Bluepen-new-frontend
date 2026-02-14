"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/authentication/authentication";
import {
    User,
    Mail,
    Phone,
    GraduationCap,
    Calendar,
    Edit3,
    Save,
    X,
} from "lucide-react";

/* ────────────────────────────────────────── page */

export default function ProfilePage() {
    const { user, isHydrated } = useAuth();
    const [editing, setEditing] = useState(false);

    // Mock academic data — would come from API
    const [profile] = useState({
        university: "University of Delhi",
        course: "B.Tech Computer Science",
        year: "3rd Year",
        enrollmentId: "DU-2023-CS-0154",
    });

    const firstName = isHydrated && user?.firstname ? user.firstname : "Student";
    const lastName = isHydrated && user?.lastname ? user.lastname : "";
    const email = isHydrated && user?.email ? user.email : "student@example.com";
    const phone = isHydrated && user?.phone ? user.phone : "+91 98765 43210";

    const getInitials = () =>
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

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

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-8 mb-4"
            >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-montserrat shrink-0">
                        {getInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[20px] font-bold text-gray-900 font-montserrat">
                            {firstName} {lastName}
                        </h2>
                        <p className="text-[13px] text-gray-400 font-poppins mt-0.5">
                            Student Account
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {email}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 font-poppins">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                {phone}
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
                        onClick={() => setEditing(!editing)}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium font-poppins transition-colors",
                            editing
                                ? "text-red-500 hover:bg-red-50"
                                : "text-primary hover:bg-primary/5"
                        )}
                    >
                        {editing ? (
                            <X className="w-3.5 h-3.5" />
                        ) : (
                            <Edit3 className="w-3.5 h-3.5" />
                        )}
                        {editing ? "Cancel" : "Edit"}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "First Name", value: firstName },
                        { label: "Last Name", value: lastName },
                        { label: "Email Address", value: email },
                        { label: "Phone Number", value: phone },
                    ].map((field) => (
                        <div key={field.label}>
                            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-1.5 block">
                                {field.label}
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    defaultValue={field.value}
                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-[13px] font-poppins text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30"
                                />
                            ) : (
                                <p className="text-[13.5px] text-gray-800 font-poppins py-2">
                                    {field.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {editing && (
                    <div className="flex justify-end mt-5 pt-4 border-t border-gray-50">
                        <button
                            onClick={() => setEditing(false)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold font-poppins shadow-sm shadow-primary/20 hover:bg-primary-dark transition-all"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Academic Information */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6"
            >
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-5">
                    Academic Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                        { label: "University", value: profile.university, Icon: GraduationCap },
                        { label: "Course", value: profile.course, Icon: GraduationCap },
                        { label: "Year", value: profile.year, Icon: Calendar },
                        { label: "Enrollment ID", value: profile.enrollmentId, Icon: User },
                    ].map((field) => (
                        <div key={field.label} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                                <field.Icon className="w-[15px] h-[15px] text-gray-400" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins font-semibold mb-0.5">
                                    {field.label}
                                </p>
                                <p className="text-[13.5px] text-gray-800 font-poppins">
                                    {field.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
