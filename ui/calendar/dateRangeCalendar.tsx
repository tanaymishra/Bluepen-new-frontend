import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/ui/dateRangeCalendar.module.scss";

interface DateRangeCalendarProps {
  onDateRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onClose?: () => void;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DateRangeSelector: React.FC<DateRangeCalendarProps> = ({
  onDateRangeChange,
  initialStartDate,
  initialEndDate,
  onClose,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentDateLeft, setCurrentDateLeft] = useState(new Date());
  const [currentDateRight, setCurrentDateRight] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  useEffect(() => {
    setStartDate(initialStartDate || null);
    setEndDate(initialEndDate || null);
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const isDateInRange = (date: Date) =>
    startDate && endDate && date >= startDate && date <= endDate;

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && date >= startDate) {
      setEndDate(date);
      // Notify parent of date selection
      onDateRangeChange?.(startDate, date);
    }
  };

  const handleLeftMonthChange = (direction: "prev" | "next") => {
    setCurrentDateLeft((prev) => {
      const newDate = new Date(
        prev.getFullYear(),
        prev.getMonth() + (direction === "next" ? 1 : -1),
        1
      );
      return newDate;
    });
  };

  const handleRightMonthChange = (direction: "prev" | "next") => {
    setCurrentDateRight((prev) => {
      const newDate = new Date(
        prev.getFullYear(),
        prev.getMonth() + (direction === "next" ? 1 : -1),
        1
      );
      return newDate;
    });
  };

  const renderCalendar = (currentDate: Date, isLeftCalendar: boolean) => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const renderDays = () => {
      const days = [];

      for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );

        const isStartDate = startDate && date.getTime() === startDate.getTime();
        const isEndDate = endDate && date.getTime() === endDate.getTime();
        const isInRange =
          startDate && endDate && date > startDate && date < endDate;

        const isSunday = date.getDay() === 0; // Sunday check

        const selectedClass = isStartDate
          ? styles.startSelectedDay
          : isEndDate
          ? styles.endSelectedDay
          : isInRange
          ? styles.inRangeDay
          : "";

        days.push(
          <div
            key={day}
            className={`${styles.day} ${selectedClass} ${
              isDateInRange(date) ? styles.inRange : ""
            } ${isSunday ? styles.sunday : ""}`}
            onClick={() => handleDateClick(date)}
          >
            {day}
          </div>
        );
      }

      return days;
    };

    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendar}>
          <div className={styles.header}>
            {isLeftCalendar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLeftMonthChange("prev");
                }}
                className={styles.navButton}
              >
                ‹
              </button>
            )}
            <div className={styles.currentMonth}>
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </div>
            {!isLeftCalendar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRightMonthChange("next");
                }}
                className={styles.navButton}
              >
                ›
              </button>
            )}
          </div>
          <div className={styles.daysOfWeek}>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`${styles.dayOfWeek} ${
                  day === "Sun" ? styles.sunday : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className={styles.days}>{renderDays()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dateRangeSelector} ref={calendarRef}>
      {renderCalendar(currentDateLeft, true)}
      {renderCalendar(currentDateRight, false)}
    </div>
  );
};

export default DateRangeSelector;
