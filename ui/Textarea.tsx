import React, { useState } from "react";
import styles from "@/styles/input.module.scss";
import type { Metadata } from "next";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name?: string;
  id?: string;
  type?: any;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  required?: boolean;
  pattern?: string;
  errorMessage?: string;
  disabled?: boolean;
  isError?: boolean;
  refer?: React.Ref<HTMLTextAreaElement>;
  className?: string;
}

export const metadata: Metadata = {
  title: "...",
  description: "...",
};

const Textarea: React.FC<TextAreaProps> = ({
  name,
  id,
  placeholder,
  value,
  onChange,
  label,
  required = false,
  errorMessage,
  isError = false,
  refer,
  className,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  const showError = touched && errorMessage && isError;

  return (
    <div className={`${styles.inputGroup} ${isFocused ? styles.focused : ""}`}>
      {label && (
        <label htmlFor={id} className={`${styles.labelInput} spartan-500`}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div
        className={`${styles.textareaWrapper} ${isError ? styles.error : ""}`}
      >
        <textarea
          ref={refer}
          name={name}
          {...rest}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          aria-invalid={errorMessage && touched ? "true" : "false"}
          style={{ resize: "none" }}
          className={`${styles.textareaInput} spartan-400 ${className}`}
        />
      </div>
      {showError && (
        <span className={styles.errorMessage} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Textarea;
