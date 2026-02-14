import React, { useState, useEffect, useRef } from 'react';
import css from '@/styles/freelancer/components/dropdown.module.scss';

interface DropdownProps {
    options: string[];
    defaultOption: string;
    onChange: (option: string) => void;
    style?: React.CSSProperties;
    value: string;
    onReset: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, defaultOption, onChange, style, value, onReset }) => {
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
                {value || defaultOption} <img src="/assets/freelancer/assignments/dropdownArrow.svg" alt="" className={`${css.arrow} ${isOpen ? css.arrowRotate : ''}`} />
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