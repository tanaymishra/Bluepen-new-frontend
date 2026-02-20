"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface NotificationPrefs {
    emailUpdates:      boolean;
    emailPromotions:   boolean;
    smsUpdates:        boolean;
    pushNotifications: boolean;
    deadlineReminders: boolean;
}

const DEFAULTS: NotificationPrefs = {
    emailUpdates:      true,
    emailPromotions:   false,
    smsUpdates:        true,
    pushNotifications: true,
    deadlineReminders: true,
};

interface UseSettingsReturn {
    prefs:       NotificationPrefs;
    isLoading:   boolean;
    isSaving:    boolean;
    error:       string | null;
    updatePref:  (key: keyof NotificationPrefs, value: boolean) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
    const [prefs, setPrefs]       = useState<NotificationPrefs>(DEFAULTS);
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving]   = useState(false);
    const [error, setError]       = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        fetch(`${API}/api/settings/notifications`, { credentials: "include" })
            .then((r) => r.json())
            .then((body) => {
                if (!cancelled && body.data) setPrefs(body.data);
            })
            .catch(() => { /* keep defaults */ })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

    const updatePref = useCallback(async (key: keyof NotificationPrefs, value: boolean) => {
        /* Optimistic update */
        setPrefs((prev) => ({ ...prev, [key]: value }));
        setSaving(true);
        try {
            const r = await fetch(`${API}/api/settings/notifications`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ [key]: value }),
            });
            if (!r.ok) throw new Error("Failed to save preference");
            const body = await r.json();
            if (body.data) setPrefs(body.data);
        } catch (e: unknown) {
            /* Revert on failure */
            setPrefs((prev) => ({ ...prev, [key]: !value }));
            setError(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    }, []);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        const r = await fetch(`${API}/api/settings/password`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        const body = await r.json();
        if (!r.ok) throw new Error(body.message ?? "Failed to update password");
    }, []);

    return { prefs, isLoading, isSaving, error, updatePref, changePassword };
}
