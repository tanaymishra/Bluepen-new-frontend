import React, { forwardRef } from "react";
import css from "../adminInput/adminInput.module.scss";

interface AdminTextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const AdminTextArea = forwardRef<HTMLTextAreaElement, AdminTextAreaProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      required = false,
      readOnly = false,
      onClick,
      style,
    },
    ref
  ) => {
    return (
      <div className={css.inputBox} onClick={onClick}>
        <div className={css.inputLabel}>
          {label}
          {required && <span className={css.required}>*</span>}
        </div>
        <textarea
          className={css.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          required={required}
          readOnly={readOnly}
          style={style}
        />
      </div>
    );
  }
);

export default AdminTextArea;
