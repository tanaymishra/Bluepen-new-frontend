"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import css from "@/styles/admin/dashboard.module.scss";
import OptionsModal from "@/components/admin/optionsModal/optionsModal";

interface DeadlineDisplayerProps {
  deadlines: { [key: string]: number };
}

type TooltipProps = {
  count: number;
  date: string;
  position: { x: number; y: number };
};

const Tooltip = ({ count, date, position }: TooltipProps) => (
  <div
    className={css.tooltip}
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }}
  >
    {date}: {count} Assignment{count !== 1 ? "s" : ""}
  </div>
);

const Circle = () => {
  const day = 0;
  const dayOne = 1;
  const dayTwo = 2;
  const dayThree = 3;

  const getCircleColor = (assignments: number) => {
    if (assignments === 1) return `${css.oneAssignment} ${css.dateCircle}`;
    if (assignments === 2) return `${css.twoAssignments} ${css.dateCircle}`;
    if (assignments > 2) return `${css.moreAssignments} ${css.dateCircle}`;
    return css.default;
  };

  return (
    <div className={css.legendCircle}>
      <div className={css.circleRow}>
        <div className={`${css.circle} ${getCircleColor(day)}`}></div>
        <div className={css.circleText}>0 Assignments</div>
      </div>
      <div className={css.circleRow}>
        <div className={`${css.circle} ${getCircleColor(dayOne)}`}></div>
        <div className={css.circleText}>1 Assignments</div>
      </div>
      <div className={css.circleRow}>
        <div className={`${css.circle} ${getCircleColor(dayTwo)}`}></div>
        <div className={css.circleText}>2 Assignments</div>
      </div>
      <div className={css.circleRow}>
        <div className={`${css.circle} ${getCircleColor(dayThree)}`}></div>
        <div className={css.circleText}>3+ Assignments</div>
      </div>
    </div>
  );
};

const DeadlineDisplayer = ({ deadlines }: DeadlineDisplayerProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [modalOpenOp, setModalOpenOp] = useState(false);

  const modalRefOp = useRef<HTMLDivElement>(null);
  const moreBtnRefOp = useRef<HTMLDivElement>(null);

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const getCircleColor = (assignments: number) => {
    if (assignments === 1) return `${css.oneAssignment} ${css.dateCircle}`;
    if (assignments === 2) return `${css.twoAssignments} ${css.dateCircle}`;
    if (assignments > 2) return `${css.moreAssignments} ${css.dateCircle}`;
    return css.default;
  };

  const totalAssignments = Object.values(deadlines || {}).reduce(
    (acc: number, curr: number) => acc + curr,
    0
  );

  return (
    <div className={css.deadlineDisplayer}>
      <div className={css.titleNoAssign}>
        <div className={css.titleRow}>
          <div className={css.titleBox}>{currentMonthName}</div>
          <div
            className={css.moreOptions}
            ref={moreBtnRefOp}
            onClick={(e) => {
              e.stopPropagation();
              setModalOpenOp(!modalOpenOp);
            }}
          >
            <div className={css.dot}></div>
            <div className={css.dot}></div>
            <div className={css.dot}></div>
          </div>
          <OptionsModal
            isOpen={modalOpenOp}
            className={css.optionsModal}
            options={[{ component: <Circle /> }]}
            onClose={() => setModalOpenOp(false)}
            modalRef={modalRefOp as any}
            btnRef={moreBtnRefOp as any}
            itemStyle={{
              padding: "2px 4px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              zIndex: 100,
              width: "100%",
            }}
            itemClassName={css.modalItem}
          />
        </div>

        <div className={css.noAssign}>
          <div className={css.num}>{totalAssignments}</div>
          <div className={css.assignTitle}>Assignments</div>
        </div>
      </div>

      <div className={css.deadlineCal}>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateKey = `${String(day).padStart(2, "0")}-${String(
            currentMonth + 1
          ).padStart(2, "0")}-${currentYear}`;
          const deadlineCount = deadlines?.[dateKey] || 0;

          const handleMouseEnter = (e: React.MouseEvent) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({
              x: rect.left,
              y: rect.bottom + 5,
            });
            setHoveredDate(dateKey);
            setShowTooltip(true);
          };

          return (
            <div
              key={day}
              className={`${css.circle} ${getCircleColor(deadlineCount)}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  handleMouseEnter(e);
                  setTimeout(() => setShowTooltip(false), 2000);
                }
              }}
            >
              {day}
              {showTooltip && hoveredDate === dateKey && (
                <Tooltip
                  count={deadlineCount}
                  position={tooltipPosition}
                  date={dateKey}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeadlineDisplayer;
