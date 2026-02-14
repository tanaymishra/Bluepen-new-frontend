"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import { validateCredentials } from "@/lib/static";

interface AdminLoginState {
    email: string;
    password: string;
    isLoading: boolean;
    error: string | null;
    showPassword: boolean;
}

export function useAdminLogin() {
    const router = useRouter();
    const { storeUser } = useAuth();

    const [state, setState] = useState<AdminLoginState>({
        email: "",
        password: "",
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const setField = useCallback(
        (field: keyof Pick<AdminLoginState, "email" | "password">, value: string) => {
            setState((prev) => ({ ...prev, [field]: value, error: null }));
        },
        []
    );

    const toggleShowPassword = useCallback(() => {
        setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    }, []);

    const handleLogin = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            if (!state.email.trim()) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Please enter your email address.",
                }));
                return;
            }

            if (!state.password) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Please enter your password.",
                }));
                return;
            }

            await new Promise((resolve) => setTimeout(resolve, 1200));

            const user = validateCredentials(state.email, state.password);

            if (!user) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Invalid email or password. Please try again.",
                }));
                return;
            }

            if (user.role !== "admin") {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Access denied. Admin credentials required.",
                }));
                return;
            }

            storeUser({
                role: user.role,
                userObject: user,
                token: user.token,
            });

            setState((prev) => ({ ...prev, isLoading: false }));
            router.push("/admin/dashboard");
        },
        [state.email, state.password, storeUser, router]
    );

    return {
        ...state,
        setField,
        toggleShowPassword,
        handleLogin,
    };
}
