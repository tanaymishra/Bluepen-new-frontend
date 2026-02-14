import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styles from '@/styles/autocomplete.module.scss';

interface AutocompleteProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    textAlign?: "center" | "left" | "right";
    style?: React.CSSProperties;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    textAlign = "center",
    style
}) => {
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [inputFocused, setInputFocused] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const filtered = value
            ? options.filter(option =>
                option.toLowerCase().includes(value.toLowerCase())
            )
            : options;
        setFilteredOptions(filtered);
    }, [value, options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowOptions(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFocus = () => {
        if (!showOptions) {
            setShowOptions(true);
        }
    };

    const handleSelect = (option: string) => {
        onChange(option);
        setShowOptions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
    };

    // const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'ArrowDown') {
    //         setHighlightedIndex((prev) => (prev === filteredOptions.length - 1 ? 0 : prev + 1));
    //     } else if (e.key === 'ArrowUp') {
    //         setHighlightedIndex((prev) => (prev === 0 ? filteredOptions.length - 1 : prev - 1));
    //     } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
    //         handleSelect(filteredOptions[highlightedIndex]);
    //     } else if (e.key === 'Escape') {
    //         setShowOptions(false);
    //         setHighlightedIndex(-1);
    //     }
    // };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showOptions && e.key !== 'ArrowDown') {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!showOptions) {
                    setShowOptions(true);
                    setHighlightedIndex(0);
                } else {
                    setHighlightedIndex(prev =>
                        prev < filteredOptions.length - 1 ? prev + 1 : 0
                    );
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;

            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleSelect(filteredOptions[highlightedIndex]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                setShowOptions(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    return (
        <div ref={ref} className={styles.autocomplete}>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                style={{ ...style, textAlign }}
                className={`${styles.input} ${showOptions ? styles.focused : ''}`}
            />
            {showOptions && filteredOptions.length > 0 && (
                <ul className={styles.optionsList}>
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(option)}
                            className={`${styles.optionItem} ${highlightedIndex === index ? styles.highlighted : ''}`}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;