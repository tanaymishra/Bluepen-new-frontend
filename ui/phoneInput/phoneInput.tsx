import React, { useState, useRef, useEffect, useMemo } from "react";
import css from "@/styles/phoneInput.module.scss";
import countries from "@/staticDatas/countryMap";

interface Country {
  code: string;
  name: string;
  imageUrl: string;
}

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string, country: Country) => void;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  isVerified?: boolean; // Add this new prop
  inputRowStylesCss?: React.CSSProperties;
  countryImageStyleCss?: React.CSSProperties;
  dropdownStylesCss?: React.CSSProperties;
  containerStylesCss?: React.CSSProperties;
  readonly?: boolean;
  maxLength?: number;
}

const ChevronIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  errorMessage,
  placeholder = "",
  disabled = false,
  isVerified = false, // Add this new prop with default value
  inputRowStylesCss = {},
  countryImageStyleCss = {},
  dropdownStylesCss = {},
  readonly = false,
  maxLength,
  containerStylesCss = {},
}) => {
  const [touched, setTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === "+91") || countries[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const phoneBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        phoneBoxRef.current &&
        !phoneBoxRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCountries = useMemo(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (!trimmedSearchTerm) return countries;

    return countries.filter((country) => {
      const nameMatch = country.name
        .toLowerCase()
        .startsWith(trimmedSearchTerm);
      const codeMatch = country.code.slice(1).startsWith(trimmedSearchTerm);
      return nameMatch || codeMatch;
    });
  }, [searchTerm]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSearchTerm("");
    setIsOpen(false);
    onChange(value.replace(selectedCountry.code, ""), country);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow numeric input
    const numericValue = inputValue.replace(/\D/g, "");

    // Add validation for Indian numbers (10 digits max)
    if (selectedCountry.code === "+91" && numericValue.length > 10) {
      return; // Don't update if trying to enter more than 10 digits for Indian numbers
    }

    onChange(numericValue, selectedCountry);
    setTouched(true);
  };

  const handlePhoneBoxClick = (e: React.MouseEvent) => {
    if (e.target === phoneBoxRef.current) {
      inputRef.current?.focus();
    }
  };

  // Calculate if the current input exceeds the maximum length for Indian numbers
  const isMaxLengthExceeded =
    selectedCountry.code === "+91" && value.length > 10;
  const isInvalidLength =
    selectedCountry.code === "+91" && value.length > 0 && value.length !== 10;

  const inputRowStyles = {
    padding: "0.25rem",
    borderRadius: "calc(var(--variable)*1.5)",
    display: "flex",
    alignItems: "center",
    border:
      isInvalidLength || isMaxLengthExceeded
        ? "1px solid #EF4444"
        : "1px solid #D7D6D6",
    transition: "all 0.2s ease-in-out",
    outline:
      isInvalidLength || isMaxLengthExceeded
        ? "2px solid rgba(239, 68, 68, 0.2)"
        : "none",
    ...inputRowStylesCss,
  };

  const inputStyles = {
    border: "none",
    outline: "none",
  };

  const errorTextStyle = {
    color: "#EF4444",
    fontSize: "14px",
    marginTop: "4px",
    display: "block",
  };

  const countryImageStyle = {
    width: "20px",
    height: "20px",
    marginRight: "8px",
    ...countryImageStyleCss,
  };

  const toggleDropdown = () => {
    if (!readonly) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  return (
    <div className={css.phoneContainer} style={containerStylesCss}>
      {label && (
        <label className={`spartan-600`}>
          {label} {required && <span className={css.required}>*</span>}
        </label>
      )}
      <div className={css.insideContainer}>
        <div
          className={`${css.inputRow} ${disabled ? css.disabled : ""} ${
            isVerified ? css.verified : ""
          }`}
          style={inputRowStyles}
        >
          <button
            type="button"
            className={css.dropdownRef}
            style={dropdownStylesCss}
            onClick={toggleDropdown}
            disabled={readonly}
          >
            <img
              src={selectedCountry.imageUrl}
              alt={selectedCountry.name}
              style={countryImageStyle}
            />
            <ChevronIcon />
          </button>
          <div
            ref={phoneBoxRef}
            className={css.phoneBox}
            onClick={handlePhoneBoxClick}
          >
            <span className={`spartan-400`}>{selectedCountry.code}</span>
            <input
              disabled={disabled || readonly}
              readOnly={readonly}
              ref={inputRef}
              type="text"
              value={value}
              maxLength={selectedCountry.code === "+91" ? 10 : undefined}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "E") {
                  e.preventDefault();
                }
              }}
              className={`${css.phone} ${css.classNameInput} spartan-400`}
              style={inputStyles}
              placeholder={placeholder}
            />
          </div>
        </div>
        {isOpen && (
          <div ref={dropdownRef} className={css.openList}>
            <div className={css.searchbar}>
              <div className={css.searchRow}>
                <input
                  type="text"
                  placeholder="Search countries"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`spartan-400`}
                  disabled={readonly}
                />
                <span className={`spartan-400`}>
                  <SearchIcon />
                </span>
              </div>
            </div>
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                className={css.dropdownRef}
                onClick={() => handleCountrySelect(country)}
                disabled={readonly}
              >
                <img src={country.imageUrl} alt={country.name} />
                <span className={`spartan-400`}>{country.name}</span>
                <span className={`spartan-400`}>{country.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {required && touched && errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
      {required && touched && isInvalidLength && (
        <span className="spartan-400" style={errorTextStyle}>
          Indian phone numbers must be 10 digits
        </span>
      )}
    </div>
  );
};

export default CustomPhoneInput;
