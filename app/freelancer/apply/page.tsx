"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Briefcase,
    ChevronRight,
    ChevronLeft,
    Check,
    Loader2,
    AlertCircle,
    Plus,
    X,
    Upload,
    Mail,
    User,
    MapPin,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/* ── Specialisation options ── */
const SPECIALISATIONS = [
    "Business & Management",
    "Engineering",
    "Medical & Health Sciences",
    "Law",
    "Computer Science",
    "Arts & Humanities",
    "Commerce & Accounting",
    "Science",
    "Education",
    "Social Sciences",
    "Architecture & Design",
    "Media & Communications",
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const STEPS = [
    { num: 1, label: "Specialisation" },
    { num: 2, label: "Experience" },
    { num: 3, label: "Resume & Verify" },
    { num: 4, label: "Your Details" },
];

/* ──────────────────────────────────── */

export default function FreelancerApplyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [applicationId, setApplicationId] = useState<string | null>(null);

    /* Step 1 */
    const [email, setEmail] = useState("");
    const [selected, setSelected] = useState<string[]>([]);

    /* Step 2 */
    const [wordsPerDay, setWordsPerDay] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [workLinks, setWorkLinks] = useState<string[]>([""]);
    const [pastExperience, setPastExperience] = useState("");

    /* Step 3 */
    const [resumeUrl, setResumeUrl] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    /* Step 4 */
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [country, setCountry] = useState("India");
    const [stateProv, setStateProv] = useState("");
    const [city, setCity] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [street, setStreet] = useState("");

    /* Success state */
    const [submitted, setSubmitted] = useState(false);

    const wordCount = pastExperience.trim().split(/\s+/).filter(Boolean).length;

    const toggleSpec = (s: string) => {
        setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
        setError("");
    };

    const addWorkLink = () => setWorkLinks((prev) => [...prev, ""]);
    const removeWorkLink = (i: number) => setWorkLinks((prev) => prev.filter((_, idx) => idx !== i));
    const updateWorkLink = (i: number, v: string) => setWorkLinks((prev) => prev.map((l, idx) => idx === i ? v : l));

    /* ── API helpers ── */
    const apiCall = useCallback(async (url: string, opts: RequestInit) => {
        const res = await fetch(`${API}${url}`, { ...opts, headers: { "Content-Type": "application/json", ...opts.headers } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Something went wrong");
        return data;
    }, []);

    /* Step 1 → Submit */
    const handleStep1 = async () => {
        if (!email.trim()) { setError("Email is required"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email"); return; }
        if (selected.length === 0) { setError("Select at least one specialisation"); return; }

        setLoading(true); setError("");
        try {
            const data = await apiCall("/api/freelancer/apply/start", {
                method: "POST",
                body: JSON.stringify({ email, specialisations: selected }),
            });
            setApplicationId(data.data.applicationId);

            // If resuming, jump to the right step
            if (data.data.currentStep > 1) {
                const appData = await apiCall(`/api/freelancer/apply/${data.data.applicationId}`, { method: "GET" });
                const d = appData.data;
                if (d.wordsPerDay) setWordsPerDay(String(d.wordsPerDay));
                if (d.linkedin) setLinkedin(d.linkedin);
                if (d.publishedWorkLinks?.length) setWorkLinks(d.publishedWorkLinks);
                if (d.pastExperience) setPastExperience(d.pastExperience);
                if (d.resumeUrl) setResumeUrl(d.resumeUrl);
                if (d.emailVerified) setEmailVerified(true);
                if (d.fullName) setFullName(d.fullName);
                if (d.gender) setGender(d.gender);
                if (d.phoneNumber) setPhone(d.phoneNumber);
                if (d.country) setCountry(d.country);
                if (d.state) setStateProv(d.state);
                if (d.city) setCity(d.city);
                if (d.pinCode) setPinCode(d.pinCode);
                if (d.streetAddress) setStreet(d.streetAddress);
            }

            setStep(2);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed");
        } finally { setLoading(false); }
    };

    /* Step 2 → Submit */
    const handleStep2 = async () => {
        if (wordCount < 50) { setError("Past experience must be at least 50 words"); return; }

        setLoading(true); setError("");
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
            setStep(3);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed");
        } finally { setLoading(false); }
    };

    /* Step 3 → Submit resume */
    const handleStep3Resume = async () => {
        if (!resumeUrl.trim()) { setError("Please provide a link to your resume"); return; }
        setLoading(true); setError("");
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/step3`, {
                method: "PUT",
                body: JSON.stringify({ resumeUrl }),
            });
            setError("");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed");
        } finally { setLoading(false); }
    };

    /* Send OTP */
    const handleSendOtp = async () => {
        setSendingOtp(true); setError("");
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/send-otp`, { method: "POST" });
            setOtpSent(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed");
        } finally { setSendingOtp(false); }
    };

    /* Verify OTP */
    const handleVerifyOtp = async () => {
        if (!otp.trim()) { setError("Enter the OTP"); return; }
        setVerifyingOtp(true); setError("");
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/verify-otp`, {
                method: "POST",
                body: JSON.stringify({ otp }),
            });
            setEmailVerified(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed");
        } finally { setVerifyingOtp(false); }
    };

    const canProceedStep3 = resumeUrl.trim() && emailVerified;

    /* Step 4 → Final submit */
    const handleStep4 = async () => {
        if (!fullName.trim()) { setError("Full name is required"); return; }

        setLoading(true); setError("");
        try {
            await apiCall(`/api/freelancer/apply/${applicationId}/step4`, {
                method: "PUT",
                body: JSON.stringify({
                    fullName, gender: gender || null,
                    phone_number: phone.trim() ? countryCode + phone.trim() : null,
                    country: country || null, state: stateProv || null,
                    city: city || null, pinCode: pinCode || null, streetAddress: street || null,
                }),
            });
            setSubmitted(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed");
        } finally { setLoading(false); }
    };

    /* ── Success screen ── */
    if (submitted) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-[#F5F7FA] px-5">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-[480px] w-full p-8 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                        <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-[24px] font-bold text-gray-900 font-montserrat mb-2">Application Submitted!</h1>
                    <p className="text-[14px] text-gray-500 font-poppins leading-relaxed mb-6">
                        Your application is under review. We'll notify you at <span className="font-semibold text-gray-700">{email}</span> once it's processed. This usually takes 24–48 hours.
                    </p>
                    <Button onClick={() => router.push("/freelancer/login")} className="w-full">
                        Go to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col">
            {/* Top bar */}
            <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
                <Link href="/" className="relative w-28 h-8">
                    <Image src="/assets/logo/bluepenonly.svg" alt="Bluepen" fill className="object-contain object-left" />
                </Link>
                <Link href="/freelancer/login" className="text-[13px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors">
                    Already have an account?
                </Link>
            </header>

            <div className="flex-1 flex flex-col items-center px-5 py-8 overflow-y-auto">
                {/* Stepper */}
                <div className="flex items-center gap-0 mb-8 w-full max-w-[600px]">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.num}>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold font-montserrat shrink-0 transition-all",
                                    step > s.num ? "bg-primary text-white" :
                                        step === s.num ? "bg-primary text-white" :
                                            "bg-gray-200 text-gray-500"
                                )}>
                                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                                </div>
                                <span className={cn(
                                    "text-[12px] font-poppins font-medium whitespace-nowrap hidden sm:block",
                                    step >= s.num ? "text-gray-800" : "text-gray-400"
                                )}>{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={cn("flex-1 h-[2px] mx-2 rounded-full transition-all", step > s.num ? "bg-primary" : "bg-gray-200")} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Card */}
                <div className="w-full max-w-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-8"
                        >
                            {/* ════════ STEP 1: Specialisation ════════ */}
                            {step === 1 && (
                                <>
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Briefcase className="w-[18px] h-[18px] text-primary" />
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary font-poppins">
                                            Freelancer Application
                                        </span>
                                    </div>
                                    <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 font-montserrat mt-3">
                                        What are you best at?
                                    </h2>
                                    <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6 leading-relaxed">
                                        Select the subjects you can write about. You can pick multiple.
                                    </p>

                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                                                Your Email
                                            </Label>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                                icon={<Mail className="w-[18px] h-[18px]" />}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                                                Specialisations
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {SPECIALISATIONS.map((s) => {
                                                    const active = selected.includes(s);
                                                    return (
                                                        <button key={s} type="button" onClick={() => toggleSpec(s)}
                                                            className={cn(
                                                                "flex items-center gap-2.5 p-3 rounded-xl border text-left text-[13px] font-poppins transition-all",
                                                                active
                                                                    ? "border-primary bg-primary/[0.05] text-primary font-medium"
                                                                    : "border-gray-100 text-gray-600 hover:border-primary/20 hover:bg-primary/[0.02]"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                                                                active ? "bg-primary border-primary" : "border-gray-300"
                                                            )}>
                                                                {active && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            {s}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ════════ STEP 2: Experience ════════ */}
                            {step === 2 && (
                                <>
                                    <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-900 font-montserrat">Experience & Portfolio</h2>
                                    <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6">Tell us about your writing experience.</p>

                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Words you can write per day</Label>
                                            <Input type="number" min="100" placeholder="e.g. 3000" value={wordsPerDay} onChange={(e) => setWordsPerDay(e.target.value)} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">LinkedIn Profile <span className="text-gray-400 font-normal">(optional)</span></Label>
                                            <Input placeholder="https://linkedin.com/in/yourname" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Published Work Links <span className="text-gray-400 font-normal">(optional)</span></Label>
                                            {workLinks.map((link, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <Input placeholder="https://..." value={link} onChange={(e) => updateWorkLink(i, e.target.value)} />
                                                    {workLinks.length > 1 && (
                                                        <button type="button" onClick={() => removeWorkLink(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addWorkLink}
                                                className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-primary-dark font-poppins font-medium transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />Add another link
                                            </button>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Past Experience</Label>
                                                <span className={cn("text-[11px] font-poppins tabular-nums", wordCount >= 50 ? "text-emerald-500" : "text-gray-400")}>
                                                    {wordCount}/50 words min
                                                </span>
                                            </div>
                                            <textarea
                                                placeholder="Describe your writing experience, areas of expertise, academic background, notable projects..."
                                                value={pastExperience}
                                                onChange={(e) => { setPastExperience(e.target.value); setError(""); }}
                                                rows={5}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-800 font-poppins placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ════════ STEP 3: Resume + Verification ════════ */}
                            {step === 3 && (
                                <>
                                    <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-900 font-montserrat">Resume & Verification</h2>
                                    <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6">Upload your CV and verify your email address.</p>

                                    <div className="space-y-6">
                                        {/* Resume */}
                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                                                Resume / CV Link
                                            </Label>
                                            <p className="text-[12px] text-gray-400 font-poppins mb-1.5">Upload to Google Drive, Dropbox, etc. and paste the link</p>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://drive.google.com/..."
                                                    value={resumeUrl}
                                                    onChange={(e) => { setResumeUrl(e.target.value); setError(""); }}
                                                    icon={<Upload className="w-[18px] h-[18px]" />}
                                                />
                                                <Button variant="outline" size="sm" onClick={handleStep3Resume} disabled={loading || !resumeUrl.trim()} className="shrink-0">
                                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-100" />

                                        {/* Email verification */}
                                        <div className="space-y-3">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">
                                                Verify Email
                                            </Label>
                                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                                                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] text-gray-700 font-poppins font-medium truncate">{email}</p>
                                                    <p className="text-[11px] text-gray-400 font-poppins">
                                                        {emailVerified ? "Email verified ✓" : otpSent ? "OTP sent — check your inbox" : "We'll send a verification code"}
                                                    </p>
                                                </div>
                                                {emailVerified ? (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                        <Check className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                ) : !otpSent ? (
                                                    <Button size="sm" onClick={handleSendOtp} disabled={sendingOtp}>
                                                        {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP"}
                                                    </Button>
                                                ) : null}
                                            </div>

                                            {otpSent && !emailVerified && (
                                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                                                    <Input
                                                        placeholder="Enter 6-digit OTP"
                                                        value={otp}
                                                        onChange={(e) => { setOtp(e.target.value); setError(""); }}
                                                        maxLength={6}
                                                        className="text-center tracking-[0.3em] font-mono text-[16px]"
                                                    />
                                                    <Button size="sm" onClick={handleVerifyOtp} disabled={verifyingOtp || otp.length < 6}>
                                                        {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                                                    </Button>
                                                    <button type="button" onClick={handleSendOtp} disabled={sendingOtp}
                                                        className="text-[12px] text-primary hover:text-primary-dark font-poppins font-medium whitespace-nowrap transition-colors"
                                                    >
                                                        Resend
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ════════ STEP 4: Personal Details ════════ */}
                            {step === 4 && (
                                <>
                                    <h2 className="text-[22px] sm:text-[24px] font-bold text-gray-900 font-montserrat">Personal Details</h2>
                                    <p className="text-[14px] text-gray-500 font-poppins mt-1 mb-6">Almost done! Tell us about yourself.</p>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Full Name *</Label>
                                                <Input placeholder="Your full name" value={fullName} onChange={(e) => { setFullName(e.target.value); setError(""); }}
                                                    icon={<User className="w-[18px] h-[18px]" />} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Gender</Label>
                                                <Select value={gender} onValueChange={(v) => setGender(v)}>
                                                    <SelectTrigger className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                                    <SelectContent>
                                                        {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Phone Number</Label>
                                            <PhoneInput
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onCountryChange={(code) => setCountryCode(code)}
                                                defaultCountry="in"
                                                placeholder="98123 00001"
                                            />
                                        </div>

                                        <div className="h-px bg-gray-100" />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Country</Label>
                                                <Input placeholder="India" value={country} onChange={(e) => setCountry(e.target.value)}
                                                    icon={<MapPin className="w-[18px] h-[18px]" />} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">State / Province</Label>
                                                <Input placeholder="e.g. Delhi" value={stateProv} onChange={(e) => setStateProv(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">City</Label>
                                                <Input placeholder="e.g. New Delhi" value={city} onChange={(e) => setCity(e.target.value)} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-semibold text-gray-700 font-poppins">PIN Code</Label>
                                                <Input placeholder="110001" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-semibold text-gray-700 font-poppins">Street Address</Label>
                                            <Input placeholder="House no., street, locality" value={street} onChange={(e) => setStreet(e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Error ── */}
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                    className="flex items-start gap-2.5 p-3.5 mt-5 rounded-xl bg-red-50 border border-red-100"
                                >
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-[13px] text-red-600 font-poppins">{error}</p>
                                </motion.div>
                            )}

                            {/* ── Actions ── */}
                            <div className={cn("flex items-center gap-3 mt-6 pt-5 border-t border-gray-100", step === 1 ? "justify-end" : "justify-between")}>
                                {step > 1 && (
                                    <Button variant="outline" onClick={() => { setStep(step - 1); setError(""); }} disabled={loading}>
                                        <ChevronLeft className="w-4 h-4 mr-1" />Back
                                    </Button>
                                )}

                                {step === 1 && (
                                    <Button onClick={handleStep1} disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : null}
                                        {loading ? "Starting…" : "Continue"}
                                        {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
                                    </Button>
                                )}

                                {step === 2 && (
                                    <Button onClick={handleStep2} disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : null}
                                        {loading ? "Saving…" : "Continue"}
                                        {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
                                    </Button>
                                )}

                                {step === 3 && (
                                    <Button onClick={() => { if (canProceedStep3) { setStep(4); setError(""); } else { setError(!resumeUrl.trim() ? "Please save your resume link first" : "Please verify your email"); } }}
                                        disabled={loading}
                                    >
                                        Continue<ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                )}

                                {step === 4 && (
                                    <Button onClick={handleStep4} disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : null}
                                        {loading ? "Submitting…" : "Submit Application"}
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
