import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import styles from "@/styles/ui/calendar.module.scss";
import { useAuth } from "@/authentication/authentication";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface CalendarProps {
  todaysDate?: Date;
  onChange?: (date: Date) => void;
  allowPasteDate?: boolean;
  maxMonthsForward?: number;
  setShow?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  maxMonthsBackward?: number;
  calendarType?: "default" | "dob" | "doj" | "publicHolidays";
  disabledDates?: Date[];
  minDate?: Date | null;
  maxDays?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  onChange,
  allowPasteDate = false,
  maxMonthsForward = 12,
  setShow,
  className = "",
  maxMonthsBackward = 12 * 35,
  calendarType,
  disabledDates,
  todaysDate,
  minDate = null,
  maxDays,
}) => {
  const { user } = useAuth();

  const initializeDate = () => {
    if (calendarType === "dob") {
      return new Date(1999, 0, 1); // Set default date to January 1999
    }
    if (calendarType === "doj") {
      return new Date(2020, 0, 1); // Set default date to January 1999
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(initializeDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [publicHolidaysData, setPublicHolidaysData] = useState<Date[]>([]);
  const [calculatedMaxDate, setCalculatedMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(initializeDate());
  }, [calendarType]);

  useEffect(() => {
    if (onChange && selectedDate) {
      onChange(selectedDate);
      setShow && setShow((prev) => false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (calendarType === "publicHolidays" && user?.token) {
      fetchPublicHolidays();
    }
  }, [calendarType, user?.token]);

  const fetchPublicHolidays = async () => {
    try {
      const userToken = user?.token;
      const response = await fetch(`${baseURL}/team/publicHolidaysTable`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const publicHolidaysData = data.data.map(
          (item: any) => new Date(item.holiday_on)
        );

        setPublicHolidaysData(publicHolidaysData);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to calculate maxDate based on minDate and maxDays
  const calculateMaxDate = () => {
    if (!minDate || !maxDays) return null;

    let daysCount = 0;
    let maxDateCalc = new Date(minDate);
    while (daysCount < maxDays) {
      maxDateCalc.setDate(maxDateCalc.getDate() + 1);
      const day = maxDateCalc.getDay();
      const isSunday = day === 0;
      const isPublicHoliday = publicHolidaysData.some(
        (holiday) => holiday.toDateString() === maxDateCalc.toDateString()
      );
      if (!isSunday && !isPublicHoliday) {
        daysCount += 1;
      }
      // Prevent infinite loop in case maxDays is too large
      if (daysCount > maxDays + 10) break;
    }
    return maxDateCalc;
  };

  useEffect(() => {
    if (minDate && maxDays) {
      const calculated = calculateMaxDate();
      setCalculatedMaxDate(calculated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate, maxDays, publicHolidaysData]);

  const isDateDisabled = (date: Date) => {
    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
    const isPublicHoliday = publicHolidaysData.some(
      (holiday) => holiday.toDateString() === date.toDateString()
    );
    const isDisabledDate = disabledDates?.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );

    const isSunday = calendarType === "publicHolidays" && date.getDay() === 0;
    const isBeforeMinDate = minDate && date < minDate;
    const isAfterMaxDate = calculatedMaxDate && date > calculatedMaxDate;

    if (calendarType === "dob" || calendarType === "doj") {
      return isDisabledDate;
    }

    return isPastDate || isPublicHoliday || isDisabledDate || isSunday || isBeforeMinDate || isAfterMaxDate;
  };

  const handleDateChange = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedDate(date);
    }
  };

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
  const today = new Date();

  const changeMonth = (direction: number) => {
    setCurrentDate((prevDate) => {
      const newMonth = prevDate.getMonth() + direction;
      const newDate = new Date(prevDate.getFullYear(), newMonth, 1);

      const now = new Date();
      const maxDate = new Date(
        now.getFullYear(),
        now.getMonth() + maxMonthsForward,
        1
      );

      if (
        (calendarType !== "dob" && calendarType !== "doj") &&
        !allowPasteDate &&
        (newDate.getFullYear() < now.getFullYear() ||
          (newDate.getFullYear() === now.getFullYear() &&
            newDate.getMonth() < now.getMonth()))
      ) {
        return prevDate;
      }

      if (newDate > maxDate) {
        return prevDate;
      }

      return newDate;
    });
  };

  const changeYear = (direction: number) => {
    setCurrentDate((prevDate) => {
      const newYear = prevDate.getFullYear() + direction;
      const newDate = new Date(newYear, prevDate.getMonth(), 1);
      const now = new Date();
      const maxDate = new Date(
        now.getFullYear(),
        now.getMonth() + maxMonthsForward,
        1
      );

      if (
        (calendarType !== "dob" && calendarType !== "doj") &&
        !allowPasteDate &&
        newDate.getFullYear() < now.getFullYear()
      ) {
        return prevDate;
      }

      if (newDate > maxDate) {
        return prevDate;
      }

      return newDate;
    });
  };

  const selectDate = (day: number) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    handleDateChange(newSelectedDate);
  };

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
      const isPastDate =
        date < today && date.toDateString() !== today.toDateString();
      const isSunday = date.getDay() === 0;
      const isPreviousMonthDate =
        date < today &&
        currentDate.getMonth() < today.getMonth() &&
        currentDate.getFullYear() <= today.getFullYear();
      const isPublicHoliday = publicHolidaysData.some(
        (holiday) => holiday.toDateString() === date.toDateString()
      );

      days.push(
        <div
          key={day}
          className={`${styles.day}
          ${selectedDate?.getDate() === day ? styles.selectedDay : ""}
          ${isDateDisabled(date) ? styles.disabledDay : ""}
          ${isSunday ? styles.sunday : ""}
          ${isPublicHoliday ? styles.publicHoliday : ""}
          }
          ${
            (isPastDate || isPreviousMonthDate || isPublicHoliday) &&
            (calendarType !== "dob" && calendarType !== "doj")
              ? styles.disabledDay
              : ""
            }
          `}
          onClick={!isDateDisabled(date) ? () => selectDate(day) : undefined}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div
      className={`${styles.calendar} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.header}>
        <button onClick={() => changeYear(-1)} className={styles.navButton}>
          «
        </button>
        <button onClick={() => changeMonth(-1)} className={styles.navButton}>
          ‹
        </button>
        <div className={styles.currentMonth}>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </div>
        <button onClick={() => changeMonth(1)} className={styles.navButton}>
          ›
        </button>
        <button onClick={() => changeYear(1)} className={styles.navButton}>
          »
        </button>
      </div>
      <div className={styles.daysOfWeek}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayOfWeek}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.days}>{renderDays()}</div>
    </div>
  );
};

export default Calendar;