import React, { useRef, useState, useCallback, memo } from "react";
import css from "@/styles/admin/assignmentDetails.module.scss";
import Image from "next/image";
import OptionsModal from "@/components/admin/optionsModal/optionsModal";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import { useToast } from "@/context/toastContext";
import { useAuth } from "@/authentication/authentication";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface ModalProps {
  marksObtained?: string;
  marksOutOf?: string;
  feedback?: string;
  onMarksObtainedChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMarksOutOfChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFeedbackChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave?: () => void;
  onClose?: () => void;
}

interface ContactMarksProps {
  studentDetails: any;
  marksDetails: any;
  fetchAssignmentDetails: () => void;
  assignmentNumber: string;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStatusIndex: any;
  onMarksUpdate?: () => Promise<void>;
  editable?: boolean;
}

const ModalComponent = memo(function ModalComponent({
  marksObtained,
  marksOutOf,
  feedback,
  onMarksObtainedChange,
  onMarksOutOfChange,
  onFeedbackChange,
  onSave,
  onClose,
}: ModalProps) {
  return (
    <div className={css.modalDiv} onClick={(e) => e.stopPropagation()}>
      <div className={css.marksModalHeader}>
        Write down the marks for the assignment
      </div>
      <div className={css.inputFieldContainer}>
        <div className={css.inputField}>
          <div className={css.inputLabel}>Marks Obtained:</div>
          <input
            type="text"
            className={css.inputBox}
            placeholder="Enter marks obtained"
            value={marksObtained}
            onChange={onMarksObtainedChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className={css.inputField}>
          <div className={css.inputLabel}>Marks Out of:</div>
          <input
            type="text"
            className={css.inputBox}
            placeholder="Enter marks out of"
            value={marksOutOf}
            onChange={onMarksOutOfChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className={css.inputField}>
          <div className={css.inputLabel}>Feedback:</div>
          <textarea
            placeholder="Write down the feedback"
            className={css.textArea}
            value={feedback}
            onChange={onFeedbackChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      <div className={css.btnRow}>
        <div className={css.marksBtn} onClick={onSave}>
          Save
        </div>
        <div className={css.closeBtnMarks} onClick={onClose}>
          Close
        </div>
      </div>
    </div>
  );
});

const ContactMarks: React.FC<ContactMarksProps> = ({
  studentDetails,
  marksDetails,
  fetchAssignmentDetails,
  assignmentNumber,
  setIsModalOpen,
  setCurrentStatusIndex,
  editable = true,
  onMarksUpdate,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [modalOpenMarks, setModalOpenMarks] = useState(false);
  const modalRefMarks = useRef<HTMLDivElement>(null);
  const moreBtnRefMarks = useRef<HTMLDivElement>(null);
  const [marksObtained, setMarksObtained] = useState("");
  const [marksOutOf, setMarksOutOf] = useState("");
  const [feedback, setFeedback] = useState("");
  const userToken = user?.token;
  const [isResetting, setIsResetting] = useState(false);

  const resetMarks = useCallback(async () => {
    setIsResetting(true);
    try {
      const response = await fetch(`${baseURL}/team/resetMarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ assignment_id: Number(assignmentNumber) }),
      });

      if (response.ok) {
        fetchAssignmentDetails();
        showToast("Marks reset successfully", "success");
        if (onMarksUpdate) {
          await onMarksUpdate(); // Call onMarksUpdate to refresh data
        }
        // Reset local state
        setMarksObtained("");
        setMarksOutOf("");
        setFeedback("");
      } else {
        const errorData = await response.json();
        console.error("Error in reseting marks:", errorData.message);
        showToast("Failed to reset marks", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to reset marks", "error");
    } finally {
      setIsResetting(false);
    }
  }, [assignmentNumber, userToken, showToast, onMarksUpdate]);

  const NotAvailable = () => {
    return <div className={css.notAvailable}>Not Available</div>;
  };

  const handleClose = useCallback(() => {
    setModalOpenMarks(false);
    if (setIsModalOpen) {
      setIsModalOpen(false);
    }
  }, [setIsModalOpen]);

  const addMarks = useCallback(async () => {
    if(marksObtained <= marksOutOf){
      return showToast('Marks obtained cannot be greater than maximum marks','error');
    }
    try {
      const response = await fetch(`${baseURL}/team/addMarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          assignment_id: Number(assignmentNumber),
          marks_obtained: marksObtained,
          marks_out_of: marksOutOf,
          feedback: feedback,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchAssignmentDetails();
        showToast(data.message, "success");
        setCurrentStatusIndex(6);
        handleClose();
        setMarksObtained("");
        setMarksOutOf("");
        setFeedback("");
        if (onMarksUpdate) {
          await onMarksUpdate();
        }
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    }
  }, [
    marksObtained,
    marksOutOf,
    feedback,
    assignmentNumber,
    user?.token,
    fetchAssignmentDetails,
    showToast,
    handleClose,
    onMarksUpdate,
  ]);

  const handleMarksObtainedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
        setMarksObtained(value);
      } else {
        showToast("Please enter numbers only for Marks Obtained.", "error");
      }
    },
    [showToast]
  );

  const handleMarksOutOfChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value)) {
        setMarksOutOf(value);
      } else {
        showToast("Please enter numbers only for Marks Out of.", "error");
      }
    },
    [showToast]
  );

  const handleFeedbackChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.stopPropagation();
      const value = e.target.value;
      const words = value.trim().split(/\s+/);
      if (words.length <= 250) {
        setFeedback(value);
      } else {
        const truncated = words.slice(0, 250).join(" ");
        setFeedback(truncated);
        showToast("Feedback cannot exceed 250 words.", "error");
      }
    },
    [showToast]
  );

  const handleOpenModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // If marks are already there, prefill
      if (marksDetails?.marksObtained) {
        setMarksObtained(marksDetails.marksObtained);
      } else {
        setMarksObtained("");
      }
      if (marksDetails?.marksOutOf) {
        setMarksOutOf(marksDetails.marksOutOf);
      } else {
        setMarksOutOf("");
      }
      if (marksDetails?.feedback) {
        setFeedback(String(marksDetails.feedback));
      } else {
        setFeedback("");
      }
      setModalOpenMarks(!modalOpenMarks);
      if (setIsModalOpen) {
        setIsModalOpen(!modalOpenMarks);
      }
    },
    [modalOpenMarks, marksDetails, setIsModalOpen]
  );

  return (
    <div className={css.contactMarks}>
      <div className={css.studentDetBox}>
        <div className={css.headerBox}>
          <div className={css.head}>Student Contact</div>
          {studentDetails?.is_select === `Select Student` && (
            <div className={css.selectStd}>
              <Image
                src="/assets/admin/assignments/selectCrown.svg"
                alt=""
                height={16}
                width={16}
              />
              <div className={css.selectTitle}>{`Select Account`}</div>
            </div>
          )}
        </div>

        <div className={css.studentDetails}>
          <div className={css.detailBox}>
            <div className={css.detailLabel}>{`Name`}</div>
            <div className={css.detailValue}>
              {studentDetails.firstname
                ? studentDetails.firstname + " " + studentDetails.lastname
                : NotAvailable()}
            </div>
          </div>

          <div className={css.detailBox}>
            <div className={css.detailLabel}>{`Email`}</div>
            <div className={css.detailValue}>
              {studentDetails.email ? (
                <a
                  href={`mailto:${studentDetails.email}`}
                  className={css.mailtoClass}
                >
                  {studentDetails.email}
                </a>
              ) : (
                NotAvailable()
              )}
            </div>
          </div>

          <div className={css.detailBox}>
            <div className={css.detailLabel}>{`Phone`}</div>
            <div className={css.detailValue}>
              {studentDetails.number ? (
                <a
                  href={`tel:${studentDetails.country_code}${studentDetails.number}`}
                  className={css.mailtoClass}
                >
                  +{studentDetails.country_code} {studentDetails.number}
                </a>
              ) : (
                NotAvailable()
              )}
            </div>
          </div>

          <div className={css.detailBox}>
            <div className={css.detailLabel}>{`Whatsapp`}</div>
            <div className={css.detailValue}>
              {studentDetails.number ? (
                <a
                  href={`https://wa.me/${studentDetails.country_code}${studentDetails.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={css.mailtoClass}
                >
                  +{studentDetails.country_code} {studentDetails.number}
                </a>
              ) : (
                NotAvailable()
              )}
            </div>
          </div>
        </div>

        <div className={css.iconBox}>
          <div className={css.absBox}>
            <div className={css.logoIcon}>
              <a href={`tel:${studentDetails.number}`}>
                <img src="/assets/admin/employee/phone.svg" alt="Phone" />
              </a>
            </div>
            <div className={css.logoIcon}>
              <a href={`mailto:${studentDetails.email}`}>
                <img src="/assets/admin/employee/email.svg" alt="Email" />
              </a>
            </div>
            <div className={css.logoIcon}>
              <a
                href={`https://wa.me/${studentDetails.number}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/admin/employee/whatsapp.svg" alt="Whatsapp" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={css.marksDetail}>
        <div className={css.marksHeaderBtn}>
          <div className={css.marksHeader}>{`Marks Details`}</div>
          <div className={css.btnRowsMarks}>
            {marksDetails?.marksObtained && editable && (
              <div
                className={css.resetBtn}
                onClick={!isResetting ? resetMarks : undefined}
                style={{
                  opacity: isResetting ? 0.6 : 1,
                  pointerEvents: isResetting ? "none" : "auto",
                }}
              >
                Reset
              </div>
            )}

            {editable && (
              <div
                className={css.marksBtn}
                ref={moreBtnRefMarks}
                onClick={handleOpenModal}
              >
                {marksDetails?.marksObtained ? "Update" : "Add Marks"}
              </div>
            )}
          </div>
          <OptionsModal
            isOpen={modalOpenMarks}
            className={css.marksModal}
            options={[
              {
                component: (
                  <ModalComponent
                    marksObtained={marksObtained}
                    marksOutOf={marksOutOf}
                    feedback={feedback}
                    onSave={addMarks}
                    onMarksObtainedChange={handleMarksObtainedChange}
                    onMarksOutOfChange={handleMarksOutOfChange}
                    onFeedbackChange={handleFeedbackChange}
                    onClose={() => {
                      setModalOpenMarks(false);
                      if (setIsModalOpen) {
                        setIsModalOpen(false);
                      }
                    }}
                  />
                ),
              },
            ]}
            onClose={() => {
              setModalOpenMarks(false);
              if (setIsModalOpen) {
                setIsModalOpen(false);
              }
            }}
            modalRef={modalRefMarks as any}
            btnRef={moreBtnRefMarks as any}
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
        <div className={css.marksDet}>
          <div className={css.rowContainer}>
            <div className={css.rowfield}>
              <div className={css.fieldName}>Marks obtained</div>
              <div className={css.fieldValue}>
                {marksDetails?.marksObtained
                  ? marksDetails?.marksObtained
                  : NotAvailable()}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Out of</div>
              <div className={css.fieldValue}>
                {marksDetails?.marksOutOf
                  ? marksDetails?.marksOutOf
                  : NotAvailable()}
              </div>
            </div>
          </div>

          <div className={css.rowContainer}>
            <div className={css.rowfield}>
              <div className={css.fieldName}>Marks Category</div>
              <div className={css.fieldValue}>
                {marksDetails?.marksStatus
                  ? marksDetails?.marksStatus
                  : NotAvailable()}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Added on</div>
              <div className={css.fieldValue}>
                {marksDetails?.marksAddedOn
                  ? formatDate(marksDetails?.marksAddedOn, "dd/mm/yyyy")
                  : NotAvailable()}
              </div>
            </div>
          </div>

          <div className={css.rowContainer}>
            <div className={css.rowfield}>
              <div className={css.fieldName}>Feedback</div>
              <div className={css.fieldValue}>
                {marksDetails?.feedback
                  ? marksDetails?.feedback
                  : NotAvailable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMarks;
