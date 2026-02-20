import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/authentication/authentication';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface StudentProfile {
    uuid: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    profile_picture: string | null;
    university: string | null;
    course: string | null;
    created_at: string;
}

export interface UpdateProfilePayload {
    full_name?: string;
    phone_number?: string | null;
    university?: string | null;
    course?: string | null;
}

interface UseProfileReturn {
    profile: StudentProfile | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
    saveError: string | null;
    updateProfile: (payload: UpdateProfilePayload) => Promise<StudentProfile | null>;
    refetch: () => void;
}

export function useProfile(): UseProfileReturn {
    const { storeUser, user } = useAuth();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [saving, setSaving]     = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? 'Failed to load profile');
            const profileData: StudentProfile = data.data.user;
            setProfile(profileData);
            // Keep auth store in sync
            if (user) {
                storeUser({ role: user.role, userObject: { ...user, ...profileData } });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchProfile();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const updateProfile = useCallback(async (payload: UpdateProfilePayload): Promise<StudentProfile | null> => {
        setSaving(true);
        setSaveError(null);
        try {
            const res = await fetch(`${API_URL}/api/users/me`, {
                method:      'PATCH',
                credentials: 'include',
                headers:     { 'Content-Type': 'application/json' },
                body:        JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? 'Failed to update profile');
            const updated: StudentProfile = data.data.user;
            setProfile(updated);
            // Sync auth store
            if (user) {
                storeUser({ role: user.role, userObject: { ...user, ...updated } });
            }
            return updated;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Something went wrong';
            setSaveError(msg);
            return null;
        } finally {
            setSaving(false);
        }
    }, [user, storeUser]);

    return { profile, loading, error, saving, saveError, updateProfile, refetch: fetchProfile };
}
