"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/authentication/authentication";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function useGoogleAuth(redirectTo = "/students/dashboard") {
    const router = useRouter();
    const { storeUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Called by @react-oauth/google's useGoogleLogin success callback.
     * `credential` is the raw ID token string from Google.
     */
    const handleGoogleCredential = useCallback(
        async (credential: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(`${API}/api/users/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ access_token: credential }),
                });

                const json = await res.json();

                if (!res.ok) {
                    setError(json.message ?? "Google sign-in failed. Please try again.");
                    return;
                }

                storeUser({ role: "student", userObject: json.data.user });
                router.push(redirectTo);
            } catch {
                setError("Network error. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [storeUser, router, redirectTo]
    );

    return { handleGoogleCredential, isLoading, error };
}
