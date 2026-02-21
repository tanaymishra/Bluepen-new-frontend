"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle,
    Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFreelancerLogin } from "@/hooks/auth/useFreelancerLogin";

function FreelancerLoginForm() {
    const {
        email,
        password,
        isLoading,
        error,
        showPassword,
        setField,
        toggleShowPassword,
        handleLogin,
    } = useFreelancerLogin();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Mobile Logo */}
            <div className="flex justify-center mb-6 lg:hidden">
                <Link href="/" className="relative w-32 h-10">
                    <Image
                        src="/assets/logo/bluepenonly.svg"
                        alt="Bluepen"
                        fill
                        className="object-contain"
                    />
                </Link>
            </div>

            {/* Freelancer Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, duration: 0.4 }}
                className="flex items-center gap-2 mb-4"
            >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-[18px] h-[18px] text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary font-poppins">
                    Freelancer Portal
                </span>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-montserrat tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-sm font-poppins mt-2 leading-relaxed">
                    Sign in to access your freelancer workspace
                </p>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-start gap-2.5 p-3.5 mt-6 rounded-xl bg-red-50 border border-red-100"
                >
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-600 font-poppins">{error}</p>
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                >
                    <Label htmlFor="freelancer-email">Email Address</Label>
                    <Input
                        id="freelancer-email"
                        type="email"
                        placeholder="you@bluepen.co.in"
                        value={email}
                        onChange={(e) => setField("email", e.target.value)}
                        autoComplete="email"
                        autoFocus
                        icon={<Mail className="w-[18px] h-[18px]" />}
                    />
                </motion.div>

                {/* Password */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <Label htmlFor="freelancer-password">Password</Label>
                    <Input
                        id="freelancer-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setField("password", e.target.value)}
                        autoComplete="current-password"
                        icon={<Lock className="w-[18px] h-[18px]" />}
                        trailingIcon={
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-[18px] h-[18px]" />
                                ) : (
                                    <Eye className="w-[18px] h-[18px]" />
                                )}
                            </button>
                        }
                    />
                </motion.div>

                {/* Submit */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="pt-2"
                >
                    <Button
                        id="freelancer-login-submit"
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </motion.div>
            </form>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-center mt-10 space-y-2"
            >
                <p className="text-xs text-gray-400 font-poppins">
                    This portal is restricted to authorized freelancers only.
                </p>
                <p className="text-[13px] text-gray-500 font-poppins">
                    Want to join?{" "}
                    <Link href="/freelancer/apply" className="text-primary hover:text-primary-dark font-medium transition-colors">
                        Apply as a Freelancer
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function FreelancerLoginPage() {
    return <FreelancerLoginForm />;
}
