
"use client";

import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthContent() {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
    const [prefillPhone, setPrefillPhone] = useState("");
    const baseUrl = String(process.env.NEXT_PUBLIC_BASE_URL);

    const handleSignupClick = (phoneNumber?: string) => {
        if (phoneNumber) setPrefillPhone(phoneNumber);
        setActiveTab("signup");
    };

    const handleLoginClick = () => {
        setActiveTab("login");
    };

    return (
        <>
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "signup")} className="w-full flex flex-col max-h-[85vh]">
                <div className="shrink-0 mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login" className="font-montserrat">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="font-montserrat">Sign Up</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                    <TabsContent value="login" className="mt-0 pb-2">
                        <LoginForm
                            baseURL={baseUrl}
                            onSignupClick={handleSignupClick}
                        />
                    </TabsContent>
                    <TabsContent value="signup" className="mt-0 pb-2">
                        <SignupForm
                            baseURL={baseUrl}
                            onLoginClick={handleLoginClick}
                            prefillPhone={prefillPhone}
                        />
                    </TabsContent>
                </div>
            </Tabs>
            <div className="mt-4 text-center text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
        </>
    );
}
