import React, { forwardRef } from 'react';
import css from './adminInput.module.scss';

interface AdminInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  readOnly = false,
  onClick,
  disabled = false
}, ref) => {
  return (
    <div className={`${css.inputBox} ${disabled ? css.disabled : ''}`} onClick={onClick}>
      <div className={css.inputLabel}>
        {label}
        {required && <span className={css.required}>*</span>}
      </div>
      <input
        type={type}
        className={css.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
});

AdminInput.displayName = 'AdminInput';

export default AdminInput;
