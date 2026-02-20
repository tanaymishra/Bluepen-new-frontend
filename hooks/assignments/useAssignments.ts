import { useState, useEffect, useCallback } from 'react';
import { type AssignmentStageKey } from '@/lib/static';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface ApiAssignment {
    id: string;          // uuid
    title: string;
    type: string;
    subtype: string;
    subject: string;
    academicLevel: string;
    wordCount: number;
    deadline: string;
    submittedAt: string;
    stage: AssignmentStageKey;
    referencingStyle: string;
    instructions: string;
    attachments: string[];
    price: number | null;
}

interface UseAssignmentsReturn {
    assignments: ApiAssignment[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useAssignments(): UseAssignmentsReturn {
    const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    const fetchAssignments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/assignments`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? 'Failed to load assignments');
            setAssignments(data.data.assignments ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return { assignments, loading, error, refetch: fetchAssignments };
}
