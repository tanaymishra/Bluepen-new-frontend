import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/ui/otpInput.module.scss";

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
  onComplete: (otp: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length,
  onChange,
  onComplete,
  style,
  className,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    onChange(otp.join(""));
    if (otp.every((digit) => digit !== "")) {
      onComplete(otp.join(""));
    }
  }, [otp]);

  const focusNext = (index: number) => {
    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const focusPrevious = (index: number) => {
    if (index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // Only take the last digit
      setOtp(newOtp);

      if (value) {
        focusNext(index);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        focusPrevious(index);
      }
    } else if (e.key === "ArrowLeft") {
      focusPrevious(index);
    } else if (e.key === "ArrowRight") {
      focusNext(index);
    }
  };

  return (
    <div className={`${styles.otpContainer} ${className}`} style={style}>
      <div className={`${styles.otpLabel} spartan-600`}>{`OTP`}</div>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            if (el) inputsRef.current[index] = el;
          }}
          className={`${styles.otpInput} spartan-400`}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;
