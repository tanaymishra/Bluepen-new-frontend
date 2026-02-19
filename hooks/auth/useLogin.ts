"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/authentication/authentication";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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

            if (!state.email.trim()) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Please enter your email address." }));
                return;
            }
            if (!state.password) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Please enter your password." }));
                return;
            }

            try {
                const res = await fetch(`${API}/api/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email: state.email.trim(), password: state.password }),
                });

                const json = await res.json();

                if (!res.ok) {
                    setState((prev) => ({ ...prev, isLoading: false, error: json.message ?? "Invalid email or password." }));
                    return;
                }

                storeUser({ role: "student", userObject: json.data.user });
                setState((prev) => ({ ...prev, isLoading: false }));

                const prevPath = searchParams.get("prev");
                router.push(prevPath ?? "/students/dashboard");
            } catch {
                setState((prev) => ({ ...prev, isLoading: false, error: "Network error. Please try again." }));
            }
        },
        [state.email, state.password, storeUser, router, searchParams]
    );

    return { ...state, setField, toggleShowPassword, handleLogin };
}
