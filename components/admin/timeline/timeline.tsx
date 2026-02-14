"use client";
import React, { useState, useEffect } from "react";
import css from "@/styles/admin/components/timeline.module.scss";
import { useAuth } from "@/authentication/authentication";
import { useToast } from "@/context/toastContext";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface Status {
  label: string;
  state: "done" | "ongoing" | "pending";
  date: string;
}

interface TimelineProps {
  statusesArray: any;
  freelancerId: number | null;
  isLoading?: boolean;
  onUpdateStatus?: () => Promise<void> | void;
  fetchUpdatedAssignmentDetails: () => Promise<void>;
}

const Timeline: React.FC<TimelineProps> = ({
  statusesArray,
  freelancerId,
  isLoading,
  onUpdateStatus,
  fetchUpdatedAssignmentDetails,
}) => {
  const statusFields = [
    { key: "form_filled", label: "Form Filled", timeKey: "form_filled_time" },
    {
      key: "interview_conducted",
      label: "Interview Conducted",
      timeKey: "interview_conducted_time",
    },
    {
      key: "agreement_sent",
      label: "Agreement Sent",
      timeKey: "agreement_sent_time",
    },
    {
      key: "agreement_received",
      label: "Agreement Received",
      timeKey: "agreement_received_time",
    },
    { key: "is_approved", label: "Approved", timeKey: "is_approved_time" },
  ];

  const [currentStatusIndex, setCurrentStatusIndex] = useState(1);
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [statusArr, setStatusArr] = useState<Status[]>([]);

  const { user } = useAuth();
  const { showToast } = useToast();

  const constructStatuses = (statusDetails: any) => {
    const statuses: Status[] = [];
    let currentIndex = -1;

    statusFields.forEach((statusField, index) => {
      const statusValue = statusDetails[statusField.key];
      const dateValue = statusDetails[statusField.timeKey];
      let state: "done" | "ongoing" | "pending" = "pending";
      let date = "yet to accomplish";

      if (statusValue === 1) {
        state = "done";
        date =
          formatDate(dateValue, "dd MMM yyyy, hh:mm AM/PM") ||
          "Date not available";
        currentIndex = index;
      } else if (currentIndex + 1 === index) {
        state = "ongoing";
        date = "in-progress";
      }

      statuses.push({
        label: statusField.label,
        state,
        date,
      });
    });

    return { statuses, currentStatusIndex: currentIndex + 1 };
  };

  useEffect(() => {
    const { statuses, currentStatusIndex: newStatusIndex } =
      constructStatuses(statusesArray);
    setStatusArr(statuses);
    setCurrentStatusIndex(newStatusIndex);
  }, [statusesArray]);

  useEffect(() => {
    if (animateIndex !== null) {
      const timer = setTimeout(() => {
        setAnimateIndex(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animateIndex]);

  const makeApiCall = async (endpoint: string, body: any) => {
    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.status !== 200) {
        throw new Error(result.message || "API call failed");
      }

      return result;
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  };

  const handleReset = async () => {
    await makeApiCall("/team/resetStatus", {
      freelancer_id: freelancerId,
    });
    await fetchUpdatedAssignmentDetails();
  };

  const handleInterviewConducted = async () => {
    await makeApiCall("/team/interviewConducted", {
      freelancer_id: freelancerId,
    });
  };

  const handleAgreementSent = async () => {
    await makeApiCall("/team/agreementSent", {
      freelancer_id: freelancerId,
    });
  };

  const handleAgreementReceived = async () => {
    await makeApiCall("/team/agreementReceived", {
      freelancer_id: freelancerId,
    });
  };

  const handleApprove = async () => {
    await makeApiCall("/team/freelancerApprove", {
      freelancer_id: freelancerId,
    });
  };

  const handleUpdate = async () => {
    if (localLoading || isLoading) return;

    try {
      setLocalLoading(true);

      switch (currentStatusIndex) {
        case 1:
          await handleInterviewConducted();
          break;
        case 2:
          await handleAgreementSent();
          break;
        case 3:
          await handleAgreementReceived();
          break;
        case 4:
          await handleApprove();
          break;
        default:
          if (onUpdateStatus) {
            await onUpdateStatus();
          }
      }

      setAnimateIndex(currentStatusIndex);
      await fetchUpdatedAssignmentDetails();

      showToast(
        `${statusArr[currentStatusIndex]?.label || "Status"} updated`,
        "success"
      );
    } catch (error) {
      console.error("Status update failed:", error);
      showToast("Failed to update status. Please try again.", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className={css.timeline}>
      <div className={css.timelineControls}>
        <div className={css.timelineHeadline}>Status</div>
        {(user?.role === "Admin" || user?.role === "HR") && (
          <div
            onClick={handleUpdate}
            className={css.timelineButton}
            style={{
              display:
                currentStatusIndex >= statusArr.length ? "none" : "block",
              opacity: localLoading || isLoading ? 0.5 : 1,
              cursor: localLoading || isLoading ? "not-allowed" : "pointer",
            }}
          >
            {localLoading ? "Updating..." : "Update"}
          </div>
        )}
      </div>

      {statusArr.map((status, index) => {
        const state = status.state;
        const date = status.date;

        const animateClass = animateIndex === index ? css.animateItem : "";

        return (
          <div key={index} className={`${css.timelineItem} ${animateClass}`}>
            <div className={css.timelineIcon}>
              {state === "done" && (
                <img
                  src="/assets/admin/assignments/doneTimeline.svg"
                  alt="done"
                />
              )}
              {state === "ongoing" && (
                <div className={css.timelineCircle}>{index + 1}</div>
              )}
              {state === "pending" && (
                <img
                  src="/assets/admin/assignments/pendingTimeline.svg"
                  alt="pending"
                />
              )}
            </div>
            <div className={css.timelineContent}>
              <div className={css.timelineLabel}>{status.label}</div>
              <div className={css.timelineDate}>{date}</div>
            </div>
            {index !== statusArr.length - 1 && (
              <div className={css.timelineConnector}></div>
            )}
          </div>
        );
      })}
      {(user?.role === "Admin" || user?.role === "HR") && (
        <div onClick={handleReset} className={css.resetTimeline}>
          Reset Timeline
        </div>
      )}
    </div>
  );
};

export default Timeline;
