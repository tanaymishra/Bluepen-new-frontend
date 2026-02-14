import React, { useState, useEffect, useRef } from 'react';
import css from '@/styles/admin/components/checkbox.module.scss';

interface PMOption {
    id: number | string;
    name: string;
}

type CheckboxOption = string | PMOption;

interface CheckboxProps {
    options: CheckboxOption[];
    type?: 'default' | 'pm' | 'assignmentType';
    defaultOption: string;
    onChange: (selectedOptions: string[]) => void;
    style?: React.CSSProperties;
    value: string[];
    onReset: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ options, type = 'default', defaultOption, onChange, style, value, onReset }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);    const handleOptionClick = (option: CheckboxOption) => {
        // For type="pm" or "assignmentType", we store the option's ID in the array; otherwise, we store the string itself.
        let itemToStore: string;

        if ((type === 'pm' || type === 'assignmentType') && typeof option !== 'string') {
            itemToStore = String(option.id);
        } else {
            // default type
            itemToStore = String(option);
        }

        const newSelectedOptions = value.includes(itemToStore)
            ? value.filter((selectedOption) => selectedOption !== itemToStore)
            : [...value, itemToStore];

        onChange(newSelectedOptions);
        setIsOpen(false);
    };

    const handleClearAll = (event: React.MouseEvent) => {
        event.stopPropagation();
        onChange([]);
        onReset();
    };

    /** Renders the label (name) for display. */
    const getOptionLabel = (option: CheckboxOption) => {
        if (typeof option === 'string') {
            return option;
        }
        return option.name;
    };    /** Returns the unique key (string) to identify the option. */
    const getOptionKey = (option: CheckboxOption) => {
        if ((type === 'pm' || type === 'assignmentType') && typeof option !== 'string') {
            return String(option.id);
        }
        return String(option);
    };

    /** Checks whether an option is currently selected. */
    const isOptionSelected = (option: CheckboxOption) => {
        const key = getOptionKey(option);
        return value.includes(key);
    };

    return (
        <div className={css.checkbox} style={style} ref={dropdownRef}>
            <div
                className={`${css.selected} ${value.length > 0 ? css.selectedActive : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={css.textCont}>
                    {defaultOption}
                </div>
                <div className={css.icons}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${css.arrow} ${isOpen ? css.arrowRotate : ''}`}
                        style={{
                            display: 'var(--dropdown-arrow-display, block)',
                            filter: 'var(--dropdown-arrow-filter, none)',
                        }}
                    >
                        <path
                            d="M7.99935 12.36L0.666016 5.02667L1.69268 4L7.99935 10.3067L14.306 4L15.3327 5.02667L7.99935 12.36Z"
                            fill="currentColor"
                            style={{ color: 'var(--dropdown-arrow-color, #5b5b5b)' }}
                        />
                    </svg>
                    {value.length > 0 && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                        onClick={handleClearAll}
                        aria-label="Clear selection"
                        >
                            <path d="M14 8C14 4.6875 11.3125 2 8 2C4.6875 2 2 4.6875 2 8C2 11.3125 4.6875 14 8 14C11.3125 14 14 11.3125 14 8Z" stroke="white" stroke-miterlimit="10" />
                            <path d="M10 10L6 6M6 10L10 6" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    )}
                </div>
            </div>
            {isOpen && (
                <ul className={css.options} style={{
                    maxHeight:"300px",
                    overflowY:"auto",
                }}>
                    {options.map((option) => (
                        <li
                            key={getOptionKey(option)}
                            onClick={() => handleOptionClick(option)}
                            className={isOptionSelected(option) ? css.selectedOption : ''}
                        >
                            {getOptionLabel(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Checkbox;