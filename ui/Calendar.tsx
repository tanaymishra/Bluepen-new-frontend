import React, { useState, useEffect, Dispatch, SetStateAction, CSSProperties } from 'react';
import styles from "@/styles/calendar.module.scss";
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  onChange?: (date: Date) => void;
  allowPasteDate?: boolean; // New prop
  maxMonthsForward?: number; // New prop to limit how many months they can go forward
  setShow: Dispatch<SetStateAction<boolean>>;
  style?: CSSProperties
  className?: string;
}

interface MonthData {
  date: Date;
  direction: 'left' | 'right' | null;
}

const Calendar: React.FC<CalendarProps> = ({
  onChange,
  allowPasteDate = false, // Default to false
  maxMonthsForward = 12, // Default to 12 months forward
  setShow,
  className = '',
  style = {}
}) => {
  const [monthData, setMonthData] = useState<MonthData>({ date: new Date(), direction: null });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (onChange && selectedDate) {
      onChange(selectedDate);
      setShow((prev) => false);
    }
  }, [selectedDate]);

  const startOfMonth = new Date(monthData.date.getFullYear(), monthData.date.getMonth(), 1);
  const endOfMonth = new Date(monthData.date.getFullYear(), monthData.date.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const today = new Date();

  const changeMonth = (direction: number) => {
    if (isTransitioning) return;

    const newDate = new Date(monthData.date.getFullYear(), monthData.date.getMonth() + direction, 1);

    // Check if the new date would be disabled
    if (isDateDisabled(newDate)) {
      return;
    }

    setIsTransitioning(true);
    setMonthData({
      date: newDate,
      direction: direction > 0 ? 'right' : 'left'
    });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with CSS animation duration
  };

  const changeYear = (direction: number) => {
    setMonthData((prevData) => {
      const newYear = prevData.date.getFullYear() + direction;
      const newDate = new Date(newYear, prevData.date.getMonth(), 1);

      const now = new Date();
      const maxDate = new Date(now.getFullYear(), now.getMonth() + maxMonthsForward, 1);

      // Prevent navigating to past dates if allowPasteDate is false
      if (!allowPasteDate && newDate.getFullYear() < now.getFullYear()) {
        return prevData;
      }

      // Prevent navigating beyond maxMonthsForward
      if (newDate > maxDate) {
        return prevData;
      }

      return { date: newDate, direction: direction > 0 ? 'right' : 'left' };
    });
  };

  const selectDate = (day: number) => {
    const newSelectedDate = new Date(monthData.date.getFullYear(), monthData.date.getMonth(), day);
    setSelectedDate(newSelectedDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      monthData.date.getFullYear() === today.getFullYear() &&
      monthData.date.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  const renderDays = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isPastDate = !allowPasteDate && (
        date.getFullYear() < today.getFullYear() ||
        (date.getFullYear() === today.getFullYear() &&
          (date.getMonth() < today.getMonth() ||
            (date.getMonth() === today.getMonth() && day < today.getDate())))
      );

      days.push(
        <div
          key={day}
          className={`${styles.day} 
                        ${selectedDate?.getDate() === day ? styles.selectedDay : ''} 
                        ${isPastDate ? styles.disabledDay : ''} 
                        ${isToday(day) ? styles.todayDate : ''}`}
          onClick={!isPastDate ? () => selectDate(day) : undefined}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const isDateDisabled = (date: Date) => {
    const now = new Date();
    // Set both dates to start of their respective months for comparison
    const compareDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const nowStartOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const maxDate = new Date(now.getFullYear(), now.getMonth() + maxMonthsForward, 1);

    // For past dates
    if (!allowPasteDate && compareDate < nowStartOfMonth) {
      return true;
    }

    // For future dates beyond maxMonthsForward
    if (compareDate > maxDate) {
      return true;
    }

    return false;
  };

  const isPrevMonthDisabled = () => {
    const prevMonth = new Date(monthData.date.getFullYear(), monthData.date.getMonth() - 1, 1);
    return isDateDisabled(prevMonth);
  };

  const isNextMonthDisabled = () => {
    const nextMonth = new Date(monthData.date.getFullYear(), monthData.date.getMonth() + 1, 1);
    return isDateDisabled(nextMonth);
  };

  const isPrevYearDisabled = () => {
    const prevYear = new Date(monthData.date.getFullYear() - 1, monthData.date.getMonth(), 1);
    return isDateDisabled(prevYear);
  };

  const isNextYearDisabled = () => {
    const nextYear = new Date(monthData.date.getFullYear() + 1, monthData.date.getMonth(), 1);
    return isDateDisabled(nextYear);
  };

  return (
    <div className={`${styles.calendar} ${className}`} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header} style={style}>
        <div className={styles.navGroup}>
          <button
            type='button'
            onClick={() => changeYear(-1)}
            className={styles.navButton}
            disabled={isPrevYearDisabled()}
          >
            «
          </button>
          <button
            type='button'
            onClick={() => changeMonth(-1)}
            className={styles.navButton}
            disabled={isPrevMonthDisabled()}
          >
            ‹
          </button>
        </div>

        <div className={styles.currentMonth}>
          {monthData.date.toLocaleString('default', { month: 'long' })} {monthData.date.getFullYear()}
        </div>

        <div className={styles.navGroup}>
          <button
            type='button'
            onClick={() => changeMonth(1)}
            className={styles.navButton}
            disabled={isNextMonthDisabled()}
          >
            ›
          </button>
          <button
            type='button'
            onClick={() => changeYear(1)}
            className={styles.navButton}
            disabled={isNextYearDisabled()}
          >
            »
          </button>
        </div>
      </div>
      <div className={styles.daysOfWeek}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayOfWeek}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.daysContainer}>
        <div
          className={`${styles.days} ${isTransitioning ?
              monthData.direction === 'right' ?
                styles.slideLeft : styles.slideRight
              : ''
            }`}
        >
          {renderDays(monthData.date)}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
