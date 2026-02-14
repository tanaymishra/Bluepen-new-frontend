import React, { useEffect, useState, useRef } from "react";
import { Calendar as CalendarIcon } from 'lucide-react';
import css from "../styles/dateCalendar.module.scss";
// import { Calendar as CalendarIcon } from 'lucide-react'
import Calendar from "./Calendar";
import { useIsClient } from "@/utils/useIsClient";

interface props {
  onChangeFunc: any;
  value: string;
  style?: any;
  title: string;
  isError?: boolean;
}

const DateCalendar: React.FC<props> = ({
  onChangeFunc,
  value,
  style = {},
  title,
  isError = false,
}) => {
  const [showStatus, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both the input container and the calendar
      const isOutsideInput = ref.current && !ref.current.contains(target);
      const isOutsideCalendar = calendarRef.current && !calendarRef.current.contains(target);

      if (isOutsideInput && isOutsideCalendar) {
        setShow(false);
        setIsFocused(false);
      }
    };

    if (showStatus) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatus]);

  const displayText = isClient
    ? value === ""
      ? `Select Date & Time`
      : value
    : "Loading...";

  return (
    <div
      className={`${css.contain} ${isFocused ? css.focused : ''} ${isError ? css.error : ''}`}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setShow((prev) => !prev);
        setIsFocused(true);
      }}
    >
      <div className={css.titleAndDate}>
        <div className={`${css.title} spartan-400 ${!value ? css.placeholder : ''}`}>
          {displayText}
        </div>
      </div>
      <CalendarIcon
        size={20}
        className={css.calendarIcon}
        style={{ marginLeft: 'auto', color: 'var(--primary)' }}
      />
      {showStatus && (
        <>
          <div className={css.backdrop} onClick={() => setShow(false)} />
          <div className={css.overlay} ref={calendarRef}>
            <Calendar setShow={setShow} onChange={(e) => onChangeFunc(e)} />
          </div>
        </>
      )}
    </div>
  );
};

export default DateCalendar;
