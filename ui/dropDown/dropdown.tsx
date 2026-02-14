import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react'; // Added Search icon
import styles from './dropdown.module.scss';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  isError?: boolean;
  dropDownType?: 'normal' | 'search'; // Added prop
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  required = false,
  error,
  disabled = false,
  isError = false,
  dropDownType = 'normal', // Default to 'normal'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for search input

  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search term if in 'search' mode
  const filteredOptions = dropDownType === 'search' && searchTerm
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        if (dropDownType === 'search') {
          setSearchTerm(''); // Clear search on close
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropDownType]); // Add dropDownType dependency

  // Focus input when dropdown opens in search mode
  useEffect(() => {
    if (isOpen && dropDownType === 'search' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, dropDownType]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
    if (dropDownType === 'search') {
      setSearchTerm(''); // Clear search on select
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true); // Open dropdown when typing starts
    }
  };

  const handleDropdownClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setIsFocused(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (!isOpen) {
        setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Don't immediately set focused to false, wait for click outside
  };

  const showError = error && isError;

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      {label && (
        <label className={`${styles.label} spartan-500`}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div
        className={`${styles.dropdown} ${isOpen ? styles.open : ''} 
          ${isFocused ? styles.focused : ''} 
          ${isError ? styles.error : ''} 
          ${disabled ? styles.disabled : ''}`}
        // Use onClick only for normal mode or when search input isn't the target
        onClick={dropDownType === 'normal' ? handleDropdownClick : undefined} 
        tabIndex={dropDownType === 'normal' ? 0 : -1} // Only make div focusable in normal mode
        onFocus={dropDownType === 'normal' ? () => setIsFocused(true) : undefined}
      >
        <div className={`${styles.selectedValue} ${dropDownType === 'search' ? styles.searchActive : ''}`}>
          {dropDownType === 'search' ? (
            <>
              <Search size={18} className={styles.searchIcon} /> {/* Add search icon */}
              <input
                ref={inputRef}
                type="text"
                value={searchTerm || (selectedOption ? selectedOption.label : '')} // Show selected label if no search term
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={selectedOption ? selectedOption.label : placeholder} // Dynamic placeholder
                className={`${styles.searchInput} spartan-400`}
                disabled={disabled}
                onClick={handleDropdownClick} // Open dropdown on input click too
              />
            </>
          ) : (
            <span className={`${!selectedOption ? styles.placeholder : ''} spartan-400`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          <ChevronDown 
            className={`${styles.arrow} ${isOpen ? styles.open : ''}`} 
            size={20}
            onClick={handleDropdownClick} // Allow arrow click to toggle
          />
        </div>
        {isOpen && (
          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option} ${option.value === value ? styles.selected : ''} spartan-400`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className={styles.noOptions}>No options found</div> // Display when no options match search
            )}
          </div>
        )}
      </div>
      {showError && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Dropdown;
