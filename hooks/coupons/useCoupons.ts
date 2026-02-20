"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: "percentage" | "flat";
    discountValue: number;
    minOrderValue: number | null;
    maxDiscount: number | null;
    validFrom: string;
    validUntil: string;
    usedAt: string | null;
    status: "active" | "used" | "expired";
}

interface UseCouponsReturn {
    coupons: Coupon[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useCoupons(): UseCouponsReturn {
    const [coupons, setCoupons]   = useState<Coupon[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [trigger, setTrigger]   = useState(0);

    const refresh = useCallback(() => setTrigger((n) => n + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`${API}/api/coupons`, { credentials: "include" })
            .then((r) => {
                if (!r.ok) throw new Error("Failed to load coupons");
                return r.json();
            })
            .then((body) => {
                if (!cancelled) setCoupons(body.data ?? []);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message ?? "Something went wrong");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [trigger]);

    return { coupons, isLoading, error, refresh };
}
