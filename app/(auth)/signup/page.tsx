"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Phone,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useSignup } from "@/hooks/auth/useSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
    const {
        firstname,
        lastname,
        email,
        phone,
        password,
        confirmPassword,
        isLoading,
        error,
        showPassword,
        showConfirmPassword,
        agreedToTerms,
        setField,
        toggleShowPassword,
        toggleShowConfirmPassword,
        toggleAgreedToTerms,
        handleSignup,
    } = useSignup();

    // Password strength indicator
    const getPasswordStrength = (pw: string) => {
        if (!pw) return { level: 0, label: "", color: "" };
        let score = 0;
        if (pw.length >= 6) score++;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-400" };
        if (score <= 2) return { level: 2, label: "Fair", color: "bg-orange-400" };
        if (score <= 3) return { level: 3, label: "Good", color: "bg-yellow-400" };
        if (score <= 4) return { level: 4, label: "Strong", color: "bg-green-400" };
        return { level: 5, label: "Excellent", color: "bg-emerald-500" };
    };

    const strength = getPasswordStrength(password);

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
                    Create account
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-gray-500 font-poppins mt-2.5 text-[15px]"
                >
                    Join thousands of students getting better grades
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
            <form onSubmit={handleSignup} className="space-y-4" id="signup-form">
                {/* Name Row */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <div className="space-y-2">
                        <Label htmlFor="signup-firstname">First name</Label>
                        <Input
                            id="signup-firstname"
                            type="text"
                            value={firstname}
                            onChange={(e) => setField("firstname", e.target.value)}
                            placeholder="Rahul"
                            autoComplete="given-name"
                            icon={<User className="w-[18px] h-[18px]" />}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-lastname">Last name</Label>
                        <Input
                            id="signup-lastname"
                            type="text"
                            value={lastname}
                            onChange={(e) => setField("lastname", e.target.value)}
                            placeholder="Sharma"
                            autoComplete="family-name"
                            icon={<User className="w-[18px] h-[18px]" />}
                        />
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="space-y-2"
                >
                    <Label htmlFor="signup-email">Email address</Label>
                    <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        icon={<Mail className="w-[18px] h-[18px]" />}
                    />
                </motion.div>

                {/* Phone */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="space-y-2"
                >
                    <Label htmlFor="signup-phone">Phone number</Label>
                    <Input
                        id="signup-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        icon={<Phone className="w-[18px] h-[18px]" />}
                    />
                </motion.div>

                {/* Password */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="space-y-2"
                >
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setField("password", e.target.value)}
                        placeholder="Min. 6 characters"
                        autoComplete="new-password"
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

                    {/* Password strength bar */}
                    {password && (
                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex-1 flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] font-medium text-gray-500 font-poppins min-w-[56px] text-right">
                                {strength.label}
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="space-y-2"
                >
                    <Label htmlFor="signup-confirm-password">Confirm password</Label>
                    <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setField("confirmPassword", e.target.value)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        icon={<Lock className="w-[18px] h-[18px]" />}
                        className={
                            confirmPassword && confirmPassword === password
                                ? "border-green-300 focus:border-green-400"
                                : confirmPassword && confirmPassword !== password
                                    ? "border-red-300 focus:border-red-400"
                                    : ""
                        }
                        trailingIcon={
                            <button
                                type="button"
                                onClick={toggleShowConfirmPassword}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-[18px] h-[18px]" />
                                ) : (
                                    <Eye className="w-[18px] h-[18px]" />
                                )}
                            </button>
                        }
                    />
                </motion.div>

                {/* Terms — Radix Checkbox */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="flex items-start gap-3 pt-1"
                >
                    <Checkbox
                        id="signup-terms"
                        checked={agreedToTerms}
                        onCheckedChange={() => toggleAgreedToTerms()}
                        className="mt-0.5"
                    />
                    <label
                        htmlFor="signup-terms"
                        className="text-[13px] text-gray-500 font-poppins leading-relaxed cursor-pointer select-none"
                    >
                        I agree to Bluepen&apos;s{" "}
                        <Link
                            href="/terms"
                            className="text-primary font-medium hover:underline"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-primary font-medium hover:underline"
                        >
                            Privacy Policy
                        </Link>
                    </label>
                </motion.div>

                {/* Submit */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="pt-2"
                >
                    <Button
                        id="signup-submit"
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
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
                transition={{ delay: 0.55, duration: 0.4 }}
                className="flex items-center gap-4 my-7"
            >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-xs font-medium text-gray-400 font-poppins uppercase tracking-wider">
                    or
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </motion.div>

            {/* Google Sign-Up */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <Button
                    id="signup-google"
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
                    Sign up with Google
                </Button>
            </motion.div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="text-center text-sm text-gray-500 font-poppins mt-8"
            >
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                    Sign in
                </Link>
            </motion.p>
        </motion.div>
    );
}
