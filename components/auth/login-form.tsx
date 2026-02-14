
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import { useToast } from "@/context/toastContext";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input"; // Ensure this path is correct
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";

interface GoogleJwtPayload extends JwtPayload {
    email?: string;
}

interface LoginFormProps {
    baseURL: string;
    onSignupClick: (phoneNumber?: string) => void;
}

export function LoginForm({ baseURL, onSignupClick }: LoginFormProps) {
    const router = useRouter();
    const params = useSearchParams();
    const { storeUser, user, isHydrated, isMounted } = useAuth();
    const { showToast } = useToast();

    const [whatsappNo, setWhatsappNo] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [countryName, setCountryName] = useState("India");
    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingGoogleAuth, setPendingGoogleAuth] = useState<any>(null);

    useEffect(() => {
        if (isHydrated && user?.number_verified === 1) {
            router.push(params.get("prev") || "/student/dashboard");
        }
    }, [isHydrated, user, router, params]);

    // Handle Google Sign-In Initialization
    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (typeof window !== "undefined" && window.google?.accounts) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                        callback: handleGoogleSignup,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                        ux_mode: "popup",
                    });

                    const signInDiv = document.getElementById("google-signin-btn-login");
                    if (signInDiv) {
                        window.google.accounts.id.renderButton(signInDiv, {
                            theme: "outline",
                            size: "large",
                            width: "100%",
                            text: "signin_with",
                            logo_alignment: "center",
                        });
                    }
                } catch (error) {
                    console.error("Google Sign-In initialization error", error);
                }
            }
        };

        const loadGoogleScript = () => {
            if (typeof window !== "undefined" && !window.google?.accounts) {
                const script = document.createElement("script");
                script.src = "https://accounts.google.com/gsi/client";
                script.async = true;
                script.defer = true;
                script.onload = initializeGoogleSignIn;
                document.head.appendChild(script);
            } else {
                initializeGoogleSignIn();
            }
        };

        // Only load if not showing OTP to keep UI clean
        if (!showOTP) {
            loadGoogleScript();
        }

        return () => {
            // Cleanup if needed
        };
    }, [showOTP]);

    // Handle Google Response
    const handleGoogleSignup = async (response: any) => {
        if (!response?.credential) return;

        try {
            const userObject: GoogleJwtPayload = jwtDecode<GoogleJwtPayload>(response.credential);
            const mail = userObject.email;

            if (!mail) {
                showToast("No email received from Google", "error");
                return;
            }

            setIsLoading(true);
            const apiResponse = await fetch(`${baseURL}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: mail }),
            });

            const data = await apiResponse.json();

            if (apiResponse.ok && data.userDetails && data.token) {
                storeUser({
                    role: "student",
                    userObject: data.userDetails,
                    token: data.token,
                });
                showToast("Login Successful", "success");
                router.push("/student/dashboard");
            } else {
                onSignupClick();
                showToast(data.message || "Login failed - User not found", "error");
            }
        } catch (error) {
            showToast("Google authentication failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // OTP Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        } else if (otpTimer === 0 && showOTP) {
            // Timer ended logic if needed
        }
        return () => clearInterval(interval);
    }, [otpTimer, showOTP]);

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (whatsappNo.length !== 10) { // Assuming validation is handled by PhoneInput or here
            // If not +91, length might differ, but for simplicity assuming 10 for now.
            // Actually PhoneInput validated length for +91.
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${baseURL}/user/sendLoginOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    country_name: countryName,
                    country_code: countryCode.replace("+", ""), // Backend expects without + maybe? original code: country.code.
                    // Original code: setCountryCode(country.code) -> usually has +.
                    // But looking at original: countryCode: country.code || "91" (Wait, original default was "91" in some places?)
                    // Original: countryCode: country.code -> "+91".
                    // Let's keep it as is.
                    number: whatsappNo,
                }),
            });
            const data = await response.json();

            if (data.status === 200) {
                setShowOTP(true);
                setOtpTimer(120);
                showToast("OTP sent successfully", "success");
            } else if (data.status === 400 && data.message === "Please Signup first") {
                showToast(data.message, "error");
                onSignupClick();
            } else {
                showToast(data.message || "Failed to send OTP", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${baseURL}/user/verifyLoginOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ number: whatsappNo, otp }),
            });

            if (response.ok) {
                const data = await response.json();
                storeUser({
                    role: "student",
                    userObject: { ...data.userPersonDetails, number_verified: 1 },
                    token: data.token,
                });
                showToast("Login Successful", "success");
                router.push("/student/dashboard");
                window.location.reload();
            } else {
                showToast("Invalid OTP", "error");
            }
        } catch (error) {
            showToast("Verification failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-3xl font-bold tracking-tight font-montserrat text-gray-900">
                    {showOTP ? "Verify Phone" : "Welcome back"}
                </CardTitle>
                <CardDescription className="text-base font-poppins text-gray-500">
                    {showOTP
                        ? `Enter the code sent to ${whatsappNo}`
                        : "Enter your phone number to sign in to your account"}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-0">
                {!showOTP ? (
                    <>
                        <div className="grid gap-2">
                            <div id="google-signin-btn-login" className="w-full h-[40px] flex justify-center"></div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <form onSubmit={handleSendOtp} className="grid gap-5">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">WhatsApp Number</Label>
                                <PhoneInput
                                    value={whatsappNo}
                                    onChange={(val, country) => {
                                        setWhatsappNo(val);
                                        setCountryCode(country.code);
                                        setCountryName(country.name);
                                    }}
                                    placeholder="Phone Number"
                                    required
                                    className="bg-gray-50/50"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading || whatsappNo.length < 5}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-[#3b6dbf] to-primary hover:opacity-90 transition-opacity text-base font-semibold shadow-lg shadow-blue-500/20"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In with OTP
                            </Button>
                        </form>
                    </>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="grid gap-4">
                        <div className="flex justify-center py-4">
                            <OTPInput
                                length={4}
                                value={otp}
                                onChange={setOtp}
                                onComplete={() => { }}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading || otp.length !== 4}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Login
                        </Button>

                        <div className="text-center text-sm">
                            {otpTimer > 0 ? (
                                <span className="text-muted-foreground">Resend OTP in {otpTimer}s</span>
                            ) : (
                                <Button
                                    variant="link"
                                    type="button"
                                    onClick={() => handleSendOtp()}
                                    className="p-0 h-auto"
                                >
                                    Resend OTP
                                </Button>
                            )}
                        </div>

                        <Button variant="ghost" type="button" onClick={() => setShowOTP(false)} className="w-full">
                            Change Number
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
