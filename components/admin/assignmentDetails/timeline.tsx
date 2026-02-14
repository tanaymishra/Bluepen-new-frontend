"use client";
import React, { useState, useEffect, useRef } from "react";
import css from "@/styles/admin/assignmentDetails.module.scss";
import OptionsModal from "@/components/admin/optionsModal/optionsModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useToast } from "@/context/toastContext";
import { useAuth } from "@/authentication/authentication";

interface Status {
  label: string;
  state: "done" | "ongoing" | "pending";
  date: string;
}

interface TimelineProps {
  statuses: Status[];
  initialStatusIndex: number;
  assignmentId: number;
  onUpdateStatus?: () => Promise<void> | void;
  isLoading?: boolean;
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  setCurrentStatusIndex: React.Dispatch<React.SetStateAction<number>>;
  isResit?: boolean;
  isLost?: boolean;
  setIsResit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLost: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUpdatedAssignmentDetails: (force?: boolean) => Promise<void>;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen?: boolean;
  assignedFreelancerData: any;
  fetchAssignmentDetails: any;
  marksAdded?: boolean;
  marksCategory?: string;
  editable?: boolean;
}

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

const Timeline: React.FC<TimelineProps> = ({
  statuses,
  initialStatusIndex,
  assignmentId,
  onUpdateStatus,
  isLoading = false,
  setStatuses,
  setCurrentStatusIndex,
  isResit,
  isLost,
  setIsResit,
  setIsLost,
  fetchUpdatedAssignmentDetails,
  setIsModalOpen,
  isModalOpen,
  assignedFreelancerData,
  fetchAssignmentDetails,
  marksAdded = false,
  marksCategory,
  editable = true,
}) => {
  const currentStatusIndex = initialStatusIndex;
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { showToast } = useToast();

  // Generic API call method
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

      // Check if the API call was successful based on the 'status' in response body

      if (result.ok) {
        throw new Error(result.message || "api call failed");
      }

      return result;
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (localLoading || isLoading || isLost) return;

    try {
      setLocalLoading(true);

      if (isResit && marksCategory !== 'Fail') {
        await makeApiCall("/team/markAssignmentCompleted", {
          assignmentId: assignmentId,
        });
      } else {
        switch (currentStatusIndex) {
          case 4:
            await handleMarksNotReceived();
            break;
          case 5:
            await handleCompleted();
            break;
          case 6:
            await handleReviewReceived();
            break;
          default:
            if (onUpdateStatus) {
              await onUpdateStatus();
            }
        }
      }

      // Set animation
      setAnimateIndex(currentStatusIndex + 1);
      
      // Single fetch call for updated details
      await fetchUpdatedAssignmentDetails(true);
      
      showToast(`${statuses[currentStatusIndex].label}`, "success");
    } catch (error) {
      console.error("Status update failed:", error);
      showToast("Failed to update status. Please try again.", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  // API call for Marks Not Received
  const handleMarksNotReceived = async () => {
    await makeApiCall("/team/completedMarksNotReceived", {
      assignmentId: assignmentId,
    });
  };

  // API call for Completed
  const handleCompleted = async () => {
    await makeApiCall("/team/markAssignmentCompleted", {
      assignmentId: assignmentId,
    });
  }

  // API call for Review Received
  const handleReviewReceived = async () => {
    await makeApiCall("/team/reviewReceived", {
      assignmentId: assignmentId,
    });
  };

  // Handle Resit
  const handleResit = async () => {
    try {
      setLocalLoading(true);

      await makeApiCall("/team/assignmentResit", {
        assignmentId: assignmentId,
      });

      setCurrentStatusIndex(0);
      setModalOpen(false);

      // Update the isResit state in parent
      setIsResit(true);

      // Clear isLost if previously set
      setIsLost(false);

      // Success toast
      showToast("Assignment set to Failed", "success");

      await fetchUpdatedAssignmentDetails(true);
    } catch (error) {
      console.error("Resit failed:", error);
      showToast("Failed to set assignment to Fail.", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  // Handle Lost
  const handleLost = async () => {
    try {
      setLocalLoading(true);

      await makeApiCall("/team/assignmentLost", {
        assignmentId: assignmentId,
      });

      setCurrentStatusIndex(0);
      setModalOpen(false);

      // Update the isLost state in parent
      setIsLost(true);

      // Clear isResit if previously set
      setIsResit(false);

      // Success toast
      showToast("Assignment set to Lost", "success");
    } catch (error) {
      console.error("Lost failed:", error);
      showToast("Failed to set assignment to Lost.", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  // ---------------to reset the freelancers assigned to the assignment -----------------
  const resetFreelancer = async (freelancerId: number) => {
    try {
      const response = await fetch(`${baseURL}/team/unassignFreelancer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          freelancerID: freelancerId,
        }),
      });

      if (!response.ok) {
        showToast("failed to unassign freelancer", "error");
        return false;
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Reset Timeline
  const handleReset = async () => {
    try {
      setLocalLoading(true);

      await makeApiCall("/team/assignmentReset", {
        assignmentId: assignmentId,
      });
      if (assignedFreelancerData.length > 0) {
        assignedFreelancerData.forEach(
          (item: { id: number }, index: number) => {
            resetFreelancer(item.id);
          }
        );
      }
      fetchAssignmentDetails();

      showToast("Timeline reset successfully", "success");
    } catch (error) {
      console.error("Reset failed:", error);
      showToast("Failed to reset timeline", "error");
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (animateIndex !== null) {
      const timer = setTimeout(() => {
        setAnimateIndex(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animateIndex]);

  return (
    <div className={css.timeline}>
      <div className={css.timelineControls}>
        <div className={css.timelineHeadline}>status</div>
        <div className={css.timelineDiv}>
          {!isLost && editable &&
            (currentStatusIndex === 4 || (currentStatusIndex === 5 && marksCategory !== "Fail" && marksAdded)|| currentStatusIndex === 6) && (
              <div
                onClick={handleUpdate}
                className={css.timelineButton}
                style={{
                  display:currentStatusIndex === statuses.length ? "none" : "block",
                  opacity: localLoading || isLoading ? 0.5 : 1,
                  cursor: localLoading || isLoading ? "not-allowed" : "pointer",
                }}
              >
                {localLoading ? "Updating..." : "Update"}
              </div>
            )}
          
          {!isLost && editable &&
            (currentStatusIndex === 5 && marksCategory === "Fail" && marksAdded && !isResit) && (
              <div
                onClick={handleUpdate}
                className={css.timelineButton}
                style={{
                  display: currentStatusIndex === statuses.length ? "none" : "block",
                  opacity: localLoading || isLoading ? 0.5 : 1,
                  cursor: localLoading || isLoading ? "not-allowed" : "pointer",
                }}
              >
                {localLoading ? "Updating..." : "Update"}
              </div>
            )}

          {!isResit && !isLost && editable &&(
            <div
              className={css.moreBtn}
              ref={moreBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(!modalOpen);
                if (setIsModalOpen) {
                  setIsModalOpen(!modalOpen);
                }
              }}
            >
              <div className={css.dot}></div>
              <div className={css.dot}></div>
              <div className={css.dot}></div>
            </div>
          )}
        </div>

        <OptionsModal
          isOpen={modalOpen}
          className={css.optionsModal}
          options={[
            {
              label: "Failed",
              onClick: handleResit,
              className: css.resit,
            },
            {
              label: "Lost",
              onClick: handleLost,
              className: css.lost,
            },
          ]}
          onClose={() => {
            setModalOpen(false);
            if (setIsModalOpen) {
              setIsModalOpen(!modalOpen); // Set opposite of current modal state
            }
          }}
          modalRef={modalRef as any}
          btnRef={moreBtnRef as any}
          itemStyle={{
            padding: "2px 4px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            textAlign: "center",
            zIndex: 100,
            width: "100%",
          }}
          itemClassName={css.modalItem}
        />
      </div>

      {statuses.map((status, index) => {
        const state = status.state;
        let date = status.date;

        const animateClass = animateIndex === index ? css.animateItem : "";

        // Don't render steps after current index if assignment is resit
        if (isResit && index > currentStatusIndex) {
          return null;
        }

        return (
          <div key={index} className={`${css.timelineItem} ${animateClass}`}>
            <div className={css.timelineIcon}>
              {isResit && index === currentStatusIndex ? (
                <div className={css.failedIcon}>
                  <img
                    src="/assets/admin/dashboard/calendar/cross.svg"
                    alt="failed"
                    className={css.crossIcon}
                  />
                </div>
              ) : (
                <>
                  {state === "done" && (
                    <img src="/assets/admin/assignments/doneTimeline.svg" alt="done" />
                  )}
                  {state === "ongoing" && (
                    <div className={css.timelineCircle}>{index + 1}</div>
                  )}
                  {state === "pending" && (
                    <img src="/assets/admin/assignments/pendingTimeline.svg" alt="pending" />
                  )}
                </>
              )}
            </div>
            <div className={css.timelineContent}>
              <div
                className={`${css.timelineLabel} ${isResit && index === currentStatusIndex ? css.failedLabel : ''
                  }`}
              >
                {isResit && index === currentStatusIndex ? 'FAILED' : status.label}
              </div>
              {!(isResit && index === currentStatusIndex) && (
                <div className={css.timelineDate}>{date}</div>
              )}
            </div>
            {index !== statuses.length - 1 && !(isResit && index === currentStatusIndex) && (
              <div className={css.timelineConnector}></div>
            )}
          </div>
        );
      })}
      {isLost && <div className={css.statusText}>Lost</div>}
      {!isResit && !isLost && editable && (
        <div onClick={handleReset} className={css.resetTimeline}>
          Reset timeline
        </div>
      )}
    </div>
  );
};

export default Timeline;
