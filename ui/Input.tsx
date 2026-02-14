"use client";
import React, { useState } from "react";
import styles from "@/styles/input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  id?: string;
  type?: string;
  placeholder: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  pattern?: string;
  errorMessage?: string;
  disabled?: boolean;
  restrictToNumeric?: boolean;
  isError?: boolean;
  readonly?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
  inputWrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  id,
  type,
  placeholder,
  value,
  onChange,
  onInput,
  disabled,
  label,
  required = false,
  pattern,
  errorMessage,
  restrictToNumeric = false,
  isError = false,
  readonly = false,
  className,
  inputWrapperClassName,
  ref,
  ...rest
}) => {
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const showError = touched && errorMessage && isError;

  return (
    <div className={`${styles.inputGroup} ${isFocused ? styles.focused : ''}`}>
      {label && (
        <label htmlFor={id} className={`${styles.labelInput} spartan-600`}>
          {label}{" "}
          {required && (
            <span className={`${styles.required} spartan-600`}>*</span>
          )}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${isError ? styles.error : ''} ${inputWrapperClassName}`}>
        <input
          name={name}
          id={id}
          type={type}
          placeholder={isFocused ? "" : placeholder}
          value={value}
          onChange={onChange}
          onInput={onInput}
          onKeyDown={(e) => {
            if (restrictToNumeric && ['e', 'E', '+', '-', '.', ',', '_'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onBlur={handleBlur}
          onFocus={handleFocus}
          required={required}
          pattern={pattern}
          aria-invalid={errorMessage && touched ? "true" : "false"}
          className={`${styles.inputField} spartan-400 ${className}`}
          inputMode={restrictToNumeric ? "numeric" : undefined}
          readOnly={readonly}
          ref={ref}
          {...rest}
        />
      </div>
      {showError && (
        <span className={styles.errorMessage} role="alert">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
