"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

/* ── Types ── */
export interface WalletTx {
    id: string;
    type: "credit" | "debit";
    reason: "payment" | "refund" | "referral_bonus" | "coupon_discount" | "wallet_topup" | "admin_adjustment";
    amount: number;
    balanceAfter: number;
    description: string | null;
    assignmentId?: string | null;
    paymentRef?: string | null;
    date: string;
}

interface WalletData {
    balance: number;
    currency: string;
    transactions: WalletTx[];
}

interface UseWalletReturn {
    balance: number;
    currency: string;
    transactions: WalletTx[];
    isLoading: boolean;
    error: string | null;
    isProcessing: boolean;
    openAddFundsFlow: (amountINR: number, studentEmail?: string, studentName?: string) => Promise<void>;
    refresh: () => void;
}

/* ── Load Razorpay checkout script ── */
function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function useWallet(): UseWalletReturn {
    const [wallet, setWallet] = useState<WalletData>({
        balance: 0,
        currency: "INR",
        transactions: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [trigger, setTrigger] = useState(0);

    const refresh = useCallback(() => setTrigger((n) => n + 1), []);

    /* ── Fetch wallet data ── */
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        fetch(`${API}/api/wallet`, {
            credentials: "include",
        })
            .then((r) => {
                if (!r.ok) throw new Error("Failed to load wallet");
                return r.json();
            })
            .then((body) => {
                if (!cancelled) setWallet(body.data);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message ?? "Something went wrong");
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [trigger]);

    /* ── Main flow: create order → open Razorpay → verify ── */
    const openAddFundsFlow = useCallback(
        async (amountINR: number, studentEmail = "", studentName = "") => {
            if (!amountINR || amountINR < 1) return;

            setIsProcessing(true);
            setError(null);

            try {
                /* 1. Load Razorpay script */
                const loaded = await loadRazorpayScript();
                if (!loaded) throw new Error("Could not load payment gateway. Please try again.");

                /* 2. Create order on backend */
                const orderRes = await fetch(`${API}/api/wallet/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ amount: amountINR }),
                });
                if (!orderRes.ok) {
                    const body = await orderRes.json().catch(() => ({}));
                    throw new Error(body?.message ?? "Could not create payment order");
                }
                const { data: orderData } = await orderRes.json();

                /* 3. Open Razorpay checkout */
                await new Promise<void>((resolve, reject) => {
                    const rzpOptions = {
                        key: RAZORPAY_KEY_ID,
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: "Bluepen",
                        description: "Wallet Top-up",
                        order_id: orderData.orderId,
                        prefill: {
                            email: studentEmail,
                            name: studentName,
                        },
                        theme: { color: "#1D4ED8" },
                        handler: async (response: {
                            razorpay_order_id: string;
                            razorpay_payment_id: string;
                            razorpay_signature: string;
                        }) => {
                            try {
                                /* 4. Verify on backend + credit wallet */
                                const verifyRes = await fetch(`${API}/api/wallet/verify`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                    body: JSON.stringify(response),
                                });
                                if (!verifyRes.ok) {
                                    const body = await verifyRes.json().catch(() => ({}));
                                    throw new Error(body?.message ?? "Payment verification failed");
                                }
                                const { data: verifyData } = await verifyRes.json();
                                setWallet((prev) => ({
                                    ...prev,
                                    balance: verifyData.balance,
                                }));
                                refresh();
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        },
                        modal: {
                            ondismiss: () => reject(new Error("Payment cancelled")),
                        },
                    };

                    const rzp = new (window as any).Razorpay(rzpOptions);
                    rzp.on("payment.failed", (resp: any) => {
                        reject(new Error(resp?.error?.description ?? "Payment failed"));
                    });
                    rzp.open();
                });
            } catch (e: any) {
                const msg: string = e?.message ?? "Payment failed";
                if (msg !== "Payment cancelled") setError(msg);
            } finally {
                setIsProcessing(false);
            }
        },
        [refresh],
    );

    return {
        balance: wallet.balance,
        currency: wallet.currency,
        transactions: wallet.transactions,
        isLoading,
        error,
        isProcessing,
        openAddFundsFlow,
        refresh,
    };
}
