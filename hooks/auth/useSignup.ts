"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authentication/authentication";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface SignupState {
    firstname: string;
    lastname: string;
    email: string;
    countryCode: string;
    phone: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    error: string | null;
    showPassword: boolean;
    showConfirmPassword: boolean;
    agreedToTerms: boolean;
}

export function useSignup() {
    const router = useRouter();
    const { storeUser } = useAuth();

    const [state, setState] = useState<SignupState>({
        firstname: "",
        lastname: "",
        email: "",
        countryCode: "+44",
        phone: "",
        password: "",
        confirmPassword: "",
        isLoading: false,
        error: null,
        showPassword: false,
        showConfirmPassword: false,
        agreedToTerms: false,
    });

    const setField = useCallback(
        (field: keyof Pick<SignupState, "firstname" | "lastname" | "email" | "countryCode" | "phone" | "password" | "confirmPassword">, value: string) => {
            setState((prev) => ({ ...prev, [field]: value, error: null }));
        },
        []
    );

    const toggleShowPassword = useCallback(() =>
        setState((prev) => ({ ...prev, showPassword: !prev.showPassword })), []);

    const toggleShowConfirmPassword = useCallback(() =>
        setState((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword })), []);

    const toggleAgreedToTerms = useCallback(() =>
        setState((prev) => ({ ...prev, agreedToTerms: !prev.agreedToTerms, error: null })), []);

    const handleSignup = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            if (!state.firstname.trim() || !state.lastname.trim()) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Please enter your full name." }));
                return;
            }
            if (!state.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Please enter a valid email address." }));
                return;
            }
            if (!state.phone.trim()) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Please enter your phone number." }));
                return;
            }
            if (state.password.length < 8) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Password must be at least 8 characters." }));
                return;
            }
            if (state.password !== state.confirmPassword) {
                setState((prev) => ({ ...prev, isLoading: false, error: "Passwords do not match." }));
                return;
            }
            if (!state.agreedToTerms) {
                setState((prev) => ({ ...prev, isLoading: false, error: "You must agree to the Terms & Conditions." }));
                return;
            }

            try {
                const res = await fetch(`${API}/api/users/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        full_name: `${state.firstname.trim()} ${state.lastname.trim()}`,
                        email: state.email.trim(),
                        password: state.password,
                        phone_number: `${state.countryCode} ${state.phone.trim()}`,
                    }),
                });

                const json = await res.json();

                if (!res.ok) {
                    setState((prev) => ({ ...prev, isLoading: false, error: json.message ?? "Signup failed. Please try again." }));
                    return;
                }

                storeUser({ role: "student", userObject: json.data.user });
                setState((prev) => ({ ...prev, isLoading: false }));
                router.push("/students/dashboard");
            } catch {
                setState((prev) => ({ ...prev, isLoading: false, error: "Network error. Please try again." }));
            }
        },
        [state.firstname, state.lastname, state.email, state.countryCode, state.phone,
        state.password, state.confirmPassword, state.agreedToTerms, storeUser, router]
    );

    return { ...state, setField, toggleShowPassword, toggleShowConfirmPassword, toggleAgreedToTerms, handleSignup };
}
