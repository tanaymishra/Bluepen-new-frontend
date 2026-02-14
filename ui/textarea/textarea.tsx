import React, { useState } from 'react';
import styles from '@/styles/ui/textarea.module.scss';
import type { Metadata } from 'next'

interface TextAreaProps {
    name?: string
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
    className?: string;
}


export const metadata: Metadata = {
    title: '...',
    description: '...',
}

const Textarea: React.FC<TextAreaProps> = ({
    name,
    id,
    placeholder,
    value,
    onChange,
    label,
    required = false,
    errorMessage,
    className
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

    return (
        <div className={styles.inputGroup}>
            {label && (
                <label htmlFor={id} className={`${styles.labelInput} spartan-600`}>
                    {label} {required && <span className={`${styles.required} spartan-600`}>*</span>}
                </label>
            )}
            <textarea
                name={name}
                id={id}
                placeholder={isFocused ? '' : placeholder}
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                required={required}
                aria-invalid={errorMessage && touched ? 'true' : 'false'}
                className={`${styles.inputClass} ${className}`}
            />
            {touched && errorMessage && (
                <span className={styles.error}>{errorMessage}</span>
            )}
        </div>
    );
};

export default Textarea;