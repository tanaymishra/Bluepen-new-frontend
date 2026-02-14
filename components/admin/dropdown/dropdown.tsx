import React, { useState, useEffect, useRef } from 'react';
import css from '@/styles/admin/components/dropdown.module.scss';

interface DropdownProps {
    options: string[];
    defaultOption: string;
    onChange: (option: string) => void;
    style?: React.CSSProperties;
    value: string;
    onReset: () => void;
    iconImg?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, defaultOption, onChange, style, value, onReset, iconImg }) => {
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
    }, []);

    const handleOptionClick = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };


    return (
        <div className={css.dropdown} style={style} ref={dropdownRef}>
            <div className={css.selected} onClick={() => setIsOpen(!isOpen)}>
                <div className={css.textCont}>
                    {value || defaultOption}
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${css.arrow} ${isOpen ? css.arrowRotate : ''}`} style={{
                    display: 'var(--dropdown-arrow-display, block)',
                    filter: 'var(--dropdown-arrow-filter, none)'
                }}>
                    <path
                        d="M7.99935 12.36L0.666016 5.02667L1.69268 4L7.99935 10.3067L14.306 4L15.3327 5.02667L7.99935 12.36Z"
                        fill="currentColor"
                        style={{ color: 'var(--dropdown-arrow-color, #5b5b5b)' }}
                    />
                </svg>
            </div>
            {isOpen && (
                <ul className={css.options}>
                    {options.map((option) => (
                        <li key={option} onClick={() => handleOptionClick(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;