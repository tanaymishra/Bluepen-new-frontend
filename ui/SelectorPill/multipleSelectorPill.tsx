"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import css from './multipleSelectorPill.module.scss';

interface Option {
  value: string;
  label: string;
}

interface MultipleSelectorPillProps {
  options: Option[];
  placeholder?: string;
  onChange?: (values: string[]) => void;
  maxSelections?: number;
  value: string;
  required?: boolean;
  isError?: boolean;
  errorMessage?: string;
  label?: string;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  pillClassName?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  pillStyle?: React.CSSProperties;
  inputWrapperClassName?: string;
  inputWrapperStyle?: React.CSSProperties;
  existing?: string[];
}

const MultipleSelectorPill: React.FC<MultipleSelectorPillProps> = ({
  options,
  placeholder = 'Select options...',
  onChange,
  maxSelections = Infinity,
  value,
  required = false,
  isError = false,
  errorMessage = '',
  label,
  className = '',
  containerClassName = '',
  inputClassName = '',
  dropdownClassName = '',
  pillClassName = '',
  style = {},
  containerStyle = {},
  inputStyle = {},
  dropdownStyle = {},
  pillStyle = {},
  inputWrapperClassName = '',
  inputWrapperStyle = {},
  existing = [],
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Capture typed string on "Enter" or comma press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const typedValue = e.currentTarget.value.trim();
      if (
        typedValue &&
        !existing.includes(typedValue) &&
        !selectedValues.includes(typedValue) &&
        selectedValues.length < maxSelections
      ) {
        const newValues = [...selectedValues, typedValue];
        setSelectedValues(newValues);
        onChange?.(newValues);
      }
      setSearchTerm("");
    }
  };

  // Filter options based on user input
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selection from dropdown
  const handleSelect = (val: string) => {
    let newValues;
    if (selectedValues.includes(val)) {
      newValues = selectedValues.filter((v) => v !== val);
    } else if (selectedValues.length < maxSelections) {
      newValues = [...selectedValues, val];
    } else {
      return;
    }
    setSelectedValues(newValues);
    onChange?.(newValues);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  // Remove an existing selected value
  const handleRemove = (valueToRemove: string) => {
    // Only remove from selected if it's in selectedValues
    if (selectedValues.includes(valueToRemove)) {
      const updated = selectedValues.filter((val) => val !== valueToRemove);
      setSelectedValues(updated);
      onChange?.(updated);
    }
  };

  // Show dropdown on input click
  const handleInputClick = () => {
    setIsOpen(true);
  };

  // Hide dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Combine "existing" and "selectedValues" for display
  const allValues = Array.from(new Set([...existing, ...selectedValues]));

  return (
    <div className={`${css.inputGroup} ${className}`} style={style}>
      {label && (
        <label className={css.label}>
          {label}
          {required && <span className={css.required}>*</span>}
        </label>
      )}
      <div
        className={`${css.container} ${isError ? css.error : ''} ${containerClassName}`}
        ref={containerRef}
        style={containerStyle}
      >
        <div
          className={`${css.inputWrapper} ${inputWrapperClassName}`}
          onClick={handleInputClick}
          style={inputWrapperStyle}
        >
          {allValues.map(val => {
            const option = options.find((opt) => opt.value === val);
            const labelToShow = option?.label || val;
            return (
              <div
                key={val}
                className={`${css.pill} ${pillClassName}`}
                style={pillStyle}
              >
                {labelToShow}
                <button
                  className={css.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(val);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedValues.length === 0 ? placeholder : ''}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            required={required}
            className={inputClassName}
            style={inputStyle}
            onKeyDown={handleKeyDown}
          />
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div
            className={`${css.dropdown} ${dropdownClassName}`}
            style={dropdownStyle}
          >
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={`${css.option} ${selectedValues.includes(option.value) ? css.selected : ''
                  }`}
                onClick={() => handleSelect(option.value)}
              >
                {selectedValues.includes(option.value) && <Check size={16} />}
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {isError && errorMessage && (
        <span className={css.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
};

export default MultipleSelectorPill;
