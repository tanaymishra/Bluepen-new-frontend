import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/admin/components/monthPicker.module.scss';

interface MonthPickerProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    minYear?: number;
    maxYear?: number;
    className?: string;
    minMonth?: string;
}

const MonthPicker: React.FC<MonthPickerProps> = ({
    placeholder = 'Select date',
    value = '',
    onChange,
    minYear = 2020,
    maxYear = new Date().getFullYear(),
    className = '',
    minMonth = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showYears, setShowYears] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const pickerRef = useRef<HTMLDivElement>(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const years = Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => maxYear - i
    );

    useEffect(() => {
        // Parse initial value if provided (format: "MM-YYYY")
        if (value) {
            const [month, year] = value.split('-');
            setSelectedMonth(parseInt(month) - 1);
            setSelectedYear(parseInt(year));
            setDisplayYear(parseInt(year));
        } else {
            setSelectedMonth(null);
            setSelectedYear(new Date().getFullYear());
            setDisplayYear(new Date().getFullYear());
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowYears(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleYearClick = (year: number) => {
        setSelectedYear(year);
        setDisplayYear(year);
        setShowYears(false);
    };

    const handleMonthClick = (monthIndex: number) => {
        setSelectedMonth(monthIndex);
        const monthStr = (monthIndex + 1).toString().padStart(2, '0');
        onChange?.(`${monthStr}-${displayYear}`);
        setIsOpen(false);
    };

    const togglePicker = () => {
        setIsOpen(!isOpen);
        setShowYears(false);
    };

    const toggleYearView = () => {
        setShowYears(!showYears);
    };

    const navigateYear = (direction: 'prev' | 'next') => {
        const newYear = displayYear + (direction === 'next' ? 1 : -1);
        if (newYear >= minYear && newYear <= maxYear) {
            setDisplayYear(newYear);
        }
    };

    const getDisplayValue = () => {
        if (selectedMonth !== null) {
            return `${months[selectedMonth]} ${selectedYear}`;
        }
        return placeholder;
    };

    const isMonthDisabled = (monthIndex: number, year: number) => {
        if (!minMonth) return false;

        const [minMonthStr, minYearStr] = minMonth.split('-');
        const minMonthIndex = parseInt(minMonthStr) - 1;
        const minYear = parseInt(minYearStr);

        return year < minYear || (year === minYear && monthIndex < minMonthIndex);
    };

    const renderContent = () => {
        if (showYears) {
            return (
                <tr>
                    <td colSpan={3}>
                        <div className={styles.yearsGrid}>
                            {years.map(year => {
                                const isDisabled = minMonth && year < parseInt(minMonth.split('-')[1]);
                                return (
                                    <div
                                        key={year}
                                        className={`${styles.month} 
                                        ${selectedYear === year ? styles.selected : ''} 
                                        ${isDisabled ? styles.off : ''}`}
                                        onClick={() => !isDisabled && handleYearClick(year)}
                                    >
                                        {year}
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            );
        }

        return Array(4).fill(null).map((_, rowIndex) => (
            <tr key={rowIndex}>
                {Array(3).fill(null).map((_, colIndex) => {
                    const monthIndex = rowIndex * 3 + colIndex;
                    const isSelected = selectedMonth === monthIndex && selectedYear === displayYear;
                    const isCurrentMonth = monthIndex === currentMonth && displayYear === currentYear;
                    const isDisabled = isMonthDisabled(monthIndex, displayYear);

                    return (
                        <td
                            key={colIndex}
                            className={`${styles.month} ${isSelected ? styles.selected : ''} ${isCurrentMonth ? styles.current : ''} ${isDisabled ? styles.off : ''}`}
                            onClick={() => !isDisabled && handleMonthClick(monthIndex)}
                        >
                            {months[monthIndex]}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div className={`${styles.monthpicker} ${className}`} ref={pickerRef}>
            <div
                className={`${styles.monthpickerInput} ${selectedMonth !== null ? styles.selected : ''}`}
                onClick={togglePicker}
            >
                <span className={!selectedMonth ? styles.placeholder : ''}>
                    {getDisplayValue()}
                </span>
            </div>

            {isOpen && (
                <div className={styles.monthpickerSelector}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <span
                                        className={`${styles.yearSwitch} ${displayYear <= minYear ? styles.off : ''}`}
                                        onClick={() => navigateYear('prev')}
                                    >
                                        ←
                                    </span>
                                </td>
                                <td>
                                    <div
                                        className={styles.yearValue}
                                        onClick={toggleYearView}
                                    >
                                        {displayYear}
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={`${styles.yearSwitch} ${displayYear >= maxYear ? styles.off : ''}`}
                                        onClick={() => navigateYear('next')}
                                    >
                                        →
                                    </span>
                                </td>
                            </tr>
                            {renderContent()}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MonthPicker;