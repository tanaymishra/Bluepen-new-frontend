import React from "react";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import css from "@/styles/admin/marksHistory.module.scss";

interface MarksHistoryItem {
  marksObtained: number;
  marksOutOf: number;
  marksOutOf100: string;
  marksStatus: string;
  feedback: string;
  marksAddedOn: string;
  marksAddedBy: number;
  isActive: number;
}

interface MarksHistoryProps {
  marksHistory: MarksHistoryItem[];
}

const MarksHistory = ({ marksHistory }: MarksHistoryProps) => {
  if (!marksHistory || marksHistory.length === 0) {
    return null;
  }

  return (
    <div className={css.marksHistoryContainer}>
      <h3 className={css.historyTitle}>Marks History</h3>
      <div className={css.timeline}>
        {marksHistory.map((entry, index) => (
          <div key={index} className={css.timelineItem}>
            <div
              className={css.timelineDot}
              data-status={entry.marksStatus.toLowerCase()}
            />
            <div className={css.timelineContent}>
              <div className={css.header}>
                <span className={css.marks}>
                  {entry.marksObtained}/{entry.marksOutOf}
                </span>
                <span
                  className={`${css.status} ${
                    css[entry.marksStatus.toLowerCase()]
                  }`}
                >
                  {entry.marksStatus}
                </span>
                <span className={css.percentage}>{entry.marksOutOf100}%</span>
              </div>
              {entry.feedback && (
                <p className={css.feedback}>{entry.feedback}</p>
              )}
              <span className={css.date}>
                {formatDate(entry.marksAddedOn, "full")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarksHistory;
