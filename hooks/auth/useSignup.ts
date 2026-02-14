"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authentication/authentication";
import { isEmailTaken, registerUser } from "@/lib/static";

interface SignupState {
    firstname: string;
    lastname: string;
    email: string;
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
        (
            field: keyof Pick<
                SignupState,
                "firstname" | "lastname" | "email" | "phone" | "password" | "confirmPassword"
            >,
            value: string
        ) => {
            setState((prev) => ({ ...prev, [field]: value, error: null }));
        },
        []
    );

    const toggleShowPassword = useCallback(() => {
        setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    }, []);

    const toggleShowConfirmPassword = useCallback(() => {
        setState((prev) => ({
            ...prev,
            showConfirmPassword: !prev.showConfirmPassword,
        }));
    }, []);

    const toggleAgreedToTerms = useCallback(() => {
        setState((prev) => ({
            ...prev,
            agreedToTerms: !prev.agreedToTerms,
            error: null,
        }));
    }, []);

    const handleSignup = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            // Validation
            if (!state.firstname.trim() || !state.lastname.trim()) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Please enter your full name.",
                }));
                return;
            }

            if (!state.email.trim()) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Please enter your email address.",
                }));
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(state.email)) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Please enter a valid email address.",
                }));
                return;
            }

            if (!state.phone.trim()) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Please enter your phone number.",
                }));
                return;
            }

            if (state.password.length < 6) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Password must be at least 6 characters.",
                }));
                return;
            }

            if (state.password !== state.confirmPassword) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "Passwords do not match.",
                }));
                return;
            }

            if (!state.agreedToTerms) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "You must agree to the Terms & Conditions.",
                }));
                return;
            }

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1200));

            // Check if email is already taken
            if (isEmailTaken(state.email)) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: "This email is already registered. Try logging in instead.",
                }));
                return;
            }

            // Register user
            const user = registerUser({
                firstname: state.firstname,
                lastname: state.lastname,
                email: state.email,
                phone: state.phone,
                password: state.password,
            });

            // Store user in auth
            storeUser({
                role: user.role,
                userObject: user,
                token: user.token,
            });

            setState((prev) => ({ ...prev, isLoading: false }));
            router.push("/");
        },
        [
            state.firstname,
            state.lastname,
            state.email,
            state.phone,
            state.password,
            state.confirmPassword,
            state.agreedToTerms,
            storeUser,
            router,
        ]
    );

    return {
        ...state,
        setField,
        toggleShowPassword,
        toggleShowConfirmPassword,
        toggleAgreedToTerms,
        handleSignup,
    };
}
