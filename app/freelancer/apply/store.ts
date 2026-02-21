import { create } from "zustand";
import { uploadFile } from "@/lib/upload";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const RESUME_FOLDER = "/freelancer/resumes";

/* ──────────────────── Types ──────────────────── */

export interface ExistingAppInfo {
    applicationId: string;
    currentStep: number;
    specialisations: string[];
    createdAt: string;
}

interface FreelancerApplyState {
    /* Navigation */
    step: number;
    setStep: (s: number) => void;
    loading: boolean;
    error: string;
    setError: (e: string) => void;
    applicationId: string | null;

    /* Resume dialog */
    showResumeDialog: boolean;
    existingAppInfo: ExistingAppInfo | null;

    /* Step 1 */
    email: string;
    setEmail: (v: string) => void;
    specialisations: string[];
    toggleSpecialisation: (s: string) => void;

    /* Step 2 */
    wordsPerDay: string;
    setWordsPerDay: (v: string) => void;
    linkedin: string;
    setLinkedin: (v: string) => void;
    workLinks: string[];
    addWorkLink: () => void;
    removeWorkLink: (i: number) => void;
    updateWorkLink: (i: number, v: string) => void;
    pastExperience: string;
    setPastExperience: (v: string) => void;

    /* Step 3 */
    resumeFile: File | null;
    resumeFileName: string;
    resumeUploading: boolean;
    resumeUploaded: boolean;
    setResumeFile: (f: File | null) => void;
    uploadResume: () => Promise<void>;
    otpSent: boolean;
    otp: string;
    setOtp: (v: string) => void;
    emailVerified: boolean;
    sendingOtp: boolean;
    verifyingOtp: boolean;

    /* Step 4 */
    fullName: string;
    setFullName: (v: string) => void;
    gender: string;
    setGender: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    countryCode: string;
    setCountryCode: (v: string) => void;
    country: string;
    setCountry: (v: string) => void;
    stateProv: string;
    setStateProv: (v: string) => void;
    city: string;
    setCity: (v: string) => void;
    pinCode: string;
    setPinCode: (v: string) => void;
    street: string;
    setStreet: (v: string) => void;

    /* Done */
    submitted: boolean;

    /* Actions */
    handleStep1: () => Promise<void>;
    resumeExisting: () => Promise<void>;
    startFresh: () => Promise<void>;
    handleStep2: () => Promise<void>;
    handleStep3SaveResume: () => Promise<void>;
    handleSendOtp: () => Promise<void>;
    handleVerifyOtp: () => Promise<void>;
    handleStep4: () => Promise<void>;
}

/* ──────────────────── API helper ──────────────────── */

const apiCall = async (url: string, opts: RequestInit) => {
    const res = await fetch(`${API}${url}`, {
        ...opts,
        headers: { "Content-Type": "application/json", ...opts.headers },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Something went wrong");
    return data;
};

/* ──────────────────── Store ──────────────────── */

export const useFreelancerApplyStore = create<FreelancerApplyState>()((set, get) => ({
    /* Navigation */
    step: 1,
    setStep: (s) => set({ step: s, error: "" }),
    loading: false,
    error: "",
    setError: (e) => set({ error: e }),
    applicationId: null,

    /* Resume dialog */
    showResumeDialog: false,
    existingAppInfo: null,

    /* Step 1 */
    email: "",
    setEmail: (v) => set({ email: v, error: "" }),
    specialisations: [],
    toggleSpecialisation: (s) =>
        set((st) => ({
            specialisations: st.specialisations.includes(s)
                ? st.specialisations.filter((x) => x !== s)
                : [...st.specialisations, s],
            error: "",
        })),

    /* Step 2 */
    wordsPerDay: "",
    setWordsPerDay: (v) => set({ wordsPerDay: v }),
    linkedin: "",
    setLinkedin: (v) => set({ linkedin: v }),
    workLinks: [""],
    addWorkLink: () => set((s) => ({ workLinks: [...s.workLinks, ""] })),
    removeWorkLink: (i) => set((s) => ({ workLinks: s.workLinks.filter((_, idx) => idx !== i) })),
    updateWorkLink: (i, v) => set((s) => ({ workLinks: s.workLinks.map((l, idx) => (idx === i ? v : l)) })),
    pastExperience: "",
    setPastExperience: (v) => set({ pastExperience: v, error: "" }),

    /* Step 3 */
    resumeFile: null,
    resumeFileName: "",
    resumeUploading: false,
    resumeUploaded: false,
    setResumeFile: (f) => set({ resumeFile: f, resumeFileName: f?.name ?? "", resumeUploaded: false }),
    uploadResume: async () => {
        const { resumeFile, applicationId } = get();
        if (!resumeFile || !applicationId) return;
        set({ resumeUploading: true, error: "" });
        try {
            // 1) Upload file via shared utility
            const savedAs = await uploadFile(resumeFile, RESUME_FOLDER);

            // 2) Save filename to backend
            await apiCall(`/api/freelancer/apply/${applicationId}/step3`, {
                method: "PUT",
                body: JSON.stringify({ resumeUrl: savedAs }),
            });

            set({ resumeUploaded: true });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Upload failed" });
        } finally {
            set({ resumeUploading: false });
        }
    },
    otpSent: false,
    otp: "",
    setOtp: (v) => set({ otp: v, error: "" }),
    emailVerified: false,
    sendingOtp: false,
    verifyingOtp: false,

    /* Step 4 */
    fullName: "",
    setFullName: (v) => set({ fullName: v, error: "" }),
    gender: "",
    setGender: (v) => set({ gender: v }),
    phone: "",
    setPhone: (v) => set({ phone: v }),
    countryCode: "+44",
    setCountryCode: (v) => set({ countryCode: v }),
    country: "United Kingdom",
    setCountry: (v) => set({ country: v }),
    stateProv: "",
    setStateProv: (v) => set({ stateProv: v }),
    city: "",
    setCity: (v) => set({ city: v }),
    pinCode: "",
    setPinCode: (v) => set({ pinCode: v }),
    street: "",
    setStreet: (v) => set({ street: v }),

    /* Done */
    submitted: false,

    /* ── Actions ────────────────────────────── */

    handleStep1: async () => {
        const { email, specialisations } = get();
        if (!email.trim()) { set({ error: "Email is required" }); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { set({ error: "Enter a valid email" }); return; }
        if (specialisations.length === 0) { set({ error: "Select at least one specialisation" }); return; }

        set({ loading: true, error: "" });
        try {
            const data = await apiCall("/api/freelancer/apply/start", {
                method: "POST",
                body: JSON.stringify({ email, specialisations }),
            });

            if (data.data.existingApplication) {
                set({ existingAppInfo: data.data, showResumeDialog: true });
                return;
            }

            set({ applicationId: data.data.applicationId, step: 2 });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed" });
        } finally {
            set({ loading: false });
        }
    },

    resumeExisting: async () => {
        const { existingAppInfo } = get();
        if (!existingAppInfo) return;
        set({ showResumeDialog: false, loading: true, error: "" });
        try {
            set({ applicationId: existingAppInfo.applicationId });
            const appData = await apiCall(`/api/freelancer/apply/${existingAppInfo.applicationId}`, { method: "GET" });
            const d = appData.data;
            set({
                specialisations: d.specialisations ?? [],
                wordsPerDay: d.wordsPerDay ? String(d.wordsPerDay) : "",
                linkedin: d.linkedin ?? "",
                workLinks: d.publishedWorkLinks?.length ? d.publishedWorkLinks : [""],
                pastExperience: d.pastExperience ?? "",
                resumeFileName: d.resumeUrl ?? "",
                resumeUploaded: !!d.resumeUrl,
                emailVerified: d.emailVerified ?? false,
                fullName: d.fullName ?? "",
                gender: d.gender ?? "",
                phone: d.phoneNumber ?? "",
                country: d.country ?? "United Kingdom",
                stateProv: d.state ?? "",
                city: d.city ?? "",
                pinCode: d.pinCode ?? "",
                street: d.streetAddress ?? "",
                step: Math.min(existingAppInfo.currentStep + 1, 4),
            });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed to resume" });
        } finally {
            set({ loading: false });
        }
    },

    startFresh: async () => {
        const { email, specialisations } = get();
        set({ showResumeDialog: false, loading: true, error: "" });
        try {
            const data = await apiCall("/api/freelancer/apply/start", {
                method: "POST",
                body: JSON.stringify({ email, specialisations, forceNew: true }),
            });
            set({ applicationId: data.data.applicationId, step: 2 });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed" });
        } finally {
            set({ loading: false });
        }
    },

    handleStep2: async () => {
        const { pastExperience, applicationId, wordsPerDay, linkedin, workLinks } = get();
        const wc = pastExperience.trim().split(/\s+/).filter(Boolean).length;
        if (wc < 50) { set({ error: "Past experience must be at least 50 words" }); return; }

        set({ loading: true, error: "" });
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/step2`, {
                method: "PUT",
                body: JSON.stringify({
                    wordsPerDay: wordsPerDay ? parseInt(wordsPerDay) : null,
                    linkedin: linkedin.trim() || null,
                    publishedWorkLinks: workLinks.filter((l) => l.trim()),
                    pastExperience,
                }),
            });
            set({ step: 3 });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed" });
        } finally {
            set({ loading: false });
        }
    },

    handleStep3SaveResume: async () => {
        // Trigger file upload if a file is selected
        await get().uploadResume();
    },

    handleSendOtp: async () => {
        const { applicationId } = get();
        set({ sendingOtp: true, error: "" });
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/send-otp`, { method: "POST" });
            set({ otpSent: true });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed" });
        } finally {
            set({ sendingOtp: false });
        }
    },

    handleVerifyOtp: async () => {
        const { applicationId, otp } = get();
        if (!otp.trim()) { set({ error: "Enter the OTP" }); return; }
        set({ verifyingOtp: true, error: "" });
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/verify-otp`, {
                method: "POST",
                body: JSON.stringify({ otp }),
            });
            set({ emailVerified: true });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed" });
        } finally {
            set({ verifyingOtp: false });
        }
    },

    handleStep4: async () => {
        const { fullName, gender, phone, countryCode, country, stateProv, city, pinCode, street, applicationId } = get();
        if (!fullName.trim()) { set({ error: "Full name is required" }); return; }

        set({ loading: true, error: "" });
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/step4`, {
                method: "PUT",
                body: JSON.stringify({
                    fullName,
                    gender: gender || null,
                    phone_number: phone.trim() ? countryCode + phone.trim() : null,
                    country: country || null,
                    state: stateProv || null,
                    city: city || null,
                    pinCode: pinCode || null,
                    streetAddress: street || null,
                }),
            });
            set({ submitted: true });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed" });
        } finally {
            set({ loading: false });
        }
    },
}));
