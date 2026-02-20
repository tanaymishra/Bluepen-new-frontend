"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface ReferralItem {
    id: string;
    name: string;
    email: string;
    invitedAt: string;
    status: "pending" | "signed_up" | "first_order" | "rewarded";
    rewardAmount: number | null;
}

export interface ReferralData {
    code: string;
    link: string;
    totalReferred: number;
    successfulReferrals: number;
    totalEarnings: number;
    referrals: ReferralItem[];
}

interface UseReferralsReturn {
    data: ReferralData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useReferrals(): UseReferralsReturn {
    const [data, setData]         = useState<ReferralData | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [trigger, setTrigger]   = useState(0);

    const refresh = useCallback(() => setTrigger((n) => n + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`${API}/api/referrals`, { credentials: "include" })
            .then((r) => {
                if (!r.ok) throw new Error("Failed to load referrals");
                return r.json();
            })
            .then((body) => {
                if (!cancelled) setData(body.data);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message ?? "Something went wrong");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [trigger]);

    return { data, isLoading, error, refresh };
}
