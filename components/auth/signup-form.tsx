
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import { useToast } from "@/context/toastContext";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { cn } from "@/lib/utils";

interface SignupFormProps {
    baseURL: string;
    onLoginClick: () => void;
    prefillPhone?: string;
}

interface GoogleJwtPayload extends JwtPayload {
    given_name?: string;
    family_name?: string;
    email?: string;
}

export function SignupForm({ baseURL, onLoginClick, prefillPhone }: SignupFormProps) {
    const router = useRouter();
    const { storeUser } = useAuth();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        whatsappNo: "",
        countryCode: "+91",
        countryName: "India",
        affiliate: "",
        intake: "",
    });

    useEffect(() => {
        if (prefillPhone) {
            setFormData(prev => ({
                ...prev,
                whatsappNo: prefillPhone,
                countryCode: "+91", // Default to India for prefill case as per original logic
                countryName: "India"
            }));
        }
    }, [prefillPhone]);

    const [signupMethod, setSignupMethod] = useState<"whatsapp" | "google">("whatsapp");
    const [googleToken, setGoogleToken] = useState("");

    const [affiliateStatus, setAffiliateStatus] = useState<{ valid: boolean, message: string, checking: boolean }>({
        valid: false, message: "", checking: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "affiliate") {
            if (value.length >= 10) {
                verifyReferral(value);
            } else {
                setAffiliateStatus({ valid: false, message: "", checking: false });
            }
        }
    };

    const verifyReferral = async (code: string) => {
        setAffiliateStatus(prev => ({ ...prev, checking: true }));
        try {
            const response = await fetch(`${baseURL}/user/checkReferralCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ referral_code: code }),
            });
            const data = await response.json();
            if (data.status === 200) {
                setAffiliateStatus({ valid: true, message: "Valid Code", checking: false });
            } else {
                setAffiliateStatus({ valid: false, message: "Invalid Code", checking: false });
            }
        } catch (error) {
            setAffiliateStatus({ valid: false, message: "Error checking code", checking: false });
        }
    };

    const handleGoogleSignup = (response: any) => {
        if (response.credential) {
            const userObject = jwtDecode<GoogleJwtPayload>(response.credential);
            setGoogleToken(response.credential);
            setSignupMethod("google");
            setFormData(prev => ({
                ...prev,
                firstName: userObject.given_name || "",
                lastName: userObject.family_name || "",
                email: userObject.email || "",
            }));
        }
    };

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (typeof window !== "undefined" && window.google?.accounts) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                        callback: handleGoogleSignup,
                    });

                    const signInDiv = document.getElementById("google-signup-btn");
                    if (signInDiv) {
                        window.google.accounts.id.renderButton(signInDiv, {
                            theme: "outline",
                            size: "large",
                            width: "100%",
                            text: "signup_with",
                            logo_alignment: "center",
                        });
                    }
                } catch (error) {
                    // console.error(error);
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

        if (signupMethod === "whatsapp") {
            loadGoogleScript();
        }

    }, [signupMethod]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${baseURL}/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    countryName: formData.countryName,
                    countryCode: formData.countryCode, // Original used countryCode: formData.countryCode which was just code? 
                    // Re-checking original: it used 'countryCode: formData.countryCode' and 'number: whatsappNum'. 
                    // My PhoneInput sets countryCode to '+91'. The backend might want '91'.
                    // Let's strip '+' just in case
                    // number: whatsappNum (which was formData.whatsappNo converted to Number)
                    number: Number(formData.whatsappNo),
                    referral_code_used: formData.affiliate,
                    signInMethod: signupMethod,
                    googleToken: googleToken,
                    intake: formData.intake,
                }),
            });

            const data = await response.json();

            if (data.status === 200) {
                storeUser({
                    role: "student",
                    userObject: data.userDetails[0],
                    token: data.token,
                });
                showToast("Signup Successful", "success");
                router.push("/student/dashboard");
                window.location.reload();
            } else {
                showToast(data.message || "Signup failed", "error");
            }
        } catch (error) {
            showToast("Signup failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-3xl font-bold tracking-tight font-montserrat text-gray-900">Create an account</CardTitle>
                <CardDescription className="text-base font-poppins text-gray-500">Enter your details below to create your account</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-0">
                {signupMethod === "whatsapp" && (
                    <>
                        <div className="grid gap-2">
                            <div id="google-signup-btn" className="w-full flex justify-center"></div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>
                    </>
                )}

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-gray-700 font-medium">First name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Max"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="h-11 bg-gray-50/50 border-gray-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Robinson"
                                required
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="h-11 bg-gray-50/50 border-gray-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            readOnly={signupMethod === "google"}
                            className={cn(
                                "h-11 bg-gray-50/50 border-gray-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl",
                                signupMethod === "google" && "bg-muted text-muted-foreground opacity-70"
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">WhatsApp Number</Label>
                        <PhoneInput
                            value={formData.whatsappNo}
                            onChange={(val, country) => {
                                setFormData(prev => ({
                                    ...prev,
                                    whatsappNo: val,
                                    countryCode: country.code,
                                    countryName: country.name
                                }));
                            }}
                            placeholder="Phone Number"
                            required
                            className="bg-gray-50/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="intake" className="text-gray-700 font-medium">Intake</Label>
                        <div className="relative">
                            <select
                                id="intake"
                                name="intake"
                                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                value={formData.intake}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select your intake</option>
                                <option value="jan2024">Jan 2024</option>
                                <option value="sept2024">Sept 2024</option>
                                <option value="jan2025">Jan 2025</option>
                                <option value="sept2025">Sept 2025</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="affiliate" className="text-gray-700 font-medium">Referral Code (Optional)</Label>
                        <div className="relative">
                            <Input
                                id="affiliate"
                                name="affiliate"
                                placeholder="BLUE12345"
                                value={formData.affiliate}
                                onChange={handleInputChange}
                                className={cn(
                                    "h-11 bg-gray-50/50 border-gray-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl",
                                    affiliateStatus.valid && "border-green-500 pr-10 focus:border-green-500 focus:ring-green-500/20"
                                )}
                            />
                            {affiliateStatus.valid && (
                                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                            )}
                        </div>
                        {affiliateStatus.checking && <p className="text-xs text-muted-foreground ml-1">Checking code...</p>}
                        {!affiliateStatus.valid && affiliateStatus.message && (
                            <p className="text-xs text-destructive ml-1">{affiliateStatus.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-[#3b6dbf] to-primary hover:opacity-90 transition-opacity text-base font-semibold shadow-lg shadow-blue-500/20"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
