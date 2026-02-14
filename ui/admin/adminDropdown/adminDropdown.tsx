import React, { forwardRef, useState } from "react";
import css from "./adminDropdown.module.scss";

interface AdminDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}

const AdminDropdown = forwardRef<HTMLDivElement, AdminDropdownProps>(
  ({ label, value, options, onChange, required = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
      onChange(option);
      setIsOpen(false);
    };

    return (
      <div
        className={`${css.dropdownBox} ${isOpen ? css.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
      >
        <div className={css.dropText}>
          <div className={css.dropLabel}>
            {label}
            {required && <span className={css.required}>*</span>}
          </div>
          <div className={css.selectDrop}>{value || "Select"}</div>
        </div>
        <div className={css.arrowImg}>
          <img src="/assets/admin/employee/downArrow.svg" alt="" />
        </div>
        {isOpen && (
          <ul className={css.dropdownOptions}>
            {options.map((option) => (
              <li key={option} onClick={() => handleSelect(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

AdminDropdown.displayName = "AdminDropdown";
export default AdminDropdown;
