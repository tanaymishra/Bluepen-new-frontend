import React, { useState } from "react";
import Calendar from "./calendar";
import styles from "@/styles/ui/calendar.module.scss";

interface RangeCalendarProps {
  currentDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (date: Date) => void;
}

const RangeCalendar: React.FC<RangeCalendarProps> = ({
  currentDate,
  startDate,
  endDate,
  onDateClick,
}) => {
  const handleDateChange = (date: Date) => {
    onDateClick(date);
  };

  return (
    <Calendar
      todaysDate={currentDate}
      onChange={handleDateChange}
      className={`${styles.calendar} ${
        startDate && endDate && currentDate >= startDate && currentDate <= endDate
          ? styles.selectedDay
          : ""
      }`}
    />
  );
};

export default RangeCalendar;