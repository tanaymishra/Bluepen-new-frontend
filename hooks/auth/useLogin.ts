"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import { validateCredentials } from "@/lib/static";

interface LoginState {
    email: string;
    password: string;
    isLoading: boolean;
    error: string | null;
    showPassword: boolean;
}

export function useLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { storeUser } = useAuth();

    const [state, setState] = useState<LoginState>({
        email: "",
        password: "",
        isLoading: false,
        error: null,
        showPassword: false,
    });

    const setField = useCallback(
        (field: keyof Pick<LoginState, "email" | "password">, value: string) => {
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

            // Basic validation
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

            // Simulate network delay
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

            // Store user in auth store
            storeUser({
                role: user.role,
                userObject: user,
                token: user.token,
            });

            setState((prev) => ({ ...prev, isLoading: false }));

            // Redirect to previous page or dashboard
            const prevPath = searchParams.get("prev");
            if (prevPath) {
                router.push(prevPath);
            } else {
                router.push("/");
            }
        },
        [state.email, state.password, storeUser, router, searchParams]
    );

    return {
        ...state,
        setField,
        toggleShowPassword,
        handleLogin,
    };
}
