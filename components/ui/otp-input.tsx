
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface OTPInputProps {
    length?: number;
    value?: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
    length = 4,
    value = "",
    onChange,
    onComplete,
    className,
    disabled = false,
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (value) {
            const valueArray = value.split("").slice(0, length);
            const newOtp = [...otp];
            valueArray.forEach((char, index) => {
                if (index < length) newOtp[index] = char;
            });
            setOtp(newOtp);
        }
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newOtp = [...otp];
        // Allow only one char
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        onChange(combinedOtp);

        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        if (combinedOtp.length === length && onComplete) {
            onComplete(combinedOtp);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        onChange(combinedOtp);
        if (combinedOtp.length === length && onComplete) {
            onComplete(combinedOtp);
        }
        inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
    };

    return (
        <div className={cn("flex gap-2 justify-center", className)}>
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    ref={(ref) => {
                        // Assign ref safely
                        inputRefs.current[index] = ref;
                    }}
                    className="w-12 h-12 text-center text-lg font-bold"
                />
            ))}
        </div>
    );
};

export { OTPInput };
