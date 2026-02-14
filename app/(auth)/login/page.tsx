"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useLogin } from "@/hooks/auth/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
    const {
        email,
        password,
        isLoading,
        error,
        showPassword,
        setField,
        toggleShowPassword,
        handleLogin,
    } = useLogin();

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
                <Link href="/">
                    <Image
                        src="/assets/logo/bluepenonly.svg"
                        alt="Bluepen"
                        width={120}
                        height={40}
                        priority
                    />
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-3xl md:text-[34px] font-bold text-gray-900 font-montserrat leading-tight"
                >
                    Welcome back
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-gray-500 font-poppins mt-2.5 text-[15px]"
                >
                    Sign in to continue to your dashboard
                </motion.p>
            </div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-6"
                >
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-600 font-poppins">{error}</p>
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" id="login-form">
                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="space-y-2"
                >
                    <Label htmlFor="login-email">Email address</Label>
                    <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        icon={<Mail className="w-[18px] h-[18px]" />}
                    />
                </motion.div>

                {/* Password */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <button
                            type="button"
                            className="text-xs font-medium text-primary hover:text-primary-dark font-poppins transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setField("password", e.target.value)}
                        placeholder="Enter your password"
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
                        id="login-submit"
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

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="flex items-center gap-4 my-8"
            >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-xs font-medium text-gray-400 font-poppins uppercase tracking-wider">
                    or
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </motion.div>

            {/* Google Sign-In */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
            >
                <Button
                    id="login-google"
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full gap-3"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </Button>
            </motion.div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="text-center text-sm text-gray-500 font-poppins mt-8"
            >
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                    Create account
                </Link>
            </motion.p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
