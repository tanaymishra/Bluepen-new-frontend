import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API_URL   = process.env.NEXT_PUBLIC_API_URL!;
const UPLOAD_URL = process.env.NEXT_PUBLIC_FILES_UPLOAD_URL!;
const UPLOAD_FOLDER = '/assignments/freelancing';

interface PostAssignmentPayload {
    type: string;
    subtype: string;
    title: string;
    academicLevel: string;
    subject: string;
    wordCount: string;
    deadline: Date | null;
    referencingStyle: string;
    instructions: string;
    files: File[];
}

interface UsePostAssignmentReturn {
    submitting: boolean;
    error: string | null;
    submit: (payload: PostAssignmentPayload) => Promise<void>;
}

export function usePostAssignment(): UsePostAssignmentReturn {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const router                       = useRouter();

    const uploadFile = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append('folder', UPLOAD_FOLDER);
        fd.append('file', file);

        const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`File upload failed: ${file.name}`);

        const data = await res.json();
        const savedAs: string = data?.files?.[0]?.savedAs;
        if (!savedAs) throw new Error(`No savedAs in upload response for: ${file.name}`);
        return savedAs;
    };

    const submit = useCallback(async (payload: PostAssignmentPayload) => {
        setSubmitting(true);
        setError(null);

        try {
            /* 1. Upload files one by one, collect savedAs filenames */
            const attachments: string[] = [];
            for (const file of payload.files) {
                const savedAs = await uploadFile(file);
                attachments.push(savedAs);
            }

            /* 2. POST assignment to backend */
            const res = await fetch(`${API_URL}/api/assignments`, {
                method:      'POST',
                credentials: 'include', // send HttpOnly cookie
                headers:     { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type:             payload.type,
                    subtype:          payload.subtype,
                    title:            payload.title,
                    academicLevel:    payload.academicLevel,
                    subject:          payload.subject,
                    wordCount:        payload.wordCount,
                    deadline:         payload.deadline?.toISOString(),
                    referencingStyle: payload.referencingStyle,
                    instructions:     payload.instructions,
                    attachments,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message ?? 'Failed to submit assignment');
            }

            /* 3. Redirect to student assignments page */
            router.push('/students/assignments');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    }, [router]);

    return { submitting, error, submit };
}
