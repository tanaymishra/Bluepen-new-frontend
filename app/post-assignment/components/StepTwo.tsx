
import React from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Upload,
    Paperclip,
    X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Field from "./Field";
import { academicLevels, referencingStyles } from "../constants";

interface StepTwoProps {
    selectedTypeData: any;
    formData: any;
    errors: Record<string, string>;
    set: (field: string, value: string) => void;
    setDeadline: (date: Date | null) => void;
    addFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: (i: number) => void;
    back: () => void;
    next: () => void;
    variants: any;
}

export default function StepTwo({
    selectedTypeData,
    formData,
    errors,
    set,
    setDeadline,
    addFiles,
    removeFile,
    back,
    next,
    variants,
}: StepTwoProps) {
    if (!selectedTypeData) return null;

    return (
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
                                {selectedTypeData.subtypes.map((st: string) => (
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
                            {formData.files.map((file: any, i: number) => (
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
    );
}
