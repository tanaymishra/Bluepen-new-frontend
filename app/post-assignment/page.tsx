"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/components/user/navbar/navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileText,
    GraduationCap,
    BookOpen,
    PenTool,
    ArrowRight,
    ArrowLeft,
    Upload,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    Paperclip,
    Sparkles,
    Shield,
    Zap,
    CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================
   DATA
   ================================================================ */

const assignmentTypes = [
    {
        id: "assignment",
        title: "Assignment / Coursework",
        description:
            "Essays, reports, case studies, research papers, and all coursework types",
        icon: FileText,
        popular: true,
        subtypes: [
            "Essay",
            "Research Paper",
            "Case Study",
            "Report",
            "Literature Review",
            "Presentation",
            "Lab Report",
            "Annotated Bibliography",
            "Reflection Paper",
            "Book Review",
            "Other",
        ],
    },
    {
        id: "dissertation",
        title: "Masters Dissertation",
        description:
            "Complete dissertations, individual chapters, or professional editing",
        icon: GraduationCap,
        popular: false,
        subtypes: [
            "Full Dissertation",
            "Dissertation Proposal",
            "Individual Chapter",
            "Literature Review",
            "Methodology",
            "Data Analysis",
            "Editing & Proofreading",
        ],
    },
    {
        id: "phd",
        title: "PhD Thesis & Proposal",
        description:
            "Doctoral research from proposal writing to defense preparation",
        icon: BookOpen,
        popular: false,
        subtypes: [
            "PhD Proposal",
            "Full Thesis",
            "Individual Chapter",
            "Systematic Review",
            "Statistical Analysis",
            "Research Framework",
            "Editing & Proofreading",
        ],
    },
    {
        id: "application",
        title: "University Applications",
        description:
            "SOPs, personal statements, LORs, and compelling admission essays",
        icon: PenTool,
        popular: false,
        subtypes: [
            "Statement of Purpose (SOP)",
            "Personal Statement",
            "Letter of Recommendation (LOR)",
            "Admission Essay",
            "CV / Resume",
            "Scholarship Essay",
        ],
    },
];

const academicLevels = [
    "High School",
    "Undergraduate (Year 1-2)",
    "Undergraduate (Year 3-4)",
    "Postgraduate / Masters",
    "PhD / Doctoral",
    "Professional",
];

const referencingStyles = [
    "APA 7th Edition",
    "Harvard",
    "MLA",
    "Chicago / Turabian",
    "IEEE",
    "Vancouver",
    "OSCOLA",
    "AMA",
    "Not sure / Other",
];

const guarantees = [
    { icon: Shield, text: "Plagiarism‑free" },
    { icon: Clock, text: "On‑time delivery" },
    { icon: Zap, text: "Free revisions" },
    { icon: CheckCircle2, text: "Secure payment" },
];

/* ================================================================
   STEP INDICATOR
   ================================================================ */

function StepIndicator({ current }: { current: number }) {
    const labels = ["Select type", "Fill details", "Review"];
    return (
        <div className="flex items-center justify-between w-full max-w-md lg:max-w-lg mx-auto mb-8 lg:mb-12">
            {labels.map((label, i) => {
                const num = i + 1;
                const done = current > num;
                const active = current === num;
                return (
                    <React.Fragment key={num}>
                        <div className="flex flex-col items-center gap-1.5 lg:gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold font-montserrat transition-all duration-300 shrink-0",
                                    done && "bg-emerald-500 text-white",
                                    active && "bg-primary text-white shadow-md shadow-primary/30",
                                    !done && !active && "bg-gray-100 text-gray-400"
                                )}
                            >
                                {done ? <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5" /> : num}
                            </div>
                            <span
                                className={cn(
                                    "text-[11px] lg:text-[13px] font-medium font-poppins whitespace-nowrap",
                                    active ? "text-gray-900" : done ? "text-emerald-600" : "text-gray-400"
                                )}
                            >
                                {label}
                            </span>
                        </div>
                        {i < labels.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-[2px] mx-2 lg:mx-4 rounded-full transition-all duration-500 -mt-5 lg:-mt-6",
                                    done ? "bg-emerald-400" : "bg-gray-200"
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

/* ================================================================
   FIELD WRAPPER
   ================================================================ */

function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5 lg:space-y-2">
            <Label className="text-[13px] lg:text-[14px]">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-[12px] lg:text-[13px] text-red-500 font-poppins flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function PostAssignmentPage() {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subtype: "",
        title: "",
        academicLevel: "",
        subject: "",
        wordCount: "",
        deadline: null as Date | null,
        referencingStyle: "",
        instructions: "",
        files: [] as File[],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedTypeData = assignmentTypes.find((t) => t.id === selectedType);

    const set = useCallback(
        (field: string, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => {
                if (!prev[field]) return prev;
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        },
        []
    );

    const setDeadline = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, deadline: date }));
        if (date && errors.deadline) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy.deadline;
                return copy;
            });
        }
    };

    const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFormData((prev) => ({
            ...prev,
            files: [...prev.files, ...Array.from(e.target.files!)].slice(0, 5),
        }));
        e.target.value = "";
    };

    const removeFile = (i: number) =>
        setFormData((prev) => ({ ...prev, files: prev.files.filter((_, idx) => idx !== i) }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!formData.subtype) e.subtype = "Please select a type";
        if (!formData.title.trim()) e.title = "Please enter a title or topic";
        if (!formData.academicLevel) e.academicLevel = "Please select your academic level";
        if (!formData.deadline) e.deadline = "Please set a deadline";
        setErrors(e);
        return !Object.keys(e).length;
    };

    const next = () => {
        if (step === 1 && selectedType) setStep(2);
        else if (step === 2 && validate()) setStep(3);
    };
    const back = () => step > 1 && setStep(step - 1);

    const submit = () => {
        alert("Assignment submitted! We'll match you with an expert shortly.");
    };

    const variants = {
        enter: { opacity: 0, y: 24 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            {/* ───── HERO ───── */}
            <section className="relative bg-primary-dark pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle,rgba(255,255,255,.7) 1px,transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

                <div className="relative z-10 max-w-2xl lg:max-w-3xl mx-auto text-center px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] text-white/70 text-[11px] lg:text-xs font-poppins font-medium mb-5 lg:mb-6 tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
                            Matched with an expert in under 30 minutes
                        </span>
                        <h1 className="text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-bold text-white font-montserrat leading-[1.15] mb-3 lg:mb-4">
                            Post Your Assignment
                        </h1>
                        <p className="text-white/45 text-sm sm:text-[15px] lg:text-base font-poppins leading-relaxed max-w-md lg:max-w-lg mx-auto">
                            Tell us what you need — we&apos;ll connect you with a verified expert
                            who specialises in your subject.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ───── FORM CARD ───── */}
            <main className="flex-1 relative z-10 -mt-10 pb-20">
                <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
                    <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-5 sm:p-8 md:p-10 lg:p-14">
                        <StepIndicator current={step} />

                        <AnimatePresence mode="wait">
                            {/* ════════ STEP 1 ════════ */}
                            {step === 1 && (
                                <motion.div
                                    key="s1"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="text-center mb-7 lg:mb-9">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-montserrat text-gray-900">
                                            What do you need help with?
                                        </h2>
                                        <p className="text-gray-500 text-[13px] lg:text-[15px] font-poppins mt-1 lg:mt-2">
                                            Select the category that best describes your work
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                                        {assignmentTypes.map((type) => {
                                            const Icon = type.icon;
                                            const sel = selectedType === type.id;
                                            return (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={cn(
                                                        "relative text-left p-4 sm:p-5 lg:p-6 rounded-xl border-[1.5px] transition-all duration-200 group",
                                                        sel
                                                            ? "border-primary bg-primary/[0.03] ring-1 ring-primary/10"
                                                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                                                    )}
                                                >
                                                    {type.popular && (
                                                        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-widest bg-accent/20 text-amber-700 px-2 py-0.5 rounded-full font-poppins">
                                                            Popular
                                                        </span>
                                                    )}
                                                    <div
                                                        className={cn(
                                                            "w-9 h-9 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center mb-3 lg:mb-4 transition-colors",
                                                            sel
                                                                ? "bg-primary text-white"
                                                                : "bg-gray-100 text-gray-500 group-hover:bg-gray-200/70"
                                                        )}
                                                    >
                                                        <Icon className="w-[18px] h-[18px] lg:w-5 lg:h-5" />
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 font-montserrat text-[14px] lg:text-[16px] leading-snug mb-0.5 lg:mb-1">
                                                        {type.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-[12px] lg:text-[13px] font-poppins leading-relaxed">
                                                        {type.description}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end mt-7 lg:mt-9">
                                        <Button
                                            onClick={next}
                                            disabled={!selectedType}
                                            size="lg"
                                            className="w-full sm:w-auto min-w-[160px]"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ════════ STEP 2 ════════ */}
                            {step === 2 && selectedTypeData && (
                                <motion.div
                                    key="s2"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="text-center mb-7 lg:mb-9">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-montserrat text-gray-900">
                                            Assignment details
                                        </h2>
                                        <p className="text-gray-500 text-[13px] lg:text-[15px] font-poppins mt-1 lg:mt-2">
                                            The more detail you provide, the better we can match you
                                        </p>
                                    </div>

                                    <div className="space-y-4 lg:space-y-5">
                                        {/* Subtype + Level */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                                            <Field label="Type of work" required error={errors.subtype}>
                                                <Select
                                                    value={formData.subtype}
                                                    onValueChange={(v) => set("subtype", v)}
                                                >
                                                    <SelectTrigger error={!!errors.subtype}>
                                                        <SelectValue placeholder="Select type…" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedTypeData.subtypes.map((st) => (
                                                            <SelectItem key={st} value={st}>
                                                                {st}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                            <Field label="Academic level" required error={errors.academicLevel}>
                                                <Select
                                                    value={formData.academicLevel}
                                                    onValueChange={(v) => set("academicLevel", v)}
                                                >
                                                    <SelectTrigger error={!!errors.academicLevel}>
                                                        <SelectValue placeholder="Select level…" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {academicLevels.map((level) => (
                                                            <SelectItem key={level} value={level}>
                                                                {level}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        </div>

                                        {/* Title */}
                                        <Field label="Title / Topic" required error={errors.title}>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => set("title", e.target.value)}
                                                placeholder="e.g., Impact of Social Media on Consumer Behavior"
                                                className={errors.title ? "border-red-300" : ""}
                                            />
                                        </Field>

                                        {/* Subject + Word Count */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="Subject / Module">
                                                <Input
                                                    value={formData.subject}
                                                    onChange={(e) => set("subject", e.target.value)}
                                                    placeholder="e.g., Marketing, Psychology"
                                                />
                                            </Field>
                                            <Field label="Word count / Pages">
                                                <Input
                                                    value={formData.wordCount}
                                                    onChange={(e) => set("wordCount", e.target.value)}
                                                    placeholder="e.g., 2 000 words"
                                                />
                                            </Field>
                                        </div>

                                        {/* Deadline + Referencing */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="Deadline" required error={errors.deadline}>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-10">
                                                        <CalendarDays className="w-[18px] h-[18px]" />
                                                    </div>
                                                    <DatePicker
                                                        selected={formData.deadline}
                                                        onChange={setDeadline}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={30}
                                                        dateFormat="dd MMM yyyy, h:mm aa"
                                                        minDate={new Date()}
                                                        placeholderText="Pick date & time"
                                                        className={cn(
                                                            "flex h-12 w-full rounded-xl border bg-gray-50/50 pl-11 pr-4 py-2 text-[14px] font-poppins text-gray-900",
                                                            "focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40",
                                                            "placeholder:text-gray-400 transition-all duration-200",
                                                            errors.deadline ? "border-red-300" : "border-gray-200"
                                                        )}
                                                        wrapperClassName="w-full"
                                                        popperClassName="!z-50"
                                                        calendarClassName="bp-datepicker"
                                                    />
                                                </div>
                                            </Field>
                                            <Field label="Referencing style">
                                                <Select
                                                    value={formData.referencingStyle}
                                                    onValueChange={(v) => set("referencingStyle", v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select style…" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {referencingStyles.map((style) => (
                                                            <SelectItem key={style} value={style}>
                                                                {style}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        </div>

                                        {/* Instructions */}
                                        <Field label="Additional instructions">
                                            <Textarea
                                                value={formData.instructions}
                                                onChange={(e) => set("instructions", e.target.value)}
                                                placeholder="Paste your brief, marking rubric, or any specific instructions…"
                                                rows={5}
                                            />
                                        </Field>

                                        {/* File upload */}
                                        <Field label="Attachments">
                                            <label
                                                htmlFor="file-upload"
                                                className="flex flex-col items-center gap-1.5 border border-dashed border-gray-200 rounded-xl px-5 py-6 cursor-pointer hover:border-primary/30 hover:bg-primary/[0.015] transition-all group"
                                            >
                                                <Upload className="w-6 h-6 text-gray-300 group-hover:text-primary/40 transition-colors" />
                                                <p className="text-[13px] font-poppins text-gray-500">
                                                    <span className="text-primary font-semibold">Browse files</span>{" "}
                                                    or drag & drop
                                                </p>
                                                <p className="text-[11px] text-gray-400 font-poppins">
                                                    PDF, DOC, PPT, images — up to 5 files, 25 MB each
                                                </p>
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                className="sr-only"
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.zip"
                                                onChange={addFiles}
                                            />

                                            {formData.files.length > 0 && (
                                                <div className="flex flex-col gap-1.5 mt-2">
                                                    {formData.files.map((file, i) => (
                                                        <div
                                                            key={`${file.name}-${i}`}
                                                            className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                                                        >
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Paperclip className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                                <span className="text-[13px] text-gray-700 font-poppins truncate">
                                                                    {file.name}
                                                                </span>
                                                                <span className="text-[11px] text-gray-400 font-poppins shrink-0">
                                                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(i)}
                                                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5 text-gray-400" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Field>
                                    </div>

                                    {/* nav */}
                                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8 lg:mt-10">
                                        <Button variant="ghost" onClick={back} size="lg" className="w-full sm:w-auto">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button onClick={next} size="lg" className="w-full sm:w-auto min-w-[160px]">
                                            Review order
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ════════ STEP 3 ════════ */}
                            {step === 3 && selectedTypeData && (
                                <motion.div
                                    key="s3"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="text-center mb-7 lg:mb-9">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-montserrat text-gray-900">
                                            Review your order
                                        </h2>
                                        <p className="text-gray-500 text-[13px] lg:text-[15px] font-poppins mt-1 lg:mt-2">
                                            Make sure everything looks right before submitting
                                        </p>
                                    </div>

                                    {/* summary */}
                                    <div className="rounded-xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 overflow-hidden">
                                        {/* header */}
                                        <div className="flex items-center gap-3 lg:gap-4 p-4 sm:p-5 lg:p-6">
                                            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                                                {React.createElement(selectedTypeData.icon, {
                                                    className: "w-[18px] h-[18px]",
                                                })}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 font-montserrat text-[14px] lg:text-base truncate">
                                                    {selectedTypeData.title}
                                                </p>
                                                <p className="text-[12px] lg:text-[13px] text-gray-500 font-poppins truncate">
                                                    {formData.subtype || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* rows */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
                                            <SummaryRow label="Title" value={formData.title} className="col-span-full lg:col-span-2" />
                                            <SummaryRow label="Academic Level" value={formData.academicLevel} />
                                            <SummaryRow label="Subject" value={formData.subject || "—"} />
                                            <SummaryRow label="Word Count" value={formData.wordCount || "—"} />
                                            <SummaryRow
                                                label="Deadline"
                                                value={
                                                    formData.deadline
                                                        ? formData.deadline.toLocaleString("en-IN", {
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        })
                                                        : "—"
                                                }
                                            />
                                            <SummaryRow
                                                label="Referencing"
                                                value={formData.referencingStyle || "—"}
                                            />
                                        </div>

                                        {/* instructions */}
                                        {formData.instructions && (
                                            <div className="p-4 sm:p-5 lg:p-6 bg-white">
                                                <p className="text-[11px] lg:text-[12px] text-gray-400 font-poppins uppercase tracking-wider mb-1.5">
                                                    Instructions
                                                </p>
                                                <p className="text-[13px] lg:text-[14px] text-gray-700 font-poppins leading-relaxed whitespace-pre-wrap break-words">
                                                    {formData.instructions}
                                                </p>
                                            </div>
                                        )}

                                        {/* files */}
                                        {formData.files.length > 0 && (
                                            <div className="p-4 sm:p-5 lg:p-6 bg-white">
                                                <p className="text-[11px] lg:text-[12px] text-gray-400 font-poppins uppercase tracking-wider mb-2">
                                                    Attachments ({formData.files.length})
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {formData.files.map((f, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 text-[12px] text-gray-600 font-poppins"
                                                        >
                                                            <Paperclip className="w-3 h-3" />
                                                            {f.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* guarantees */}
                                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 mb-1">
                                        {guarantees.map(({ icon: G, text }) => (
                                            <span
                                                key={text}
                                                className="flex items-center gap-1.5 text-[12px] lg:text-[13px] text-gray-500 font-poppins"
                                            >
                                                <G className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-500" />
                                                {text}
                                            </span>
                                        ))}
                                    </div>

                                    {/* nav */}
                                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8">
                                        <Button variant="ghost" onClick={back} size="lg" className="w-full sm:w-auto">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Edit details
                                        </Button>
                                        <Button onClick={submit} size="lg" className="w-full sm:w-auto min-w-[180px]">
                                            Submit Assignment
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />

            {/* ───── datepicker overrides ───── */}
            <style jsx global>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker {
                    font-family: var(--font-poppins), "Poppins", sans-serif !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 12px !important;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important;
                    overflow: hidden;
                }
                .react-datepicker__header {
                    background: #f9fafb !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    padding-top: 12px !important;
                }
                .react-datepicker__current-month {
                    font-family: var(--font-montserrat), "Montserrat", sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    color: #111827 !important;
                }
                .react-datepicker__day-name {
                    color: #9ca3af !important;
                    font-size: 11px !important;
                    font-weight: 500 !important;
                    width: 2.2rem !important;
                }
                .react-datepicker__day {
                    width: 2.2rem !important;
                    line-height: 2.2rem !important;
                    font-size: 13px !important;
                    border-radius: 8px !important;
                    color: #374151 !important;
                    transition: all 0.15s !important;
                }
                .react-datepicker__day:hover {
                    background: #eff6ff !important;
                    color: #2956A8 !important;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected {
                    background: #2956A8 !important;
                    color: #fff !important;
                    font-weight: 600 !important;
                }
                .react-datepicker__day--today {
                    font-weight: 700 !important;
                }
                .react-datepicker__day--disabled {
                    color: #d1d5db !important;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #6b7280 !important;
                    border-width: 2px 2px 0 0 !important;
                    width: 8px !important;
                    height: 8px !important;
                }
                .react-datepicker__time-container {
                    border-left: 1px solid #f3f4f6 !important;
                }
                .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
                    font-size: 13px !important;
                    padding: 6px 12px !important;
                    border-radius: 6px !important;
                    margin: 1px 4px !important;
                    transition: all 0.15s !important;
                }
                .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
                    background: #eff6ff !important;
                    color: #2956A8 !important;
                }
                .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
                    background: #2956A8 !important;
                    color: #fff !important;
                    font-weight: 600 !important;
                }
                .react-datepicker__time-container .react-datepicker__header--time {
                    padding: 10px 0 !important;
                }
                .react-datepicker__triangle {
                    display: none !important;
                }
                .react-datepicker-popper {
                    z-index: 50 !important;
                }
            `}</style>
        </div>
    );
}

/* ================================================================
   SUMMARY ROW  (used in step 3)
   ================================================================ */

function SummaryRow({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className={cn("bg-white p-4 sm:p-5 lg:p-6", className)}>
            <p className="text-[11px] lg:text-[12px] text-gray-400 font-poppins uppercase tracking-wider mb-0.5">
                {label}
            </p>
            <p className="text-[13px] font-medium text-gray-800 font-poppins break-words">
                {value}
            </p>
        </div>
    );
}
